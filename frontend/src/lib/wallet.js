import * as bip39 from "bip39";

// No dotenv needed in browser!
export function generateSeedPhrase() {
  return bip39.generateMnemonic();
}

export async function getSeedFromPhrase(mnemonic) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid seed phrase!");
  }
  return await bip39.mnemonicToSeed(mnemonic);
}

// Hardcode RPC URLs for browser (no process.env)
export const ETH_RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`;
export const SOL_RPC_URL = "https://api.devnet.solana.com";
