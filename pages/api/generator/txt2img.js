import axios from "axios";
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

    const { prompt } = req.query;
    
    if (!prompt) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: "missing prompt parameter"
        });
    }
    
    try {
        await trackRequest("/api/generator/txt2img");
        const txt2img = await cimage(prompt);
        if (!txt2img?.image_link) {
            return res.status(500).json({
                status: false,
                creator: CREATOR,
                error: "Failed to fetch image URL",
            });
        }

        const imageBuffer = await getBuffer(txt2img.image_link);
        if (!imageBuffer) {
            return res.status(500).json({
                status: false,
                creator: CREATOR,
                error: "Failed to fetch image",
            });
        }

        res.setHeader("Content-Type", "image/jpeg");
        res.send(imageBuffer);
        
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

async function cimage(prompt, ratio = "1:1") {
    const url = `https:///www.ai4chat.co/api/image/generate?prompt=${encodeURIComponent(prompt)}&aspect_ratio=${ratio}`;
    const response = await fetch(url);
    return response.json();
}

const aspectRatios = [
"1:1", "16:9", "2:3", "3:2", "4:5", "5:4", "9:16", "21:9", "9:21" 
];


async function getBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        return response.data;
    } catch {
        return null;
    }
}
