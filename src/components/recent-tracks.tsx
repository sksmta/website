"use client"

import { useState, useEffect } from "react"
import { Play, Clock } from "lucide-react"

interface LastFmTrack {
  name: string
  artist: {
    "#text": string
  }
  album?: {
    "#text": string
  }
  image: Array<{
    "#text": string
    size: string
  }>
  playcount?: string
  date?: {
    "#text": string
    uts: string
  }
  url: string
  "@attr"?: {
    nowplaying: string
  }
}

interface RecentTracksProps {
  tracks: LastFmTrack[]
}

export function RecentTracks({ tracks = [] }: RecentTracksProps) {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)

  // Ensure tracks is always an array and filter out invalid entries
  const validTracks = Array.isArray(tracks)
    ? tracks.filter((track) => track && track.name && track.artist?.["#text"])
    : []

  useEffect(() => {
    if (validTracks.length === 0) return

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

    validTracks.forEach((_, index) => {
      const element = document.getElementById(`track-${index}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [validTracks])

  const getImageUrl = (images: any[], size = "medium") => {
    if (!Array.isArray(images) || images.length === 0) {
      return "/placeholder.svg?height=64&width=64"
    }

    const image = images.find((img) => img.size === size) || images[images.length - 1]
    return image?.["#text"] || "/placeholder.svg?height=64&width=64"
  }

const formatTime = (uts: string | number) => {
  const date = new Date(Number(uts) * 1000) // This is always UTC
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  })
}


  if (validTracks.length === 0) {
    return (
      <section className="recent-tracks-section">
        <div className="section-header">
          <h2 className="section-title">Recently Played</h2>
          <p className="section-subtitle">No recent tracks found</p>
        </div>
      </section>
    )
  }

  return (
    <section className="recent-tracks-section">
      <div className="section-header">
        <h2 className="section-title">Recently Played</h2>
        <p className="section-subtitle">Your latest listening history</p>
      </div>

      <div className="tracks-list">
        {validTracks.map((track, index) => {
          // Additional safety check for each track
          if (!track || !track.name || !track.artist?.["#text"]) {
            return null
          }

          return (
            <div
              key={`${track.name}-${track.artist["#text"]}-${index}`}
              id={`track-${index}`}
              className={`track-item ${visibleItems.has(`track-${index}`) ? "visible" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredTrack(index)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <div className="track-image-container">
                <img
                  src={getImageUrl(track.image) || "/placeholder.svg"}
                  alt={`${track.name} by ${track.artist["#text"]}`}
                  className="track-image"
                />
                <div className="track-overlay">
                  <a href={track.url} target="_blank" rel="noopener noreferrer" className="track-play-btn">
                    <Play className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="track-info">
                <h4 className="track-name">{track.name}</h4>
                <p className="track-artist">{track.artist["#text"]}</p>
                {track.album?.["#text"] && <p className="track-album">{track.album["#text"]}</p>}
              </div>

              <div className="track-duration">
                <Clock className="w-4 h-4" />
                <span>{track.date?.uts ? formatTime(track.date.uts) : "Recently"}</span>
              </div>

              <div className={`track-background ${hoveredTrack === index ? "hovered" : ""}`}></div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
