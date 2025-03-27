#!/bin/bash

# Kill any existing anvil process
pkill anvil

# Start anvil in the background
anvil > anvil.log 2>&1 &

# Wait for anvil to start
sleep 2

# Set the private key of the first anvil account
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Run the deploy script
forge script script/Deploy.s.sol --broadcast

# Update the contract addresses in the frontend
ADDRESSES=$(forge script script/Deploy.s.sol --silent)
ROOT_ADDRESS=$(echo "$ADDRESSES" | grep "ROOT token deployed at:" | awk '{print $4}')
POPLAR_ADDRESS=$(echo "$ADDRESSES" | grep "Poplar contract deployed at:" | awk '{print $4}')

# Update the frontend contract addresses
sed -i '' "s|ROOT_TOKEN_ADDRESS = '[^']*'|ROOT_TOKEN_ADDRESS = '$ROOT_ADDRESS'|" ../frontend/src/contracts.ts
sed -i '' "s|POPLAR_CONTRACT_ADDRESS = '[^']*'|POPLAR_CONTRACT_ADDRESS = '$POPLAR_ADDRESS'|" ../frontend/src/contracts.ts

echo "Setup complete!"
echo "ROOT token address: $ROOT_ADDRESS"
echo "Poplar contract address: $POPLAR_ADDRESS" 