# claude-switch

Tired of logging in and out of Claude Code? Same.

This tool lets you save multiple Claude accounts as profiles and switch between them instantly. Works with subscriptions (Pro, Max, Team) and API keys.

## Install

You'll need [Bun](https://bun.sh) installed.

```bash
bun add -g @hoangvu12/claude-switch
```

Or with npm (still needs Bun as runtime):

```bash
npm install -g @hoangvu12/claude-switch
```

## Getting Started

```bash
# Save your current logged-in account
claude-switch add personal

# Log into another account, save that too
claude login
claude-switch add work

# Now switch whenever you want
claude-switch use personal
claude-switch use work

# Or just run it with no args for a picker
claude-switch
```

## Adding API Key Profiles

Not on a subscription? You can save API key profiles too:

```bash
claude-switch add my-api
# Pick "API Key" when prompted, paste your key
```

When you switch to an API key profile, the key gets written to your Claude settings. When you switch away, it's cleaned up automatically.

## Commands

| Command | What it does |
|---|---|
| `claude-switch` | Opens an interactive picker |
| `claude-switch add <name>` | Save a new profile (OAuth or API key) |
| `claude-switch use <name>` | Switch to a profile |
| `claude-switch <name>` | Shorthand for `use` |
| `claude-switch list` | Show all your profiles |
| `claude-switch current` | Print the active profile |
| `claude-switch remove <name>` | Delete a profile |

## What the list looks like

```
  Profiles

  ▸ personal  oauth  Max
    work      oauth  Pro
    testing   api-key  sk-ant-••••Bx4Q
```

## How It Works

Profiles live in `~/.claude-profiles/`. Each one stores either OAuth credentials or an API key.

**OAuth profiles** (subscriptions) swap `~/.claude/.credentials.json` — the file Claude Code reads for auth. On macOS, it reads/writes the Keychain instead.

**API key profiles** write `ANTHROPIC_API_KEY` into the `env` block of `~/.claude/settings.json`. This works everywhere — terminal, VS Code, Cursor, any IDE that runs Claude Code.

When you switch profiles, your current session is automatically backed up to its profile before the swap. Nothing gets lost.

## Works With

- Any OS — macOS (Keychain), Windows, Linux
- Any IDE — VS Code, Cursor, Windsurf, or plain terminal
- Subscriptions — Pro, Max, Team, Enterprise
- API keys — any Anthropic API key

## License

MIT
