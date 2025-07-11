import axios from "axios";
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

    const { text } = req.query;

    if (!text) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'missing text parameter'
        });
    }
    
    try {
        await trackRequest("/api/stalk/npmstalk");
        const result = await npmstalk(text);
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

async function npmstalk(packageName) {
  let stalk = await axios.get("https://registry.npmjs.org/"+packageName)
  let versions = stalk.data.versions
  let allver = Object.keys(versions)
  let verLatest = allver[allver.length-1]
  let verPublish = allver[0]
  let packageLatest = versions[verLatest]
  return {
    name: packageName,
    versionLatest: verLatest,
    versionPublish: verPublish,
    versionUpdate: allver.length,
    latestDependencies: Object.keys(packageLatest.dependencies).length,
    publishDependencies: Object.keys(versions[verPublish].dependencies).length,
    publishTime: stalk.data.time.created,
    latestPublishTime: stalk.data.time[verLatest]
  }
}
