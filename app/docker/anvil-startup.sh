#!/bin/bash

# Start Anvil in the background
anvil --host 0.0.0.0 &

# Store the Anvil process ID
ANVIL_PID=$!

# Function to check if Anvil is ready
check_anvil() {
    curl -s -X POST -H "Content-Type: application/json" \
         --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
         http://localhost:8545 > /dev/null
    return $?
}

# Wait for Anvil to be ready
echo "Waiting for Anvil to start..."
while ! check_anvil; do
    sleep 1
done
echo "Anvil is ready!"

# Deploy contracts
echo "Deploying contracts..."
forge script script/Deploy.s.sol --broadcast --rpc-url http://localhost:8545

# Keep the script running by waiting on Anvil process
wait $ANVIL_PID
