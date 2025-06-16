"use client"

import React from "react"

import { useState, useEffect } from "react"

interface HeroContent {
  name: string
  subtitle: string
  description: string
  cta: string
}

export function Hero() {
  const [content, setContent] = useState<HeroContent | null>(null)

  useEffect(() => {
    fetch("/data/content.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setContent(data.hero))
      .catch((err) => {
        console.error("Failed to load hero content:", err)
        // Fallback data
        setContent({
          name: "Shreyas Samanta",
          subtitle: "Software Engineer",
          description: "3rd Year Electronic & Software Engineering Student @ University of Glasgow, UK.",
          cta: "Press ctrl K to start →",
        })
      })
  }, [])

  if (!content) {
    return <div>Loading...</div>
  }

  return (
    <div className="hero-container">
      <h1 className="hero-title">{content.name}</h1>

      <div>
        <p className="hero-subtitle">
          {content.subtitle.split("Resend").map((part, i) =>
            i === 0 ? (
              part
            ) : (
              <React.Fragment key={i}>
                <span style={{ textDecoration: "underline" }}>Resend</span>
                {part}
              </React.Fragment>
            ),
          )}
        </p>

        <p className="hero-description">{content.description}</p>
      </div>

      <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <p className="hero-cta">
          {content.cta.split("ctrl").map((part, i) =>
            i === 0 ? (
              part
            ) : (
              <React.Fragment key={i}>
                <kbd className="kbd">ctrl</kbd>
                {part.split("K").map((kPart, j) =>
                  j === 0 ? (
                    kPart
                  ) : (
                    <React.Fragment key={j}>
                      <kbd className="kbd">K</kbd>
                      {kPart}
                    </React.Fragment>
                  ),
                )}
              </React.Fragment>
            ),
          )}
        </p>
      </div>
    </div>
  )
}
