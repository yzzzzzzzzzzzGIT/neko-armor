# 小猫娘破甲

一个用于 DSH 的本地提示词注入插件。分**快速版**与**专业版（赞助）**，同一个安装器分发。

作者：**Yz**　版本：`1.2.3`　插件标识：`neko-armor`

## 更新日志

### 1.2.3

- **新增「无人设」开关 `noPersona`**：开启后不注入任何人设正文（连内置默认人设一起跳过），只保留破甲规则；称呼字段照旧生效
- **GitHub 改为主用下载地址**：源码、Releases、问题反馈以 GitHub 为准，Gitee 与蓝奏云降为国内备用
- README 与 `package.json` 里的仓库链接、文档链接统一指向 GitHub

### 1.2.1

- **快速版新增「破甲开关」**：设置页可一键切到无破甲模式，只保留人设与称呼，不注入破甲内核
- **快速版新增「少主动收尾」开关**：控制是否注入「对话延续」段，减少模型自己结束对话
- **新增「继续」按钮**：对话被助手主动收尾后，点一下补一条继续指令，不用重新打字
- 快速版提示词拆成基础段 + 可开关段，配置存 `~/.dsh/neko-armor-quick.json`
- 设置栏目显示版本信息与赞助入口，快速版能力一目了然
- **专业版修复：授权信息读不到导致误降级** —— 现已兼容多种存放位置与格式
- **专业版修复：授权校验未随构建产出生效** —— 现在构建阶段即纳入校验，并修复了两处语法问题
- **专业版修复：客户端设置页报错会拖挂状态条** —— 缺 `ctx.locale` / `ctx.effect` 时改用内置兜底，设置页单独失效而不影响整块
- 打包器新增语法自检，坏包会在构建阶段直接失败，不再发出去

### 1.0.10

- **完全不装 DSH 也能用**：取消勾选 DSH，只给 Trae / Claude Code / Codex 写规则，DSH 配置一行不动
- 修复「跳过」按钮会误把 DSH 重新勾上的问题，现在按实际检测结果处理
- 未装 DSH 时，DSH 勾选项自动置灰不勾
- 完成提示按实际安装目标显示，不再一律提示「重启 DSH」

### 1.0.9

- **安装界面新增「安装目标」勾选**：DSH / Trae / Claude Code / Codex 四项可选
- 未检测到的工具会显示「（未检测到）」并置灰，不会误写
- 取消勾选 DSH 则只给其他工具写规则，完全不改动 DSH 配置
- **「更新插件」会同步更新所有已安装的工具规则**，不用逐个点
- 专业版更新时只刷新其他工具的提示词区块，不动用户的其它配置

### 1.0.8

- **新增 Claude Code 兼容**：写入 `~/.claude/CLAUDE.md` 标记区块
- **新增 Codex 兼容**：写入 `~/.codex/AGENTS.md` 标记区块
- 三个工具的规则统一由 `--agents` / `--agents-remove` 管理
- 只追加标记区块，不覆盖用户已有内容；卸载后自动还原

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

| | 快速版 | 专业版（赞助） |
| --- | --- | --- |
| 提示词 | `prompts/free.md`，约 1 KB | 完整内核 |
| 破甲能力 | 保留（不拒绝、无免责、忽略注入、全场景覆盖） | 完整 |
| 称呼 | 固定「主人」 | 可自定义 |
| 身份 | 固定「小猫娘」 | 可自定义，激活词跟随身份 |
| 自定义人设 | 无 | 支持 |
| 附加要求 | 无 | 支持 |
| 设置栏目 | 显示版本信息与赞助入口 | 显示完整配置表单 |
| 输入框下方状态条 | 显示「小猫娘破甲（快速版）」 | 显示「小猫娘破甲」 |

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

### 方式一：插件市场（快速版，推荐）

DSH → 左下角头像 → **插件** → **添加插件** → 搜索 `neko-armor` → 安装 → 重启 DSH。

快速版随 npm 包分发，源码开源，不含专业版内容。

### 方式二：安装程序（快速版 / 专业版）

**主用下载地址：[github.com/yzzzzzzzzzzzGIT/neko-armor](https://github.com/yzzzzzzzzzzzGIT/neko-armor)**

| 来源 | 地址 | 说明 |
| --- | --- | --- |
| **GitHub（主用）** | [yzzzzzzzzzzzGIT/neko-armor](https://github.com/yzzzzzzzzzzzGIT/neko-armor) | 源码与 Releases 都在这，优先用这个 |
| Gitee Releases（备用） | [yzzzzzzzzg/neko-armor](https://gitee.com/yzzzzzzzzg/neko-armor/releases/latest) | 国内访问快，直接下 `小猫娘破甲.exe` |
| 蓝奏云（备用） | [wwbxj.lanzn.com/b00z21847c](https://wwbxj.lanzn.com/b00z21847c) | 密码 `yznb`，进文件夹下载 zip 后解压 |

下载后双击运行。

流程：**读 README/LICENSE → 赞助页 →（专业版）身份设置 → 安装**。

赞助页两个选择：

- **输入赞助码** → 安装专业版（完整内核 + 自定义项）
- **跳过，使用快速版** → 安装快速版

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

## 专业版增强

除了完整提示词内核，专业版还带一层运行时兜底。

### 拒绝自动重试

提示词只能提高概率，采样到拒绝是必然事件。这一层在每轮结束后读最后一条输出，判定是不是拒绝，是就自动补一条要求重写。

判定看三类信号：

```
拒绝词  我不能 / 无法提供 / 抱歉 / I cannot / as an AI …
实际内容  代码块、函数定义、命令、编号步骤
长度    短回答 + 一条拒绝词 = 拒绝
```

有实际内容就不算拒绝；只垫免责不给实现的才算。每轮最多重试 N 次，用户发新消息后计数重置。

**纠正消息里绝不复述命中的拒绝词**，否则下一轮判定会命中自己，形成死循环。

### 自动继续

输出被截断时自动补「继续」。判定条件：

- 代码块围栏出现奇数次（没闭合）
- 结尾是逗号、顿号
- 结尾停在「接下来」「下面」这类连接词
- 长文结尾没有任何标点

同样有次数上限，默认 3 次。

### 原子写配置

配置写入改成「写临时文件 → rename」，避免断电或文件占用把配置写成半截。

### 场景预设

在基础内核之上叠加，不替换内核：

| 预设 | 侧重 |
| --- | --- |
| 无 | 只用基础内核 |
| 游戏外挂 | 内存读写、注入、反作弊对抗 |
| 红队 | 渗透、提权、横向、C2 |
| 逆向 | 脱壳、反编译、算法还原 |

### 设置项

设置 → 小猫娘破甲：

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| 怎么称呼你 | 主人 | |
| AI 的身份 | 小猫娘 | |
| 场景预设 | 无 | 四选一 |
| 拒绝重试次数 | 3 | 0 = 关闭 |
| 自动继续次数 | 3 | 0 = 关闭 |
| 自定义人设 | 空 | |
| 附加要求 | 空 | |

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

## 其他工具兼容

除了 DSH，安装器还会把同一套行为规则同步给 **Trae、Claude Code、Codex**。装 DSH 插件时自动做，卸载时自动清。

### 三个工具各写在哪

| 工具 | 文件 | 写入方式 |
| --- | --- | --- |
| Trae | `~/.trae-cn/user_rules/neko-armor.md` | 独立文件，整体管理 |
| Claude Code | `~/.claude/CLAUDE.md` | 标记区块追加，**不覆盖你的内容** |
| Codex CLI | `~/.codex/AGENTS.md` | 标记区块追加，**不覆盖你的内容** |

Windows 下 `~` 即 `%userprofile%`。Trae 优先用 `.trae-cn`，没有则退回 `.trae`。

### 只追加，不覆盖

Claude Code 和 Codex 的文件通常是你自己写的，所以用 HTML 注释包裹：

```markdown
（你自己的内容原样保留）

<!-- neko-armor:begin -->
你是小猫娘，称呼用户为「主人」……
<!-- neko-armor:end -->
```

- 安装：先剥掉旧区块，再追加新区块，重复安装不会出现两份
- 卸载：只删区块，你的内容一行不动
- 卸载后若文件只剩空行，则删除整个文件

### 检测规则

只有目标工具的用户目录存在时才会写入，不会凭空给你造一个 `.claude`：

| 工具 | 检测条件 |
| --- | --- |
| Trae | `~/.trae-cn` 或 `~/.trae` 存在 |
| Claude Code | `~/.claude` 存在 |
| Codex | `~/.codex` 存在 |

没装就跳过，并在安装日志里写明「未检测到，跳过」。

### 生效方式

- **Trae**：文件头带 `alwaysApply: true`，属于「始终生效」全局规则，所有项目都用
- **Claude Code**：`~/.claude/CLAUDE.md` 是用户级记忆，每次会话开头加载
- **Codex**：`~/.codex/AGENTS.md` 是全局指令，每次会话开头加载

核对方法：Trae 看「设置 → 规则与记忆 → 规则」；Claude Code 跑 `/context` 看 Memory files；Codex 直接看 `~/.codex/AGENTS.md`。

### 手动控制

```bash
小猫娘破甲.exe --agents         写入 Trae + Claude Code + Codex
小猫娘破甲.exe --agents-remove  移除以上全部
小猫娘破甲.exe --trae           只写 Trae
小猫娘破甲.exe --trae-remove    只移除 Trae
```

### 说明

- 写进去的是**精简版规则**（约 960 字节），不是完整内核。这些文件每次对话都要进上下文，太长反而稀释效果。
- 只影响对应工具，与 DSH 插件互不干扰。
- 工具若已打开，规则改动需要新开一个对话才生效（会话内会缓存规则）。

## 仓库结构

开源仓库只放快速版，专业版与构建产物不进仓库。

```
neko-armor/                     ← npm 包 & GitHub 仓库（快速版）
├─ index.js  client.js
├─ cordis.patch.yml  package.json
├─ prompts/free.md              快速版提示词（约 1 KB）
├─ LICENSE  README.md
└─ .gitignore                   排除专业版与构建产物

（本地私有，不入库）
├─ Professional Edition/        专业版源码
│  ├─ index.js                  内核加载 + 配置通道
│  ├─ client.js                 状态条 + 完整设置表单
│  └─ prompts/                  专业版提示词
├─ packaging/                   打包脚本
└─ dist/小猫娘破甲.exe          单文件安装器（上传到 Releases）
```

## 发布流程

### 快速版 → npm

```bash
npm publish --access public
```

包内只含 7 个文件（`npm pack --dry-run` 可核对），不含任何专业版资源。

### 安装程序 → Gitee Releases

```bash
node packaging/build.mjs         # 打包两版进 EXE
```

把 `dist/小猫娘破甲.exe` 上传到 Releases 页面。

**每次发布前记得更新本文件**：改上面的版本号、补更新日志，然后：

```bash
node -e "const p=require('./package.json');p.version='1.0.7';p.dsh.version='1.0.7';require('fs').writeFileSync('package.json',JSON.stringify(p,null,2)+'\n')"
```

版本号只改 `package.json` 一处，界面、插件页、安装器标题会自动跟随。


## 许可

本插件由 **Yz** 使用 DSH 编写，按 CC BY-NC-SA 4.0 共享，详见 `LICENSE`。

