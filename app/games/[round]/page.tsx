import GamesPage from "@/components/Round";
import { getRounds } from "@/lib/harvest-data";

export default async function Page({
  params,
}: {
  params: Promise<{ round: string }>;
}) {
  const round = await params;
  const roundNum = Number(round);
  return <GamesPage round={roundNum} />;
}

export async function generateStaticParams() {
  const { rounds } = await getRounds();

  return rounds.map((round) => ({
    round: String(round),
  }));
}
