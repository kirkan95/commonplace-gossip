import { useState, useRef } from 'react'
import { login } from '../lib/auth'
import styles from './WelcomeScreen.module.css'

export default function WelcomeScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password || loading) return

    setLoading(true)
    setError(false)

    const ok = await login(password)

    if (ok) {
      onLogin()
    } else {
      setError(true)
      setLoading(false)
      inputRef.current?.classList.remove(styles.shake)
      void inputRef.current?.offsetWidth
      inputRef.current?.classList.add(styles.shake)
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      <div className={styles.top}>
        <div className={styles.eyebrow}>A Defector Defection</div>
        <h1 className={styles.headline}>
          Commonplace<br />
          <span>Gossip</span>
        </h1>
        <div className={styles.subtitle}>A Very Special Birthday Edition</div>
        <div className={styles.divider} />
        <p className={styles.body}>
          A bunch of your closest friends submitted their pettiest and
          lowest-stakes stories you've ever heard, with the shared goal of
          giving you a nice birthday laugh. Enjoy!
        </p>
      </div>

      <form className={styles.bottom} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className={styles.input}
          type="password"
          placeholder="enter the password..."
          value={password}
          onChange={e => setPassword(e.target.value)}
          onAnimationEnd={() => inputRef.current?.classList.remove(styles.shake)}
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'one sec...' : 'Let me in'}
        </button>
        <div className={`${styles.error} ${error ? styles.errorVisible : ''}`}>
          Incorrect password — try again.
        </div>
      </form>
    </div>
  )
}
