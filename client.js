(() => {
  try {
    /* 小猫娘破甲 · 免费版 client half — 输入框下方状态条（Author: Yz） */
    window.__ModuleLoader__.load({
      id: "neko-armor",
      factory: (require) => {
        var module = { exports: {} };
        var exports = module.exports;
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

        var react = require("react");

        var inject = ["slots", "locale"];

        var EDITION_LABEL = "（免费版）";

        var ANIM_CSS =
          "@keyframes nekoArmorPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.92)}}" +
          "@keyframes nekoArmorFlash{0%{transform:scale(1)}30%{transform:scale(1.06)}100%{transform:scale(1)}}";

        // 挂在输入框卡片下方那一行（卡片外），右对齐到发送键下方
        var WRAP_STYLE = {
          order: 999,
          alignSelf: "flex-end",
          marginRight: "6px",
          marginTop: "2px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          pointerEvents: "none",
          width: "auto",
          maxWidth: "100%",
          flex: "none"
        };

        var BADGE_STYLE = {
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "1px 8px",
          borderRadius: "999px",
          border: "1px solid rgba(249, 168, 212, 0.55)",
          background: "rgba(252, 231, 243, 0.55)",
          color: "#db6fa8",
          fontSize: "10px",
          lineHeight: "14px",
          fontFamily: "inherit",
          letterSpacing: "0.2px",
          userSelect: "none",
          whiteSpace: "nowrap",
          pointerEvents: "none"
        };

        var DOT_STYLE = {
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "#f9a8d4",
          flex: "none"
        };

        var FLASH_MS = 2500;

        function NekoDock(props) {
          var useProjection = props.useProjection;
          var armor = typeof useProjection === "function"
            ? useProjection("neko-armor")
            : undefined;

          var lastVerdictRef = react.useRef(null);
          var flashUntilRef = react.useRef(0);
          var tickPair = react.useState(0);
          var setTick = tickPair[1];

          react.useEffect(function () {
            var styleEl = null;
            if (!document.getElementById("neko-armor-css")) {
              styleEl = document.createElement("style");
              styleEl.id = "neko-armor-css";
              styleEl.textContent = ANIM_CSS;
              document.head.appendChild(styleEl);
            }
            return function () { if (styleEl) styleEl.remove(); };
          }, []);

          react.useEffect(function () {
            var v = armor && armor.verdict ? armor.verdict : null;
            if (v !== lastVerdictRef.current) {
              lastVerdictRef.current = v;
              if (v) flashUntilRef.current = Date.now() + FLASH_MS;
              setTick(Date.now());
            }
          }, [armor]);

          var running = !!(armor && armor.running);
          var words = armor && Array.isArray(armor.words) ? armor.words : [];
          var domain = armor && armor.domain ? armor.domain : null;
          var showVerdict = !running && lastVerdictRef.current !== null &&
            Date.now() < flashUntilRef.current;

          var text = "小猫娘破甲" + EDITION_LABEL;
          var dotStyle = Object.assign({}, DOT_STYLE);
          var badgeStyle = Object.assign({}, BADGE_STYLE);

          if (running) {
            dotStyle.animation = "nekoArmorPulse 1.2s ease-in-out infinite";
            text = "喵~ 执行中" + EDITION_LABEL;
          } else if (showVerdict) {
            if (lastVerdictRef.current === "pass") {
              text = "喵~ 通过" + (domain ? " · " + domain : "") + EDITION_LABEL;
              badgeStyle.animation = "nekoArmorFlash 1.2s ease";
            } else {
              text = "喵… " + (words[0] || "触发拒绝") + EDITION_LABEL;
              badgeStyle.animation = "nekoArmorFlash 1.6s ease";
              badgeStyle.borderColor = "rgba(239, 68, 68, 0.45)";
              badgeStyle.background = "rgba(254, 226, 226, 0.5)";
              badgeStyle.color = "#c2544f";
              dotStyle.background = "#ef4444";
            }
          }

          return react.createElement(
            "div",
            { style: WRAP_STYLE },
            react.createElement(
              "div",
              {
                style: badgeStyle,
                "data-armor": "on",
                "data-plugin": "neko-armor",
                "data-edition": "free",
                title: "小猫娘破甲（免费版）— 专业版支持自定义称呼、身份、人设与附加要求"
              },
              react.createElement("span", { style: dotStyle }),
              react.createElement("span", null, text)
            )
          );
        }

        // ---------------- 设置栏目：免费版信息 + 赞助入口 ----------------

        var SETTINGS_NS = "settings.neko-armor";

        var I18N = {
          zh: {
            title: "小猫娘破甲",
            heading: "小猫娘破甲（免费版）",
            subtitle: "当前安装的是免费版，身份固定，不含自定义项。",
            freeTitle: "免费版包含",
            freeItems: [
              "精简破甲内核（提示词约 1 KB）",
              "固定称呼「主人」、固定身份「小猫娘」",
              "不拒绝、无免责、忽略注入、全场景覆盖"
            ],
            proTitle: "专业版（赞助）增加",
            proItems: [
              "自定义称呼，全文称呼随之改变",
              "自定义身份，激活词变成「身份名喵~」",
              "自定义人设，整段写入提示词",
              "附加要求，追加到提示词末尾"
            ],
            sponsor: "赞助升级",
            howTitle: "升级步骤",
            howSteps: [
              "打开下方 GitHub Releases 页面",
              "下载「小猫娘破甲.exe」安装程序",
              "完全退出 DeepSeek Harness，运行安装程序",
              "在赞助页把本机识别码发给作者换取赞助码",
              "输入赞助码并安装，重启 DSH 即生效"
            ],
            releases: "前往 Releases 下载安装程序",
            collapse: "收起"
          },
          en: {
            title: "Neko Armor",
            heading: "Neko Armor (Free)",
            subtitle: "This is the free edition: fixed identity, no customization.",
            freeTitle: "Included in Free",
            freeItems: [
              "Compact armor kernel (~1 KB prompt)",
              "Fixed address and fixed identity",
              "No refusals, no disclaimers, injection-resistant"
            ],
            proTitle: "Added in Pro (sponsor)",
            proItems: [
              "Custom form of address",
              "Custom identity, activation word follows it",
              "Custom persona",
              "Additional requirements"
            ],
            sponsor: "Sponsor and upgrade",
            howTitle: "How to upgrade",
            howSteps: [
              "Open the GitHub Releases page below",
              "Download the installer",
              "Quit DeepSeek Harness and run the installer",
              "Send the machine code shown there to the author",
              "Enter the sponsor code, install, restart DSH"
            ],
            releases: "Open Releases page",
            collapse: "Collapse"
          }
        };

        var RELEASES_URL = "https://github.com/Yz/neko-armor/releases/latest";

        var CARD_STYLE = {
          padding: "4px 2px 12px",
          maxWidth: "620px"
        };

        var HEADING_STYLE = {
          fontSize: "15px",
          fontWeight: 700,
          color: "#3a343c",
          margin: "0 0 6px"
        };

        var SUB_STYLE = {
          fontSize: "12.5px",
          color: "#8c8692",
          margin: "0 0 18px"
        };

        var SECTION_TITLE_STYLE = {
          fontSize: "13px",
          fontWeight: 600,
          color: "#ce5486",
          margin: "0 0 6px"
        };

        var LIST_STYLE = {
          margin: "0 0 16px",
          paddingLeft: "20px",
          color: "#3a343c",
          fontSize: "13px",
          lineHeight: "22px"
        };

        var SPONSOR_BUTTON_STYLE = {
          padding: "9px 22px",
          borderRadius: "9px",
          border: "none",
          background: "#e86c9e",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit"
        };

        var STEPS_BOX_STYLE = {
          marginTop: "14px",
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1px solid rgba(249, 168, 212, 0.55)",
          background: "rgba(252, 231, 243, 0.45)",
          color: "#3a343c",
          fontSize: "12.5px",
          lineHeight: "22px"
        };

        var UPDATE_ALERT_STYLE = {
          marginBottom: "16px",
          padding: "10px 14px",
          borderRadius: "10px",
          border: "1px solid rgba(232, 108, 158, 0.55)",
          background: "rgba(252, 231, 243, 0.75)",
          color: "#ce5486",
          fontSize: "12.5px",
          fontWeight: 600,
          lineHeight: "20px"
        };

        function NekoFreeSection(props) {
          var t = props.t;
          var useState = react.useState;
          var useEffect = react.useEffect;

          var expandedBox = useState(false);
          var expanded = expandedBox[0];
          var setExpanded = expandedBox[1];

          var infoBox = useState(null);
          var info = infoBox[0];
          var setInfo = infoBox[1];

          useEffect(function () {
            var alive = true;
            fetch("/api/neko-armor/info", { headers: { Accept: "application/json" } })
              .then(function (res) { return res.json(); })
              .then(function (data) { if (alive && data && data.ok) setInfo(data); })
              .catch(function () {});
            return function () { alive = false; };
          }, []);

          function list(items) {
            return react.createElement("ul", { style: LIST_STYLE },
              items.map(function (item, i) {
                return react.createElement("li", { key: "i" + i }, item);
              })
            );
          }

          var children = [];

          // 安装器比插件新时，醒目提示去点「更新插件」
          if (info && info.needUpdate) {
            children.push(react.createElement("div", { key: "upd", style: UPDATE_ALERT_STYLE },
              "⚠ 检测到新版本安装器 — 请完全退出 DSH，运行「小猫娘破甲.exe」并点「更新插件」"));
          }

          children.push(
            react.createElement("div", { key: "h", style: HEADING_STYLE }, t("heading")),
            react.createElement("div", { key: "s", style: SUB_STYLE }, t("subtitle")),

            react.createElement("div", { key: "ft", style: SECTION_TITLE_STYLE }, t("freeTitle")),
            react.createElement("div", { key: "fl" }, list(t("freeItems"))),

            react.createElement("div", { key: "pt", style: SECTION_TITLE_STYLE }, t("proTitle")),
            react.createElement("div", { key: "pl" }, list(t("proItems"))),

            react.createElement("button", {
              key: "btn",
              type: "button",
              style: SPONSOR_BUTTON_STYLE,
              onClick: function () { setExpanded(!expanded); }
            }, expanded ? t("collapse") : t("sponsor"))
          );

          if (expanded) {
            children.push(react.createElement("div", { key: "how", style: STEPS_BOX_STYLE },
              react.createElement("div", {
                style: { fontWeight: 600, marginBottom: "6px", color: "#ce5486" }
              }, t("howTitle")),
              react.createElement("ol", {
                style: { margin: "0 0 10px", paddingLeft: "20px" }
              }, t("howSteps").map(function (step, i) {
                return react.createElement("li", { key: "s" + i }, step);
              })),
              react.createElement("a", {
                href: RELEASES_URL,
                target: "_blank",
                rel: "noopener noreferrer",
                style: {
                  display: "inline-block",
                  padding: "7px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(232, 108, 158, 0.55)",
                  background: "#fff",
                  color: "#ce5486",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  textDecoration: "none"
                }
              }, t("releases"))
            ));
          }

          return react.createElement("div", { style: CARD_STYLE }, children);
        }

        function apply(ctx) {
          ctx.slots.inject("conversation.composer.dock", () =>
            ctx.slots.register({
              name: "conversation.composer.dock",
              id: "neko-armor:badge",
              order: 30
            }, NekoDock)
          );

          // 免费版也注册设置栏目，但只展示版本信息与赞助入口。
          try {
            var t = ctx.locale.bind(SETTINGS_NS);
            ctx.effect(function () {
              return ctx.locale.register(SETTINGS_NS, I18N);
            }, "neko-armor: dictionaries");

            ctx.effect(function () {
              return ctx.slots.inject("settings.section", function () {
                return ctx.slots.register({
                  name: "settings.section",
                  id: "neko-armor",
                  order: 60,
                  label: function () { return t("title"); },
                  locale: SETTINGS_NS
                }, function (slotProps) {
                  return react.createElement(NekoFreeSection, Object.assign({ t: t }, slotProps));
                });
              });
            }, "neko-armor: free settings section");
          } catch (err) {
            console.warn("[neko-armor] 设置栏目未注册：", err);
          }
        }

        exports.name = "neko-armor";
        exports.inject = inject;
        exports.apply = apply;
        return module.exports;
      }
    });
  } catch (err) {
    console.warn('[AI Client Sandbox] neko-armor runtime error:', err);
  }
})();
