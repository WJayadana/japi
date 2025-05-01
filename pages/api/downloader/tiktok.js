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

    // Ambil data video dari respons API
    const videos = response.data.data;

    // Fungsi untuk mengonversi Unix timestamp ke format tanggal dan waktu
    function formatUnixTime(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000); // Konversi ke milidetik
      return date.toLocaleString(); // Contoh output: "5/1/2025, 8:45:20 PM"
    }

    // Format create_time jika tersedia
    const formattedCreateTime = videos.create_time ? formatUnixTime(videos.create_time) : null;

    // Menyusun hasil secara eksplisit satu per satu
    const result = {
      id: videos.id || '',
      region: videos.region || '',
      title: videos.title || '',
      cover: videos.cover || '',
      ai_dynamic_cover: videos.ai_dynamic_cover || '',
      origin_cover: videos.origin_cover || '',
      // duration: videos.duration || 0,
      duration: videos.duration !== undefined ? formatDuration(videos.duration) : '0:00',
      play: videos.play || '',
      wmplay: videos.wmplay || '',
      hdplay: videos.hdplay || '',
      size: videos.size || 0,
      wm_size: videos.wm_size || 0,
      music: videos.music || '',
      music_info: {
        id: videos.music_info?.id || '',
        title: videos.music_info?.title || '',
        play: videos.music_info?.play || '',
        cover: videos.music_info?.cover || '',
        author: videos.music_info?.author || '',
        original: videos.music_info?.original ?? false,
        duration: videos.music_info?.duration || 0,
        album: videos.music_info?.album || ''
      },
      play_count: videos.play_count || 0,
      digg_count: videos.digg_count || 0,
      comment_count: videos.comment_count || 0,
      share_count: videos.share_count || 0,
      download_count: videos.download_count || 0,
      collect_count: videos.collect_count || 0,
      create_time: videos.create_time || 0,
      create_time_formatted: formattedCreateTime,
      anchors: videos.anchors || null,
      anchors_extras: videos.anchors_extras || '',
      is_ad: videos.is_ad ?? false,
      commerce_info: {
        adv_promotable: videos.commerce_info?.adv_promotable ?? false,
        auction_ad_invited: videos.commerce_info?.auction_ad_invited ?? false,
        branded_content_type: videos.commerce_info?.branded_content_type || 0,
        organic_log_extra: videos.commerce_info?.organic_log_extra || '',
        with_comment_filter_words: videos.commerce_info?.with_comment_filter_words ?? false
      },
      commercial_video_info: videos.commercial_video_info || '',
      item_comment_settings: videos.item_comment_settings || 0,
      mentioned_users: videos.mentioned_users || '',
      author: {
        id: videos.author?.id || '',
        unique_id: videos.author?.unique_id || '',
        nickname: videos.author?.nickname || '',
        avatar: videos.author?.avatar || ''
      },
      images: videos.images || []
    };

    console.log(result);

    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch TikTok video.');
  }
}
