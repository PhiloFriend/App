import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatAnthropicMessages } from "@langchain/anthropic";

export interface QuizAnswer {
  question: string;
  answer: string;
}

type Options = {
  [key: string]: string;
};

export interface Quiz {
  _id?: string;
  currentQuestion?: string;
  currentOptions?: Options;
  history: QuizAnswer[];
  isCompleted: boolean;
  result?: any;
  createdAt: Date;
  updatedAt: Date;
}

export const QuizzesCollection = new Mongo.Collection<Quiz>("quizzes");

const generateTheNextQuestion = async (
  quizId: string,
  history: Array<{ question: string; answer: string }>
) => {
  if (Meteor.isServer) {
    const model = new ChatOpenAI({
      model: "gpt-4o",
      apiKey:
    });

    const setNewQuestion = async (question: string, options: Options) => {
      const result = await QuizzesCollection.updateAsync(quizId, {
        $set: {
          currentQuestion: question,
          currentOptions: options,
          updatedAt: new Date(),
        },
      });
    };

    const prompt = ChatPromptTemplate.fromTemplate(`
          Based on the following previous questions and answers, generate the next multiple-choice question for a philosophy quiz. The question should build upon previous answers and help further understand the person's values and life philosophy. 
          

            questions must be in a way that makes it possible for you to choose one of the below philosophies based on the user values:
      The list of possible philosophies: ["stoicism", "taoism", "buddhism", "islam", "christianity", "hinduism","confucianism","epicureanism","secular_humanism","positive_psychology",  "mindfulness", "cbt","virtue_ethics",]


          Ensure that the new question explores a different aspect of the user's worldview or daily practices. The options should reflect diverse philosophical and life approaches without explicitly naming or referencing any specific philosophy, religion, or school of thought.
          
          Provide the question and four distinct options (A, B, C, D). Each option should be phrased in a way that feels natural and relatable to the average person, focusing on practical approaches or mindsets rather than theoretical concepts.
          
          Format the response as a valid JSON string with 'question' and 'options' fields. Ensure that the JSON is properly formatted with double quotes around keys and string values.
          
          Example format:
          {{"question": "Your question here?", "options": {{"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"}}}}
          
          Previous questions and answers: {context}
          
          Next Question and Options:
        `);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());
    const result = await chain.invoke({
      context: JSON.stringify(history),
    });

    try {
      function parseStringToJson(input: string): any {
        try {
          // Extract JSON part from the input string
          const jsonStartIndex = input.indexOf("{");
          const jsonEndIndex = input.lastIndexOf("}") + 1;
          const jsonString = input.slice(jsonStartIndex, jsonEndIndex);

          // Parse the extracted JSON string
          const jsonObject = JSON.parse(jsonString);

          return jsonObject;
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return null;
        }
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

      // Attempt to extract question and options if JSON parsing fails
      const questionMatch = result.match(/"question"\s*:\s*"([^"]+)"/);
      const optionsMatch = result.match(/"options"\s*:\s*(\{[^}]+\})/);

      if (questionMatch && optionsMatch) {
        const question = questionMatch[1];
        const optionsString = optionsMatch[1].replace(/'/g, '"');
        const options = JSON.parse(optionsString);

        await setNewQuestion(question, options);

        return {
          question,
          options,
        };
      } else {
        throw new Error("Failed to generate a valid question");
      }
    }
  }
};

const generateResult = async (
  quizId: string,
  history: Array<{ question: string; answer: string }>
) => {
  if (Meteor.isServer) {
    const model = new ChatOpenAI({
      model: "gpt-4o",
      apiKey:
        "",
    });

    console.log("_=------------------------------1");

    const setResult = async (resultObj: any) => {
      const result = await QuizzesCollection.updateAsync(quizId, {
        $set: {
          result: resultObj,
          updatedAt: new Date(),
        },
      });
    };

    console.log("_=------------------------------2");

    const prompt = ChatPromptTemplate.fromTemplate(`
        Based on the following quiz results, recommend a primary philosophy or way of life and 2 additional complementary approaches that can help the user better navigate their daily life. Choose from a diverse range of philosophical traditions, religious ethics, modern approaches, psychological therapies, cultural wisdom, and personal development strategies.
        
      The list of possible philosophies: ["stoicism", "taoism", "buddhism", "islam", "christianity", "hinduism","confucianism","epicureanism","secular_humanism","positive_psychology",  "mindfulness", "cbt","virtue_ethics",]

        For each recommendation:
        1. Name the philosophy or approach
        2. Provide a brief explanation (2-3 sentences) of its core principles
        3. Relate it specifically to the user's responses, explaining why it might be beneficial for them
        4. Suggest one practical, daily application of this philosophy
        
        Ensure that your recommendations are based on the user's responses to the quiz questions, focusing on the approaches and mindsets they seemed to resonate with most.
        
        Format the response as a valid JSON string with 'primary' and 'complementary' fields, where 'complementary' is an array of two objects. Each recommendation object should have 'name', 'explanation', 'relevance', and 'application' fields.
        
        Example format:
        {{
          "primary": {{
            "name": "Philosophy Name",
            "explanation": "Brief explanation",
            "relevance": "Why it's relevant",
            "application": "Daily application"
          }},
          "complementary": [
            {{
              "name": "Complementary Approach 1",
              "explanation": "Brief explanation",
              "relevance": "Why it's relevant",
              "application": "Daily application"
            }},
            {{
              "name": "Complementary Approach 2",
              "explanation": "Brief explanation",
              "relevance": "Why it's relevant",
              "application": "Daily application"
            }}
          ]
        }}
        
        Quiz results: {context}
        
        Recommendations:
      `);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());
    const result = await chain.invoke({
      context: JSON.stringify(history),
    });

    try {
      function parseStringToJson(input: string): any {
        try {
          // Extract JSON part from the input string
          const jsonStartIndex = input.indexOf("{");
          const jsonEndIndex = input.lastIndexOf("}") + 1;
          const jsonString = input.slice(jsonStartIndex, jsonEndIndex);

          // Parse the extracted JSON string
          const jsonObject = JSON.parse(jsonString);

          return jsonObject;
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return null;
        }
      }

      await setResult(parseStringToJson(result));
    } catch (error) {
      console.log(error);
      throw new Error("Failed to generate a valid question");
    }
  }
};

Meteor.methods({
  async "quizzes.create"(initialQuestion: string, initialOptions: Options) {
    return await QuizzesCollection.insertAsync({
      currentQuestion: initialQuestion,
      currentOptions: initialOptions,
      history: [],
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async "quizzes.answerQuestion"(quizId: string, answer: string) {
    const quiz = await QuizzesCollection.findOneAsync(quizId);
    if (!quiz) throw new Meteor.Error("quiz-not-found");
    if (!quiz.currentQuestion) throw new Meteor.Error("no-current-question");

    const newHistoryItem: QuizAnswer = {
      question: quiz.currentQuestion,
      answer: answer,
    };

    const result = await QuizzesCollection.updateAsync(quizId, {
      $push: { history: newHistoryItem },
      $unset: {
        currentQuestion: "",
        currentOptions: "",
      },
      $set: {
        updatedAt: new Date(),
      },
    });

    const updatedQuiz = await QuizzesCollection.findOneAsync(quizId);

    if (updatedQuiz && updatedQuiz._id && updatedQuiz.history) {
      if (updatedQuiz.history.length >= 10) {
        generateResult(updatedQuiz._id, updatedQuiz.history);
      } else {
        generateTheNextQuestion(updatedQuiz._id, updatedQuiz.history);
      }
    }

    // TODO: Implement AI call for next question
    //await Meteor.callAsync("quizzes.getNextQuestion", quizId);
  },

  async "quizzes.complete"(quizId: string) {
    await QuizzesCollection.updateAsync(quizId, {
      $set: {
        isCompleted: true,
        updatedAt: new Date(),
      },
    });

    // TODO: Implement AI call for quiz result
    await Meteor.callAsync("quizzes.getQuizResult", quizId);
  },

  // AI-related methods (to be implemented)
  async "quizzes.getNextQuestion"(quizId: string) {
    // TODO: Implement AI call to get next question and options
    // This method should update the quiz with the new question and options
    console.log("TODO: Implement AI call for next question");
  },

  async "quizzes.getQuizResult"(quizId: string) {
    // TODO: Implement AI call to get quiz result
    // This method should update the quiz with the final result
    console.log("TODO: Implement AI call for quiz result");
  },
});

if (Meteor.isServer) {
  Meteor.publish("quizzes", function (limit = 10) {
    return QuizzesCollection.find(
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

  Meteor.publish("quiz", function (quizId) {
    return QuizzesCollection.find({ _id: quizId });
  });
}
