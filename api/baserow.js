// api/baserow.js
import fetch from 'node-fetch';

const ALLOWED_ORIGINS = [
  'https://everypeople.org',
  'https://everypeople.org/test'
];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (!ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', 'null');
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
    return;
  }

  const TABLE_ID = '605120';
  const TOKEN = 's01mS0h0wRTMInFyr9USk4ehAz1x6K51';
  const url = `https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true&token=${TOKEN}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.status(200).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.status(500).json({ error: 'Failed to fetch data from Baserow' });
  }
}
