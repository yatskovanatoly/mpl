import { redirect } from "next/navigation"

export const revalidate = 60

export default async function Home() {
  redirect("/games")
}
