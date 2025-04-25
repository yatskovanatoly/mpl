"use client";

import { logosMap } from "@/lib/logos-by-id";
import { Game, Team as TeamType } from "@/lib/types";
import { BASE_URL } from "@/lib/urls";
import Image from "next/image";
import { FC } from "react";

const Games: FC<{ games: Game[] }> = ({ games }) => {
  return (
    <div className="flex w-[500px] flex-col gap-4">{games.map(ResultItem)}</div>
  );
};

const ResultItem = (result: Game) => {
  const { score, home, away, time } = result;

  return (
    <div key={result.home.team} className="grid w-full grid-cols-3">
      <Team {...home} side="home" />
      {score ? <Score score={score ?? time} /> : <Time time={time} />}
      <Team {...away} side="away" />
    </div>
  );
};

const Team: FC<TeamType & { side: string }> = ({ team, logo, side, id }) => {
  return (
    <div
      className={`flex w-full items-center justify-between gap-4 ${
        side === "home"
          ? "justify-self-start"
          : "flex-row-reverse justify-self-end text-right"
      }`}
    >
      {team}
      <Logo logo={logo} id={id} />
    </div>
  );
};

const Logo: FC<{ id: string; logo?: string }> = ({ id, logo }) => {
  const logoUrl = `${BASE_URL}/${logo}`;
  const src = logosMap[id] ?? logoUrl;

  if (!src) return null;
  return <Image height={50} width={50} alt={"logo"} src={src} />;
};

const Score: FC<{ score: string }> = ({ score }) => {
  if (!score) return <div className="grow" />;

  const sanitized = score.replace(/\s+/g, " ").trim();
  const scoreSplit = sanitized.split(" ");

  return (
    <div
      className={`m-auto grid w-16 grid-cols-3 items-center justify-self-center text-2xl font-bold`}
    >
      {scoreSplit.slice(0, 3).map((item, i) => (
        <div className="text-center" key={i}>
          {item}
        </div>
      ))}
      {scoreSplit.length > 3 && (
        <div className="col-span-3 text-center text-sm opacity-30">
          {scoreSplit[3]}
        </div>
      )}
    </div>
  );
};
const Time: FC<{ time: string | undefined }> = ({ time }) => {
  return (
    <div
      className={`flex w-24 items-center justify-between gap-2 justify-self-center text-nowrap`}
    >
      <div className="">🕘</div>
      <div className="muted text-2xl font-bold">{time}</div>
    </div>
  );
};

export default Games;
