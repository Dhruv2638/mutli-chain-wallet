import { HDNodeWallet, Mnemonic, JsonRpcProvider, formatEther } from 'ethers';
import { ETH_RPC_URL } from './wallet.js';

export function getEthereumWallet(mnemonic, index = 0) {
  const path = `m/44'/60'/0'/0/${index}`;
  const mnemonicObj = Mnemonic.fromPhrase(mnemonic);
  const wallet = HDNodeWallet.fromMnemonic(mnemonicObj, path);

  return {
    index,
    address: wallet.address,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
  };
}

export function getMultipleEthereumWallets(mnemonic, count = 3) {
  const wallets = [];
  for (let i = 0; i < count; i++) {
    wallets.push(getEthereumWallet(mnemonic, i));
  }
  return wallets;
}

// ✅ New — check ETH balance
export async function getEthereumBalance(address) {
  // Connect to Ethereum network via Alchemy
  const provider = new JsonRpcProvider(ETH_RPC_URL);

  // Get balance in Wei
  const balanceWei = await provider.getBalance(address);

  // Convert Wei to ETH
  const balanceEth = formatEther(balanceWei);

  return balanceEth;
}
