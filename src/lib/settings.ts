import { SETTINGS_FILE } from "./paths";

type Settings = Record<string, unknown>;

async function read(): Promise<Settings> {
  const file = Bun.file(SETTINGS_FILE);
  if (!(await file.exists())) return {};
  try {
    return (await file.json()) as Settings;
  } catch {
    return {};
  }
}

async function write(settings: Settings): Promise<void> {
  await Bun.write(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export async function setApiKey(key: string): Promise<void> {
  const settings = await read();
  const env = (settings.env as Record<string, string>) ?? {};
  env.ANTHROPIC_API_KEY = key;
  settings.env = env;
  await write(settings);
}

export async function clearApiKey(): Promise<void> {
  const settings = await read();
  const env = (settings.env as Record<string, string>) ?? {};
  delete env.ANTHROPIC_API_KEY;
  if (Object.keys(env).length === 0) {
    delete settings.env;
  } else {
    settings.env = env;
  }
  await write(settings);
}

export async function getApiKey(): Promise<string | null> {
  const settings = await read();
  const env = settings.env as Record<string, string> | undefined;
  return env?.ANTHROPIC_API_KEY ?? null;
}
