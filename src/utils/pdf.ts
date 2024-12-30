import fs from "fs";
import pdf from "pdf-parse";

export const extractText = async (filePath: string) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  return pdfData;
};
