// Cloudflare Worker — handles auth and R2 pre-signed URL generation
//
// Environment variables (set in Cloudflare dashboard or wrangler.toml secrets):
//   PASSWORD      — the shared password
//   TOKEN_SECRET  — a long random string used to sign tokens
//   R2_BUCKET     — bound R2 bucket (binding name, not a string var)
//   ALLOWED_ORIGIN — your GitHub Pages URL, e.g. https://username.github.io

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const allowedOrigin = env.ALLOWED_ORIGIN || '*'

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)

    if (url.pathname === '/auth' && request.method === 'POST') {
      return handleAuth(request, env, corsHeaders)
    }

    if (url.pathname === '/audio-urls' && request.method === 'POST') {
      return handleAudioUrls(request, env, corsHeaders)
    }

    if (url.pathname.startsWith('/audio/') && request.method === 'GET') {
      return handleAudio(request, env, corsHeaders)
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  },
}

async function handleAuth(request, env, corsHeaders) {
  let body
  try { body = await request.json() } catch { return json({ error: 'bad request' }, 400, corsHeaders) }

  if (body.password !== env.PASSWORD) {
    return json({ error: 'unauthorized' }, 401, corsHeaders)
  }

  const token = await makeToken(env.TOKEN_SECRET)
  return json({ token }, 200, corsHeaders)
}

async function handleAudioUrls(request, env, corsHeaders) {
  const authHeader = request.headers.get('Authorization') || ''
  const token = authHeader.replace('Bearer ', '')

  const valid = await verifyToken(token, env.TOKEN_SECRET)
  if (!valid) return json({ error: 'unauthorized' }, 401, corsHeaders)

  let body
  try { body = await request.json() } catch { return json({ error: 'bad request' }, 400, corsHeaders) }

  const files = body.files
  if (!Array.isArray(files)) return json({ error: 'bad request' }, 400, corsHeaders)

  const reqUrl = new URL(request.url)
  const baseUrl = `${reqUrl.protocol}//${reqUrl.host}`
  const urls = {}
  for (const file of files) {
    urls[file] = `${baseUrl}/audio/${file}?token=${encodeURIComponent(token)}`
  }

  return json(urls, 200, corsHeaders)
}

async function handleAudio(request, env, corsHeaders) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  const valid = await verifyToken(token, env.TOKEN_SECRET)
  if (!valid) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  const filename = url.pathname.slice('/audio/'.length)
  if (!filename || filename.includes('/') || filename.includes('..')) {
    return new Response('Not found', { status: 404, headers: corsHeaders })
  }

  const object = await env.R2_BUCKET.get(filename, { range: request.headers })
  if (!object) return new Response('Not found', { status: 404, headers: corsHeaders })

  const headers = new Headers(corsHeaders)
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('accept-ranges', 'bytes')

  if (object.range) {
    const { offset, length } = object.range
    headers.set('content-range', `bytes ${offset}-${offset + length - 1}/${object.size}`)
    return new Response(object.body, { status: 206, headers })
  }

  return new Response(object.body, { status: 200, headers })
}

// ─── Token helpers ────────────────────────────────────────────

async function makeToken(secret) {
  const payload = Date.now().toString()
  const sig = await hmac(secret, payload)
  return btoa(`${payload}:${sig}`)
}

async function verifyToken(token, secret) {
  try {
    const decoded = atob(token)
    const [timestamp, sig] = decoded.split(':')
    const age = Date.now() - parseInt(timestamp)
    if (age > TOKEN_TTL_MS || age < 0) return false
    const expected = await hmac(secret, timestamp)
    return sig === expected
  } catch {
    return false
  }
}

async function hmac(secret, message) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  })
}
