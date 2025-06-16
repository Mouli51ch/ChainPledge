# 🚀 ChainPledge - Decentralized Commitment Platform

Welcome to the ChainPledge frontend, a decentralized application built on the Aptos Blockchain. This platform empowers users to create, track, and fulfill personal commitments by staking APT tokens, ensuring accountability and transparency through smart contracts.

---

## 🔗 Links
- **Live Demo:** [ChainPledge dApp](http://localhost:3000)
- **Smart Contract Explorer:** [Aptos Explorer](https://explorer.aptoslabs.com/account/0xe5ef0bea5d9b07a1e45a83f76545a8d68e52ee5fcf0f02aa91c23aea9a85c5ef?network=devnet)

---

## ✨ Key Features
- **Create Pledges:** Users can create personal commitments with a description, deadline, and APT stake.
- **Stake APT Tokens:** Stake real APT tokens to back your promise.
- **Track Progress:** View your active and completed pledges on-chain.
- **Automatic Resolution:** If you complete your pledge, reclaim your stake. If not, your stake is sent to a burn address.
- **Blockchain Security:** All operations are executed securely on the Aptos blockchain through smart contracts.
- **Modern UI:** Responsive, user-friendly interface built with Next.js and Tailwind CSS.

---

## 📋 Prerequisites
Ensure the following are installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Aptos Wallet** (e.g., Petra Wallet) for blockchain interactions

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```sh
git clone <repository-url>
cd chainpledge-dapp
```

### 2. Install Dependencies
```sh
npm install --legacy-peer-deps
```

### 3. Configure Environment (if needed)
- No special environment variables are required for basic devnet usage.
- The contract address is hardcoded for devnet: `0xe5ef0bea5d9b07a1e45a83f76545a8d68e52ee5fcf0f02aa91c23aea9a85c5ef`.

### 4. Run the Development Server
```sh
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000) (or the next available port).

### 5. Deploy the Smart Contract (if needed)
- Install Aptos CLI.
- Update `move/Move.toml` with your wallet address if deploying a new contract.
- Compile and publish:
  ```sh
  cd move
  aptos move compile
  aptos move publish
  ```

---

## 🛠 How to Use the Platform

### 1. Connect Wallet
Connect your Aptos Wallet (e.g., Petra Wallet) to interact with the blockchain. This allows you to create pledges and manage your commitments securely.

### 2. Create a Pledge
- Go to the **Create Pledge** page.
- Enter your commitment description, deadline, and stake amount.
- Submit the pledge and approve the transaction in your wallet.

### 3. Track and Complete Pledges
- View your active pledges on the **My Pledges** page.
- Mark a pledge as completed before the deadline to reclaim your stake.
- If the deadline passes and the pledge is not completed, your stake is sent to a burn address.

---

## 📊 Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm test`: Run unit tests (if available).

---

## 🔍 Dependencies
- **React**: Library for building user interfaces.
- **Next.js**: React framework for SSR and routing.
- **TypeScript**: Type-safe JavaScript.
- **Aptos SDK**: JS/TS SDK for interacting with the Aptos blockchain.
- **Tailwind CSS**: For modern, responsive UI design.
- **Petra Wallet Adapter**: For seamless wallet connection and blockchain interaction.

---

## 📚 Available Smart Contract Functions
- **initialize(account: &signer):** Initialize the pledge store for a user.
- **create_pledge(account: &signer, description: String, stake: u64, deadline: u64):** Create a new pledge.
- **mark_completed(account: &signer):** Mark a pledge as completed.
- **withdraw_or_burn(account: &signer):** Resolve a pledge (refund or burn tokens).
- **get_pledge(account: address): PledgeView:** Get pledge information for a user.

**Contract Address:**
```
0xe5ef0bea5d9b07a1e45a83f76545a8d68e52ee5fcf0f02aa91c23aea9a85c5ef::pledge
```

---

## 🛡 Security and Transparency
- **Smart Contracts:** All operations are executed securely on-chain.
- **No Intermediaries:** Transactions occur directly between users and the contract.
- **Real-Time Updates:** View pledge status and transaction history in real-time.

---

## 🌐 Common Issues and Solutions
- **Wallet Connection Issues:** Ensure the wallet extension is installed and active.
- **RPC Rate Limits:** Use private RPC providers if you encounter network limits.
- **Transaction Errors:** Verify wallet balances and permissions before transactions.
- **Permission Errors:** If you see file permission errors, restart your terminal as administrator and delete the `.next` directory.

---

## 🚀 Scaling and Deployment
- Use third-party RPC providers like Alchemy or QuickNode for production.
- Implement request throttling to prevent overload.
- Utilize WebSockets for real-time updates.

---

## 🎉 Conclusion
ChainPledge provides a decentralized, transparent way for users to manage personal commitments and goals. With secure smart contracts and real-time tracking, the platform ensures a seamless and accountable experience for all users.

---

<div align="center">
  <p>Made with ❤️ by the ChainPledge Team</p>
  <p>Built on <strong>Aptos</strong> | Powered by <strong>Move</strong></p>
</div> 