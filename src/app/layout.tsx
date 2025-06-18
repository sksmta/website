import type React from "react"
import type { Metadata } from "next"
import { Fira_Sans, Poppins } from "next/font/google"
import "./globals.css"

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-fira-sans",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata = {
  title: "Shreyas Samanta – Software Engineer",
  description:
    "The portfolio of Shreyas Samanta – 3rd Year Electronic & Software Engineering student at the University of Glasgow.",
  keywords: [
    "Shreyas Samanta",
    "full-stack developer",
    "open source",
    "Next.js portfolio",
    "software engineer India",
    "developer portfolio",
    "GitHub projects",
    "typescript",
    "react developer",
    "AI developer",
  ],
  creator: "Shreyas Samanta",
  applicationName: "Shreyas Samanta's Portfolio",
  authors: [{ name: "Shreyas Samanta", url: "https://sksmta.com" }],
  metadataBase: new URL("https://sksmta.com"),
  openGraph: {
    title: "Shreyas Samanta – Software Engineer",
    description:
      "3rd Year Electronic & Software Engineering Student @ University of Glasgow.",
    url: "https://sksmta.com",
    siteName: "Shreyas Samanta",
    images: [
      {
        url: "/og.png", // Make sure this exists in your public folder
        width: 1200,
        height: 630,
        alt: "Shreyas Samanta – Software Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreyas Samanta – Software Engineer",
    description:
      "Building tools, projects, and solutions that make the web better. Discover more about Shreyas Samanta.",
    creator: "@tbhshreyas",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  category: "technology",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${firaSans.variable} ${poppins.variable}`}>
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  )
}
