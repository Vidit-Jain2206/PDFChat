import { client } from "../client";
import { aiApp } from "../utils/chatModel";

export const getAnswers = async (
  question: string,
  config: { configurable: { thread_id: string } }
) => {
  try {
    // Call langchain and openApi to get answers
    const input = [
      {
        role: "user",
        content: question,
      },
    ];
    const output = await aiApp.invoke({ messages: input }, config);
    console.log(output.messages[output.messages.length - 1]);
  } catch (error) {
    console.error(error);
    throw new Error("Server error");
  }
};

export const initiateChat = async (
  document_id: number,
  config: { configurable: { thread_id: string } }
) => {
  try {
    const pdfcontent = await client.document.findFirst({
      where: { id: document_id },
      select: {
        content: true,
      },
    });
    if (!pdfcontent) {
      throw new Error("Document not found");
    }

    const input = [
      {
        role: "user",
        content: `this is my pdf content ${pdfcontent.content}. Answer the following questions`,
      },
    ];
    const output = await aiApp.invoke({ messages: input }, config);
    console.log(output.messages[output.messages.length - 1]);
    return;
  } catch (error) {
    console.error(error);
    throw new Error("Server error");
  }
};
