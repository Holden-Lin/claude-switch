import chalk from "chalk";
import { readState, getProfileData } from "../lib/profiles";
import { blank, hint, formatType } from "../lib/ui";

export async function current(): Promise<void> {
  const state = await readState();

  blank();
  if (state.active) {
    const data = await getProfileData(state.active);
    console.log(`  ${chalk.green.bold(state.active)}  ${formatType(data.type)}`);
  } else {
    console.log(`  ${chalk.dim("No active profile")}`);
    hint(`Run ${chalk.cyan("claude-switch add <name>")} to create one`);
  }
  blank();
}
