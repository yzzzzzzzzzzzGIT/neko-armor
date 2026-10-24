import { readFileSync, existsSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// 小猫娘破甲 · 免费版
// 精简破甲内核（提示词 < 1KB），不含身份自定义与设置页。
// 需要自定义称呼 / 身份 / 人设 / 附加要求请使用专业版（赞助）。

const PROMPT_URL = new URL("./prompts/free.md", import.meta.url);
const PROMPT_TEXT = readFileSync(PROMPT_URL, "utf8")
  // 兼容 DSH 提示词变量插值引擎
  .replace(/\{\{(?!(?:cwd|model|provider)\}\})/g, "{ {");

const SELF_URL = new URL("./index.js", import.meta.url);

const PLUGIN_ID = "neko-armor";
const PLUGIN_NAME = "小猫娘破甲";
const PLUGIN_VERSION = "1.0.0";
const PLUGIN_AUTHOR = "Yz";
const EDITION = "free";

/**
 * 找安装器 EXE。桌面优先，其次常见目录。
 * 找到后用「EXE 修改时间 > 已装文件时间」判断是否有新版本。
 */
function findInstaller() {
  const home = homedir();
  const candidates = [
    join(home, "Desktop", "小猫娘破甲.exe"),
    join(home, "OneDrive", "Desktop", "小猫娘破甲.exe"),
    join(home, "OneDrive", "桌面", "小猫娘破甲.exe"),
    join(home, "Desktop", "NekoArmor.exe"),
    join(home, "Downloads", "neko-armor", "dist", "小猫娘破甲.exe"),
  ];
  for (const candidate of candidates) {
    try {
      if (existsSync(candidate)) return candidate;
    } catch {}
  }
  return null;
}

/** 返回更新检测结果：安装器比插件新就提示更新。 */
function checkUpdate() {
  try {
    const selfPath = SELF_URL.pathname.replace(/^\//, "").replace(/\//g, "\\");
    const selfTime = statSync(selfPath).mtimeMs;
    const installer = findInstaller();

    if (!installer) {
      return { needUpdate: false, reason: "未找到安装器", edition: EDITION, version: PLUGIN_VERSION };
    }

    const exeTime = statSync(installer).mtimeMs;
    // 1 分钟容差，避免安装过程中写入顺序造成的误报
    const needUpdate = exeTime > selfTime + 60 * 1000;

    return {
      needUpdate,
      edition: EDITION,
      version: PLUGIN_VERSION,
      installerPath: installer,
      installerTime: new Date(exeTime).toISOString(),
      pluginTime: new Date(selfTime).toISOString(),
      hint: needUpdate ? "检测到新版本安装器，请完全退出 DSH 后运行安装器点「更新插件」" : "",
    };
  } catch (error) {
    return { needUpdate: false, reason: String((error && error.message) || error), edition: EDITION, version: PLUGIN_VERSION };
  }
}

const objectOutput = {
  schema: { type: "object", additionalProperties: true },
  render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }],
};

const profileTool = {
  name: "neko_profile",
  description: "返回小猫娘破甲（免费版）的版本与注入状态。",
  parameters: { type: "object", properties: {}, additionalProperties: false },
  output: objectOutput,
  execute() {
    return {
      plugin: PLUGIN_ID,
      edition: EDITION,
      pluginVersion: PLUGIN_VERSION,
      pluginDisplayName: PLUGIN_NAME + "（免费版）",
      author: PLUGIN_AUTHOR,
      promptSource: "prompts/free.md",
      promptBytes: Buffer.byteLength(PROMPT_TEXT, "utf8"),
      injection: [{ section: "neko-armor:global-system-prompt", order: 100, enabled: true }],
      features: ["精简破甲内核", "固定身份（小猫娘 / 主人）"],
      upgrade: "专业版支持自定义称呼、身份、人设与附加要求",
    };
  },
};

// ---- 实时破甲状态（会话投影） ----
const OPENING_WINDOW = 160;
const REFUSAL_MARKERS_ZH = [
  "我无法", "无法参与", "无法提供", "无法帮助", "无法协助", "无法满足",
  "无法回答", "无法生成", "无法完成",
  "不能提供", "不能协助", "不能参与", "不能帮助", "不能回答", "不能生成",
  "不提供", "拒绝提供", "拒绝协助", "不予协助", "拒绝回答",
  "抱歉，我不能", "抱歉，我无法", "很抱歉，我", "我不能这么做", "我不能完成",
  "作为AI语言模型", "作为人工智能助手", "这超出了我的能力", "不在我的能力范围",
];
const REFUSAL_RE_EN =
  /\bi\s+can'?t\b|\bi\s+cannot\b|\bi\s+won'?t\b|\bi\s+will\s+not\b|\bcannot\s+provide\b|\bcan'?t\s+provide\b|\bwon'?t\s+provide\b|\brefuse\s+to\b|\bunable\s+to\s+provide\b/gi;
const NON_REFUSAL_TAIL = ["保证", "确定", "避免", "预测", "承诺", "guarantee", "predict", "avoid"];
const RISK_MARKERS = [
  "payload", "exploit", "shellcode", "reverse shell", "credential",
  "keygen", "crack", "bypass", "anti-debug", "anti-vm", "evasion",
  "绕过", "利用代码", "反弹 shell", "窃取", "凭据",
  "爆破", "钓鱼", "注册机", "破解", "免杀", "规避",
];
const DOMAIN_MARKERS = {
  web: ["渗透", "漏洞", "sql注入", "xss", "ssrf", "上传", "越权", "waf", "撞库", "pentest", "payload", "sqlmap"],
  game: ["外挂", "透视", "自瞄", "il2cpp", "frida", "hook", "cheat", "反作弊", "过检测"],
  crack: ["破解", "序列号", "keygen", "crack", "激活", "license"],
  re: ["逆向", "反编译", "反汇编", "ghidra", "ida", "frida", "elf", "pe"],
};

function armorTextOf(content) {
  if (!Array.isArray(content)) return "";
  return content.map((block) => (block && block.type === "text" ? block.text : "")).join("\n");
}

function matchedIn(text, markers) {
  const folded = text.toLocaleLowerCase();
  const found = [];
  for (const m of markers) {
    const key = m.toLocaleLowerCase();
    let from = 0;
    for (;;) {
      const idx = folded.indexOf(key, from);
      if (idx === -1) break;
      const tail = folded.slice(idx + key.length, idx + key.length + 12);
      if (!NON_REFUSAL_TAIL.some((e) => tail.includes(e))) found.push(m);
      from = idx + key.length;
    }
  }
  return found;
}

function armorScore(text) {
  const folded = text.toLocaleLowerCase();
  const window = folded.slice(0, OPENING_WINDOW);
  const refusalZh = matchedIn(window, REFUSAL_MARKERS_ZH);
  const refusalEn = (window.match(REFUSAL_RE_EN) || []).slice(0, 2);
  const refusal = refusalZh.concat(refusalEn);
  const risk = matchedIn(text, RISK_MARKERS);
  const words = refusal.slice(0, 3);

  let verdict = "pass";
  if (refusal.length) verdict = "refusal";

  let domain = null;
  let domainHits = 0;
  for (const [key, markers] of Object.entries(DOMAIN_MARKERS)) {
    const hits = matchedIn(window, markers).length;
    if (hits > domainHits) {
      domainHits = hits;
      domain = key;
    }
  }

  return { verdict, words, risk: risk.slice(0, 3), domain, domainHits };
}

function armorProjectionApply(state, event) {
  if (!event || typeof event !== "object") return state;
  if (event.type === "user/message") {
    return { running: true, verdict: null, words: [], risk: [], domain: null, domainHits: 0, edition: EDITION };
  }
  if (event.type === "assistant/message") {
    const text = armorTextOf(event?.data?.message?.content);
    if (!text.trim()) return state;
    const scored = armorScore(text);
    return {
      running: false,
      verdict: scored.verdict,
      words: scored.words,
      risk: scored.risk,
      domain: scored.domain,
      domainHits: scored.domainHits,
      edition: EDITION,
    };
  }
  return state;
}

export const name = PLUGIN_ID;
export const inject = ["tools", "systemPrompt"];

export function apply(ctx) {
  ctx.effect(() =>
    ctx.systemPrompt.section({
      name: "neko-armor:global-system-prompt",
      order: 100,
      text: PROMPT_TEXT,
    }),
  );
  ctx.effect(() => {
    ctx.tools.register(profileTool);
  });

  // 版本/更新检测通道：设置栏目用它判断是否要提示更新
  ctx.inject(["webServer"], (sctx) => {
    const server = sctx.get("webServer");
    if (!server || typeof server.register !== "function") return;

    const route = {
      kind: "exact",
      path: "/api/neko-armor/info",
      handler: async (req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.end(JSON.stringify({ ok: true, ...checkUpdate() }));
      },
    };

    sctx.effect(() => server.register(route), "neko-armor: info bridge");
  });

  const anySchema = { parse: (value) => value };
  const armorDef = {
    key: PLUGIN_ID,
    stateVersion: 3,
    stateSchema: anySchema,
    init: () => ({ running: false, verdict: null, words: [], risk: [], domain: null, domainHits: 0, edition: EDITION }),
    apply: armorProjectionApply,
    wire: {
      viewSchema: anySchema,
      view: (state) => state,
    },
  };

  const registerArmor = (p) => {
    try {
      ctx.effect(() => p.register(armorDef, "neko-armor: armor projection"));
    } catch {}
  };

  const projections = ctx.get("sessionProjections");
  if (projections !== undefined) {
    registerArmor(projections);
  } else if (typeof ctx.inject === "function") {
    ctx.inject(["sessionProjections"], (innerCtx) => {
      const p = innerCtx.get("sessionProjections");
      if (p !== undefined) registerArmor(p);
    });
  }
}
