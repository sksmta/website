"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Github, Calendar, ArrowRight } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  technologies: string[]
  category: string
  status?: string
  year: string
  image?: string
  links: {
    github?: string
    live?: string
    demo?: string
  }
  highlights?: string[]
}

interface ProjectsData {
  featured: Project[]
  other: Project[]
}

export function ProjectsGrid() {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [expandedProject, setExpandedProject] = useState<string | null>(null)

  useEffect(() => {
    fetch("/data/projects.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setProjectsData(data))
      .catch((err) => {
        console.error("Failed to load projects data:", err)
        setProjectsData({
          featured: [],
          other: [],
        })
      })
  }, [])

  useEffect(() => {
    if (!projectsData) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    const allProjects = [...projectsData.featured, ...projectsData.other]
    allProjects.forEach((project, index) => {
      const element = document.getElementById(`project-${project.id}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [projectsData])

  const toggleExpanded = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }

  if (!projectsData) {
    return <div>Loading projects...</div>
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Web Application": "#4ecdc4",
      "Mobile Application": "#ff6b6b",
      "IoT & Hardware": "#45b7d1",
      "Web Development": "#96ceb4",
      "Open Source": "#fbbf24",
      Academic: "#a78bfa",
    }
    return colors[category as keyof typeof colors] || "#9ca3af"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Live: "#10b981",
      "In Development": "#f59e0b",
      Completed: "#6366f1",
    }
    return colors[status as keyof typeof colors] || "#9ca3af"
  }

  return (
    <div className="projects-container">
      {/* Featured Projects */}
      {projectsData.featured.length > 0 && (
        <section className="featured-projects-section">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">My most significant and impactful work</p>
          </div>

          <div className="featured-projects-grid">
            {projectsData.featured.map((project, index) => (
              <div
                key={project.id}
                id={`project-${project.id}`}
                className={`featured-project-card ${visibleItems.has(`project-${project.id}`) ? "visible" : ""}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="project-image-container">
                  <img
                    src={project.image || "/placeholder.svg?height=400&width=600"}
                    alt={project.title}
                    className="project-image"
                  />
                  <div className="project-overlay">
                    <div className="project-links">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {(project.links.live || project.links.demo) && (
                        <a
                          href={project.links.live || project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="project-content">
                  <div className="project-header">
                    <div className="project-meta">
                      <span
                        className="project-category"
                        style={{
                          backgroundColor: `${getCategoryColor(project.category)}20`,
                          color: getCategoryColor(project.category),
                        }}
                      >
                        {project.category}
                      </span>
                      {project.status && (
                        <span
                          className="project-status"
                          style={{
                            backgroundColor: `${getStatusColor(project.status)}20`,
                            color: getStatusColor(project.status),
                          }}
                        >
                          {project.status}
                        </span>
                      )}
                      <div className="project-year">
                        <Calendar className="w-4 h-4" />
                        {project.year}
                      </div>
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                  </div>

                  {project.highlights && (
                    <div className="project-highlights">
                      <h4 className="highlights-title">Key Highlights</h4>
                      <ul className="highlights-list">
                        {project.highlights.map((highlight, i) => (
                          <li key={i} className="highlight-item">
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="project-technologies">
                    <div className="tech-tags">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.longDescription && (
                    <button onClick={() => toggleExpanded(project.id)} className="expand-button">
                      {expandedProject === project.id ? "Show Less" : "Learn More"}
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${expandedProject === project.id ? "rotate-90" : ""}`}
                      />
                    </button>
                  )}

                  {expandedProject === project.id && project.longDescription && (
                    <div className="expanded-content">
                      <p className="long-description">{project.longDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other Projects */}
      {projectsData.other.length > 0 && (
        <section className="other-projects-section">
          <div className="section-header">
            <h2 className="section-title">Other Projects</h2>
            <p className="section-subtitle">Additional work and contributions</p>
          </div>

          <div className="other-projects-grid">
            {projectsData.other.map((project, index) => (
              <div
                key={project.id}
                id={`project-${project.id}`}
                className={`other-project-card ${visibleItems.has(`project-${project.id}`) ? "visible" : ""}`}
                style={{ animationDelay: `${(projectsData.featured.length + index) * 0.1}s` }}
              >
                <div className="project-header">
                  <div className="project-meta">
                    <span
                      className="project-category"
                      style={{
                        backgroundColor: `${getCategoryColor(project.category)}20`,
                        color: getCategoryColor(project.category),
                      }}
                    >
                      {project.category}
                    </span>
                    <div className="project-year">
                      <Calendar className="w-4 h-4" />
                      {project.year}
                    </div>
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                </div>

                <div className="project-footer">
                  <div className="project-technologies">
                    <div className="tech-tags">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="tech-tag more">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="project-links">
                    {project.links.github && (
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="project-link">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {(project.links.live || project.links.demo) && (
                      <a
                        href={project.links.live || project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
