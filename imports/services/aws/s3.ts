import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getConfig } from "../../config";

// @ts-ignore
import { Log } from "meteor/logging";

const config = getConfig();

export const s3Client = new S3Client({
  region: config.awsRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function storeAudio(audioBuffer: Buffer, fileName: string): Promise<string> {
  const params = {
    Bucket: config.awsBucketName,
    Key: `audio/${fileName}`,
    Body: audioBuffer,
    ContentType: "audio/mpeg",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${config.awsBucketName}.s3.${config.awsRegion}.amazonaws.com/audio/${fileName}`;
}

export const storeImage = async (imageData: string) => {
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

  const imageUrl =  `https://${config.awsBucketName}.s3.${config.awsRegion}.amazonaws.com/${filename}`;

  Log(`image generated at: ${imageUrl}`);

  return imageUrl;
};
