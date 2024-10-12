import { getConfig } from "../../config";
import OpenAI from "openai";
const config = getConfig();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

export async function generateSpeech(
  text: string,
  voice: Voice = "nova"
): Promise<Buffer> {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice,
    input: text,
  });

  return Buffer.from(await response.arrayBuffer());
}
