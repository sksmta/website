"use client"

import { useState, useEffect } from "react"
import { Code, Palette, Zap, Monitor, ExternalLink } from "lucide-react"

interface UsesItem {
  name: string
  description: string
  category: string
  color: string
  url: string
}

interface UsesCategory {
  id: string
  title: string
  icon: string
  items: UsesItem[]
}

interface UsesData {
  categories: UsesCategory[]
}

const iconMap = {
  Code,
  Palette,
  Zap,
  Monitor,
}

export function UsesGrid() {
  const [usesData, setUsesData] = useState<UsesData | null>(null)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    fetch("/data/uses.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setUsesData(data))
      .catch((err) => {
        console.error("Failed to load uses data:", err)
        setUsesData({
          categories: [
            {
              id: "development",
              title: "Development",
              icon: "Code",
              items: [
                {
                  name: "Visual Studio Code",
                  description: "My primary code editor",
                  category: "Editor",
                  color: "#007ACC",
                  url: "https://code.visualstudio.com",
                },
              ],
            },
          ],
        })
      })
  }, [])

  useEffect(() => {
    if (!usesData) return

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

    usesData.categories.forEach((category) => {
      const element = document.getElementById(`category-${category.id}`)
      if (element) observer.observe(element)

      category.items.forEach((item, index) => {
        const itemElement = document.getElementById(`item-${category.id}-${index}`)
        if (itemElement) observer.observe(itemElement)
      })
    })

    return () => observer.disconnect()
  }, [usesData])

  if (!usesData) {
    return <div>Loading uses...</div>
  }

  return (
    <div className="uses-grid-container">
      {usesData.categories.map((category, categoryIndex) => {
        const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Code

        return (
          <section
            key={category.id}
            id={`category-${category.id}`}
            className={`uses-category ${visibleItems.has(`category-${category.id}`) ? "visible" : ""}`}
            style={{ animationDelay: `${categoryIndex * 0.2}s` }}
          >
            <div className="category-header">
              <div className="category-icon-wrapper">
                <IconComponent className="category-icon" />
                <div className="icon-glow"></div>
              </div>
              <h2 className="category-title">{category.title}</h2>
            </div>

            <div className="uses-items-grid">
              {category.items.map((item, index) => (
                <div
                  key={`${category.id}-${index}`}
                  id={`item-${category.id}-${index}`}
                  className={`uses-item ${visibleItems.has(`item-${category.id}-${index}`) ? "visible" : ""}`}
                  style={{ animationDelay: `${categoryIndex * 0.2 + index * 0.1}s` }}
                  onMouseEnter={() => setHoveredItem(`${category.id}-${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="item-content">
                    <div className="item-header">
                      <div className="item-color-indicator" style={{ backgroundColor: item.color }}>
                        <div className="color-pulse" style={{ backgroundColor: item.color }}></div>
                      </div>
                      <div className="item-info">
                        <h3 className="item-name">{item.name}</h3>
                        <span className="item-category">{item.category}</span>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="item-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="item-description">{item.description}</p>
                  </div>

                  <div
                    className={`item-background ${hoveredItem === `${category.id}-${index}` ? "hovered" : ""}`}
                    style={{
                      background: `linear-gradient(135deg, ${item.color}10, ${item.color}05)`,
                    }}
                  ></div>

                  <div className="item-border" style={{ borderColor: `${item.color}30` }}></div>

                  <div
                    className="item-glow"
                    style={{
                      background: `radial-gradient(circle at center, ${item.color}20, transparent 70%)`,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
