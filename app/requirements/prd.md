# Poplar Product Requirement Document (PRD)

## Abstract
Poplar is a decentralized protocol aimed at revolutionizing property record management by leveraging blockchain technology on Base, an Ethereum Layer 2 solution. It ensures secure, transparent, and immutable record keeping through on-chain consensus and a token‐based incentive system.

## Overview
Traditional property record systems are centralized, inefficient, and vulnerable to fraud. Poplar addresses these challenges by decentralizing data submission, on-chain verification, and record access. For the MVP, all verification is performed on-chain by a network of verifiers, with no reliance on off-chain oracles.

## MVP Scope
The MVP focuses on core functionalities:
- Secure data submission by contributors, backed by token staking.
- On-chain data verification via consensus among verifiers.
- Transparent and accessible property records through a user-friendly dApp.
- A token-based incentive mechanism with the Poplar Token (ROOT) for staking, rewards, and penalties.
- A dispute resolution mechanism for challenging erroneous or fraudulent entries.

## Required Modules
1. **Data Submission Module**
   - Enables property owners, agents, and surveyors to submit property records.
   - Requires staking of ROOT as a security deposit to deter fraudulent submissions.

2. **On-Chain Verification Module**
   - Allows independent verifiers to validate submitted data using a multi-verifier consensus mechanism.
   - Executes rewards for accurate verifications and penalties for fraudulent submissions.

3. **Data Access Module**
   - Provides APIs and a user interface for querying property records.
   - Supports fee-based access for detailed records and free access for basic information.

4. **Token Economics Module**
   - Manages the issuance and circulation of Poplar Token (ROOT).
   - Governs staking, reward distribution, and penalty enforcement.

5. **Dispute Resolution Module**
   - Permits users to flag suspicious records by staking ROOT.
   - Initiates a review process with additional verifiers to resolve disputes.

6. **Smart Contract Module**
   - Deploys contracts on Base to handle data submission, verification, disputes, and token management.
   - Ensures security, transparency, and efficiency in protocol interactions.

7. **Frontend dApp Module**
   - Offers an intuitive web-based interface for record submission, verification, and access.
   - Focuses on user experience and accessibility.

8. **Off-chain Storage Integration**
   - Utilizes IPFS for storing large documents (e.g., property deeds) with on-chain hash links.

## Technical Considerations
- **Blockchain Platform:** Base (Ethereum L2 using optimistic rollups) for scalability and low fees.
- **On-Chain Consensus:** Verification is performed solely by on-chain verifiers, eliminating external oracle dependencies.
- **Security & Governance:** Token staking and economic incentives ensure data integrity and deter malicious activities.

## Roadmap
- **Phase 1:** Deploy smart contracts on Base testnet and pilot initial property record submissions.
- **Phase 2:** Launch mainnet with full on-chain verification and dApp functionality.
- **Phase 3:** Enhance dispute resolution, user interface, and expand data access features.

## Conclusion
This PRD outlines the essential modules and functionalities for Poplar's MVP. By focusing on on-chain verification and a robust token economy, Poplar aims to deliver a secure and transparent platform for decentralized property records. 