import { useState, useEffect, useRef } from "react";
import { loadWallet } from "../lib/storage";

const REVEAL_TIMEOUT = 30; // seconds

export default function RevealKeyModal({ wallet, chain, onClose }) {
  const [step, setStep] = useState(1); // 1=warning, 2=password, 3=revealed
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(REVEAL_TIMEOUT);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const isEth = chain === "ETH";
  const chainColor = isEth ? "var(--amber)" : "var(--green)";

  // Auto-hide timer starts when key is revealed
  useEffect(() => {
    if (step === 3) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  const handlePasswordConfirm = () => {
    try {
      loadWallet(password); // validates password
      setStep(3);
      setError("");
    } catch (e) {
      setError("ERR: AUTHENTICATION FAILED. INVALID PASSWORD.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.privateKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: "20px",
  };

  const cardStyle = {
    border: "1px solid var(--red)",
    borderTop: "2px solid var(--red)",
    background: "var(--bg)",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 0 40px rgba(255,49,49,0.1)",
  };

  // Step 1 — Warning screen
  if (step === 1) {
    return (
      <div style={overlayStyle}>
        <div style={cardStyle} className="fade-up">
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--grid)",
              background: "rgba(255,49,49,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "VT323, monospace",
                fontSize: "20px",
                color: "var(--red)",
                letterSpacing: "3px",
              }}
            >
              !! SECURITY WARNING
            </span>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "1px solid var(--grid)",
                color: "var(--text-dim)",
                padding: "2px 8px",
                fontSize: "11px",
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

          <div style={{ padding: "24px 20px" }}>
            {/* Warning lines */}
            {[
              "YOUR PRIVATE KEY GRANTS FULL ACCESS TO THIS ACCOUNT.",
              "ANYONE WITH THIS KEY CAN STEAL ALL YOUR FUNDS.",
              "NEVER SHARE IT WITH ANYONE — INCLUDING SUPPORT STAFF.",
              "NEVER ENTER IT ON ANY WEBSITE OR APP.",
              "MAKE SURE NOBODY IS LOOKING AT YOUR SCREEN.",
            ].map((line, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "12px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "var(--red)",
                    fontFamily: "VT323, monospace",
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  !!
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,49,49,0.8)",
                    letterSpacing: "1px",
                    lineHeight: "1.5",
                  }}
                >
                  {line}
                </span>
              </div>
            ))}

            <div
              style={{
                borderTop: "1px solid var(--grid)",
                marginTop: "20px",
                paddingTop: "20px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "none",
                  border: "1px solid var(--grid)",
                  color: "var(--text-dim)",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  fontFamily: "IBM Plex Mono, monospace",
                  cursor: "crosshair",
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
                [ CANCEL ]
              </button>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "rgba(255,49,49,0.15)",
                  border: "1px solid var(--red)",
                  color: "var(--red)",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  fontFamily: "IBM Plex Mono, monospace",
                  cursor: "crosshair",
                  transition: "all 0.1s",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(255,49,49,0.25)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "rgba(255,49,49,0.15)";
                }}
              >
                [ I UNDERSTAND ]
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2 — Password confirmation
  if (step === 2) {
    return (
      <div style={overlayStyle}>
        <div style={cardStyle} className="fade-up">
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--grid)",
              background: "var(--bg2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "VT323, monospace",
                fontSize: "20px",
                color: "var(--amber)",
                letterSpacing: "3px",
              }}
            >
              CONFIRM IDENTITY
            </span>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "1px solid var(--grid)",
                color: "var(--text-dim)",
                padding: "2px 8px",
                fontSize: "11px",
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

          <div style={{ padding: "24px 20px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "var(--text-dim)",
                letterSpacing: "3px",
                marginBottom: "20px",
              }}
            >
              ENTER YOUR WALLET PASSWORD TO PROCEED
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--text-dim)",
                  letterSpacing: "3px",
                  marginBottom: "8px",
                }}
              >
                // PASSWORD
              </div>
              <div style={{ display: "flex" }}>
                <span
                  style={{
                    padding: "10px 12px",
                    background: "var(--amber)",
                    color: "var(--bg)",
                    fontFamily: "VT323, monospace",
                    fontSize: "16px",
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
                    e.key === "Enter" && handlePasswordConfirm()
                  }
                  placeholder="________________"
                  autoFocus
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    fontSize: "16px",
                    letterSpacing: "4px",
                    borderLeft: "none",
                  }}
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: "10px",
                  border: "1px solid var(--red)",
                  background: "rgba(255,49,49,0.05)",
                  marginBottom: "16px",
                  fontFamily: "VT323, monospace",
                  fontSize: "16px",
                  color: "var(--red)",
                  letterSpacing: "1px",
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handlePasswordConfirm}
              style={{
                width: "100%",
                padding: "14px",
                background: "var(--amber)",
                border: "none",
                color: "var(--bg)",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "6px",
                fontFamily: "IBM Plex Mono, monospace",
                cursor: "crosshair",
                transition: "background 0.1s",
              }}
              onMouseOver={(e) =>
                (e.target.style.background = "var(--amber-glow)")
              }
              onMouseOut={(e) => (e.target.style.background = "var(--amber)")}
            >
              [ AUTHENTICATE ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3 — Revealed with timer
  return (
    <div style={overlayStyle}>
      <div style={cardStyle} className="fade-up">
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--grid)",
            background: "var(--bg2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "VT323, monospace",
              fontSize: "20px",
              color: chainColor,
              letterSpacing: "3px",
            }}
          >
            {chain} ACCT-{String(wallet.index).padStart(2, "0")} // PRIVATE KEY
          </span>

          {/* Countdown timer */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "9px",
                  color: "var(--text-dim)",
                  letterSpacing: "2px",
                }}
              >
                AUTO-HIDE IN
              </div>
              <div
                style={{
                  fontFamily: "VT323, monospace",
                  fontSize: "22px",
                  color: timeLeft <= 10 ? "var(--red)" : "var(--amber)",
                  letterSpacing: "2px",
                  animation:
                    timeLeft <= 10 ? "blink 0.5s step-end infinite" : "none",
                }}
              >
                {String(timeLeft).padStart(2, "0")}s
              </div>
            </div>
          </div>
        </div>

        {/* Timer progress bar */}
        <div
          style={{
            height: "3px",
            background: "var(--grid)",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              background: timeLeft <= 10 ? "var(--red)" : chainColor,
              width: (timeLeft / REVEAL_TIMEOUT) * 100 + "%",
              transition: "width 1s linear, background 0.3s",
              boxShadow:
                "0 0 6px " + (timeLeft <= 10 ? "var(--red)" : chainColor),
            }}
          />
        </div>

        <div style={{ padding: "20px" }}>
          {/* Address for reference */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "9px",
                color: "var(--text-dim)",
                letterSpacing: "3px",
                marginBottom: "6px",
              }}
            >
              ADDRESS (PUBLIC)
            </div>
            <div
              style={{
                padding: "8px 10px",
                background: "var(--bg2)",
                border: "1px solid var(--grid)",
                fontSize: "11px",
                fontFamily: "IBM Plex Mono, monospace",
                color: chainColor,
                letterSpacing: "1px",
                wordBreak: "break-all",
              }}
            >
              {wallet.address}
            </div>
          </div>

          {/* Private key */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "9px",
                color: "var(--red)",
                letterSpacing: "3px",
                marginBottom: "6px",
              }}
            >
              PRIVATE KEY — NEVER SHARE THIS
            </div>
            <div
              style={{
                padding: "12px",
                background: "rgba(255,49,49,0.05)",
                border: "1px solid rgba(255,49,49,0.4)",
                fontSize: "11px",
                fontFamily: "IBM Plex Mono, monospace",
                color: "var(--red)",
                wordBreak: "break-all",
                lineHeight: "1.6",
                letterSpacing: "0.5px",
                userSelect: "all",
              }}
            >
              {wallet.privateKey}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                padding: "12px",
                background: copied ? "rgba(0,255,65,0.1)" : "none",
                border:
                  "1px solid " + (copied ? "var(--green)" : "var(--grid)"),
                color: copied ? "var(--green)" : "var(--text-dim)",
                fontSize: "11px",
                letterSpacing: "3px",
                fontFamily: "IBM Plex Mono, monospace",
                cursor: "crosshair",
                transition: "all 0.1s",
              }}
            >
              {copied ? "[ COPIED ✓ ]" : "[ COPY KEY ]"}
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                background: "none",
                border: "1px solid var(--red)",
                color: "var(--red)",
                fontSize: "11px",
                letterSpacing: "3px",
                fontFamily: "IBM Plex Mono, monospace",
                cursor: "crosshair",
                transition: "all 0.1s",
              }}
              onMouseOver={(e) =>
                (e.target.style.background = "rgba(255,49,49,0.1)")
              }
              onMouseOut={(e) => (e.target.style.background = "none")}
            >
              [ HIDE NOW ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
