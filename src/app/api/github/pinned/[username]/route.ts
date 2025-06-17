import { type NextRequest, NextResponse } from "next/server"

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
}

interface PinnedRepo {
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

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = params

    console.log(`[GitHub API] Fetching pinned repos for user: ${username}`)

    // First, try to get pinned repositories using GitHub GraphQL API
    const graphqlQuery = `
      query($username: String!) {
        user(login: $username) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                id
                name
                description
                url
                homepageUrl
                primaryLanguage {
                  name
                }
                stargazerCount
                forkCount
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
                updatedAt
                createdAt
                pushedAt
              }
            }
          }
        }
      }
    `

    // Try GraphQL first (requires GitHub token)
    const githubToken = process.env.GITHUB_TOKEN

    if (githubToken) {
      try {
        const graphqlResponse = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: graphqlQuery,
            variables: { username },
          }),
        })

        if (graphqlResponse.ok) {
          const graphqlData = await graphqlResponse.json()

          if (graphqlData.data?.user?.pinnedItems?.nodes) {
            const pinnedRepos: PinnedRepo[] = graphqlData.data.user.pinnedItems.nodes.map((repo: any) => ({
              id: repo.id,
              name: repo.name,
              description: repo.description || "",
              url: repo.url,
              homepage: repo.homepageUrl,
              language: repo.primaryLanguage?.name || null,
              stars: repo.stargazerCount,
              forks: repo.forkCount,
              topics: repo.repositoryTopics.nodes.map((topic: any) => topic.topic.name),
              lastUpdated: repo.updatedAt,
            }))

            console.log(`[GitHub API] Found ${pinnedRepos.length} pinned repos via GraphQL`)
            return NextResponse.json({ repos: pinnedRepos, source: "graphql" })
          }
        }
      } catch (error) {
        console.warn("[GitHub API] GraphQL failed, falling back to REST API:", error)
      }
    }

    // Fallback to REST API - get user's repositories and use the most starred/recent ones
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-Website/1.0",
    }

    if (githubToken) {
      headers["Authorization"] = `token ${githubToken}`
    }

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
      headers,
    })

    if (!reposResponse.ok) {
      if (reposResponse.status === 404) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      throw new Error(`GitHub API returned ${reposResponse.status}`)
    }

    const repos: GitHubRepo[] = await reposResponse.json()

    // Filter out forks and sort by stars + recent activity
    const ownRepos = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => {
        // Prioritize repos with more stars and recent activity
        const scoreA = a.stargazers_count * 2 + new Date(a.pushed_at).getTime() / 1000000000
        const scoreB = b.stargazers_count * 2 + new Date(b.pushed_at).getTime() / 1000000000
        return scoreB - scoreA
      })
      .slice(0, 6) // Take top 6 repositories

    const pinnedRepos: PinnedRepo[] = ownRepos.map((repo) => ({
      id: repo.id.toString(),
      name: repo.name,
      description: repo.description || "",
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics || [],
      lastUpdated: repo.updated_at,
    }))

    console.log(`[GitHub API] Found ${pinnedRepos.length} repos via REST API`)
    return NextResponse.json({ repos: pinnedRepos, source: "rest" })
  } catch (error) {
    console.error("[GitHub API] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch GitHub data" },
      { status: 500 },
    )
  }
}
