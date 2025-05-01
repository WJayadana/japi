import axios from "axios"
import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { text, apiKey, voiceId } = req.query;

    if (!text) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing text parameter'
        });
    }
    
    if (!apiKey) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing apiKey parameter'
        });
    }
    
    if (!voiceId) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing voiceId parameter'
        });
    }
    
    try {
        await trackRequest("/api/tts/elevenlabs");
        const data = await elevenlabs(text, apiKey, voiceId);
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

async function elevenlabs(text, apiKey, voiceId) {
  const modelId = "eleven_flash_v2_5";
  try {
    const response = await axios.post(
      `https://api.us.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      { text, model_id: modelId },
      {
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error(error.response.data);
    throw new Error(error.message);
  }
}
