"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link, Mail, Code, Home, User, Briefcase, Settings, Music, MessageCircle, X } from "lucide-react"

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface Command {
  id: string
  title: string
  icon: React.ReactNode
  shortcut: string
  section: "general" | "goto"
  action: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = [
    {
      id: "copy-link",
      title: "Copy Link",
      icon: <Link className="w-4 h-4" />,
      shortcut: "L",
      section: "general",
      action: () => {
        navigator.clipboard.writeText(window.location.href)
        onClose()
      },
    },
    {
      id: "send-email",
      title: "Send Email",
      icon: <Mail className="w-4 h-4" />,
      shortcut: "E",
      section: "general",
      action: () => {
        window.location.href = "mailto:samantashreyas910@gmail.com"
        onClose()
      },
    },
    {
      id: "view-source",
      title: "View Source",
      icon: <Code className="w-4 h-4" />,
      shortcut: "S",
      section: "general",
      action: () => {
        window.open("https://github.com/sksmta/website", "_blank")
        onClose()
      },
    },
    {
      id: "home",
      title: "Home",
      icon: <Home className="w-4 h-4" />,
      shortcut: "G H",
      section: "goto",
      action: () => {
        window.location.href = "/"
        onClose()
      },
    },
    {
      id: "about",
      title: "About",
      icon: <User className="w-4 h-4" />,
      shortcut: "G A",
      section: "goto",
      action: () => {
        window.location.href = "/about"
        onClose()
      },
    },
    {
      id: "projects",
      title: "Projects",
      icon: <Briefcase className="w-4 h-4" />,
      shortcut: "G P",
      section: "goto",
      action: () => {
        window.location.href = "/projects"
        onClose()
      },
    },
    {
      id: "uses",
      title: "Uses",
      icon: <Settings className="w-4 h-4" />,
      shortcut: "G U",
      section: "goto",
      action: () => {
        window.location.href = "/uses"
        onClose()
      },
    },
    {
      id: "music",
      title: "Music",
      icon: <Music className="w-4 h-4" />,
      shortcut: "G M",
      section: "goto",
      action: () => {
        window.location.href = "/music"
        onClose()
      },
    },
    {
      id: "contact",
      title: "Contact",
      icon: <MessageCircle className="w-4 h-4" />,
      shortcut: "G C",
      section: "goto",
      action: () => {
        window.location.href = "/contact"
        onClose()
      },
    },
  ]

  const filteredCommands = commands.filter((command) => command.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const generalCommands = filteredCommands.filter((cmd) => cmd.section === "general")
  const gotoCommands = filteredCommands.filter((cmd) => cmd.section === "goto")

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === "Escape") {
        onClose()
        return
      }

      // Handle command shortcuts
      const command = commands.find((cmd) => {
        if (cmd.shortcut.includes(" ")) {
          // For shortcuts like "G H"
          const [first, second] = cmd.shortcut.split(" ")
          return event.key.toLowerCase() === second.toLowerCase() && event.ctrlKey === false && event.metaKey === false
        } else {
          // For single letter shortcuts
          return (
            event.key.toLowerCase() === cmd.shortcut.toLowerCase() && event.ctrlKey === false && event.metaKey === false
          )
        }
      })

      if (command) {
        event.preventDefault()
        command.action()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="command-palette-overlay">
      <div className="command-palette-backdrop" onClick={onClose} />

      <div className="command-palette-modal">
        <div className="command-palette-header">
          <input
            ref={inputRef}
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="command-palette-input"
          />
          <button onClick={onClose} className="command-palette-close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="command-palette-content">
          {generalCommands.length > 0 && (
            <div className="command-section">
              <div className="command-section-title">General</div>
              {generalCommands.map((command) => (
                <button key={command.id} onClick={command.action} className="command-item">
                  <div className="command-item-content">
                    {command.icon}
                    <span className="command-item-title">{command.title}</span>
                  </div>
                  <kbd className="command-shortcut">{command.shortcut}</kbd>
                </button>
              ))}
            </div>
          )}

          {gotoCommands.length > 0 && (
            <div className="command-section">
              <div className="command-section-title">Go To</div>
              {gotoCommands.map((command) => (
                <button key={command.id} onClick={command.action} className="command-item">
                  <div className="command-item-content">
                    {command.icon}
                    <span className="command-item-title">{command.title}</span>
                  </div>
                  <kbd className="command-shortcut">{command.shortcut}</kbd>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
