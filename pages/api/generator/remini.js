import axios from "axios";
import FormData from "form-data";
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

    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: "missing url parameter"
        });
    }
    
    try {
        await trackRequest("/api/generator/remini");
        const imageBuffer = await getBuffer(url);
        if (!imageBuffer) {
            return res.status(500).json({
                status: false,
                creator: CREATOR,
                error: "Failed to fetch image",
            });
        }

        const processedImage = await remini(imageBuffer);
        
        res.setHeader("Content-Type", "image/jpeg");
        res.send(processedImage);
        
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

async function remini(imageBuffer, method = "enhance") {
    return new Promise((resolve, reject) => {
        const Methods = ["enhance", "recolor", "dehaze"];
        method = Methods.includes(method) ? method : Methods[0];

        let Form = new FormData();
        let scheme = `https://inferenceengine.vyro.ai/${method}`;

        Form.append("model_version", 1);
        Form.append("image", imageBuffer, {
            filename: "enhance_image_body.jpg",
            contentType: "image/jpeg",
        });

        Form.submit(
            {
                url: scheme,
                host: "inferenceengine.vyro.ai",
                path: `/${method}`,
                protocol: "https:",
                headers: {
                    "User-Agent": "okhttp/4.9.3",
                    Connection: "Keep-Alive",
                    "Accept-Encoding": "gzip",
                },
            },
            function (err, res) {
                if (err) return reject(err);

                let data = [];
                res.on("data", (chunk) => data.push(chunk));
                res.on("end", () => resolve(Buffer.concat(data)));
                res.on("error", (e) => reject(e));
            }
        );
    });
}

async function getBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        return response.data;
    } catch {
        return null;
    }
}
