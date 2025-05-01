import fetch from 'node-fetch';
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

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing query parameter'
        });
    }
    
    try {
        await trackRequest("/api/search/wikipedia");
        const result = await wikipedia(query);
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

async function wikipedia(teks) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${teks}`
    )
    const data = await response.json()
    return data.query.search.map((item) => ({
      judul: item.title,
      desk: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
      link: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
    }))
  } catch (e) {
    console.error(e)
    return []
  }
}
