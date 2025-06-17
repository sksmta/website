"use client"

import { useState, useEffect } from "react"
import { Navigation } from "../../components/navigation"
import { SocialLinks } from "../../components/social-links"
import { CustomCursor } from "../../components/cursor"
import { Particles } from "../../components/particles"
import { ContactHero } from "../../components/contact-hero"
import { ContactInfo } from "../../components/contact-info"
import { CommandPalette } from "../../components/command-palette"

export default function ContactPage() {
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

      <main className="contact-main">
        <ContactHero />
        <ContactInfo />
      </main>

      <SocialLinks />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  )
}
