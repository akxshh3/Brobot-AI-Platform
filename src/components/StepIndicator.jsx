import styles from './StepIndicator.module.css'

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className={styles.wrapper}>
      {steps.map((step, i) => {
        const state = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending'
        return (
          <div key={i} className={`${styles.item} ${styles[state]}`}>
            <div className={styles.node}>
              {state === 'done' ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span className={styles.num}>{i + 1}</span>
              )}
            </div>
            {i < steps.length - 1 && <div className={styles.line}><div className={styles.lineInner} style={{ width: state === 'done' ? '100%' : '0%' }} /></div>}
            <span className={styles.label}>{step}</span>
          </div>
        )
      })}
    </div>
  )
}
