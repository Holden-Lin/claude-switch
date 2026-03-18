import chalk from "chalk";
import type { ProfileType } from "../types";

export const icons = {
  active: chalk.green("▸"),
  inactive: chalk.dim(" "),
  success: chalk.green("✓"),
  error: chalk.red("✗"),
  arrow: chalk.cyan("→"),
  info: chalk.blue("●"),
} as const;

export function header(text: string): string {
  return chalk.bold(text);
}

export function success(text: string): void {
  console.log(`  ${icons.success} ${text}`);
}

export function error(text: string): void {
  console.error(`  ${icons.error} ${chalk.red(text)}`);
}

export function info(text: string): void {
  console.log(`  ${icons.info} ${text}`);
}

export function hint(text: string): void {
  console.log(chalk.dim(`  ${text}`));
}

export function blank(): void {
  console.log();
}

export function formatType(type: ProfileType): string {
  return type === "oauth" ? chalk.blue("oauth") : chalk.yellow("api-key");
}

export function formatLabel(label: string | null, type: ProfileType): string {
  if (!label) return chalk.dim("unknown");
  if (type === "api-key") return chalk.dim(label);

  const map: Record<string, string> = {
    max: chalk.magenta("Max"),
    pro: chalk.cyan("Pro"),
    free: chalk.dim("Free"),
    team: chalk.blue("Team"),
    enterprise: chalk.yellow("Enterprise"),
  };
  return map[label.toLowerCase()] ?? chalk.dim(label);
}

export function maskKey(key: string): string {
  if (key.length <= 12) return "••••";
  return key.slice(0, 7) + "••••" + key.slice(-4);
}
