import { useState, useEffect } from "react";
import { getSeedFromPhrase } from "../lib/wallet";
import {
  getMultipleEthereumWallets,
  getEthereumBalance,
} from "../lib/ethereum";
import { getMultipleSolanaWallets, getSolanaBalance } from "../lib/solana";
import WalletCard from "./WalletCard";
import SendModal from "./SendModal";

export default function Dashboard({ mnemonic, onLock }) {
  const [ethWallets, setEthWallets] = useState([]);
  const [solWallets, setSolWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChain, setActiveChain] = useState("ALL");
  const [sendTarget, setSendTarget] = useState(null);
  const [time, setTime] = useState(new Date());
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    setLoading(true);
    try {
      const seed = await getSeedFromPhrase(mnemonic);
      const ethRaw = getMultipleEthereumWallets(mnemonic, 3);
      const solRaw = getMultipleSolanaWallets(seed, 3);

      setEthWallets(ethRaw.map((w) => ({ ...w, balance: "0", loading: true })));
      setSolWallets(solRaw.map((w) => ({ ...w, balance: "0", loading: true })));

      ethRaw.forEach(async (wallet, i) => {
        const balance = await getEthereumBalance(wallet.address);
        setEthWallets((prev) =>
          prev.map((w, idx) =>
            idx === i ? { ...w, balance, loading: false } : w,
          ),
        );
      });

      solRaw.forEach(async (wallet, i) => {
        const balance = await getSolanaBalance(wallet.address);
        setSolWallets((prev) =>
          prev.map((w, idx) =>
            idx === i ? { ...w, balance, loading: false } : w,
          ),
        );
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshCount((c) => c + 1);
    }
  };

  const handleSendSuccess = () => setTimeout(() => loadWallets(), 2000);

  const totalEth = ethWallets.reduce(
    (s, w) => s + parseFloat(w.balance || 0),
    0,
  );
  const totalSol = solWallets.reduce(
    (s, w) => s + parseFloat(w.balance || 0),
    0,
  );

  const timeStr = time.toTimeString().slice(0, 8);
  const dateStr = time.toDateString().toUpperCase();

  return (
    <div
      className="flicker"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: "1px solid var(--amber-dim)",
          background: "var(--bg)",
          display: "flex",
          alignItems: "stretch",
          height: "38px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            borderRight: "1px solid var(--grid)",
            gap: "10px",
          }}
        >
          <span
            className="glow vt"
            style={{
              fontSize: "22px",
              color: "var(--amber)",
              letterSpacing: "4px",
            }}
          >
            NEXUS
          </span>
          <span
            style={{
              fontSize: "9px",
              color: "var(--text-dim)",
              letterSpacing: "2px",
              borderLeft: "1px solid var(--grid)",
              paddingLeft: "10px",
            }}
          >
            WALLET TERMINAL
          </span>
        </div>

        {/* Live ticker area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: "24px",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "var(--text-dim)",
                letterSpacing: "2px",
              }}
            >
              ETH.BAL
            </span>
            <span
              style={{
                fontFamily: "VT323, monospace",
                fontSize: "18px",
                color: "var(--amber)",
                letterSpacing: "1px",
              }}
            >
              {totalEth.toFixed(4)}
            </span>
          </div>
          <div
            style={{ width: "1px", height: "20px", background: "var(--grid)" }}
          ></div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "var(--text-dim)",
                letterSpacing: "2px",
              }}
            >
              SOL.BAL
            </span>
            <span
              style={{
                fontFamily: "VT323, monospace",
                fontSize: "18px",
                color: "var(--green)",
                letterSpacing: "1px",
              }}
            >
              {totalSol.toFixed(4)}
            </span>
          </div>
          <div
            style={{ width: "1px", height: "20px", background: "var(--grid)" }}
          ></div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            <span className="dot-live"></span>
            <span
              style={{
                fontSize: "10px",
                color: "var(--text-dim)",
                letterSpacing: "2px",
              }}
            >
              REFRESH #{refreshCount}
            </span>
          </div>
        </div>

        {/* Right controls */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            borderLeft: "1px solid var(--grid)",
          }}
        >
          <div
            style={{
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              borderRight: "1px solid var(--grid)",
              fontSize: "11px",
              color: "var(--text-dim)",
              letterSpacing: "2px",
              gap: "12px",
            }}
          >
            <span>{dateStr}</span>
            <span
              className="glow"
              style={{
                color: "var(--amber)",
                fontFamily: "VT323, monospace",
                fontSize: "18px",
              }}
            >
              {timeStr}
            </span>
          </div>

          <button
            onClick={loadWallets}
            style={{
              padding: "0 16px",
              background: "none",
              border: "none",
              borderRight: "1px solid var(--grid)",
              color: "var(--text-dim)",
              fontSize: "10px",
              letterSpacing: "3px",
              transition: "all 0.1s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "var(--amber-faint)";
              e.target.style.color = "var(--amber)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "none";
              e.target.style.color = "var(--text-dim)";
            }}
          >
            REFRESH
          </button>

          <button
            onClick={onLock}
            style={{
              padding: "0 16px",
              background: "none",
              border: "none",
              color: "var(--text-dim)",
              fontSize: "10px",
              letterSpacing: "3px",
              transition: "all 0.1s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(255,49,49,0.1)";
              e.target.style.color = "var(--red)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "none";
              e.target.style.color = "var(--text-dim)";
            }}
          >
            LOCK
          </button>
        </div>
      </div>

      {/* Second nav bar — chain filter */}
      <div
        style={{
          borderBottom: "1px solid var(--grid)",
          background: "var(--bg2)",
          display: "flex",
          alignItems: "stretch",
          height: "32px",
        }}
      >
        <div
          style={{
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            fontSize: "9px",
            color: "var(--text-dim)",
            letterSpacing: "3px",
            borderRight: "1px solid var(--grid)",
          }}
        >
          FILTER
        </div>
        {["ALL", "ETH", "SOL"].map((c) => (
          <button
            key={c}
            onClick={() => setActiveChain(c)}
            style={{
              padding: "0 20px",
              background:
                activeChain === c
                  ? c === "SOL"
                    ? "var(--green)"
                    : "var(--amber)"
                  : "none",
              border: "none",
              borderRight: "1px solid var(--grid)",
              color: activeChain === c ? "var(--bg)" : "var(--text-dim)",
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "3px",
              fontFamily: "IBM Plex Mono, monospace",
              transition: "all 0.1s",
              cursor: "crosshair",
            }}
          >
            {c}
          </button>
        ))}
        <div style={{ flex: 1 }}></div>
        <div
          style={{
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            fontSize: "9px",
            color: "var(--text-dim)",
            letterSpacing: "2px",
            borderLeft: "1px solid var(--grid)",
          }}
        >
          6 ACCOUNTS LOADED
        </div>
      </div>

      {/* Main grid */}
      <div className="grid-bg" style={{ flex: 1, padding: "20px 16px" }}>
        {/* ETH Section */}
        {(activeChain === "ALL" || activeChain === "ETH") && (
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
                paddingBottom: "8px",
                borderBottom: "1px solid var(--amber-dim)",
              }}
            >
              <span
                style={{
                  fontFamily: "VT323, monospace",
                  fontSize: "22px",
                  color: "var(--amber)",
                  letterSpacing: "3px",
                }}
              >
                ETHEREUM
              </span>
              <span
                style={{
                  fontSize: "9px",
                  color: "var(--text-dim)",
                  letterSpacing: "3px",
                }}
              >
                SEPOLIA TESTNET // 3 ACCOUNTS
              </span>
              <div
                style={{ flex: 1, borderTop: "1px dashed var(--grid)" }}
              ></div>
              <span
                style={{
                  fontFamily: "VT323, monospace",
                  fontSize: "18px",
                  color: "var(--amber-dim)",
                }}
              >
                Σ {totalEth.toFixed(4)} ETH
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1px",
                background: "var(--grid)",
              }}
            >
              {ethWallets.map((wallet, i) => (
                <WalletCard
                  key={wallet.index}
                  wallet={wallet}
                  chain="ETH"
                  index={i}
                  onSend={(w, c) => setSendTarget({ wallet: w, chain: c })}
                />
              ))}
            </div>
          </div>
        )}

        {/* SOL Section */}
        {(activeChain === "ALL" || activeChain === "SOL") && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
                paddingBottom: "8px",
                borderBottom: "1px solid var(--green-dim)",
              }}
            >
              <span
                style={{
                  fontFamily: "VT323, monospace",
                  fontSize: "22px",
                  color: "var(--green)",
                  letterSpacing: "3px",
                }}
              >
                SOLANA
              </span>
              <span
                style={{
                  fontSize: "9px",
                  color: "var(--text-dim)",
                  letterSpacing: "3px",
                }}
              >
                DEVNET // 3 ACCOUNTS
              </span>
              <div
                style={{ flex: 1, borderTop: "1px dashed var(--grid)" }}
              ></div>
              <span
                style={{
                  fontFamily: "VT323, monospace",
                  fontSize: "18px",
                  color: "var(--green-dim)",
                }}
              >
                Σ {totalSol.toFixed(4)} SOL
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1px",
                background: "var(--grid)",
              }}
            >
              {solWallets.map((wallet, i) => (
                <WalletCard
                  key={wallet.index}
                  wallet={wallet}
                  chain="SOL"
                  index={i + 3}
                  onSend={(w, c) => setSendTarget({ wallet: w, chain: c })}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div
        style={{
          borderTop: "1px solid var(--grid)",
          background: "var(--bg)",
          padding: "5px 16px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9px",
          color: "var(--text-faint)",
          letterSpacing: "2px",
        }}
      >
        <span>
          NON-CUSTODIAL // BIP39 HD WALLET // AES-256 LOCAL ENCRYPTION
        </span>
        <span>KEYS NEVER LEAVE YOUR DEVICE</span>
      </div>

      {sendTarget && (
        <SendModal
          wallet={sendTarget.wallet}
          chain={sendTarget.chain}
          onClose={() => setSendTarget(null)}
          onSuccess={handleSendSuccess}
        />
      )}
    </div>
  );
}
