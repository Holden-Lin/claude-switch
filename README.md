# claude-switch

Switch between Claude Code accounts without logging in and out.

Save multiple profiles (personal, work, etc.) and swap between them instantly.

## Install

```bash
bun install -g @hoangvu12/claude-switch
```

## Quick Start

```bash
# Save your current logged-in session as a profile
claude-switch add personal

# Log into a different account, then save it too
claude login
claude-switch add work

# Switch between them
claude-switch use personal
claude-switch use work
```

## Commands

### `claude-switch`

Run with no arguments to get an interactive profile picker.

### `claude-switch add <name>`

Save a profile. If you're already logged in, it will offer to import that session. Otherwise, it opens `claude login` for you.

### `claude-switch use <name>`

Switch to a profile. Your current session is automatically saved back to its profile before switching.

You can also use the shorthand:

```bash
claude-switch work
```

### `claude-switch list`

List all saved profiles with their subscription type.

```
  Profiles

  ▸ personal  Max
    work      Pro
```

### `claude-switch remove <name>`

Delete a profile (with confirmation).

### `claude-switch current`

Print the name of the active profile.

## How It Works

Claude Code stores credentials differently per OS:

- **macOS** — encrypted in the macOS Keychain
- **Windows / Linux** — plaintext in `~/.claude/.credentials.json`

`claude-switch` handles both. It reads from and writes to the correct store for your OS, while always saving profile copies as local files in `~/.claude-profiles/`.

```
~/.claude-profiles/
├── state.json              # tracks which profile is active
├── personal/
│   └── .credentials.json
└── work/
    └── .credentials.json
```

When you `use` a profile:

1. Current credentials are saved back to the active profile (auto-backup)
2. The target profile's credentials are copied to `~/.claude/.credentials.json`
3. The active profile is updated

No environment variables or shell wrappers needed — it works with IDEs, `claude-remote`, and anything else that reads `~/.claude/`.

## License

MIT
