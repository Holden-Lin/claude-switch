import chalk from "chalk";
import { readState } from "../lib/profiles";
import { blank, hint } from "../lib/ui";

export async function current(): Promise<void> {
  const state = await readState();

  blank();
  if (state.active) {
    console.log(`  ${chalk.green.bold(state.active)}`);
  } else {
    console.log(`  ${chalk.dim("No active profile")}`);
    hint(`Run ${chalk.cyan("claude-switch add <name>")} to create one`);
  }
  blank();
}
