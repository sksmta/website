"use client"

import { useState, useEffect } from "react"

interface UsesContent {
  title: string
  subtitle: string
}

export function UsesHero() {
  const [content, setContent] = useState<UsesContent | null>(null)

  useEffect(() => {
    fetch("/data/uses.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setContent({ title: data.title, subtitle: data.subtitle }))
      .catch((err) => {
        console.error("Failed to load uses content:", err)
        setContent({
          title: "Uses",
          subtitle: "The tools and technologies I use daily to build amazing products",
        })
      })
  }, [])

  if (!content) {
    return <div>Loading...</div>
  }

  return (
    <section className="uses-hero">
      <div className="uses-hero-content">
        <h1 className="uses-title">{content.title}</h1>
        <p className="uses-subtitle">{content.subtitle}</p>
      </div>
    </section>
  )
}
