"use client"

import { useEffect, useState } from "react"

export function Particles() {
  const [particles, setParticles] = useState<
    Array<{ id: number; left: number; delay: number; size: number; duration: number }>
  >([])

  useEffect(() => {
    const particleArray = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 4 + 6,
    }))
    setParticles(particleArray)
  }, [])

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `hsl(${particle.id * 4}, 70%, 60%)`,
          }}
        />
      ))}
    </div>
  )
}
