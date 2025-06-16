"use client"

import { useState, useEffect } from "react"
import { Navigation } from "../../components/navigation"
import { SocialLinks } from "../../components/social-links"
import { CustomCursor } from "../../components/cursor"
import { Particles } from "../../components/particles"
import { MusicHero } from "../../components/music-hero"
import { LastFmPlayer } from "../../components/lastfm-player"
import { RecentTracks } from "../../components/recent-tracks"
import { TopArtists } from "../../components/top-artists"
import { LastFmAlbums } from "../../components/lastfm-albums"
import { CommandPalette } from "../../components/command-palette"
import { useLastFm } from "../../hooks/use-lastfm"
import { RefreshCw, ExternalLink, AlertCircle, CheckCircle } from "lucide-react"

// Your Last.fm username
const LASTFM_USERNAME = "sksmta"

export default function MusicPage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  const { userInfo, recentTracks, topArtists, topAlbums, topTracks, loading, error, refetch } =
    useLastFm(LASTFM_USERNAME)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="main-container">
      <CustomCursor />
      <Particles />
      <Navigation />

      <main className="music-main">
        <MusicHero />

        {loading && (
          <div className="loading-message">
            <div className="flex items-center gap-2 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
              <p>Loading Last.fm data...</p>
            </div>
            <p className="text-sm text-gray-400">Fetching music scrobbles for {LASTFM_USERNAME}...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Last.fm Error</h3>
            </div>
            <p className="mb-4 text-red-400">Error: {error}</p>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">🔍 Troubleshooting:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Check if the username "{LASTFM_USERNAME}" exists on Last.fm</li>
                <li>Verify the user profile is public</li>
                <li>Check browser console for detailed errors</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={refetch}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <a
                href={`https://last.fm/user/${LASTFM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Check Profile
              </a>
            </div>
          </div>
        )}

        {!loading && !error && userInfo && (
          <>
            <div className="music-status-bar">
              <div className="status-indicator">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="status-text">Connected to Last.fm</span>
              </div>
              <div className="music-actions">
                <a
                  href={`https://last.fm/user/${LASTFM_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lastfm-link"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Last.fm
                </a>
                <button onClick={refetch} className="refresh-button" title="Refresh Last.fm data">
                  <RefreshCw className="w-4 h-4 refresh-icon" />
                  <span>Refresh</span>
                  <div className="refresh-shimmer"></div>
                </button>
              </div>
            </div>

            <LastFmPlayer userInfo={userInfo} recentTracks={recentTracks} />

            <div className="music-content-grid">
              <LastFmAlbums albums={topAlbums} />
              <div className="music-bottom-section">
                <RecentTracks tracks={recentTracks.slice(1, 11)} />
                <TopArtists artists={topArtists} />
              </div>
            </div>
          </>
        )}

        {!loading && !error && !userInfo && (
          <div className="text-center py-8">
            <p className="text-gray-400">No data loaded yet. Try refreshing.</p>
          </div>
        )}
      </main>

      <SocialLinks />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  )
}
