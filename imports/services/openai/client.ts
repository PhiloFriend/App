import { getConfig } from "../../config";
import OpenAI from "openai";
const config = getConfig();

export const openai = new OpenAI({
  apiKey: config.openAiKey,
});

