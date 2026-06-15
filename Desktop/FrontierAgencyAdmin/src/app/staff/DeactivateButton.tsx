"use client";

import { useTransition } from "react";
import { setUserActiveAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function DeactivateButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await setUserActiveAction(userId, false);
          router.refresh();
        })
      }
      className="text-xs text-red-400 hover:text-red-300 uppercase tracking-[0.1em] disabled:opacity-50"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {isPending ? "Deactivating…" : "Deactivate"}
    </button>
  );
}
