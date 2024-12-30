import { Request, Response } from "express";
import multer from "multer";
import { client } from "../client";
import { extractText } from "../utils/pdf";
import { uploadFile } from "../utils/s3UploadFile";

// File upload endpoint
export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const userId: number = req.user; // Assume user is authenticated via JWT middleware
    const file = req.file;

    if (!file) {
      throw new Error(`File required`);
    }

    // Extract text from the PDF
    const pdfText = await extractText(file.buffer);
    const extractedText = pdfText.text;

    // Upload PDF to S3
    await uploadFile(file, userId);

    // Store document metadata and content in PostgreSQL
    await client.document.create({
      data: {
        userId,
        filename: file.originalname,
        content: extractedText,
      },
    });

    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
