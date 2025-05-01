import axios from 'axios';
import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR, mess } from '../../../settings';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
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
        await trackRequest("/api/downloader/ytmp3");
        const result = await ytmp3(url);
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: mess.error,
        });
    }
}

async function ytmp3(url) {
    const format = "mp3"; 
    const response = await axios.get(`https://youtubedownloader.me/api/download?format=${format}&url=${encodeURIComponent(url)}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
            "Referer": "https://youtubedownloader.me/"
        }
    });

    const videoId = response.data.id;

    let progress = 0;
    let downloadUrl = null;
    let attempt = 0;

    while (progress < 1000 && attempt < 20) {
        const progressResponse = await axios.get(`https://youtubedownloader.me/api/progress?id=${videoId}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
                "Referer": "https://youtubedownloader.me/"
            }
        });

        progress = progressResponse.data.progress;

        if (progress >= 1000) {
            downloadUrl = progressResponse.data.download_url;
            break;
        }

        attempt++;
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    return downloadUrl;
}
