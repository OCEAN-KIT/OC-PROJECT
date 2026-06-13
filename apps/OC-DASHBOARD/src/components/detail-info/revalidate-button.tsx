"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { revalidateFullRouteCache } from "@/server/revalidateFullRouteCache";

type Props = {
  path: string;
};

export default function RevalidateButton({ path }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await revalidateFullRouteCache(path);
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-slate-50 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "revalidating..." : "revalidate"}
    </button>
  );
}
