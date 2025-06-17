"use client"

import { useEffect, useState } from "react"
import { ExternalLink } from "lucide-react"

interface LastFmArtist {
  name: string
  playcount: string
  image: Array<{
    "#text": string
    size: string
  }>
  url: string
}

interface TopArtistsProps {
  artists: LastFmArtist[]
}

export function TopArtists({ artists = [] }: TopArtistsProps) {
  const [imageMap, setImageMap] = useState<Record<string, string>>({})
  const [hoveredArtist, setHoveredArtist] = useState<number | null>(null)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchImages = async () => {
      const newMap: Record<string, string> = {}

      await Promise.all(
        artists.map(async (artist) => {
          try {
            const res = await fetch(`/api/wiki-image?name=${encodeURIComponent(artist.name)}`)
            const data = await res.json()
            newMap[artist.name] = data.image
          } catch (err) {
            console.error(`Failed to load image for ${artist.name}`, err)
            newMap[artist.name] = "/placeholder.svg"
          }
        }),
      )

      setImageMap(newMap)
    }

    fetchImages()
  }, [artists])

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

    artists.forEach((_, index) => {
      const el = document.getElementById(`artist-${index}`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [artists])

  const formatPlaycount = (count: string) => {
    const num = Number.parseInt(count || "0")
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  if (artists.length === 0) {
    return (
      <section className="top-artists-section">
        <div className="section-header">
          <h2 className="section-title">Top Artists</h2>
          <p className="section-subtitle">No top artists found</p>
        </div>
      </section>
    )
  }

  return (
    <section className="top-artists-section">
      <div className="section-header">
        <h2 className="section-title">Top Artists</h2>
        <p className="section-subtitle">Your most played artists</p>
      </div>

      <div className="artists-grid">
        {artists.map((artist, index) => (
          <div
            key={`${artist.name}-${index}`}
            id={`artist-${index}`}
            className={`artist-card ${visibleItems.has(`artist-${index}`) ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredArtist(index)}
            onMouseLeave={() => setHoveredArtist(null)}
          >
            <div className="artist-image-container">
              <img
                src={imageMap[artist.name] || "/placeholder.svg"}
                alt={artist.name}
                className="artist-image"
              />
              <div className="artist-overlay">
                <a
                  href={artist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-red-400 transition-colors"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              </div>
              <div className="artist-glow"></div>
            </div>

            <div className="artist-info">
              <h4 className="artist-name">{artist.name}</h4>
              <p className="artist-genre">{formatPlaycount(artist.playcount)} plays</p>
            </div>

            <div className={`artist-background ${hoveredArtist === index ? "hovered" : ""}`}></div>
          </div>
        ))}
      </div>
    </section>
  )
}
