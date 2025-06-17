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
      .then((data) => {
        if (data && data.social && Array.isArray(data.social.links)) {
          setSocialData(data.social)
        } else {
          console.warn("Invalid social data structure, using fallback")
          setSocialData({
            links: [
              { name: "email", href: "mailto:samantashreyas910@gmail.com" },
              { name: "github", href: "https://github.com/sksmta" },
              { name: "linkedin", href: "https://linkedin.com/in/shreyas-samanta" },
            ],
          })
        }
      })
      .catch((err) => {
        console.error("Failed to load social data:", err)
        // Always provide fallback data on any error
        setSocialData({
          links: [
            { name: "email", href: "mailto:samantashreyas910@gmail.com" },
            { name: "github", href: "https://github.com/sksmta" },
            { name: "linkedin", href: "https://linkedin.com/in/shreyas-samanta" },
          ],
        })
      })
  }, [])

  return (
    <footer className="social-footer">
      <div className="social-links">
        {(
          socialData?.links || [
            { name: "email", href: "mailto:samantashreyas910@gmail.com" },
            { name: "github", href: "https://github.com/sksmta" },
            { name: "linkedin", href: "https://linkedin.com/in/shreyas-samanta" },
          ]
        ).map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="social-link"
            target={link.href.startsWith("mailto:") ? "_self" : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </footer>
  )
}
