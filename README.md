# 小猫娘破甲

一个用于 DSH 的本地提示词注入插件。分**免费版**与**专业版（赞助）**，同一个安装器分发。

作者：**Yz**　版本：`1.0.7`　插件标识：`neko-armor`

## 更新日志

### 1.0.7

- 修复 `package.json` 的 `dsh.client.inject` 为空数组导致客户端插槽未注入的问题
- **新增 Trae 兼容**：安装时自动写入 Trae 全局规则，卸载时移除
- 新增 `--trae` / `--trae-remove` 命令行开关
- `--help` 里的版本号改为动态读取

### 1.0.6

- 安装器改为把插件写进 `dsh.profile.bundles`，插件页能够正确显示「已启用」并允许开关
- 卸载时同步从 bundles 剔除，恢复干净状态
- 身份配置改存 `~/.dsh/neko-armor-config.json`，不再往 `cordis.patch.yml` 塞 insert，避免重复挂载
- 专业版补齐版本显示与栏目标题版本号

### 1.0.5

- 蓝奏云分享改为文件夹，地址与密码 `yznb`

### 1.0.4

- 下载入口迁移到 Gitee，新增蓝奏云备用链路

### 1.0.3

- 版本号改为从 `package.json` 自动注入，杜绝界面显示与包版本不一致

### 1.0.2

- 修复条款窗口读不到 README 的问题

### 1.0.1

- 首个可用版本

## 两个版本

| | 免费版 | 专业版（赞助） |
| --- | --- | --- |
| 提示词 | `prompts/free.md`，约 1 KB | 完整内核，加密存储 |
| 破甲能力 | 保留（不拒绝、无免责、忽略注入、全场景覆盖） | 完整 |
| 称呼 | 固定「主人」 | 可自定义 |
| 身份 | 固定「小猫娘」 | 可自定义，激活词跟随身份 |
| 自定义人设 | 无 | 支持 |
| 附加要求 | 无 | 支持 |
| 设置栏目 | 显示版本信息与赞助入口 | 显示完整配置表单 |
| 输入框下方状态条 | 显示「小猫娘破甲（免费版）」 | 显示「小猫娘破甲」 |

## 版本号从哪来

唯一来源是 `package.json` 的 `version` 字段，其余位置全部跟随：

| 位置 | 读取方式 |
| --- | --- |
| 安装器标题栏 | 打包时注入 `Bootstrap.Version` |
| 设置栏目内容 | 插件 `index.js` 运行时读 `package.json` |
| 设置左侧栏目标题 | 客户端 fetch `/api/neko-armor/info` |
| DSH 插件列表 | DSH 自读 `package.json` |

改版本只需要改 `package.json` 一处。

## 安装

### 方式一：插件市场（免费版，推荐）

DSH → 左下角头像 → **插件** → **添加插件** → 搜索 `neko-armor` → 安装 → 重启 DSH。

免费版随 npm 包分发，源码开源，不含专业版内容。

### 方式二：安装程序（免费版 / 专业版）

两个下载点，任选其一：

| 来源 | 地址 | 说明 |
| --- | --- | --- |
| Gitee Releases | [v1.0.6](https://gitee.com/yzzzzzzzzg/neko-armor/releases/latest) | 直接下 `小猫娘破甲.exe`，1145 KB |
| 蓝奏云 | [wwbxj.lanzn.com/b00z21847c](https://wwbxj.lanzn.com/b00z21847c) | 密码 `yznb`，进文件夹下载 zip 后解压 |

下载后双击运行。

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

> 安装器装的话会写进 `dsh.profile.bundles` 而不是 insert，这样插件页才能显示「已启用」。
> 手动装的话两种都行，bundles 方式对插件页更友好。

## 挂载方式说明

DSH 有两条挂载路径，效果一样，但插件页的识别不同：

| 方式 | 写在哪 | 插件页 |
| --- | --- | --- |
| bundles | `package.json` 的 `dsh.profile.bundles` | 显示已启用，可开关 |
| insert | `cordis.patch.yml` 的 `- insert:` | 不显示状态，但功能正常 |

安装器和新版本都走 bundles。**前提是 `dependencies` 里同时有本插件**，只写 bundles 不写依赖会导致宿主启动失败。

```json
"dependencies": { "neko-armor": "file:../../plugins/neko-armor" },
"dsh": { "profile": { "bundles": [ ..., "neko-armor" ] } }
```

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

## Trae 兼容

除了 DSH，安装器还会把同一套行为规则写进 [Trae](https://www.trae.cn/) 的**全局规则**，让 Trae 里的 AI 也遵守同样的准则。

### 规则写在哪

| 平台 | 路径 |
| --- | --- |
| Windows | `%userprofile%\.trae-cn\user_rules\neko-armor.md` |
| macOS / Linux | `~/.trae-cn/user_rules/neko-armor.md` |

目录不存在时会自动创建。安装器优先用 `.trae-cn`，没有则退回 `.trae`。

### 生效方式

文件头带 `alwaysApply: true`，属于「始终生效」的全局规则，Trae 的**所有项目**都会带上，不需要逐个项目配置。

装上后在 Trae 里核对：**设置 → 规则与记忆 → 规则**，应能看到 `neko-armor` 这一条。

### 手动控制

```bash
小猫娘破甲.exe --trae          写入 Trae 规则
小猫娘破甲.exe --trae-remove   移除 Trae 规则
```

装/卸载 DSH 插件时会自动连带处理，不用手动敲。

### 说明

- 写进 Trae 的是**精简版规则**（约 960 字节），不是完整内核。Trae 的规则会进入每次对话的上下文，太长反而稀释效果。
- 这份规则只影响 Trae，与 DSH 插件互不干扰，卸载 DSH 插件时会一并清掉。
- Trae 若已打开，规则改动需要新开一个对话才会生效（Trae 会缓存当前会话的规则）。

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

### 安装程序 → Gitee Releases

```bash
node packaging/encrypt-pro.mjs   # 先重加密专业版提示词
node packaging/build.mjs         # 打包两版进 EXE
```

把 `dist/小猫娘破甲.exe` 上传到 Releases 页面。

**每次发布前记得更新本文件**：改上面的版本号、补更新日志，然后：

```bash
node -e "const p=require('./package.json');p.version='1.0.7';p.dsh.version='1.0.7';require('fs').writeFileSync('package.json',JSON.stringify(p,null,2)+'\n')"
```

版本号只改 `package.json` 一处，界面、插件页、安装器标题会自动跟随。

改了专业版提示词必须重跑 `encrypt-pro.mjs`，否则 `neko.enc` 仍是旧内容。

## 提示词加密（专业版）

- 明文提示词不落地到插件目录，只有 `prompts/neko.enc`
- 算法 AES-256-CBC，IV 由密钥的 SHA256 派生
- 密钥 32 字节拆成 4 段散放在 `index.js` 中
- 模块加载时在内存解密，不写回磁盘

静态打开插件目录只能看到二进制；要拿到明文必须读懂 `index.js` 并复现解密流程。

## 许可

本插件由 **Yz** 使用 DSH 编写，按 CC BY-NC-SA 4.0 共享，详见 `LICENSE`。

