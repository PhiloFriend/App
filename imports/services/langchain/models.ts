import { ChatOpenAI } from "@langchain/openai";
import { getConfig } from "../../config";

const config = getConfig();

export const chatModel = new ChatOpenAI({
  model: "gpt-4o",
  apiKey: process.env.OPENAI_API_KEY,
});
