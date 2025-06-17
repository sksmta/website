"use client"

import { useState, useEffect, useCallback } from "react"

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

interface GitHubData {
  repos: GitHubRepo[]
  source: "graphql" | "rest"
}

export function useGitHub(usernames: string[]) {
  const [data, setData] = useState<Record<string, GitHubRepo[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGitHubData = useCallback(async () => {
    if (usernames.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const results = await Promise.allSettled(
        usernames.map(async (username) => {
          const response = await fetch(`/api/github/pinned/${username}`)

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error(`User ${username} not found`)
            }
            throw new Error(`Failed to fetch data for ${username}`)
          }

          const data: GitHubData = await response.json()
          return { username, repos: data.repos }
        }),
      )

      const newData: Record<string, GitHubRepo[]> = {}
      const errors: string[] = []

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          newData[result.value.username] = result.value.repos
        } else {
          errors.push(`${usernames[index]}: ${result.reason.message}`)
        }
      })

      setData(newData)

      if (errors.length > 0) {
        setError(`Some users failed to load: ${errors.join(", ")}`)
      }
    } catch (err) {
      console.error("GitHub fetch error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch GitHub data")
    } finally {
      setLoading(false)
    }
  }, [usernames])

  useEffect(() => {
    fetchGitHubData()
  }, [fetchGitHubData])

  const refetch = useCallback(() => {
    fetchGitHubData()
  }, [fetchGitHubData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}
