import { BASE_URL } from "@/lib/urls"
import { unstable_cache } from "next/cache"

type RouteContext = {
  params: Promise<{
    path: string[]
  }>
}

const fetchTeamLogo = unstable_cache(
  async (path: string) => {
    const response = await fetch(`https://${BASE_URL}/${path}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch team logo: ${response.status}`)
    }

    const contentType = response.headers.get("content-type") ?? "image/png"
    const buffer = Buffer.from(await response.arrayBuffer())

    return {
      contentType,
      data: buffer.toString("base64"),
    }
  },
  ["mpl-team-logo"],
  {
    revalidate: 60 * 60 * 24 * 30,
    tags: ["mpl-team-logo"],
  },
)

export async function GET(_request: Request, { params }: RouteContext) {
  const { path } = await params
  const logoPath = path.join("/")

  if (!logoPath || logoPath.includes("..")) {
    return new Response("Invalid logo path", { status: 400 })
  }

  try {
    const logo = await fetchTeamLogo(logoPath)

    return new Response(Buffer.from(logo.data, "base64"), {
      headers: {
        "Cache-Control": "public, max-age=2592000, immutable",
        "Content-Type": logo.contentType,
      },
    })
  } catch {
    return new Response("Logo not found", { status: 404 })
  }
}
