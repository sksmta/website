"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface SocialLink {
  name: string
  href: string
}

interface SocialData {
  links: SocialLink[]
}

export function SocialLinks() {
  const [socialData, setSocialData] = useState<SocialData | null>(null)

  useEffect(() => {
    fetch("/data/content.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setSocialData(data.social))
      .catch((err) => {
        console.error("Failed to load social data:", err)
        // Fallback data
        setSocialData({
          links: [
            { name: "email", href: "mailto:shreyas@example.com" },
            { name: "twitter", href: "https://twitter.com/shreyas" },
            { name: "github", href: "https://github.com/shreyas" },
            { name: "linkedin", href: "https://linkedin.com/in/shreyas" },
            { name: "instagram", href: "https://instagram.com/shreyas" },
          ],
        })
      })
  }, [])

  if (!socialData) {
    return <footer className="social-footer">Loading...</footer>
  }

  return (
    <footer className="social-footer">
      <div className="social-links">
        {socialData.links.map((link) => (
          <Link key={link.name} href={link.href} className="social-link" target="_blank" rel="noopener noreferrer">
            {link.name}
          </Link>
        ))}
      </div>
    </footer>
  )
}
