import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F7F2] to-white">
      {/* Back to Home Link */}
      <div className="container mx-auto px-6 py-6">
        <Link href="/" className="inline-flex items-center text-[#6B8E23] hover:text-[#556B2F] transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Whitepaper Content */}
      <article className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#556B2F] mb-8" id="title">Poplar Phase 1: <br/>A Decentralized Protocol for Property Records</h1>

        <section className="mb-12" id="abstract">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">Abstract</h2>
          <p className="text-[#6B8E23] leading-relaxed mb-6">
            Poplar is a protocol and application designed to improve property record management using blockchain technology. It enables secure, transparent, and immutable tracking of property titles, ownership, and detailed property information. Using the <strong>Poplar Root Token (ROOT)</strong>, contributors (<strong>Submitters</strong>) stake tokens to propose data. Validation occurs on-demand when users (<strong>Consumers</strong>) pay a fee. <strong>Validators</strong> stake ROOT to vote on data accuracy, and <strong>Challengers</strong> can stake ROOT to dispute data. Rewards are distributed for valid contributions, favoring recent data. This proof-of-stake (PoS) system uses community-driven consensus and slashes stakes for incorrect submissions or votes, deterring fraud and fostering trust in real estate data.
          </p>
        </section>

        <section className="mb-12" id="introduction">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">Introduction</h2>
          <p className="text-[#6B8E23] leading-relaxed mb-6">
            Property records are crucial for real estate markets but often face inefficiencies, opacity, and vulnerability to errors or fraud in traditional centralized systems. Poplar addresses these issues using a decentralized blockchain solution, combining security with scalable, low-cost transactions. The system utilizes the ROOT token within an incentive structure involving staking, fees, validation voting, and challenges to ensure data integrity. Poplar aims to provide a stable, community-driven foundation for property data management. This whitepaper outlines the protocol's architecture, token economics, anti-fraud mechanisms, technical implementation, and analyzes its strengths and risks.
          </p>
        </section>

        <section className="mb-12" id="overview">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">High-Level Overview (Conceptual)</h2>
          <p className="text-[#6B8E23] leading-relaxed mb-4">
            Poplar operates on a simple principle: data is submitted, validated only when needed, and maintained through economic incentives.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-[#6B8E23]">
            <li className="leading-relaxed">
              <strong>Submission</strong>: A Submitter stakes ROOT tokens to add property information to the system. This data initially exists in an unvalidated state.
            </li>
            <li className="leading-relaxed">
              <strong>Demand & Validation Trigger</strong>: A Consumer needing verified data pays a ROOT fee (<code>V_fee</code>). This fee signals the data's value and initiates the validation process. Alternatively, a Challenger can stake ROOT (<code>Chal_stake</code>) to dispute data they believe is incorrect, also triggering validation.
            </li>
            <li className="leading-relaxed">
              <strong>Validation & Consensus</strong>: ROOT token holders act as Validators. They stake ROOT (<code>Val_stake</code>) and vote on the data's accuracy. A consensus mechanism (e.g., majority vote) determines the outcome.
            </li>
            <li className="leading-relaxed">
              <strong>Outcome & Incentives</strong>:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>If validated/challenge fails: The Submitter gets their stake back plus rewards (from <code>V_fee</code>/slashed stakes). Correct Validators share the remaining rewards. Incorrect Validators/failed Challengers lose their stake.</li>
                <li>If invalidated/challenge succeeds: The Submitter loses their stake. The successful Challenger receives a significant reward (from the slashed <code>S_stake</code>). Correct Validators share rewards. Incorrect Validators lose their stake.</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="mb-12" id="use-cases">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">Use Cases</h2>
          <p className="text-[#6B8E23] leading-relaxed mb-4">
            Poplar's verified property data can support various applications:
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-[#6B8E23]">
            <li className="leading-relaxed"><strong>Real Estate Transactions</strong>: Buyers and sellers can verify titles and property details for secure and efficient transactions.</li>
            <li className="leading-relaxed"><strong>Lending and Mortgages</strong>: Financial institutions can reliably verify property ownership, liens, and characteristics for loan underwriting.</li>
            <li className="leading-relaxed"><strong>Property Management</strong>: Owners and managers can maintain accurate records of property history and condition.</li>
            <li className="leading-relaxed"><strong>Insurance</strong>: Insurers can access verified data for risk assessment and claims processing.</li>
            <li className="leading-relaxed"><strong>Urban Planning and Government Services</strong>: Municipalities can utilize transparent and up-to-date property data for planning, taxation, and public records.</li>
            <li className="leading-relaxed"><strong>Dispute Resolution</strong>: Immutable, validated records can serve as a trusted source of evidence in legal disputes.</li>
          </ol>
        </section>

        <section className="mb-12" id="participant-roles">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">Participant Roles and Incentives</h2>
          <p className="text-[#6B8E23] leading-relaxed mb-6">
            The Poplar protocol uses the ROOT token within a system of incentives and penalties to ensure accurate and current property data.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-3">Submission Incentives</h3>
              <ul className="list-disc pl-6 space-y-2 text-[#6B8E23]">
                <li className="leading-relaxed"><strong>Goal</strong>: Encourage contribution of accurate, recent, and well-sourced property information.</li>
                <li className="leading-relaxed"><strong>Mechanism</strong>: Submitters stake ROOT (<code>S_stake</code>) to add data. They are rewarded (from <code>V_fee</code> pool, potentially subsidized initially) only when their data is successfully validated following Consumer demand.</li>
                <li className="leading-relaxed"><strong>Disincentive</strong>: Submitting inaccurate data risks losing the <code>S_stake</code> if validation fails or a challenge succeeds.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-3">Validation Incentives</h3>
              <ul className="list-disc pl-6 space-y-2 text-[#6B8E23]">
                <li className="leading-relaxed"><strong>Goal</strong>: Ensure diligent verification when requested by a Consumer and achieve robust consensus.</li>
                <li className="leading-relaxed"><strong>Consumer Role</strong>: Consumers trigger validation by paying a ROOT fee (<code>V_fee</code>), funding the verification.</li>
                <li className="leading-relaxed"><strong>Validator Role</strong>: Validators stake ROOT (<code>Val_stake</code>) and vote on data accuracy. They are rewarded proportional to their stake only if they vote with the majority outcome.</li>
                <li className="leading-relaxed"><strong>Disincentive</strong>: Validators lose their staked ROOT (<code>Val_stake</code>) if they vote against the final consensus.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-3">Challenge Incentives</h3>
              <ul className="list-disc pl-6 space-y-2 text-[#6B8E23]">
                <li className="leading-relaxed"><strong>Goal</strong>: Enable community policing to correct recently submitted invalid data.</li>
                <li className="leading-relaxed"><strong>Mechanism</strong>: Challengers stake ROOT (<code>Chal_stake</code>) and provide evidence to initiate validation for data they deem incorrect.</li>
                <li className="leading-relaxed"><strong>Reward</strong>: Successful challenges yield a significant reward, primarily from the original Submitter's slashed <code>S_stake</code>.</li>
                <li className="leading-relaxed"><strong>Disincentive</strong>: Challengers lose their <code>Chal_stake</code> if the challenge fails, discouraging frivolous disputes.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12" id="token-economics">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">Token Economics (ROOT)</h2>
          <p className="text-[#6B8E23] leading-relaxed mb-6">
            The <strong>Poplar Root Token (ROOT)</strong> powers the ecosystem through various mechanisms:
          </p>

          <div className="bg-white/60 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-[#556B2F] mb-4">Core Utility</h3>
            <ul className="list-disc pl-6 space-y-2 text-[#6B8E23]">
              <li className="leading-relaxed"><strong>Staking</strong>: By Submitters, Validators, Challengers</li>
              <li className="leading-relaxed"><strong>Fees</strong>: Paid by Consumers (<code>V_fee</code>, <code>A_fee</code>)</li>
              <li className="leading-relaxed"><strong>Rewards</strong>: Distributed to participants for accurate contributions</li>
              <li className="leading-relaxed"><strong>Slashing</strong>: Forfeiture of staked ROOT for invalid submissions, incorrect votes, or failed challenges</li>
            </ul>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white/60 rounded-lg">
              <thead>
                <tr className="text-left border-b border-[#6B8E23]/20">
                  <th className="p-4 text-[#556B2F] font-semibold">Role</th>
                  <th className="p-4 text-[#556B2F] font-semibold">Action</th>
                  <th className="p-4 text-[#556B2F] font-semibold">Token Flow (In)</th>
                  <th className="p-4 text-[#556B2F] font-semibold">Token Flow (Out)</th>
                </tr>
              </thead>
              <tbody className="text-[#6B8E23]">
                <tr className="border-b border-[#6B8E23]/20">
                  <td className="p-4">Submitter</td>
                  <td className="p-4">Stake to submit data</td>
                  <td className="p-4">-</td>
                  <td className="p-4">Stake <code>S_stake</code> ROOT</td>
                </tr>
                <tr className="border-b border-[#6B8E23]/20">
                  <td className="p-4">Consumer</td>
                  <td className="p-4">Pay for validation</td>
                  <td className="p-4">-</td>
                  <td className="p-4">Pay <code>V_fee</code> ROOT</td>
                </tr>
                <tr className="border-b border-[#6B8E23]/20">
                  <td className="p-4">Validator</td>
                  <td className="p-4">Vote correctly</td>
                  <td className="p-4">Share of <code>V_fee</code> pool</td>
                  <td className="p-4">Stake <code>Val_stake</code> ROOT</td>
                </tr>
                <tr>
                  <td className="p-4">Challenger</td>
                  <td className="p-4">Challenge succeeds</td>
                  <td className="p-4"><code>P%</code> of <code>S_stake</code></td>
                  <td className="p-4">Stake <code>Chal_stake</code> ROOT</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12" id="anti-fraud">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">Anti-Fraud Mechanisms</h2>
          <p className="text-[#6B8E23] leading-relaxed mb-6">
            Poplar employs several mechanisms to ensure data integrity:
          </p>
          <ul className="list-disc pl-6 space-y-4 text-[#6B8E23]">
            <li className="leading-relaxed">
              <strong>Staking</strong>: Requires Submitters (<code>S_stake</code>), Validators (<code>Val_stake</code>), and Challengers (<code>Chal_stake</code>) to lock ROOT, making malicious actions costly. Minimum stakes deter Sybil attacks.
            </li>
            <li className="leading-relaxed">
              <strong>Slashing</strong>: Penalizes incorrect submissions, incorrect validation votes, or failed challenges through stake forfeiture, providing strong economic disincentives against fraud or negligence.
            </li>
            <li className="leading-relaxed">
              <strong>Challenge System</strong>: Empowers the community to identify and rectify incorrect data, rewarding successful challenges from the incorrect Submitter's slashed stake.
            </li>
            <li className="leading-relaxed">
              <strong>Transparency</strong>: All submissions, stakes, votes, and outcomes are recorded immutably on the blockchain for public scrutiny.
            </li>
          </ul>
        </section>

        <section className="mb-12" id="technical">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">Technical Implementation</h2>
          <div className="space-y-6 text-[#6B8E23]">
            <div className="bg-white/60 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#556B2F] mb-3">Core Components</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li className="leading-relaxed">
                  <strong>Blockchain</strong>: A suitable public blockchain platform providing security, scalability, and smart contract capabilities.
                </li>
                <li className="leading-relaxed">
                  <strong>Smart Contracts</strong>: Manage staking, voting, fee distribution, slashing, challenges, and data pointers.
                </li>
                <li className="leading-relaxed">
                  <strong>Frontend</strong>: A decentralized application (dApp) interface for user interactions (submission, validation requests, challenges, data viewing).
                </li>
                <li className="leading-relaxed">
                  <strong>Storage</strong>: Decentralized storage solutions (e.g., IPFS) for large data files, linked via on-chain hashes.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12" id="roadmap">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">Roadmap</h2>
          <div className="space-y-8 text-[#6B8E23]">
            <div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-3">Phase 1 (Testnet)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li className="leading-relaxed">Deploy core smart contracts on a test network</li>
                <li className="leading-relaxed">Onboard initial datasets</li>
                <li className="leading-relaxed">Test submission, validation, and challenge flows</li>
                <li className="leading-relaxed">Gather community feedback</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-3">Phase 2 (Mainnet Launch)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li className="leading-relaxed">Deploy audited contracts to the main blockchain</li>
                <li className="leading-relaxed">Enable core functionalities: data submission with staking, consumer-paid validation, validator voting/rewards/slashing, challenge mechanism</li>
                <li className="leading-relaxed">Implement bootstrapping incentives</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-3">Phase 3 (Expansion & Features)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li className="leading-relaxed">Enhance dApp usability</li>
                <li className="leading-relaxed">Explore integrations with external data sources/oracles</li>
                <li className="leading-relaxed">Develop advanced features (e.g., smart contract-based transactions like escrow)</li>
                <li className="leading-relaxed">Pursue broader adoption and partnerships</li>
                <li className="leading-relaxed">Refine governance model</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12" id="conclusion">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">Conclusion</h2>
          <p className="text-[#6B8E23] leading-relaxed mb-6">
            Poplar proposes a decentralized property record system using blockchain technology for improved efficiency, transparency, and fraud resistance. Its core strength lies in the ROOT token incentive system, aligning Submitter, Consumer, Validator, and Challenger actions with data accuracy through staking, fees, rewards, and slashing. The on-demand validation model focuses resources efficiently. While challenges like parameter tuning and governance require careful planning and community input, the architecture provides a solid foundation. Poplar has the potential to significantly enhance public property information management by creating a self-regulating, trustworthy ecosystem.
          </p>
        </section>

        {/* Table of Contents - Fixed on the right side */}
        <div className="hidden lg:block fixed top-24 right-8 w-64 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-[#556B2F] mb-4">Contents</h3>
          <nav className="space-y-2">
            <a href="#title" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">Title</a>
            <a href="#abstract" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">Abstract</a>
            <a href="#introduction" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">Introduction</a>
            <a href="#overview" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">High-Level Overview</a>
            <a href="#use-cases" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">Use Cases</a>
            <a href="#participant-roles" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">Participant Roles</a>
            <a href="#token-economics" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">Token Economics</a>
            <a href="#anti-fraud" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">Anti-Fraud Mechanisms</a>
            <a href="#technical" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">Technical Implementation</a>
            <a href="#roadmap" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">Roadmap</a>
            <a href="#conclusion" className="block text-sm text-[#6B8E23] hover:text-[#556B2F]">Conclusion</a>
          </nav>
        </div>
      </article>
    </div>
  );
}
