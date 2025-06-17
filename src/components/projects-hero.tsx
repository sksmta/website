"use client"

import { useState, useEffect } from "react"
import { Code2 } from "lucide-react"

interface ProjectsContent {
  title: string
  subtitle: string
}

export function ProjectsHero() {
  const [content, setContent] = useState<ProjectsContent | null>(null)

  useEffect(() => {
    fetch("/data/projects.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setContent({ title: data.title, subtitle: data.subtitle }))
      .catch((err) => {
        console.error("Failed to load projects content:", err)
        setContent({
          title: "Projects",
          subtitle: "A collection of things I've built, from web applications to open-source contributions",
        })
      })
  }, [])

  if (!content) {
    return <div>Loading...</div>
  }

  return (
    <section className="projects-hero">
      <div className="projects-hero-content">
        <div className="projects-icon-wrapper">
          <Code2 className="projects-hero-icon" />
          <div className="projects-icon-glow"></div>
          <div className="projects-code-lines">
            <div className="code-line"></div>
            <div className="code-line"></div>
            <div className="code-line"></div>
            <div className="code-line"></div>
          </div>
        </div>
        <h1 className="projects-title">{content.title}</h1>
        <p className="projects-subtitle">{content.subtitle}</p>
      </div>
    </section>
  )
}
