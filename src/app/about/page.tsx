"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { SocialLinks } from "@/components/social-links"
import { CustomCursor } from "@/components/cursor"
import { Particles } from "@/components/particles"
import { AboutHero } from "@/components/about-hero"
import { ExperienceTree } from "@/components/experience-tree"
import { EducationTree } from "@/components/education-tree"
import { CommandPalette } from "@/components/command-palette"

export default function AboutPage() {
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

      <main className="about-main">
        <AboutHero />

        <div className="trees-container">
          <ExperienceTree />
          <EducationTree />
        </div>
      </main>

      <SocialLinks />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  )
}
