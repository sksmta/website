"use client"

import React from "react"

import { useState, useEffect } from "react"

interface AboutContent {
  title: string
  paragraphs: string[]
}

export function AboutHero() {
  const [content, setContent] = useState<AboutContent | null>(null)

  useEffect(() => {
    fetch("/data/content.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setContent(data.about))
      .catch((err) => {
        console.error("Failed to load content:", err)
        // Fallback data
        setContent({
          title: "About Me",
          paragraphs: [
            "I'm a passionate developer and entrepreneur, currently serving as the Founder & CEO at Resend. My journey in technology has been driven by an obsession with creating exceptional developer experiences.",
            "With years of experience in building scalable applications and leading teams, I focus on bridging the gap between complex technology and intuitive user experiences. I believe in the power of clean code, thoughtful design, and continuous learning.",
            "When I'm not coding or building products, you'll find me sharing knowledge through articles, speaking at conferences, or exploring new technologies that can make developers' lives easier.",
          ],
        })
      })
  }, [])

  if (!content) {
    return <div>Loading...</div>
  }

  return (
    <section className="about-hero">
      <div className="about-hero-content">
        <div className="profile-section">
          <div className="profile-image-container">
            <div className="profile-image-wrapper">
              <img src="/shreyas.jpg?height=300&width=300" alt="Shreyas Samanta" className="profile-image" />
            </div>
            <div className="profile-glow"></div>
          </div>
        </div>

        <div className="about-text-section">
          <h1 className="about-title">{content.title}</h1>
          <div className="about-description">
            {content.paragraphs.map((paragraph, index) => (
              <p key={index} className="about-paragraph">
                {paragraph.split("Resend").map((part, i) =>
                  i === 0 ? (
                    part
                  ) : (
                    <React.Fragment key={i}>
                      <span className="highlight">Resend</span>
                      {part}
                    </React.Fragment>
                  ),
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
