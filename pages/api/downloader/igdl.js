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

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing url parameter'
        });
    }
    
    try {
        await trackRequest("/api/downloader/igdl");
        const result = await igdl(url);
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

  async function igdl(query) {
    try {
      const response = await fetch(`https://api.siputzx.my.id/api/d/igdl?url=${query}`);
      const result = await response.json();

      if (result.status && Array.isArray(result.data) && result.data.length > 0) {
        return result.data.map(({ thumbnail, url }) => ({ thumbnail, url }));
      }

      return [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
