"use client"

import { useState } from "react"
import { ExternalLink, Music, Calendar, TrendingUp } from "lucide-react"

interface LastFmPlayerProps {
  userInfo: any
  recentTracks: any[]
  currentTrack?: any
}

export function LastFmPlayer({ userInfo, recentTracks = [], currentTrack }: LastFmPlayerProps) {
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)

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
    <div className="lastfm-player">
      <div className="player-container">
        {/* User Stats */}
        <div className="user-stats">
          <div className="user-avatar-container">
            <img
              src={getImageUrl(userInfo?.image, "large") || "/placeholder.svg"}
              alt={userInfo?.name || "User"}
              className="user-avatar"
            />
            <div className="user-avatar-glow"></div>
          </div>
          <div className="user-details">
            <h3 className="user-name">{userInfo?.realname || userInfo?.name || "Music Lover"}</h3>
            <p className="user-username">@{userInfo?.name || "user"}</p>
            <div className="user-stats-grid">
              <div className="stat-item">
                <TrendingUp className="w-4 h-4" />
                <span>{formatPlaycount(userInfo?.playcount || "0")} scrobbles</span>
              </div>
              <div className="stat-item">
                <Calendar className="w-4 h-4" />
                <span>
                  Since{" "}
                  {userInfo?.registered?.["#text"]
                    ? new Date(userInfo.registered["#text"] * 1000).getFullYear()
                    : "2023"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Now Playing / Recent Track */}
        <div className="now-playing-section">
          {nowPlaying ? (
            <div className="now-playing">
              <div className="now-playing-indicator">
                <div className="pulse-dot"></div>
                <span>Now Playing</span>
              </div>
              <div className="track-display">
                <div className="track-image-container">
                  <img
                    src={getImageUrl(nowPlaying.image) || "/placeholder.svg"}
                    alt={nowPlaying.name || "Track"}
                    className="track-image rotating"
                  />
                  <div className="vinyl-effect"></div>
                </div>
                <div className="track-info">
                  <h4 className="track-name">{nowPlaying.name || "Unknown Track"}</h4>
                  <p className="track-artist">{nowPlaying.artist?.["#text"] || "Unknown Artist"}</p>
                  <p className="track-album">{nowPlaying.album?.["#text"] || ""}</p>
                </div>
                <a href={nowPlaying.url || "#"} target="_blank" rel="noopener noreferrer" className="external-link">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          ) : lastTrack ? (
            <div className="recent-track">
              <div className="recent-indicator">
                <Music className="w-4 h-4" />
                <span>Last Played</span>
              </div>
              <div className="track-display">
                <div className="track-image-container">
                  <img
                    src={getImageUrl(lastTrack.image) || "/placeholder.svg"}
                    alt={lastTrack.name || "Track"}
                    className="track-image"
                  />
                </div>
                <div className="track-info">
                  <h4 className="track-name">{lastTrack.name || "Unknown Track"}</h4>
                  <p className="track-artist">{lastTrack.artist?.["#text"] || "Unknown Artist"}</p>
                  <p className="track-album">{lastTrack.album?.["#text"] || ""}</p>
                </div>
                <a href={lastTrack.url || "#"} target="_blank" rel="noopener noreferrer" className="external-link">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="no-track-message">
              <Music className="w-8 h-8 mb-2" />
              <h3>Music Discovery</h3>
              <p>Explore Shreyas's music taste below</p>
            </div>
          )}
        </div>

        {/* Last.fm Branding */}
        <div className="lastfm-branding">
          <div className="lastfm-logo">
            <span className="lastfm-text">Last.fm</span>
          </div>
          <p className="lastfm-description">Powered by music scrobbling</p>
        </div>
      </div>

      {/* Music Visualizer */}
      <div className="music-visualizer">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="visualizer-bar"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${1 + (i % 3) * 0.2}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
