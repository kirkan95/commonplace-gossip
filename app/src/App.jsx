import { useState } from 'react'
import { getToken } from './lib/auth'
import WelcomeScreen from './components/WelcomeScreen'
import MainPage from './components/MainPage'

export default function App() {
  const [authed, setAuthed] = useState(() => Boolean(getToken()))

  return authed
    ? <MainPage onLogout={() => setAuthed(false)} />
    : <WelcomeScreen onLogin={() => setAuthed(true)} />
}
