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
        await trackRequest("/api/downloader/spotifydl");
        const result = await spotipai(url);
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

async function spotipai(url) {
    const trackRes = await axios.get(
        `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`
    );

    const trackData = trackRes.data.result;
    const { id, name, image, artists, gid } = trackData;

    const taskRes = await axios.get(
        `https://api.fabdl.com/spotify/mp3-convert-task/${gid}/${id}`
    );

    const taskData = taskRes.data.result;
    const { tid } = taskData;

    const progressRes = await axios.get(
        `https://api.fabdl.com/spotify/mp3-convert-progress/${tid}`
    );

    const progressData = progressRes.data.result;
    const { download_url } = progressData;

    return { 
        title: name,
        artist: artists, 
        cover: image,
        downloadUrl: `https://api.fabdl.com${download_url}`
  };
}
