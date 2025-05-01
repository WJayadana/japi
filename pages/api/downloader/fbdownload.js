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
        await trackRequest("/api/downloader/fbdownload");
        const result = await fbdl(url);
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

async function fbdl(url) {
  try {
    const response = await axios.post('https://snapsave.io/api/ajaxSearch', null, {
      params: {
        p: 'home',
        q: url,
        lang: 'id',
        w: ''
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const data = response.data;
    if (data.status === 'ok') {
      const result = data.data.match(/<a href="(https:\/\/dl\.snapcdn\.app\/download[^"]+)"/);
      if (result && result[1]) {
        return result[1];
      }
    }

    return 'Tidak ditemukan link download.';
  } catch (error) {
    return 'Terjadi kesalahan.';
  }
}
