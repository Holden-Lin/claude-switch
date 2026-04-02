import { spawn, spawnSync } from "child_process";
import chalk from "chalk";
import { select, confirm, password } from "@inquirer/prompts";
import { profileExists, addOAuthProfile, addApiKeyProfile } from "../lib/profiles";
import { readCredentials } from "../lib/credentials";
import { CREDENTIALS_FILE } from "../lib/paths";
import { success, error, info, blank, formatLabel, maskKey } from "../lib/ui";

interface AuthStatus {
  loggedIn?: boolean;
  subscriptionType?: string;
}

function readAuthStatus(): AuthStatus | null {
  const result = spawnSync("claude", ["auth", "status"], {
    encoding: "utf-8",
  });

  if (result.status !== 0) return null;

  try {
    return JSON.parse(result.stdout) as AuthStatus;
  } catch {
    return null;
  }
}

export async function add(name: string): Promise<void> {
  blank();

  if (!name || /[/\\:*?"<>|.\s]/.test(name)) {
    error("Invalid profile name. Use letters, numbers, hyphens, or underscores.");
    blank();
    process.exit(1);
  }

  if (await profileExists(name)) {
    error(`Profile "${name}" already exists.`);
    blank();
    process.exit(1);
  }

  const type = await select({
    message: "What type of profile?",
    choices: [
      { name: "OAuth — Use a Claude subscription (Pro, Max, Team, etc.)", value: "oauth" as const },
      { name: "API Key — Use an Anthropic API key", value: "api-key" as const },
    ],
  });

  if (type === "api-key") {
    await addApiKey(name);
  } else {
    await addOAuth(name);
  }
}

async function addApiKey(name: string): Promise<void> {
  const key = await password({
    message: "Paste your API key",
    mask: "*",
    validate: (v) => {
      if (!v.trim()) return "API key cannot be empty";
      return true;
    },
  });

  await addApiKeyProfile(name, key.trim());
  blank();
  success(`Profile ${chalk.bold(name)} created  ${chalk.dim(maskKey(key.trim()))}`);
  blank();
}

async function addOAuth(name: string): Promise<void> {
  const creds = await readCredentials(CREDENTIALS_FILE);
  const authStatus = readAuthStatus();

  if (creds || authStatus?.loggedIn) {
    const sub = creds?.claudeAiOauth?.subscriptionType ?? authStatus?.subscriptionType ?? null;
    info(`Found active session ${sub ? `(${formatLabel(sub, "oauth")})` : ""}`);

    const importCurrent = await confirm({
      message: "Save this session as the new profile?",
      default: true,
    });

    if (importCurrent) {
      if (!creds) {
        blank();
        error("Claude reported an active session, but claude-switch could not read the local credentials.");
        console.log(chalk.dim(`  Try ${chalk.cyan("claude auth logout")} and ${chalk.cyan("claude auth login")} once, then run ${chalk.cyan(`claude-switch add ${name}`)} again.`));
        blank();
        process.exit(1);
      }

      await addOAuthProfile(name, CREDENTIALS_FILE);
      blank();
      success(`Profile ${chalk.bold(name)} created from current session`);
      blank();
      return;
    }

    if (authStatus?.loggedIn) {
      info("Logging out current Claude session...");
      blank();

      const logout = spawnSync("claude", ["auth", "logout"], {
        stdio: "inherit",
      });

      if (logout.status !== 0) {
        blank();
        error("Failed to log out current session.");
        blank();
        process.exit(1);
      }
    }
  }

  info("Opening Claude login...");
  blank();

  const proc = spawn("claude", ["auth", "login"], {
    stdio: "inherit",
  });
  const exitCode = await new Promise<number | null>((resolve) => proc.on("close", resolve));

  const newCreds = await readCredentials(CREDENTIALS_FILE);
  if (exitCode !== 0 || !newCreds) {
    const refreshedStatus = readAuthStatus();

    blank();

    if (exitCode === 0 && refreshedStatus?.loggedIn) {
      error("Login succeeded, but claude-switch could not read the stored credentials.");
    } else {
      error("Login failed or was cancelled.");
    }

    blank();
    process.exit(1);
  }

  await addOAuthProfile(name, CREDENTIALS_FILE);
  blank();
  success(`Profile ${chalk.bold(name)} created`);
  blank();
}
