import { check } from "@tauri-apps/plugin-updater";

export interface UpdateInfo {
  version: string;
  notes: string;
  date: string;
}

let pendingUpdate: UpdateInfo | null = null;

export async function checkForUpdate(): Promise<UpdateInfo | null> {
  try {
    const update = await check();
    if (update) {
      pendingUpdate = {
        version: update.version,
        notes: update.body ?? "",
        date: update.date ?? "",
      };
      return pendingUpdate;
    }
    return null;
  } catch {
    return null;
  }
}

export function getPendingUpdate(): UpdateInfo | null {
  return pendingUpdate;
}

export async function installUpdate(): Promise<boolean> {
  try {
    const update = await check();
    if (!update) return false;
    let installed = false;
    await update.downloadAndInstall((event) => {
      if (event.event === "Finished") {
        installed = true;
      }
    });
    return installed;
  } catch {
    return false;
  }
}
