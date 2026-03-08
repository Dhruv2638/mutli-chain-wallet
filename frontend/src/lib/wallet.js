import * as bip39 from "bip39";

export function generateSeedPhrase() {
  return bip39.generateMnemonic();
}

export async function getSeedFromPhrase(mnemonic) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid seed phrase!");
  }
  // Returns a Uint8Array — works in browser natively
  return bip39.mnemonicToSeedSync(mnemonic);
}

export const SOL_RPC_URL = "https://api.devnet.solana.com";
export const ETH_RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`;
