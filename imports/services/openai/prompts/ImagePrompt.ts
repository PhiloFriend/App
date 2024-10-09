import { ReflectionResult } from "/imports/api/reflection/types";

export const getImagePrompt = (reflectionResult: ReflectionResult) => {
  return `
      Create an artistic, uplifting, and relatable image based on the following:

      The image should have no text in it, it's important to not put any text in the image

      Reflection:
      ${reflectionResult.reflection}

      Story:
      ${reflectionResult.story}

      Application:
      ${reflectionResult.application}

      The image should capture the essence in a "higher self" mood.

      Use styles that are inspiring and resonant.

      The image should have no text in it, it's important to not put any text in the image
    `;
};
