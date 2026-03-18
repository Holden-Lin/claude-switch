import chalk from "chalk";

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

export function dim(text: string): string {
  return chalk.dim(text);
}

export function hint(text: string): void {
  console.log(chalk.dim(`  ${text}`));
}

export function blank(): void {
  console.log();
}

export function formatSubscription(sub: string | null): string {
  if (!sub) return chalk.dim("unknown");
  const map: Record<string, string> = {
    max: chalk.magenta("Max"),
    pro: chalk.cyan("Pro"),
    free: chalk.dim("Free"),
    team: chalk.blue("Team"),
    enterprise: chalk.yellow("Enterprise"),
  };
  return map[sub.toLowerCase()] ?? chalk.dim(sub);
}
