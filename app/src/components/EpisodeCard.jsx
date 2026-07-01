import { useRef, useState, useEffect } from 'react'
import styles from './EpisodeCard.module.css'

const THEMES = {
  blue:   { art: '#D0EAFF', accent: '#1A5FFF', number: '#1A5FFF', progress: '#00A870' },
  green:  { art: '#B8F0DC', accent: '#00A870', number: '#00A870', progress: '#00A870' },
  purple: { art: '#E0DBFF', accent: '#6B5AFF', number: '#6B5AFF', progress: '#6B5AFF' },
  gold:   { art: '#FFF3C0', accent: '#F5B800', number: '#C49000', progress: '#F5B800' },
}

export default function EpisodeCard({ episode, audioUrl, isPlaying, onPlay }) {
  const audioRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const theme = THEMES[episode.theme] || THEMES.blue

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function handleTimeUpdate() {
    setCurrentTime(audioRef.current.currentTime)
  }

  function handleLoadedMetadata() {
    setDuration(audioRef.current.duration)
  }

  function handleEnded() {
    onPlay(null)
    setCurrentTime(0)
  }

  function handleProgressClick(e) {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = ratio * duration
  }

  function skip(seconds) {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
  }

  function fmt(secs) {
    if (!secs || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className={styles.card}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className={styles.top}>
        <div className={styles.art} style={{ background: theme.art }}>
          {episode.emoji}
        </div>
        <div className={styles.info}>
          <div className={styles.number} style={{ color: theme.number }}>
            Episode {episode.number}
          </div>
          <div className={styles.title}>{episode.title}</div>
          <div className={styles.meta}>
            {episode.duration} · Story {parseInt(episode.number)} of 4
          </div>
        </div>
      </div>

      <p className={styles.desc}>{episode.description}</p>

      <div className={styles.divider} />

      <div className={styles.player}>
        <div
          className={styles.progressWrap}
          onClick={handleProgressClick}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%`, background: theme.progress }}
          />
        </div>

        <div className={styles.controls}>
          <button className={styles.skipBtn} onClick={() => skip(-15)}>« 15s</button>
          <button
            className={styles.playBtn}
            style={{ background: theme.accent }}
            onClick={() => onPlay(isPlaying ? null : episode.id)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          <button className={styles.skipBtn} onClick={() => skip(15)}>15s »</button>
          <span className={styles.time}>{fmt(currentTime)} / {fmt(duration) !== '0:00' ? fmt(duration) : episode.duration}</span>
        </div>
      </div>
    </div>
  )
}
