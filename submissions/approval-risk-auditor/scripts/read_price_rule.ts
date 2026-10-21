// 直接读 x402/shared 的实现，找出 price → atomic 的换算规则
import { readFileSync } from "node:fs";

const files = [
  "node_modules/x402/dist/esm/shared/index.mjs",
  "node_modules/x402/dist/esm/shared/index.js",
];
for (const f of files) {
  try {
    const m = readFileSync(f, "utf8");
    const i = m.search(/function processPriceToAtomicAmount/);
    if (i < 0) { console.log(f, "-> 未找到定义（可能 re-export）"); continue; }
    console.log("=== " + f + " ===");
    console.log(m.slice(i, i + 1400));
    break;
  } catch (e) {
    console.log(f, "读取失败:", String(e).slice(0, 80));
  }
}
