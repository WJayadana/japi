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

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing query parameter'
        });
    }
    
    try {
        await trackRequest("/api/search/sfilesearch");
        const result = await sfilesrc(query);
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

async function sfilesrc(teks) {
  try {
    const response = await axios.get(`https://sfile-api.vercel.app/search/${encodeURIComponent(teks)}`)
    if (response.data) {
      const {
        data
      } = response.data.data
      return {
        files: data.map(file => ({
          icon: file.icon,
          size: file.size,
          title: file.title,
          id: file.id
        }))
      }
    }
  } catch (e) {
    console.error('Error: ' + e)
    return e
  }
}
