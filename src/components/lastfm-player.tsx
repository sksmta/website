"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Music, Calendar, TrendingUp } from "lucide-react"

interface LastFmPlayerProps {
  userInfo: any
  recentTracks: any[]
  currentTrack?: any
}

export function LastFmPlayer({ userInfo, recentTracks = [], currentTrack }: LastFmPlayerProps) {
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const getImageUrl = (images: any[], size = "large") => {
    if (!Array.isArray(images) || images.length === 0) {
      return "/placeholder.svg?height=300&width=300"
    }

    const image = images.find((img) => img.size === size) || images[images.length - 1]
    return image?.["#text"] || "/placeholder.svg?height=300&width=300"
  }

  const formatPlaycount = (count: string) => {
    const num = Number.parseInt(count || "0")
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  // Safely check for now playing track
  const nowPlaying =
    Array.isArray(recentTracks) && recentTracks.length > 0
      ? recentTracks.find((track) => track?.["@attr"]?.nowplaying) || null
      : null

  const lastTrack = Array.isArray(recentTracks) && recentTracks.length > 0 ? recentTracks[0] : null

  return (
    <div className="lastfm-player-redesigned">
      <div className="player-header">
        <div className="player-title">
          <Music className="w-5 h-5 text-red-500" />
          <h2>Now Playing</h2>
        </div>
        <div className="lastfm-badge">
          <span className="lastfm-logo">Last.fm</span>
        </div>
      </div>

      <div className={`player-content ${isMobile ? "mobile" : ""}`}>
        {/* Main Track Display */}
        <div className="main-track-section">
          {nowPlaying ? (
            <div className="now-playing-track">
              <div className="track-status-indicator">
                <div className="live-dot"></div>
                <span>Now Playing</span>
              </div>

              <div className="track-artwork-container">
                <img
                  src={getImageUrl(nowPlaying.image) || "/placeholder.svg"}
                  alt={nowPlaying.name || "Track"}
                  className="track-artwork rotating"
                />
                <div className="vinyl-center"></div>
              </div>

              <div className="track-metadata">
                <h3 className="track-title">{nowPlaying.name || "Unknown Track"}</h3>
                <p className="track-artist">{nowPlaying.artist?.["#text"] || "Unknown Artist"}</p>
                {nowPlaying.album?.["#text"] && <p className="track-album">{nowPlaying.album["#text"]}</p>}
                <a
                  href={nowPlaying.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-external-link"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Last.fm</span>
                </a>
              </div>
            </div>
          ) : lastTrack ? (
            <div className="last-played-track">
              <div className="track-status-indicator recent">
                <Music className="w-4 h-4" />
                <span>Last Played</span>
              </div>

              <div className="track-artwork-container">
                <img
                  src={getImageUrl(lastTrack.image) || "/placeholder.svg"}
                  alt={lastTrack.name || "Track"}
                  className="track-artwork"
                />
              </div>

              <div className="track-metadata">
                <h3 className="track-title">{lastTrack.name || "Unknown Track"}</h3>
                <p className="track-artist">{lastTrack.artist?.["#text"] || "Unknown Artist"}</p>
                {lastTrack.album?.["#text"] && <p className="track-album">{lastTrack.album["#text"]}</p>}
                <a
                  href={lastTrack.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-external-link"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Last.fm</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="no-track-placeholder">
              <div className="placeholder-icon">
                <Music className="w-12 h-12" />
              </div>
              <h3>Music Discovery</h3>
              <p>Explore Shreyas's music taste below</p>
            </div>
          )}
        </div>

        {/* User Stats Sidebar */}
        <div className="user-stats-sidebar">
          <div className="user-profile">
            <div className="user-avatar-wrapper">
              <img
                src={getImageUrl(userInfo?.image, "large") || "/placeholder.svg"}
                alt={userInfo?.name || "User"}
                className="user-avatar"
              />
            </div>
            <div className="user-info">
              <h4 className="user-display-name">{userInfo?.realname || userInfo?.name || "Music Lover"}</h4>
              <p className="user-handle">@{userInfo?.name || "user"}</p>
            </div>
          </div>

          <div className="listening-stats">
            <div className="stat-card">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <div className="stat-info">
                <span className="stat-value">{formatPlaycount(userInfo?.playcount || "0")}</span>
                <span className="stat-label">Total Scrobbles</span>
              </div>
            </div>

            <div className="stat-card">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div className="stat-info">
                <span className="stat-value">
                  {userInfo?.registered?.["#text"]
                    ? new Date(userInfo.registered["#text"] * 1000).getFullYear()
                    : "2023"}
                </span>
                <span className="stat-label">Listening Since</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Music Visualizer */}
      <div className="music-visualizer-subtle">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="visualizer-bar-subtle"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${1.2 + (i % 4) * 0.3}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
