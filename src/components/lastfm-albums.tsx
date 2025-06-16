"use client"

import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"

interface LastFmAlbum {
  name: string
  artist: {
    name: string
  }
  playcount: string
  image: Array<{
    "#text": string
    size: string
  }>
  url: string
}

interface LastFmAlbumsProps {
  albums: LastFmAlbum[]
}

export function LastFmAlbums({ albums = [] }: LastFmAlbumsProps) {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null)

  // Ensure albums is always an array and filter out invalid entries
  const validAlbums = Array.isArray(albums) ? albums.filter((album) => album && album.name && album.artist?.name) : []

  useEffect(() => {
    if (validAlbums.length === 0) return

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

    validAlbums.forEach((_, index) => {
      const element = document.getElementById(`album-${index}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [validAlbums])

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

  if (validAlbums.length === 0) {
    return (
      <section className="lastfm-albums-section">
        <div className="section-header">
          <h2 className="section-title">Top Albums</h2>
          <p className="section-subtitle">No albums found</p>
        </div>
      </section>
    )
  }

  return (
    <section className="lastfm-albums-section">
      <div className="section-header">
        <h2 className="section-title">Top Albums</h2>
        <p className="section-subtitle">Most played albums this month</p>
      </div>

      <div className="albums-grid">
        {validAlbums.map((album, index) => (
          <div
            key={`${album.name}-${album.artist.name}-${index}`}
            id={`album-${index}`}
            className={`album-card ${visibleItems.has(`album-${index}`) ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredAlbum(`${album.name}-${index}`)}
            onMouseLeave={() => setHoveredAlbum(null)}
          >
            <div className="album-image-container">
              <img
                src={getImageUrl(album.image) || "/placeholder.svg"}
                alt={`${album.name} by ${album.artist.name}`}
                className="album-image"
              />
              <div className="album-overlay">
                <a href={album.url} target="_blank" rel="noopener noreferrer" className="album-play-btn">
                  <ExternalLink className="w-6 h-6" />
                </a>
              </div>
              <div className="album-glow"></div>
            </div>

            <div className="album-info">
              <h4 className="album-name">{album.name}</h4>
              <p className="album-artist">{album.artist.name}</p>
              <div className="album-stats">
                <span className="playcount">{formatPlaycount(album.playcount)} plays</span>
              </div>
            </div>

            <div className={`album-background ${hoveredAlbum === `${album.name}-${index}` ? "hovered" : ""}`}></div>
          </div>
        ))}
      </div>
    </section>
  )
}
