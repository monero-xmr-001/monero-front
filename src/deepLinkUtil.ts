// // Define wallet-specific schemes
// const walletSchemes: Record<string, string> = {
//     trustwallet: "trust",
//     metamask: "metamask",
//     rainbow: "rainbow",
//     phantom: "phantom",
//     coinbase: "cbwallet",
//   };
  
//   // General fallback scheme
//   const defaultScheme = "wallet";
  
//   /**
//    * Generate a deep link URI for a wallet to handle a specific transaction.
//    * @param wallet - The name of the wallet (e.g., "trustwallet", "metamask").
//    * @param params - Parameters required for the deep link.
//    * @returns {string} - The generated deep link URI.
//    */
//   export const generateDeepLink = (
//     wallet: string,
//     params: Record<string, unknown>
//   ): string => {
//     // Get the wallet-specific scheme or fallback to the default scheme
//     const walletScheme = walletSchemes[wallet.toLowerCase()] || defaultScheme;
//     const baseUri = `${walletScheme}://wc?uri=`;
//     const encodedParams = encodeURIComponent(JSON.stringify(params));
//     return `${baseUri}${encodedParams}`;
//   };
  
//   /**
//    * Redirect the user to the deep link URI.
//    * @param deepLink - The deep link URI to redirect to.
//    */
//   export const redirectToDeepLink = (deepLink: string): void => {
//     console.log(`Redirecting to: ${deepLink}`);
//     window.location.href = deepLink; // Automatically open the wallet app
//   };
  




// Define wallet-specific schemes
const walletSchemes: Record<string, string> = {
  trustwallet: "trust",
  metamask: "metamask",
  rainbow: "rainbow",
  phantom: "phantom",
  coinbase: "cbwallet",
  safepal: "safepal",
  tokenpocket: "tp",
  mathwallet: "mathwallet",
  argent: "argent",
  zerion: "zerion"
};

// General fallback scheme
const defaultScheme = "wallet";

/**
 * Generate a deep link URI for a wallet to handle a specific transaction.
 * @param wallet - The name of the wallet (e.g., "trustwallet", "metamask").
 * @param params - Parameters required for the deep link.
 * @returns {string} - The generated deep link URI.
 */
export const generateDeepLink = (
  wallet: string,
  params: Record<string, unknown>
): string => {
  try {
    // Normalize the wallet name to lowercase
    const normalizedWallet = wallet.toLowerCase();

    // Get the wallet-specific scheme or fallback to the default scheme
    const walletScheme = walletSchemes[normalizedWallet] || defaultScheme;
    const baseUri = `${walletScheme}://wc?uri=`;

    // Encode parameters as URI-safe string
    const encodedParams = encodeURIComponent(JSON.stringify(params));

    // Log for debugging
    console.log(`Generated deep link for ${wallet}: ${baseUri}${encodedParams}`);

    return `${baseUri}${encodedParams}`;
  } catch (error) {
    console.error("Error generating deep link:", error);
    throw new Error("Failed to generate deep link.");
  }
};

/**
 * Redirect the user to the deep link URI.
 * @param deepLink - The deep link URI to redirect to.
 */
export const redirectToDeepLink = (deepLink: string): void => {
  try {
    console.log(`Redirecting to: ${deepLink}`);

    // Redirect to the wallet deep link
    window.location.href = deepLink;
  } catch (error) {
    console.error("Error redirecting to deep link:", error);
    throw new Error("Failed to redirect to deep link.");
  }
};

/**
 * Validate the wallet name and provide feedback if it's unsupported.
 * @param walletName - The name of the wallet to validate.
 */
export const validateWallet = (walletName: string): void => {
  const normalizedWallet = walletName.toLowerCase();

  if (!walletSchemes[normalizedWallet]) {
    console.warn(`Unrecognized wallet: ${walletName}. Using fallback scheme.`);
    console.log(
      `Supported wallets are: ${Object.keys(walletSchemes).join(", ")}`
    );
  }
};
