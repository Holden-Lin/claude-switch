import chalk from "chalk";
import { switchProfile, profileExists, readState, getProfileData } from "../lib/profiles";
import { readCredentials } from "../lib/credentials";
import { profileCredentials } from "../lib/paths";
import { success, error, blank, formatLabel, formatType, maskKey } from "../lib/ui";

export async function use(name: string): Promise<void> {
  blank();

  if (!(await profileExists(name))) {
    error(`Profile "${name}" not found.`);
    console.log(chalk.dim(`  Run ${chalk.cyan("claude-switch list")} to see your profiles`));
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

  const data = await getProfileData(name);
  let label: string;

  if (data.type === "api-key" && data.apiKey) {
    label = chalk.dim(maskKey(data.apiKey));
  } else {
    const creds = await readCredentials(profileCredentials(name));
    label = formatLabel(creds?.claudeAiOauth?.subscriptionType ?? null, "oauth");
  }

  success(`Switched to ${chalk.bold(name)}  ${formatType(data.type)}  ${label}`);
  blank();
}
