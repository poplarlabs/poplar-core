# Poplar: Groves

*A manifesto and roadmap for communities that own their economy — and for the property records protocol that makes them possible.*

> **Draft.** The vision and architecture here are settled ([GOALS.md](../GOALS.md)); the mechanisms are not. Boxes marked **Placeholder** are honest gaps — protocol, legal, and economic detail to be finalized as the plan ([plan-v2.md](plan-v2.md)) executes. The v1 mechanism sketch, retained as the design reference for the open underwriting market, is preserved at [archive/whitepaper-v1.md](archive/whitepaper-v1.md).

## I. The problem of placeless community

We became very good at finding our people and very bad at building with them.

The internet solved discovery. Whoever you are, whatever you care about, you can find the thousand people in the world who see it the way you do. What you cannot do — almost anywhere, almost ever — is build lasting shared wealth with them. Online communities own nothing together. They generate belonging, culture, sometimes livelihoods; none of it compounds. The group chat is immortal, and everything it builds is rented.

Meanwhile the places people actually live drift the other way. Local economies are owned from far away. A generation is priced out of the towns it grew up in. The neighbor is a stranger and the landlord is an index fund.

For two centuries, ordinary people had institutions built for exactly this problem — pooling savings, extending credit to each other, holding land in common, turning belonging into a balance sheet. Building societies, credit unions, lending circles, mutual aid societies, land trusts. Every one of them shared a single design constraint: **everyone had to live in the same place.** Geography was the trust technology. You lent to people you could see at church, at the pub, at the market. When people scattered, the trust thinned, and the institutions consolidated, demutualized, or died.

So we are left holding two halves of something: communities without economies, and economies without communities.

Poplar exists to join them.

## II. The bet

Poplar's thesis is a chain of four claims. Each one pulls the next into existence.

1. **Demand.** People want to commune with others like them — even far-flung — and gain real economic control: community lending, shared ownership, a stake in what grows together. This desire is old; only its geography is new.
2. **Flywheel.** Community lending is both the draw and the engine. It attracts members, and it finances the acquisition of land — homes, workshops, gathering places — in the community's chosen footprint.
3. **Backing.** Gathered land secures the community's token. Real, cash-flowing collateral gives it a floor — the difference between a community currency and a community meme.
4. **Gateway.** None of this works unless far-flung people can trust claims about land they cannot walk past: who owns it, what encumbers it, what it's worth holding against. Economically-guaranteed property records are the trust bridge that puts real-world land ownership on chain — so land can actually function as collateral and token backing.

Read bottom-up, it is a technology stack. Read top-down, it is a story: people gather, the gathering lends, the lending buys land, and the land makes the gathering permanent.

We call the result a **grove**: a real, land-based community whose members live anywhere, govern together, lend to one another, and share in what grows. The name is how poplars actually live: a stand of aspens — Pando, in Utah, is the famous one — looks like thousands of separate trees and is a single organism underground, one root system thousands of years old. Scattered above ground; one thing at the root.

A grove is a hometown you choose. You do not have to move to belong. But there is somewhere to go.

## III. We are not inventing this

Every piece of the grove has been built before, by people with far less technology and far more trust. The lineage matters — both for what it proves and for how it failed.

**Building societies** were born in a Birmingham pub in 1775, when the members of Ketley's society began pooling weekly subscriptions to build one another houses, drawing lots for who built next, dissolving when every member was housed. They proved that ordinary savings plus mutual credit reliably produces homes — and out of them grew a movement that housed a large share of a nation.

**Cooperative banks and credit unions** — Raiffeisen's rural lending cooperatives in 1860s Germany, and the credit union movements that followed worldwide — proved that character-based lending inside a community can underwrite what distant banks won't touch, and that member-owned finance can scale into systems serving hundreds of millions.

**Lending circles** — the tanda, the susu, the hui, the chit fund, the ekub — are credit older than banks, still moving billions today among people banks refuse to see. They prove the demand side of Poplar's bet is not speculative: pooled, trust-based community credit is close to a human universal.

**Mutual aid and friendly societies** proved that belonging and a balance sheet reinforce each other — that a community that insures its members' bad days earns a loyalty no product ever has.

**Community land trusts** — from New Communities Inc., founded in 1969 out of the civil rights movement in Albany, Georgia, to the large urban trusts operating today — proved a subtle and essential design principle: land that anchors a community should be held apart from land that transacts. The commons is governed, not traded.

Two failure modes run through this entire history, and Poplar is designed against both:

- **Trust never scaled past proximity.** Every institution above worked because members could watch each other. None survived their members dispersing.
- **Success demutualized.** The UK building societies that converted to banks in the 1980s and 90s — every large one of them — had failed or been absorbed by the time the 2008 crisis was done with them. Northern Rock was a building society once. When the institution outgrows the community, the community loses the institution.

The modern attempts complete the picture. The network state movement proved the demand among the internet-native. DeFi proved that far-flung strangers can coordinate billions in capital — and that capital without belonging just chases yield. CityDAO proved that buying land without an economic engine produces a very expensive group chat. And Doma proved that attacking title insurance head-on, with venture capital and machine learning, is a way to spend nine figures finding out how strong the incumbents are.

What was missing — the primitive none of these had — is a way for far-flung people to trust claims about land without a local operator vouching for them. That is the piece Poplar builds first.

## IV. What Poplar builds

Four layers, in the order demand pulls them into existence.

### Layer 1 — The gateway: property records you can stake value on

Public property records are the raw truth about land — and they are fragmented across thousands of counties, slow to search, and carry no warranty. An entire industry exists to bridge that gap: title insurance collects on the order of twenty billion dollars a year in US premiums, with loss ratios in the low single digits. Its product is distrust of the public record, priced generously.

Poplar makes property facts **legible and economically guaranteed**:

- **Attest optimistically.** An asserter posts a claim about a parcel — recorded liens, ownership-of-record, encumbrances as of a date — with a bond behind it. The claim stands unless challenged within a window; challenges escalate to arbitration; wrong claims forfeit the bond. Verification cost is paid only when someone cares. Contracts live on Base; bonds and fees are USDC.
- **Guarantee only what can be re-verified.** The protocol warrants an economically-guaranteed *title abstract* — the completeness and accuracy of a search over public records. It does not warrant title validity, and it does not warrant opinions of value. The oracle's honesty boundary is the product's scope.
- **Insure from a reserve first.** Early guarantees are first-party, backed by a fee-funded protocol reserve. An open underwriting market — outside participants staking against specific guarantees and earning premiums, as designed in [the v1 whitepaper](archive/whitepaper-v1.md) — follows once there is volume to price.
- **Sell where the need is native.** The first consumers are on-chain lending and real-world-asset protocols, which need exactly this oracle and have no incumbent to defect from. Traditional lenders come later, through licensed carrier partnerships — alongside the guarantee, the clean data itself is a product. This revenue sustains the protocol's development before the lending flywheel spins.

> **Placeholder — protocol detail.** Bond sizing and schedules; challenge-window durations; arbitration venue (UMA's oracle vs. purpose-built); reserve capitalization ratios and payout waterfall; attestation data schema; fee and data-licensing structure. To be specified in Phase 1 design work.

### Layer 2 — The flywheel: community lending

This is what people join for. Members pool capital from anywhere; the pool lends where the grove is.

- **Capital is far-flung; borrowing is local.** Loans finance members' homes, workshops, and businesses inside the grove's footprint — one jurisdiction, one licensing regime — so that every loan gathers land and deepens the place.
- **Repayment comes from outside.** Interest and principal are paid from members' income, rents, and business revenue — external cash flows, not recycled token value. This is the rule that kept building societies solvent for two centuries and its absence is what makes ponzis. It is not negotiable.
- **Underwriting runs on the gateway.** Every loan's collateral is verified through the records protocol — the moment the two tracks of Poplar's plan converge, and the gateway proves what it's for.

> **Placeholder — legal and practical detail.** Final lending-vehicle form (CDFI-style loan fund vs. chartered-institution partnership); community capital mechanics (Reg CF, then Reg A); underwriting standards and rate policy; member eligibility and accreditation boundaries; servicing and default handling inside a community (the hardest social design problem here, not the easiest). To be resolved in Phase 0 with counsel and the pilot community.

### Layer 3 — The backing: land and the token

A community token must answer one question honestly: *what stands behind this?* Poplar's answer separates two kinds of land that history says must never be confused:

- **Assets that back** — the loan book, rental and productive property. Cash-flowing, sellable, independently auditable. These give the token its floor.
- **Commons that anchor** — the gathering places, the square, the hall. Held in a community land trust: governed by the community, never financialized, and never — under any redemption pressure — sold. Land that backs must be sellable; land that anchors must not be. A token floor built on the village square is a mechanism for destroying the village.

The community token is a claim on the productive balance sheet and a voice in governance. It is a **security by design** — registered or exempt, not disguised — because economic control was always the point, and pretending otherwise just postpones the conversation to a worse venue. Redemption works the way it worked for building societies: notice periods and NAV gates, no promise of instant liquidity against illiquid assets — but with the books auditable on chain by any member, anywhere, at any hour. That is the part the nineteenth century couldn't do.

> **Placeholder — token and governance detail.** Legal form (Reg A security vs. on-chain cooperative shares); NAV methodology and audit cadence; notice periods and gate mechanics; the governance boundary between token-holders and residents (who decides local, physical matters — an open question we consider foundational, not procedural); treasury policy; anti-demutualization provisions in the founding documents.

### Layer 4 — The network

One grove is a community. Many groves, sharing rails, are an economy.

- Shared standards let groves recognize one another: portable membership and reputation, inter-grove lending, common registries.
- Every new grove strengthens the records protocol; the records protocol makes each next grove cheaper to found. The gateway becomes commons infrastructure for everyone putting land on chain.
- A protocol-level token comes **last**, capitalizing a working fee economy — never bootstrapping a hoped-for one.

> **Placeholder — network detail.** Inter-grove standards; federation governance; protocol-token design, distribution, and timing; the relationship between grove tokens and the protocol token. Deliberately unspecified until multiple groves exist.

## V. Principles

1. **Demand pulls each layer.** Nothing is built before the layer above needs it.
2. **External cash flows keep it honest.** Loans are repaid in outside value; guarantees are sold to outside customers. Reflexive loops are the failure mode.
3. **Real dollars before tokens.** Tokens capitalize working economies.
4. **Regulation is architecture.** The token is a security on purpose; the wrappers are chosen before the code.
5. **Guarantee only what can be re-verified.** Facts, not opinions; abstracts, not title validity.
6. **Land that anchors is never sold.** The commons is not collateral.
7. **Capital is far-flung; borrowing is local.**
8. **One county, one community, deep** — before many, shallow.
9. **The institution must never outgrow the community.** Demutualization is failure with extra steps; the founding documents should make it structurally hard.

## VI. The path

The operational plan lives in [plan-v2.md](plan-v2.md); the shape of it:

- **Phase 0 — Prove the assumptions** (months 0–4). A community that commits real capital, not enthusiasm; crypto-native design partners for guaranteed title data; a wedge county where records are cheaply re-verifiable; legal wrappers that survive counsel.
- **Phase 1 — The gateway** (months 3–12). One county ingested deep, attestation rails on Base, first-party guarantees, first paying protocol customers.
- **Phase 2 — The flywheel** (months 9–24). The pilot community's lending pool, first loans in the grove's footprint, collateral verified on chain, repayment from outside income.
- **Phase 3 — Land and the token** (months 24–48). Shared parcels acquired, the balance sheet split between backing and commons, a compliant community token with an auditable floor.
- **Phase 4 — The network** (48+). More groves, shared standards, open underwriting, and only then a protocol token.

The honest timeline through Phase 3 is three to four years. Anyone promising a village faster is selling one.

## VII. What could kill this

Candor is cheaper than a post-mortem:

- **Reflexivity.** If the token's value ever depends on new inflows rather than external cash flow, it is a run waiting for a trigger. The balance-sheet split, the outside-repayment rule, and redemption gates exist for this — and must survive every future governance vote.
- **Regulation.** Pooled lending is banking; an asset-backed token is a security; indemnifying data is insurance. Poplar treats all three as design inputs. The failure mode is not enforcement; it is discovering the constraint after the architecture is poured.
- **Oracle economics.** Guarantees on facts that are expensive to re-verify go unchallenged, and an unchallenged oracle is a rubber stamp. Launch only where re-verification is nearly free; pay professional challengers before assuming volunteers.
- **Thin demand.** Communities may cheer and not wire. The only demand signal Poplar accepts is committed capital — and Phase 0 tests *which* draw actually converts: the lending, the land, or the belonging.
- **The precedents' own warnings.** CityDAO: land without an engine stalls. Doma: don't fight title insurance head-on. The demutualized building societies: institutions drift from their members unless drift is made structurally difficult.

## VIII. An invitation

Poplar is built with communities, not for them.

If you are a community — online or on the ground — that wants more than a chat: a place, a pool, a say. If you are a protocol that needs land it can trust on chain. If you are a lawyer, an underwriter, an abstractor, an economist who sees the holes in this document and can name them precisely. If you are a skeptic with receipts.

The records come first, but the records are not the point. The point is the oldest human project there is — people who choose each other, building somewhere to stand — finally available to people who found each other late, and far away.

---

## Appendix: what remains to be specified

Consolidated from the placeholders above; each is an open workstream, not an oversight.

| Area | Open items | Resolved by |
|---|---|---|
| Gateway protocol | Bond sizing; challenge windows; arbitration venue; reserve ratios; attestation schema; fee and data-licensing structure | Phase 1 design |
| Lending | Vehicle form (CDFI-style vs. chartered partner); Reg CF/Reg A mechanics; underwriting standards; rates; eligibility; community default handling | Phase 0 counsel + pilot community |
| Token & governance | Legal form; NAV methodology; notice/gate mechanics; token-holder vs. resident governance boundary; treasury policy; anti-demutualization provisions | Phase 2–3 design |
| Network | Inter-grove standards; federation governance; protocol-token design and timing | Deferred until multiple groves exist |
| Naming | Token naming and branding (the v1 "ROOT" designation is not settled) | Before Phase 3 |

Related documents: [GOALS.md](../GOALS.md) (mission, settled) · [plan-v2.md](plan-v2.md) (operational plan) · [archive/whitepaper-v1.md](archive/whitepaper-v1.md) (v1 mechanism sketch; underwriting-market reference).
