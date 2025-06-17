"use client"

import { useState, useEffect } from "react"
import { Mail, Github, Linkedin, MapPin, Clock, CheckCircle, ExternalLink } from "lucide-react"

interface ContactData {
  email: string
  social: {
    github: string
    linkedin: string
    twitter?: string
  }
  availability: {
    status: string
    types: string[]
  }
  location: {
    current: string
    timezone: string
  }
}

export function ContactInfo() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    fetch("/data/contact.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setContactData(data))
      .catch((err) => {
        console.error("Failed to load contact data:", err)
        setContactData({
          email: "samantashreyas910@gmail.com",
          social: {
            github: "https://github.com/sksmta",
            linkedin: "https://linkedin.com/in/shreyas-samanta",
          },
          availability: {
            status: "Available for opportunities",
            types: ["Full-time positions", "Internship opportunities", "Freelance projects"],
          },
          location: {
            current: "Glasgow, UK",
            timezone: "GMT (UTC+0)",
          },
        })
      })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCards([0, 1, 2])
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (!contactData) {
    return <div>Loading contact information...</div>
  }

  return (
    <div className="contact-info-container">
      {/* Primary Contact Card */}
      <div className={`contact-card primary ${visibleCards.includes(0) ? "visible" : ""}`}>
        <div className="card-header">
          <div className="card-icon-wrapper primary">
            <Mail className="card-icon" />
            <div className="card-icon-glow"></div>
          </div>
          <div className="card-info">
            <h3 className="card-title">Get In Touch</h3>
            <p className="card-subtitle">Send me an email</p>
          </div>
        </div>

        <div className="contact-methods">
          <a href={`mailto:${contactData.email}`} className="contact-method primary">
            <Mail className="w-5 h-5" />
            <span>{contactData.email}</span>
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>
        </div>

        <div className="quick-contact">
          <p className="quick-contact-text">
            I typically respond within 24 hours. Feel free to reach out about anything!
          </p>
        </div>
      </div>

      {/* Social Links Card */}
      <div className={`contact-card ${visibleCards.includes(1) ? "visible" : ""}`} style={{ animationDelay: "0.2s" }}>
        <div className="card-header">
          <div className="card-icon-wrapper social">
            <Github className="card-icon" />
            <div className="card-icon-glow"></div>
          </div>
          <div className="card-info">
            <h3 className="card-title">Social & Professional</h3>
            <p className="card-subtitle">Connect with me online</p>
          </div>
        </div>

        <div className="contact-methods">
          <a href={contactData.social.github} target="_blank" rel="noopener noreferrer" className="contact-method">
            <Github className="w-5 h-5" />
            <span>GitHub</span>
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>

          <a href={contactData.social.linkedin} target="_blank" rel="noopener noreferrer" className="contact-method">
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>
        </div>
      </div>

      {/* Availability Card */}
      <div className={`contact-card ${visibleCards.includes(2) ? "visible" : ""}`} style={{ animationDelay: "0.4s" }}>
        <div className="card-header">
          <div className="card-icon-wrapper availability">
            <CheckCircle className="card-icon" />
            <div className="card-icon-glow"></div>
          </div>
          <div className="card-info">
            <h3 className="card-title">Availability</h3>
            <p className="card-subtitle">{contactData.availability.status}</p>
          </div>
        </div>

        <div className="availability-types">
          <h4 className="availability-title">Open to:</h4>
          <ul className="availability-list">
            {contactData.availability.types.map((type, index) => (
              <li key={index} className="availability-item">
                <CheckCircle className="w-4 h-4" />
                {type}
              </li>
            ))}
          </ul>
        </div>

        <div className="location-info">
          <div className="location-item">
            <MapPin className="w-4 h-4" />
            <span>{contactData.location.current}</span>
          </div>
          <div className="location-item">
            <Clock className="w-4 h-4" />
            <span>{contactData.location.timezone}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
