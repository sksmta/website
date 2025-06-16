"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface LastFmTrack {
  name: string
  artist: {
    "#text": string
  }
  album?: {
    "#text": string
  }
  image: Array<{
    "#text": string
    size: string
  }>
  playcount?: string
  date?: {
    "#text": string
    uts: string
  }
  url: string
}

interface LastFmArtist {
  name: string
  playcount: string
  image: Array<{
    "#text": string
    size: string
  }>
  url: string
}

interface LastFmAlbum {
  name: string
  artist: {
    name: string
  }
  playcount: string
  image: Array<{
    "#text": string
    size: string
  }>
  url: string
}

interface LastFmUserInfo {
  name: string
  realname: string
  playcount: string
  country: string
  registered: {
    "#text": string
  }
  image: Array<{
    "#text": string
    size: string
  }>
}

export function useLastFm(username: string) {
  const [userInfo, setUserInfo] = useState<LastFmUserInfo | null>(null)
  const [recentTracks, setRecentTracks] = useState<LastFmTrack[]>([])
  const [topArtists, setTopArtists] = useState<LastFmArtist[]>([])
  const [topAlbums, setTopAlbums] = useState<LastFmAlbum[]>([])
  const [topTracks, setTopTracks] = useState<LastFmTrack[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasInitialized = useRef(false)

  const makeLastFmRequest = useCallback(
    async (method: string, additionalParams: Record<string, string> = {}) => {
      const params = new URLSearchParams({
        method,
        ...additionalParams,
      })

      try {
        const response = await fetch(`/api/lastfm/user/${username}?${params}`)

        if (!response.ok) {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            throw new Error(errorData.error || `API error: ${response.status}`)
          } else {
            const errorText = await response.text()
            console.error(`Non-JSON error response: ${errorText}`)
            throw new Error(`API error: ${response.status} - ${response.statusText}`)
          }
        }

        const data = await response.json()
        return data
      } catch (error) {
        console.error(`Last.fm request failed for ${method}:`, error)
        throw error
      }
    },
    [username],
  )

  const fetchUserInfo = useCallback(async () => {
    try {
      const data = await makeLastFmRequest("user.getinfo")
      if (data.user) {
        setUserInfo(data.user)
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err)
      throw err
    }
  }, [makeLastFmRequest])

  const fetchRecentTracks = useCallback(async () => {
    try {
      const data = await makeLastFmRequest("user.getrecenttracks", { limit: "10" })
      if (data.recenttracks?.track) {
        setRecentTracks(Array.isArray(data.recenttracks.track) ? data.recenttracks.track : [data.recenttracks.track])
      }
    } catch (err) {
      console.error("Failed to fetch recent tracks:", err)
      // Don't throw - this is optional data
    }
  }, [makeLastFmRequest])

  const fetchTopArtists = useCallback(async () => {
    try {
      const data = await makeLastFmRequest("user.gettopartists", {
        period: "1month",
        limit: "8",
      })
      if (data.topartists?.artist) {
        setTopArtists(data.topartists.artist)
      }
    } catch (err) {
      console.error("Failed to fetch top artists:", err)
      // Don't throw - this is optional data
    }
  }, [makeLastFmRequest])

  const fetchTopAlbums = useCallback(async () => {
    try {
      const data = await makeLastFmRequest("user.gettopalbums", {
        period: "1month",
        limit: "6",
      })
      if (data.topalbums?.album) {
        setTopAlbums(data.topalbums.album)
      }
    } catch (err) {
      console.error("Failed to fetch top albums:", err)
      // Don't throw - this is optional data
    }
  }, [makeLastFmRequest])

  const fetchTopTracks = useCallback(async () => {
    try {
      const data = await makeLastFmRequest("user.gettoptracks", {
        period: "1month",
        limit: "10",
      })
      if (data.toptracks?.track) {
        setTopTracks(data.toptracks.track)
      }
    } catch (err) {
      console.error("Failed to fetch top tracks:", err)
      // Don't throw - this is optional data
    }
  }, [makeLastFmRequest])

  const fetchAllData = useCallback(async () => {
    if (hasInitialized.current || !username) return

    hasInitialized.current = true
    setLoading(true)
    setError(null)

    try {
      // Try to fetch user info first - this is the most important
      await fetchUserInfo()

      // Then fetch optional data - don't fail if these don't work
      await Promise.allSettled([fetchRecentTracks(), fetchTopArtists(), fetchTopAlbums(), fetchTopTracks()])
    } catch (err) {
      console.error("Failed to fetch Last.fm data:", err)
      setError(err instanceof Error ? err.message : "Failed to load Last.fm data")
      hasInitialized.current = false
    } finally {
      setLoading(false)
    }
  }, [username, fetchUserInfo, fetchRecentTracks, fetchTopArtists, fetchTopAlbums, fetchTopTracks])

  const refetch = useCallback(() => {
    hasInitialized.current = false
    setUserInfo(null)
    setRecentTracks([])
    setTopArtists([])
    setTopAlbums([])
    setTopTracks([])
    setError(null)
    fetchAllData()
  }, [fetchAllData])

  useEffect(() => {
    if (username) {
      fetchAllData()
    }
  }, [username, fetchAllData])

  return {
    userInfo,
    recentTracks,
    topArtists,
    topAlbums,
    topTracks,
    loading,
    error,
    refetch,
  }
}
