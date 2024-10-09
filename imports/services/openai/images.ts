import { openai } from "./client";

export const generateDallE3Image = async (prompt: string) => {
  try {
    const imageResponse = await openai.images.generate({
      prompt: prompt,
      model: "dall-e-3",
      n: 1,
      size: "1024x1024",
      style: "vivid",
      response_format: "b64_json",
    });

    const imageData = imageResponse.data[0].b64_json;

    return imageData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
