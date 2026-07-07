'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Map, Sprout, Handshake } from 'lucide-react';
import RoadmapSection from './components/RoadmapSection';
import RootSystem from './components/RootSystem';

const DynamicLaunchListWidget = dynamic(() => import('./components/LaunchListWidget'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-poplar-cream">
      {/* Navigation */}
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
            <div className="text-2xl font-display text-poplar-text">Poplar</div>
          </Link>
          <div className="flex items-center space-x-1 md:space-x-2">
            <Link href="/vision" className="text-poplar-text hover:bg-poplar-accent px-2 md:px-3 py-2 rounded-md transition-colors text-sm md:text-base">Vision</Link>
            <Link href="#path" className="hidden md:inline-block text-poplar-text hover:bg-poplar-accent px-3 py-2 rounded-md transition-colors">The path</Link>
            <Link href="/start" className="ml-1 md:ml-2 bg-poplar-button text-white px-3 md:px-4 py-2 rounded-md hover:bg-poplar-button/90 transition-colors text-sm md:text-base whitespace-nowrap">
              Plant the first grove
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-xs md:text-sm tracking-[0.18em] uppercase text-poplar-moss mb-6">
              Groves — communities with shared roots
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-poplar-text leading-[1.08] mb-6">
              A hometown you&nbsp;choose.
            </h1>
            <p className="text-lg text-poplar-text/80 leading-relaxed mb-4 max-w-xl">
              Most people have too little share in what grows around them. Poplar helps
              communities change that: pool capital, lend to one another, put down roots on
              real land — and own what grows there, together.
            </p>
            <p className="text-lg text-poplar-text leading-relaxed mb-10 max-w-xl font-medium">
              Members anywhere. Roots in one place.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href="/start"
                className="inline-flex items-center justify-center bg-poplar-button text-white text-lg font-medium px-8 py-3 rounded-lg hover:bg-poplar-button/90 shadow-md hover:shadow-lg transition-all"
              >
                Plant the first grove
              </Link>
              <Link
                href="/vision"
                className="inline-flex items-center justify-center text-lg text-poplar-text hover:text-poplar-button transition-colors px-2 py-3"
              >
                Read the vision <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/images/hero-path.png"
              alt="Winding path through poplar trees in a green mountain landscape"
              className="rounded-2xl shadow-2xl"
              priority
              quality={90}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* What's a grove */}
      <section id="grove" className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="font-mono text-xs md:text-sm tracking-[0.18em] uppercase text-poplar-moss mb-4">The idea</p>
            <h2 className="font-display text-3xl md:text-4xl text-poplar-text mb-6">What&rsquo;s a grove?</h2>
            <p className="text-lg text-poplar-text/80 leading-relaxed">
              A grove is a community that owns things together: a lending pool that helps
              members buy homes and start businesses, common ground held in trust, and a real
              say in how both grow. It&rsquo;s run by its members — the ones who live there, and the
              ones who haven&rsquo;t moved yet.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-poplar-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Map className="h-8 w-8 text-poplar-text" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-poplar-text mb-3">Real ground</h3>
              <p className="text-poplar-text/80 leading-relaxed">
                Homes, workshops, gathering places — actual land in one chosen place, with
                records anyone can verify from anywhere.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-poplar-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sprout className="h-8 w-8 text-poplar-text" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-poplar-text mb-3">A stake in what grows</h3>
              <p className="text-poplar-text/80 leading-relaxed">
                The lending pool finances members&rsquo; homes and businesses; rents and
                repayments flow back to member-owners. As the grove thrives, so does every
                stake in it.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-poplar-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8 text-poplar-text" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-poplar-text mb-3">Common say</h3>
              <p className="text-poplar-text/80 leading-relaxed">
                Clear agreements and open books. Every member holds a stake they can see,
                question, and vote.
              </p>
            </div>
          </div>
          <p className="text-center text-lg text-poplar-text mt-14 font-display max-w-2xl mx-auto">
            When a town thrives today, the upside goes to whoever already owned it.
            In a grove, it goes to the people who build it.
          </p>
        </div>
      </section>

      {/* Below the surface — the Pando story */}
      <section className="bg-poplar-soil text-poplar-cream py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-mono text-xs md:text-sm tracking-[0.18em] uppercase text-poplar-cream/60 mb-4">Below the surface</p>
            <h2 className="font-display text-3xl md:text-4xl mb-8">One root system</h2>
            <p className="text-lg text-poplar-cream/85 leading-relaxed mb-6">
              Pando, a grove of quaking aspen in Utah, looks like a forest of forty thousand
              separate trees. It isn&rsquo;t. Underground, it&rsquo;s a single organism — one root system,
              thousands of years old, one of the largest living things on earth.
            </p>
            <p className="text-lg text-poplar-cream/85 leading-relaxed">
              That&rsquo;s the design we borrow. A grove&rsquo;s members can be scattered across the map.
              What they share sits at the root: common ground, a common pool of capital, and
              records everyone can trust. Poplars and aspens grow this way. So do we.
            </p>
          </div>
          <div className="max-w-4xl mx-auto mt-14">
            <RootSystem className="w-full h-auto text-poplar-cream" />
            <div className="flex justify-between max-w-4xl mx-auto mt-2 font-mono text-[10px] md:text-xs tracking-[0.18em] uppercase text-poplar-cream/50">
              <span>Members, anywhere</span>
              <span>One root system</span>
            </div>
          </div>
        </div>
      </section>

      {/* How a grove grows */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="font-mono text-xs md:text-sm tracking-[0.18em] uppercase text-poplar-moss mb-4">How it works</p>
            <h2 className="font-display text-3xl md:text-4xl text-poplar-text">How a grove grows</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Pool',
                body: 'Members join from anywhere and pool capital — the way lending circles and building societies always have.',
              },
              {
                step: '2',
                title: 'Lend',
                body: 'The pool finances homes, workshops, and small businesses where the grove is taking root. Every loan gathers more ground.',
              },
              {
                step: '3',
                title: 'Grow',
                body: 'Rents and repayments flow back to member-owners — from real income, real rents. As the grove thrives, the value of every member’s stake grows with it.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 shadow-sm border border-poplar-text/5">
                <div className="font-display text-4xl text-poplar-button mb-4" aria-hidden="true">{item.step}</div>
                <h3 className="text-xl font-semibold text-poplar-text mb-3">{item.title}</h3>
                <p className="text-poplar-text/80 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-lg text-poplar-text mt-14 font-display max-w-2xl mx-auto">
            You don&rsquo;t have to move to belong. But there&rsquo;s always somewhere to go.
          </p>
        </div>
      </section>

      {/* The lineage */}
      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="font-mono text-xs md:text-sm tracking-[0.18em] uppercase text-poplar-moss mb-4">The lineage</p>
            <h2 className="font-display text-3xl md:text-4xl text-poplar-text mb-6">None of this is new</h2>
            <p className="text-lg text-poplar-text/80 leading-relaxed">
              We&rsquo;re rebuilding institutions that worked for centuries — for people who find
              each other across distance.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-0">
            {[
              {
                year: '1775',
                title: 'Building societies',
                body: 'Neighbors in Birmingham pooled weekly savings in a pub to build one another houses — and dissolved when every member was housed.',
              },
              {
                year: 'Centuries deep',
                title: 'Lending circles',
                body: 'Tandas, susus, hui, chit funds: pooled community credit is close to a human universal, still moving billions today among people banks won’t serve.',
              },
              {
                year: '1969',
                title: 'Community land trusts',
                body: 'Born from the civil rights movement: land held in common to anchor a community, homes owned by the people who live in them.',
              },
              {
                year: 'Now',
                title: 'Groves',
                body: 'The same institutions, rebuilt for communities whose members found each other online — with land records and open books anyone can verify from anywhere.',
              },
            ].map((item, i, arr) => (
              <div key={item.year} className={`grid grid-cols-[7rem_1fr] md:grid-cols-[10rem_1fr] gap-6 py-8 ${i < arr.length - 1 ? 'border-b border-poplar-text/10' : ''}`}>
                <div className="font-mono text-sm md:text-base text-poplar-button pt-1">{item.year}</div>
                <div>
                  <h3 className="text-xl font-semibold text-poplar-text mb-2">{item.title}</h3>
                  <p className="text-poplar-text/80 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The path (roadmap) */}
      <RoadmapSection />

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-poplar-soil rounded-2xl px-8 py-14 md:py-16 text-center text-poplar-cream">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl mb-5">The first grove hasn&rsquo;t been planted yet.</h2>
            <p className="text-lg text-poplar-cream/85 leading-relaxed mb-8">
              We&rsquo;re looking for the first communities — groups with real trust and real
              intent, ready to put down roots together and own what grows. If that&rsquo;s you,
              we want to talk.
            </p>
            <Link
              href="/start"
              className="inline-flex items-center justify-center bg-poplar-button text-white text-lg font-medium px-8 py-3 rounded-lg hover:bg-poplar-button/90 shadow-md hover:shadow-lg transition-all"
            >
              Plant the first grove
            </Link>
            <div className="mt-10 pt-8 border-t border-poplar-cream/15">
              <p className="text-sm text-poplar-cream/70 mb-4">
                Not there yet? Follow the work as it grows.
              </p>
              <div className="max-w-xl mx-auto">
                <DynamicLaunchListWidget variant="cta" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-poplar-text text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/images/logo-transparent.png"
                  alt="Poplar logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                  style={{ objectFit: 'contain' }}
                  quality={100}
                />
                <span className="text-xl font-display">Poplar</span>
              </div>
              <p className="text-white/80">
                A hometown you choose.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Read</h3>
              <ul className="space-y-2 text-white/80">
                <li><Link href="/vision" className="hover:text-white transition-colors">Vision</Link></li>
                <li><Link href="/start" className="hover:text-white transition-colors">Plant the first grove</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Talk</h3>
              <ul className="space-y-2 text-white/80">
                <li><a href="https://app.towns.com/t/0xa13c14f46c11e61679bcbecfd1b4c389b685e9e4/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Towns Chat</a></li>
                <li><a href="https://x.com/poplarlabsxyz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X / Twitter</a></li>
                <li><a href="mailto:tremylous@poplarlabs.xyz" className="hover:text-white transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2026 Poplar Labs</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
