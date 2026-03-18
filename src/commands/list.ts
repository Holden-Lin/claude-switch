import chalk from "chalk";
import { listProfiles } from "../lib/profiles";
import { header, hint, blank, icons, formatLabel, formatType } from "../lib/ui";

export async function list(): Promise<void> {
  const profiles = await listProfiles();

  blank();
  if (profiles.length === 0) {
    console.log(header("  No profiles yet"));
    blank();
    hint(`Run ${chalk.cyan("claude-switch add <name>")} to get started`);
    blank();
    return;
  }

  console.log(header("  Profiles"));
  blank();

  for (const p of profiles) {
    const icon = p.isActive ? icons.active : icons.inactive;
    const name = p.isActive ? chalk.green.bold(p.name) : p.name;
    const type = formatType(p.type);
    const label = formatLabel(p.label, p.type);
    console.log(`  ${icon} ${name}  ${type}  ${label}`);
  }

  blank();
}
