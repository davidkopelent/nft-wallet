# Cardano Wallet Explorer

Cardano Wallet Explorer is a modern web application that allows users to explore Cardano blockchain wallets and their associated assets, NFTs, and transactions using the Blockfrost API.

## Features

- **Wallet Overview**: View detailed wallet information including balance in both ADA and USD
- **Staking Information**: See if the wallet is staking ADA, which pool it's delegated to, and total rewards earned
- **NFT Gallery**: Browse the wallet's NFT collection with both grid and list views
  - Filter and search NFTs by name or policy ID
  - View detailed NFT information including attributes, policy ID, and asset name
- **Transaction History**: View and explore all wallet transactions
  - Expandable transaction rows to see detailed information
  - Links to external block explorers for further investigation
- **Responsive Design**: Works seamlessly on mobile and desktop devices
- **Dark Mode Support**: Toggle between light and dark themes with preferences saved to localStorage

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Typed JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Blockfrost API**: API to retrieve Cardano blockchain data

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/davidkopelent/nft-wallet.git
cd nft-wallet
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Blockfrost API key:

```bash
BLOCKFROST_API_KEY=your_blockfrost_api_key
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

1. Enter a Cardano wallet address in the search box on the homepage
2. View the wallet overview, NFT collection, and transaction history
3. Toggle between light and dark mode using the theme switch button in the top right corner
4. Click on any NFT to see detailed information in a modal
5. Click on any transaction to see detailed information and links to external explorers

## Project Structure

```bash
├── src/
│ ├── app/ # Next.js app router pages
│ ├── components/ # React components
│ │ ├── modals/ # Modal components
│ │ └── ui/ # Reusable UI components
│ ├── context/ # React context (e.g., theme)
│ ├── lib/ # API and utility functions
│ ├── types/ # TypeScript type definitions
│ └── utils/ # Helper functions
├── public/ # Static assets
└── tailwind.config.js # Tailwind CSS configuration
```

## API Endpoints

The application uses the following Blockfrost API endpoints:

- **Wallet Information**:
  - `GET /api/wallet/:address`
  - `GET /api/wallet/:address/transactions`
  - `GET /api/wallet/:address/nfts`
  - `GET /api/wallet/:address/staking`
