> **Archived (2026-07-06): v1 prototype spec.** Documents the submission/validation flow implemented in `app/` (upfront validator voting, ROOT staking and minting). Superseded by the optimistic-attestation, USDC-first design in [plan-v2.md](../plan-v2.md). Kept as documentation of the prototype.

# Data Submission & Validation Module PRD

## Overview
The Data Submission & Validation Module enables users (Submitters) with connected wallets to propose property records for inclusion in the Poplar protocol. Submissions require a ROOT token stake (`S_stake`) and trigger an immediate, decentralized validation process. Validators stake ROOT (`Val_stake`) to assess the data's accuracy. Successful validation results in the data being marked "Validated", the Submitter's stake being returned along with newly minted ROOT rewards (`Reward_S`), while failed validation leads to the Submitter's stake being slashed. Incorrect validators are also slashed. All blockchain interactions occur directly between the user's frontend/wallet and the smart contracts.

## Core Features

### 1. Wallet Connection
- Users must connect their Web3 wallet (e.g., MetaMask) to interact.
- Display wallet address and ROOT token balance.
- Handle connection/disconnection, chain changes.

### 2. Property Data Submission (Submitter Role)
- Form for property details (State, County, Parcel Number, Address etc.). Input validation on frontend.
- Requires sufficient ROOT balance for `S_stake`.
- Data upload mechanism (e.g., client-side to IPFS via storage service) returning a data pointer (e.g., IPFS CID).
- Transaction initiation (`approve` ROOT, then call `submitData` on `SubmissionValidation` contract with data pointer).
- Display transaction status (pending, success, failure).

### 3. Data Validation (Validator Role)
- Interface to display submissions currently open for validation (`ValidationOpen` status).
- Ability to retrieve and view submission data using the data pointer (potentially via IPFS gateway/proxy).
- Display validation deadline.
- Requires sufficient ROOT balance for `Val_stake`.
- "Accept" / "Reject" voting buttons.
- Transaction initiation (`approve` ROOT, then call `castVote` on `SubmissionValidation` contract).
- Display vote transaction status.
- Prevent voting if deadline passed or already voted.

### 4. Validation Finalization
- Mechanism (can be user-triggered via frontend) to call `finalizeValidation` on the `SubmissionValidation` contract after the `validationDeadline` has passed.
- Contract handles outcome determination (based on `consensusThreshold`), status update (Validated/Rejected), `Reward_S` minting/distribution, stake return/slashing (Submitter and Validators).

### 5. Blockchain Integration (Direct Frontend Interaction)
- Frontend interacts directly with deployed smart contracts via user's wallet provider (ethers.js/viem).
- Smart contract interactions for:
  - Approving ROOT token transfers.
  - Submitting data (`submitData`).
  - Casting votes (`castVote`).
  - Finalizing validation (`finalizeValidation`).
  - Reading contract state (parameters, submission details, balances).
- Gas fee estimation and wallet confirmation prompts.
- Transaction status tracking via transaction hash.

### 6. Decentralized Storage
- Store complete property records off-chain (e.g., IPFS).
- Use content hash (CID) as the `dataPointer` stored on-chain.

### 7. Staking & Rewards Mechanism (Managed by Contracts)
- Submitters stake `S_stake` (locked during validation).
- Validators stake `Val_stake` (locked during voting/finalization).
- `S_stake` returned to Submitter on successful validation.
- `S_stake` slashed to Treasury on failed validation.
- `Reward_S` (newly minted ROOT based on decay formula) sent to Submitter on successful validation.
- `Val_stake` returned to correct Validators post-finalization.
- `Val_stake` slashed to Treasury for incorrect Validators post-finalization.

### 8. Property Record Viewer
- List view of properties filterable by status (Pending, Validated, Rejected), location, submitter etc.
- Requires reading contract events or using an indexer for efficient querying.
- Detailed view showing property details (via data pointer), submission metadata (submitter, timestamp), validation status, transaction info, stake status (if applicable).

## Technical Requirements

### Smart Contracts
1.  `ROOT.sol` (ERC20): Standard functions + `mint` restricted to `SubmissionValidation` contract.
2.  `PoplarParameters.sol`: Stores configurable parameters (`sStakeAmount`, `valStakeAmount`, `consensusThreshold`, `validationDuration`, reward factors etc.).
3.  `SubmissionValidation.sol`: Core logic contract.
    - Manages submission lifecycle (`submitData`, `_startValidation`).
    - Manages voting (`castVote`).
    - Manages finalization (`finalizeValidation`, `_calculateRewardS`, `_processValidatorOutcomes`).
    - Handles stake locking/transfer/slashing for Submitters and Validators.
    - Interacts with `ROOT` (minting), `PoplarParameters`, `Treasury`.
4.  `Treasury.sol`: Receives slashed funds.

### Frontend Components
1.  Wallet Connection Module (Connect/Disconnect, Balance Display).
2.  Property Submission Form (Data input, IPFS upload trigger).
3.  Submission Transaction Interface (Approve/Submit prompts, status tracking).
4.  Validator Dashboard (List open validations, view details).
5.  Voting Interface (Approve/Vote prompts, status tracking).
6.  Finalization Trigger Button.
7.  Property Record Explorer/Viewer (List/Detail views, filtering).

### Backend Services (Minimal)
1.  Serves Frontend application/assets.
2.  `GET /api/config`: Provides contract addresses, Chain ID, RPC URL (optional).
3.  (Optional) IPFS Upload Service (`POST /api/upload`).
4.  (Optional) IPFS Gateway (`GET /api/ipfs/<cid>`).
5.  (Optional) Cache/Indexer API for faster list queries.

## User Flow

1.  **Connect Wallet**: User connects wallet; frontend displays ROOT balance.
2.  **Submit Property Data (Submitter)**:
    - Fills form.
    - Uploads data (e.g., client-side to IPFS), gets `dataPointer`.
    - Frontend reads required `sStakeAmount` from `PoplarParameters`.
    - User approves ROOT transfer (`sStakeAmount`) via wallet.
    - User confirms `submitData(dataPointer)` transaction via wallet.
    - Frontend shows transaction progress/confirmation. Submission status becomes `ValidationOpen` (triggered by contract event or polling).
3.  **Validate Data (Validator)**:
    - Accesses Validator Dashboard, sees open submissions (read from events/indexer/cache).
    - Selects a submission, retrieves data via `dataPointer` (e.g., IPFS lookup).
    - Reviews data against validation criteria.
    - Frontend reads required `valStakeAmount`.
    - User approves ROOT transfer (`valStakeAmount`) via wallet.
    - User clicks "Accept" or "Reject", confirming `castVote` transaction via wallet.
    - Frontend shows vote transaction progress/confirmation.
4.  **Finalize Validation (Anyone, usually triggered from Frontend)**:
    - User accesses detail page for a submission where `block.timestamp > validationDeadline` and status is `ValidationOpen`.
    - User clicks "Finalize Validation", confirming `finalizeValidation` transaction via wallet.
    - Contract determines outcome, updates status, mints rewards, returns/slashes stakes.
    - Frontend updates UI based on `ValidationFinalized` event or state polling.
5.  **View Properties**: User accesses explorer, filters by status (Validated, etc.), views details.

## Security Considerations

1.  **Smart Contract Security**:
    - Audits.
    - Access control (e.g., `mint` restriction).
    - Input validation (though less critical for `dataPointer`).
    - Reentrancy protection.
    - Safe math for reward/stake calculations.
    - Gas limits / denial-of-service protection (e.g., validator iteration limits).
2.  **Frontend Security**:
    - Secure handling of contract addresses/ABIs.
    - Protection against phishing related to wallet interactions.
    - Input sanitization for displayed data.
3.  **Validation Security**:
    - Sybil resistance (primarily via `Val_stake` cost).
    - Validator collusion mitigation (slashing, transparency).
    - Preventing lazy/random voting (economic incentives/disincentives).
4.  **Data Integrity**: Ensure IPFS hash represents the submitted data accurately.

## Performance Requirements

1.  **Transaction Confirmation**: Dependent on underlying blockchain network speed.
2.  **Data Loading**: Property lists/details should load quickly (< 3-5 seconds). Requires efficient querying (indexer recommended) or acceptable latency via direct event queries/state reads for smaller datasets.
3.  **Scalability**: Contract design should handle increasing numbers of submissions and validators without excessive gas costs (e.g., avoid unbounded loops where possible).

## Future Considerations

1.  **Enhanced Data Fields**: More structured property data schema.
2.  **Advanced Validation Features**: Reputation system for validators/submitters.
3.  **Improved Querying**: Robust indexing solution (e.g., The Graph).
4.  **Gas Optimization**: Further refinements to contract logic.
5.  **Validator Discovery/Selection**: Formal mechanism if not open to all.

## Success Metrics

1.  **Technical Metrics**:
    - Successful submission rate.
    - Validation success rate (% of submissions marked Validated).
    - Average validation duration (submission to finalization).
    - System uptime (contracts, frontend service, IPFS access).
    - Blockchain interaction error rate.
2.  **User/Economic Metrics**:
    - Number of active Submitters.
    - Number of active Validators.
    - Total properties submitted/validated (`N_validated`).
    - Total ROOT staked (by Submitters, by Validators).
    - Average votes per validation.
    - User satisfaction (Submitters, Validators).

## Implementation Phases

### Phase 1: Core Contracts & Submission
- Deploy `ROOT`, `PoplarParameters`, `Treasury`.
- Develop/Deploy `SubmissionValidation` contract (basic `submitData`, `_startValidation`, state management).
- Basic frontend for wallet connection and `submitData` flow (including IPFS upload, approve/submit transactions).
- Basic property viewer reading contract state/events directly.

### Phase 2: Validation & Finalization
- Implement `castVote` and `finalizeValidation` logic in `SubmissionValidation` (including reward calculation, minting, slashing).
- Build Validator Dashboard UI (listing open submissions).
- Implement Voting Interface (viewing data, approve/vote transactions).
- Implement Finalization Trigger UI.
- Refine property viewer to show detailed status and validation outcomes.

### Phase 3: Optimization & UX
- Implement Indexer (e.g., The Graph subgraph) for efficient data querying.
- Optimize frontend data loading using indexer.
- Enhance filtering/sorting in property viewer.
- Gas optimizations in contracts.
- User experience improvements based on feedback.

## Dependencies

1.  **Technical Dependencies**:
    - Target Blockchain Network (e.g., Polygon, Ethereum L2).
    - IPFS node access or pinning service.
    - Web3 wallet browser extension/mobile support.
    - Deployed `ROOT`, `PoplarParameters`, `Treasury` contracts.
2.  **External Dependencies**: None strictly required for core submission/validation flow, but data standards (state lists, parcel formats) are helpful.

## Risk Mitigation

1.  **Technical Risks**:
    - *Mitigation:* Rigorous testing (unit, integration, e2e), audits, careful gas cost analysis, reliable RPC providers, IPFS redundancy.
2.  **Economic Risks**:
    - *Mitigation:* Careful modeling of `S_stake`, `Val_stake`, `Reward_S` decay, slashing penalties to ensure participation and security. Monitoring network health.
3.  **Usability Risks (Direct Interaction)**:
    - *Mitigation:* Clear UI guidance for multi-step transactions, gas estimation, status feedback. Consider helper backend APIs for non-critical data fetching if needed.

## Maintenance Plan

1.  **Contracts**: Upgradability pattern (e.g., Proxies) if parameter changes or logic fixes are anticipated. Governance process for upgrades.
2.  **Frontend**: Standard web app updates, dependency management, security patches.
3.  **Monitoring**: Blockchain event monitoring, RPC node health, IPFS pinning status, frontend error tracking.

## Support Plan

1.  **User Support**: Documentation (Submitter guide, Validator guide), community channels (Discord/Telegram).
2.  **Developer Support**: Contract ABIs, technical documentation, potentially SDK/helper libraries.
