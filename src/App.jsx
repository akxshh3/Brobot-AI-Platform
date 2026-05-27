import { useState } from 'react'
import BackgroundScene from './components/BackgroundScene'
import OrbScene from './components/OrbScene'
import StepIndicator from './components/StepIndicator'
import ProviderCard from './components/ProviderCard'
import ApiKeyInput from './components/ApiKeyInput'
import ChatInterface from './components/ChatInterface'
import styles from './App.module.css'

const STEPS = ['Provider', 'API Key', 'Configure', 'Launch']

const MODELS = {
  gemini: [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', badge: 'Fast', desc: 'Low latency, high efficiency' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', badge: 'Powerful', desc: 'Long context, multimodal' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', badge: 'Balanced', desc: 'Best price/performance' },
  ],
  groq: [
    { id: 'llama-3.3-70b-versatile', name: 'LLaMA 3.3 70B', badge: 'Top Pick', desc: 'Meta\'s flagship, ultra-fast' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8×7B', badge: 'Long Ctx', desc: '32K context window' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', badge: 'Compact', desc: 'Google lightweight model' },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', badge: 'Best', desc: 'Flagship multimodal model' },
    { id: 'gpt-4o-mini', name: 'GPT-4o mini', badge: 'Fast', desc: 'Efficient & affordable' },
    { id: 'o1-mini', name: 'o1 mini', badge: 'Reasoning', desc: 'Advanced chain-of-thought' },
  ],
  anthropic: [
    { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet', badge: 'Top Pick', desc: 'Best intelligence & speed' },
    { id: 'claude-3-5-haiku-latest', name: 'Claude 3.5 Haiku', badge: 'Fast', desc: 'Quickest response model' },
    { id: 'claude-3-opus-latest', name: 'Claude 3 Opus', badge: 'Powerful', desc: 'Most capable for complex tasks' },
  ],
}

export default function App() {
  const [step, setStep] = useState(0)
  const [provider, setProvider] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState(null)
  const [temp, setTemp] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful, creative, and intelligent AI assistant.')
  const [launching, setLaunching] = useState(false)
  const [done, setDone] = useState(false)
  const [isChatting, setIsChatting] = useState(false)

  const canNext = [
    !!provider,
    apiKey.length > 20,
    !!model,
  ]

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
  }

  const handleLaunch = () => {
    setLaunching(true)
    setTimeout(() => {
      setLaunching(false)
      setDone(true)
    }, 2400)
  }

  const models = provider ? MODELS[provider] : []

  return (
    <div className={styles.root}>
      <BackgroundScene />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <svg viewBox="0 0 28 28" width="28" height="28" fill="none">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="url(#logoGrad)" strokeWidth="1.5" fill="rgba(0,212,255,0.08)"/>
              <circle cx="14" cy="14" r="4" fill="url(#logoGrad)"/>
              <defs>
                <linearGradient id="logoGrad" x1="2" y1="2" x2="26" y2="26">
                  <stop stopColor="#00d4ff"/>
                  <stop offset="1" stopColor="#7b61ff"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.logoText}>Bro<span className={styles.logoAI}>bot</span></span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.statusDot} />
          <span className={styles.statusText}>Setup Wizard</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className={styles.main}>
        {/* Left: Orb + info */}
        <div className={styles.leftPane}>
          <OrbScene />
          <div className={styles.orbCaption}>
            <h1 className={styles.heroTitle}>
              Configure Your<br />
              <span className={styles.heroAccent}>Brobot</span>
            </h1>
            <p className={styles.heroSub}>Connect your preferred AI provider and customize the experience to your workflow in minutes.</p>
          </div>

          {/* Feature pills */}
          <div className={styles.features}>
            {['Multi-provider', 'Encrypted keys', 'Instant deploy'].map((f, i) => (
              <div key={f} className={styles.featurePill} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={styles.featureDot} />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Setup card */}
        <div className={styles.rightPane}>
          {isChatting ? (
            <ChatInterface
              provider={provider}
              apiKey={apiKey}
              model={model}
              temp={temp}
              maxTokens={maxTokens}
              systemPrompt={systemPrompt}
              onClose={() => setIsChatting(false)}
            />
          ) : (
            <div className={styles.card}>
              <div className={styles.cardTopGlow} />

              {!done ? (
              <>
                <StepIndicator steps={STEPS} currentStep={step} />

                {/* Step 0: Provider */}
                {step === 0 && (
                  <div className={styles.stepContent} key="step0">
                    <div className={styles.stepHeader}>
                      <h2 className={styles.stepTitle}>Choose Provider</h2>
                      <p className={styles.stepDesc}>Select the AI service you'd like to power your assistant.</p>
                    </div>
                    <ProviderCard selected={provider} onSelect={setProvider} />
                  </div>
                )}

                {/* Step 1: API Key */}
                {step === 1 && (
                  <div className={styles.stepContent} key="step1">
                    <div className={styles.stepHeader}>
                      <h2 className={styles.stepTitle}>API Key</h2>
                      <p className={styles.stepDesc}>Enter your {provider} API key. It's stored locally and never transmitted to our servers.</p>
                    </div>
                    <ApiKeyInput value={apiKey} onChange={setApiKey} provider={provider} />
                    <div className={styles.securityNote}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1L12 3.5v4c0 2.5-2.5 4.5-5 5C4.5 12 2 10 2 7.5v-4L7 1z" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M5 7l1.5 1.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Your key is encrypted at rest and never leaves this device.</span>
                    </div>
                  </div>
                )}

                {/* Step 2: Configure */}
                {step === 2 && (
                  <div className={styles.stepContent} key="step2">
                    <div className={styles.stepHeader}>
                      <h2 className={styles.stepTitle}>Configure</h2>
                      <p className={styles.stepDesc}>Select a model and tune generation parameters.</p>
                    </div>

                    <div className={styles.label}>Model</div>
                    <div className={styles.modelList}>
                      {models.map(m => (
                        <button
                          key={m.id}
                          className={`${styles.modelOption} ${model === m.id ? styles.modelSelected : ''}`}
                          onClick={() => setModel(m.id)}
                        >
                          <div className={styles.modelLeft}>
                            <span className={styles.modelName}>{m.name}</span>
                            <span className={styles.modelDesc}>{m.desc}</span>
                          </div>
                          <span className={styles.modelBadge}>{m.badge}</span>
                        </button>
                      ))}
                    </div>

                    <div className={styles.sliderGroup}>
                      <div className={styles.sliderLabel}>
                        <span>Temperature</span>
                        <span className={styles.sliderVal}>{temp.toFixed(1)}</span>
                      </div>
                      <input
                        type="range" min="0" max="2" step="0.1"
                        value={temp} onChange={e => setTemp(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <div className={styles.sliderHints}><span>Precise</span><span>Creative</span></div>
                    </div>

                    <div className={styles.sliderGroup}>
                      <div className={styles.sliderLabel}>
                        <span>Max Tokens</span>
                        <span className={styles.sliderVal}>{maxTokens.toLocaleString()}</span>
                      </div>
                      <input
                        type="range" min="256" max="8192" step="256"
                        value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                    </div>

                    <div className={styles.label}>System Prompt</div>
                    <textarea
                      className={styles.textarea}
                      value={systemPrompt}
                      onChange={e => setSystemPrompt(e.target.value)}
                      rows={3}
                      placeholder="Define how your Brobot behaves..."
                    />
                  </div>
                )}

                {/* Step 3: Launch */}
                {step === 3 && (
                  <div className={styles.stepContent} key="step3">
                    <div className={styles.stepHeader}>
                      <h2 className={styles.stepTitle}>Ready to Launch</h2>
                      <p className={styles.stepDesc}>Review your configuration before activating your Brobot.</p>
                    </div>

                    <div className={styles.summary}>
                      {[
                        { label: 'Provider', value: provider, icon: '◈' },
                        { label: 'Model', value: model?.split('/').pop() || model, icon: '◇' },
                        { label: 'Temperature', value: temp.toFixed(1), icon: '◉' },
                        { label: 'Max Tokens', value: maxTokens.toLocaleString(), icon: '◌' },
                        { label: 'API Key', value: '••••••••' + apiKey.slice(-6), icon: '◆' },
                      ].map((row, i) => (
                        <div key={row.label} className={styles.summaryRow} style={{ animationDelay: `${i * 0.07}s` }}>
                          <span className={styles.summaryIcon}>{row.icon}</span>
                          <span className={styles.summaryLabel}>{row.label}</span>
                          <span className={styles.summaryValue}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className={styles.nav}>
                  {step > 0 && (
                    <button className={styles.btnBack} onClick={() => setStep(s => s - 1)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      className={`${styles.btnNext} ${!canNext[step] ? styles.disabled : ''}`}
                      onClick={handleNext}
                      disabled={!canNext[step]}
                    >
                      Continue
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  ) : (
                    <button
                      className={`${styles.btnLaunch} ${launching ? styles.launching : ''}`}
                      onClick={handleLaunch}
                      disabled={launching}
                    >
                      {launching ? (
                        <>
                          <div className={styles.spinner} />
                          Initializing...
                        </>
                      ) : (
                        <>
                          Launch Brobot
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2l1.5 4H14l-3.5 2.5 1.5 4L8 10l-4 2.5 1.5-4L2 6h4.5L8 2z" fill="currentColor"/>
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Success state */
              <div className={styles.success}>
                <div className={styles.successOrb}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="rgba(0,255,136,0.15)" stroke="var(--accent-success)" strokeWidth="1.5"/>
                    <path d="M14 24l7 8L34 16" stroke="var(--accent-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className={styles.successTitle}>Brobot Active</h2>
                <p className={styles.successDesc}>Your {provider} assistant is configured and ready. Start building something incredible.</p>
                <div className={styles.successStats}>
                  <div className={styles.successStat}>
                    <span className={styles.successStatVal}>{model?.includes('70b') || model?.includes('pro') || model?.includes('4o') ? '128K' : '32K'}</span>
                    <span className={styles.successStatLabel}>Context</span>
                  </div>
                  <div className={styles.successStat}>
                    <span className={styles.successStatVal}>{maxTokens.toLocaleString()}</span>
                    <span className={styles.successStatLabel}>Max Tokens</span>
                  </div>
                  <div className={styles.successStat}>
                    <span className={styles.successStatVal}>{temp.toFixed(1)}</span>
                    <span className={styles.successStatLabel}>Temperature</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className={styles.btnLaunch} onClick={() => setIsChatting(true)}>
                    Start Chatting
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8h10M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className={styles.btnBack} onClick={() => { setDone(false); setStep(0); setProvider(null); setApiKey(''); setModel(null) }}>
                    Reset Setup
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </main>
    </div>
  )
}
