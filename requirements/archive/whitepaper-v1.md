> **Archived (2026-07-06): v1 mechanism sketch.** Poplar's original protocol design — upfront stake-weighted validation of every submission, day-one ROOT minting, and an open underwriter insurance market. Superseded by the current [whitepaper](../whitepaper.md) and [plan-v2.md](../plan-v2.md); see [GOALS.md](../../GOALS.md). Retained as the design reference for the open underwriter market, which is deferred to Phase 4. Key deltas in the current design: upfront validation → optimistic attestations; guarantees scoped to re-verifiable public-record facts; USDC before any token; first-party reserve before open underwriting; crypto-native customers first.

# Poplar: A Decentralized Protocol for Insured Property Records

## Abstract
Poplar is a decentralized protocol and application using blockchain technology for secure, transparent, and immutable property record management. It introduces the **Poplar Root Token (ROOT)**, minted exclusively as rewards for contributing validated data. **Submitters** stake ROOT (`S_stake`) to propose data, which undergoes immediate **Validation** by ROOT-staking **Validators**. Upon success, Submitters regain their stake and receive newly minted ROOT (`Reward_S`). **Consumers** can purchase time-bound insurance certificates for validated data by specifying coverage amount and term. **Underwriters** stake ROOT (`Uw_stake_amount`) directly onto these insurance requests, influencing the premium calculation (`I_premium`). Paid premiums are shared between a **Protocol Treasury** and the specific Underwriters. If a **Consumer** successfully files a claim (staking `Claim_stake`, validated by Validators) against an inaccurate certificate, the payout is covered jointly by the Treasury and the certificate's Underwriters. This system incentivizes accurate data submission through minting rewards and ensures data reliability via a market-driven insurance mechanism backed by staked capital.

## Introduction
Traditional property record systems often suffer from inefficiencies, opacity, and vulnerability to errors or fraud. Poplar addresses these challenges with a decentralized blockchain solution focused on upfront data validation and integrated financial assurance. The protocol uses the ROOT token, generated solely through the contribution of accurate data, to power its core functions: staking for submission and validation, premium payments for data insurance, Underwriter staking to back specific insurance requests, and claim payouts for data inaccuracies. Poplar aims to create a trustworthy, self-regulating ecosystem for property data, where value is derived from validated information and reliability is guaranteed through economic incentives and penalties. This whitepaper details the protocol's architecture, participant roles, token economics, insurance mechanism, anti-fraud measures, technical implementation, and discusses strengths and risks.

## High-Level Overview (Conceptual)
Poplar operates on a cycle of submission, validation, reward, and optional insurance:
1.  **Submission**: A Submitter stakes `S_stake` ROOT to propose property data.
2.  **Upfront Validation**: The submission automatically triggers a validation process. Validators stake `Val_stake` ROOT and vote on the data's accuracy.
3.  **Validation Outcome & Reward**: If validation succeeds, the data is marked "Validated". The Submitter's `S_stake` is returned, and they receive newly minted `Reward_S` ROOT. Incorrect Validators are slashed. If validation fails, the Submitter's `S_stake` is slashed, and correct Validators are rewarded.
4.  **Insurance Request (Optional)**: A Consumer wanting financial assurance requests insurance on specific validated data, defining coverage (`CoverageAmount`) and duration (`TermLength`).
5.  **Underwriting**: The request becomes open. Underwriters evaluate the risk and stake `Uw_stake_amount` ROOT directly against this request.
6.  **Premium & Activation**: The protocol calculates the premium (`I_premium`), inversely related to the total Underwriter stake (`TotalUwStake`). If the Consumer pays, the premium is distributed (to Treasury and participating Underwriters), the certificate activates, and Underwriter stakes are locked.
7.  **Claim Process (If Necessary)**: A Consumer stakes `Claim_stake` ROOT to file a claim within the term. Validators review evidence and vote. If the claim is valid, a payout (decaying over the term) is made, funded jointly by the Treasury and the certificate's Underwriters (deducted from their locked stake). If invalid, the Consumer's stake is slashed.

This flow ensures data is verified before use, rewards contributions directly through token minting, and provides configurable, market-priced data insurance.

## Use Cases
Poplar's validated and optionally insured property data enables reliable applications:
1.  **Real Estate Transactions**: Buyers, sellers, and agents can trust property details and title information, potentially backed by insurance.
2.  **Lending and Mortgages**: Financial institutions gain higher confidence in property characteristics and ownership for underwriting, using insurance to mitigate data risk.
3.  **Property Management**: Accurate, validated records of history and condition improve management efficiency.
4.  **Insurance (Traditional)**: External insurers can leverage Poplar's validated data and potentially integrate with its insurance layer for risk assessment.
5.  **Urban Planning and Government Services**: Access to trustworthy, up-to-date property data aids planning, taxation, and public record management.
6.  **Dispute Resolution**: Immutable, validated, and potentially insured records serve as strong evidence.

## Participant Roles and Incentives

Poplar relies on four key roles interacting via the ROOT token:

### 1. Submitter
- **Goal**: Add accurate property data to the protocol.
- **Action**: Stakes `S_stake` ROOT to submit data for validation.
- **Incentive**: If data is successfully validated, receives `S_stake` back plus newly minted `Reward_S` ROOT (reward decays as total validated properties increase).
- **Disincentive**: Loses `S_stake` if submitted data fails validation (slashed).

### 2. Validator
- **Goal**: Accurately assess submitted data during initial validation and assess claims during claim validation.
- **Action**: Stakes `Val_stake` (or `ClaimVal_stake` for claims) ROOT and votes ("Accept"/"Reject" for submissions, "Valid"/"Invalid" for claims).
- **Incentive**: Earns rewards (from slashed stakes and/or Treasury) for voting with the consensus outcome.
- **Disincentive**: Loses staked ROOT (partially or fully slashed) for voting against the consensus outcome.

### 3. Underwriter
- **Goal**: Earn yield by backing the accuracy of specific validated data for Consumers.
- **Action**: Evaluates open insurance requests. Stakes a chosen amount (`Uw_stake_amount`) ROOT directly onto specific requests they deem low-risk.
- **Incentive**: Receives a proportional share of the `(100 - TreasuryPremiumShare)%` of the `I_premium` if the Consumer activates the certificate. Gets stake back after term expiry if no successful claims.
- **Disincentive**: Locked stake (`Uw_stake_amount`) is proportionally liable for the `(100 - TreasuryClaimShare)%` of payouts for successful claims against certificates they underwrote. Stake only returned after term and claim resolution.

### 4. Consumer
- **Goal**: Access validated property data and optionally obtain financial assurance on its accuracy.
- **Action**:
    - Views validated data.
    - Initiates an insurance request (specifying `CoverageAmount`, `TermLength`).
    - Pays the calculated `I_premium` to activate the insurance certificate.
    - Stakes `Claim_stake` ROOT to initiate a claim if they believe insured data was inaccurate and caused loss.
- **Incentive**: Receives a payout (up to `CoverageAmount`, decaying with time) if a claim is validated. Gets `Claim_stake` back on valid claim.
- **Disincentive**: Pays `I_premium` for insurance. Loses `Claim_stake` if an initiated claim is deemed invalid (slashed).

### Protocol Treasury
- **Function**: Acts as a central reserve and co-insurer.
- **Funding**: Receives `TreasuryPremiumShare%` of all paid `I_premium` and proceeds from various slashing events (failed submissions, incorrect validation votes, invalid claims).
- **Role**: Co-covers `TreasuryClaimShare%` of payouts for valid insurance claims. May also fund protocol development or validator rewards.

## Protocol Architecture

### Overview
Poplar facilitates the submission, validation, and optional insurance of property data on a blockchain. **Submitters** add data, **Validators** confirm its accuracy, **Consumers** use the data and can request insurance, **Underwriters** stake on these requests to enable insurance and set market prices, and the **Protocol Treasury** provides foundational backing.

### 1. Data Submission
- **Submitter**: Stakes `S_stake` ROOT.
- **Mechanism**: Submits data transaction. Recorded on-chain with timestamp, ID, Submitter address. Enters "Pending Validation" state.

### 2. Upfront Validation
- **Trigger**: Automatic upon submission acceptance.
- **Process**: Validators are selected/join. They stake `Val_stake` ROOT and vote "Accept" or "Reject" within a defined period. Consensus (e.g., >66% stake-weighted) determines outcome.
- **Outcome (Success)**: Data status -> "Validated". `S_stake` returned to Submitter. `Reward_S` ROOT minted and sent to Submitter. Correct Validators rewarded (from slashing pool/Treasury). Incorrect Validators slashed. `N_validated` (validated property count) incremented.
- **Outcome (Failure)**: Data status -> "Rejected" (or removed). Submitter `S_stake` slashed. Correct Validators rewarded (from slashed `S_stake`/Treasury). Incorrect Validators slashed.

### 3. Insurance Request and Underwriting
- **Trigger (Consumer)**: Selects validated data version. Specifies `CoverageAmount` and `TermLength`. Publishes "Open Insurance Request".
- **Underwriting Period (`RequestStakingPeriod`)**: Underwriters evaluate the request.
- **Underwriter Staking**: Underwriters stake desired `Uw_stake_amount` ROOT directly against this specific request. `TotalUwStake` for the request accumulates. Stake is locked.

### 4. Premium Calculation and Activation
- **Trigger**: End of `RequestStakingPeriod` (or potentially dynamic threshold).
- **Viability Check**: Protocol checks if `TotalUwStake` meets minimum requirements (e.g., relative to `CoverageAmount`). If not, request fails, stakes returned.
- **Premium Calculation (`I_premium`)**: Protocol calculates premium using a formula considering `CoverageAmount`, `TermLength`, `TotalUwStake`, and potentially other risk factors (e.g., data age, Treasury size). Premium is inversely related to `TotalUwStake`.
- **Consumer Payment (`PremiumPaymentPeriod`)**: Consumer pays `I_premium`.
- **Activation**: Insurance Certificate (NFT) minted. `TotalUwStake` remains locked against the certificate. `I_premium` distributed: `TreasuryPremiumShare%` to Treasury, remainder proportionally to the certificate's Underwriters.

### 5. Insurance Claim Process
- **Trigger (Consumer)**: Within `TermLength`, stakes `Claim_stake` ROOT, provides evidence of inaccuracy at validation causing loss against their certificate.
- **Claim Validation**: Validators stake `ClaimVal_stake`, review evidence, vote "Valid" or "Invalid". Consensus determines outcome.
- **Outcome (Valid Claim)**: Consumer `Claim_stake` returned. Payout calculated (`Payout = CoverageAmount * g(t)`, where `g(t)` decays over `TermLength`). Payout distributed: `TreasuryClaimShare%` from Treasury, remainder from the certificate's Underwriters (proportional deduction from their locked `Uw_stake_amount`). Correct Validators rewarded; incorrect slashed.
- **Outcome (Invalid Claim)**: Consumer `Claim_stake` slashed. Correct Validators rewarded; incorrect slashed.

### 6. Stake Release
- **Trigger**: Certificate `TermLength` expires AND any associated claims are fully resolved.
- **Action**: The remaining locked `Uw_stake_amount` for that certificate is returned to the respective Underwriters.

## Token Economics (ROOT)
The **Poplar Root Token (ROOT)** is the native utility token, essential for all protocol operations. It is *only* created via `Reward_S` given to Submitters for successful data validation.

- **Core Utility**:
    - **Staking**: Required by Submitters (`S_stake`), Validators (`Val_stake`, `ClaimVal_stake`), Underwriters (`Uw_stake_amount`), and Consumers initiating claims (`Claim_stake`).
    - **Premiums**: Consumers pay `I_premium` in ROOT for insurance certificates.
    - **Rewards**:
        - Submitters: Minted `Reward_S` ROOT.
        - Validators: ROOT rewards for correct votes (from Treasury/slashing).
        - Underwriters: Share of `I_premium` in ROOT.
    - **Slashing**: Forfeiture of staked ROOT for failed submissions, incorrect validation/claim votes, invalid claims, or covering claim payouts (Underwriters).
    - **Claim Payouts**: Paid in ROOT from Treasury and Underwriter stakes.

- **Participant Flows (Simplified)**:

| Role        | Action                     | Token Flow (In)                             | Token Flow (Out)                          | Notes                                                            |
|-------------|----------------------------|---------------------------------------------|-------------------------------------------|------------------------------------------------------------------|
| Submitter   | Stake to submit            |                                             | Stake `S_stake` ROOT                      | Returned on success                                              |
| Submitter   | Data validated             | Minted `Reward_S` ROOT                      |                                           | Reward decays with `N_validated`                                 |
| Submitter   | Data rejected              |                                             | Lose `S_stake` ROOT (slashed)             |                                                                  |
| Validator   | Stake & Vote correctly     | Earn Rewards (ROOT)                         | Stake `Val_stake`/`ClaimVal_stake` ROOT   | Stake returned                                                   |
| Validator   | Vote incorrectly           |                                             | Lose part/all staked ROOT (slashed)       |                                                                  |
| Underwriter | Stake on Insurance Request |                                             | Stake `Uw_stake_amount` ROOT (locked)     | Returned after term/claims, less claim payouts                   |
| Underwriter | Certificate Activated      | Earn share of `I_premium` (ROOT)            |                                           | Proportional to stake on that certificate                        |
| Underwriter | Valid Claim Paid           |                                             | Lose share of payout from locked stake    | Proportional liability on that certificate                       |
| Consumer    | Request Insurance          |                                             | (No direct cost)                          |                                                                  |
| Consumer    | Activate Insurance         |                                             | Pay `I_premium` ROOT                      | Premium amount set by protocol/Underwriter staking               |
| Consumer    | Stake to Claim             |                                             | Stake `Claim_stake` ROOT                  | Returned on valid claim                                          |
| Consumer    | Claim Valid                | Receive `Payout` ROOT                       |                                           | Amount decays over term                                          |
| Consumer    | Claim Invalid              |                                             | Lose `Claim_stake` ROOT (slashed)         |                                                                  |
| Treasury    | Premium Paid               | Earn `TreasuryPremiumShare%` of `I_premium` |                                           |                                                                  |
| Treasury    | Slashing Occurs            | Earn portion of slashed ROOT                |                                           | Funds Treasury pool                                              |
| Treasury    | Valid Claim Paid           |                                             | Pay `TreasuryClaimShare%` of `Payout`     | Co-insures the system                                            |

- **Bootstrapping and Token Supply**:
    - Protocol starts with 0 ROOT. The first successful submission(s) mint the initial supply via `Reward_S`.
    - Supply grows only as new data is validated. No pre-mine or ICO.
    - Submission rate naturally limited by available ROOT for `S_stake`.
- **Submission Reward (`Reward_S`) Decay**:
    - `Reward_S = (InitialRewardFactor * S_stake) * (TargetProperties / (TargetProperties + N_validated))`
    - `InitialRewardFactor = 2` (configurable parameter)
    - `TargetProperties = 100,000,000` (configurable parameter)
    - This incentivizes early contributions and controls inflation as the network matures.
- **Premium Dynamics**:
    - `I_premium` is calculated per request.
    - Primarily driven by `CoverageAmount`, `TermLength`, and inversely by `TotalUwStake` committed by Underwriters, reflecting market confidence.
- **Sustainability (Treasury)**:
    - Funded by a share of insurance premiums and slashing proceeds.
    - Backs a portion of insurance claims, ensuring system solvency.
    - May fund ongoing development, audits, or supplemental rewards.

## Anti-Fraud Mechanisms
Poplar integrates multiple layers to secure data integrity and the insurance process:
- **Upfront Validation**: Data requires validator consensus *before* becoming "Validated" and eligible for insurance.
- **Staking Requirements**: Significant stakes (`S_stake`, `Val_stake`, `Uw_stake_amount`, `Claim_stake`) make malicious actions economically costly for all participants.
- **Slashing Penalties**: Strict forfeiture of stake for submitting invalid data, voting incorrectly, filing invalid claims, or (for Underwriters) failing to cover claim liability deters fraud and negligence.
- **Claim Validation**: Insurance claims undergo a secondary validation process by staked Validators, preventing fraudulent payouts.
- **Underwriter Skin-in-the-Game**: Underwriters risk their own capital on specific certificates, incentivizing careful risk assessment before staking. Their collective stake influences the premium.
- **Transparency**: All submissions, validations, stakes, insurance requests, premium payments, claims, and outcomes are recorded immutably on the blockchain.

These mechanisms aim to make dishonest participation economically irrational.

## Strengths and Risks

### Strengths
*   **Decentralized & Transparent**: Immutable, publicly verifiable records and processes.
*   **Incentivized Accuracy**: `Reward_S` minting directly ties token creation to validated data contribution.
*   **Upfront Validation**: Ensures baseline quality check before data is widely used or insured.
*   **Market-Driven Insurance**: Premiums reflect collective Underwriter risk assessment for specific data/terms.
*   **Configurable Insurance**: Consumers choose coverage and term, Underwriters choose risks to back.
*   **Aligned Underwriter Incentives**: Underwriters profit by correctly identifying and backing reliable data.
*   **Fair Token Distribution**: ROOT minted purely through contribution, rewarding active participation.
*   **Robust Anti-Fraud**: Layered staking, slashing, and validation processes deter malicious behavior.

### Risks and Mitigation Strategies
*   **Sybil Attacks**: Risk: Malicious actors creating multiple identities (Submitters, Validators, Underwriters). Mitigation: Meaningful stake requirements (`S_stake`, `Val_stake`, `Uw_stake_amount`, `Claim_stake`); potential future reputation systems.
*   **Collusion**: Risk: Groups coordinating (e.g., bad submissions + accepting votes; underwriting bad data; rejecting valid claims). Mitigation: Significant slashing penalties; transparency of actions; potential random validator selection; requiring diverse Underwriter participation for lower premiums.
*   **Voter/Underwriter Apathy**: Risk: Validators not performing due diligence; insufficient Underwriters participating. Mitigation: Financial rewards/penalties; market dynamics (higher premiums/failed requests if underwriting is thin).
*   **Insurance Market Thinness**: Risk: Difficulty obtaining insurance for niche, very high value, or very long-term requests due to lack of Underwriter interest/capacity. Mitigation: Protocol parameters encouraging participation; potential Treasury incentives for underwriting specific categories.
*   **Underwriter Risk Concentration**: Risk: A small number of Underwriters backing a large portion of the insurance, creating systemic risk if they fail. Mitigation: Monitoring stake distribution; potentially protocol limits or incentives for diversification.
*   **Claim Payout Shortfalls**: Risk: Total locked `Uw_stake_amount` on a certificate being insufficient to cover the Underwriter portion of a large claim. Mitigation: Robust `TreasuryClaimShare`; potential secondary slashing mechanisms for Underwriters (beyond locked stake); clear protocol rules on handling shortfalls.
*   **Parameter Sensitivity**: Risk: Incorrect initial tuning of stake amounts, reward decay, premium formulas, Treasury shares, time periods. Mitigation: Thorough economic modeling and simulation; robust governance for parameter adjustments.
*   **Bootstrapping Difficulty**: Risk: Insufficient initial ROOT circulation or participation to make submissions or underwriting viable. Mitigation: Potential temporary adjustments to initial `S_stake` or rewards; targeted community building.

Continuous monitoring, governance, and potential parameter adjustments are crucial.

## Technical Implementation
- **Blockchain**: A suitable public blockchain supporting smart contracts, NFTs (for certificates), and efficient computation for reward/premium formulas.
- **Smart Contracts**: Manage ROOT token logic, staking (submission, validation, underwriting, claims), validation processes, reward minting/distribution, insurance request lifecycle, premium calculation/distribution, claim processing, payout logic, slashing, and Treasury management. Requires careful gas optimization.
- **Frontend**: Decentralized application (dApp) for user interaction: submitting data, viewing data/requests, staking as Validator/Underwriter, requesting/paying for insurance, filing/validating claims.
- **Storage**: Decentralized storage (e.g., IPFS) for large property data files, linked via on-chain hashes.

## Open Questions and Future Considerations

Further specification, modeling, and discussion are required:

*   **Parameter Optimization**: Precise values for all stakes (`S_stake`, `Val_stake`, `ClaimVal_stake`, `Uw_stake_amount`, `Claim_stake`), time periods (`RequestStakingPeriod`, `PremiumPaymentPeriod`, `TermLength` limits, `UnderwriterUnstakeLockupPeriod`), `Reward_S` decay factors (`InitialRewardFactor`, `TargetProperties`), premium formula constants (`BaseRiskPremium`, `TermPremiumFactor`, `ConfidenceFactor`, etc.), Treasury shares (`TreasuryPremiumShare`, `TreasuryClaimShare`), payout decay function `g(t)`, slashing percentages, consensus thresholds, `MinStakeRatio` for insurance viability.
*   **Premium Formula Refinement**: Detailed modeling of the premium calculation for fairness and risk accuracy. Should data age, type, or Submitter reputation influence `BaseRiskPremium`?
*   **Validator Selection**: Mechanism for selecting Validators for submissions and claims (random sampling, pools, etc.).
*   **Underwriter Shortfall Handling**: Define precise protocol behavior if an Underwriter's locked stake on a certificate is insufficient for their share of a claim payout.
*   **Dispute Resolution (Complex Claims)**: Mechanisms for handling ambiguous evidence or highly complex claim validations. Potential for higher stakes or specialized Validators.
*   **Data Model**: Specific structure and standards for property data submissions.
*   **Scalability**: Ensuring blockchain and contract performance under load.
*   **Governance**: Formal process for protocol upgrades and parameter adjustments (e.g., token-holder voting, council).

## Roadmap
- **Phase 1 (Simulation & Testnet)**: Detailed economic modeling and simulation of parameters. Deploy core smart contracts on a test network. Test submission, validation, reward minting, insurance request/underwriting flow, premium calculation, and basic claim scenarios. Gather community feedback.
- **Phase 2 (Mainnet Launch & Core Functionality)**: Deploy audited contracts to the main blockchain. Enable core features: data submission/validation/rewards, insurance requests, Underwriter staking on requests, premium calculation/payment/distribution, Treasury funding, basic claim initiation/validation/payout.
- **Phase 3 (Enhancements & Ecosystem Growth)**: Improve dApp usability. Refine premium models. Implement advanced claim handling. Explore data integrations. Foster Submitter, Validator, and Underwriter communities. Pursue partnerships. Solidify governance model.

## Conclusion
Poplar introduces a novel approach to decentralized property records by integrating upfront validation with a market-driven insurance mechanism. By minting its native ROOT token exclusively as a reward for accurate data submission, it directly incentivizes contribution. The unique Underwriter model, where participants stake on specific insurance requests, allows premiums to reflect real-time market confidence and provides Consumers with tailored financial assurance. While careful parameter tuning and robust governance are essential, Poplar's architecture, combining staking, validation, minting rewards, and per-request underwriting, creates a strong foundation for a trustworthy, transparent, and economically sustainable ecosystem for property information.
