
export default async function handler(req, res) {
  const allowedOrigins = [
    'https://www.everypeople.org',
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientToken =
    req.headers['authorization']?.replace('Bearer ', '') || req.query.token;

  const EXPECTED_CLIENT_TOKEN = process.env.CLIENT_TOKEN;

  if (clientToken !== EXPECTED_CLIENT_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const BASEROW_API_URL = 'https://api.baserow.io/api/database/rows/table/605120/?user_field_names=true';
  const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN;

  try {
  const baserowResponse = await fetch(BASEROW_API_URL, {
    headers: {
      Authorization: `Token ${BASEROW_API_TOKEN}`,
    },
  });

  const responseText = await baserowResponse.text();

  if (!baserowResponse.ok) {
     return res.status(500).json({ 
        error: 'Failed to fetch Baserow data.', 
     details: responseText 
    });
  }

  const data = JSON.parse(responseText);
  return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Server error.', details: err.message });
  }

console.log('clientToken:', clientToken);
console.log('EXPECTED_CLIENT_TOKEN:', EXPECTED_CLIENT_TOKEN);

if (clientToken !== EXPECTED_CLIENT_TOKEN) {
  return res.status(401).json({ 
    error: 'Unauthorized',
    clientTokenReceived: clientToken,
    expected: EXPECTED_CLIENT_TOKEN
  });
}
}
