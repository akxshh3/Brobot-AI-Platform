import styles from './ProviderCard.module.css'

const PROVIDERS = [
  {
    id: 'gemini',
    name: 'Gemini',
    company: 'Google',
    desc: 'Multimodal AI with deep Google integration',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="url(#gGrad)"/>
        <path d="M12 6l1.5 4.5H18l-3.75 2.73 1.43 4.39L12 15l-3.68 2.62 1.43-4.39L6 10.5h4.5L12 6z" fill="white" opacity="0.9"/>
        <defs>
          <linearGradient id="gGrad" x1="2" y1="2" x2="22" y2="22">
            <stop stopColor="#4285F4"/>
            <stop offset="0.5" stopColor="#EA4335"/>
            <stop offset="1" stopColor="#FBBC04"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    color: '#4285F4',
    glow: 'rgba(66, 133, 244, 0.3)',
  },
  {
    id: 'groq',
    name: 'Groq',
    company: 'Groq Inc.',
    desc: 'Blazing-fast inference with LPU™ hardware',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#grGrad)"/>
        <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" fill="white" opacity="0.8"/>
        <defs>
          <linearGradient id="grGrad" x1="2" y1="2" x2="22" y2="22">
            <stop stopColor="#F97316"/>
            <stop offset="1" stopColor="#EF4444"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    color: '#F97316',
    glow: 'rgba(249, 115, 22, 0.3)',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    company: 'OpenAI',
    desc: 'GPT-4 and beyond — state of the art reasoning',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <circle cx="12" cy="12" r="10" fill="url(#oaGrad)"/>
        <path d="M12 7a5 5 0 100 10A5 5 0 0012 7z" fill="white" opacity="0.15"/>
        <path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="white"/>
        <defs>
          <linearGradient id="oaGrad" x1="2" y1="2" x2="22" y2="22">
            <stop stopColor="#10A37F"/>
            <stop offset="1" stopColor="#0D8A6C"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    color: '#10A37F',
    glow: 'rgba(16, 163, 127, 0.3)',
  },
  {
    id: 'anthropic',
    name: 'Claude',
    company: 'Anthropic',
    desc: 'Helpful, harmless, and honest AI assistant',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="8" fill="url(#aGrad)"/>
        <path d="M12 6l3.5 12h-2l-1-3.5h-5L6.5 18h-2L8 6h4zm-2 6.5h3.5L12 9l-1.5 3.5z" fill="white" opacity="0.9"/>
        <defs>
          <linearGradient id="aGrad" x1="2" y1="2" x2="22" y2="22">
            <stop stopColor="#CC785C"/>
            <stop offset="1" stopColor="#8B5CF6"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    color: '#CC785C',
    glow: 'rgba(204, 120, 92, 0.3)',
  },
]

export default function ProviderCard({ selected, onSelect }) {
  return (
    <div className={styles.grid}>
      {PROVIDERS.map(p => (
        <button
          key={p.id}
          className={`${styles.card} ${selected === p.id ? styles.selected : ''}`}
          onClick={() => onSelect(p.id)}
          style={{ '--card-color': p.color, '--card-glow': p.glow }}
        >
          <div className={styles.glowRing} />
          <div className={styles.iconWrap}>{p.icon}</div>
          <div className={styles.info}>
            <span className={styles.name}>{p.name}</span>
            <span className={styles.company}>{p.company}</span>
          </div>
          <p className={styles.desc}>{p.desc}</p>
          {selected === p.id && (
            <div className={styles.checkmark}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
