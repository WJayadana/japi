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

    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing query parameter'
        });
    }
    
    try {
        await trackRequest("/api/ai/heckai");
        const data = await ai(query);
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

async function ai(teks) {
    const sessionResponse = await fetch("https://api.heckai.weight-wave.com/api/ha/v1/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: teks })
    });

    const sessionData = await sessionResponse.json();
    const sessionId = sessionData.id;

    const chatResponse = await fetch("https://api.heckai.weight-wave.com/api/ha/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "google/gemini-2.0-flash-001",
            question: teks,
            language: "English",
            sessionId: sessionId,
            previousQuestion: null,
            previousAnswer: null
        })
    });

    const result = await chatResponse.text();
    const match = result.match(/data: (.*?)\n/g);

    return match
        ? match.map(line => line.replace("data: ", "").trim())
            .filter(line => !line.startsWith("[") && line !== "")
            .join(" ")
            .replace(/✩/g, "")
            .trim()
        : "Jawaban tidak ditemukan.";
}
