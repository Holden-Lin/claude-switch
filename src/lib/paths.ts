import { homedir } from "os";
import { join } from "path";

export const CLAUDE_DIR = join(homedir(), ".claude");
export const CLAUDE_JSON = join(homedir(), ".claude.json");
export const CREDENTIALS_FILE = join(CLAUDE_DIR, ".credentials.json");
export const SETTINGS_FILE = join(CLAUDE_DIR, "settings.json");
export const PROFILES_DIR = join(homedir(), ".claude-profiles");
export const STATE_FILE = join(PROFILES_DIR, "state.json");

export function profileDir(name: string): string {
  return join(PROFILES_DIR, name);
}

export function profileCredentials(name: string): string {
  return join(profileDir(name), ".credentials.json");
}

export function profileDataFile(name: string): string {
  return join(profileDir(name), "profile.json");
}

export function profileAccountFile(name: string): string {
  return join(profileDir(name), "account.json");
}
