/** 第二批候选 spender 的链上验证 */
const CANDIDATES = [
  ["CoW GPv2 Settlement", "0x9008D19f58AAbD9eD0D60971565AA8510560ab41"],
  ["Uniswap Universal Router v2", "0x66a9893cC07D91D95644AEDD05D03f95e1dBA8Af"],
  ["Uniswap Universal Router v1.02", "0xef1c6E67703c7BD7107eed8303Fbe6EC2554BF6B"],
  ["SushiSwap V2 Router", "0x5C7fA6e705c9F0d0E4a1F71b8A5F5C9A0F0e2B9c"],
  ["SushiSwap V2 Router (alt)", "0xd9e1cE17f2641f24aE8D1B8Ee7e3D3C7b5a4b9c0"],
  ["Balancer Vault", "0xBA12222222228d8Ba445958a75a0704d566BF2C8"],
  ["Curve Router NG", "0x16C6521Dff6baB339122a0FE25a911669DD535b8"],
  ["Lido stETH", "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"],
  ["Rubic Exchange", "0xC9854E4E52B9F0B4C0e0E3c1f5B0D6e8F1a2B3c4"],
  ["Maverick Router V2", "0x8D6cE1E1e4b2A0b0e4D5f7C1B0a0D2E3F4a5B6c7"],
  ["Jupiter Aggregator v6", "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"],
  ["1inch V4 / aggregation router", "0x1111111254EEB25477B68fb85Ed929B73A7d894F"],
  ["Kyber Elastic Router", "0x9AAb3f75489902f3a48495025729a0AF77d4b179"],
  ["BaseSwap Router", "0x327Df1E6de05895d2ab85B814E6D6B326C7C4D8F"],
  ["Stargate Router v2", "0x8731d54E9D02c28617dE8E1c37A3a7f2D9a2B4c5"],
  ["Across SpokePool", "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"],
  ["Synthetix ExchangeProxy", "0x3448bF50f7C8a3b3F9bF3a0e0a9E4e4F3f4A5b6c"],
  ["Lido WithdrawalQueue", "0x8893E2a4b3c1a1c1E1b1A1c1D1e1F1a1B1c1D1e1"],
];

const rpcUrls = ["https://ethereum-rpc.publicnode.com", "https://eth-mainnet.public.blastapi.io"];
async function rpc(url: string, method: string, params: unknown[]) {
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
  const j: any = await r.json();
  if (j?.error) throw new Error(j.error.message);
  return j.result;
}
for (const [name, addr] of CANDIDATES) {
  let code = "0x";
  for (const u of rpcUrls) {
    try { code = await rpc(u, "eth_getCode", [addr, "latest"]); if (code && code !== "0x") break; } catch {}
  }
  const ok = !!code && code !== "0x";
  if (ok) console.log(`✅ ${name.padEnd(30)} ${addr}`);
}
