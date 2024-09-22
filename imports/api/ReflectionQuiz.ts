import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

const apiKey = `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`;

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
      model: "gpt-4",
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
      Based on the following previous questions and answers, generate the next question and 4 options to answer that question for a daily reflection quiz. The question should help the user reflect deeply on their day, emotions, experiences, and thoughts. Ensure that the question encourages self-awareness and personal growth.

      Guidelines for question generation:
      1. Avoid repetition: Make sure the new question explores a different aspect of the user's day or feelings.
      2. Balance between practical and emotional aspects: Alternate between questions about events and actions, and those about feelings and thoughts.
      3. Encourage positivity and learning: Frame questions in a way that helps the user find positive aspects or lessons from their experiences.
      4. Use neutral and open-ended language: Phrase questions that allow the user to express themselves freely.

      Provide the question and four distinct options (A, B, C, D) if appropriate, or leave options empty if the question is open-ended.

      Format the response as a valid JSON string with 'question' and 'options' fields. Ensure that the JSON is properly formatted with double quotes around keys and string values.

      Example format:
      {{"question": "Your question here?", "options": {{"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"}}}}

      Previous questions and answers: {context}

      Next Question and Options ( MUST provide 4 options):
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
      model: "gpt-4",
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

    const reflectionChain = reflectionPrompt.pipe(model).pipe(new StringOutputParser());
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

      const quoteStoryChain = quoteStoryPrompt.pipe(model).pipe(new StringOutputParser());
      const quoteStoryResult = await quoteStoryChain.invoke({
        philosophy: philosophy,
        reflection: reflection,
      });

      const parsedQuoteStory = parseStringToJson(quoteStoryResult);

      // Combine reflection and quote/story into the final result
      const finalResult = {
        reflection: reflection,
        quote: parsedQuoteStory.quote,
        story: parsedQuoteStory.story,
        application: parsedQuoteStory.application,
      };

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
        await generateResult(updatedQuiz._id, updatedQuiz.history);
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
