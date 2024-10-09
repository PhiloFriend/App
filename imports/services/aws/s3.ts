import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getConfig } from "../../config";

// @ts-ignore
import { Log } from "meteor/logging";

const config = getConfig();

export const s3Client = new S3Client({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});

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
