import fetch from 'node-fetch';
import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR, mess } from '../../../settings';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: mess.method,
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
        await trackRequest("/api/downloader/mediafire");
        const result = await mediaFire(url);
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: mess.error,
        });
    }
}

async function mediaFire(url) {
  try {
    const response = await fetch('https://r.jina.ai/' + url, {
      headers: {
        'x-return-format': 'html',
      }
    });
    const text = await response.text();
    const $ = cheerio.load(text);
  
    const Time = $('div.DLExtraInfo-uploadLocation div.DLExtraInfo-sectionDetails').text().match(/This file was uploaded from (.*?) on (.*?) at (.*?)\n/);
    const result = {
      title: $('div.dl-btn-label').text().trim(),
      link: $('div.dl-utility-nav a').attr('href'),
      filename: $('div.dl-btn-label').attr('title'),
      url: $('a#downloadButton').attr('href'),
      size: $('a#downloadButton').text().match(/\((.*?)\)/)[1],
      from: Time[1],
      date: Time[2],
      time: Time[3],
      map: {
        background: "https://static.mediafire.com/images/backgrounds/download/additional_content/world.svg",
        region: "https://static.mediafire.com/images/backgrounds/download/additional_content/"+$('div.DLExtraInfo-uploadLocationRegion').attr('data-lazyclass')+".svg",
      },
      repair: $('a.retry').attr('href'),
    };
    
    return result;
  } catch (error) {
    return { error: error.message };
  }
}
