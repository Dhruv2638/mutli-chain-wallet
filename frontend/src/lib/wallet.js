import * as bip39 from "bip39";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export function generateSeedPhrase() {
  return bip39.generateMnemonic();
}

export async function getSeedFromPhrase(mnemonic) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid seed phrase!");
  }
  return await bip39.mnemonicToSeed(mnemonic);
}

// Export RPC URLs for other files to use
export const ETH_RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
export const SOL_RPC_URL = process.env.SOLANA_RPC_URL;
