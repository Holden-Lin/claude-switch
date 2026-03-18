import { mkdir, readdir, rm } from "fs/promises";
import {
  PROFILES_DIR,
  STATE_FILE,
  CREDENTIALS_FILE,
  profileDir,
  profileCredentials,
  profileDataFile,
} from "./paths";
import { readCredentials, copyCredentials } from "./credentials";
import { setApiKey, clearApiKey } from "./settings";
import { maskKey } from "./ui";
import type { ProfileState, ProfileInfo, ProfileData } from "../types";

async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

// -- State --

export async function readState(): Promise<ProfileState> {
  const file = Bun.file(STATE_FILE);
  if (!(await file.exists())) return { active: null };
  try {
    return (await file.json()) as ProfileState;
  } catch {
    return { active: null };
  }
}

async function writeState(state: ProfileState): Promise<void> {
  await ensureDir(PROFILES_DIR);
  await Bun.write(STATE_FILE, JSON.stringify(state, null, 2));
}

// -- Profile data --

async function readProfileData(name: string): Promise<ProfileData> {
  const file = Bun.file(profileDataFile(name));
  if (!(await file.exists())) return { type: "oauth" };
  try {
    return (await file.json()) as ProfileData;
  } catch {
    return { type: "oauth" };
  }
}

async function writeProfileData(name: string, data: ProfileData): Promise<void> {
  await Bun.write(profileDataFile(name), JSON.stringify(data, null, 2));
}

// -- Public API --

export async function listProfiles(): Promise<ProfileInfo[]> {
  await ensureDir(PROFILES_DIR);
  const state = await readState();
  const entries = await readdir(PROFILES_DIR, { withFileTypes: true });
  const profiles: ProfileInfo[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const data = await readProfileData(entry.name);
    let label: string | null = null;

    if (data.type === "api-key" && data.apiKey) {
      label = maskKey(data.apiKey);
    } else {
      const creds = await readCredentials(profileCredentials(entry.name));
      label = creds?.claudeAiOauth?.subscriptionType ?? null;
    }

    profiles.push({
      name: entry.name,
      type: data.type,
      label,
      isActive: state.active === entry.name,
    });
  }

  return profiles.sort((a, b) => a.name.localeCompare(b.name));
}

export async function profileExists(name: string): Promise<boolean> {
  const file = Bun.file(profileDataFile(name));
  return file.exists();
}

export async function getProfileData(name: string): Promise<ProfileData> {
  return readProfileData(name);
}

export async function addOAuthProfile(
  name: string,
  fromCredentials: string = CREDENTIALS_FILE,
): Promise<void> {
  await ensureDir(profileDir(name));
  await copyCredentials(fromCredentials, profileCredentials(name));
  await writeProfileData(name, { type: "oauth" });
  await writeState({ active: name });
}

export async function addApiKeyProfile(
  name: string,
  apiKey: string,
): Promise<void> {
  await ensureDir(profileDir(name));
  await writeProfileData(name, { type: "api-key", apiKey });
  await writeState({ active: name });
  await setApiKey(apiKey);
}

export async function switchProfile(name: string): Promise<void> {
  if (!(await profileExists(name))) {
    throw new Error(`Profile "${name}" does not exist`);
  }

  const state = await readState();
  const targetData = await readProfileData(name);

  // Save current credentials back to the old profile (if it was oauth)
  if (state.active && state.active !== name) {
    const oldData = await readProfileData(state.active);
    if (oldData.type === "oauth") {
      const currentCreds = await readCredentials(CREDENTIALS_FILE);
      if (currentCreds) {
        await ensureDir(profileDir(state.active));
        await copyCredentials(CREDENTIALS_FILE, profileCredentials(state.active));
      }
    }
  }

  // Activate the target profile
  if (targetData.type === "api-key" && targetData.apiKey) {
    await setApiKey(targetData.apiKey);
  } else {
    await clearApiKey();
    await copyCredentials(profileCredentials(name), CREDENTIALS_FILE);
  }

  await writeState({ active: name });
}

export async function removeProfile(name: string): Promise<void> {
  if (!(await profileExists(name))) {
    throw new Error(`Profile "${name}" does not exist`);
  }

  const state = await readState();
  const data = await readProfileData(name);

  // Clean up if this was the active api-key profile
  if (state.active === name && data.type === "api-key") {
    await clearApiKey();
  }

  await rm(profileDir(name), { recursive: true });

  if (state.active === name) {
    await writeState({ active: null });
  }
}
