import yts from "yt-search";
import fetch from "node-fetch";
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

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing query parameter'
        });
    }
    
    try {
        await trackRequest("/api/downloader/play");
        const result = await play(query);
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

async function play(query) {
    const searchResults = await yts(query);
    const videoUrl = searchResults.videos[0].url.replace(/https:\/\/www\.youtube\.com\/watch\?v=([^&]+)/, 'https://youtu.be/$1');
    return await ytdl(videoUrl);
}

async function ytdl(url) {
    const response = await fetch('https://youtube-quick-video-downloader.p.rapidapi.com/api/youtube/links', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-rapidapi-key': '3c04cb2d0amsh0e4e2f7ef0e3e0ep10f58ajsn8dc52e78f7fa',
            'x-rapidapi-host': 'youtube-quick-video-downloader.p.rapidapi.com',
            'X-Forwarded-For': '70.41.3.18',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
            'Referer': 'https://www.hirequotient.com/youtube-to-mp3'
        },
        body: JSON.stringify({ url })
    });

    return await response.json();
}
