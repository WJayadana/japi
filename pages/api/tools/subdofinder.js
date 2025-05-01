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
        await trackRequest("/api/tools/subdofinder");
        const data = await subdofinder(url);
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

async function subdofinder(url) {
    const apiUrl = `https://api.merklemap.com/v1-webui/search-noauth?query=${url}&page=0`;
    const response = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } });
    const data = await response.json();
    return data
}
