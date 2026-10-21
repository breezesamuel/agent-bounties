// 读 createAgentApp 里 payments 的选择逻辑
import { readFileSync } from "node:fs";

const m = readFileSync("node_modules/@lucid-dreams/agent-kit/dist/index.js", "utf8");
const i = m.search(/function createAgentApp/);
console.log(m.slice(i, i + 2600));
console.log("\n\n===== config 合并 =====");
const j = m.search(/function getAgentKitConfig/);
if (j >= 0) console.log(m.slice(j, j + 1800));
const k = m.search(/DEFAULT_PRICE/);
if (k >= 0) {
  console.log("\n\n===== DEFAULT_PRICE env 处理 =====");
  console.log(m.slice(Math.max(0, k - 900), k + 500));
}
