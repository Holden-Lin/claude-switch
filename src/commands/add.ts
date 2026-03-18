import chalk from "chalk";
import { confirm } from "@inquirer/prompts";
import { profileExists, addProfile } from "../lib/profiles";
import { readCredentials } from "../lib/credentials";
import { CREDENTIALS_FILE } from "../lib/paths";
import { success, error, info, blank, formatSubscription } from "../lib/ui";

export async function add(name: string): Promise<void> {
  blank();

  if (!name || /[/\\:*?"<>|]/.test(name)) {
    error("Invalid profile name. Use alphanumeric characters, hyphens, or underscores.");
    blank();
    process.exit(1);
  }

  if (await profileExists(name)) {
    error(`Profile "${name}" already exists.`);
    blank();
    process.exit(1);
  }

  const creds = await readCredentials(CREDENTIALS_FILE);

  if (creds) {
    const sub = creds.claudeAiOauth?.subscriptionType;
    info(
      `Found active session ${sub ? `(${formatSubscription(sub)})` : ""}`,
    );

    const importCurrent = await confirm({
      message: "Import this session as the new profile?",
      default: true,
    });

    if (importCurrent) {
      await addProfile(name, CREDENTIALS_FILE);
      blank();
      success(`Profile ${chalk.bold(name)} created from current session`);
      blank();
      return;
    }
  }

  // No credentials or user declined — run claude login
  info("Opening Claude login...");
  blank();

  const proc = Bun.spawn(["claude", "login"], {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  await proc.exited;

  const newCreds = await readCredentials(CREDENTIALS_FILE);
  if (!newCreds) {
    blank();
    error("Login failed or was cancelled. No credentials found.");
    blank();
    process.exit(1);
  }

  await addProfile(name, CREDENTIALS_FILE);
  blank();
  success(`Profile ${chalk.bold(name)} created`);
  blank();
}
