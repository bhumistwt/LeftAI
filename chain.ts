// frontend/src/lib/chains.ts
import { Chain } from "wagmi";

export const baseSepolia: Chain = {
  id: 84531, // example Base Sepolia chain id (confirm)
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: { name: "BaseETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.base.org"] }
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://sepolia.basescan.org" }
  },
  contracts: {}
}
