"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"

interface Artist {
  name: string
  genre: string
  image: string
  spotifyId: string
}

interface TopArtistsData {
  topArtists: Artist[]
}

export function TopArtists() {
  const [artistsData, setArtistsData] = useState<TopArtistsData | null>(null)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [hoveredArtist, setHoveredArtist] = useState<number | null>(null)

  useEffect(() => {
    fetch("/data/music.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setArtistsData({ topArtists: data.topArtists }))
      .catch((err) => {
        console.error("Failed to load top artists:", err)
        setArtistsData({
          topArtists: [
            {
              name: "Nils Frahm",
              genre: "Neoclassical",
              image: "/placeholder.svg?height=200&width=200",
              spotifyId: "5gqhueRUZEa7VDnQt4HODp",
            },
          ],
        })
      })
  }, [])

  useEffect(() => {
    if (!artistsData) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    artistsData.topArtists.forEach((_, index) => {
      const element = document.getElementById(`artist-${index}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [artistsData])

  if (!artistsData) {
    return <div>Loading top artists...</div>
  }

  return (
    <section className="top-artists-section">
      <div className="section-header">
        <h2 className="section-title">Top Artists</h2>
        <p className="section-subtitle">My most played artists</p>
      </div>

      <div className="artists-grid">
        {artistsData.topArtists.map((artist, index) => (
          <div
            key={`${artist.spotifyId}-${index}`}
            id={`artist-${index}`}
            className={`artist-card ${visibleItems.has(`artist-${index}`) ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredArtist(index)}
            onMouseLeave={() => setHoveredArtist(null)}
          >
            <div className="artist-image-container">
              <img src={artist.image || "/placeholder.svg"} alt={artist.name} className="artist-image" />
              <div className="artist-overlay">
                <User className="w-8 h-8" />
              </div>
              <div className="artist-glow"></div>
            </div>

            <div className="artist-info">
              <h4 className="artist-name">{artist.name}</h4>
              <p className="artist-genre">{artist.genre}</p>
            </div>

            <div className={`artist-background ${hoveredArtist === index ? "hovered" : ""}`}></div>
          </div>
        ))}
      </div>
    </section>
  )
}
