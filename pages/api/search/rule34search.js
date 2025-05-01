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

    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing query parameter'
        });
    }
    
    try {
        await trackRequest("/api/search/rule34search");
        const data = await r34search(query);
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

 async function r34search(q) {
        try {
            let gtww = q.toLowerCase().replace(/\s+/g, '_')
            let random = Math.floor(Math.random() * 20) + 1
            let { data } = await axios.get(`https://api.rule34.xxx/index.php?page=dapi&s=post&tags=${gtww}&pid=${random}&q=index&json=1`)
            const piw = []
            data.map(res => {
                piw.push({
                    imageUrl: res.file_url,
                    uploader: res.owner,
                    source: res.source
                })
            })
            return piw
        } catch (error) {
            console.error(error.message)
            return []
        }
    }
