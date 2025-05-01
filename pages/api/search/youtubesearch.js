import yts from "yt-search";
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
        await trackRequest("/api/search/youtubesearch");
        const data = await ytsearch(query);
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

async function ytsearch(query) {
    try {
        const result = await yts(query);
        if (!result.videos.length) {
            return 'Tidak ada hasil yang ditemukan';
        }
        
        return result.videos.map(video => ({
            title: video.title,
            url: video.url,
            duration: video.timestamp,
            views: video.views,
            author: video.author.name
        }));
    } catch (error) {
        console.error(error);
        return 'Terjadi kesalahan saat mencari video';
    }
}
