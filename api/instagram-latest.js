export default async function handler(req, res) {
  const token = process.env.INSTAGRAM_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'INSTAGRAM_TOKEN not set' });
  }

  try {
    const r = await fetch(
      `https://graph.instagram.com/me/media` +
      `?fields=id,media_type,media_url,thumbnail_url,permalink,timestamp,caption` +
      `&limit=1&access_token=${token}`
    );
    const data = await r.json();

    if (!r.ok || !data.data?.length) {
      return res.status(502).json({ error: 'Instagram API error', detail: data });
    }

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json(data.data[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed' });
  }
}
