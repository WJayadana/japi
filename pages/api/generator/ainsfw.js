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
        await trackRequest("/api/generator/ainsfw");
        const nsfwData = await nsfwgenerator(prompt);
        if (!nsfwData?.linkImage) {
            return res.status(500).json({
                status: false,
                creator: CREATOR,
                error: "Failed to fetch image URL",
            });
        }

        const imageBuffer = await getBuffer(nsfwData.linkImage);
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

async function nsfwgenerator(prompt) {
    try {
        const { data: nsfw } = await axios.get(
            `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(prompt)}&aspect_ratio=Select Aspect Ratio&link=writecream.com`
        );
        return { linkImage: nsfw.image_link };
    } catch {
        return null;
    }
}

async function getBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        return response.data;
    } catch {
        return null;
    }
}
