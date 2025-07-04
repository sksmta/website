"use client"

import { useState, useEffect } from "react"
import { CommandPalette } from "@/components/command-palette"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { SocialLinks } from "@/components/social-links"
import { CustomCursor } from "@/components/cursor"
import { Particles } from "@/components/particles"

export default function Home() {
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
      <main className="main-content">
        <Hero />
      </main>
      <SocialLinks />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  )
}
