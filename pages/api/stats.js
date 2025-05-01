import { getAllRequestCounts } from "../../lib/redis";
import { CREATOR } from "../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed"
        });
    }

    try {
        const totalRequests = await getAllRequestCounts();
        res.status(200).json({
            status: true,
            creator: CREATOR,
            totalRequests
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error"
        });
    }
}
