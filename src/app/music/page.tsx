"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { SocialLinks } from "@/components/social-links"
import { CustomCursor } from "@/components/cursor"
import { Particles } from "@/components/particles"
import { MusicHero } from "@/components/music-hero"
import { SpotifyPlayer } from "@/components/spotify-player"
import { PlaylistGrid } from "@/components/playlist-grid"
import { RecentTracks } from "@/components/recent-tracks"
import { TopArtists } from "@/components/top-artists"
import { CommandPalette } from "@/components/command-palette"

export default function MusicPage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="main-container">
      <CustomCursor />
      <Particles />
      <Navigation />

      <main className="music-main">
        <MusicHero />
        <SpotifyPlayer />
        <PlaylistGrid />
        <div className="music-bottom-section">
          <RecentTracks />
          <TopArtists />
        </div>
      </main>

      <SocialLinks />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  )
}
