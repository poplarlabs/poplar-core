# UMA Optimistic Oracle V3 Python Integration

This module provides a Python interface for UMA's Optimistic Oracle V3, allowing you to assert truths, manage assertions, and interact with the oracle lifecycle.

**Why this exists**: the current plan ([requirements/plan-v2.md](../requirements/plan-v2.md)) builds Poplar's gateway on optimistic attestations — bond, challenge window, arbitration. UMA's Optimistic Oracle is the proven prior art for that mechanism; this module is the experiment evaluating it as candidate rails.

## Setup

### Option 1: Using uv (Recommended)

1. Install uv if you haven't already:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. Navigate to the uma directory:
   ```bash
   cd uma
   ```

3. Create a virtual environment and install dependencies:
   ```bash
   uv venv
   uv pip install -r requirements.txt
   ```

4. Activate the virtual environment:
   ```bash
   source .venv/bin/activate  # On macOS/Linux
   # or
   .venv\Scripts\activate     # On Windows
   ```

### Option 2: Using venv

1. Navigate to the uma directory:
   ```bash
   cd uma
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate     # On Windows
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your configuration:
   - `RPC_URL`: Your Ethereum RPC endpoint
   - `INFURA_KEY`: Your Infura project ID (if using Infura)
   - `PRIVATE_KEY`: Your wallet's private key
   - `NETWORK`: Target network (default: sepolia)

## Usage

Run the example flow:
```bash
python uma.py
```

Or import and use in your own code:
```python
from uma import UMAOptimisticOracleV3

oracle = UMAOptimisticOracleV3(
    network='sepolia',
    rpc_url='your_rpc_url',
    private_key='your_private_key'
)

# Make an assertion
tx_hash, assertion_id = oracle.assert_with_defaults("Your claim here")
```

## Supported Networks

- Ethereum Mainnet
- Sepolia Testnet  
- Optimism Mainnet
- Polygon Mainnet
- Arbitrum One

## Features

- ✅ Assert truths to the oracle
- ✅ Settle assertions after liveness period
- ✅ Dispute assertions
- ✅ Query assertion details
- ✅ Bond token approval
- ✅ Default parameter management
