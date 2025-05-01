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

    const { apiKey } = req.query;
    
    if (!apiKey) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing apiKey parameter'
        });
    }
    
    try {
        await trackRequest("/api/tts/list-elevenlabs");
        const data = await listelevenlabs(apiKey);
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

async function listelevenlabs(apiKey) {
  try {
    const response = await axios.get("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": apiKey
      }
    });

    const voices = response.data.voices.map(voice => ({
      name: voice.name,
      voice_id: voice.voice_id
    }));

    return voices
  } catch (error) {
    console.error(error.response?.data);
  }
}
