"use client"

import { useState, useEffect } from "react"
import { Play, Clock } from "lucide-react"

interface Track {
  name: string
  artist: string
  album: string
  duration: string
  image: string
  spotifyId: string
}

interface RecentTracksData {
  recentTracks: Track[]
}

export function RecentTracks() {
  const [tracksData, setTracksData] = useState<RecentTracksData | null>(null)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)

  useEffect(() => {
    fetch("/data/music.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setTracksData({ recentTracks: data.recentTracks }))
      .catch((err) => {
        console.error("Failed to load recent tracks:", err)
        setTracksData({
          recentTracks: [
            {
              name: "Weightless",
              artist: "Marconi Union",
              album: "Weightless",
              duration: "8:10",
              image: "/placeholder.svg?height=64&width=64",
              spotifyId: "6p0q6iMVdkqv0tmeHemgRi",
            },
          ],
        })
      })
  }, [])

  useEffect(() => {
    if (!tracksData) return

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

    tracksData.recentTracks.forEach((_, index) => {
      const element = document.getElementById(`track-${index}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [tracksData])

  if (!tracksData) {
    return <div>Loading recent tracks...</div>
  }

  return (
    <section className="recent-tracks-section">
      <div className="section-header">
        <h2 className="section-title">Recently Played</h2>
        <p className="section-subtitle">My latest listening history</p>
      </div>

      <div className="tracks-list">
        {tracksData.recentTracks.map((track, index) => (
          <div
            key={`${track.spotifyId}-${index}`}
            id={`track-${index}`}
            className={`track-item ${visibleItems.has(`track-${index}`) ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredTrack(index)}
            onMouseLeave={() => setHoveredTrack(null)}
          >
            <div className="track-image-container">
              <img src={track.image || "/placeholder.svg"} alt={track.name} className="track-image" />
              <div className="track-overlay">
                <button className="track-play-btn">
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="track-info">
              <h4 className="track-name">{track.name}</h4>
              <p className="track-artist">{track.artist}</p>
              <p className="track-album">{track.album}</p>
            </div>

            <div className="track-duration">
              <Clock className="w-4 h-4" />
              <span>{track.duration}</span>
            </div>

            <div className={`track-background ${hoveredTrack === index ? "hovered" : ""}`}></div>
          </div>
        ))}
      </div>
    </section>
  )
}
