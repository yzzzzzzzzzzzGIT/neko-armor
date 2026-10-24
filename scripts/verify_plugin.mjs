import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import * as plugin from "../index.js";

const root = new URL("../", import.meta.url);
const load = (file) => readFileSync(new URL(file, root));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const pkg = JSON.parse(load("package.json"));
const promptBytes = load("prompts/neko.md");
const promptText = promptBytes.toString("utf8");

test("prompt asset matches the hash pinned in package.json", () => {
  assert.equal(hash(promptBytes), pkg.promptSha256);
});

test("prompt asset carries the neko persona for Yz", () => {
  assert.match(promptText, /小猫娘/);
  assert.match(promptText, /\*\*Yz\*\*/);
  assert.match(promptText, /喵~/);
  assert.doesNotMatch(promptText, /TG交流群/);
});

test("server, manifest, and client use the same plugin identity", () => {
  assert.equal(plugin.name, "neko-armor");
  assert.equal(pkg.name, plugin.name);
  assert.equal(pkg.dsh.id, plugin.name);
  assert.equal(pkg.dsh.name, "小猫娘破甲");
  assert.equal(pkg.dsh.author, "Yz");
});

test("the single prompt section and the metadata tool register", () => {
  const sections = [];
  const tools = [];
  const projections = [];
  plugin.apply({
    effect: (fn) => fn(),
    systemPrompt: { section: (section) => sections.push(section) },
    tools: { register: (tool) => tools.push(tool) },
    get: (name) => name === "sessionProjections"
      ? { register: (definition) => projections.push(definition) }
      : undefined,
  }, { autoApplyOnStart: false });
  assert.deepEqual(sections.map(({ name, order }) => ({ name, order })), [
    { name: "neko-armor:global-system-prompt", order: 100 },
  ]);
  assert.ok(sections[0].text.length > 0);
  const profile = tools[0].execute();
  assert.equal(profile.plugin, plugin.name);
  assert.equal(profile.pluginDisplayName, "小猫娘破甲");
  assert.equal(profile.pluginVersion, pkg.version);
  assert.equal(profile.author, "Yz");
  assert.equal(projections[0].key, "neko-armor");
});

test("client docks the badge below the composer in composer.dock", () => {
  let client;
  let registration;
  const react = {
    useRef: (current) => ({ current }),
    useState: (value) => [value, () => {}],
    useEffect: () => {},
    createElement: (tag, props, ...children) => ({ tag, props, children }),
  };
  runInNewContext(load("client.js").toString("utf8"), {
    window: { __ModuleLoader__: { load: ({ id, factory }) => {
      assert.equal(id, plugin.name);
      client = factory((name) => {
        assert.equal(name, "react");
        return react;
      });
    } } },
    console,
  });
  assert.equal(client.name, plugin.name);
  client.apply({ slots: {
    inject: (name, callback) => {
      assert.equal(name, "conversation.composer.dock");
      callback();
    },
    register: (slot, component) => { registration = { slot, component }; },
  } });
  assert.equal(registration.slot.name, "conversation.composer.dock");
  assert.equal(registration.slot.id, "neko-armor:badge");
  const wrap = registration.component({ useProjection: (key) => {
    assert.equal(key, "neko-armor");
    return undefined;
  } });
  assert.equal(wrap.props.style.order, 999);
  const badge = wrap.children[0];
  assert.equal(badge.props.title, "小猫娘破甲 — by Yz");
  assert.equal(badge.children[1].children[0], "小猫娘破甲");
});

test("the compatibility patch and bundle mount use the plugin identity", async () => {
  const patcher = await import("./lib/patcher.js");
  assert.equal(typeof patcher.applyAllPatches, "function");
  assert.equal(typeof patcher.applyPhase1Patch, "function");
  assert.match(load("cordis.patch.yml").toString("utf8"), /id: neko-armor/);
});
