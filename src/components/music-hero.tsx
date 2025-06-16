"use client"

import { useState, useEffect } from "react"
import { Music } from "lucide-react"

interface MusicContent {
  title: string
  subtitle: string
}

export function MusicHero() {
  const [content, setContent] = useState<MusicContent | null>(null)

  useEffect(() => {
    fetch("/data/music.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setContent({ title: data.title, subtitle: data.subtitle }))
      .catch((err) => {
        console.error("Failed to load music content:", err)
        setContent({
          title: "Music",
          subtitle: "The soundtrack to my coding sessions and creative process",
        })
      })
  }, [])

  if (!content) {
    return <div>Loading...</div>
  }

  return (
    <section className="music-hero">
      <div className="music-hero-content">
        <div className="music-icon-wrapper">
          <Music className="music-hero-icon" />
          <div className="music-icon-glow"></div>
          <div className="music-sound-waves">
            <div className="sound-wave"></div>
            <div className="sound-wave"></div>
            <div className="sound-wave"></div>
            <div className="sound-wave"></div>
            <div className="sound-wave"></div>
          </div>
        </div>
        <h1 className="music-title">{content.title}</h1>
        <p className="music-subtitle">{content.subtitle}</p>
      </div>
    </section>
  )
}
