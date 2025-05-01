import axios from "axios";
import fetch from "node-fetch";
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

    const { html } = req.query;
    
    if (!html) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: "missing html parameter"
        });
    }
    
    try {
        await trackRequest("/api/generator/htmltopng");
        const htmlnya = await htmltopng(html);
        if (!htmlnya) {
            return res.status(500).json({
                status: false,
                creator: CREATOR,
                error: "Failed to fetch image URL",
            });
        }

        const imageBuffer = await getBuffer(htmlnya);
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

async function htmltopng(html) {
    const response = await fetch('https://img-gen.uibun.dev/api/htmltoimg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
            'Referer': 'https://www.uibun.dev/htmltopng'
        },
        body: JSON.stringify({ html })
    });
    return await response.buffer();
}

async function getBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        return response.data;
    } catch {
        return null;
    }
}
