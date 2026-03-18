import chalk from "chalk";
import { switchProfile, profileExists, readState } from "../lib/profiles";
import { readCredentials } from "../lib/credentials";
import { profileCredentials } from "../lib/paths";
import { success, error, blank, icons, formatSubscription } from "../lib/ui";

export async function use(name: string): Promise<void> {
  blank();

  if (!(await profileExists(name))) {
    error(`Profile "${name}" does not exist.`);
    console.log(
      chalk.dim(`  Run ${chalk.cyan("claude-switch list")} to see available profiles`),
    );
    blank();
    process.exit(1);
  }

  const state = await readState();
  if (state.active === name) {
    success(`Already on ${chalk.bold(name)}`);
    blank();
    return;
  }

  await switchProfile(name);

  const creds = await readCredentials(profileCredentials(name));
  const sub = creds?.claudeAiOauth?.subscriptionType ?? null;

  success(
    `Switched to ${chalk.bold(name)}  ${formatSubscription(sub)}`,
  );
  blank();
}
