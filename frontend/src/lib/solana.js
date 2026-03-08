import { HDKey } from "@scure/bip32";
import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";

const SOL_RPC_URL = "https://api.devnet.solana.com";

export function getSolanaWallet(seed, index = 0) {
  const path = `m/44'/501'/${index}'/0'`;

  // Use @scure/bip32 instead of ed25519-hd-key — fully browser compatible
  const hdKey = HDKey.fromMasterSeed(seed);
  const derived = hdKey.derive(path);
  const keypair = Keypair.fromSeed(derived.privateKey);

  return {
    index,
    address: keypair.publicKey.toBase58(),
    privateKey: bs58.encode(keypair.secretKey),
    keypair,
  };
}

export function getMultipleSolanaWallets(seed, count = 3) {
  const wallets = [];
  for (let i = 0; i < count; i++) {
    wallets.push(getSolanaWallet(seed, i));
  }
  return wallets;
}

export async function getSolanaBalance(address) {
  const connection = new Connection(SOL_RPC_URL, "confirmed");
  const balance = await connection.getBalance(new PublicKey(address));
  return balance / LAMPORTS_PER_SOL;
}

export async function sendSol(fromKeypair, toAddress, amount) {
  const connection = new Connection(SOL_RPC_URL, "confirmed");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports: amount * LAMPORTS_PER_SOL,
    }),
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    fromKeypair,
  ]);
  return signature;
}
