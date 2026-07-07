"""
UMA Optimistic Oracle V3 Python Integration
Complete implementation for asserting truths and managing the assertion lifecycle
"""

import os
import json
import time
from typing import Dict, Any, Optional, Tuple
from web3 import Web3
from web3.contract import Contract
from web3.types import TxReceipt, HexBytes
from eth_account import Account
from eth_account.signers.local import LocalAccount
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class UMAOptimisticOracleV3:
    """Interface for UMA's Optimistic Oracle V3"""
    
    # Contract addresses by network
    ADDRESSES = {
        'mainnet': '0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE',  # Ethereum Mainnet
        'sepolia': '0x0e2A12A52Ba90c76ED8EaC8d0b88B31960217EB2',  # Sepolia Testnet
        'optimism': '0x072819Bb43B50E7A251c64411e7aA362ce82803B',  # Optimism Mainnet
        'polygon': '0x5953f2538F613E05bAED8A5AeFa8e6622467AD3D',  # Polygon Mainnet
        'arbitrum': '0xa6147867264374F324524E30C02C331cF28aa879',  # Arbitrum One
    }
    
    # Minimal ABI for OOV3
    ABI = json.loads('''[
        {
            "name": "assertTruth",
            "type": "function",
            "inputs": [
                {"name": "claim", "type": "bytes"},
                {"name": "asserter", "type": "address"},
                {"name": "callbackRecipient", "type": "address"},
                {"name": "escalationManager", "type": "address"},
                {"name": "liveness", "type": "uint64"},
                {"name": "currency", "type": "address"},
                {"name": "bond", "type": "uint256"},
                {"name": "identifier", "type": "bytes32"},
                {"name": "domainId", "type": "bytes32"}
            ],
            "outputs": [{"name": "assertionId", "type": "bytes32"}],
            "stateMutability": "nonpayable"
        },
        {
            "name": "assertTruthWithDefaults",
            "type": "function",
            "inputs": [
                {"name": "claim", "type": "bytes"},
                {"name": "asserter", "type": "address"}
            ],
            "outputs": [{"name": "assertionId", "type": "bytes32"}],
            "stateMutability": "nonpayable"
        },
        {
            "name": "getAssertion",
            "type": "function",
            "inputs": [{"name": "assertionId", "type": "bytes32"}],
            "outputs": [
                {"name": "asserter", "type": "address"},
                {"name": "assertionTime", "type": "uint64"},
                {"name": "settled", "type": "bool"},
                {"name": "currency", "type": "address"},
                {"name": "expirationTime", "type": "uint64"},
                {"name": "settlementResolution", "type": "bool"},
                {"name": "domainId", "type": "bytes32"},
                {"name": "identifier", "type": "bytes32"},
                {"name": "bond", "type": "uint256"},
                {"name": "callbackRecipient", "type": "address"},
                {"name": "disputer", "type": "address"}
            ],
            "stateMutability": "view"
        },
        {
            "name": "settleAssertion",
            "type": "function",
            "inputs": [{"name": "assertionId", "type": "bytes32"}],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "name": "disputeAssertion",
            "type": "function",
            "inputs": [
                {"name": "assertionId", "type": "bytes32"},
                {"name": "disputer", "type": "address"}
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "name": "getMinimumBond",
            "type": "function",
            "inputs": [{"name": "currency", "type": "address"}],
            "outputs": [{"name": "", "type": "uint256"}],
            "stateMutability": "view"
        },
        {
            "name": "defaultCurrency",
            "type": "function",
            "inputs": [],
            "outputs": [{"name": "", "type": "address"}],
            "stateMutability": "view"
        },
        {
            "name": "defaultLiveness",
            "type": "function",
            "inputs": [],
            "outputs": [{"name": "", "type": "uint64"}],
            "stateMutability": "view"
        },
        {
            "name": "defaultIdentifier",
            "type": "function",
            "inputs": [],
            "outputs": [{"name": "", "type": "bytes32"}],
            "stateMutability": "view"
        }
    ]''')
    
    def __init__(self, 
                 network: str = 'sepolia',
                 rpc_url: Optional[str] = None,
                 private_key: Optional[str] = None):
        """
        Initialize UMA OOV3 interface
        
        Args:
            network: Network name ('mainnet', 'sepolia', 'optimism', 'polygon', 'arbitrum')
            rpc_url: RPC endpoint URL (optional, uses default if not provided)
            private_key: Private key for signing transactions (optional)
        """
        self.network = network
        self.rpc_url = rpc_url or self._get_default_rpc(network)
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        if not self.w3.is_connected():
            raise ConnectionError(f"Failed to connect to {network} at {self.rpc_url}")
        
        # Set up account if private key provided
        self.account: Optional[LocalAccount] = None
        if private_key:
            self.account = Account.from_key(private_key)
            self.w3.eth.default_account = self.account.address
        
        # Initialize contract
        contract_address = self.ADDRESSES.get(network)
        if not contract_address:
            raise ValueError(f"Unknown network: {network}")
        
        self.contract: Contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(contract_address),
            abi=self.ABI
        )
        
        print(f"Connected to UMA OOV3 on {network}")
        print(f"Contract: {contract_address}")
        if self.account:
            print(f"Account: {self.account.address}")
    
    def _get_default_rpc(self, network: str) -> str:
        """Get default RPC URL for network"""
        default_rpcs = {
            'mainnet': f"https://mainnet.infura.io/v3/{os.getenv('INFURA_KEY', '')}",
            'sepolia': f"https://sepolia.infura.io/v3/{os.getenv('INFURA_KEY', '')}",
            'optimism': 'https://mainnet.optimism.io',
            'polygon': 'https://polygon-rpc.com',
            'arbitrum': 'https://arb1.arbitrum.io/rpc'
        }
        return default_rpcs.get(network, '')
    
    def get_defaults(self) -> Dict[str, Any]:
        """Get default parameters from OOV3"""
        return {
            'currency': self.contract.functions.defaultCurrency().call(),
            'liveness': self.contract.functions.defaultLiveness().call(),
            'identifier': self.contract.functions.defaultIdentifier().call().hex()
        }
    
    def get_minimum_bond(self, currency: Optional[str] = None) -> int:
        """Get minimum bond amount for currency"""
        if not currency:
            currency = self.contract.functions.defaultCurrency().call()
        return self.contract.functions.getMinimumBond(currency).call()
    
    def assert_truth(self, 
                    claim: str,
                    bond: Optional[int] = None,
                    liveness: Optional[int] = None,
                    currency: Optional[str] = None) -> str:
        """
        Assert a truth claim to the oracle
        
        Args:
            claim: The claim text to assert
            bond: Bond amount (uses minimum if not specified)
            liveness: Challenge period in seconds (uses default if not specified)
            currency: Currency address for bond (uses default if not specified)
            
        Returns:
            Transaction hash
        """
        if not self.account:
            raise ValueError("Private key required for assertions")
        
        # Get defaults if not provided
        defaults = self.get_defaults()
        currency = currency or defaults['currency']
        liveness = liveness or defaults['liveness']
        
        if not bond:
            bond = self.get_minimum_bond(currency)
        
        # Encode claim as bytes
        claim_bytes = claim.encode('utf-8')
        
        # Build transaction
        tx = self.contract.functions.assertTruth(
            claim_bytes,
            self.account.address,  # asserter
            '0x0000000000000000000000000000000000000000',  # no callback
            '0x0000000000000000000000000000000000000000',  # no escalation manager
            liveness,
            currency,
            bond,
            bytes.fromhex(defaults['identifier'][2:]),  # identifier (ASSERT_TRUTH)
            bytes(32)  # empty domain
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 500000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        # Sign and send
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        print(f"Assertion submitted: {tx_hash.hex()}")
        return tx_hash.hex()
    
    def assert_with_defaults(self, claim: str) -> Tuple[str, str]:
        """
        Assert using all default parameters (simplest method)
        
        Args:
            claim: The claim text to assert
            
        Returns:
            Tuple of (transaction_hash, assertion_id)
        """
        if not self.account:
            raise ValueError("Private key required for assertions")
        
        # Encode claim
        claim_bytes = claim.encode('utf-8')
        
        # Build transaction
        tx = self.contract.functions.assertTruthWithDefaults(
            claim_bytes,
            self.account.address
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 300000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        # Sign and send
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        print(f"Assertion submitted: {tx_hash.hex()}")
        
        # Wait for confirmation and get assertion ID from event
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        # Extract assertion ID from logs (simplified - actual implementation needs event parsing)
        assertion_id = receipt['logs'][0]['topics'][1].hex() if receipt['logs'] else None
        
        return tx_hash.hex(), assertion_id
    
    def get_assertion(self, assertion_id: str) -> Dict[str, Any]:
        """Get assertion details"""
        assertion_bytes = bytes.fromhex(assertion_id[2:] if assertion_id.startswith('0x') else assertion_id)
        result = self.contract.functions.getAssertion(assertion_bytes).call()
        
        return {
            'asserter': result[0],
            'assertionTime': result[1],
            'settled': result[2],
            'currency': result[3],
            'expirationTime': result[4],
            'settlementResolution': result[5],
            'domainId': result[6].hex(),
            'identifier': result[7].hex(),
            'bond': result[8],
            'callbackRecipient': result[9],
            'disputer': result[10]
        }
    
    def settle_assertion(self, assertion_id: str) -> str:
        """
        Settle an assertion after liveness period
        
        Args:
            assertion_id: The assertion ID to settle
            
        Returns:
            Transaction hash
        """
        if not self.account:
            raise ValueError("Private key required for settling")
        
        assertion_bytes = bytes.fromhex(assertion_id[2:] if assertion_id.startswith('0x') else assertion_id)
        
        tx = self.contract.functions.settleAssertion(
            assertion_bytes
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 200000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        print(f"Settlement submitted: {tx_hash.hex()}")
        return tx_hash.hex()
    
    def dispute_assertion(self, assertion_id: str) -> str:
        """
        Dispute an assertion
        
        Args:
            assertion_id: The assertion ID to dispute
            
        Returns:
            Transaction hash
        """
        if not self.account:
            raise ValueError("Private key required for disputing")
        
        assertion_bytes = bytes.fromhex(assertion_id[2:] if assertion_id.startswith('0x') else assertion_id)
        
        tx = self.contract.functions.disputeAssertion(
            assertion_bytes,
            self.account.address
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 300000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        print(f"Dispute submitted: {tx_hash.hex()}")
        return tx_hash.hex()
    
    def wait_for_liveness(self, assertion_id: str):
        """Wait for liveness period to expire"""
        assertion = self.get_assertion(assertion_id)
        expiration = assertion['expirationTime']
        current_time = int(time.time())
        
        if current_time < expiration:
            wait_time = expiration - current_time
            print(f"Waiting {wait_time} seconds for liveness period...")
            time.sleep(wait_time + 5)  # Add buffer
    
    def approve_bond_token(self, amount: int, currency: Optional[str] = None):
        """
        Approve OOV3 to spend bond tokens
        
        Args:
            amount: Amount to approve
            currency: Token address (uses default if not specified)
        """
        if not self.account:
            raise ValueError("Private key required")
        
        currency = currency or self.contract.functions.defaultCurrency().call()
        
        # ERC20 approve ABI
        erc20_abi = json.loads('''[{
            "name": "approve",
            "type": "function",
            "inputs": [
                {"name": "spender", "type": "address"},
                {"name": "amount", "type": "uint256"}
            ],
            "outputs": [{"name": "", "type": "bool"}],
            "stateMutability": "nonpayable"
        }]''')
        
        token_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(currency),
            abi=erc20_abi
        )
        
        tx = token_contract.functions.approve(
            self.contract.address,
            amount
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 100000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        print(f"Approval submitted: {tx_hash.hex()}")
        return tx_hash.hex()


def example_assertion_flow():
    """
    Complete example flow: Assert -> Wait -> Settle
    """
    # Initialize (use your own RPC and private key)
    oracle = UMAOptimisticOracleV3(
        network='sepolia',
        rpc_url=os.getenv('RPC_URL'),
        private_key=os.getenv('PRIVATE_KEY')
    )
    
    # 1. Check defaults
    defaults = oracle.get_defaults()
    print(f"Default parameters: {defaults}")
    
    # 2. Get minimum bond
    min_bond = oracle.get_minimum_bond()
    print(f"Minimum bond: {min_bond}")
    
    # 3. Approve bond tokens (if needed)
    # oracle.approve_bond_token(min_bond)
    
    # 4. Make an assertion
    claim = "Bitcoin price is above $50,000 on January 1, 2025"
    tx_hash, assertion_id = oracle.assert_with_defaults(claim)
    print(f"Assertion ID: {assertion_id}")
    
    # 5. Check assertion status
    assertion = oracle.get_assertion(assertion_id)
    print(f"Assertion details: {assertion}")
    
    # 6. Wait for liveness period
    oracle.wait_for_liveness(assertion_id)
    
    # 7. Settle the assertion
    settle_tx = oracle.settle_assertion(assertion_id)
    print(f"Settlement transaction: {settle_tx}")
    
    # 8. Check final status
    final_assertion = oracle.get_assertion(assertion_id)
    print(f"Final status: Settled={final_assertion['settled']}, Resolution={final_assertion['settlementResolution']}")


if __name__ == "__main__":
    # Run example flow
    example_assertion_flow()