// 读 agent-kit 的 config 合并逻辑：defaultPrice 到底谁说了算
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    try {
      if (statSync(p).isDirectory()) walk(p, out);
      else if (p.endsWith(".mjs") || p.endsWith(".js")) out.push(p);
    } catch {}
  }
  return out;
}

for (const f of walk("node_modules/@lucid-dreams/agent-kit/dist")) {
  const m = readFileSync(f, "utf8");
  const i = m.search(/function paymentsFromEnv/);
  if (i >= 0) {
    console.log("=== " + f + " (paymentsFromEnv) ===");
    console.log(m.slice(i, i + 1200));
    console.log();
  }
  const j = m.search(/DEFAULT_PRICE|defaultPrice/);
  if (j >= 0) {
    const seg = m.slice(Math.max(0, j - 500), j + 700);
    if (/DEFAULT_PRICE/.test(seg)) {
      console.log("--- price 相关片段 ---");
      console.log(seg);
      console.log();
    }
  }
}
