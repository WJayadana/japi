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

    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing query parameter'
        });
    }
    
    try {
        await trackRequest("/api/tools/frombase64");
        const data = await fromBase64(query);
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

async function fromBase64(base64) {
    return Buffer.from(base64, 'base64').toString('utf-8');
}
