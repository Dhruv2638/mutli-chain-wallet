import { useState } from "react";
import RevealKeyModal from "./RevealModel";

export default function WalletCard({ wallet, chain, index, onSend }) {
  const [copied, setCopied] = useState(false);
  const [showRevealModal, setShowRevealModal] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEth = chain === "ETH";
  const chainColor = isEth ? "var(--amber)" : "var(--green)";
  const chainDim = isEth ? "var(--amber-dim)" : "var(--green-dim)";

  const explorerUrl = isEth
    ? "https://sepolia.etherscan.io/address/" + wallet.address
    : "https://explorer.solana.com/address/" +
      wallet.address +
      "?cluster=devnet";

  const short = wallet.address.slice(0, 8) + "..." + wallet.address.slice(-6);

  return (
    <>
      <div
        style={{
          border: "1px solid var(--grid)",
          borderTop: "2px solid " + chainColor,
          background: "var(--bg)",
          padding: "0",
          transition: "border-color 0.15s",
          animation: "fadeInUp 0.3s ease forwards",
          animationDelay: index * 0.05 + "s",
          opacity: 0,
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = chainColor)}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = "var(--grid)";
          e.currentTarget.style.borderTopColor = chainColor;
        }}
      >
        {/* Card header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 12px",
            borderBottom: "1px solid var(--grid)",
            background: "var(--bg2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "VT323, monospace",
                fontSize: "18px",
                color: chainColor,
                letterSpacing: "1px",
              }}
            >
              {isEth ? "ETH" : "SOL"}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "var(--text-dim)",
                letterSpacing: "2px",
                borderLeft: "1px solid var(--grid)",
                paddingLeft: "8px",
              }}
            >
              ACCT-{String(wallet.index).padStart(2, "0")}
            </span>
          </div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "2px 6px",
              fontSize: "9px",
              color: "var(--text-dim)",
              border: "1px solid var(--grid)",
              textDecoration: "none",
              letterSpacing: "1px",
              transition: "all 0.1s",
            }}
            onMouseOver={(e) => {
              e.target.style.color = chainColor;
              e.target.style.borderColor = chainColor;
            }}
            onMouseOut={(e) => {
              e.target.style.color = "var(--text-dim)";
              e.target.style.borderColor = "var(--grid)";
            }}
          >
            EXPLORER↗
          </a>
        </div>

        {/* Balance */}
        <div
          style={{
            padding: "16px 12px 12px",
            borderBottom: "1px solid var(--grid)",
          }}
        >
          {wallet.loading ? (
            <div
              style={{
                fontFamily: "VT323, monospace",
                fontSize: "32px",
                color: "var(--text-dim)",
                letterSpacing: "2px",
                animation: "blink 1s step-end infinite",
              }}
            >
              --------
            </div>
          ) : (
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "8px" }}
            >
              <span
                style={{
                  fontFamily: "VT323, monospace",
                  fontSize: "40px",
                  color: chainColor,
                  letterSpacing: "1px",
                  textShadow: "0 0 10px " + chainColor + "66",
                }}
              >
                {parseFloat(wallet.balance).toFixed(4)}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: chainDim,
                  letterSpacing: "3px",
                  fontWeight: "600",
                }}
              >
                {chain}
              </span>
            </div>
          )}
          <div
            style={{
              fontSize: "10px",
              color: "var(--text-dim)",
              letterSpacing: "2px",
              marginTop: "2px",
            }}
          >
            {isEth ? "SEPOLIA TESTNET" : "DEVNET"}
          </div>
        </div>

        {/* Address row */}
        <div
          style={{
            padding: "8px 12px",
            borderBottom: "1px solid var(--grid)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "11px",
              color: "var(--text-dim)",
              letterSpacing: "1px",
            }}
          >
            {short}
          </span>
          <button
            onClick={copyAddress}
            style={{
              background: "none",
              border: "1px solid var(--grid)",
              padding: "2px 8px",
              fontSize: "9px",
              color: copied ? "var(--green)" : "var(--text-dim)",
              letterSpacing: "2px",
              transition: "all 0.1s",
              borderColor: copied ? "var(--green)" : "var(--grid)",
            }}
          >
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>

        {/* Action buttons row */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--grid)" }}>
          {/* Secure private key button */}
          <button
            onClick={() => setShowRevealModal(true)}
            style={{
              flex: 1,
              padding: "8px 12px",
              background: "none",
              border: "none",
              borderRight: "1px solid var(--grid)",
              color: "var(--text-dim)",
              fontSize: "9px",
              letterSpacing: "2px",
              textAlign: "center",
              transition: "all 0.1s",
              cursor: "crosshair",
            }}
            onMouseOver={(e) => {
              e.target.style.color = "var(--red)";
              e.target.style.background = "rgba(255,49,49,0.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.color = "var(--text-dim)";
              e.target.style.background = "none";
            }}
          >
            🔑 PRIVATE KEY
          </button>

          {/* Send button */}
          <button
            onClick={() => onSend(wallet, chain)}
            style={{
              flex: 1,
              padding: "8px 12px",
              background: "none",
              border: "none",
              color: chainColor,
              fontSize: "9px",
              fontWeight: "700",
              letterSpacing: "2px",
              fontFamily: "IBM Plex Mono, monospace",
              transition: "background 0.1s",
              cursor: "crosshair",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = chainColor + "18")
            }
            onMouseOut={(e) => (e.currentTarget.style.background = "none")}
          >
            [ SEND {chain} ]
          </button>
        </div>
      </div>

      {/* Secure reveal modal */}
      {showRevealModal && (
        <RevealKeyModal
          wallet={wallet}
          chain={chain}
          onClose={() => setShowRevealModal(false)}
        />
      )}
    </>
  );
}
