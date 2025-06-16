"use client"

import { useState, useEffect } from "react"
import { Briefcase, Calendar, MapPin, ChevronRight } from "lucide-react"

interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  description: string[]
  technologies: string[]
}

interface ExperienceData {
  title: string
  items: Experience[]
}

export function ExperienceTree() {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(null)

  useEffect(() => {
    fetch("/data/experience.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setExperienceData(data))
      .catch((err) => {
        console.error("Failed to load experience data:", err)
        // Fallback data
        setExperienceData({
          title: "Experience",
          items: [
            {
              id: "ugracing",
              company: "UGRacing",
              position: "Head of Software Development & IT",
              location: "Glasgow, UK",
              startDate: "2023",
              endDate: "Present",
              description: [
                "Led the software development team for UGRacing, a student-led Formula Student team at the University of Glasgow.",
  "Developed and maintained the team's web platform for project management and collaboration.",
              ],
              technologies: ["React", "Next.js", "TypeScript", "Node.js"],
            },
          ],
        })
      })
  }, [])

  useEffect(() => {
    if (!experienceData) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.2 },
    )

    experienceData.items.forEach((_, index) => {
      const element = document.getElementById(`experience-${index}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [experienceData])

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (!experienceData) {
    return <div>Loading experience...</div>
  }

  return (
    <section className="experience-tree">
      <div className="tree-header">
        <Briefcase className="tree-icon" />
        <h2 className="tree-title">{experienceData.title}</h2>
      </div>

      <div className="tree-timeline">
        <div className="timeline-line"></div>

        {experienceData.items.map((experience, index) => (
          <div
            key={experience.id}
            id={`experience-${index}`}
            className={`timeline-item ${visibleItems.has(`experience-${index}`) ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="timeline-marker">
              <div className="marker-dot"></div>
              <div className="marker-pulse"></div>
            </div>

            <div className="timeline-content">
              <div className="content-header" onClick={() => toggleExpanded(experience.id)}>
                <div className="header-main">
                  <h3 className="position-title">{experience.position}</h3>
                  <span className="company-name">{experience.company}</span>
                </div>

                <div className="header-meta">
                  <div className="meta-item">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {experience.startDate} - {experience.endDate}
                    </span>
                  </div>
                  <div className="meta-item">
                    <MapPin className="w-4 h-4" />
                    <span>{experience.location}</span>
                  </div>
                  <ChevronRight className={`expand-icon ${expandedItems.has(experience.id) ? "expanded" : ""}`} />
                </div>
              </div>

              <div className={`content-details ${expandedItems.has(experience.id) ? "expanded" : ""}`}>
                <ul className="description-list">
                  {experience.description.map((item, i) => (
                    <li key={i} className="description-item">
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="technologies">
                  <span className="tech-label">Technologies:</span>
                  <div className="tech-tags">
                    {experience.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
