import { useState } from "react";
import { generateSeedPhrase } from "../lib/wallet";
import { saveWallet, loadWallet, walletExists } from "../lib/storage";

export default function UnlockScreen({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isNew, setIsNew] = useState(!walletExists());
  const [seedPhrase, setSeedPhrase] = useState("");
  const [step, setStep] = useState(1); // 1=password, 2=show seed

  const handleCreate = () => {
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return setError("Passwords do not match!");

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
      setError("Wrong password!");
    }
  };

  const handleContinue = () => {
    const mnemonic = loadWallet(password);
    onUnlock(mnemonic);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        className="animate-fade"
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              fontSize: "48px",
              marginBottom: "12px",
              filter: "drop-shadow(0 0 20px rgba(0,212,255,0.5))",
            }}
          >
            ⬡
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              letterSpacing: "8px",
              color: "var(--accent-cyan)",
              textTransform: "uppercase",
              fontFamily: "Share Tech Mono, monospace",
            }}
          >
            NEXUS
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "13px",
              letterSpacing: "3px",
              marginTop: "4px",
            }}
          >
            MULTI-CHAIN WALLET
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "32px",
            backdropFilter: "blur(10px)",
          }}
        >
          {step === 1 && (
            <>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "24px",
                  color: "var(--text-primary)",
                  letterSpacing: "2px",
                }}
              >
                {isNew ? "⚡ CREATE WALLET" : "🔒 UNLOCK WALLET"}
              </h2>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    letterSpacing: "2px",
                    color: "var(--text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (isNew ? handleCreate() : handleUnlock())
                  }
                  placeholder="Enter password..."
                  style={{
                    width: "100%",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    fontFamily: "Share Tech Mono, monospace",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent-cyan)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {isNew && (
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      letterSpacing: "2px",
                      color: "var(--text-secondary)",
                      marginBottom: "8px",
                    }}
                  >
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    placeholder="Confirm password..."
                    style={{
                      width: "100%",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      color: "var(--text-primary)",
                      fontSize: "14px",
                      fontFamily: "Share Tech Mono, monospace",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--accent-cyan)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                </div>
              )}

              {error && (
                <p
                  style={{
                    color: "var(--danger)",
                    fontSize: "13px",
                    marginBottom: "16px",
                    fontFamily: "Share Tech Mono, monospace",
                  }}
                >
                  ⚠ {error}
                </p>
              )}

              <button
                onClick={isNew ? handleCreate : handleUnlock}
                style={{
                  width: "100%",
                  padding: "14px",
                  background:
                    "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  letterSpacing: "3px",
                  cursor: "pointer",
                  fontFamily: "Rajdhani, sans-serif",
                  transition: "opacity 0.2s",
                }}
                onMouseOver={(e) => (e.target.style.opacity = "0.85")}
                onMouseOut={(e) => (e.target.style.opacity = "1")}
              >
                {isNew ? "CREATE WALLET" : "UNLOCK"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "var(--accent-green)",
                  letterSpacing: "2px",
                }}
              >
                ✅ WALLET CREATED!
              </h2>
              <p
                style={{
                  color: "var(--danger)",
                  fontSize: "13px",
                  marginBottom: "20px",
                  lineHeight: "1.5",
                }}
              >
                ⚠️ Write down your seed phrase. You will NEVER be able to
                recover it if lost!
              </p>

              {/* Seed phrase grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                  marginBottom: "24px",
                  background: "var(--bg-secondary)",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
              >
                {seedPhrase.split(" ").map((word, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "11px",
                        minWidth: "16px",
                        fontFamily: "Share Tech Mono, monospace",
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span
                      style={{
                        color: "var(--accent-cyan)",
                        fontSize: "13px",
                        fontFamily: "Share Tech Mono, monospace",
                      }}
                    >
                      {word}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleContinue}
                style={{
                  width: "100%",
                  padding: "14px",
                  background:
                    "linear-gradient(135deg, var(--accent-green), var(--accent-cyan))",
                  border: "none",
                  borderRadius: "8px",
                  color: "var(--bg-primary)",
                  fontSize: "14px",
                  fontWeight: "700",
                  letterSpacing: "3px",
                  cursor: "pointer",
                  fontFamily: "Rajdhani, sans-serif",
                }}
              >
                I'VE SAVED MY SEED PHRASE →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
