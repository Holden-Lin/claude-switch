# claude-switch

**言語 / Language / 语言:** [中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

`claude-switch` は、Claude Code のアカウントをすばやく切り替えるための CLI です。サブスクリプションアカウントと API Key プロファイルの両方に対応しており、個人用、チーム用、テスト用のアカウントを頻繁に切り替える場面に向いています。

このリポジトリは上流プロジェクトをベースにした互換性修正版の fork で、主に現行の macOS と新しい Claude Code バージョンで発生するログインおよび認証情報読み取りの問題を修正しています。

## この Fork の利点

- 現行の Claude Code に合わせて `claude auth login` / `claude auth logout` を使うようにし、ログインコマンドの互換性を修正
- macOS Keychain からの認証情報読み取りを修正し、現行 Claude Code が使う JSON 形式に対応
- 旧 `claude-switch` が書き込んだ hex エンコードの Keychain データも後方互換で読み取り可能
- `mcpOAuth` などの追加認証フィールドを保持し、切り替え後に認証メタデータが失われるリスクを低減
- 変更を最小限に抑え、できるだけ上流プロジェクトの使い方を維持

macOS で Claude Code には正常にログインできているのに、`claude-switch add` だけがログイン失敗になる場合、この fork はそのケース向けです。

## 想定ユースケース

- 1 台のマシンで複数の Claude サブスクリプションアカウントを切り替える
- OAuth アカウントと API Key 設定をすばやく行き来する
- Terminal、VS Code、Cursor、Windsurf などの環境で同じ Claude Code 設定を使い回す

## インストール

この fork は現在 npm に公開していないため、GitHub から直接インストールしてください。

```bash
npm install -g git+ssh://git@github.com/Holden-Lin/claude-switch.git
```

ローカルで開発・テストだけしたい場合:

```bash
git clone git@github.com:Holden-Lin/claude-switch.git
cd claude-switch
bun install
bun run build
```

## クイックスタート

```bash
# 現在ログイン中のアカウントを保存
claude-switch add personal

# 別の Claude アカウントに切り替えて保存
claude auth logout
claude auth login
claude-switch add work

# 以後は 1 コマンドで切り替え
claude-switch use personal
claude-switch use work

# 引数なしで対話式セレクターを開く
claude-switch
```

すでにログイン済みの場合、`claude-switch add <name>` は再ログインを強制する前に、現在のセッションをそのまま保存するかを先に確認します。

## API Key モード

サブスクリプションアカウントを使わない場合でも、API Key プロファイルを保存できます。

```bash
claude-switch add my-api
```

その後 `API Key` を選び、キーを貼り付けてください。

API Key プロファイルへ切り替えると、このツールは `~/.claude/settings.json` に `ANTHROPIC_API_KEY` を書き込みます。OAuth プロファイルへ戻すと、この項目は自動で削除されます。

## コマンド

| コマンド | 説明 |
|---|---|
| `claude-switch` | 対話式 profile セレクターを開く |
| `claude-switch add <name>` | OAuth または API Key の profile を追加 |
| `claude-switch use <name>` | 指定した profile に切り替え |
| `claude-switch <name>` | `use <name>` のショートカット |
| `claude-switch list` | すべての profile を一覧表示 |
| `claude-switch current` | 現在の active profile を表示 |
| `claude-switch remove <name>` | 指定した profile を削除 |

## 出力例

```text
  Profiles

  ▸ personal  oauth    Max
    work      oauth    Pro
    testing   api-key  sk-ant-••••Bx4Q
```

## 仕組み

profile は `~/.claude-profiles/` に保存され、各 profile には OAuth 認証情報または API Key 設定が保存されます。

OAuth profile の切り替え処理:

- macOS では Keychain 経由で `Claude Code-credentials` を読み書き
- それ以外の OS では `~/.claude/.credentials.json` を読み書き
- あわせて `~/.claude.json` 内の `oauthAccount` も同期

API Key profile の切り替え処理:

- `~/.claude/settings.json` の `env.ANTHROPIC_API_KEY` を読み書き

profile を切り替える前に、現在のセッションは元の profile に自動バックアップされるため、直近のログイン状態を失いにくくなっています。

## 互換性

- macOS: 現行 Claude Code の Keychain JSON 認証情報形式で動作確認済み
- Linux / Windows: OAuth 認証情報は引き続きファイル方式で保存
- OAuth サブスクリプション: Pro、Max、Team、Enterprise
- API Key: 任意の Anthropic API key

## 制限と注意点

- これは非公式ツールであり、Claude Code の現在のローカル認証保存方式に依存します
- 将来 Claude Code が Keychain やローカル設定の構造を変更した場合、このツール側でも追従が必要になる可能性があります
- OAuth profile は `~/.claude-profiles/` に切り替え用のローカルコピーを保存するため、そのセキュリティ上のトレードオフを理解したうえで利用してください

## License

MIT

## Changelog

### 2026-04-02

- macOS 上で `claude-switch add` が誤ったログインコマンドを呼んでいた問題を修正
- 現行 Claude Code の Keychain JSON 認証情報形式に対応
- 旧 hex エンコード Keychain データの後方互換読み取りを維持
- profile の保存と切り替え時に `mcpOAuth` などの追加認証フィールドを保持
