"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function TimezoneClock() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [showLocalTime, setShowLocalTime] = useState(false)
  const [localTimezone, setLocalTimezone] = useState<string>("")

  useEffect(() => {
    // Get visitor's timezone
    setLocalTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date)
  }

  const getTimezoneLabel = (timezone: string) => {
    if (timezone === "Europe/London") return "UK"

    // Get city name from timezone
    const city = timezone.split("/").pop()?.replace(/_/g, " ")
    return city || timezone
  }

  const displayTimezone = showLocalTime ? localTimezone : "Europe/London"
  const displayTime = formatTime(currentTime, displayTimezone)
  const displayLabel = getTimezoneLabel(displayTimezone)

  const handleClick = () => {
    setShowLocalTime(!showLocalTime)
  }

  return (
    <button
      onClick={handleClick}
      className="timezone-clock"
      title={showLocalTime ? "Click to show UK time" : "Click to show your local time"}
    >
      <div className="clock-container">
        <Clock className="w-4 h-4 clock-icon" />
        <div className="time-display">
          <div className="time-text">{displayTime}</div>
          <div className="timezone-text">{displayLabel}</div>
        </div>
      </div>
    </button>
  )
}
