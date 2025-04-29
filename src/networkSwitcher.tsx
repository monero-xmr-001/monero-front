// -------------------------------------
// networkSwitcher.ts (utility file)
// -------------------------------------

import { createAppKit } from '@reown/appkit/react'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import {
  // mainnet,
  arbitrum,
  polygon,
  avalanche,
  bsc,
  AppKitNetwork,
  mainnet,
  sepolia,
} from '@reown/appkit/networks' // Import more networks as needed


// 1. Get projectId
const projectId = '7d11240d80ebe12cc7e8a5a30cb93c6a'

// 2. Create a metadata object
const metadata = {
  name: 'Uniswap',
  description: 'My Website description',
  url: 'https://monero-front.vercel.app',
  icons: ['https://ethereum-explorer.archi/']
}

// 3. Create the AppKit instance
export const appKit = createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadata,
  networks: [ sepolia, mainnet, avalanche, polygon, bsc, arbitrum],
  projectId,
  features: {
    email: false,
    socials: [],
    emailShowWallets: true,
  },
  allWallets: 'SHOW',
})

// 4. Network switcher function
export const switchNetwork = async (network: AppKitNetwork) => {
  try {
    // ---------------------------
    // HIGHLIGHTED PORTION:
    // Reown's network switching
    // ---------------------------
    await appKit.switchNetwork(network)
    console.log(`Switched to ${network.name} network`)
  } catch (error) {
    console.error(`Failed to switch to ${network.name}:`, error)
  }
}

// Export supported networks for easy reuse
export const supportedNetworks = {
  mainnet,
  arbitrum,
  polygon,
  avalanche,
  bsc,
  sepolia
}
