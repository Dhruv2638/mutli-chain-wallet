# ⬡ NEXUS — Multi-Chain Wallet Terminal

> A non-custodial HD wallet supporting Ethereum and Solana, built from scratch.

![Terminal UI](https://img.shields.io/badge/UI-Terminal_Style-ffb000?style=flat-square)
![ETH](https://img.shields.io/badge/Ethereum-Sepolia-627EEA?style=flat-square)
![SOL](https://img.shields.io/badge/Solana-Devnet-9945FF?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🔐 What is NEXUS?

NEXUS is a fully functional multi-chain crypto wallet built from scratch without any wallet SDK.
It uses the same cryptographic primitives that power MetaMask and Phantom under the hood.

---

## ✨ Features

- **BIP39 Seed Phrase Generation** — 12-word mnemonic following industry standard
- **HD Wallet Derivation** — Multiple accounts from single seed (BIP44 paths)
- **Multi-Chain Support** — Ethereum (Sepolia) + Solana (Devnet)
- **Live Balance Checking** — Real-time via Alchemy RPC + Solana Devnet
- **Send Transactions** — Broadcast real transactions on both chains
- **AES-256 Encryption** — Seed phrase encrypted locally, never stored plain text
- **Secure Key Reveal** — 3-step flow: warning → password confirm → 30s auto-hide
- **Transaction History** — View past transactions per account
- **Bloomberg Terminal UI** — Unique retro phosphor display aesthetic

---

## 🛠️ Tech Stack

| Layer          | Technology             |
| -------------- | ---------------------- |
| Frontend       | React + Vite           |
| Ethereum       | ethers.js v6           |
| Solana         | @solana/web3.js        |
| Key Derivation | bip39 + ed25519-hd-key |
| Encryption     | crypto-js (AES-256)    |
| ETH RPC        | Alchemy                |
| SOL RPC        | Solana Devnet          |

---

## 🧠 How It Works

```
Seed Phrase (BIP39 — 12 words)
           ↓
    Master Seed (512 bits)
    /                    \
   ↓                      ↓
ETH Path                SOL Path
m/44'/60'/0'/0/n        m/44'/501'/n'/0'
   ↓                      ↓
ETH Wallets             SOL Wallets
(Account 0, 1, 2...)    (Account 0, 1, 2...)
```

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+
- Alchemy API key (free at [alchemy.com](https://alchemy.com))

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/multi-chain-wallet
cd multi-chain-wallet

# Install backend dependencies
npm install

# Setup frontend
cd frontend
npm install

# Create .env file
echo "VITE_ALCHEMY_API_KEY=your_key_here" > .env

# Run
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ⚠️ Security Notes

- This wallet is for **educational purposes** — use on testnets only
- Private keys are stored **encrypted locally** using AES-256
- Seed phrase is **never sent to any server**
- This is a non-custodial wallet — **you own your keys**

---

## 📁 Project Structure

```
multi-chain-wallet/
├── src/
│   ├── ethereum.js      # ETH wallet + balance + send
│   ├── solana.js        # SOL wallet + balance + send
│   └── wallet.js        # Seed phrase generation + recovery
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── UnlockScreen.jsx   # Boot sequence + auth
│       │   ├── Dashboard.jsx      # Main wallet view
│       │   ├── WalletCard.jsx     # Per-account card
│       │   ├── SendModal.jsx      # Send transaction flow
│       │   └── RevealKeyModal.jsx # Secure key reveal
│       └── lib/                   # Browser-compatible wallet logic
└── index.js             # CLI entry point
```

---

## 🎓 Concepts Learned

- BIP39 mnemonic generation and validation
- BIP44 hierarchical deterministic key derivation
- Elliptic curve cryptography (secp256k1 for ETH, ed25519 for SOL)
- Transaction signing and broadcasting
- AES-256 symmetric encryption
- RPC node interaction (Alchemy, Solana devnet)
- React state management for async blockchain data
- Browser polyfills for Node.js crypto libraries

---

Built with 💛 while learning Web3 from scratch.
