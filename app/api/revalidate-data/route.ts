import { revalidatePath, revalidateTag } from "next/cache"

const DATA_CACHE_TAGS = ["mpl-round-html", "mpl-standings-html"]

export async function POST() {
  for (const tag of DATA_CACHE_TAGS) {
    revalidateTag(tag, { expire: 0 })
  }

  revalidatePath("/games")
  revalidatePath("/games/[round]", "page")
  revalidatePath("/table")

  return Response.json({ revalidated: true })
}
