const mintCollection = Array.isArray(window.LAST_WAR_COLLECTION) ? window.LAST_WAR_COLLECTION : [];

const mintConfig = {
  collectionSize: 2140,
  minted: 842,
  publicPriceEth: 0.08,
  allowlistPriceEth: 0.05,
  maxPerWallet: 3,
  phase: "Public Mint",
  publicMintDate: "2026-05-21T20:00:00+08:00",
  chainId: "0x1",
  chainName: "Ethereum Mainnet",
  contractAddress: "TBD",
  mintFunction: "mint(uint256)",
};

const mintDom = {
  connectButton: document.getElementById("connect-wallet-button"),
  walletAddress: document.getElementById("wallet-address"),
  walletSubcopy: document.getElementById("wallet-subcopy"),
  phaseBadge: document.getElementById("mint-phase-badge"),
  phaseName: document.getElementById("phase-name"),
  phaseCopy: document.getElementById("phase-copy"),
  countdownCopy: document.getElementById("countdown-copy"),
  countdownCaption: document.getElementById("countdown-caption"),
  mintSupply: document.getElementById("mint-supply"),
  mintPrice: document.getElementById("mint-price"),
  walletLimit: document.getElementById("mint-wallet-limit"),
  mintChain: document.getElementById("mint-chain"),
  mintProgressCopy: document.getElementById("mint-progress-copy"),
  mintProgressFill: document.getElementById("mint-progress-fill"),
  quantity: document.getElementById("mint-quantity"),
  mintTotal: document.getElementById("mint-total"),
  contractAddress: document.getElementById("contract-address"),
  mintFunction: document.getElementById("mint-function"),
  allowlistPrice: document.getElementById("allowlist-price"),
  contractStatus: document.getElementById("contract-status"),
  mintButton: document.getElementById("mint-button"),
  mintHelper: document.getElementById("mint-helper-copy"),
  mintLog: document.getElementById("mint-log-output"),
  decreaseQty: document.getElementById("decrease-qty"),
  increaseQty: document.getElementById("increase-qty"),
  previewGrid: document.getElementById("mint-preview-grid"),
  walletModal: document.getElementById("wallet-modal"),
  walletModalBackdrop: document.getElementById("wallet-modal-backdrop"),
  walletModalClose: document.getElementById("wallet-modal-close"),
  walletOptionList: document.getElementById("wallet-option-list"),
};

let connectedAddress = "";
let quantity = 1;
let connectedWalletLabel = "";
let activeProvider = null;

const walletOptions = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Popular browser wallet for Ethereum and EVM chains.",
    match: (provider) => Boolean(provider?.isMetaMask),
  },
  {
    id: "okx",
    name: "OKX Wallet",
    description: "Multi-chain wallet extension with EVM support.",
    match: (provider) => Boolean(provider?.isOkxWallet || provider?.isOKExWallet),
  },
  {
    id: "rabby",
    name: "Rabby",
    description: "Power-user EVM wallet with clear transaction previews.",
    match: (provider) => Boolean(provider?.isRabby),
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    description: "Coinbase browser wallet extension.",
    match: (provider) => Boolean(provider?.isCoinbaseWallet),
  },
  {
    id: "browser",
    name: "Browser Wallet",
    description: "Fallback for any injected EVM wallet in this browser.",
    match: () => true,
  },
];

function logMint(message) {
  if (!mintDom.mintLog) return;
  mintDom.mintLog.textContent = message;
}

function formatAddress(address) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getInjectedProviders() {
  if (!window.ethereum) return [];
  if (Array.isArray(window.ethereum.providers) && window.ethereum.providers.length > 0) {
    return window.ethereum.providers;
  }
  return [window.ethereum];
}

function walletProvider(option) {
  const providers = getInjectedProviders();
  return providers.find((provider) => option.match(provider)) ?? null;
}

function walletInstalled(option) {
  return option.id === "browser" ? getInjectedProviders().length > 0 : Boolean(walletProvider(option));
}

function showWalletModal() {
  if (!mintDom.walletModal) return;
  renderWalletOptions();
  mintDom.walletModal.classList.remove("hidden");
  mintDom.walletModal.setAttribute("aria-hidden", "false");
}

function hideWalletModal() {
  if (!mintDom.walletModal) return;
  mintDom.walletModal.classList.add("hidden");
  mintDom.walletModal.setAttribute("aria-hidden", "true");
}

function renderWalletOptions() {
  if (!mintDom.walletOptionList) return;

  const nodes = walletOptions.map((option) => {
    const installed = walletInstalled(option);
    const button = document.createElement("button");
    button.className = "wallet-option-button";
    button.type = "button";
    button.disabled = !installed;
    button.innerHTML = `
      <span class="wallet-option-head">
        <strong>${option.name}</strong>
        <em>${installed ? "Installed" : "Not detected"}</em>
      </span>
      <span class="wallet-option-copy">${option.description}</span>
    `;
    button.addEventListener("click", () => connectWallet(option));
    return button;
  });

  mintDom.walletOptionList.replaceChildren(...nodes);
}

function bindProvider(provider) {
  if (!provider?.on) return;

  provider.removeListener?.("accountsChanged", handleAccountsChanged);
  provider.removeListener?.("chainChanged", handleChainChanged);
  provider.on("accountsChanged", handleAccountsChanged);
  provider.on("chainChanged", handleChainChanged);
}

function handleAccountsChanged(accounts) {
  connectedAddress = accounts?.[0] ?? "";
  mintDom.walletAddress.textContent = formatAddress(connectedAddress);
  mintDom.connectButton.textContent = connectedAddress
    ? `${connectedWalletLabel || "Wallet"} Connected`
    : "Connect Wallet";
  mintDom.walletSubcopy.textContent = connectedAddress
    ? `${connectedWalletLabel || "Wallet"} is active in this browser.`
    : "Choose a wallet to connect.";
}

function handleChainChanged(chainId) {
  if (chainId !== mintConfig.chainId) {
    logMint(`Connected wallet switched to ${chainId}. Change back to ${mintConfig.chainName} before minting.`);
    return;
  }
  logMint(`Connected wallet is on ${mintConfig.chainName}.`);
}

function isContractConfigured() {
  return mintConfig.contractAddress && mintConfig.contractAddress !== "TBD";
}

function updateMintTotals() {
  if (mintDom.quantity) mintDom.quantity.textContent = String(quantity);
  if (mintDom.mintTotal) {
    mintDom.mintTotal.textContent = `${(mintConfig.publicPriceEth * quantity).toFixed(2)} ETH`;
  }
}

function updateStaticMintInfo() {
  const progressRatio = mintConfig.minted / mintConfig.collectionSize;
  mintDom.phaseBadge.textContent = mintConfig.phase;
  mintDom.phaseName.textContent = mintConfig.phase;
  mintDom.phaseCopy.textContent = "Public mint is active. Wallet limit, price display, and contract hand-off notes are ready for production wiring.";
  mintDom.mintSupply.textContent = String(mintConfig.collectionSize);
  mintDom.mintPrice.textContent = `${mintConfig.publicPriceEth.toFixed(2)} ETH`;
  mintDom.walletLimit.textContent = String(mintConfig.maxPerWallet);
  mintDom.mintChain.textContent = mintConfig.chainName;
  mintDom.mintProgressCopy.textContent = `${mintConfig.minted} / ${mintConfig.collectionSize}`;
  mintDom.mintProgressFill.style.width = `${Math.min(progressRatio * 100, 100)}%`;
  mintDom.contractAddress.textContent = mintConfig.contractAddress;
  mintDom.mintFunction.textContent = mintConfig.mintFunction;
  mintDom.allowlistPrice.textContent = `${mintConfig.allowlistPriceEth.toFixed(2)} ETH`;
  mintDom.contractStatus.textContent = isContractConfigured()
    ? "Contract address configured. Replace the placeholder send flow with your ABI call."
    : "Awaiting deployed contract details";
  updateMintTotals();
}

function updateCountdown() {
  const now = Date.now();
  const target = new Date(mintConfig.publicMintDate).getTime();
  const delta = target - now;

  if (delta <= 0) {
    mintDom.countdownCopy.textContent = "Mint is live";
    mintDom.countdownCaption.textContent = "Public mint time has been reached.";
    return;
  }

  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((delta / (1000 * 60)) % 60);
  mintDom.countdownCopy.textContent = `${days}d ${hours}h ${minutes}m`;
  mintDom.countdownCaption.textContent = `Configured public mint date: May 21, 2026 20:00 GMT+8`;
}

async function connectWallet(option) {
  if (!window.ethereum) {
    logMint("No injected wallet detected. Install MetaMask, OKX, Rabby, Coinbase Wallet, or another EVM wallet first.");
    return;
  }

  const selectedOption = option ?? walletOptions.find((item) => walletInstalled(item));
  const provider = selectedOption ? walletProvider(selectedOption) : null;

  if (!selectedOption || !provider) {
    logMint("No supported injected wallet was found. Install one of the listed wallets and try again.");
    return;
  }

  try {
    const chainId = await provider.request({ method: "eth_chainId" });
    if (chainId !== mintConfig.chainId) {
      logMint(`Wallet connected on ${chainId}. Switch to ${mintConfig.chainName} before minting.`);
    }

    const accounts = await provider.request({ method: "eth_requestAccounts" });
    activeProvider = provider;
    connectedWalletLabel = selectedOption.name;
    connectedAddress = accounts?.[0] ?? "";
    mintDom.walletAddress.textContent = formatAddress(connectedAddress);
    mintDom.walletSubcopy.textContent = `${selectedOption.name} is active in this browser.`;
    mintDom.connectButton.textContent = connectedAddress ? `${selectedOption.name} Connected` : "Connect Wallet";
    bindProvider(provider);
    hideWalletModal();
    logMint(`${selectedOption.name} connected: ${formatAddress(connectedAddress)}.`);
  } catch (error) {
    logMint(`${selectedOption.name} connection failed: ${error?.message ?? "Unknown error"}`);
  }
}

function handleMintAttempt() {
  if (!connectedAddress) {
    logMint("Choose a wallet before minting.");
    showWalletModal();
    return;
  }

  if (!isContractConfigured()) {
    logMint("Mint blocked: contract address is still placeholder text. Add the deployed contract details in mint.js to activate the final send flow.");
    return;
  }

  logMint("Contract address is configured. Replace this placeholder branch with your ABI-backed mint transaction call.");
}

function renderRarePreview() {
  if (!mintDom.previewGrid || mintCollection.length === 0) return;

  const nodes = [...mintCollection]
    .sort((a, b) => (b.rarityScore ?? 0) - (a.rarityScore ?? 0))
    .slice(0, 4)
    .map((item) => {
      const article = document.createElement("article");
      article.className = "mint-preview-card";
      article.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <strong>${item.name}</strong>
        <span>${item.rarityTier ?? "Ranked"} / ${item.rarityScore ?? "-"}</span>
      `;
      return article;
    });

  mintDom.previewGrid.replaceChildren(...nodes);
}

mintDom.decreaseQty?.addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  updateMintTotals();
});

mintDom.increaseQty?.addEventListener("click", () => {
  quantity = Math.min(mintConfig.maxPerWallet, quantity + 1);
  updateMintTotals();
});

mintDom.connectButton?.addEventListener("click", showWalletModal);
mintDom.mintButton?.addEventListener("click", handleMintAttempt);
mintDom.walletModalClose?.addEventListener("click", hideWalletModal);
mintDom.walletModalBackdrop?.addEventListener("click", hideWalletModal);

updateStaticMintInfo();
updateCountdown();
renderRarePreview();
renderWalletOptions();
window.setInterval(updateCountdown, 60_000);
