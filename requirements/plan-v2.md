# Plan v2: Path to Groves (Draft)

*Working draft, written from scratch against the mission and top-level goal in [GOALS.md](../GOALS.md). Supersedes the risk-assessment framing in plan.md where they conflict. Revised 2026-07-06 after stress-testing; alternatives considered are recorded at the end.*

## Strategic logic

The causal chain (from GOALS.md): people want community and economic control → community lending is the draw and gathers land → land secures the community token → economically-guaranteed property records are the gateway that makes land trustworthy on chain.

Demand pulls each layer into existence. The plan runs two tracks that converge:

- **Track A — Gateway & revenue**: the records + guarantee protocol. First customers are **crypto-native** — on-chain RWA lending and tokenized-real-estate protocols that need a title oracle and have no incumbent solution — plus commodity **data-API subscriptions** (a proven business model). TradFi-facing guarantees come later, through a licensed carrier partnership, not head-on. Track A hardens the oracle with real money at stake and becomes the protocol's revenue engine.
- **Track B — Mission**: the first community lending pool in a legal wrapper, with the records protocol as its underwriting oracle.

They converge when community loans are underwritten on Track A's rails.

**Funding honesty**: Track A revenue cannot pay for initial development — sales arrive after the expensive part is built. Initial development is funded by pre-seed/grants (Base ecosystem grants are a natural fit). Track A revenue is the year-2 sustainability and credibility engine. Data-API subscriptions monetize earliest; guarantees follow.

**Defensibility**: Track A alone is a copyable data business; Track B alone is a credit union with extra steps. The moat is the combination — a records protocol that gives far-flung strangers a reason to trust a shared balance sheet. Neither track is allowed to grow into a standalone company.

## Phases

*Timeline honesty: Phases 0–3 span roughly 36–48 months, not 24. Legal wrappers, capital formation, licensing, and a compliant token offering do not parallelize as well as engineering does.*

### Phase 0 — Riskiest assumptions & legal architecture (months 0–4)

Test the assumptions that kill the plan fastest, in this order:

1. **Will a community commit real capital?** Run parallel conversations with both candidate personas — crypto-native network-communities (aligned, capitalized, far-flung, but flighty) and diaspora/lending-circle communities (proven pooled-lending behavior, deep trust, but token-indifferent). Instrument *which draw converts*: lending, land, or belonging. Pass criterion is committed capital, not enthusiasm.
2. **Will a crypto-native protocol pay for guaranteed title data?** Design-partner conversations with on-chain RWA/mortgage protocols. Pass: 2–3 signed design partners.
3. **Does the challenge market work where we'd launch?** Pick the wedge county for scrapeable, cheaply re-verifiable records; prototype automated cross-checking to confirm challenge costs are near zero.
4. **Do the legal wrappers survive counsel?** Stress the named defaults below with securities, banking, and insurance counsel.

Legal defaults (hypotheses to confirm or kill — these are architecture, not compliance details):

- **Lending pool**: CDFI-style loan fund or partnership with an existing chartered institution. A de novo credit union charter is a multi-year long shot; do not plan on it.
- **Community capital**: Reg CF first (up to $5M/yr), Reg A as it scales.
- **Community token**: a **security by design** — Reg A token or on-chain co-op shares. Economic control means securities compliance, not evasion.
- **TradFi-facing guarantees**: licensed title-carrier partnership (MGA model). Poplar is the data and pricing engine; the carrier holds the risk license.
- **Land**: community land trust for commons; LLCs for productive parcels.

### Phase 1 — Data spine & guarantee rails (months 3–12)

- Ingest and normalize the wedge county's records with full provenance; free public explorer; **paid data-API subscriptions** as first revenue. Depth in one county beats shallow national coverage.
- Deploy attestation contracts on Base: bonded attestations, challenge windows, arbitration escalation. **USDC-denominated — no native token yet.**
- Scope guarantees to what an optimistic oracle can honestly secure: **objectively re-verifiable public-record facts** — an economically-guaranteed title search/abstract (recorded liens, ownership-of-record, encumbrances as of a date). Not title validity, and not valuation (an opinion, not a fact — provide attested comparable data as evidence, never as a guaranteed claim).
- **First-party guarantees from a fee-funded protocol reserve.** No open underwriter market yet — the intersection of title expertise, capital, and crypto-nativity is empty at day one.
- **Milestone: a crypto-native lending protocol pays for guarantees used in live deals.**

### Phase 2 — Community lending pilot (months 9–24)

- Stand up the pilot community's lending pool in its legal wrapper; members contribute capital (Reg CF raise if public).
- **Geography flip**: far-flung members supply capital and governance; **borrowing concentrates in the grove's footprint** — one state, one licensing regime. Loans finance members' homes, buildings, and businesses *there*, so lending directly gathers land per the flywheel. Do not attempt multi-state lending against member property; that is an NMLS licensing program, not a pilot.
- Loans underwritten via the records protocol — this is where the tracks converge and the gateway proves its purpose.
- Repayment and yield come from external cash flows (member income, rents, business revenue). Hard design constraint: it is what keeps the flywheel non-reflexive.
- **Milestone: a community loan originated, collateral-verified on-chain, performing.**

### Phase 3 — Land & token (months 24–48)

- The community acquires shared parcels via the lending pool and pooled treasury, registered on-chain via the protocol.
- **Split the balance sheet.** Cash-flowing assets — the loan book, rental and productive property — back the token. Commons land sits in the CLT: governed, never financialized, never liquidated to honor redemptions. Land that *backs* must be sellable; land that *anchors* must never be sold. Conflating them is how the token floor and the community destroy each other.
- Launch the community token as a compliant security (Reg A or co-op shares on chain). Redemption via notice periods and NAV gates, building-society style — no promise of instant liquidity against illiquid assets.
- Far-flung participation proven: remote members hold governance and lending positions in a place they visit, not inhabit.
- **Milestone: a token whose floor is auditable on-chain against real, cash-flowing assets.**

### Phase 4 — The network (months 48+)

- Replicate the grove playbook; shared standards so groves interoperate — inter-community lending, portable reputation.
- Open the underwriter market once guarantee volume exists to price.
- Contributor incentives to expand county coverage — **flagged speculative**: where records are scrapeable, bots outcompete human miners; where they aren't, verification is too costly for a healthy challenge market. The realistic supply side may remain professional abstractors plus automation.
- Native protocol token only here, capitalizing an existing fee economy rather than bootstrapping one.

## Governing principles

- **Demand pulls each layer** — no layer is built before the one above it needs it.
- **External cash flows keep it honest** — loans repaid in outside value; guarantees sold to outside customers. Reflexive loops (token → land → token) are the failure mode to design against.
- **Real dollars before token** — USDC bonds and premiums first; tokens capitalize working economies. The community token, when it comes, is a security by design.
- **Regulation is architecture** — wrapper, licensing, and offering choices are Phase 0 decisions that shape the product, not compliance afterthoughts.
- **Guarantee only what is re-verifiable** — the oracle's honesty boundary is the product's scope. Facts, not opinions; abstracts, not title validity.
- **Scope the gateway to underwriting** — external data revenue funds the mission; it is not a pivot into a data company. Neither track becomes a standalone startup.
- **One county, one community, deep** — before many, shallow.
- **Capital is far-flung; borrowing is local** — members participate from anywhere; loans concentrate where the land is.

## Alternatives considered

**Alt 1 — Community-first, records-later (strict demand-pull).** Start the community and lending pool immediately on existing trust rails — title-insurer partner, county recordings, co-op wrapper — with ledger and governance on Base but no decentralized oracle; build the records protocol in year 2–3 against a live internal customer. *Cheapest, fastest test of the actual bet, and the strongest plan for the mission alone.* Not chosen because it demotes the settled top-level goal and weakens the far-flung trust story early (members must trust an operator). It remains the benchmark: every month spent on oracle infrastructure before the first community loan must justify itself against this alternative.

**Alt 2 — Crypto-native beachhead (adopted into Track A).** Skip TradFi customers; sell the title oracle to on-chain RWA lending and tokenized-real-estate protocols — crypto-native buyers with no incumbent solution and short sales cycles — then launch Poplar's own community lending as the flagship customer. Adopted: this is now Track A's go-to-market. Residual risk: dependency on RWA-market growth.

**Alt 3 — Land DAO first (buy-side first).** Pool capital, buy the first grove's parcels in a wrapped entity, token = share in the land co-op; the records protocol starts as a tiny internal tool proving holdings to far-flung members; lending comes later. Emotionally the strongest acquisition hook and the smallest honest oracle scope — but CityDAO is the cautionary tale: land plus governance without an economic engine stalls. Deferred: land acquisition is a Phase 3 mechanic funded by a working lending engine, not the lead.

**Alt 4 — TradFi insurtech frontal assault (rejected).** Build the data+pricing engine and sell instant title decisions to mainstream lenders, competing with title insurance directly. Doma/States Title tried this with vast VC funding and retreated — incumbent relationships, state-by-state regulation, and thin margins make it a capital war, and the wrong fight for a mission-driven team. Rejected as a strategy; its one useful mechanism — the licensed-carrier (MGA) partnership — is retained for later TradFi distribution.

## What would kill it

| Risk | Watch for | Mitigation |
|---|---|---|
| Reflexivity / run dynamics | Token value depending on inflows rather than external cash flow; redemptions forcing asset sales | Balance-sheet split (productive assets back the token; commons never do); external-repayment constraint; notice periods and NAV gates |
| Regulation | Pooled lending = banking; asset-backed token = security; indemnifying data = insurance; multi-state mortgage licensing | Named legal defaults tested in Phase 0; security-by-design token; carrier partner for TradFi; borrowing confined to the grove's footprint |
| Oracle challenge economics | Expensive-to-verify assertions going unchallenged — a rubber-stamp oracle | Launch only on scrapeable counties where re-verification is near-free; automated cross-checking; insurance prices residual risk; seed paid challengers |
| Affinity demand thinner than hoped | Communities excited but not wiring capital; lending not actually the draw | Phase 0 gate is committed capital; instrument which draw converts (lending, land, belonging) and lead with what does |
| Two-startups trap | Track A or B growing into a full company and starving the other | Track A scoped to crypto-native customers + data API; convergence milestone (community loan on protocol rails) is the plan's center of gravity |
| Doma precedent | Frontal competition with title insurance | Don't. Carrier partnership or nothing on the TradFi side |
| CityDAO precedent | Holding land without an economic engine or real governance | Land acquisition only after the lending engine works; parcels must cash-flow or serve a governed commons purpose |
| Gateway underinvestment | "Only the gateway" read as "easy" — it is the hardest technical piece and the token's floor rests on it | Track A milestones with real external money at stake before community funds depend on the oracle |
| Funding gap | Expecting guarantee revenue to fund year-1 development | Pre-seed/grants for initial build; data-API revenue first; guarantees as year-2 revenue |
