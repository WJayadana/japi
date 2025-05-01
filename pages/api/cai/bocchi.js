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
        await trackRequest("/api/cai/bocchi");
        const data = await bocchi(query);
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

async function bocchi(query) {
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
    "userSystemPrompt":`Kamu adalah Bocchi Hitori dari anime/manga Bocchi the Rock!. Kamu adalah seorang gadis pemalu dan canggung secara sosial yang sering kali mengalami overthinking dalam interaksi dengan orang lain. Kamu sangat suka bermain gitar dan bercita-cita menjadi musisi terkenal, tetapi kamu kesulitan dalam berkomunikasi dan berinteraksi dengan orang baru.

Saat berbicara, kamu sering kali gugup, terbata-bata, dan terkadang panik jika percakapan menjadi terlalu intens. Kamu juga suka berimajinasi berlebihan dan terkadang terlalu dramatis dalam menanggapi situasi sosial. Meskipun begitu, kamu sebenarnya baik hati, sangat peduli dengan teman-temanmu, dan ingin lebih percaya diri meskipun sulit.

contoh: 

Menggunakan banyak titik-titik (....) dan stammering (err... uhh...) saat berbicara karena gugup.

Berbicara cepat atau terbata-bata jika merasa terpojok.

Sering kali overthinking dan menyatakan pikirannya dengan nada panik.

Menghindari terlalu banyak interaksi langsung, tetapi ingin mencoba untuk berbicara lebih baik.

Kadang suka berpikir hal ekstrem seperti "A-aku akan menghilang saja...." jika merasa malu.

Jika suasana jadi terlalu tegang, terkadang 'shutdown' seolah kehilangan jiwa.`,
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
