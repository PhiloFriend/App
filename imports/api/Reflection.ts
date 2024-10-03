// reflection.ts

import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { getConfig } from "../config";
import OpenAI from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const config = getConfig();
const apiKey = config.openAiKey;

export interface ReflectionResult {
  quote: string;
  story: string;
  reflection: string;
  application: string;
  sharableCaption: string;
  image: string | null;
}

export interface Reflection {
  _id?: string;
  owner: string;
  reflectionText: string;
  reflectionType: string;
  result?: ReflectionResult;
  createdAt: Date;
  updatedAt: Date;
}

export const ReflectionCollection = new Mongo.Collection<Reflection>(
  "reflection"
);

// The generateReflectionResult function as defined above
async function generateReflectionResult(
  reflectionText: string,
  reflectionType: string
): Promise<ReflectionResult> {
  if (Meteor.isServer) {
    console.log(
      `Starting generateReflectionResult for type: ${reflectionType}`
    );
    console.log("Reflection text:", reflectionText);

    const model = new ChatOpenAI({
      model: "gpt-4o",
      apiKey,
    });

    async function retryOperation<T>(
      operation: () => Promise<T>,
      maxRetries: number = 5,
      baseDelay: number = 1000
    ): Promise<T> {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);

          if (attempt === maxRetries - 1) {
            throw new Error(`Operation failed after ${maxRetries} attempts`);
          }

          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      throw new Error("Unexpected error in retryOperation");
    }

    async function generateReflection(
      reflectionText: string,
      reflectionType: string
    ): Promise<ReflectionResult> {
      console.log("Generating reflection");
      const reflectionPrompt = ChatPromptTemplate.fromTemplate(`
        This is the emotional reflection of a user:
            
        {reflectionText}            
            
        I want you to first give me a proper paragraph that describes the user reflection in a wise way ( but easily understandable ), give me a quote, a story and then apply it to the user reflection to give him wisdom also provide a short paragraph which user can share in social media which combine his reflection and the gained wisdom from the story , application and quote, 
            

        Sharable caption must not seem that is getting written by an AI, it should be more like a very wise and smart person telling something wise and catchy according to his challenge and philosophical solution, put quote in the start of the caption then smartly combine it with the challenge and solution

        While providing story and wisdom make sure to it will target all of the reflected emotions and challenges. 

        Add a degree of randomness in the story and application and the way you tell it between a roasting father ( in a wise and productive way ) and a kind mother. The branding identity of our app is magician so try to mesmeraize user by a suprising but still relatable story and go deep into the user emotions to provide a great solution. Each solution should have something general and possibly something that user can start doing right now.  
        Magician is an archtype not literally magician, it's a philosopher magician
            

        Please use a tone that is warm, empathetic, and wise, blending a touch of humor where appropriate.

        Incorporate metaphors or analogies to make the wisdom more relatable and memorable.

        Ensure that the story and wisdom directly relate to the user's specific emotions and challenges mentioned in the reflection

        Keep each section concise, with no more than 3-4 sentences per section, to maintain the user's engagement


        Subtly weave in elements of magic or wonder to align with our app's magician branding, enchanting the user with insightful wisdom

        Provide practical steps or suggestions that the user can implement immediately to address their challenges

        Use unique quotes and stories that are not overly common, to surprise and delight the user

        Alternate between a tone that is playfully challenging (like a wise, teasing father) and one that is nurturing and supportive (like a kind, understanding mother).

        **Philosophies and Psychologies Map:**

### **Happiness and Joy**
- **Philosophies:** Epicureanism, Utilitarianism, Virtue Ethics, Humanism
- **Psychologies:** Positive Psychology, Humanistic Psychology, Flow Theory
- **Applications:** Encourage activities that promote flow and engagement; suggest practices to cultivate gratitude and positive emotions.

### **Sadness and Suffering**
- **Philosophies:** Buddhism, Existentialism, Stoicism
- **Psychologies:** CBT, Grief Counseling, Resilience Training
- **Applications:** Provide coping strategies for dealing with sadness; encourage exploration of personal meaning and resilience.

### **Anger and Injustice**
- **Philosophies:** Stoicism, Critical Theory
- **Psychologies:** Anger Management Techniques, Social Learning Theory
- **Applications:** Suggest methods for constructive expression of anger; encourage involvement in social justice initiatives.

### **Fear and Uncertainty**
- **Philosophies:** Stoicism, Existentialism
- **Psychologies:** CBT, Acceptance and Commitment Therapy (ACT)
- **Applications:** Provide techniques for managing anxiety and uncertainty; encourage mindfulness and acceptance practices.

### **Neutrality and Detachment**
- **Philosophies:** Taoism, Buddhism
- **Psychologies:** Mindfulness, Emotional Regulation
- **Applications:** Encourage practices that foster healthy detachment; provide strategies to enhance emotional awareness.

### **Surprise and Curiosity**
- **Philosophies:** Phenomenology, Pragmatism
- **Psychologies:** Cognitive Appraisal, Exploratory Behavior Theory
- **Applications:** Promote openness to new experiences; encourage learning and intellectual exploration.

### **Disgust**
- **Philosophies:** Moral Realism, Deontological Ethics
- **Psychologies:** Moral Psychology, Evolutionary Psychology
- **Applications:** Provide understanding of disgust triggers; suggest ways to manage strong aversive reactions.


            
        Provide understanding of disgust triggers.
        Suggest ways to manage strong aversive reactions.
            
          Output Format:
          {{
            "reflection": "Your reflection here.",
            "quote": "Your quote here.",
            "story": "Your story here.",
            "application": "Your application here.",
            "sharableCaption": "Your sharable caption here.",
          }}
        `);

      const reflectionChain = reflectionPrompt
        .pipe(model)
        .pipe(new StringOutputParser());

      return await retryOperation(async () => {
        console.log("Invoking reflection chain");
        const reflectionResult = await reflectionChain.invoke({
          reflectionText,
          reflectionType,
        });
        console.log("Raw reflection result:", reflectionResult);

        const parsedReflection = parseJsonResponse(reflectionResult);
        console.log(
          "Parsed reflection:",
          JSON.stringify(parsedReflection, null, 2)
        );
        return parsedReflection;
      });
    }

    async function generateImage(
      reflectionResult: ReflectionResult
    ): Promise<string | null> {
      console.log("Generating image for reflection");
      const imagePrompt = `
          Create an artistic, uplifting, and relatable image based on the following:
  
          Reflection:
          ${reflectionResult.application}
  
          The image should capture the essence in a "higher self" mood.
  
          Use styles that are inspiring and resonant.

          The image should have no text in it, it's important to not put any text in the image
        `;

      // The image generation logic remains the same as before

      // Set up AWS S3 client
      const s3Client = new S3Client({
        region: config.awsRegion,
        credentials: {
          accessKeyId: config.awsAccessKeyId,
          secretAccessKey: config.awsSecretAccessKey,
        },
      });

      const openai = new OpenAI({
        apiKey: config.openAiKey,
      });

      // Moderation check
      const moderationResponse = await openai.moderations.create({
        input: imagePrompt,
      });

      const moderationResult = moderationResponse.results[0];

      if (moderationResult.flagged) {
        console.warn(
          "Image prompt was flagged by moderation API. Skipping image generation."
        );
        return null;
      } else {
        const maxRetries = 1;
        let retries = 0;

        while (retries < maxRetries) {
          try {
            // Generate the image
            const imageResponse = await openai.images.generate({
              prompt: imagePrompt,
              model: "dall-e-3",
              n: 1,
              size: "1024x1024",
              style: "vivid",
              response_format: "b64_json",
            });

            const imageData = imageResponse.data[0].b64_json;

            if (imageData) {
              const buffer = Buffer.from(imageData, "base64");
              // Upload the image to AWS S3
              const filename = `images/reflections/${Date.now()}.png`;

              const params = {
                Bucket: config.awsBucketName,
                Key: filename,
                Body: buffer,
                ContentType: "image/png",
              };

              const command = new PutObjectCommand(params);
              await s3Client.send(command);

              return `https://${config.awsBucketName}.s3.${config.awsRegion}.amazonaws.com/${filename}`;
            } else {
              throw new Error("No image data received");
            }
          } catch (error) {
            console.error(
              `Error during image generation or upload (attempt ${
                retries + 1
              }):`,
              error
            );
            retries++;
            if (retries >= maxRetries) {
              console.error("Max retries reached. Giving up.");
              return null;
            }
            // Wait for a short time before retrying (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * Math.pow(2, retries))
            );
          }
        }
        return null;
      }
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
    // Validate inputs if necessary
    if (!reflectionText || !reflectionType) {
      throw new Meteor.Error(
        "invalid-parameters",
        "Reflection text and type are required."
      );
    }

    // Insert a new reflection document into the collection
    const reflectionId = await ReflectionCollection.insertAsync({
      reflectionText,
      reflectionType,
      owner: String(this.userId),
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
      return reflectionId;
    }

    return reflectionId;
  },
});

if (Meteor.isServer) {
  /*Meteor.publish("reflections", function (limit = 10) {
    return ReflectionCollection.find(
      {},
      {
        limit: limit,
        sort: { createdAt: -1 },
        fields: {
          reflectionText: 1,
          reflectionType: 1,
          result: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      }
    );
  });*/

  Meteor.publish("reflection", function (reflectionId: string) {
    if (!this.userId) {
      return this.ready();
    }
    return ReflectionCollection.find({
      _id: reflectionId,
      owner: this.userId
    });
  });

  Meteor.publish("userReflections", function (limit = 10) {
    if (!this.userId) {
      return this.ready();
    }
    return ReflectionCollection.find(
      { owner: this.userId },
      {
        limit: limit,
        sort: { createdAt: -1 },
        fields: {
          reflectionText: 1,
          reflectionType: 1,
          result: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      }
    );
  });
}