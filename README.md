# LeftAI

**Natural Language Crypto Transactions on Ethereum**

**AI-powered transaction assistant built for Ethereum with conversational interface**


> **🌐 Web3 DApp:** This is an Ethereum Web3 application optimized for both desktop and mobile! Open the link in any Web3-enabled browser for the best experience.

## Web3 DApp Experience �

LeftAI is built as an Ethereum Web3 DApp - a modern application optimized for seamless wallet integration. The interface provides an intuitive, chat-based interaction for crypto transactions.

<p align="center">
  <img src="./frontend/public/mobile%20landing.png" alt="LeftAI Mobile Landing" width="350">
  <img src="./frontend/public/mobile%20view.png" alt="LeftAI Mobile Chat Interface" width="350">
</p>

## PWA Web Experience 💻

LeftAI also works as a Progressive Web App, providing a seamless experience across desktop and mobile browsers with full wallet integration.

![LeftAI Desktop and Mobile View](./frontend/public/landingpage.png)

## Demo Video
[🎥 Watch Demo Video](#)

## Inspiration: How We Came Up With This Idea 💡

We noticed that blockchain transactions are still too complex for mainstream adoption. Users need to:
- Copy-paste long wallet addresses (prone to errors)
- Calculate amounts manually
- Navigate multiple DeFi protocols
- Understand complex terminology

> *"What if you could just say 'Send $10 to Alice' and it happens?"*

That question sparked LeftAI. By combining natural language processing with AI function calling (powered by Phala's confidential computing network), contact management, and smart contract automation, we created an interface where anyone can execute crypto transactions as easily as sending a text message.

This exploration led us to build LeftAI as an **Ethereum Web3 DApp** - a modern, PWA-optimized application that:

- **Understands natural language commands** using RedPill AI (Phala Network)
- **Resolves contacts automatically** with @mentions (like Twitter/Slack)
- **Converts USD to crypto** using $ notation for intuitive amounts
- **Splits bills intelligently** with AI-powered calculation
- **Enables ETH staking** through Lido protocol
- **Executes transactions securely** with MetaMask/RainbowKit integration
- **Provides real-time feedback** with explorer links and confirmations
- **Works seamlessly on mobile** as a PWA

## Features ✨

### 1. **Natural Language Transactions**
- Send crypto using plain English: *"Send $10 to @Alice Johnson"*
- AI extracts parameters and prepares transactions
- Smart parameter collection for missing information

### 2. **Contact Integration**
- Type `@` to select contacts with autocomplete
- No more copy-pasting addresses
- Contact names automatically resolve to wallet addresses

### 3. **USD Denomination**
- Type `$10` to send 10 USDC
- Simple 1:1 conversion for easy mental math
- Supports USDC, ETH, USDT

### 4. **Bill Splitting**
- *"I paid $60 for dinner with @Bob and @Carol, split it equally"*
- AI calculates individual shares
- Sends payment requests to all participants
- Notification system for requests

### 5. **ETH Staking**
- *"I want to stake 0.5 ETH to earn rewards"*
- Lido stETH integration (ETH → stETH)
- Single transaction, no complex steps
- Uses Lido contract: `0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`

### 6. **Account Balance**
- View USDC and ETH balances
- Direct link to Etherscan explorer
- Real-time balance updates

### 7. **Address Reputation System** 🛡️
- Check address trust scores before transacting
- Flag suspicious addresses
- Upvote trusted addresses
- Inspired by Ergo Reputation System

## Getting Started 🚀

### Frontend Setup

Clone the repository and start the development server:

```bash
git clone https://github.com/derek2403/token2049.git
cd token2049/frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# RedPill AI API (Phala Network)
REDPILL_API_KEY=your_redpill_api_key_here

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

## System Architecture 🏗️

```
┌─────────────────┐
│   User Input    │
│  "Send $10 to   │
│  @Alice"        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│   Frontend Processing       │
│  • @ → Wallet Address       │
│  • $ → USDC Amount          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   RedPill AI (Phala)        │
│  • Parse intent             │
│  • Extract parameters       │
│  • Call function            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Smart Contract Execution  │
│  • Transfer USDC            │
│  • Stake ETH (Lido)         │
│  • Request Payment          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Blockchain Confirmation   │
│  • MetaMask signature       │
│  • Transaction on Ethereum  │
│  • Etherscan link           │
└─────────────────────────────┘
```

## Technology Stack 🛠️

### Frontend
- **Next.js 15** - React framework with App Router
- **Wagmi 2.x** - React Hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **Viem** - TypeScript interface for Ethereum
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **shadcn/ui** - UI component library

### Backend & APIs
- **RedPill AI (Phala Network)** - Confidential AI computation
- **OpenAI-compatible API** - Function calling interface
- **Etherscan API** - Blockchain data

### Smart Contracts
- **Solidity 0.8.20+** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries
- **Ethereum Mainnet/Sepolia** - Deployment networks

### Blockchain & Web3
- **Ethereum** - Layer 1 blockchain
- **USDC** - Primary stablecoin
- **RainbowKit** - Multi-wallet support (MetaMask, WalletConnect, etc.)
- **Lido** - ETH staking protocol
- **ERC-20** - Token standard

## AI Agent Functions 🤖

LeftAI uses function calling to execute blockchain operations:

### 1. **Transfer Funds** (`transfer_funds`)
```javascript
Input: "Send $10 to @Alice Johnson"
AI Calls: transfer_funds(destinationAddress, amount: "10", tokenSymbol: "USDC")
Result: Transfers 10 USDC to Alice's wallet
```

### 2. **Request Payment** (`request_payment`)
```javascript
Input: "I paid $60 for dinner with @Bob and @Carol, split it equally"
AI Calls: request_payment(fromAddresses: [Bob, Carol], individualAmounts: {Bob: 20, Carol: 20}, tokenSymbol: "USDC")
Result: Sends payment requests to Bob and Carol for 20 USDC each
```

### 3. **Stake ETH** (`stake_eth`)
```javascript
Input: "I want to stake 0.5 ETH to earn rewards"
AI Calls: stake_eth(amount: "0.5")
Result: Stakes 0.5 ETH via Lido, receives stETH
```

## Key Features Implementation 💻

### Contact System
- **Autocomplete**: Type `@` to search contacts
- **Auto-resolve**: Frontend replaces `@Alice Johnson` with `0x1C4e...D6C6`
- **Cursor-like UX**: Dropdown with fuzzy search

### Currency Conversion
- **USD notation**: `$10` automatically converts to `10 USDC`
- **1:1 ratio**: Simple mental math
- **Multiple tokens**: Supports USDC, ETH, USDT

### Reputation System
- **Address lookup**: Check any address reputation score
- **Flag system**: Flag suspicious addresses
- **Upvote system**: Upvote trusted addresses
- **Trust levels**: Trusted, Neutral, Caution, Flagged

### AI Processing Flow
```
User Input → Contact/USD Replacement → RedPill AI → Function Call → Validation → Confirmation UI → MetaMask → Blockchain
```

## Important Endpoints 📍

### Frontend API Routes
- **AI Chat Processing**  
  `/pages/api/chat.js`

- **Reputation System**  
  `/pages/api/reputation.js`

- **Notification System**  
  `/pages/api/notifications.js`

### LLM Actions (AI Functions)
- **Transfer Logic**  
  `/lib/llmActions/executeTransfer.js`

- **Payment Requests**  
  `/lib/llmActions/requestPayment.js`

- **ETH Staking**  
  `/lib/llmActions/stakeEth.js`

- **Function Registry**  
  `/lib/llmActions/index.js`

### Reputation System
- **Reputation Library**  
  `/lib/reputation.js`

## Project Structure 📁

```
token2049/
├── frontend/                 # Next.js application
│   ├── components/          # React components
│   │   ├── navbar.js       # Navigation with balance modal
│   │   ├── reputation-badge.js  # Trust indicator
│   │   ├── scam-warning.js      # Flagged address warning
│   │   ├── contact-autocomplete.js
│   │   └── notification-toast.js
│   ├── pages/
│   │   ├── index.js        # Landing page with demo
│   │   ├── chat.js         # Main chat interface
│   │   ├── reputation.js   # Reputation management
│   │   └── api/            # API routes
│   ├── lib/
│   │   ├── llmActions/     # AI function definitions
│   │   ├── reputation.js   # Reputation system
│   │   ├── currencyUtils.js
│   │   └── swapUtils.js
│   ├── hooks/
│   │   └── useContacts.js
│   ├── public/
│   │   └── data/
│   │       └── contacts.json
│   └── .env.local          # Environment variables
│
└── contract/                # Smart contracts
    ├── contracts/
    └── scripts/
```

## Testing Guide 🧪

### Test Prompts

1. **Send Funds**
   ```
   Send $0.01 to @Alice Johnson
   ```

2. **Split Bills**
   ```
   I paid $60 for dinner with @Bob Smith and @Carol Lee, split it equally
   ```

3. **Stake ETH**
   ```
   I want to stake 0.1 ETH to earn rewards
   ```

## Deployment 🚢

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

**Web3 DApp:**
- Built for Ethereum ecosystem
- Works as a Progressive Web App (PWA)
- Supports MetaMask, WalletConnect, and other Web3 wallets via RainbowKit

## Hackathon Features 🏆

### Ergo-Inspired Reputation System
- **Address reputation scores** based on transaction history
- **Scam flag system** for reporting suspicious addresses
- **Trust-based filtering** with visual indicators
- Inspired by [Ergo Forum Reputation System](https://github.com/reputation-systems/forum-application)

---

**Built for the Unstoppable Hackathon - Innovation Track**