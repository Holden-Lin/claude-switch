# 需求变更记录

## 2026-04-02

- 原始需求：
  "我刚刚想用这个项目：https://github.com/hoangvu12/claude-switch 在本机（mac）切换账号，https://lh3.googleusercontent.com/gg/AMW1TPqX1vl_bP7NTCzlBAXRiOY_nyWQUE_UbgIKuG11AAiXbRDp-bjFNBmybnQmGhHGq1Nk2_tDkEA4l2mrr9v3dlLxdj8z85Poit1iqMDCJjnjQGizYg0o8SzljBZ5MLeC4eVYSHRFLnw6yuuAF7YkrNydMzbegLm5Nq7XuWqzLSJRi8gTLUmchg70trMoaO50UvPIrbb5QZZC9VDz133fanClr6GuY4_U_H4kTHBA0_2z9SmQqWw0O_LVnGqOFVHmvgb2_CCGtzcYeYGlRfubFyQnyuQTl4pvAu8 但是遇到这个问题。我已经登陆成功然后再操作了，但还是不行。你看看是什么原因？是我操作的原因，还是需要fork它的代码来改一下"

- 执行确认：
  "你认为这个项目的实现方式如何？如果你觉得不错我们就fork来改，有什么要我做的你告诉我"
  "git@github.com:Holden-Lin/claude-switch.git"
  "改吧"

- 本次实现范围：
  修复 macOS 上当前 Claude Code 的登录命令兼容问题；
  修复 macOS Keychain 凭证 JSON/旧 hex 格式兼容问题；
  保持现有 CLI 结构不变，只做最小可用修复。
