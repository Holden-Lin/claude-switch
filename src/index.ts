#!/usr/bin/env bun

import chalk from "chalk";
import { select } from "@inquirer/prompts";
import { listProfiles, readState } from "./lib/profiles";
import { formatSubscription, blank, hint } from "./lib/ui";
import { add } from "./commands/add";
import { use } from "./commands/use";
import { list } from "./commands/list";
import { remove } from "./commands/remove";
import { current } from "./commands/current";

const HELP = `
  ${chalk.bold("claude-switch")} — Switch between Claude Code accounts

  ${chalk.dim("Usage:")}
    claude-switch                  Interactive profile picker
    claude-switch add <name>       Add a new profile
    claude-switch use <name>       Switch to a profile
    claude-switch list             List all profiles
    claude-switch remove <name>    Remove a profile
    claude-switch current          Show active profile
    claude-switch help             Show this help
`;

async function interactivePicker(): Promise<void> {
  const profiles = await listProfiles();

  if (profiles.length === 0) {
    blank();
    console.log(chalk.bold("  Welcome to claude-switch"));
    blank();
    hint(`Run ${chalk.cyan("claude-switch add <name>")} to save your first profile`);
    blank();
    return;
  }

  blank();
  const state = await readState();

  const choice = await select({
    message: "Switch to profile",
    choices: profiles.map((p) => ({
      name: `${p.name}  ${formatSubscription(p.subscriptionType)}${p.isActive ? chalk.dim("  (active)") : ""}`,
      value: p.name,
    })),
    default: state.active ?? undefined,
  });

  await use(choice);
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  try {
    switch (command) {
      case "add":
        if (!args[0]) {
          console.error(chalk.red("\n  Missing profile name. Usage: claude-switch add <name>\n"));
          process.exit(1);
        }
        await add(args[0]);
        break;

      case "use":
        if (!args[0]) {
          console.error(chalk.red("\n  Missing profile name. Usage: claude-switch use <name>\n"));
          process.exit(1);
        }
        await use(args[0]);
        break;

      case "list":
      case "ls":
        await list();
        break;

      case "remove":
      case "rm":
        if (!args[0]) {
          console.error(chalk.red("\n  Missing profile name. Usage: claude-switch remove <name>\n"));
          process.exit(1);
        }
        await remove(args[0]);
        break;

      case "current":
        await current();
        break;

      case "help":
      case "--help":
      case "-h":
        console.log(HELP);
        break;

      case undefined:
        await interactivePicker();
        break;

      default:
        // Treat unknown command as a profile name shortcut: `claude-switch work`
        const profiles = await listProfiles();
        const match = profiles.find((p) => p.name === command);
        if (match) {
          await use(command);
        } else {
          console.error(chalk.red(`\n  Unknown command: "${command}"`));
          console.log(HELP);
          process.exit(1);
        }
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("User force closed")) {
      blank();
      process.exit(0);
    }
    throw err;
  }
}

main();
