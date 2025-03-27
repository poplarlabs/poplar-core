#!/bin/bash

# Check if anvil is installed
if ! command -v anvil &> /dev/null
then
    echo "anvil could not be found. Please install Foundry to continue."
    exit 1
fi

# Start anvil in the background on port 8545
echo "Starting anvil on port 8545..."
anvil -p 8545 > anvil.log 2>&1 &
ANVIL_PID=$!
echo "Anvil started with PID $ANVIL_PID."

# Give anvil a moment to fully start
sleep 3

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
