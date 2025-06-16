import { type NextRequest, NextResponse } from "next/server"

const LASTFM_API_KEY = "0f57544cf5bca11119b856dc58ee4539"
const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = params
    const { searchParams } = new URL(request.url)
    const method = searchParams.get("method") || "user.getinfo"
    const period = searchParams.get("period") || "overall"
    const limit = searchParams.get("limit") || "10"

    console.log(`[Last.fm API] Fetching ${method} for user: ${username}`)

    const url = new URL(LASTFM_BASE_URL)
    url.searchParams.set("method", method)
    url.searchParams.set("user", username)
    url.searchParams.set("api_key", LASTFM_API_KEY)
    url.searchParams.set("format", "json")

    if (method.includes("top")) {
      url.searchParams.set("period", period)
      url.searchParams.set("limit", limit)
    }

    console.log(`[Last.fm API] Request URL: ${url.toString()}`)

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "PersonalWebsite/1.0 (+https://example.com)",
        Accept: "application/json",
      },
    })

    console.log(`[Last.fm API] Response status: ${response.status}`)
    console.log(`[Last.fm API] Response headers:`, Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Last.fm API] HTTP Error ${response.status}: ${errorText}`)
      return NextResponse.json(
        { error: `Last.fm API returned ${response.status}: ${response.statusText}` },
        { status: response.status },
      )
    }

    const responseText = await response.text()
    console.log(`[Last.fm API] Raw response: ${responseText.substring(0, 200)}...`)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error(`[Last.fm API] JSON Parse Error:`, parseError)
      console.error(`[Last.fm API] Response text:`, responseText)
      return NextResponse.json({ error: "Invalid JSON response from Last.fm API" }, { status: 500 })
    }

    if (data.error) {
      console.error(`[Last.fm API] API Error: ${data.error} - ${data.message}`)
      return NextResponse.json({ error: `Last.fm API error: ${data.message}` }, { status: 400 })
    }

    console.log(`[Last.fm API] Success for ${method}`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Last.fm API] Unexpected error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
