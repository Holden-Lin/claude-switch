import { mkdir, readdir, rm } from "fs/promises";
import {
  PROFILES_DIR,
  STATE_FILE,
  CREDENTIALS_FILE,
  profileDir,
  profileCredentials,
} from "./paths";
import { readCredentials, copyCredentials } from "./credentials";
import type { ProfileState, ProfileInfo } from "../types";

async function ensureProfilesDir(): Promise<void> {
  await mkdir(PROFILES_DIR, { recursive: true });
}

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
  await ensureProfilesDir();
  await Bun.write(STATE_FILE, JSON.stringify(state, null, 2));
}

export async function listProfiles(): Promise<ProfileInfo[]> {
  await ensureProfilesDir();
  const state = await readState();
  const entries = await readdir(PROFILES_DIR, { withFileTypes: true });
  const profiles: ProfileInfo[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const creds = await readCredentials(profileCredentials(entry.name));
    profiles.push({
      name: entry.name,
      subscriptionType: creds?.claudeAiOauth?.subscriptionType ?? null,
      isActive: state.active === entry.name,
    });
  }

  return profiles.sort((a, b) => a.name.localeCompare(b.name));
}

export async function profileExists(name: string): Promise<boolean> {
  const file = Bun.file(profileCredentials(name));
  return file.exists();
}

export async function addProfile(
  name: string,
  fromCredentials: string = CREDENTIALS_FILE,
): Promise<void> {
  await mkdir(profileDir(name), { recursive: true });
  await copyCredentials(fromCredentials, profileCredentials(name));
  await writeState({ active: name });
}

export async function switchProfile(name: string): Promise<void> {
  if (!(await profileExists(name))) {
    throw new Error(`Profile "${name}" does not exist`);
  }

  // Save current credentials back to the active profile
  const state = await readState();
  if (state.active && state.active !== name) {
    const currentCreds = await readCredentials(CREDENTIALS_FILE);
    if (currentCreds) {
      await mkdir(profileDir(state.active), { recursive: true });
      await copyCredentials(CREDENTIALS_FILE, profileCredentials(state.active));
    }
  }

  // Copy target profile credentials to ~/.claude/
  await copyCredentials(profileCredentials(name), CREDENTIALS_FILE);
  await writeState({ active: name });
}

export async function removeProfile(name: string): Promise<void> {
  if (!(await profileExists(name))) {
    throw new Error(`Profile "${name}" does not exist`);
  }
  await rm(profileDir(name), { recursive: true });
  const state = await readState();
  if (state.active === name) {
    await writeState({ active: null });
  }
}
