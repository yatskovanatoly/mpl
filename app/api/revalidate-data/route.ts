import { revalidatePath, revalidateTag } from "next/cache"

const DATA_CACHE_TAGS = [
  "mpl-round-html",
  "mpl-standings-html",
  "mpl-calendar-data",
  "mpl-season-list-html",
  "mpl-season-id",
]

export async function POST() {
  for (const tag of DATA_CACHE_TAGS) {
    revalidateTag(tag, { expire: 0 })
  }

  revalidatePath("/games")
  revalidatePath("/games/[round]", "page")
  revalidatePath("/table")
  revalidatePath("/calendar")

  return Response.json({ revalidated: true })
}
