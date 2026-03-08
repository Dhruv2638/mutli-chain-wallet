import { generateSeedPhrase, getSeedFromPhrase } from "./src/wallet.js";
import {
  getMultipleEthereumWallets,
  getEthereumBalance,
} from "./src/ethereum.js";
import {
  getMultipleSolanaWallets,
  getSolanaBalance,
  sendSol,
} from "./src/solana.js";
import { saveWallet, loadWallet, walletExists } from "./src/storage.js";
import readlineSync from "readline-sync";

async function displayWallets(mnemonic) {
  const seed = await getSeedFromPhrase(mnemonic);

  console.log("\n🔷 Ethereum Wallets:");
  const ethWallets = getMultipleEthereumWallets(mnemonic, 3);
  for (const wallet of ethWallets) {
    const balance = await getEthereumBalance(wallet.address);
    console.log(`\n   Account ${wallet.index}:`);
    console.log(`   Address : ${wallet.address}`);
    console.log(`   Balance : ${balance} ETH`);
  }

  console.log();

  console.log("🟣 Solana Wallets:");
  const solWallets = getMultipleSolanaWallets(seed, 3);
  for (const wallet of solWallets) {
    const balance = await getSolanaBalance(wallet.address);
    console.log(`\n   Account ${wallet.index}:`);
    console.log(`   Address : ${wallet.address}`);
    console.log(`   Balance : ${balance} SOL`);
  }

  return { seed, solWallets };
}

async function main() {
  console.log("🔐 Multi-Chain Wallet\n");

  let mnemonic;

  if (walletExists()) {
    console.log("🔒 Existing wallet found!");
    const password = readlineSync.question("Enter your password: ", {
      hideEchoBack: true,
    });

    try {
      mnemonic = loadWallet(password);
      console.log("✅ Wallet unlocked successfully!");
    } catch (e) {
      console.log("❌ Wrong password!");
      process.exit(1);
    }
  } else {
    console.log("🆕 No wallet found. Creating new wallet...\n");
    mnemonic = generateSeedPhrase();

    console.log("📝 Your Seed Phrase (WRITE THIS DOWN!):");
    console.log("=========================================");
    console.log(mnemonic);
    console.log("=========================================\n");

    const password = readlineSync.question("Set a password: ", {
      hideEchoBack: true,
    });
    const confirmPassword = readlineSync.question("Confirm password: ", {
      hideEchoBack: true,
    });

    if (password !== confirmPassword) {
      console.log("❌ Passwords don't match!");
      process.exit(1);
    }

    saveWallet(mnemonic, password);
    console.log("\n🎉 Wallet created and saved!");
  }

  // Display wallets and get solWallets back
  const { seed, solWallets } = await displayWallets(mnemonic);

  // ✅ Send SOL from Account 0 → Account 1
  console.log("\n💸 Sending 1 SOL from Account 0 → Account 1...");

  const signature = await sendSol(
    solWallets[0].keypair, // sender keypair (for signing)
    solWallets[1].address, // receiver address
    1, // amount in SOL
  );

  console.log("✅ Transaction successful!");
  console.log(`🔗 Signature: ${signature}`);
  console.log(
    `🔍 View on explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );

  // Show updated balances
  console.log("\n📊 Updated Balances:");
  console.log(
    `   Account 0: ${await getSolanaBalance(solWallets[0].address)} SOL`,
  );
  console.log(
    `   Account 1: ${await getSolanaBalance(solWallets[1].address)} SOL`,
  );
}

main();
