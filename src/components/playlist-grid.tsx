"use client"

import { useState, useEffect } from "react"
import { Play, Clock, Music } from "lucide-react"

interface Playlist {
  id: string
  name: string
  description: string
  color: string
  tracks: number
  duration: string
  image: string
  spotifyId: string
}

interface PlaylistData {
  playlists: Playlist[]
}

export function PlaylistGrid() {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [hoveredPlaylist, setHoveredPlaylist] = useState<string | null>(null)

  useEffect(() => {
    fetch("/data/music.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setPlaylistData({ playlists: data.playlists }))
      .catch((err) => {
        console.error("Failed to load playlist data:", err)
        setPlaylistData({
          playlists: [
            {
              id: "coding-focus",
              name: "Deep Focus",
              description: "Instrumental tracks for deep coding sessions",
              color: "#1DB954",
              tracks: 47,
              duration: "3h 12m",
              image: "/placeholder.svg?height=300&width=300",
              spotifyId: "37i9dQZF1DX0XUsuxWHRQd",
            },
          ],
        })
      })
  }, [])

  useEffect(() => {
    if (!playlistData) return

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

    playlistData.playlists.forEach((playlist, index) => {
      const element = document.getElementById(`playlist-${index}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [playlistData])

  if (!playlistData) {
    return <div>Loading playlists...</div>
  }

  return (
    <section className="playlist-section">
      <div className="section-header">
        <h2 className="section-title">My Playlists</h2>
        <p className="section-subtitle">Curated collections for different coding moods</p>
      </div>

      <div className="playlist-grid">
        {playlistData.playlists.map((playlist, index) => (
          <div
            key={playlist.id}
            id={`playlist-${index}`}
            className={`playlist-card ${visibleItems.has(`playlist-${index}`) ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredPlaylist(playlist.id)}
            onMouseLeave={() => setHoveredPlaylist(null)}
          >
            <div className="playlist-image-container">
              <img src={playlist.image || "/placeholder.svg"} alt={playlist.name} className="playlist-image" />
              <div
                className="playlist-overlay"
                style={{
                  background: `linear-gradient(135deg, ${playlist.color}80, ${playlist.color}40)`,
                }}
              >
                <button className="play-overlay-btn">
                  <Play className="w-6 h-6" />
                  <div className="play-overlay-glow" style={{ backgroundColor: playlist.color }}></div>
                </button>
              </div>
              <div className="playlist-glow" style={{ backgroundColor: playlist.color }}></div>
            </div>

            <div className="playlist-content">
              <h3 className="playlist-name">{playlist.name}</h3>
              <p className="playlist-description">{playlist.description}</p>
              <div className="playlist-stats">
                <div className="stat-item">
                  <Music className="w-4 h-4" />
                  <span>{playlist.tracks} tracks</span>
                </div>
                <div className="stat-item">
                  <Clock className="w-4 h-4" />
                  <span>{playlist.duration}</span>
                </div>
              </div>
            </div>

            <div
              className={`playlist-background ${hoveredPlaylist === playlist.id ? "hovered" : ""}`}
              style={{
                background: `linear-gradient(135deg, ${playlist.color}10, ${playlist.color}05)`,
              }}
            ></div>

            <div className="playlist-border" style={{ borderColor: `${playlist.color}30` }}></div>
          </div>
        ))}
      </div>
    </section>
  )
}
