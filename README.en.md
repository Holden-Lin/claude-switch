# claude-switch

**Language / 语言 / 言語:** [中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

A CLI for quickly switching between Claude Code accounts. It supports both subscription accounts and API key profiles, which makes it useful when you frequently move between personal, team, and test accounts.

This repository is a compatibility-fix fork of the upstream project, focused on resolving login and credential-loading issues on current macOS releases and newer Claude Code versions.

## Why This Fork

- Fixes login command compatibility for current Claude Code versions by using `claude auth login` / `claude auth logout`
- Fixes credential loading from macOS Keychain and supports the JSON format used by current Claude Code
- Keeps backward compatibility with legacy hex-encoded Keychain data written by older `claude-switch` versions
- Preserves extra authentication fields such as `mcpOAuth`, which reduces the risk of losing auth metadata after switching
- Keeps the overall changes minimal and close to the upstream usage model

If Claude Code login already works on your macOS machine, but `claude-switch add` still reports a login failure, this fork is meant to fix that case.

## Use Cases

- Switch between multiple Claude subscription accounts on one machine
- Move quickly between OAuth accounts and API key configurations
- Reuse the same Claude Code setup across Terminal, VS Code, Cursor, Windsurf, and similar environments

## Installation

This fork is not currently published to npm. Install it directly from GitHub:

```bash
npm install -g git+ssh://git@github.com/Holden-Lin/claude-switch.git
```

If you only want to develop or test locally:

```bash
git clone git@github.com:Holden-Lin/claude-switch.git
cd claude-switch
bun install
bun run build
```

## Quick Start

```bash
# Save the currently logged-in account
claude-switch add personal

# Switch to another Claude account and save it
claude auth logout
claude auth login
claude-switch add work

# Switch later with one command
claude-switch use personal
claude-switch use work

# Open the interactive picker when no argument is provided
claude-switch
```

If you are already logged in, `claude-switch add <name>` will first offer to save the current session directly instead of forcing a new login flow.

## API Key Mode

If you do not use a subscription account, you can also save an API key profile:

```bash
claude-switch add my-api
```

Then choose `API Key` and paste your key.

When switching to an API key profile, the tool writes `ANTHROPIC_API_KEY` into `~/.claude/settings.json`. When switching back to an OAuth profile, it removes that field automatically.

## Commands

| Command | Description |
|---|---|
| `claude-switch` | Open the interactive profile picker |
| `claude-switch add <name>` | Add a profile with either OAuth or API key |
| `claude-switch use <name>` | Switch to the specified profile |
| `claude-switch <name>` | Shortcut for `use <name>` |
| `claude-switch list` | List all profiles |
| `claude-switch current` | Show the active profile |
| `claude-switch remove <name>` | Remove the specified profile |

## Example Output

```text
  Profiles

  ▸ personal  oauth    Max
    work      oauth    Pro
    testing   api-key  sk-ant-••••Bx4Q
```

## How It Works

Profiles are stored under `~/.claude-profiles/`. Each profile keeps either an OAuth credential set or an API key configuration.

OAuth profile switching:

- On macOS, read and write `Claude Code-credentials` through Keychain
- On other systems, read and write `~/.claude/.credentials.json`
- Also sync `oauthAccount` in `~/.claude.json`

API key profile switching:

- Read and write `env.ANTHROPIC_API_KEY` in `~/.claude/settings.json`

Before switching to the target profile, the current session is automatically backed up into its original profile so the latest login state is not lost.

## Compatibility

- macOS: verified against the current Claude Code Keychain JSON credential format
- Linux / Windows: still use file-based OAuth credential storage
- OAuth subscriptions: Pro, Max, Team, Enterprise
- API Key: any Anthropic API key

## Limitations And Notes

- This is an unofficial tool and depends on Claude Code's current local authentication storage behavior
- If Claude Code changes its Keychain or local config structure in the future, this tool may need further updates
- OAuth profiles store a local switchable copy under `~/.claude-profiles/`, so understand that security tradeoff before using it

## License

MIT

## Changelog

### 2026-04-02

- Fixed the incorrect login command used by `claude-switch add` on macOS
- Updated compatibility for the current Claude Code Keychain JSON credential format
- Kept backward-compatible reading support for legacy hex-encoded Keychain data
- Preserved extra authentication fields such as `mcpOAuth` when saving and switching profiles
