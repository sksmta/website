"use client"

import { useState, useEffect } from "react"
import { GraduationCap, Calendar, MapPin, Award, ChevronRight } from "lucide-react"

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  achievements: string[]
  gpa?: string
}

interface EducationData {
  title: string
  items: Education[]
}

export function EducationTree() {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [educationData, setEducationData] = useState<EducationData | null>(null)

  useEffect(() => {
    fetch("/data/education.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setEducationData(data))
      .catch((err) => {
        console.error("Failed to load education data:", err)
        // Fallback data
        setEducationData({
          title: "Education",
          items: [
            {
              id: "bachelors",
              institution: "University of Glasgow",
              degree: "Bachelors of Engineering (BEng)",
              field: "Electronic & Software Engineering",
              location: "Glasgow, UK",
              startDate: "2023",
              endDate: "2027",
              gpa: "3.0/4.0",
              achievements: ["Specialized in Electronic Circuits, Professional Software Development & Machine Learning "],
            },
          ],
        })
      })
  }, [])

  useEffect(() => {
    if (!educationData) return

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

    educationData.items.forEach((_, index) => {
      const element = document.getElementById(`education-${index}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [educationData])

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

  if (!educationData) {
    return <div>Loading education...</div>
  }

  return (
    <section className="education-tree">
      <div className="tree-header">
        <GraduationCap className="tree-icon" />
        <h2 className="tree-title">{educationData.title}</h2>
      </div>

      <div className="tree-timeline">
        <div className="timeline-line"></div>

        {educationData.items.map((edu, index) => (
          <div
            key={edu.id}
            id={`education-${index}`}
            className={`timeline-item ${visibleItems.has(`education-${index}`) ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="timeline-marker">
              <div className="marker-dot"></div>
              <div className="marker-pulse"></div>
            </div>

            <div className="timeline-content">
              <div className="content-header" onClick={() => toggleExpanded(edu.id)}>
                <div className="header-main">
                  <h3 className="degree-title">{edu.degree}</h3>
                  <span className="field-name">{edu.field}</span>
                  <span className="institution-name">{edu.institution}</span>
                </div>

                <div className="header-meta">
                  <div className="meta-item">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="meta-item">
                    <MapPin className="w-4 h-4" />
                    <span>{edu.location}</span>
                  </div>
                  {edu.gpa && (
                    <div className="meta-item">
                      <Award className="w-4 h-4" />
                      <span>{edu.gpa}</span>
                    </div>
                  )}
                  <ChevronRight className={`expand-icon ${expandedItems.has(edu.id) ? "expanded" : ""}`} />
                </div>
              </div>

              <div className={`content-details ${expandedItems.has(edu.id) ? "expanded" : ""}`}>
                <ul className="achievements-list">
                  {edu.achievements.map((achievement, i) => (
                    <li key={i} className="achievement-item">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
