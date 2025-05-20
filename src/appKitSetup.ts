// appKitSetup.ts
import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import {  mainnet, sepolia} from "@reown/appkit/networks";

const projectId = "7d11240d80ebe12cc7e8a5a30cb93c6a";

// Create a single AppKit instance
export const appKitInstance = createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: {
    name: "Uniswap",
    description: "Swap tokens with lower fees",
    //url: "https://ethereum-explorer.archi",
    url: "https://monero-front.vercel.app/",
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
