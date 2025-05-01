import axios from 'axios';
import fs from 'fs';
import crypto from 'crypto';
import FormData from 'form-data';
import QRCode from 'qrcode';
import bodyParser from 'body-parser';
import fetch from "node-fetch";
import { ImageUploadService } from 'node-upload-images';
import { trackRequest } from "../../../lib/redis";
import { API_KEY, CREATOR, mess } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            status: false, 
            creator: CREATOR, 
            error: mess.method
        });
    }

    const { merchant, keyorkut, apiKey } = req.query;
    
    if (!merchant) {
        return res.status(400).json({ 
            status: false,
            creator: CREATOR,
            error: 'Missing merchant parameter' 
        });
    }
    
    if (!keyorkut) {
        return res.status(400).json({
            status: false, 
            creator: CREATOR, 
            error: 'Missing keyorkut parameter' 
        });
    }

    if (!apiKey) {
        return res.status(400).json({ 
            status: false, 
            creator: CREATOR, 
            error: mess.apikey
        });
    }

    if (!API_KEY.includes(apiKey)) {
        return res.status(403).json({
            status: false, 
            creator: CREATOR, 
            error: mess.inapikey
        });
    }

    try {
        await trackRequest("/api/orkut/cekstatus");
        const apiUrl = `https://gateway.okeconnect.com/api/mutasi/qris/${merchant}/${keyorkut}`;
        const response = await axios.get(apiUrl);
        const result = await response.data;

        const latestTransaction = result.data && result.data.length > 0 ? result.data[0] : null;

        if (latestTransaction) {
            res.status(200).json({ 
                status: true,
                creator: CREATOR, 
                data: latestTransaction 
            });
            
        } else {
            res.status(404).json({ 
                status: false,
                creator: CREATOR, 
                error: 'No transactions found' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            status: false, 
            creator: CREATOR, 
            error: mess.error
        });
    }
}

function convertCRC16(str) {
    let crc = 0xFFFF;
    const strlen = str.length;

    for (let c = 0; c < strlen; c++) {
        crc ^= str.charCodeAt(c) << 8;

        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }

    let hex = crc & 0xFFFF;
    hex = ("000" + hex.toString(16).toUpperCase()).slice(-4);

    return hex;
}

function generateTransactionId() {
    return crypto.randomBytes(5).toString('hex').toUpperCase()
}

function generateExpirationTime() {
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30);
    return expirationTime;
}

async function elxyzFile(buffer) {
    return new Promise(async (resolve, reject) => {
        try {
const service = new ImageUploadService('pixhost.to');
let { directLink } = await service.uploadFromBinary(buffer, 'skyzo.png');
            resolve(directLink);
        } catch (error) {
            console.error('🚫 Upload Failed:', error);
            reject(error);
        }
    });
}

async function generateQRIS(amount) {
    try {
        let qrisData = "00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214611484868956040303UMI51440014ID.CO.QRIS.WWW0215ID20232956827930303UMI5204541153033605802ID5923KYUU OFFICIAL OK13789576004GOWA61059022562070703A016304613E";

        qrisData = qrisData.slice(0, -4);
        const step1 = qrisData.replace("010211", "010212");
        const step2 = step1.split("5802ID");

        amount = amount.toString();
        let uang = "54" + ("0" + amount.length).slice(-2) + amount;
        uang += "5802ID";

        const result = step2[0] + uang + step2[1] + convertCRC16(step2[0] + uang + step2[1]);

        const buffer = await QRCode.toBuffer(result);

        const uploadedFile = await elxyzFile(buffer);

        return {
            transactionId: generateTransactionId(),
            amount: amount,
            expirationTime: generateExpirationTime(),
            qrImageUrl: uploadedFile
        };
    } catch (error) {
        console.error('Error generating and uploading QR code:', error);
        throw error;
    }
}

async function createQRIS(amount, codeqr) {
    try {
        let qrisData = codeqr;

        qrisData = qrisData.slice(0, -4);
        const step1 = qrisData.replace("010211", "010212");
        const step2 = step1.split("5802ID");

        amount = amount.toString();
        let uang = "54" + ("0" + amount.length).slice(-2) + amount;
        uang += "5802ID";

        const result = step2[0] + uang + step2[1] + convertCRC16(step2[0] + uang + step2[1]);

        const buffer = await QRCode.toBuffer(result);

        const uploadedFile = await elxyzFile(buffer);

        return {
            transactionId: generateTransactionId(),
            amount: amount,
            expirationTime: generateExpirationTime(),
            qrImageUrl: uploadedFile
        };
    } catch (error) {
        console.error('Error generating and uploading QR code:', error);
        throw error;
    }
}

async function checkQRISStatus() {
    try {
        const apiUrl = `https://gateway.okeconnect.com/api/mutasi/qris/OK1378957/402321617332244571378957OKCT74874CF84BEC686F8916D8623BDE1FDF`;
        const response = await axios.get(apiUrl);
        const result = response.data;
        const data = result.data;
        let capt = '*Q R I S - M U T A S I*\n\n';
        if (data.length === 0) {
            capt += 'Tidak ada data mutasi.';
        } else {
            data.forEach(entry => {
                capt += '```Tanggal:```' + ` ${entry.date}\n`;
                capt += '```Issuer:```' + ` ${entry.brand_name}\n`;
                capt += '```Nominal:```' + ` Rp ${entry.amount}\n\n`;
            });
        }
        return capt;
    } catch (error) {
        console.error('Error checking QRIS status:', error);
        throw error;
    }
}
