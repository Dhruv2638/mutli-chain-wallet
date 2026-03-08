import CryptoJS from 'crypto-js';
import fs from 'fs';
import path from 'path';

const WALLET_FILE = 'wallet.json';

// ✅ Save wallet encrypted to file
export function saveWallet(mnemonic, password) {
  // Encrypt seed phrase with password
  const encrypted = CryptoJS.AES.encrypt(mnemonic, password).toString();

  const walletData = {
    encrypted,
    createdAt: new Date().toISOString(),
  };

  // Save to wallet.json
  fs.writeFileSync(WALLET_FILE, JSON.stringify(walletData, null, 2));
  console.log("✅ Wallet saved to wallet.json");
}

// ✅ Load and decrypt wallet from file
export function loadWallet(password) {
  // Check if wallet file exists
  if (!fs.existsSync(WALLET_FILE)) {
    return null;
  }

  const walletData = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'));

  try {
    // Decrypt with password
    const decrypted = CryptoJS.AES.decrypt(walletData.encrypted, password);
    const mnemonic = decrypted.toString(CryptoJS.enc.Utf8);

    if (!mnemonic) {
      throw new Error("Wrong password!");
    }

    return mnemonic;
  } catch (e) {
    throw new Error("Wrong password!");
  }
}

// ✅ Check if wallet file exists
export function walletExists() {
  return fs.existsSync(WALLET_FILE);
}
