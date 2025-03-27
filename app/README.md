# Poplar

A decentralized protocol for secure property record management built on Base.

## Overview
Poplar leverages blockchain technology to bring transparency, security, and efficiency to property records. By decentralizing data submission and on-chain verification, Poplar eliminates centralized control, reduces fraud, and streamlines property record management.

## Key Features for the MVP
- **Secure Data Submission:** Contributors submit property records with token staking (using Poplar Token - PCT) to ensure data authenticity.
- **On-Chain Verification:** Independent verifiers validate data through a consensus mechanism, ensuring records are accurate and tamper-resistant.
- **User-Friendly Interface:** A dApp that provides transparent and accessible property data.
- **Token-Based Incentives:** A built-in economic model rewards accurate contributions and penalizes fraudulent submissions.
- **Dispute Resolution:** A fallback mechanism enabling users to flag and resolve discrepancies efficiently.
- **Off-chain Storage:** IPFS integration for handling large documents with on-chain hash linking.

## Roadmap
1. **Phase 1:** Deploy smart contracts on Base testnet and pilot initial property record submissions.
2. **Phase 2:** Launch on mainnet with full on-chain verification and dApp functionality.
3. **Phase 3:** Enhance dispute resolution, user experience, and expand data access features.

For a detailed breakdown of the requirements and modules for our MVP, please see the [Poplar PRD](./requirements/prd.md).

## Smart Contracts & Libraries

We are leveraging OpenZeppelin, a widely adopted and trusted Solidity library, to build secure smart contracts. The ROOT token, implemented as an ERC20 token via the RootToken.sol contract, is based on OpenZeppelin's ERC20 standard. This contract mints an initial supply to the deployer and serves as the native token for the Poplar ecosystem.

## Local Development Setup

To run the entire system locally, follow these steps:

1. Ensure you have Foundry installed (which includes anvil).
2. From the root directory (app/), run the provided start script:

   ```bash
   ./start-dev.sh
   ```

This script will:
- Start anvil on port 8545 as a local blockchain for testing.
- Navigate to the frontend directory, install dependencies (if needed), and launch the Vite development server.

When you terminate the frontend server, the script will automatically stop the anvil process.

Happy Developing!

# Smart Contract Development Environment

This project consists of three main components:
- Smart Contracts (Foundry/Solidity)
- Backend API (FastAPI/Python)
- Frontend (JavaScript/React)

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Python 3.8+
- Node.js 16+
- [Anvil](https://book.getfoundry.sh/anvil/) (comes with Foundry)

## Initial Setup

1. **Clone and Install Dependencies**
```bash
# Install Foundry dependencies
forge install

# Setup Python backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Setup Frontend
cd frontend
npm install
cd ..
```

2. **Environment Configuration**

Create the following `.env` files:

```bash
# In root directory (.env)
NETWORK=local  # Options: local, sepolia, mainnet
ALCHEMY_API_KEY=your_key_here  # Required for testnet/mainnet

# In backend/.env
NETWORK=local

# In frontend/.env
REACT_APP_NETWORK=local
```

## Running the Development Environment

1. **Start Local Blockchain**
```bash
# Start Anvil in a separate terminal
anvil
```

2. **Deploy Contracts**
```bash
# Deploy to local network
forge script script/Deploy.s.sol --broadcast --rpc-url http://localhost:8545
```

3. **Start Backend Server**
```bash
# In a new terminal
cd backend
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
uvicorn src.main:app --reload
```

4. **Start Frontend**
```bash
# In a new terminal
cd frontend
npm start
```

The application should now be running at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Local Blockchain: http://localhost:8545

## Deployment Process

### Local Development
The above setup will work for local development. Contract addresses are automatically tracked in the `deployments/local/` directory.

### Testnet (Sepolia)
1. Update environment variables:
```bash
# .env
NETWORK=sepolia
ALCHEMY_API_KEY=your_key_here
PRIVATE_KEY=your_private_key  # Account with Sepolia ETH
```

2. Deploy contracts:
```bash
forge script script/Deploy.s.sol --broadcast --rpc-url sepolia
```

### Mainnet
1. Update environment variables:
```bash
# .env
NETWORK=mainnet
ALCHEMY_API_KEY=your_key_here
PRIVATE_KEY=your_private_key  # Account with real ETH
```

2. Deploy contracts:
```bash
# Simulate first
forge script script/Deploy.s.sol --fork-url mainnet

# If simulation successful, deploy
forge script script/Deploy.s.sol --broadcast --rpc-url mainnet
```

## Project Structure

```
app/
├── contracts/          # Solidity smart contracts
├── script/            # Deployment scripts
├── backend/
│   └── src/
│       ├── config/    # Contract configuration
│       ├── routes/    # API endpoints
│       └── main.py    # FastAPI application
├── frontend/          # React frontend
├── deployments/       # Deployed contract addresses
│   ├── local/
│   ├── sepolia/
│   └── mainnet/
└── config/
    └── networks.json  # Network configurations
```

## Common Tasks

### Adding a New Contract
1. Create contract in `contracts/`
2. Add deployment script in `script/`
3. Deploy using appropriate forge script command
4. Contract address will automatically be available to backend/frontend

### Switching Networks
1. Update NETWORK in all .env files
2. Restart backend and frontend
3. Contract addresses will automatically update

### Troubleshooting
- **Contract Not Found**: Check `deployments/<network>/` for contract JSON file
- **Backend 404**: Ensure contract is deployed to current network
- **Frontend Connection**: Check CORS settings in backend/src/main.py

## API Documentation
Once the backend is running, visit http://localhost:8000/docs for interactive API documentation.

## Docker Development Setup

For an easier development setup, you can use Docker Compose to run all components with a single command. This setup includes hot reloading for all services.

### Prerequisites
- Docker
- Docker Compose

### Running with Docker

1. **Start all services**
```bash
docker compose up
```

This will start:
- Anvil blockchain at http://localhost:8545 (with contracts automatically deployed)
- Backend API at http://localhost:8000
- Frontend at http://localhost:5173

The Anvil container will:
1. Start a local blockchain
2. Wait for the network to be ready
3. Automatically deploy all contracts
4. Keep running for development

2. **View logs for a specific service**
```bash
docker compose logs -f [service_name]  # anvil, backend, or frontend
```

3. **Rebuild services after dependency changes**
```bash
docker compose build
```

4. **Stop all services**
```bash
docker compose down
```

The Docker setup includes:
- Volume mounts for hot reloading of code changes
- Proper service dependencies and health checks
- Isolated development environment
- Cached node_modules and Python packages

Note: The Docker setup is intended for local development only. For production deployment, refer to the standard deployment process above.
