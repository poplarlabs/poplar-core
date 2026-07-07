import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poplar — The vision: groves',
  description:
    'A grove is a hometown you choose — a community that owns things together, wherever its people live. What groves are, how they work, and why you can trust them.',
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-[0.18em] uppercase text-poplar-moss mb-3">{children}</p>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-2xl md:text-3xl text-poplar-text mt-16 mb-6 scroll-mt-24">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-poplar-text/85 leading-relaxed mb-5 text-[1.0625rem]">{children}</p>;
}

const TOC = [
  ['problem', 'Finding people is easy. Building with them isn’t.'],
  ['grove', 'What a grove is'],
  ['works', 'How a grove works'],
  ['before', 'This worked before'],
  ['trust', 'Built to be trusted'],
  ['now', 'Where this stands'],
  ['invite', 'An invitation'],
];

export default function Vision() {
  return (
    <div className="min-h-screen bg-poplar-cream">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo-transparent.png"
              alt="Poplar logo"
              width={32}
              height={32}
              className="h-8 w-8"
              style={{ objectFit: 'contain' }}
              quality={100}
            />
            <span className="text-2xl font-display text-poplar-text">Poplar</span>
          </Link>
          <Link href="/" className="inline-flex items-center text-poplar-text hover:text-poplar-button transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
            Home
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10 lg:flex lg:gap-12">
        {/* Table of contents */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-10">
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-poplar-moss mb-4">Contents</p>
            <nav className="space-y-2">
              {TOC.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="block text-sm text-poplar-text/70 hover:text-poplar-button transition-colors leading-snug">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Article */}
        <article className="max-w-2xl">
          <Eyebrow>The Poplar vision</Eyebrow>
          <h1 className="font-display text-4xl md:text-5xl text-poplar-text leading-tight mb-6">
            Groves
          </h1>
          <p className="text-lg text-poplar-text/75 leading-relaxed mb-2 italic">
            A grove is a hometown you choose — a community that owns things together,
            wherever its people live.
          </p>

          <H2 id="problem">Finding people is easy now. Building with them isn&rsquo;t.</H2>
          <P>We became very good at finding our people and very bad at building with them.</P>
          <P>
            The internet solved the finding. Whoever you are, whatever you care about, you
            can find the thousand people in the world who see it the way you do. What you
            can&rsquo;t do — almost anywhere, almost ever — is build lasting shared wealth with
            them. Online communities own nothing together. They create belonging, culture,
            sometimes livelihoods; none of it compounds. The group chat is immortal, and
            everything it builds is rented.
          </P>
          <P>
            Meanwhile the places people actually live drift the other way. Local economies
            are owned from far away. A generation is priced out of the towns it grew up in.
            The neighbor is a stranger and the landlord is an index fund.
          </P>
          <P>
            It wasn&rsquo;t always like this. For two centuries, ordinary people had institutions
            for exactly this — pooling savings, lending to each other, holding land in
            common, turning belonging into something you could build on. Building societies,
            credit unions, lending circles, land trusts. Every one of them had a single
            requirement: <strong>everyone had to live in the same place.</strong> You lent
            to people you could see at church, at the pub, at the market. When people
            scattered, the trust thinned, and the institutions faded.
          </P>
          <P>
            So we&rsquo;re left holding two halves of something: communities without economies,
            and economies without communities.
          </P>
          <P>A grove joins them.</P>

          <H2 id="grove">What a grove is</H2>
          <P>
            A grove is a community that owns things together: a lending pool that helps
            members buy homes and start businesses, common ground held in trust, and a real
            say in how both grow. It&rsquo;s run by its members — the ones who live there, and
            the ones who haven&rsquo;t moved yet.
          </P>
          <P>
            Picture it. A few hundred people who found each other — around a craft, a faith,
            a hometown they left behind, an idea about how to live — choose a real place on
            the map. They put in what they can. The pool makes its first loans: a member&rsquo;s
            down payment, a workshop, a café on the square. Some members move there. Some
            visit every summer. Some may never go at all. Every one of them holds a stake in
            what&rsquo;s growing, and a vote in where it goes.
          </P>
          <P>
            The name is how poplars actually live. A stand of aspens — Pando, in Utah, is
            the famous one — looks like thousands of separate trees, and is really a single
            organism underground: one root system, thousands of years old. Scattered above
            ground; one thing at the root.
          </P>
          <P>You don&rsquo;t have to move to belong. But there&rsquo;s always somewhere to go.</P>

          <H2 id="works">How a grove works</H2>
          <ul className="list-disc pl-6 space-y-4 text-poplar-text/85 leading-relaxed mb-5 text-[1.0625rem]">
            <li>
              <strong>You join with people you trust.</strong> A grove starts from a real
              community — people who already know each other, or found each other around
              something real — not a crowd of strangers.
            </li>
            <li>
              <strong>Members pool savings from anywhere.</strong> The pool lends where the
              grove is: mortgages for members&rsquo; homes, loans for workshops and small
              businesses, the buildings a community gathers in.
            </li>
            <li>
              <strong>Loans are paid back from real life.</strong> Wages, rents, business
              revenue — never from new members&rsquo; money. That&rsquo;s the old building-society
              rule, and it&rsquo;s what makes the difference between a community that compounds
              and a scheme that collapses.
            </li>
            <li>
              <strong>Everyone holds a stake.</strong> Open books, a share in what grows,
              and a vote. As the grove&rsquo;s homes, businesses, and land grow, so does what
              every member holds. When a neighborhood thrives today, the gains go to
              whoever already owned it; in a grove, the people who make the place valuable
              are the people who own it.
            </li>
          </ul>

          <H2 id="before">This worked before</H2>
          <P>
            None of this is a new idea. Every piece of the grove has been built before, by
            people with far less technology and far more trust.
          </P>
          <P>
            <strong>Building societies</strong> were born in a Birmingham pub in 1775:
            members pooled weekly savings to build one another houses, drew lots for who
            built next, and dissolved when every member was housed. Out of that grew a
            movement that housed a large share of a nation.
          </P>
          <P>
            <strong>Credit unions and cooperative banks</strong> proved that a community
            lending to its own members can underwrite what distant banks won&rsquo;t touch — and
            grew into member-owned systems serving hundreds of millions of people.
          </P>
          <P>
            <strong>Lending circles</strong> — the tanda, the susu, the hui, the chit fund —
            are credit older than banks, still moving billions today among people banks
            refuse to see. Pooling money with people you trust is close to a human
            universal.
          </P>
          <P>
            <strong>Mutual aid societies</strong> proved that belonging and a balance sheet
            reinforce each other — a community that shows up for its members&rsquo; bad days
            earns a loyalty nothing else can buy.
          </P>
          <P>
            <strong>Community land trusts</strong>, born from the civil rights movement in
            1969, proved something subtle: the land a community gathers on should be held
            apart from the land people buy and sell. The commons is governed, not traded.
          </P>
          <P>
            Two lessons run through that whole history, and groves are built around both.
            Trust used to require living in the same place — that&rsquo;s the part technology can
            finally change. And when these institutions grew big enough to forget their
            members, they died — so a grove is designed to stay its members&rsquo;, permanently.
          </P>

          <H2 id="trust">Built to be trusted</H2>
          <P>
            Everything a grove does rests on a simple question: can people who live far
            apart trust what the community owns and owes? Here&rsquo;s how the answer stays yes:
          </P>
          <ul className="list-disc pl-6 space-y-4 text-poplar-text/85 leading-relaxed mb-5 text-[1.0625rem]">
            <li>
              <strong>Land records anyone can check.</strong> Every grove stands on property
              records you can look up and verify from anywhere, at any hour. Whoever
              publishes a record puts money behind it: wrong records cost their publisher,
              and catching an error pays. Accuracy is enforced by incentive, not by taking
              anyone&rsquo;s word for it.
            </li>
            <li>
              <strong>Open books.</strong> Every loan, every repayment, everything the grove
              owns — visible to every member. No annual meeting required, no one to ask
              permission from.
            </li>
            <li>
              <strong>The commons is never sold.</strong> The gathering places — the square,
              the hall — are held in trust. They can&rsquo;t be borrowed against and they can&rsquo;t
              be sold, no matter what. What anchors the community is not for sale.
            </li>
            <li>
              <strong>Your stake is real.</strong> Membership is a proper legal share, on
              purpose — with the protections that come with that. Leaving takes notice, the
              way it always did in institutions built on land: land is patient money, and a
              grove says so up front.
            </li>
            <li>
              <strong>The community keeps the institution.</strong> The old building
              societies died when they stopped belonging to their members. A grove&rsquo;s
              founding rules are written to make that drift hard — the members own it, and
              keep owning it.
            </li>
          </ul>

          <H2 id="now">Where this stands</H2>
          <P>
            Honestly: at the beginning. The first grove hasn&rsquo;t been planted yet.
          </P>
          <P>
            Right now we&rsquo;re building the ground layer — the property records that everything
            else stands on — and talking with the first communities about putting down
            roots. Plenty is still being worked out: the legal structures, the lending
            rules, how members vote. We&rsquo;d rather tell you that than pretend otherwise.
          </P>
          <P>
            We&rsquo;re building this in the open, with the first communities rather than for
            them. And we&rsquo;re patient on purpose: real hometowns take years, not quarters.
          </P>

          <H2 id="invite">An invitation</H2>
          <P>
            If you&rsquo;re part of a community — online or on the ground — that wants more than
            a chat: a place, a pool, a say. We want to talk.
          </P>
          <P>
            If you&rsquo;re curious but not ready, follow along — we publish as we build. And if
            you&rsquo;re a lawyer, a lender, or an economist who sees holes in this: we want that
            scrutiny most of all.
          </P>
          <P>
            The point is the oldest human project there is — people who choose each other,
            building somewhere to stand — finally available to people who found each other
            late, and far away.
          </P>

          <div className="mt-12 mb-20 flex flex-col sm:flex-row gap-4">
            <Link
              href="/start"
              className="inline-flex items-center justify-center bg-poplar-button text-white text-lg font-medium px-8 py-3 rounded-lg hover:bg-poplar-button/90 shadow-md hover:shadow-lg transition-all"
            >
              Plant the first grove
            </Link>
            <a
              href="https://app.towns.com/t/0xa13c14f46c11e61679bcbecfd1b4c389b685e9e4/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-lg text-poplar-text hover:text-poplar-button transition-colors px-2 py-3"
            >
              Join the Towns chat
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
