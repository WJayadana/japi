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
    await trackRequest("/api/downloader/tiktok");
    const result = await tiktok(url);
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

async function tiktok(query) {
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.set('url', query);
    encodedParams.set('hd', '1');

    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: encodedParams
    });

    // Ambil semua data dari respons API
    let result = response.data.data;

    // Fungsi untuk mengonversi Unix timestamp ke format tanggal dan waktu
    function formatUnixTime(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000); // Konversi ke milidetik
      return date.toLocaleString(); // Format sesuai lokal pengguna (misal: "5/1/2025, 8:45:20 PM")
    }

    // Konversi create_time ke format yang mudah dibaca
    if (result.create_time) {
      result.create_time = customFormat(result.create_time);
    }

    // Jika Anda ingin format khusus seperti "YYYY-MM-DD HH:mm:ss"
    function customFormat(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // Gunakan format khusus jika diinginkan
    // result.create_time = customFormat(result.create_time);

    // Sekarang result berisi semua data dari API dengan create_time yang telah diformat
    console.log(result);

    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch TikTok video.');
  }
}
