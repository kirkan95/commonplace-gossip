const TOKEN_KEY = 'cg_token'
const WORKER_URL = import.meta.env.VITE_WORKER_URL

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function login(password) {
  const res = await fetch(`${WORKER_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })

  if (!res.ok) return false

  const { token } = await res.json()
  localStorage.setItem(TOKEN_KEY, token)
  return true
}

export async function fetchAudioUrls(episodeFiles) {
  const token = getToken()
  if (!token) return null

  const res = await fetch(`${WORKER_URL}/audio-urls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ files: episodeFiles }),
  })

  if (res.status === 401) {
    clearToken()
    return null
  }

  if (!res.ok) return null

  return res.json()
}
