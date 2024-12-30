import fs from "fs";
import pdf from "pdf-parse";

export const extractText = async (filePath: Buffer) => {
  // const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(filePath);
  return pdfData;
};
