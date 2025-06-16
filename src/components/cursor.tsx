"use client"

import { useEffect, useState, useCallback } from "react"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [isHovering, setIsHovering] = useState(false)

  const updateCursor = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }, [])

  const updateTrails = useCallback((e: MouseEvent) => {
    setTrails((prev) => {
      const newTrail = { x: e.clientX, y: e.clientY, id: Date.now() }
      return [newTrail, ...prev.slice(0, 6)] // Reduced trail count for better performance
    })
  }, [])

  useEffect(() => {
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    document.addEventListener("mousemove", updateCursor)

    // Throttled trail update for better performance
    let trailTimeout: NodeJS.Timeout
    const throttledTrailUpdate = (e: MouseEvent) => {
      clearTimeout(trailTimeout)
      trailTimeout = setTimeout(() => updateTrails(e), 16) // ~60fps
    }

    document.addEventListener("mousemove", throttledTrailUpdate)

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]')
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      document.removeEventListener("mousemove", updateCursor)
      document.removeEventListener("mousemove", throttledTrailUpdate)
      clearTimeout(trailTimeout)
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [updateCursor, updateTrails])

  return (
    <>
      <div
        className={`cursor ${isHovering ? "cursor-hover" : ""}`}
        style={{
          left: `${position.x - 10}px`,
          top: `${position.y - 10}px`,
        }}
      />
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: `${trail.x - 4}px`,
            top: `${trail.y - 4}px`,
            opacity: (6 - index) / 6,
            transform: `scale(${(6 - index) / 6})`,
          }}
        />
      ))}
    </>
  )
}
