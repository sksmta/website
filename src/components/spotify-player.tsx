"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from "lucide-react"

interface CurrentTrack {
  name: string
  artist: string
  album: string
  image: string
  duration: number
  progress: number
}

export function SpotifyPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack>({
    name: "Weightless",
    artist: "Marconi Union",
    album: "Weightless",
    image: "/placeholder.svg?height=80&width=80",
    duration: 490, // 8:10 in seconds
    progress: 145, // 2:25 in seconds
  })
  const [volume, setVolume] = useState(75)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0) // 0: off, 1: all, 2: one

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (currentTrack.progress / currentTrack.duration) * 100

  return (
    <div className="spotify-player">
      <div className="player-container">
        {/* Track Info */}
        <div className="track-info">
          <div className="track-image-container">
            <img src={currentTrack.image || "/placeholder.svg"} alt={currentTrack.name} className="track-image" />
            <div className="track-image-glow"></div>
            <div className="vinyl-effect"></div>
          </div>
          <div className="track-details">
            <h3 className="track-name">{currentTrack.name}</h3>
            <p className="track-artist">{currentTrack.artist}</p>
            <p className="track-album">{currentTrack.album}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="player-controls">
          <div className="control-buttons">
            <button
              className={`control-btn shuffle-btn ${isShuffled ? "active" : ""}`}
              onClick={() => setIsShuffled(!isShuffled)}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button className="control-btn">
              <SkipBack className="w-5 h-5" />
            </button>
            <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              <div className="play-btn-glow"></div>
            </button>
            <button className="control-btn">
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              className={`control-btn repeat-btn ${repeatMode > 0 ? "active" : ""}`}
              onClick={() => setRepeatMode((prev) => (prev + 1) % 3)}
            >
              <Repeat className="w-4 h-4" />
              {repeatMode === 2 && <span className="repeat-one">1</span>}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <span className="time-text">{formatTime(currentTrack.progress)}</span>
            <div className="progress-bar">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}>
                  <div className="progress-thumb"></div>
                </div>
              </div>
            </div>
            <span className="time-text">{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="volume-control">
          <Volume2 className="w-5 h-5 volume-icon" />
          <div className="volume-slider">
            <div className="volume-track">
              <div className="volume-fill" style={{ width: `${volume}%` }}>
                <div className="volume-thumb"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizer */}
      <div className="music-visualizer">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="visualizer-bar"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${0.5 + Math.random() * 1}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
