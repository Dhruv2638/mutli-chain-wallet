import { useState } from "react";
import { sendSol } from "../lib/solana";

function parseError(error) {
  const msg = error.message || "";
  if (
    msg.includes("no record of a prior credit") ||
    msg.includes("debit an account")
  ) {
    return {
      code: "ERR_INSUFFICIENT",
      msg: "ACCOUNT HAS NO FUNDS. VISIT faucet.solana.com TO FUND.",
      icon: "💸",
    };
  }
  if (
    msg.includes("insufficient funds") ||
    msg.includes("insufficient lamports")
  ) {
    return {
      code: "ERR_BALANCE",
      msg: "INSUFFICIENT BALANCE TO COVER AMOUNT + FEES.",
      icon: "💸",
    };
  }
  if (
    msg.includes("Invalid public key") ||
    msg.includes("non-base58") ||
    msg.includes("invalid")
  ) {
    return {
      code: "ERR_ADDRESS",
      msg: "INVALID RECIPIENT ADDRESS. VERIFY AND RETRY.",
      icon: "📋",
    };
  }
  if (msg.includes("blockhash") || msg.includes("block height exceeded")) {
    return {
      code: "ERR_TIMEOUT",
      msg: "TRANSACTION EXPIRED. NETWORK CONGESTION. RETRY.",
      icon: "⏱",
    };
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return {
      code: "ERR_NETWORK",
      msg: "NETWORK UNREACHABLE. CHECK CONNECTION.",
      icon: "🌐",
    };
  }
  if (msg.includes("coming soon")) {
    return {
      code: "ERR_UNSUPPORTED",
      msg: "ETH SENDING NOT YET IMPLEMENTED.",
      icon: "🔜",
    };
  }
  return {
    code: "ERR_UNKNOWN",
    msg: msg || "UNKNOWN ERROR. RETRY.",
    icon: "⚠",
  };
}

export default function SendModal({ wallet, chain, onClose, onSuccess }) {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txSignature, setTxSignature] = useState("");

  const isEth = chain === "ETH";
  const chainColor = isEth ? "var(--amber)" : "var(--green)";

  const handleSend = async () => {
    if (!toAddress)
      return setError({
        code: "ERR_INPUT",
        msg: "RECIPIENT ADDRESS REQUIRED.",
        icon: "📋",
      });
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0)
      return setError({
        code: "ERR_INPUT",
        msg: "INVALID AMOUNT. MUST BE GREATER THAN 0.",
        icon: "🔢",
      });

    setLoading(true);
    setError(null);

    try {
      let signature;
      if (chain === "SOL") {
        signature = await sendSol(
          wallet.keypair,
          toAddress,
          parseFloat(amount),
        );
      } else {
        throw new Error("ETH sending coming soon!");
      }
      setTxSignature(signature);
      onSuccess();
    } catch (e) {
      setError(parseError(e));
    } finally {
      setLoading(false);
    }
  };

  const explorerUrl =
    chain === "SOL"
      ? "https://explorer.solana.com/tx/" + txSignature + "?cluster=devnet"
      : "https://sepolia.etherscan.io/tx/" + txSignature;

  // Success screen
  if (txSignature) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid var(--green)",
            background: "var(--bg)",
            padding: "32px",
            width: "100%",
            maxWidth: "480px",
            boxShadow: "0 0 40px rgba(0,255,65,0.1)",
          }}
        >
          <div
            style={{
              fontFamily: "VT323, monospace",
              fontSize: "28px",
              color: "var(--green)",
              marginBottom: "8px",
              letterSpacing: "2px",
            }}
          >
            TX BROADCAST SUCCESS
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "var(--text-dim)",
              letterSpacing: "3px",
              marginBottom: "24px",
            }}
          >
            TRANSACTION CONFIRMED ON NETWORK
          </div>

          <div
            style={{
              marginBottom: "6px",
              fontSize: "10px",
              color: "var(--text-dim)",
              letterSpacing: "3px",
            }}
          >
            SIGNATURE
          </div>
          <div
            style={{
              padding: "10px",
              background: "var(--bg2)",
              border: "1px solid var(--grid)",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "10px",
              color: "var(--green)",
              wordBreak: "break-all",
              lineHeight: "1.5",
              marginBottom: "20px",
            }}
          >
            {txSignature}
          </div>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              padding: "12px",
              border: "1px solid var(--green)",
              color: "var(--green)",
              fontSize: "11px",
              letterSpacing: "4px",
              textDecoration: "none",
              textAlign: "center",
              marginBottom: "10px",
              fontFamily: "IBM Plex Mono, monospace",
              fontWeight: "700",
              transition: "background 0.1s",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "rgba(0,255,65,0.08)")
            }
            onMouseOut={(e) => (e.target.style.background = "none")}
          >
            [ VIEW ON EXPLORER ]
          </a>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px",
              background: "none",
              border: "1px solid var(--grid)",
              color: "var(--text-dim)",
              fontSize: "11px",
              letterSpacing: "4px",
              fontFamily: "IBM Plex Mono, monospace",
              transition: "all 0.1s",
            }}
            onMouseOver={(e) => {
              e.target.style.color = "var(--amber)";
              e.target.style.borderColor = "var(--amber)";
            }}
            onMouseOut={(e) => {
              e.target.style.color = "var(--text-dim)";
              e.target.style.borderColor = "var(--grid)";
            }}
          >
            [ CLOSE ]
          </button>
        </div>
      </div>
    );
  }

  // Send form
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          border: "1px solid " + chainColor,
          borderTop: "2px solid " + chainColor,
          background: "var(--bg)",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 0 40px " + chainColor + "15",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid var(--grid)",
            background: "var(--bg2)",
          }}
        >
          <span
            style={{
              fontFamily: "VT323, monospace",
              fontSize: "22px",
              color: chainColor,
              letterSpacing: "3px",
            }}
          >
            SEND {chain} // ACCT-{String(wallet.index).padStart(2, "0")}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid var(--grid)",
              color: "var(--text-dim)",
              padding: "2px 8px",
              fontSize: "12px",
              letterSpacing: "1px",
            }}
            onMouseOver={(e) => {
              e.target.style.color = "var(--red)";
              e.target.style.borderColor = "var(--red)";
            }}
            onMouseOut={(e) => {
              e.target.style.color = "var(--text-dim)";
              e.target.style.borderColor = "var(--grid)";
            }}
          >
            ESC
          </button>
        </div>

        <div style={{ padding: "20px 16px" }}>
          {/* From */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "var(--text-dim)",
                letterSpacing: "3px",
                marginBottom: "6px",
              }}
            >
              FROM
            </div>
            <div
              style={{
                padding: "8px 10px",
                background: "var(--bg2)",
                border: "1px solid var(--grid)",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "11px",
                color: "var(--text-dim)",
                letterSpacing: "1px",
              }}
            >
              {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
            </div>
          </div>

          {/* To */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "var(--text-dim)",
                letterSpacing: "3px",
                marginBottom: "6px",
              }}
            >
              TO ADDRESS
            </div>
            <div style={{ display: "flex" }}>
              <span
                style={{
                  padding: "8px 10px",
                  background: chainColor,
                  color: "var(--bg)",
                  fontFamily: "VT323, monospace",
                  fontSize: "16px",
                  fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                TO
              </span>
              <input
                value={toAddress}
                onChange={function (e) {
                  setToAddress(e.target.value);
                }}
                placeholder="PASTE RECIPIENT ADDRESS..."
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  borderLeft: "none",
                }}
              />
            </div>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "var(--text-dim)",
                letterSpacing: "3px",
                marginBottom: "6px",
              }}
            >
              AMOUNT
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
              <input
                type="number"
                value={amount}
                onChange={function (e) {
                  setAmount(e.target.value);
                }}
                placeholder="0.0000"
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  fontSize: "28px",
                  fontFamily: "VT323, monospace",
                  letterSpacing: "2px",
                  borderRight: "none",
                }}
              />
              <span
                style={{
                  padding: "8px 14px",
                  background: chainColor,
                  color: "var(--bg)",
                  fontFamily: "VT323, monospace",
                  fontSize: "22px",
                  fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                {chain}
              </span>
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "var(--text-dim)",
                letterSpacing: "2px",
                marginTop: "4px",
              }}
            >
              AVAILABLE: {parseFloat(wallet.balance || 0).toFixed(4)} {chain}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "10px 12px",
                border: "1px solid var(--red)",
                background: "rgba(255,49,49,0.05)",
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "VT323, monospace",
                    fontSize: "16px",
                    color: "var(--red)",
                    marginBottom: "2px",
                    letterSpacing: "1px",
                  }}
                >
                  {error.code}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(255,49,49,0.7)",
                    letterSpacing: "1px",
                    lineHeight: "1.5",
                  }}
                >
                  {error.msg}
                </div>
              </div>
              <button
                onClick={function () {
                  setError(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--red)",
                  fontSize: "14px",
                  flexShrink: 0,
                  padding: "0",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "var(--bg2)" : chainColor,
              border: "none",
              color: loading ? "var(--text-dim)" : "var(--bg)",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "6px",
              fontFamily: "IBM Plex Mono, monospace",
              cursor: loading ? "not-allowed" : "crosshair",
              transition: "all 0.1s",
            }}
          >
            {loading ? "[ BROADCASTING... ]" : "[ EXECUTE TRANSACTION ]"}
          </button>
        </div>
      </div>
    </div>
  );
}
