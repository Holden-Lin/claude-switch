import { platform } from "os";
import { spawnSync } from "child_process";
import { CREDENTIALS_FILE } from "./paths";
import { fileExists, readJson, writeJson } from "./fs";
import type { CredentialsFile } from "../types";

const IS_MACOS = platform() === "darwin";
const KEYCHAIN_SERVICE = "Claude Code-credentials";

function getKeychainAccount(): string {
  return process.env.USER ?? spawnSync("whoami").stdout.toString().trim();
}

// -- macOS Keychain helpers --

async function readKeychain(): Promise<CredentialsFile | null> {
  const result = spawnSync("security", [
    "find-generic-password",
    "-s",
    KEYCHAIN_SERVICE,
    "-a",
    getKeychainAccount(),
    "-w",
  ]);

  if (result.status !== 0) return null;

  try {
    const hex = result.stdout.toString().trim();
    const json = Buffer.from(hex, "hex").toString("utf-8");
    return JSON.parse(json) as CredentialsFile;
  } catch {
    return null;
  }
}

async function writeKeychain(creds: CredentialsFile): Promise<void> {
  const json = JSON.stringify(creds);
  const hex = Buffer.from(json, "utf-8").toString("hex");
  const account = getKeychainAccount();

  // Delete existing entry first (ignore errors if it doesn't exist)
  spawnSync("security", [
    "delete-generic-password",
    "-s",
    KEYCHAIN_SERVICE,
    "-a",
    account,
  ]);

  const result = spawnSync("security", [
    "add-generic-password",
    "-s",
    KEYCHAIN_SERVICE,
    "-a",
    account,
    "-w",
    hex,
  ]);

  if (result.status !== 0) {
    throw new Error("Failed to write to macOS Keychain");
  }
}

// -- File-based helpers (Linux/Windows) --

async function readJsonFile(
  path: string,
): Promise<CredentialsFile | null> {
  return readJson<CredentialsFile | null>(path, null);
}

async function writeJsonFile(
  creds: CredentialsFile,
  path: string,
): Promise<void> {
  await writeJson(path, creds);
}

// -- Public API --

/**
 * Read credentials from a path, or from the system credential store.
 * When path === CREDENTIALS_FILE on macOS, reads from Keychain.
 * All other paths (profile dirs) always use file-based storage.
 */
export async function readCredentials(
  path: string = CREDENTIALS_FILE,
): Promise<CredentialsFile | null> {
  if (IS_MACOS && path === CREDENTIALS_FILE) {
    return readKeychain();
  }
  return readJsonFile(path);
}

export async function writeCredentials(
  creds: CredentialsFile,
  path: string = CREDENTIALS_FILE,
): Promise<void> {
  if (IS_MACOS && path === CREDENTIALS_FILE) {
    return writeKeychain(creds);
  }
  await writeJsonFile(creds, path);
}

export async function copyCredentials(
  from: string,
  to: string,
): Promise<void> {
  const creds = await readCredentials(from);
  if (!creds) throw new Error(`No credentials found at ${from}`);
  await writeCredentials(creds, to);
}
