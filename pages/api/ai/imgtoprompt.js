import axios from "axios";
import multer from "multer"; 
import { promisify } from "util";
import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR } from "../../../settings";

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = promisify(upload.single("image"));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      creator: CREATOR,
      error: "Method Not Allowed",
    });
  }

  try {
    await uploadMiddleware(req, res);

    if (!req.file) {
      return res.status(400).json({
        status: false,
        creator: CREATOR,
        error: "No image file provided",
      });
    }

    const imageBase64 = req.file.buffer.toString("base64");
    await trackRequest("/api/ai/imgtoprompt");
    const result = await imageToPrompt(imageBase64);

    res.status(200).json({
      status: true,
      creator: CREATOR,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      creator: CREATOR,
      error: error.message || "Internal Server Error",
    });
  }
}

async function imageToPrompt(base64) {
  const { data } = await axios.post(
    "https://www.chat-mentor.com/api/ai/image-to-text/",
    {
      imageUrl: `data:image/jpeg;base64,${base64}`,
      prompt: "Generate a text prompt for this image, focusing on visual elements, style, and key features.",
    },
    {
      headers: {
        "content-type": "application/json",
        "origin": "https://www.chat-mentor.com",
        "referer": "https://www.chat-mentor.com/features/image-to-prompt/",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
      },
    }
  );
  return data;
}

export const config = {
  api: {
    bodyParser: false,
  },
};
