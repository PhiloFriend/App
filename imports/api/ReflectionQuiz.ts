import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { getConfig } from "../config";
import OpenAI from "openai";
import AWS from "aws-sdk";
//@ts-ignore
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const config = getConfig();

const apiKey = config.openAiKey;

export interface ReflectionQuizAnswer {
  question: string;
  answer: string;
}

type Options = {
  [key: string]: string;
};

export interface ReflectionQuiz {
  _id?: string;
  currentQuestion?: string;
  currentOptions?: Options;
  history: ReflectionQuizAnswer[];
  isCompleted: boolean;
  result?: any;
  imageUrl?: string; // Add imageUrl field
  philosophies: string[]; // Added philosophies field
  createdAt: Date;
  updatedAt: Date;
}

export const ReflectionQuizzesCollection = new Mongo.Collection<ReflectionQuiz>(
  "reflection_quizzes"
);

const generateTheNextQuestion = async (
  quizId: string,
  history: Array<{ question: string; answer: string }>
) => {
  if (Meteor.isServer) {
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      apiKey,
    });

    const setNewQuestion = async (question: string, options: Options) => {
      await ReflectionQuizzesCollection.updateAsync(quizId, {
        $set: {
          currentQuestion: question,
          currentOptions: options,
          updatedAt: new Date(),
        },
      });
    };

    const prompt = ChatPromptTemplate.fromTemplate(`
      Instructions:

      Based on the previous questions and answers, generate the next question and six options (A, B, C, D, E, F) for a daily reflection quiz. The question should help the user reflect deeply on various aspects of their day, emotions, experiences, and thoughts, encouraging self-awareness and personal growth.

      Guidelines for Question Generation:

      Utilize the Reflection Map:

      Incorporate different categories from the reflection map to explore various facets of the user's experience.
      Avoid Repetition:

      Ensure the new question explores a different aspect than previous questions.
      Inclusivity and Sensitivity:

      Use neutral, non-judgmental language that is inclusive of all possible user experiences, including inactivity or negative emotions.
      Balance:

      Mix practical and emotional aspects to provide a holistic reflection opportunity.
      Encourage Reflection:

      Frame questions that prompt the user to think deeply but comfortably about their experiences.
      Important Notes:

      Output Format: Provide only the question and options in a valid JSON object with the fields "question" and "options".

      JSON Formatting: Ensure that the JSON is properly formatted with double quotes around keys and string values.

      No Additional Text: Do not include explanations, apologies, or any text outside the JSON object.

      Example format:
      {{
        "question": "Your question here?",
        "options": {{
          "A": "Option A",
          "B": "Option B",
          "C": "Option C",
          "D": "Option D",
          "E": "Option E",
          "F": "Option F"
          }}
      }}

      Previous questions and answers: {context}

      Reflection Map: 1. Emotional State
      Mood Identification

      Happiness
      Sadness
      Anger
      Fear
      Disgust
      Surprise
      Neutral
      Emotional Intensity

      Low
      Moderate
      High
      Emotional Triggers

      Events
      Interactions
      Thoughts
      Memories
      2. Mental Health and Well-being
      Stress Levels

      Relaxed
      Slightly Stressed
      Moderately Stressed
      Highly Stressed
      Anxiety and Worry

      None
      Occasional
      Frequent
      Constant
      Depression Indicators

      Interest in Activities
      Energy Levels
      Sleep Patterns
      Appetite Changes
      3. Physical Health
      Energy Levels

      Energetic
      Average
      Tired
      Exhausted
      Physical Comfort

      No Pain
      Mild Discomfort
      Moderate Pain
      Severe Pain
      Health Habits

      Exercise
      Nutrition
      Sleep Quality
      4. Social Interactions
      Quality of Relationships

      Supportive
      Neutral
      Strained
      Isolated
      Social Activities

      Engaged Frequently
      Occasionally
      Rarely
      Not at All
      Communication Satisfaction

      Very Satisfied
      Somewhat Satisfied
      Unsatisfied
      Very Unsatisfied
      5. Activities and Productivity
      Daily Achievements

      Exceeded Expectations
      Met Expectations
      Below Expectations
      No Achievements
      Motivation Levels

      Highly Motivated
      Moderately Motivated
      Low Motivation
      No Motivation
      Task Management

      Well-Organized
      Somewhat Organized
      Disorganized
      Overwhelmed
      6. Challenges and Obstacles
      Type of Challenges Faced

      Personal
      Professional
      Social
      Health-Related
      Coping Mechanisms

      Effective Strategies
      Ineffective Strategies
      Avoidance
      Seeking Help
      Resilience

      Highly Resilient
      Moderately Resilient
      Low Resilience
      Feeling Defeated
      7. Thoughts and Beliefs
      Self-Perception

      Positive Self-Image
      Neutral
      Negative Self-Image
      Self-Critical
      Outlook on Life

      Optimistic
      Realistic
      Pessimistic
      Hopeless
      Belief Systems

      Strong Beliefs
      Questioning Beliefs
      Conflicted Beliefs
      Uncertain
      8. Goals and Aspirations
      Progress Toward Goals

      Ahead of Schedule
      On Track
      Behind Schedule
      Stalled
      Clarity of Goals

      Very Clear
      Somewhat Clear
      Unclear
      No Goals
      Motivation Toward Goals

      Highly Motivated
      Moderately Motivated
      Low Motivation
      Demotivated
      9. Gratitude and Positive Experiences
      Recognition of Positive Events

      Multiple Events
      A Few Events
      One Event
      None
      Expression of Gratitude

      Expressed to Others
      Acknowledged Internally
      Overlooked
      Unable to Identify
      Savoring Moments

      Fully Enjoyed
      Partially Enjoyed
      Missed Opportunities
      No Positive Moments
      10. Personal Growth and Learning
      Learning Experiences

      Significant Lessons
      Minor Insights
      No New Learnings
      Regression
      Openness to Change

      Very Open
      Somewhat Open
      Resistant
      Closed Off
      Application of Knowledge

      Actively Applied
      Occasionally Applied
      Rarely Applied
      Not Applied
      11. Environmental Factors
      Work Environment

      Supportive
      Neutral
      Stressful
      Toxic
      Home Environment

      Peaceful
      Busy
      Chaotic
      Unstable
      Community and Surroundings

      Connected
      Disconnected
      Unsafe
      Isolated
      12. Life Circumstances
      Financial Situation

      Secure
      Stable
      Uncertain
      Critical
      Major Life Events

      Positive Changes
      No Significant Events
      Negative Changes
      Traumatic Events
      Future Outlook

      Excited
      Cautiously Optimistic
      Uncertain
      Dreadful

      Next Question and Options ( MUST provide 6 options):
    `);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());
    const result = await chain.invoke({
      context: JSON.stringify(history),
    });

    console.log(result);

    try {
      function parseStringToJson(input: string): any {
        const jsonStartIndex = input.indexOf("{");
        const jsonEndIndex = input.lastIndexOf("}") + 1;
        const jsonString = input.slice(jsonStartIndex, jsonEndIndex);
        return JSON.parse(jsonString);
      }

      const parsedResult = parseStringToJson(result);

      await setNewQuestion(parsedResult.question, parsedResult.options);

      return {
        question: parsedResult.question,
        options: parsedResult.options,
      };
    } catch (error) {
      console.error("Error parsing question result:", error);
      console.log("Raw result:", result);
      throw new Error("Failed to generate a valid question");
    }
  }
};

const generateResult = async (
  quizId: string,
  history: Array<{ question: string; answer: string }>
) => {
  if (Meteor.isServer) {
    const quiz = await ReflectionQuizzesCollection.findOneAsync(quizId);
    if (!quiz) throw new Meteor.Error("quiz-not-found");
    const philosophies = quiz.philosophies; // Retrieve philosophies

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      apiKey,
    });

    const setResult = async (resultObj: any) => {
      await ReflectionQuizzesCollection.updateAsync(quizId, {
        $set: {
          result: resultObj,
          updatedAt: new Date(),
        },
      });
    };

    // Generate the reflection summary
    const reflectionPrompt = ChatPromptTemplate.fromTemplate(`
      Make sure your answer is in the proper json format: {{"reflection": "Your reflection summary here."}}

      Based on the following quiz results, provide a comprehensive reflection summary for the user. The summary should help the user understand their feelings, experiences, and thoughts from the day, offering insights and suggestions for personal growth.

      Guidelines for reflection generation:
      1. Summarize key themes: Identify the main themes or patterns in the user's responses.
      2. Encourage self-awareness: Highlight areas where the user showed strong emotions or significant experiences.
      3. Offer positive reinforcement: Acknowledge achievements or positive actions the user took.
      4. Suggest areas for improvement: Gently suggest ways the user could address challenges or negative feelings.
      5. Use empathetic and supportive language.

      Format the response as a valid JSON string with a 'reflection' field containing the reflection summary.

      Example format:
      {{"reflection": "Your reflection summary here."}}

      Quiz results: {context}

      Reflection Summary:
    `);

    const reflectionChain = reflectionPrompt
      .pipe(model)
      .pipe(new StringOutputParser());
    const reflectionResult = await reflectionChain.invoke({
      context: JSON.stringify(history),
    });

    try {
      function parseStringToJson(input: string): any {
        const jsonStartIndex = input.indexOf("{");
        const jsonEndIndex = input.lastIndexOf("}") + 1;
        const jsonString = input.slice(jsonStartIndex, jsonEndIndex);
        return JSON.parse(jsonString);
      }

      const parsedReflection = parseStringToJson(reflectionResult);
      const reflection = parsedReflection.reflection;

      // Generate the quote and story based on the reflection and philosophy
      const philosophy = philosophies[0]; // Using the first philosophy for simplicity

      const quoteStoryPrompt = ChatPromptTemplate.fromTemplate(`
        Make sure your answer is in the proper json format: {{"quote": "...", "story": "...", "application": "..."}}

        Based on the reflection below and the philosophy "{philosophy}", provide:

        1. A relevant quote from a thinker or text associated with {philosophy} that relates to the themes in the reflection.
        2. A brief story or anecdote about someone with beliefs or actions aligned with {philosophy} who dealt with similar situations.
        3. An application and learning point from the story that the user can apply to their own situation.

        Use empathetic and supportive language.

        Format the response as a valid JSON string with 'quote', 'story', and 'application' fields.

        Example format:
        {{"quote": "Your quote here.", "story": "Your story here.", "application": "Your application and learning here."}}

        Reflection: {reflection}

        Response:
      `);

      const quoteStoryChain = quoteStoryPrompt
        .pipe(model)
        .pipe(new StringOutputParser());
      const quoteStoryResult = await quoteStoryChain.invoke({
        philosophy: philosophy,
        reflection: reflection,
      });

      console.log();

      const parsedQuoteStory = parseStringToJson(quoteStoryResult);

      // Combine reflection and quote/story into the final result

      interface FinalResult {
        reflection: any;
        quote: any;
        story: any;
        application: any;
        imageUrl: any;
      }

      const finalResult: FinalResult = {
        reflection: reflection,
        quote: parsedQuoteStory.quote,
        story: parsedQuoteStory.story,
        application: parsedQuoteStory.application,
        imageUrl: null,
      };

      if (Meteor.isServer) {
        AWS.config.update({
          accessKeyId: config.awsAccessKeyId,
          secretAccessKey: config.awsSecretAccessKey,
          region: config.awsRegion,
        });

        const openai = new OpenAI({
          apiKey: config.openAiKey,
        });

        var s3 = new AWS.S3();

        // Generate the image prompt
        const imagePrompt = `
              Create an artistic, uplifting, and relatable image that represents the following reflection and story in a "higher self" mood:

              Reflection:
              ${reflection}

              Story:
              ${parsedQuoteStory.story}

              Application:
              ${parsedQuoteStory.application}

              The image should capture the essence of the user's situation and the suggested solution, in an artistic and inspiring way.
            `;

        console.log("========", imagePrompt);

        // Moderation check
        const moderationResponse = await openai.moderations.create({
          input: imagePrompt,
        });

        const moderationResult = moderationResponse.results[0].flagged;

        if (moderationResult) {
          console.warn(
            "Image prompt was flagged by moderation API. Skipping image generation."
          );
          finalResult.imageUrl = null;
        } else {
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
              const filename = `images/${quizId}/${Date.now()}.png`;

              const params = {
                Bucket: config.awsBucketName,
                Key: filename,
                Body: buffer,
                ContentType: "image/png",
                ACL: "public-read",
              };

              const uploadResult = await s3.upload(params).promise();

              const imageUrl = uploadResult.Location;

              // Include imageUrl in finalResult
              finalResult.imageUrl = imageUrl;
            }
          } catch (error) {
            console.error("Error during image generation or upload:", error);
            finalResult.imageUrl = null;
          }
        }
      }

      await setResult(finalResult);
    } catch (error) {
      console.error("Error parsing reflection or quote/story result:", error);
      console.log("Raw reflection result:", reflectionResult);
      //@ts-ignore
      console.log("Raw quote and story result:", quoteStoryResult);
      throw new Error("Failed to generate a valid reflection or quote/story");
    }
  }
};

function parseJsonResponse(input: string): any {
  try {
    const jsonStartIndex = input.indexOf("{");
    const jsonEndIndex = input.lastIndexOf("}") + 1;
    const jsonString = input.slice(jsonStartIndex, jsonEndIndex);

    console.log(jsonString, JSON.parse(jsonString))
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Failed to parse JSON response");
  }
}

const generateReflectionResult = async (
  quizId: string,
  history: Array<{ question: string; answer: string }>
) => {
  if (Meteor.isServer) {
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

          // Exponential backoff
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      // This line should never be reached due to the throw in the loop,
      // but TypeScript needs it for type safety
      throw new Error("Unexpected error in retryOperation");
    }

    async function generateReflection(
      history: Array<{ question: string; answer: string }>,
      philosophy: string,
    ): Promise<
    { quote: string; story: string; application: string, reflection: string }
    > {
      const reflectionPrompt = ChatPromptTemplate.fromTemplate(`
         IMPORTANT: Your response must be in the proper JSON format. Ensure that the JSON is correctly formatted with double quotes around keys and string values.

Overall Task:

Based on the following quiz results, provide a comprehensive reflection summary for the user. Then, using the reflection summary and the philosophy "{philosophy}", generate:

Reflection Summary:

Summarize the user's feelings, experiences, and thoughts from the day.
Help the user understand their emotions and offer insights and suggestions for personal growth.
Philosophy-Based Guidance:

Provide a relevant quote from a thinker or text associated with {philosophy} that relates to the themes in the reflection.
Share a brief story or anecdote about someone with beliefs or actions aligned with {philosophy} who dealt with similar situations.
Offer an application and learning point from the story that the user can apply to their own situation.
Guidelines for Reflection Generation:

Summarize Key Themes: Identify the main themes or patterns in the user's responses.
Encourage Self-Awareness: Highlight areas where the user showed strong emotions or significant experiences.
Offer Positive Reinforcement: Acknowledge achievements or positive actions the user took.
Suggest Areas for Improvement: Gently suggest ways the user could address challenges or negative feelings.
Use Empathetic and Supportive Language: Ensure the tone is understanding and encouraging.
Important Notes:

JSON Formatting is Crucial: Ensure that the response is formatted as a valid JSON string with the fields "reflection", "quote", "story", and "application".
Double-Check Your JSON: Validate your response to make sure it meets all JSON formatting requirements.
No Additional Text: Do not include explanations, apologies, or any text outside the JSON object.


Example Format: 
{{
  "reflection": "Your reflection summary here.",
  "quote": "Your quote here.",
  "story": "Your story here.",
  "application": "Your application and learning point here."
      }}

Quiz Results: {context}


IMPORTANT: GIVE ME THE RESULT IN JSON FORMAT WITH NO ADDITIONAL INFO

        `);

      const reflectionChain = reflectionPrompt
        .pipe(model)
        .pipe(new StringOutputParser());

      return await retryOperation(async () => {
        const reflectionResult = await reflectionChain.invoke({
          context: JSON.stringify(history),
          philosophy: philosophy,
        });




        const parsedReflection = parseJsonResponse(reflectionResult);
        return parsedReflection;
      });
    }

    // Function to generate the quote, story, and application
    /*async function generateQuoteStory(
      philosophy: string,
    ): Promise<{ quote: string; story: string; application: string }> {
      const maxRetries = 5;
      const baseDelay = 1000; // 1 second

      const quoteStoryPrompt = ChatPromptTemplate.fromTemplate(`
        Make sure your answer is in the proper json format: {{"quote": "...", "story": "...", "application": "..."}}
    
        Based on the reflection below and the philosophy "{philosophy}", provide:
    
        1. A relevant quote from a thinker or text associated with {philosophy} that relates to the themes in the reflection.
        2. A brief story or anecdote about someone with beliefs or actions aligned with {philosophy} who dealt with similar situations.
        3. An application and learning point from the story that the user can apply to their own situation.
    
        Use empathetic and supportive language.
    
        Format the response as a valid JSON string with 'quote', 'story', and 'application' fields.
    
        Example format:
        {{"quote": "Your quote here.", "story": "Your story here.", "application": "Your application and learning here."}}
    
        Reflection: {reflection}
    
        Response:
      `);

      const quoteStoryChain = quoteStoryPrompt
        .pipe(model)
        .pipe(new StringOutputParser());

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const quoteStoryResult = await quoteStoryChain.invoke({
            philosophy: philosophy,
            reflection: reflection,
          });

          console.log(quoteStoryResult);

          const parsedQuoteStory = parseJsonResponse(quoteStoryResult);
          return {
            quote: parsedQuoteStory.quote,
            story: parsedQuoteStory.story,
            application: parsedQuoteStory.application,
          };
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);

          if (attempt === maxRetries - 1) {
            throw new Error(
              `Failed to generate quote story after ${maxRetries} attempts`
            );
          }

          // Exponential backoff
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      // This line should never be reached due to the throw in the loop,
      // but TypeScript needs it for type safety
      throw new Error("Unexpected error in generateQuoteStory");
    }*/

    async function generateImage(
      quizId: string,
      reflection: string,
      story: string,
      application: string
    ): Promise<string | null> {
      const imagePrompt = `
        Create an artistic, uplifting, and relatable image that represents the following reflection and story in a "higher self" mood:
    
        Reflection:
        ${reflection}
    
        Story:
        ${story}
    
        Application:
        ${application}
    
        The image should capture the essence of the user's situation and the suggested solution, in an artistic and inspiring way.
      `;

      console.log("Image Prompt:", imagePrompt);

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
              const filename = `images/${quizId}/${Date.now()}.png`;

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

    async function setResult(quizId: string, resultObj: any) {
      await ReflectionQuizzesCollection.updateAsync(quizId, {
        $set: {
          result: resultObj,
          updatedAt: new Date(),
        },
      });
    }

    const generateResult = async (
      quizId: string,
      history: Array<{ question: string; answer: string }>
    ) => {
      if (!Meteor.isServer) return;

      const quiz = await ReflectionQuizzesCollection.findOneAsync(quizId);
      if (!quiz) throw new Meteor.Error("quiz-not-found");
      const philosophies = quiz.philosophies;

      try {
        const philosophy = philosophies[0]; // Use the first philosophy


        const { quote, story, application, reflection } = await generateReflection(history, philosophy);

        // Combine all results
        const finalResult: any = {
          reflection: reflection,
          quote: quote,
          story: story,
          application: application,
          imageUrl: null,
        };

        // Generate image and get the URL
        const imageUrl = await generateImage(
          quizId,
          reflection,
          story,
          application
        );
        finalResult.imageUrl = imageUrl;

        // Save the final result
        await setResult(quizId, finalResult);
      } catch (error) {
        console.error("Error generating result:", error);
        throw new Error("Failed to generate a valid reflection or quote/story");
      }
    };

    generateResult(quizId, history);
  }
};

Meteor.methods({
  async "reflectionQuizzes.create"(
    initialQuestion: string,
    initialOptions: Options,
    philosophies: string[] // Accept philosophies at creation
  ) {
    return await ReflectionQuizzesCollection.insertAsync({
      currentQuestion: initialQuestion,
      currentOptions: initialOptions,
      history: [],
      isCompleted: false,
      philosophies: philosophies, // Store philosophies
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async "reflectionQuizzes.answerQuestion"(quizId: string, answer: string) {
    const quiz = await ReflectionQuizzesCollection.findOneAsync(quizId);
    if (!quiz) throw new Meteor.Error("quiz-not-found");
    if (!quiz.currentQuestion) throw new Meteor.Error("no-current-question");

    console.log("======", quizId, answer);

    const newHistoryItem: ReflectionQuizAnswer = {
      question: quiz.currentQuestion,
      answer: answer,
    };

    await ReflectionQuizzesCollection.updateAsync(quizId, {
      $push: { history: newHistoryItem },
      $unset: {
        currentQuestion: "",
        currentOptions: "",
      },
      $set: {
        updatedAt: new Date(),
      },
    });

    const updatedQuiz = await ReflectionQuizzesCollection.findOneAsync(quizId);

    if (updatedQuiz && updatedQuiz._id && updatedQuiz.history) {
      if (updatedQuiz.history.length >= 10) {
        await generateReflectionResult(updatedQuiz._id, updatedQuiz.history);
      } else {
        generateTheNextQuestion(updatedQuiz._id, updatedQuiz.history);
      }
    }
  },

  async "reflectionQuizzes.complete"(quizId: string) {
    await ReflectionQuizzesCollection.updateAsync(quizId, {
      $set: {
        isCompleted: true,
        updatedAt: new Date(),
      },
    });

    // Generate the final result when the quiz is completed
    await generateResult(quizId, []);
  },
});

if (Meteor.isServer) {
  Meteor.publish("reflectionQuizzes", function (limit = 10) {
    return ReflectionQuizzesCollection.find(
      {},
      {
        limit: limit,
        sort: { createdAt: -1 },
        fields: {
          currentQuestion: 1,
          currentOptions: 1,
          isCompleted: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      }
    );
  });

  Meteor.publish("reflectionQuiz", function (quizId) {
    return ReflectionQuizzesCollection.find({ _id: quizId });
  });
}
