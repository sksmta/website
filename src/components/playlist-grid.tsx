"use client"

import { useState, useEffect } from "react"
import { Play, Music } from "lucide-react"

interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  images: { url: string }[]
  tracks: {
    total: number
  }
  owner: {
    display_name: string
  }
}

interface PlaylistGridProps {
  playlists: SpotifyPlaylist[]
}

export function PlaylistGrid({ playlists }: PlaylistGridProps) {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [hoveredPlaylist, setHoveredPlaylist] = useState<string | null>(null)

  useEffect(() => {
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

    playlists.forEach((playlist, index) => {
      const element = document.getElementById(`playlist-${index}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [playlists])

  if (!playlists.length) {
    return (
      <section className="playlist-section">
        <div className="section-header">
          <h2 className="section-title">Your Playlists</h2>
          <p className="section-subtitle">No playlists found</p>
        </div>
      </section>
    )
  }

  return (
    <section className="playlist-section">
      <div className="section-header">
        <h2 className="section-title">Your Playlists</h2>
        <p className="section-subtitle">Your personal music collections</p>
      </div>

      <div className="playlist-grid">
        {playlists.map((playlist, index) => (
          <div
            key={playlist.id}
            id={`playlist-${index}`}
            className={`playlist-card ${visibleItems.has(`playlist-${index}`) ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredPlaylist(playlist.id)}
            onMouseLeave={() => setHoveredPlaylist(null)}
          >
            <div className="playlist-image-container">
              <img src={playlist.images[0]?.url || "/placeholder.svg"} alt={playlist.name} className="playlist-image" />
              <div className="playlist-overlay">
                <button className="play-overlay-btn">
                  <Play className="w-6 h-6" />
                  <div className="play-overlay-glow" style={{ backgroundColor: "#1DB954" }}></div>
                </button>
              </div>
              <div className="playlist-glow" style={{ backgroundColor: "#1DB954" }}></div>
            </div>

            <div className="playlist-content">
              <h3 className="playlist-name">{playlist.name}</h3>
              <p className="playlist-description">{playlist.description || `By ${playlist.owner.display_name}`}</p>
              <div className="playlist-stats">
                <div className="stat-item">
                  <Music className="w-4 h-4" />
                  <span>{playlist.tracks.total} tracks</span>
                </div>
              </div>
            </div>

            <div
              className={`playlist-background ${hoveredPlaylist === playlist.id ? "hovered" : ""}`}
              style={{
                background: `linear-gradient(135deg, #1DB95410, #1DB95405)`,
              }}
            ></div>

            <div className="playlist-border" style={{ borderColor: "#1DB95430" }}></div>
          </div>
        ))}
      </div>
    </section>
  )
}
