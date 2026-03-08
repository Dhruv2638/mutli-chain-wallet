import CryptoJS from "crypto-js";

const WALLET_KEY = "encrypted_wallet";

export function saveWallet(mnemonic, password) {
  const encrypted = CryptoJS.AES.encrypt(mnemonic, password).toString();
  localStorage.setItem(WALLET_KEY, encrypted);
}

export function loadWallet(password) {
  const encrypted = localStorage.getItem(WALLET_KEY);
  if (!encrypted) return null;

  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, password);
    const mnemonic = decrypted.toString(CryptoJS.enc.Utf8);
    if (!mnemonic) throw new Error("Wrong password!");
    return mnemonic;
  } catch (e) {
    throw new Error("Wrong password!");
  }
}

export function walletExists() {
  return !!localStorage.getItem(WALLET_KEY);
}

export function deleteWallet() {
  localStorage.removeItem(WALLET_KEY);
}
