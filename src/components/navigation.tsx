"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TimezoneClock } from "./timezone-clock"

interface NavigationData {
  items: string[]
}

export function Navigation() {
  const [navData, setNavData] = useState<NavigationData | null>(null)

  useEffect(() => {
    fetch("/data/content.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setNavData(data.navigation))
      .catch((err) => {
        console.error("Failed to load navigation data:", err)
        // Fallback data
        setNavData({
          items: ["ABOUT", "ARTICLES", "PROJECTS", "TALKS", "PODCASTS", "INVESTING", "USES", "REMINDER"],
        })
      })
  }, [])

  if (!navData) {
    return <nav className="nav-container">Loading...</nav>
  }

  return (
    <nav className="nav-container">
      <Link href="/" className="logo">
        S
      </Link>

      <div className="nav-items">
        {navData.items.map((item) => (
          <Link key={item} href={`/${item.toLowerCase()}`} className="nav-link">
            {item}
          </Link>
        ))}
      </div>

      <TimezoneClock />
    </nav>
  )
}
