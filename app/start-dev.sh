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
forge script script/Deploy.s.sol --broadcast --rpc-url http://localhost:8545
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

# Start the backend server in the background
echo "Starting backend server..."
python main.py &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID."

# Return to root directory
cd ..

# Wait for user input before starting frontend
read -p "Press Enter to start the frontend server..."


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
