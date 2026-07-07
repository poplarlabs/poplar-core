#!/bin/bash

# Check if anvil is installed
if ! command -v anvil &> /dev/null
then
    echo "anvil could not be found. Please install Foundry to continue."
    exit 1
fi

# Start anvil in the background on port 8545
echo "Starting anvil on port 8545..."
anvil -p 8545 &
ANVIL_PID=$!
echo "Anvil started with PID $ANVIL_PID."

# Give anvil a moment to fully start
sleep 3

# Deploy contracts
echo "Deploying contracts..."
cd contracts || exit 1
forge clean
# Provide the default anvil private key as a fallback
ANVIL_DEFAULT_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
# Use PRIVATE_KEY env var if set, otherwise use the default Anvil key
KEY_TO_USE=${PRIVATE_KEY:-$ANVIL_DEFAULT_PRIVATE_KEY}
echo "Using private key ending with: ${KEY_TO_USE: -4}" # Log last 4 chars for verification
# Add --ffi to allow vm.writeFile
forge script script/Deploy.s.sol --broadcast --rpc-url http://localhost:8545 --private-key $KEY_TO_USE --ffi
cd ..

# Navigate to the backend directory
cd backend || exit 1

# Create and activate virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing backend dependencies..."
    pip install -r requirements.txt
fi

# Return to app directory before starting backend
cd ..

# Start the backend server in the background as a module
echo "Starting backend server..."
# Use mock DB for dev script
export USE_MOCK_DB=true
python -m backend.main &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID."

# Navigate to the frontend directory
cd frontend || exit 1

# Install dependencies if node_modules does not exist
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    yarn install
fi

# Start the Vite development server
echo "Starting frontend development server..."
yarn run dev

# Cleanup: Kill the anvil process once the frontend server is stopped
kill $ANVIL_PID

# Cleanup: Kill the backend server once the frontend server is stopped
kill $BACKEND_PID
