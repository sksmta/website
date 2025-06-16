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

export const metadata: Metadata = {
  title: "Shreyas Samanta - Software Engineer",
  description: "3rd Year Electronic & Software Engineering Student at the University of Glasgow, UK.",
}

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
