import { useState, useEffect } from 'react'
import { fetchAudioUrls, clearToken } from '../lib/auth'
import { episodes } from '../content/episodes'
import EpisodeCard from './EpisodeCard'
import styles from './MainPage.module.css'

export default function MainPage({ onLogout }) {
  const [audioUrls, setAudioUrls] = useState({})
  const [playingId, setPlayingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadUrls() {
      const files = episodes.map(ep => ep.audioFile)
      const urls = await fetchAudioUrls(files)

      if (!urls) {
        clearToken()
        onLogout()
        return
      }

      setAudioUrls(urls)
      setLoading(false)
    }

    loadUrls().catch(() => {
      setError(true)
      setLoading(false)
    })
  }, [onLogout])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.hblob1} />
        <div className={styles.hblob2} />
        <div className={styles.eyebrow}>A Defector Defection</div>
        <h1 className={styles.title}>Commonplace<br />Gossip</h1>
        <div className={styles.subtitle}>A Very Special Birthday Edition</div>
      </header>

      <main className={styles.list}>
        <div className={styles.sectionLabel}>{episodes.length} Episodes</div>

        {loading && <div className={styles.statusMsg}>Loading episodes...</div>}
        {error && <div className={styles.statusMsg}>Something went wrong. Try refreshing.</div>}

        {!loading && !error && episodes.map(ep => (
          <EpisodeCard
            key={ep.id}
            episode={ep}
            audioUrl={audioUrls[ep.audioFile]}
            isPlaying={playingId === ep.id}
            onPlay={setPlayingId}
          />
        ))}
      </main>
    </div>
  )
}
