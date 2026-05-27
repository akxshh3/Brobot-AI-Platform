import { useState } from 'react'
import styles from './ApiKeyInput.module.css'

export default function ApiKeyInput({ value, onChange, provider }) {
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)

  const placeholders = {
    gemini: 'AIza••••••••••••••••••••••••••••••••••••',
    groq:   'gsk_••••••••••••••••••••••••••••••••••••••',
    openai: 'sk-proj-••••••••••••••••••••••••••••••••••',
    anthropic: 'sk-ant-••••••••••••••••••••••••••••••••',
  }

  const valid = value.length > 20
  const ph = placeholders[provider] || 'Paste your API key here...'

  return (
    <div className={`${styles.wrapper} ${focused ? styles.focused : ''} ${valid ? styles.valid : ''}`}>
      <div className={styles.prefix}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="7" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>
      <input
        className={styles.input}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={ph}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
        autoComplete="off"
      />
      <button className={styles.toggle} onClick={() => setShow(s => !s)} type="button" tabIndex={-1}>
        {show ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
            <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        )}
      </button>
      {valid && (
        <div className={styles.validBadge}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div className={styles.scanLine} />
    </div>
  )
}
