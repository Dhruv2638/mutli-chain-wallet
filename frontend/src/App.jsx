import { useState, useEffect } from "react";
import { walletExists } from "./lib/storage";
import UnlockScreen from "./components/UnlockScreen";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mnemonic, setMnemonic] = useState(null);

  const handleUnlock = (mn) => {
    setMnemonic(mn);
    setIsUnlocked(true);
  };

  const handleLock = () => {
    setMnemonic(null);
    setIsUnlocked(false);
  };

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {!isUnlocked ? (
        <UnlockScreen onUnlock={handleUnlock} />
      ) : (
        <Dashboard mnemonic={mnemonic} onLock={handleLock} />
      )}
    </div>
  );
}
