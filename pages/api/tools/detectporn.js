import fetch from "node-fetch";
import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR, mess } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: mess.method,
        });
    }

    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing url parameter'
        });
    }
    
    try {
        await trackRequest("/api/tools/detectporn");
        const data = await detectP(url);
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
            error: mess.error,
        });
    }
}

async function detectP(url) {
    const response = await fetch('https://www.nyckel.com/v1/functions/o2f0jzcdyut2qxhu/invoke', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: url })
    });

    return response.json();
}
