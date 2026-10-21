/** 诊断 multicall3 批量 allowance 是否真的可用 */
import { createPublicClient, http, erc20Abi, encodeFunctionData, decodeFunctionResult } from "viem";
import { mainnet } from "viem/chains";

const MULTICALL3 = "0xcA11bde05977b3631167028862bE2a173976CA11";
const aggregate3Abi = [{
  name: "aggregate3", type: "function", stateMutability: "view",
  inputs: [{ name: "calls", type: "tuple[]", components: [
    { name: "target", type: "address" },
    { name: "allowFailure", type: "bool" },
    { name: "callData", type: "bytes" }] }],
  outputs: [{ name: "returnData", type: "tuple[]", components: [
    { name: "success", type: "bool" },
    { name: "returnData", type: "bytes" }] }],
}] as const;

const owner = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as `0x${string}`;
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`;
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F" as `0x${string}`;
const spenders = [
  "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
  "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
];

const calls = [USDC, DAI].flatMap((tok) =>
  spenders.map((sp) => ({
    target: tok,
    allowFailure: true,
    callData: encodeFunctionData({ abi: erc20Abi, functionName: "allowance", args: [owner, sp as `0x${string}`] }),
  }))
);

const data = encodeFunctionData({ abi: aggregate3Abi, functionName: "aggregate3", args: [calls as any] });
console.log("calldata len:", data.length, "selector:", data.slice(0, 10));

for (const url of ["https://ethereum-rpc.publicnode.com", "https://eth-mainnet.public.blastapi.io"]) {
  console.log("\n---", url);
  const r = await fetch(url, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to: MULTICALL3, data }, "latest"] }),
  });
  const j: any = await r.json();
  if (j.error) { console.log("  RPC error:", j.error); continue; }
  console.log("  result len:", (j.result || "").length);
  try {
    const dec: any = decodeFunctionResult({ abi: aggregate3Abi, functionName: "aggregate3", data: j.result });
    const rows = dec[0];
    console.log("  rows:", rows.length);
    rows.forEach((row: any, i: number) => {
      const v = row.returnData && row.returnData !== "0x" ? BigInt(row.returnData) : 0n;
      console.log(`   [${i}] success=${row.success} value=${v === 0n ? "0" : "MAX? " + v.toString().slice(0, 12)}`);
    });
  } catch (e) {
    console.log("  decode failed:", String(e).slice(0, 200));
  }
}
