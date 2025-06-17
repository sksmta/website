"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Github, Star, GitFork, RefreshCw, AlertCircle, Clock } from "lucide-react"
import { useGitHub } from "../hooks/use-github"

const GITHUB_USERNAMES = ["sksmta", "rhygg"]

interface GitHubRepo {
  id: string
  name: string
  description: string
  url: string
  homepage: string | null
  language: string | null
  stars: number
  forks: number
  topics: string[]
  lastUpdated: string
}

export function GitHubProjects() {
  const { data, loading, error, refetch } = useGitHub(GITHUB_USERNAMES)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())

  // Combine all repos from all users
  const allRepos: (GitHubRepo & { username: string })[] = Object.entries(data).flatMap(([username, repos]) =>
    repos.map((repo) => ({ ...repo, username })),
  )

  // Sort by stars and recent activity
  const sortedRepos = allRepos.sort((a, b) => {
    const scoreA = a.stars * 2 + new Date(a.lastUpdated).getTime() / 1000000000
    const scoreB = b.stars * 2 + new Date(b.lastUpdated).getTime() / 1000000000
    return scoreB - scoreA
  })

  useEffect(() => {
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

    sortedRepos.forEach((repo, index) => {
      const element = document.getElementById(`github-repo-${repo.id}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sortedRepos])

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      C: "#555555",
      Go: "#00ADD8",
      Rust: "#dea584",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Swift: "#fa7343",
      Kotlin: "#A97BFF",
      Dart: "#00B4AB",
      HTML: "#e34c26",
      CSS: "#1572B6",
      Vue: "#4FC08D",
      React: "#61DAFB",
    }
    return colors[language || ""] || "#9ca3af"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 30) return `${diffDays} days ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const getUserDisplayName = (username: string) => {
    const displayNames: Record<string, string> = {
      sksmta: "Shreyas Samanta",
      rhygg: "Rhygg",
    }
    return displayNames[username] || username
  }

  if (loading) {
    return (
      <section className="github-projects-section">
        <div className="github-section-header">
          <div className="github-header-content">
            <div className="github-icon-wrapper">
              <Github className="github-icon" />
              <div className="github-icon-glow"></div>
            </div>
            <div className="github-header-text">
              <h2 className="github-section-title">GitHub Projects</h2>
              <p className="github-section-subtitle">Loading repositories...</p>
            </div>
          </div>
        </div>
        <div className="github-loading">
          <div className="loading-spinner"></div>
          <p>Fetching repositories from GitHub...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="github-projects-section">
        <div className="github-section-header">
          <div className="github-header-content">
            <div className="github-icon-wrapper error">
              <AlertCircle className="github-icon" />
            </div>
            <div className="github-header-text">
              <h2 className="github-section-title">GitHub Projects</h2>
              <p className="github-section-subtitle">Error loading repositories</p>
            </div>
          </div>
          <button onClick={refetch} className="github-refresh-btn error">
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
        <div className="github-error">
          <p>{error}</p>
        </div>
      </section>
    )
  }

  if (sortedRepos.length === 0) {
    return (
      <section className="github-projects-section">
        <div className="github-section-header">
          <div className="github-header-content">
            <div className="github-icon-wrapper">
              <Github className="github-icon" />
            </div>
            <div className="github-header-text">
              <h2 className="github-section-title">GitHub Projects</h2>
              <p className="github-section-subtitle">No repositories found</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="github-projects-section">
      <div className="github-section-header">
        <div className="github-header-content">
          <div className="github-icon-wrapper">
            <Github className="github-icon" />
            <div className="github-icon-glow"></div>
          </div>
          <div className="github-header-text">
            <h2 className="github-section-title">GitHub Projects</h2>
            <p className="github-section-subtitle">
              Latest repositories from {GITHUB_USERNAMES.map(getUserDisplayName).join(" & ")}
            </p>
          </div>
        </div>
        <button onClick={refetch} className="github-refresh-btn">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="github-projects-grid">
        {sortedRepos.map((repo, index) => (
          <div
            key={`${repo.username}-${repo.id}`}
            id={`github-repo-${repo.id}`}
            className={`github-project-card ${visibleItems.has(`github-repo-${repo.id}`) ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="github-card-header">
              <div className="github-repo-info">
                <div className="github-repo-owner">
                  <div className="owner-avatar">
                    {getUserDisplayName(repo.username)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="owner-name">{getUserDisplayName(repo.username)}</span>
                </div>
                <h3 className="github-repo-name">{repo.name}</h3>
                <p className="github-repo-description">{repo.description || "No description available"}</p>
              </div>
            </div>

            <div className="github-card-content">
              <div className="github-repo-stats">
                <div className="stat-group">
                  <div className="stat-item">
                    <Star className="stat-icon" />
                    <span className="stat-value">{repo.stars.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <GitFork className="stat-icon" />
                    <span className="stat-value">{repo.forks.toLocaleString()}</span>
                  </div>
                </div>
                <div className="repo-meta">
                  {repo.language && (
                    <div className="language-info">
                      <div className="language-dot" style={{ backgroundColor: getLanguageColor(repo.language) }}></div>
                      <span className="language-name">{repo.language}</span>
                    </div>
                  )}
                  <div className="last-updated">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(repo.lastUpdated)}</span>
                  </div>
                </div>
              </div>

              {repo.topics.length > 0 && (
                <div className="github-topics">
                  {repo.topics.slice(0, 4).map((topic) => (
                    <span key={topic} className="github-topic-tag">
                      {topic}
                    </span>
                  ))}
                  {repo.topics.length > 4 && <span className="github-topic-tag more">+{repo.topics.length - 4}</span>}
                </div>
              )}

              <div className="github-card-actions">
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="github-action-btn primary">
                  <Github className="w-4 h-4" />
                  <span>View Code</span>
                </a>
                {repo.homepage && (
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-action-btn secondary"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>

            <div className="github-card-glow"></div>
          </div>
        ))}
      </div>
    </section>
  )
}
