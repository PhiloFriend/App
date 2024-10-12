import { ReflectionResult } from "/imports/api/reflection/types";
// @ts-ignore
import { Log } from "meteor/logging";

export const getImagePrompt = (reflectionResult: ReflectionResult) => {
  const imagePropmpt = `
        Create an artistic and uplifting image that visually represents the following concepts without using any text or words:

        Narrative imagery representing: ${reflectionResult.story}
        (Translate this into a visual scenario or symbolic elements)

        Compose these elements into a single, cohesive image that evokes a 'higher self' mood. Use inspiring and resonant artistic styles, incorporating vibrant colors and ethereal aesthetics. The image should feel spiritual and transformative, capturing the essence of personal growth and inner wisdom.
        Important: The final image must not contain any text, words, or written elements.
    `;

  Log(`Generating Image with this prompt:         Create an artistic and uplifting image that visually represents the following concepts without using any text or words:

        Narrative imagery representing: ${reflectionResult.story}
        (Translate this into a visual scenario or symbolic elements)

        Compose these elements into a single, cohesive image that evokes a 'higher self' mood. Use inspiring and resonant artistic styles, incorporating vibrant colors and ethereal aesthetics. The image should feel spiritual and transformative, capturing the essence of personal growth and inner wisdom.
        Important: The final image must not contain any text, words, or written elements.
`);

  return imagePropmpt;
};
