"use client";

import { useEffect, useState } from "react";
import { checkForUpdate, installUpdate, type UpdateInfo } from "@/lib/updater";

export default function UpdateNotifier() {
  const [update, setUpdate] = useState<UpdateInfo | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    checkForUpdate().then((u) => {
      if (u) setUpdate(u);
    });
  }, []);

  if (!update) return null;

  const handleInstall = async () => {
    setInstalling(true);
    const ok = await installUpdate();
    if (ok) {
      setUpdate(null);
      alert("Update installed — restart A.M. to finish.");
    } else {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[100] border border-[#00ff41] bg-black text-[#00ff41] px-4 py-2 font-mono text-xs flex items-center gap-3 crt-box">
      <span>
        Update available: <strong>v{update.version}</strong>
      </span>
      <button
        onClick={handleInstall}
        disabled={installing}
        className="underline hover:text-white disabled:opacity-50"
      >
        {installing ? "Downloading…" : "Install & Restart"}
      </button>
      <button
        onClick={() => setUpdate(null)}
        className="text-[#00ff41]/50 hover:text-[#00ff41]"
      >
        ×
      </button>
    </div>
  );
}
