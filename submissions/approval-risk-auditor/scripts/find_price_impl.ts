// 在 x402 的整个 dist 里找 processPriceToAtomicAmount 的实现
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

const root = "node_modules/x402/dist";
for (const f of walk(root)) {
  const m = readFileSync(f, "utf8");
  const i = m.search(/function processPriceToAtomicAmount|const processPriceToAtomicAmount\s*=/);
  if (i >= 0) {
    console.log("=== " + f + " ===");
    console.log(m.slice(i, i + 1500));
    console.log();
    break;
  }
}
