# Gateway Spec (Draft)

*Engineering spec for plan-v2 Phase 1 — the gateway: property records you can stake value on. Covers the five workstreams, their interfaces, and parameter defaults. All parameters marked **[tunable]** are initial defaults to be revised with counsel, design partners, and loss data — before launch, not after. This document is public (Poplar builds in the open); execution instruments with negotiation thresholds or third-party contacts stay in the private workspace per [README.md](README.md).*

---

## 0. Purpose and exit criteria

The gateway makes property facts for one wedge county **legible** (a normalized, fresh, provenance-complete copy of the public record) and **economically guaranteed** (bonded attestations and reserve-backed warranties that pay out when wrong). It exists to (a) become the underwriting oracle for grove lending, and (b) earn external revenue that sustains development — in that order of importance, the reverse order of time.

**Phase 1 exit criteria** (from plan-v2):

1. The spine ingests the wedge county with the acceptance bars in §B met, continuously.
2. The explorer is public and is the best property-records experience for that county.
3. Attestation rails are live on Base mainnet with the verification bot challenging autonomously.
4. First-party guarantees are purchasable, the solvency invariant holds, and **at least one external customer has paid for guarantees used in live transactions.**

## 1. Scope and non-goals

**In scope**: recorded liens, ownership-of-record, encumbrances, and chain-of-record facts as of a date, for one county; a free explorer; a paid data API; bonded attestations; first-party guaranteed abstracts.

**Non-goals** (guardrails, restated from GOALS/plan-v2): no token; no valuation opinions; no warranty of title *validity* (only of search completeness/accuracy over enumerated public sources); no TradFi insurance distribution (carrier/MGA route is later); no second county until the first meets the acceptance bars; no open underwriter market (Phase 4 — the archived v1 whitepaper remains its design reference).

## 2. System overview

```
county sources ──> INGEST ──> SPINE (normalize + provenance) ──> EXPLORER (free)
                                     │                      └──> DATA API (paid)
                                     ├──> VERIFICATION BOT ──── challenges ──┐
                                     ▼                                       ▼
                              ATTESTATION RAILS (Base) <── asserts ── abstract pipeline
                                     │  bond / challenge window / arbitration
                                     ▼
                              GUARANTEES (first-party) <── fees ──> RESERVE (USDC)
                                     ▼
                              customers: RWA lending protocols, later grove lending
```

One flow to internalize: **a guarantee claim is a challenge**. The same dispute machinery that polices attestations resolves warranty claims, so there is exactly one arbitration surface to secure.

---

## A. Workstream: wedge county selection

**Deliverable**: a scored shortlist of 5–10 counties and one pick, with a written rationale.

Scorecard dimensions (weights [tunable]):

| Dimension | What good looks like | Weight |
|---|---|---|
| Official bulk data access | Recorder/assessor sell a bulk feed or publish open data — prefer buying the feed over scraping (reliability + legal cleanliness) | 25% |
| Re-verifiability cost | A third party can re-run any search online, free or cheap, in minutes — the challenge-economics precondition | 25% |
| Data quality & digitization depth | Indexed images ≥ 30 years back; consistent APNs; low known error folklore | 15% |
| Transaction volume | Enough recording activity for real attestation/guarantee demand | 10% |
| State fit for the grove | Lending licensing regime and entity law that suit Track B's future footprint | 15% |
| Terms of service / legal posture | County data terms permit redistribution or a license is purchasable | 10% |

Also produced here: the **source inventory** for the chosen county (recorder docket, assessor rolls, GIS parcels, tax status — URLs, formats, update cadence, access terms) which becomes the enumerated-sources list in every warranty.

## B. Workstream: data spine

### B1. Ingestion
Per-source adapters (bulk feed preferred, scraping fallback) on a recurring sync with diff detection. Every fetch is a recorded `SyncRun` (source, window, counts, checksums). Raw payloads and document images are retained immutably — the spine must be rebuildable from raw captures.

### B2. Schema (canonical entities)
`County` · `Source` · `SyncRun` · `DocumentImage` · `RecordedDocument` (type, recording no., date, book/page) · `Parcel` (APN, legal description, geometry) · `Party` / `PartyAlias` (entity resolution) · `Interest` (fee, mortgage, lien — tax/mechanics/judgment/HOA — easement, lis pendens) · `InterestEvent` (created / assigned / modified / released) · `ChainLink` (grantor→grantee edges) · `PipelineVersion`. Plus the protocol-side records: `Attestation`, `Abstract`, `Guarantee`, `Claim`.

### B3. Normalization pipeline
Versioned stages, each writing provenance edges back to source documents:
1. **Parse/extract** — structured fields from documents and rolls.
2. **Entity resolution** — party name variants to canonical parties (the honest hard part; conservative merging, human-reviewable).
3. **Interest derivation** — active lien/encumbrance state per parcel from document events.
4. **Chain assembly** — grantor/grantee chains per parcel.
5. **QA sampling** — continuous random manual audits feeding an error ledger.

Every derived fact carries: source document(s), pipeline version, derivation timestamp. **A fact without provenance does not exist.**

### B4. Acceptance bars [tunable]
- Coverage: ≥ 99% of recorded documents for the trailing 30 years ingested and parsed.
- Freshness: spine lag ≤ 24h behind county publication (measured, displayed publicly).
- Provenance: 100% of derived facts trace to ≥ 1 source document.
- Accuracy: manual audit agreement ≥ 99.5% on lien-status facts before any guarantee is sold.

### B5. Explorer (free)
Parcel page: chain of record, active interests, source documents, freshness stamp, provenance links. Search by address / APN / party. "Report an error" feeds the QA ledger (and, post-rails, seeds challenges). Public accuracy/freshness dashboard — the spine grades itself in the open.

### B6. Data API (paid)
Keyed REST: parcel snapshot, interests, chain, document metadata; bulk export tiers. Pricing hypothesis [tunable]: free explorer; developer tiers $99–$499/mo; enterprise custom. The API sells *data*; guarantees (§D) sell *warranted* data and are priced separately.

## C. Workstream: attestation rails

### C1. Contracts (Base)
- **AttestationRegistry** — post attestation: `(parcelId, factClass, contentHash, asOfDate, uri)` + USDC bond. States: `Asserted → (unchallenged, window elapsed) Finalized` or `→ Challenged → Arbitration → Upheld | Overturned`. Overturned: asserter bond → challenger (less arbitration cost). Upheld: challenger bond → asserter.
- **GuaranteeManager** + **Reserve** — §D.
- Admin honesty: pilot contracts run behind a timelocked admin multisig with published scope; decentralization is a roadmap item, not a launch claim.

### C2. Arbitration venue — decision pending (memo is a deliverable)
Default lean: **UMA Optimistic Oracle V3** as the escalation layer (the `uma/` experiment is the integration groundwork) — proven, neutral, and its dispute game matches ours. Fallback for the pilot if UMA fit fails: a 2-of-3 arbiter panel (Poplar + independent title attorney + a design partner) with published rulings and a documented exit path to UMA. The memo decides; the registry treats the arbiter as a pluggable interface either way.

### C3. Verification bot
Subscribes to registry events; independently re-derives each attested fact; auto-challenges on mismatch. Two independence rules: (1) the bot's re-derivation path re-fetches from sources rather than trusting the cached spine (otherwise a shared ingestion bug blinds both sides); (2) the bot also runs in **self-audit mode** against Poplar's own attestations continuously. In a scrapeable county, we are the first professional challenger; the bot is that challenger with a wallet.

### C4. Parameters [all tunable]

| Parameter | Default |
|---|---|
| Attestation bond | $250 (per fact-class schedule) |
| Challenge window | 72h simple facts; 7 days chain-assembly facts |
| Challenge bond | = attestation bond |
| Arbitration cost allocation | loser pays |
| Attestation fee (protocol) | $5 flat + bond escrow gas |

## D. Workstream: guarantee product and the fee-funded reserve

### D1. The product
A **guaranteed title abstract**: a signed report (JSON + human-readable PDF; content hash committed on-chain via the registry) warranting the **completeness and accuracy of a search over the enumerated public sources** for a parcel as of a date. Explicitly warranted: the listed interests/liens/ownership-of-record are exactly what the enumerated sources contained as of the as-of date. Explicitly not warranted: title validity, unrecorded interests, forgery, matters outside enumerated sources, value.

### D2. Issuance flow
Customer requests abstract (parcel, coverage amount, term) → pipeline produces abstract + posts the backing attestation (bonded) → customer pays fee in USDC → `GuaranteeManager` records the guarantee (coverage, term, abstract hash, pipeline version) — **only if the solvency invariant (D4) holds post-issuance**.

### D3. Pricing [tunable hypothesis]
Fee = max($50, 25–75 bps × coverage) scaled by fact-class risk and term. Coverage per abstract capped at $250k during pilot; aggregate caps in D4. Pricing is a hypothesis until loss data exists — that is much of what the pilot is for.

### D4. Reserve mechanics
- **Funding**: 60% [tunable] of every guarantee fee auto-deposits to the **Reserve contract** (segregated USDC on Base); remainder to operations. Seeded at launch from the raise: target ≥ $100k [tunable] so capacity precedes volume.
- **Transparency**: reserve balance, outstanding exposure, and the invariant status are public contract state — customers verify solvency in real time.
- **Solvency invariant** (enforced on-chain at issuance):
  `reserve ≥ max( largest single active coverage, 20% × aggregate active coverage )` [tunable]
  plus a per-pipeline-version aggregate exposure cap (systemic-bug blast-radius limit) and a weekly issuance cap during pilot. Invariant failure ⇒ issuance pauses automatically; existing guarantees unaffected.
- **Claims = challenges**: a claimant (guarantee holder) files against the guarantee's backing attestation within the term, posting a claimant bond (5% of coverage [tunable], refunded if upheld). The claim asserts a specific factual defect ("lien recorded at X omitted"). It resolves through the same arbitration venue as any challenge. **Parametric payout**: if upheld, the reserve pays the coverage amount — no loss adjustment, no discretion, no negotiation. If rejected, claimant bond is forfeited (deters fishing).
- **Loss waterfall**: (1) asserter's attestation bond, (2) reserve. Poplar asserting its own abstracts means Poplar's bonds are first-loss on its own errors — skin in the game is structural.
- **Controls**: payouts only via arbitration outcome; reserve withdrawals (other than payouts) timelocked 30 days [tunable] and capped; operations wallet strictly separate.
- **Migration path**: exposure/loss accounting is per fact-class and per cohort from day one, producing the actuarial record an open underwriter market (Phase 4) prices against. When underwriters arrive, they take first-loss ahead of the reserve, which retreats to a backstop share — the v1 whitepaper's Treasury role, finally justified by data.

### D5. Legal shape (Phase 0 dependency)
Counsel confirms the warranty is a **bonded parametric warranty on stated facts**, not insurance (no indemnification of loss, payout triggered by fact-wrongness). Warranty terms enumerate sources, as-of semantics, term (12 months [tunable]), claim procedure, and exclusive parametric remedy. This work gates guarantee launch, not spine or rails work.

## E. Workstream: design partners and revenue

- **Profile**: on-chain RWA/mortgage lending protocols needing title-fact oracles; secondarily, crypto-native title/escrow startups. (Named targets and outreach state live in the private workspace, not here.)
- **Gate** (plan-v2 Phase 0): 2–3 design partners engaged before rails ship; their integration needs shape the oracle interface.
- **Oracle interface sketch**: read attested facts by `(parcelId, factClass)` from the registry (on-chain view + indexed API); buy guarantees programmatically; webhook/event stream for attestation state changes.
- **Revenue ladder**: data API subscriptions (earliest, boring, proven) → per-abstract guarantee fees (the differentiated product) → later: carrier partnership for TradFi distribution (out of scope here).

## F. Sequencing

| Milestone | Weeks (indicative) | Contents | Exit test |
|---|---|---|---|
| M0 | 0–4 | County scorecard + pick; source inventory; arbitration memo; counsel engaged on D5; design-partner conversations open | County chosen; memo decided |
| M1 | 4–12 | Ingestion + schema + normalization for wedge county; QA ledger running | §B4 bars trending green |
| M2 | 10–16 | Explorer public; data API alpha with design partners | External users querying weekly |
| M3 | 14–20 | Rails on Base Sepolia → mainnet; verification bot in self-audit; parameters set | Bot catches seeded errors end-to-end |
| M4 | 18–26 | Reserve seeded; guarantees live; first paid guarantee in a live deal | **Phase 1 exit criterion #4** |

Track B note: grove lending underwrites on these rails at Phase 2 — every M above de-risks that convergence before community funds depend on it.

## G. Open questions (consolidated)

1. County data terms: bulk-feed license vs scraping posture for the chosen county (resolves in M0).
2. Arbitration venue final call — UMA OOv3 vs pilot panel (M0 memo).
3. All §C4/§D parameters after counsel + design-partner input.
4. Abstract report format: adopt an ALTA-style layout for familiarity vs clean-sheet (customer-driven).
5. Search depth standard: full-chain vs 30-year search convention per fact class.
6. Whether the explorer lives at poplarlabs.xyz or its own domain (marketing call, M2).
7. Repo layout: `gateway/` top-level with `ingest/ spine/ explorer/ contracts/ bots/` — confirm at M1 start.
