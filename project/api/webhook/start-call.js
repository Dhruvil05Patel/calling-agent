// Serverless proxy for Vercel: forwards POST requests to the configured n8n webhook.
// Set the environment variable N8N_WEBHOOK_URL (in Vercel dashboard) to your n8n webhook
// e.g. https://voice1agent.app.n8n.cloud/webhook/start-call

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const target = process.env.N8N_WEBHOOK_URL || process.env.VITE_N8N_WEBHOOK_URL
  if (!target) {
    return res.status(500).json({ error: 'N8N webhook URL is not configured on the server (N8N_WEBHOOK_URL)' })
  }

  try {
    // Forward the incoming request body to the n8n webhook
    const forwarded = await fetch(target, {
      method: 'POST',
      headers: {
        // preserve content-type where possible
        'content-type': req.headers['content-type'] || 'application/json',
      },
      // Vercel parses JSON bodies automatically and exposes req.body
      body: JSON.stringify(req.body),
    })

    const text = await forwarded.text()
    const contentType = forwarded.headers.get('content-type') || ''

    // Return proxied response (as JSON) so client gets confirmation/status
    if (contentType.includes('application/json')) {
      try {
        const json = JSON.parse(text)
        return res.status(forwarded.status).json({ ok: forwarded.ok, status: forwarded.status, data: json })
      } catch (e) {
        // fallback to text
      }
    }

    return res.status(forwarded.status).json({ ok: forwarded.ok, status: forwarded.status, data: text })
  } catch (err) {
    console.error('Proxy error forwarding to n8n:', err)
    return res.status(502).json({ error: 'Failed to forward request', detail: String(err) })
  }
}
