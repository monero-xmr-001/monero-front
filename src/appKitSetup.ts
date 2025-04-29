// appKitSetup.ts
import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import {  mainnet, sepolia} from "@reown/appkit/networks";

const projectId = "6e327d0f4ae98387d32efc2f8a65b0a3";

// Create a single AppKit instance
export const appKitInstance = createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: {
    name: "Uniswap",
    description: "Swap tokens with lower fees",
    url: "https://ethereum-explorer.archi",
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
