import Groq from "groq-sdk";
import { trackRequest } from "../../../lib/redis";
const groqClient = new Groq({ apiKey: "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" });
import { API_KEY, CREATOR } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing query parameter'
        });
    }
    
    try {
        await trackRequest("/api/ai/deepseek");
        const data = await groq(query);
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

async function groq(meletop) {
  try {
    const chatCompletion = await getGroqChatCompletion(meletop);
    let response = chatCompletion?.choices?.[0]?.message?.content || "No response received";

    response = response.replace(/<think>[\s\S]*?<\/think>\n*/g, "").trim();
    return response;
  } catch (error) {
    console.error("Error in groq:", error);
    throw error;
  }
}

async function getGroqChatCompletion(meletop) {
  return await groqClient.chat.completions.create({
    messages: [
      {
        role: "user",
        content: meletop,
      },
    ],
    model: "deepseek-r1-distill-qwen-32b",
  });
}
