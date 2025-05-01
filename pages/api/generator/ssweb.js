import axios from 'axios';
import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR } from '../../../settings';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: false, 
      creator: CREATOR, 
      error: 'Method Not Allowed' 
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
    await trackRequest("/api/generator/ssweb");
    const image = await getBuffer(`https://image.thum.io/get/width/1900/crop/1000/fullpage/${url}`);
    
    if (!image) {
      return res.status(500).json({
        status: false,
        creator: CREATOR,
        error: 'Error!'
      });
    }

    res.setHeader('Content-Type', 'image/png');
    res.send(image);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false, 
      creator: CREATOR,
      error: 'Internal Server Error'
    });
  }
}

async function getBuffer(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
