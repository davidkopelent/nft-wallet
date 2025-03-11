# Cardano Wallet Explorer

Cardano Wallet Explorer is a web application for JamOnBread interview assignment that allows users to explore Cardano blockchain wallets and their associated assets, NFTs, and transactions using the Blockfrost API.

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

## Usage

1. Enter a Cardano wallet address in the search box on the homepage
2. View the wallet overview, NFT collection, and transaction history
3. Click on any NFT to see detailed information in a modal
4. Click on View all transactions to see all transactions for the wallet in a modal
5. Click on any transaction to see detailed information and links to external explorers

## Technologies Used

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Blockfrost API**

## Project Structure

```bash
├── src/
│ ├── app/ # Next.js app router pages
│ ├── components/ # React components
│ │ ├── modals/ # Modal components
│ │ └── ui/ # Reusable UI components
│ ├── context/ # React context (e.g., theme)
│ ├── hooks/ # Custom hooks
│ ├── lib/ # API and utility functions
│ ├── types/ # TypeScript type definitions
│ └── utils/ # Helper functions
├── public/ # Static assets
```
