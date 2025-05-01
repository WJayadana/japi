import axios from "axios";
import fs from "fs/promises";
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

    const { id, zone } = req.query;

    if (!id) {
        return res.status(400).json({ 
            status: false, 
            creator: CREATOR, 
            error: 'Missing id parameter' 
        });
    }
    if (!zone) {
        return res.status(400).json({ 
            status: false, 
            creator: CREATOR, 
            error: 'Missing zone parameter' 
        });
    }

    try {
        await trackRequest("/api/stalk/mlstalk");
        const result = await mlStalk(id, zone);
        res.status(200).json({
            status: true, 
            creator: CREATOR, 
            data: result 
        });
    } catch (error) {
        res.status(500).json({
            status: false, 
            creator: CREATOR,
            error: 'Internal Server Error'
        });
    }
}

async function getToken(url) {
    try {
        const response = await axios.get(url);
        const cookies = response.headers["set-cookie"];
        const joinedCookies = cookies ? cookies.join("; ") : null;

        const csrfTokenMatch = response.data.match(
            /<meta name="csrf-token" content="(.*?)">/);
        const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : null;

        if (!csrfToken || !joinedCookies) {
            throw new Error("Gagal mendapatkan CSRF token atau cookie.");
        }

        return {
            csrfToken,
            joinedCookies
        };
    } catch (error) {
        console.error("❌ Error fetching cookies or CSRF token:", error
            .message);
        throw error;
    }
}

async function mlStalk(userId, zoneId) {
    try {
        const {
            csrfToken,
            joinedCookies
        } = await getToken("https://www.gempaytopup.com");

        const payload = {
            uid: userId,
            zone: zoneId,
        };

        const {
            data
        } = await axios.post(
            "https://www.gempaytopup.com/stalk-ml",
            payload, {
                headers: {
                    "X-CSRF-Token": csrfToken,
                    "Content-Type": "application/json",
                    Cookie: joinedCookies,
                },
            }
        );

        return data
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("Response:", error.response?.data ||
            "No response data");
    }
}
