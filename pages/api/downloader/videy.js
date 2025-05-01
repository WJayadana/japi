import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR } from "../../../settings";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { text } = req.body;

    try {
      await trackRequest("/api/downloader/videy");
      const result = await vdown(text);
      res.status(200).json({
        status: true,
        creator: CREATOR,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        creator: CREATOR,
        error: error.message || "Internal Server Error",
      });
    }
  } else {
    res.status(405).json({
      status: false,
      creator: CREATOR,
      error: "Method Not Allowed",
    });
  }
}

async function vdown(url) {
  try {
    let match = url.match(/https:\/\/videy\.co\/v\?id=([\w\d]+)/);
    if (match) {
      let videoId = match[1];
      let newUrl = `https://cdn.videy.co/${videoId}.mp4`;
      return newUrl;
    } else {
      throw new Error("URL tidak valid atau tidak sesuai format");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
