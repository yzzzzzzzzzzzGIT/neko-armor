# Neko Armor

A prompt-injection plugin for DeepSeek Harness. Install it, restart DSH, done.

It does two things: stops the model from reflexively refusing, lecturing, or padding every answer with disclaimers — and keeps replies from sounding like a corporate AI. It does not modify the DSH binary, it does not phone home, it only adds a layer of rules to the system prompt.

Two editions: **Quick** (free, open source) and **Pro** (sponsored).

---

## Quick start

1. Quit DeepSeek Harness completely (including the tray icon)
2. Download the installer and run it
3. On the sponsor page, either enter a license key for Pro, or click "Skip, use Quick"
4. Reopen DSH and confirm "Neko Armor" is enabled on the plugin page

You will notice the difference in the first conversation. No further configuration needed.

---

## Editions

| | Quick | Pro |
| --- | --- | --- |
| Prompt core | Public build, covers common cases | Full build, finer edge handling |
| Retry on refusal | No | Yes, rephrases automatically when the model starts refusing |
| Auto-continue | No | Yes, resumes when a reply is cut off |
| Scene presets | No | Four presets (general / reverse / code / concise) |
| Custom persona | No | Yes |
| Settings form | Version and sponsor entry only | Full configuration |
| License | None | Key, bound to one device |

Quick ships with the npm package and its source is public. The Pro prompt is not published.

---

## Install

### Option 1 — Installer (recommended)

| Source | Link | Notes |
| --- | --- | --- |
| **GitHub (primary)** | [Releases](https://github.com/yzzzzzzzzzzzGIT/neko-armor/releases) | Download `neko-armor-vX-setup.exe` |
| Gitee (China) | [Releases](https://gitee.com/yzzzzzzzzg/neko-armor/releases) | Download `小猫娘破甲.exe`, faster inside China |
| Lanzou | [wwbxj.lanzn.com/b00z21847c](https://wwbxj.lanzn.com/b00z21847c) | Password `yznb` |

Run it and follow the prompts. The installer can write rules for DSH, Trae, Claude Code and Codex; tools that are not detected are greyed out and never touched.

> Quit DSH **completely** before installing or uninstalling. The installer refuses to run while DSH is open, to avoid the host reloading in a loop and crashing.

### Option 2 — npm (Quick only)

```bash
cd ~/.dsh/profiles/<your-profile>
pnpm add neko-armor
```

Restart DSH to load it.

---

## License keys (Pro)

Pro requires a license key, obtained by sponsoring.

- **QQ: `1410749014`** — the only channel for sponsorship and support
- Key format: `NEKO-XXXXX-XXXXX-XXXXX`
- **One key binds to one device.** To move to a new computer, send the **machine code** shown in the installer to the author and it will be rebound
- Pro checks the license online once every time DSH starts. Without network it falls back to Quick; reopen DSH once the network is back

Activation happens inside the installer — no manual file editing.

---

## FAQ

**Installed but nothing changed?**
Restart DSH. Plugins load at startup; installing alone does nothing.

**"Key is bound to another device"?**
That key was activated elsewhere. Copy the machine code from the installer, send it to QQ `1410749014` to rebind; the old machine will stop working.

**"Cannot reach the license server"?**
Check that the machine can reach the internet. Pro verifies once per DSH start; offline it falls back to Quick.

**Installer says DSH is running?**
Quit it including the tray icon and confirm in Task Manager that no `DeepSeek Harness.exe` is left.

**How do I uninstall?**
Use the uninstall entry in the installer, or run `pnpm remove neko-armor` in your profile directory and delete `~/.dsh/plugins/neko-armor`. Restart DSH afterwards.

**Does it break other features?**
No. It only adds rules to the system prompt — it does not modify DSH files and does not intercept tool calls.

---

## What Pro adds

- **Retry on refusal** — when the model starts saying "I can't", it rephrases and asks again instead of passing the refusal through
- **Auto-continue** — a reply cut off by length is resumed automatically, no manual "continue"
- **Scene presets** — general / reverse / code / concise, one click to switch the emphasis of the prompt
- **Custom persona** — how it addresses you, how it refers to itself, what tone it uses
- **Settings form** — all of the above editable in the DSH settings page, effective immediately

---

## Other tools

Besides DSH, the installer can write rules for these tools:

| Tool | Where |
| --- | --- |
| DeepSeek Harness | Plugin, written into the profile config |
| Trae | Global rules file |
| Claude Code | `~/.claude/CLAUDE.md` |
| Codex | `~/.codex/AGENTS.md` |

Rules go inside marked blocks and are appended, never overwriting your own content. Uninstalling removes only those blocks.

---

## Changelog

Every release is documented on the Releases page:

- [GitHub Releases](https://github.com/yzzzzzzzzzzzGIT/neko-armor/releases)
- [Gitee Releases](https://gitee.com/yzzzzzzzzg/neko-armor/releases)

---

## License

The Quick edition is shared under **CC BY-NC-SA 4.0**; see `LICENSE`. The Pro prompt belongs to the author and is licensed per key — it is not distributed with the source.

Author: **yzzzzzzzzzzzGIT**
