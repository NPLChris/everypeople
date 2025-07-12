export default async function handler(req, res) {
  // Get token from Authorization header or ?token query param
  const clientToken =
    req.headers['authorization']?.replace('Bearer ', '') || req.query.token;

  const EXPECTED_CLIENT_TOKEN = process.env.CLIENT_TOKEN;

  if (clientToken !== EXPECTED_CLIENT_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const BASEROW_API_URL = 'https://api.baserow.io/api/database/rows/table/{YOUR_TABLE_ID}/?user_field_names=true';
  const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN;

  try {
    const baserowResponse = await fetch(BASEROW_API_URL, {
      headers: {
        Authorization: `Token ${BASEROW_API_TOKEN}`,
      },
    });

    if (!baserowResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch Baserow data.' });
    }

    const data = await baserowResponse.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Server error.', details: err.message });
  }
}
