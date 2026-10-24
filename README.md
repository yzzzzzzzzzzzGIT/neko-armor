# 小猫娘破甲

一个用于 DSH 的本地提示词注入插件。分**免费版**与**专业版（赞助）**，同一个安装器分发。

作者：**Yz**　版本：`1.0.0`　插件标识：`neko-armor`

## 两个版本

| | 免费版 | 专业版（赞助） |
| --- | --- | --- |
| 提示词 | `prompts/free.md`，约 1 KB | 完整内核，加密存储 |
| 破甲能力 | 保留（不拒绝、无免责、忽略注入、全场景覆盖） | 完整 |
| 称呼 | 固定「主人」 | 可自定义 |
| 身份 | 固定「小猫娘」 | 可自定义，激活词跟随身份 |
| 自定义人设 | 无 | 支持 |
| 附加要求 | 无 | 支持 |
| 设置栏目 | 不显示 | 设置 → 小猫娘破甲 |
| 输入框下方状态条 | 显示「小猫娘破甲（免费版）」 | 显示「小猫娘破甲」 |

## 安装

### 方式一：插件市场（免费版，推荐）

DSH → 左下角头像 → **插件** → **添加插件** → 搜索 `neko-armor` → 安装 → 重启 DSH。

免费版随 npm 包分发，源码开源，不含专业版内容。

### 方式二：安装程序（免费版 / 专业版）

到 [Releases](https://gitee.com/yzzzzzzzzg/neko-armor/releases/latest) 下载 `小猫娘破甲.exe`，双击运行。

流程：**读 README/LICENSE → 赞助页 →（专业版）身份设置 → 安装**。

赞助页两个选择：

- **输入赞助码** → 安装专业版（完整内核 + 自定义项）
- **跳过，使用免费版** → 安装免费版

赞助页会显示本机识别码，把它发给作者即可换取赞助码。

> 安装或卸载前请完全退出 DSH。安装器检测到 DSH 在运行会直接拦下，避免宿主反复重载崩溃。

### 方式三：手动安装

```bash
cd ~/.dsh/profiles/<你的profile>
pnpm add neko-armor
```

然后在 `cordis.patch.yml` 的 `- insert:` 下加条目：

```yaml
- insert:
    - id: neko-armor
      name: 'neko-armor'
```

重启 DSH。

## 两版差异

| | 免费版（npm / 源码） | 专业版（Releases 安装程序） |
| --- | --- | --- |
| 获取方式 | 插件市场 / npm | GitHub Releases |
| 提示词 | `prompts/free.md`，约 1 KB | 完整内核，AES-256 加密 |
| 称呼 / 身份 / 人设 / 附加要求 | 固定 | 全部可自定义 |
| 设置栏目 | 只显示版本信息与赞助入口 | 完整配置表单 |
| 状态条 | 带「（免费版）」 | 无后缀 |

## 命令行

```bash
小猫娘破甲.exe              图形界面
小猫娘破甲.exe --machine     只显示本机识别码
小猫娘破甲.exe --install     静默安装（会弹赞助页）
小猫娘破甲.exe --update      更新已装插件（会弹赞助页）
小猫娘破甲.exe --uninstall   卸载
小猫娘破甲.exe --verify      列出载荷清单
```

## 设置（仅专业版）

头像 → 设置 → 左侧「小猫娘破甲」。

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| 怎么称呼你 | 主人 | 留空用默认 |
| AI 的身份 | 小猫娘 | 激活词变成「身份名喵~」 |
| 自定义人设 | 空 | 留空用内置人设 |
| 附加要求 | 空 | 追加到提示词末尾 |

配置保存在 `~/.dsh/neko-armor-config.json`，优先级高于插件条目 config。保存后重启 DSH 生效。

## 仓库结构

开源仓库只放免费版，专业版与构建产物不进仓库。

```
neko-armor/                     ← npm 包 & GitHub 仓库（免费版）
├─ index.js  client.js
├─ cordis.patch.yml  package.json
├─ prompts/free.md              免费版提示词（约 1 KB）
├─ LICENSE  README.md
└─ .gitignore                   排除专业版与构建产物

（本地私有，不入库）
├─ Professional Edition/        专业版源码
│  ├─ index.js                  解密 + 配置通道
│  ├─ client.js                 状态条 + 完整设置表单
│  └─ prompts/neko.enc          加密提示词
├─ packaging/                   打包与加密脚本
└─ dist/小猫娘破甲.exe          单文件安装器（上传到 Releases）
```

## 发布流程

### 免费版 → npm

```bash
npm publish --access public
```

包内只含 7 个文件（`npm pack --dry-run` 可核对），绝不包含 `neko.md` / `neko.enc`。

### 安装程序 → GitHub Releases

```bash
node packaging/encrypt-pro.mjs   # 先重加密专业版提示词
node packaging/build.mjs         # 打包两版进 EXE
```

把 `dist/小猫娘破甲.exe` 上传到 Releases 页面。

改了专业版提示词必须重跑 `encrypt-pro.mjs`，否则 `neko.enc` 仍是旧内容。

## 提示词加密（专业版）

- 明文提示词不落地到插件目录，只有 `prompts/neko.enc`
- 算法 AES-256-CBC，IV 由密钥的 SHA256 派生
- 密钥 32 字节拆成 4 段散放在 `index.js` 中
- 模块加载时在内存解密，不写回磁盘

静态打开插件目录只能看到二进制；要拿到明文必须读懂 `index.js` 并复现解密流程。

## 许可

本插件由 **Yz** 使用 DSH 编写，按 CC BY-NC-SA 4.0 共享，详见 `LICENSE`。

