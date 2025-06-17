import type { NextApiRequest, NextApiResponse } from "next"
import wiki from "wikijs"

const fallbackImage = (name: string) =>
  `https://source.unsplash.com/400x400/?${encodeURIComponent(name)},music`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Missing or invalid name" })
  }

  try {
    const page = await wiki().page(name)
    const images = await page.images()
    const image = images.find((img) =>
      /\.(jpg|jpeg|png)$/i.test(img) && !img.toLowerCase().includes("logo"),
    )

    return res.status(200).json({ image: image || fallbackImage(name) })
  } catch (err) {
    console.warn(`Wiki error for ${name}:`, err)
    return res.status(200).json({ image: fallbackImage(name) })
  }
}