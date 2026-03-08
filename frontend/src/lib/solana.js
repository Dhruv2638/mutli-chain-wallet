import { derivePath } from "ed25519-hd-key";
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
import { SOL_RPC_URL } from "./wallet.js";

export function getSolanaWallet(seed, index = 0) {
  const path = `m/44'/501'/${index}'/0'`;
  const { key } = derivePath(path, seed.toString("hex"));
  const keypair = Keypair.fromSeed(key);

  return {
    index,
    address: keypair.publicKey.toBase58(),
    privateKey: bs58.encode(keypair.secretKey),
    keypair, // ← we need this for signing transactions
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
  const balanceLamports = await connection.getBalance(new PublicKey(address));
  return balanceLamports / LAMPORTS_PER_SOL;
}

// ✅ New — Send SOL to another address
export async function sendSol(fromKeypair, toAddress, amount) {
  const connection = new Connection(SOL_RPC_URL, "confirmed");

  // Convert SOL to Lamports
  const lamports = amount * LAMPORTS_PER_SOL;

  // Create transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports,
    }),
  );

  // Sign and send transaction
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [fromKeypair], // signers array
  );

  return signature;
}
