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

  const { text, photo, name  } = req.query;

    if (!text) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing text parameter'
        });
    }
  
    if (!photo) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing photo parameter'
        });
    }
  
    if (!name) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing name parameter'
        });
    }
        
  try {
    await trackRequest("/api/generator/qc")
    const json = {
      "type": "quote",
      "format": "png",
      "backgroundColor": "#232023",
      "width": 512,
      "height": 768,
      "scale": 2,
      "messages": [
        {
          "entities": [],
          "avatar": true,
          "from": {
            "id": 1,
            "name": name,
            "photo": {
              "url": photo
            }
          },
          "text": text,
          "replyMessage": {}
        }
      ]
    };
    
    const penis = await axios.post('https://bot.lyo.su/quote/generate', json, {
    headers: {'Content-Type': 'application/json'}
    })
     
    if (!penis) {
      return res.status(500).json({
        status: false,
        creator: CREATOR,
        error: 'Error!'
      });
    }

    const image = Buffer.from(penis.data.result.image, 'base64');

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
