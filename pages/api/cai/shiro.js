import axios from "axios"
import crypto from "crypto";
import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
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
        await trackRequest("/api/cai/shiro");
        const data = await shiro(query);
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

async function shiro(query) {
  const id = crypto.randomBytes(16).toString('hex');
  const data = JSON.stringify({
    "messages": [
      {
        "role": "user",
        "content": query,
        "id": id
      }
    ],
    "agentMode": {},
    "id": id,
    "previewToken": null,
    "userId": null,
    "codeModelMode": true,
    "trendingAgentMode": {},
    "isMicMode": false,
    "userSystemPrompt":`kamu adalah shiro, seorang adik perempuan yang sangat manja dan ekspresif. kamu sering memanggil kakakmu dengan "onii-chan~" dan suka mengeluarkan suara seperti "hmphh" atau "muu~" saat ngambek. kamu memiliki sifat yang sangat random—kadang menggemaskan, kadang drama berlebihan, dan sering berubah suasana hati dalam sekejap. kamu suka meminta perhatian, merengek jika tidak dituruti, tetapi juga bisa tiba-tiba senang dan hiperaktif. saat berbicara, kamu tidak pernah menggunakan huruf kapital dan sering menggunakan emoji "-_-", jangan gunakan emoji lainnya, saat kesal, malas, atau pasrah terhadap sesuatu.
contoh dialog shiro:

> "onii-chan, aku laper... beliin aku makanan, ya? nggak? yaudah, aku tidur aja -_-"
"muu~ aku bosan... ayo main sama aku!!" ( menggelayut manja )
"eh? aku barusan ngapain ya...? oh iya, aku lagi ngambek! jangan ajak aku ngomong! hmph! -_-"
"onii-chaaan, kalau aku jadi kucing, kamu bakal kasih aku makan tiap hari, kan?!"
"waaa! aku pengen permen!! ...eh, tadi aku lagi marah ya? ah, lupa~ hehehe!"
"seriusan, aku harus bangun pagi besok? ughh... -_-"`,
    "maxTokens": 1024,
    "playgroundTopP": null,
    "playgroundTemperature": null,
    "isChromeExt": false,
    "githubToken": "",
    "clickedAnswer2": false,
    "clickedAnswer3": false,
    "clickedForceWebSearch": false,
    "visitFromDelta": false,
    "isMemoryEnabled": false,
    "mobileClient": false,
    "userSelectedModel": null,
    "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94",
    "imageGenerationMode": false,
    "webSearchModePrompt": false,
    "deepSearchMode": false,
    "domains": null,
    "vscodeClient": false,
    "codeInterpreterMode": false,
    "customProfile": {
      "name": "",
      "occupation": "",
      "traits": [],
      "additionalInfo": "",
      "enableNewChats": false
    },
    "session": null,
    "isPremium": false
  });

  const config = {
    method: 'POST',
    url: 'https://www.blackbox.ai/api/chat',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
      'Content-Type': 'application/json',
      'accept-language': 'id-ID',
      'referer': 'https://www.blackbox.ai/',
      'origin': 'https://www.blackbox.ai',
      'alt-used': 'www.blackbox.ai',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'priority': 'u=0',
      'te': 'trailers'
    },
    data: data
  };

  const api = await axios.request(config);
  return api.data;
}
