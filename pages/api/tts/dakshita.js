import axios from "axios"
import qs from "qs"
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
        await trackRequest("/api/tts/dakshita");
        const data = await ttsDakshita(text);
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

async function ttsDakshita(text) {
    try {
        const data = qs.stringify({
            lang: 'id-ID',
            text: text,
            voiceId: 'waveltts_309de86f-2324-411f-ab8a-f8689455ec26'
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
            'Referer': 'https://wavel.ai/solutions/text-to-speech/anime-text-to-speech'
        };

        const response = await axios.post('https://wavel.ai/wp-json/custom/v1/synthesize-audio', data, { headers });

        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}
