// Vercel Serverless Function — Notion API Proxy
// Solves CORS by proxying browser requests to Notion's API
// Environment variable: NOTION_TOKEN (set in Vercel dashboard)

export default async function handler(req, res) {
  // CORS headers — allow your GitHub Pages + Vercel domains
  const origin = req.headers.origin || '';
  const allowed = [
    'https://hexagana.github.io',
    'http://localhost',
    'http://127.0.0.1',
  ];
  const isAllowed = allowed.some(o => origin.startsWith(o)) || origin.includes('.vercel.app');
  
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : allowed[0]);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  if (!NOTION_TOKEN) {
    return res.status(500).json({ error: 'NOTION_TOKEN not configured' });
  }

  try {
    const { action, database_id, code, folder_link, class_name } = req.body;

    if (action === 'query') {
      // Look up a code
      const resp = await fetch(`https://api.notion.com/v1/databases/${database_id}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          filter: {
            and: [
              { property: "Code", title: { equals: code } },
              { property: "Status", select: { equals: "Active" } },
            ],
          },
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(resp.status).json({ error: errText });
      }

      const data = await resp.json();
      
      // Return simplified result
      const results = (data.results || []).map(r => ({
        folder_link: r.properties["Folder Link"]?.url || null,
        class_name: r.properties["Class Name"]?.rich_text?.[0]?.plain_text || '',
        status: r.properties["Status"]?.select?.name || '',
      }));

      return res.status(200).json({ results });

    } else if (action === 'create') {
      // Create a new code entry
      const props = {
        "Code": { title: [{ text: { content: code } }] },
        "Folder Link": { url: folder_link },
        "Status": { select: { name: "Active" } },
      };
      if (class_name) {
        props["Class Name"] = { rich_text: [{ text: { content: class_name } }] };
      }

      const resp = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          parent: { database_id },
          properties: props,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(resp.status).json({ error: errText });
      }

      return res.status(200).json({ success: true });

    } else {
      return res.status(400).json({ error: 'Invalid action. Use "query" or "create".' });
    }

  } catch (err) {
    console.error('Notion proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
