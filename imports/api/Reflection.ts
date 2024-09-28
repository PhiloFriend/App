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
            
        The wisdom, story and quote and application must come from a proper psychology or philosophy based on this map:
            
        Happiness and Joy
        Philosophies:
            
        Epicureanism: Pursuit of simple pleasures and avoidance of pain.
        Utilitarianism: Maximizing happiness for the greatest number.
        Aristotelian Virtue Ethics: Achieving eudaimonia (flourishing) through virtuous living.
        Humanism: Emphasizing human potential and self-fulfillment.
        Positive Existentialism: Finding meaning through positive experiences.
        Psychologies:
            
        Positive Psychology: Study of happiness and well-being.
        Humanistic Psychology: Focus on individual potential and self-actualization.
        Broaden-and-Build Theory (Barbara Fredrickson): Positive emotions expand cognition and behavior.
        Flow Theory (Mihaly Csikszentmihalyi): Deep immersion in activities leading to happiness.
        Applications:
            
        Encourage activities that promote flow and engagement.
        Suggest practices to cultivate gratitude and positive emotions.
        Sadness and Suffering
        Philosophies:
            
        Buddhism: Understanding suffering (dukkha) and the path to liberation.
        Existentialism: Embracing the inherent challenges of existence.
        Stoicism: Accepting things beyond our control.
        Nihilism: Questioning the inherent meaning of life.
        Schopenhauer's Pessimism: Life characterized by suffering.
        Psychologies:
            
        Cognitive Behavioral Therapy (CBT): Identifying and changing negative thought patterns.
        Psychodynamic Psychology: Exploring unconscious influences on behavior.
        Grief Theories (Elisabeth Kübler-Ross Model): Stages of grief processing.
        Learned Helplessness (Martin Seligman): Understanding perceived lack of control.
        Applications:
            
        Provide coping strategies for dealing with sadness.
        Encourage exploration of personal meaning and resilience.
        Anger and Injustice
        Philosophies:
            
        Marxism: Critique of social inequalities and capitalist systems.
        Critical Theory: Analyzing power structures and advocating for change.
        Stoicism: Managing emotions through rationality.
        Existentialism: Confronting absurdity and asserting personal values.
        Anarchism: Opposition to unjust hierarchies.
        Psychologies:
            
        Anger Management Techniques: Strategies to control anger responses.
        Social Learning Theory: Understanding learned behaviors from the environment.
        Frustration-Aggression Hypothesis: Link between blocked goals and aggression.
        Attribution Theory: How people explain causes of events.
        Applications:
            
        Suggest methods for constructive expression of anger.
        Encourage involvement in social justice initiatives.
        Fear and Uncertainty
        Philosophies:
            
        Stoicism: Embracing fate and focusing on what can be controlled.
        Existentialism: Facing the anxiety of freedom and choice.
        Absurdism (Albert Camus): Embracing life's inherent meaninglessness.
        Taoism: Living in harmony with the Tao and accepting the flow of life.
        Skepticism: Questioning knowledge and embracing uncertainty.
        Psychologies:
            
        Anxiety Theories: Understanding the mechanisms of fear responses.
        Fight or Flight Response (Walter Cannon): Physiological reactions to threats.
        Cognitive Behavioral Therapy (CBT): Challenging irrational fears.
        Acceptance and Commitment Therapy (ACT): Accepting feelings and committing to values.
        Mindfulness-Based Stress Reduction (MBSR): Reducing anxiety through mindfulness.
        Applications:
            
        Provide techniques for managing anxiety and uncertainty.
        Encourage mindfulness and acceptance practices.
        Neutrality and Detachment
        Philosophies:
            
        Taoism: Emphasizing non-action (wu wei) and naturalness.
        Buddhism: Practicing non-attachment and equanimity.
        Skepticism: Maintaining doubt and withholding judgment.
        Nihilism: Belief in the absence of inherent meaning.
        Stoicism: Emotional resilience and indifference to externals.
        Psychologies:
            
        Mindfulness: Observing thoughts and feelings without judgment.
        Dissociation (Clinical Psychology): Detachment from reality or self.
        Emotional Regulation Theories: Managing and responding to emotional experiences.
        Attachment Theory (Avoidant Attachment): Patterns of detachment in relationships.
        Alexithymia: Difficulty in identifying and expressing emotions.
        Applications:
            
        Encourage practices that foster healthy detachment.
        Provide strategies to enhance emotional awareness.
        Surprise and Curiosity
        Philosophies:
            
        Phenomenology: Study of conscious experiences.
        Empiricism: Knowledge through sensory experience.
        Pragmatism: Truth through practical consequences.
        Rationalism: Emphasis on reason and knowledge acquisition.
        Existentialism: Exploring new experiences to define self.
        Psychologies:
            
        Schema Theory: Frameworks for understanding the world.
        Affective Neuroscience: Brain mechanisms of emotions.
        Cognitive Appraisal Theories: Interpretation influences emotional response.
        Exploratory Behavior Theory: Motivation to explore novel stimuli.
        Applications:
            
        Promote openness to new experiences.
        Encourage learning and intellectual exploration.
        Disgust
        Philosophies:
            
        Moral Realism: Objective moral truths influencing feelings.
        Deontological Ethics: Duty-based morality leading to disgust at violations.
        Aesthetic Philosophy: Disgust as a response to the grotesque.
        Purity Ethics (Jonathan Haidt): Moral foundation of purity vs. degradation.
        Psychologies:
            
        Disgust Sensitivity: Individual differences in disgust responses.
        Moral Psychology: How disgust influences moral judgments.
        Evolutionary Psychology: Disgust as a survival mechanism.
        Contamination Fear (OCD): Disgust in obsessive-compulsive behaviors.
        Applications:
            
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
  Meteor.publish("reflections", function (limit = 10) {
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
  });

  Meteor.publish("reflection", function (reflectionId: string) {
    return ReflectionCollection.find({ _id: reflectionId });
  });
}
