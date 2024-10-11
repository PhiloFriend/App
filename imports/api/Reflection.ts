// reflection.ts

import { Meteor } from "meteor/meteor";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { getConfig } from "../config";
import OpenAI from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, storeImage } from "../services/aws/s3";
import { openai } from "../services/openai/client";
import { Voice } from "../services/openai/client";

import { chatModel, reflectionPrompt } from "../services/langchain";

// @ts-ignore
import { Log } from "meteor/logging";

import { ReflectionResult } from "./reflection/types";
import { ReflectionCollection } from "./reflection/collection";
import { getImagePrompt } from "../services/openai/prompts/ImagePrompt";
import { generateDallE3Image } from "../services/openai";
import { retryOperation } from "../utils/retry";
import { generateSpeech } from "../services/openai/client";
import { storeAudio } from "../services/aws/s3";

const config = getConfig();
const apiKey = config.openAiKey;

const voices: Voice[] = ["onyx"];

function getRandomVoice(): Voice {
  const randomIndex = Math.floor(Math.random() * voices.length);
  return voices[randomIndex];
}

async function generateImage(
  reflectionResult: ReflectionResult
): Promise<string | null> {
  Log("Generating image for reflection");
  const imagePrompt = getImagePrompt(reflectionResult);

  // Moderation check
  const moderationResponse = await openai.moderations.create({
    input: imagePrompt,
  });

  const moderationResult = moderationResponse.results[0];

  if (moderationResult.flagged) {
    Log.warning(
      "Image prompt was flagged by moderation API. Skipping image generation."
    );
    return null;
  } else {
    return await retryOperation(async () => {
      const generatingTime = new Date();
      const imageData = await generateDallE3Image(imagePrompt);
      Log(
        `generated image in ${new Date().getTime() - generatingTime.getTime()}`
      );
      if (imageData) {
        const storingTime = new Date();
        const storedImage = storeImage(imageData);
        Log(`Stored image in ${new Date().getTime() - storingTime.getTime()}`);
        return storedImage;
      } else {
        Log.error("No image data received");
        throw new Error("No image data received");
      }
    });
  }
}

async function generateReflectionResult(
  reflectionId: string,
  reflectionText: string,
  reflectionType: string
): Promise<void> {
  if (Meteor.isServer) {
    Log(`Starting generateReflectionResult for type: ${reflectionType}`);
    Log("Reflection text:", reflectionText);

    const updateStatus = async (status: string) => {
      await ReflectionCollection.updateAsync(reflectionId, {
        $set: { status, updatedAt: new Date() }
      });
    };

    try {
      await updateStatus("Generating Reflection");
      const reflectionPromise = generateReflection(reflectionText, reflectionType);

      await updateStatus("Generating Image");
      // @ts-ignore
      const imagePromise = generateImage(await reflectionPromise);

      await updateStatus("Generating Audio");
      const audioPromise = generateReflectionAudio(reflectionId, await reflectionPromise);

      const [reflection, imageUrl, audioUrls] = await Promise.all([reflectionPromise, imagePromise, audioPromise]);

      await updateStatus("Storing Results");
      await ReflectionCollection.updateAsync(reflectionId, {
        $set: {
          // @ts-ignore
          result: {
            ...reflection,
            image: imageUrl,
            ...audioUrls
          },
          status: "Completed",
          updatedAt: new Date()
        }
      });

      Log("Reflection result generation completed");
    } catch (error) {
      Log.error(`Error in generateReflectionResult for ${reflectionId}:`, error);
      await updateStatus("Error: Generation Failed");
      throw new Meteor.Error("reflection-generation-failed", "Failed to generate reflection result.");
    }
  } else {
    throw new Error("Server-side execution required");
  }
}

async function generateReflection(
  reflectionText: string,
  reflectionType: string
): Promise<Partial<ReflectionResult>> {
  Log("Generating reflection");
  const reflectionChain = reflectionPrompt
    .pipe(chatModel)
    .pipe(new StringOutputParser());

  return await retryOperation(async () => {
    Log("Invoking reflection chain");
    const reflectionResult = await reflectionChain.invoke({
      reflectionText,
      reflectionType,
    });
    Log("Raw reflection result:", reflectionResult);

    const parsedReflection = parseJsonResponse(reflectionResult);
    Log("Parsed reflection:", JSON.stringify(parsedReflection, null, 2));
    return parsedReflection;
  });
}

function parseJsonResponse(input: string): any {
  try {
    const jsonStartIndex = input.indexOf("{");
    const jsonEndIndex = input.lastIndexOf("}") + 1;
    const jsonString = input.slice(jsonStartIndex, jsonEndIndex);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Failed to parse JSON response");
  }
}

async function generateAndStoreAudio(
  text: string,
  fileName: string,
  voice: Voice
): Promise<string> {
  Log.info(`Starting audio generation for: ${fileName}`);
  return await retryOperation(async () => {
    try {
      Log.info(`Generating speech for: ${fileName} with voice: ${voice}`);
      let generationTime = new Date();
      const audioBuffer = await generateSpeech(text, voice);
      Log.info(
        `Speech generated successfully for: ${fileName} in ${
          new Date().getTime() - generationTime.getTime()
        }ms`
      );

      const storingTime = new Date();
      Log.info(`Storing audio file: ${fileName}`);
      const audioUrl = await storeAudio(audioBuffer, fileName);
      Log.info(
        `Audio file stored successfully: ${fileName} in ${
          new Date().getTime() - storingTime.getTime()
        }ms`
      );

      return audioUrl;
    } catch (error) {
      Log.error(`Error in generateAndStoreAudio for ${fileName}:`, error);
      throw error;
    }
  });
}

async function generateReflectionAudio(
  reflectionId: string,
  result: Partial<ReflectionResult>
): Promise<Partial<ReflectionResult>> {
  Log.info(`Starting audio generation for reflection: ${reflectionId}`);

  const selectedVoice = getRandomVoice();
  Log.info(`Selected voice for reflection ${reflectionId}: ${selectedVoice}`);

  const audioPromises = [
    { key: "quoteAudio", text: result.quote },
    { key: "reflectionAudio", text: result.reflection },
    { key: "storyAudio", text: result.story },
    { key: "applicationAudio", text: result.application },
    { key: "sharableCaptionAudio", text: result.sharableCaption }
  ].map(async ({ key, text }) => {
    if (text) {
      const audioUrl = await generateAndStoreAudio(text, `${reflectionId}-${key}.mp3`, selectedVoice);
      return { [key]: audioUrl };
    }
    return {};
  });

  const audioResults = await Promise.all(audioPromises);
  const audioUrls = Object.assign({}, ...audioResults);

  Log.info(`Completed audio generation for reflection: ${reflectionId}`);
  return audioUrls;
}

Meteor.methods({
  async "reflection.create"(reflectionText: string, reflectionType: string) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "You must be logged in to create a reflection.");
    }

    if (!reflectionText || !reflectionType) {
      throw new Meteor.Error("invalid-parameters", "Reflection text and type are required.");
    }

    try {
      await Meteor.call("useCredit");

      const reflectionId = await ReflectionCollection.insertAsync({
        reflectionText,
        reflectionType,
        owner: this.userId,
        status: "Initializing",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (Meteor.isServer) {
        // Start the generation process asynchronously
        generateReflectionResult(reflectionId, reflectionText, reflectionType).catch(error => {
          Log.error(`Error in reflection generation process: ${error}`);
        });
      }

      return reflectionId;
    } catch (error) {
      // @ts-ignore
      if (error.error === "insufficient-credit") {
        throw new Meteor.Error("insufficient-credit", "Not enough credit to create a reflection.");
      }
      throw error;
    }
  },

  async "reflection.regenerateImage"(reflectionId: string) {
    if (!this.userId) {
      throw new Meteor.Error(
        "not-authorized",
        "You must be logged in to regenerate an image."
      );
    }

    const reflection = await ReflectionCollection.findOneAsync(reflectionId);
    if (!reflection) {
      throw new Meteor.Error("not-found", "Reflection not found.");
    }

    if (reflection.owner !== this.userId) {
      throw new Meteor.Error(
        "not-authorized",
        "You can only regenerate images for your own reflections."
      );
    }

    try {
      // Use a credit
      await Meteor.call("useCredit");

      if (Meteor.isServer && reflection.result) {
        const newImageUrl = await generateImage(reflection.result);
        await ReflectionCollection.updateAsync(reflectionId, {
          $set: {
            "result.image": newImageUrl,
            updatedAt: new Date(),
          },
        });
      }

      return true;
    } catch (error) {
      // @ts-ignore
      if (error.error === "insufficient-credit") {
        throw new Meteor.Error(
          "insufficient-credit",
          "Not enough credit to regenerate the image."
        );
      }
      throw error;
    }
  },
});