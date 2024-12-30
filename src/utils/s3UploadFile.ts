import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const REGION = process.env.REGION || "";
const S3_BUCKET = process.env.S3_BUCKET || "";

const client = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: REGION,
});

export const uploadFile = async (file: Express.Multer.File, userId: number) => {
  try {
    const uploadParams = {
      Bucket: S3_BUCKET,
      Key: `${Date.now()}-${file.originalname}-${userId}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await client.send(command);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
