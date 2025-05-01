import axios from "axios";
import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR } from '../../../settings';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id } = req.body;

    try {
      await trackRequest("/api/stalk/ffstalk");
      const result = await ffStalk(id);
      res.status(200).json({
        status: true,
        creator: CREATOR,
        data: result 
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        creator: CREATOR,
        error: error.message || 'Internal Server Error'
      });
    }
  } else {
    res.status(405).json({ 
      status: false, 
      creator: CREATOR, 
      error: 'Method Not Allowed'
    });
  }
}

async function ffStalk(userId) {
    try {
        const payload = {
            campaignUrl: "",
            catalogId: 68,
            gameId: userId,
            itemId: 13,
            paymentId: 752,
            productId: 3,
            product_ref: "REG",
            product_ref_denom: "REG"
        };

        const url =
            "https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store";

        const {
            data
        } = await axios.post(url, payload);

        const gameDetail = [{
            userId,
            userName: data?.data?.gameDetail?.userName || "Unknown"
        }];

        return gameDetail;
    } catch (error) {
        console.error(error);
        return [];
    }
}
