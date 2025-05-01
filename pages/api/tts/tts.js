import fetch from "node-fetch"
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

    const { text } = req.query;

    if (!text) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing text parameter'
        });
    }
    
    try {
        await trackRequest("/api/tts/tts");
        const data = await tts(text);
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

async function tts(text) {
    let response = await fetch("https://api.soundoftext.com/sounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ engine: "Google", data: { text, voice: "en-US" } }),
    });

    let data = await response.json();
    let statusUrl = `https://api.soundoftext.com/sounds/${data.id}`;

    let status;
    do {
        await new Promise(res => setTimeout(res, 2000));
        let statusRes = await fetch(statusUrl);
        status = await statusRes.json();
    } while (status.status !== "Done");
    return status.location;
}
