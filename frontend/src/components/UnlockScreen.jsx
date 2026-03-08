import { useState, useEffect } from "react";
import { generateSeedPhrase } from "../lib/wallet";
import { saveWallet, loadWallet, walletExists } from "../lib/storage";

export default function UnlockScreen({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isNew] = useState(!walletExists());
  const [seedPhrase, setSeedPhrase] = useState("");
  const [step, setStep] = useState(1);
  const [bootText, setBootText] = useState([]);
  const [booting, setBooting] = useState(true);
  const [time, setTime] = useState(new Date());

  // Boot sequence text
  const bootLines = [
    "> NEXUS WALLET v2.1.0",
    "> INITIALIZING CRYPTOGRAPHIC ENGINE...",
    "> LOADING BIP39 WORDLIST [OK]",
    "> CHECKING HD DERIVATION PATHS [OK]",
    "> ETH MAINNET PROVIDER [CONNECTED]",
    "> SOL DEVNET PROVIDER [CONNECTED]",
    "> ENCRYPTION MODULE AES-256 [READY]",
    isNew
      ? "> NO WALLET DETECTED. CREATE NEW WALLET."
      : "> WALLET DETECTED. AUTHENTICATION REQUIRED.",
    "> SYSTEM READY_",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setBootText((prev) => [...prev, bootLines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 400);
      }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleCreate = () => {
    if (password.length < 6)
      return setError("ERR: PASSWORD MINIMUM 6 CHARACTERS");
    if (password !== confirmPassword)
      return setError("ERR: PASSWORDS DO NOT MATCH");
    const mnemonic = generateSeedPhrase();
    setSeedPhrase(mnemonic);
    saveWallet(mnemonic, password);
    setStep(2);
    setError("");
  };

  const handleUnlock = () => {
    try {
      const mnemonic = loadWallet(password);
      onUnlock(mnemonic);
    } catch (e) {
      setError("ERR: AUTHENTICATION FAILED. INVALID PASSWORD.");
    }
  };

  const formatTime = (d) => {
    return d.toTimeString().slice(0, 8);
  };

  const formatDate = (d) => {
    return d.toDateString().toUpperCase();
  };

  return (
    <div
      className="grid-bg flicker"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "0",
      }}
    >
      {/* Top status bar */}
      <div
        style={{
          borderBottom: "1px solid var(--grid)",
          padding: "6px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--bg)",
          fontSize: "11px",
          color: "var(--text-dim)",
          letterSpacing: "2px",
        }}
      >
        <span>NEXUS TERMINAL // MULTI-CHAIN WALLET SYSTEM</span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span>
            <span className="dot-live" style={{ marginRight: "6px" }}></span>
            LIVE
          </span>
          <span>{formatDate(time)}</span>
          <span
            className="glow"
            style={{ color: "var(--amber)", fontWeight: "600" }}
          >
            {formatTime(time)}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "560px" }}>
          {/* Boot sequence */}
          {booting ? (
            <div
              style={{
                fontFamily: "VT323, monospace",
                fontSize: "20px",
                lineHeight: "2",
              }}
            >
              {bootText.map((line, i) => (
                <div
                  key={i}
                  style={{
                    color:
                      i === bootText.length - 1
                        ? "var(--amber)"
                        : "var(--amber-dim)",
                    animation: "fadeInUp 0.2s ease forwards",
                    textShadow:
                      i === bootText.length - 1
                        ? "0 0 8px var(--amber)"
                        : "none",
                  }}
                >
                  {line}
                </div>
              ))}
              <span className="blink" style={{ color: "var(--amber)" }}>
                █
              </span>
            </div>
          ) : (
            <div className="fade-up">
              {/* ASCII art header */}
              <div
                style={{
                  fontFamily: "VT323, monospace",
                  fontSize: "13px",
                  color: "var(--amber-dim)",
                  letterSpacing: "3px",
                  marginBottom: "32px",
                  lineHeight: "1.4",
                }}
              >
                <div
                  className="glow"
                  style={{
                    fontSize: "52px",
                    color: "var(--amber)",
                    lineHeight: "1",
                    marginBottom: "4px",
                  }}
                >
                  NEXUS
                </div>
                <div style={{ letterSpacing: "8px", fontSize: "13px" }}>
                  MULTI-CHAIN WALLET TERMINAL
                </div>
                <div
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "11px",
                    marginTop: "4px",
                    letterSpacing: "4px",
                  }}
                >
                  ETH // SOL // HD-BIP39 // AES-256
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  borderTop: "1px solid var(--amber-dim)",
                  marginBottom: "32px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "0",
                    background: "var(--bg)",
                    padding: "0 8px",
                    fontSize: "11px",
                    color: "var(--text-dim)",
                    letterSpacing: "2px",
                  }}
                >
                  {isNew ? "NEW WALLET SETUP" : "AUTHENTICATION"}
                </span>
              </div>

              {step === 1 && (
                <>
                  {/* Password field */}
                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-dim)",
                        letterSpacing: "3px",
                        marginBottom: "8px",
                      }}
                    >
                      {isNew ? "// SET PASSWORD" : "// ENTER PASSWORD"}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0",
                      }}
                    >
                      <span
                        style={{
                          padding: "10px 12px",
                          background: "var(--amber)",
                          color: "var(--bg)",
                          fontFamily: "VT323, monospace",
                          fontSize: "18px",
                          fontWeight: "bold",
                          flexShrink: 0,
                        }}
                      >
                        PWD
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (isNew
                            ? confirmPassword && handleCreate()
                            : handleUnlock())
                        }
                        placeholder="________________"
                        autoFocus
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          fontSize: "16px",
                          letterSpacing: "4px",
                          border: "1px solid var(--amber-dim)",
                          borderLeft: "none",
                        }}
                      />
                    </div>
                  </div>

                  {isNew && (
                    <div style={{ marginBottom: "24px" }}>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-dim)",
                          letterSpacing: "3px",
                          marginBottom: "8px",
                        }}
                      >
                        // CONFIRM PASSWORD
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            padding: "10px 12px",
                            background: "var(--amber-dim)",
                            color: "var(--bg)",
                            fontFamily: "VT323, monospace",
                            fontSize: "18px",
                            fontWeight: "bold",
                            flexShrink: 0,
                          }}
                        >
                          CFM
                        </span>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                          placeholder="________________"
                          style={{
                            flex: 1,
                            padding: "10px 14px",
                            fontSize: "16px",
                            letterSpacing: "4px",
                            border: "1px solid var(--amber-dim)",
                            borderLeft: "none",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div
                      style={{
                        padding: "10px 14px",
                        border: "1px solid var(--red)",
                        marginBottom: "16px",
                        fontSize: "12px",
                        color: "var(--red)",
                        letterSpacing: "1px",
                        fontFamily: "VT323, monospace",
                        fontSize: "16px",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    onClick={isNew ? handleCreate : handleUnlock}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "var(--amber)",
                      border: "none",
                      color: "var(--bg)",
                      fontSize: "14px",
                      fontWeight: "700",
                      letterSpacing: "6px",
                      fontFamily: "IBM Plex Mono, monospace",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.background = "var(--amber-glow)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.background = "var(--amber)")
                    }
                  >
                    {isNew ? "[ INITIALIZE WALLET ]" : "[ AUTHENTICATE ]"}
                  </button>
                </>
              )}

              {step === 2 && (
                <div>
                  <div
                    style={{
                      padding: "16px",
                      border: "1px solid var(--amber)",
                      marginBottom: "24px",
                      background: "rgba(255,176,0,0.03)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--red)",
                        letterSpacing: "3px",
                        marginBottom: "12px",
                        fontFamily: "VT323, monospace",
                        fontSize: "16px",
                      }}
                    >
                      !! CRITICAL: WRITE DOWN YOUR SEED PHRASE !!
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px",
                      }}
                    >
                      {seedPhrase.split(" ").map((word, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "baseline",
                            borderBottom: "1px solid var(--grid)",
                            paddingBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              color: "var(--text-dim)",
                              fontSize: "11px",
                              minWidth: "18px",
                              fontFamily: "VT323, monospace",
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            style={{
                              color: "var(--amber)",
                              fontSize: "14px",
                              fontWeight: "600",
                              letterSpacing: "1px",
                            }}
                          >
                            {word}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const m = loadWallet(password);
                      onUnlock(m);
                    }}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "var(--amber)",
                      border: "none",
                      color: "var(--bg)",
                      fontSize: "14px",
                      fontWeight: "700",
                      letterSpacing: "4px",
                      fontFamily: "IBM Plex Mono, monospace",
                    }}
                  >
                    [ CONFIRMED. ENTER TERMINAL ]
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid var(--grid)",
          padding: "6px 24px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          color: "var(--text-faint)",
          letterSpacing: "2px",
        }}
      >
        <span>AES-256 ENCRYPTION // BIP39 HD WALLET</span>
        <span>NON-CUSTODIAL // YOUR KEYS YOUR CRYPTO</span>
      </div>
    </div>
  );
}
