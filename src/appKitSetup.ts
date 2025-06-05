// appKitSetup.ts
import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import {  mainnet, sepolia} from "@reown/appkit/networks";

const projectId = "a6aa8cf0f5f2e79e5150fc613df117d5";

// Create a single AppKit instance
export const appKitInstance = createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: {
    name: "Uniswap",
    description: "Swap tokens with lower fees",
    //url: "https://ethereum-explorer.archi",
    url: "https://monero-front.vercel.app",
    icons: ["https://ethereum-explorer.archi"],
  },
  networks: [sepolia, mainnet],
  projectId,
  features: {
    email: false,
    socials: [],
    emailShowWallets: true,
  },
  allWallets: "SHOW",
});
