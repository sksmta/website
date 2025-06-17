"use client"

import { useState, useEffect } from "react"
import { Mail } from "lucide-react"

interface ContactContent {
  title: string
  subtitle: string
  description: string
}

export function ContactHero() {
  const [content, setContent] = useState<ContactContent | null>(null)

  useEffect(() => {
    fetch("/data/contact.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) =>
        setContent({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
        }),
      )
      .catch((err) => {
        console.error("Failed to load contact content:", err)
        setContent({
          title: "Contact",
          subtitle: "Let's connect and build something amazing together",
          description: "I'm always interested in new opportunities, collaborations, and interesting conversations.",
        })
      })
  }, [])

  if (!content) {
    return <div>Loading...</div>
  }

  return (
    <section className="contact-hero">
      <div className="contact-hero-content">
        <div className="contact-icon-wrapper">
          <Mail className="contact-hero-icon" />
          <div className="contact-icon-glow"></div>
          <div className="contact-message-bubbles">
            <div className="message-bubble"></div>
            <div className="message-bubble"></div>
            <div className="message-bubble"></div>
          </div>
        </div>
        <h1 className="contact-title">{content.title}</h1>
        <p className="contact-subtitle">{content.subtitle}</p>
        <p className="contact-description">{content.description}</p>
      </div>
    </section>
  )
}
