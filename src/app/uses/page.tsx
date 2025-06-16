"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { SocialLinks } from "@/components/social-links"
import { CustomCursor } from "@/components/cursor"
import { Particles } from "@/components/particles"
import { UsesHero } from "@/components/uses-hero"
import { UsesGrid } from "@/components/uses-grid"
import { CommandPalette } from "@/components/command-palette"

export default function UsesPage() {
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

      <main className="uses-main">
        <UsesHero />
        <UsesGrid />
      </main>

      <SocialLinks />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  )
}
