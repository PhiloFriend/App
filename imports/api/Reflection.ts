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

import { chatModel, reflectionPrompt } from "../services/langchain";

// @ts-ignore
import { Log } from "meteor/logging";

import { ReflectionResult } from "./reflection/types";
import { ReflectionCollection } from "./reflection/collection";
import { getImagePrompt } from "../services/openai/prompts/ImagePrompt";
import { generateDallE3Image } from "../services/openai";
import { retryOperation } from "../utils";

const config = getConfig();
const apiKey = config.openAiKey;

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
      const imageData = await generateDallE3Image(imagePrompt);
      if (imageData) {
        return storeImage(imageData);
      } else {
        Log.error("No image data received");
        throw new Error("No image data received");
      }
    });
  }
}

// The generateReflectionResult function as defined above
async function generateReflectionResult(
  reflectionText: string,
  reflectionType: string
): Promise<ReflectionResult> {
  if (Meteor.isServer) {
    Log(`Starting generateReflectionResult for type: ${reflectionType}`);
    Log("Reflection text:", reflectionText);

    async function generateReflection(
      reflectionText: string,
      reflectionType: string
    ): Promise<ReflectionResult> {
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
        console.log(
          "Parsed reflection:",
          JSON.stringify(parsedReflection, null, 2)
        );
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

    // Generate reflection result
    const reflectionResult = await generateReflection(
      reflectionText,
      reflectionType
    );

    // Generate image and get the URL
    const imageUrl = await generateImage(reflectionResult);
    reflectionResult.image = imageUrl;

    console.log(
      "Final reflection result:",
      JSON.stringify(reflectionResult, null, 2)
    );

    // Return the final result
    return reflectionResult;
  } else {
    throw new Error("Server-side execution required");
  }
}

Meteor.methods({
  async "reflection.create"(reflectionText: string, reflectionType: string) {
    if (!this.userId) {
      throw new Meteor.Error(
        "not-authorized",
        "You must be logged in to create a reflection."
      );
    }

    // Validate inputs if necessary
    if (!reflectionText || !reflectionType) {
      throw new Meteor.Error(
        "invalid-parameters",
        "Reflection text and type are required."
      );
    }

    try {
      // Use a credit
      await Meteor.call("useCredit");

      // Insert a new reflection document into the collection
      const reflectionId = await ReflectionCollection.insertAsync({
        reflectionText,
        reflectionType,
        owner: this.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (Meteor.isServer) {
        try {
          // Generate the reflection result
          const result = await generateReflectionResult(
            reflectionText,
            reflectionType
          );

          // Update the reflection document with the result
          await ReflectionCollection.updateAsync(reflectionId, {
            $set: {
              result,
              updatedAt: new Date(),
            },
          });
        } catch (error) {
          console.error("Error generating reflection result:", error);
          throw new Meteor.Error(
            "reflection-generation-failed",
            "Failed to generate reflection result."
          );
        }
      }

      return reflectionId;
    } catch (error) {
      // @ts-ignore
      if (error.error === "insufficient-credit") {
        throw new Meteor.Error(
          "insufficient-credit",
          "Not enough credit to create a reflection."
        );
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

