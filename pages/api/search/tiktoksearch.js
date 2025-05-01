import axios from "axios"
import FormData from "form-data"
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

    const { query, count} = req.query;
    
    if (!query) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing query parameter'
        });
    }

    if (!count) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing count parameter'
        });
      }
    
    try {
        await trackRequest("/api/search/tiktoksearch");
        const data = await ttSearch(query, count);
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

const ttSearch = async (query, count) => {
    try {
        let d = new FormData();
        d.append("keywords", query);
        d.append("count", count);
        d.append("cursor", 0);
        d.append("web", 1);
        d.append("hd", 1);

        let h = {
            headers: {
                ...d.getHeaders()
            }
        }

        let { data } = await axios.post("https://tikwm.com/api/feed/search", d, h);

        const baseURL = "https://tikwm.com";

        const videos = data.data.videos.map(video => {
            return {
                ...video,
                play: baseURL + video.play,
                wmplay: baseURL + video.wmplay,
                music: baseURL + video.music,
                cover: baseURL + video.cover,
                avatar: baseURL + video.avatar
            };
        });

        return videos;
    } catch (e) {
        console.log(e);
    }
}
