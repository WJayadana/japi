import axios from 'axios';
import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR } from '../../../settings';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: 'Method Not Allowed',
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
        await trackRequest("/api/downloader/threadsdl");
        const result = await threadsdl(url);
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: 'Internal Server Error',
        });
    }
}

async function threadsdl(url) {
    try {
        const apiUrl = `https://api.threadsphotodownloader.com/v2/media?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, {
            headers: {
                'Accept': '*/*'
            }
        });
        
        const data = response.data;
        
        if (data.image_urls.length > 0) {
            return { type: 'image', urls: data.image_urls };
        } else if (data.video_urls.length > 0) {
            return { type: 'video', urls: data.video_urls.map(v => v.download_url) };
        } else {
            return { type: 'unknown', urls: [] };
        }
    } catch (error) {
        return { error: error.message };
    }
}
