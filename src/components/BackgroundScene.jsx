import { useEffect, useRef } from 'react'
import styles from './BackgroundScene.module.css'

export default function BackgroundScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let t = 0
    let animId

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }))

    const resize = () => {
      canvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 2)
      canvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 2)
      ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2))
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      const W = window.innerWidth
      const H = window.innerHeight
      ctx.clearRect(0, 0, W, H)

      // Mesh gradient blobs
      const blobs = [
        { x: W * (0.2 + 0.05 * Math.sin(t * 0.001)), y: H * (0.3 + 0.05 * Math.cos(t * 0.0015)), r: 420, color: 'rgba(0, 212, 255, 0.04)' },
        { x: W * (0.8 + 0.04 * Math.cos(t * 0.0012)), y: H * (0.2 + 0.04 * Math.sin(t * 0.001)), r: 380, color: 'rgba(123, 97, 255, 0.04)' },
        { x: W * (0.5 + 0.06 * Math.sin(t * 0.0008)), y: H * (0.8 + 0.03 * Math.cos(t * 0.001)), r: 350, color: 'rgba(0, 212, 255, 0.03)' },
      ]

      blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, b.color)
        g.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })

      // Grid dots
      const gridSpacing = 60
      for (let gx = 0; gx < W; gx += gridSpacing) {
        for (let gy = 0; gy < H; gy += gridSpacing) {
          const distFromCenter = Math.hypot(gx - W / 2, gy - H / 2)
          const maxDist = Math.hypot(W / 2, H / 2)
          const alpha = 0.06 * (1 - distFromCenter / maxDist) + 0.01
          ctx.beginPath()
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`
          ctx.fill()
        }
      }

      // Floating particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = 1
        if (p.x > 1) p.x = 0
        if (p.y < 0) p.y = 1
        if (p.y > 1) p.y = 0

        const pulse = 0.5 + 0.5 * Math.sin(t * 0.02 + p.phase)
        ctx.beginPath()
        ctx.arc(p.x * W, p.y * H, p.size * pulse, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity * pulse})`
        ctx.fill()
      })

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
