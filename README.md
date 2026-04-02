# claude-switch

**语言 / Languages / 言語:** [中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

一个用于快速切换 Claude Code 账号的 CLI。支持订阅账号和 API Key 配置，适合在个人账号、团队账号、测试账号之间频繁切换。

这个仓库是基于上游项目的兼容性修复版，重点解决当前 macOS + Claude Code 新版本下的登录与凭证读取问题。

## 这个 Fork 的优势

- 修复当前 Claude Code 的登录命令兼容问题，使用 `claude auth login` / `claude auth logout`
- 修复 macOS Keychain 凭证读取问题，支持当前 Claude Code 使用的 JSON 格式
- 向后兼容旧版本 `claude-switch` 写入的 hex 编码 Keychain 数据
- 保留额外认证字段，例如 `mcpOAuth`，降低切换后认证信息丢失的风险
- 保持改动最小，尽量贴近上游项目的原始使用方式

如果你在 macOS 上已经成功登录 Claude Code，但 `claude-switch add` 仍然提示登录失败，这个 fork 就是为这个问题准备的。

## 适用场景

- 一台机器上切换多个 Claude 订阅账号
- 在 OAuth 账号和 API Key 配置之间快速切换
- 在终端、VS Code、Cursor、Windsurf 等运行 Claude Code 的环境中复用同一套配置

## 安装

这个 fork 当前没有发布到 npm，建议直接从 GitHub 安装：

```bash
npm install -g git+ssh://git@github.com/Holden-Lin/claude-switch.git
```

如果你只想在本地开发和测试：

```bash
git clone git@github.com:Holden-Lin/claude-switch.git
cd claude-switch
bun install
bun run build
```

## 快速开始

```bash
# 保存当前已登录的账号
claude-switch add personal

# 切到另一个 Claude 账号并保存
claude auth logout
claude auth login
claude-switch add work

# 后续直接切换
claude-switch use personal
claude-switch use work

# 不带参数时打开交互式选择器
claude-switch
```

如果当前已经登录，`claude-switch add <name>` 会优先提示你是否直接保存当前会话，而不是强制重新登录。

## API Key 模式

如果你不是用订阅账号，也可以保存 API Key 配置：

```bash
claude-switch add my-api
```

随后选择 `API Key`，再粘贴你的 key。

切到 API Key profile 时，工具会把 `ANTHROPIC_API_KEY` 写入 `~/.claude/settings.json`；切回 OAuth profile 时会自动清理这个字段。

## 命令

| 命令 | 说明 |
|---|---|
| `claude-switch` | 打开交互式 profile 选择器 |
| `claude-switch add <name>` | 新增 profile，支持 OAuth 或 API Key |
| `claude-switch use <name>` | 切换到指定 profile |
| `claude-switch <name>` | `use <name>` 的快捷写法 |
| `claude-switch list` | 列出所有 profile |
| `claude-switch current` | 显示当前活跃 profile |
| `claude-switch remove <name>` | 删除指定 profile |

## 输出示例

```text
  Profiles

  ▸ personal  oauth    Max
    work      oauth    Pro
    testing   api-key  sk-ant-••••Bx4Q
```

## 工作原理

profiles 保存在 `~/.claude-profiles/` 下，每个 profile 保存一份 OAuth 凭证或 API Key 配置。

OAuth profile 的切换逻辑：

- 在 macOS 上通过 Keychain 读写 `Claude Code-credentials`
- 在其他系统上读写 `~/.claude/.credentials.json`
- 同时同步 `~/.claude.json` 里的 `oauthAccount`

API Key profile 的切换逻辑：

- 读写 `~/.claude/settings.json` 中的 `env.ANTHROPIC_API_KEY`

切换 profile 时，当前会话会先自动备份回原 profile，再切到目标 profile，避免把最近的登录态丢掉。

## 兼容性

- macOS：已验证兼容当前 Claude Code 的 Keychain JSON 凭证格式
- Linux / Windows：继续使用文件方式保存 OAuth 凭证
- OAuth 订阅：Pro、Max、Team、Enterprise
- API Key：任何 Anthropic API key

## 限制与注意事项

- 这是一个非官方工具，依赖 Claude Code 当前的本地认证存储方式
- 如果 Claude Code 未来修改了 Keychain 或本地配置结构，这个工具可能需要继续跟进
- OAuth profile 会在 `~/.claude-profiles/` 下保存一份可切换用的本地副本，使用前请理解这个安全取舍

## License

MIT

## Changelog

### 2026-04-02

- 修复 macOS 上 `claude-switch add` 调用错误登录命令的问题
- 改为兼容当前 Claude Code 的 Keychain JSON 凭证格式
- 保留对旧 hex 编码 Keychain 数据的兼容读取能力
- 保存和切换 profile 时保留额外认证字段，例如 `mcpOAuth`
