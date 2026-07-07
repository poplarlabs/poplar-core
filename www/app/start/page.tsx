import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import StartForm from '../components/StartForm';

export const metadata: Metadata = {
  title: 'Poplar — Plant the first grove',
  description:
    'The first grove hasn’t been planted yet. If your community wants a place, a pool, and a say — it starts with a conversation.',
};

export default function Start() {
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

      <div className="container mx-auto px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-poplar-moss mb-3">
            Plant the first grove
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-poplar-text leading-tight mb-6">
            It starts with a conversation.
          </h1>
          <p className="text-lg text-poplar-text/80 leading-relaxed mb-4">
            The first grove hasn&rsquo;t been planted yet. We&rsquo;re looking for the communities who
            will plant it with us — not customers for a finished product, but the people the
            model gets built around.
          </p>
          <p className="text-lg text-poplar-text/80 leading-relaxed mb-12">
            If your community wants more than a chat — a place, a pool, a say — tell us
            about yourselves. We read everything, and we reply to everyone.
          </p>

          {/* What we're looking for */}
          <h2 className="font-display text-2xl md:text-3xl text-poplar-text mb-6">
            What we&rsquo;re looking for
          </h2>
          <ul className="space-y-4 mb-12">
            <li className="flex gap-4">
              <span className="text-poplar-button font-display text-xl leading-6" aria-hidden="true">·</span>
              <p className="text-poplar-text/85 leading-relaxed">
                <strong>A real community.</strong> People who already know and trust each
                other — around a craft, a faith, a hometown, an idea. We can&rsquo;t supply the
                trust; that part is yours.
              </p>
            </li>
            <li className="flex gap-4">
              <span className="text-poplar-button font-display text-xl leading-6" aria-hidden="true">·</span>
              <p className="text-poplar-text/85 leading-relaxed">
                <strong>Real intent.</strong> A genuine wish to build somewhere together —
                homes, workshops, gathering places — not just curiosity about the idea.
              </p>
            </li>
            <li className="flex gap-4">
              <span className="text-poplar-button font-display text-xl leading-6" aria-hidden="true">·</span>
              <p className="text-poplar-text/85 leading-relaxed">
                <strong>Patience.</strong> Real hometowns take years, not quarters. The
                first grove will be built carefully, in the open, one step at a time.
              </p>
            </li>
          </ul>

          {/* What the first communities get */}
          <h2 className="font-display text-2xl md:text-3xl text-poplar-text mb-6">
            What the first communities get
          </h2>
          <p className="text-poplar-text/85 leading-relaxed mb-4">
            The model shaped around you, not adapted to you. The first communities work
            directly with us on everything that&rsquo;s still open — how membership works, how
            lending decisions get made, how the place gets chosen. First in line when the
            ground is ready, and a direct line to us the whole way.
          </p>
          <p className="text-poplar-text/85 leading-relaxed mb-12">
            What we ask in return is honesty: about your community, what it wants, and
            whether this is right for it. Sometimes the answer will be &ldquo;not yet&rdquo; — we&rsquo;d
            rather find that out together, early.
          </p>

          {/* The questions */}
          <h2 className="font-display text-2xl md:text-3xl text-poplar-text mb-6">
            Tell us about your community
          </h2>
          <p className="text-poplar-text/85 leading-relaxed mb-8">
            Four questions. A few sentences each is plenty.
          </p>

          <StartForm />

          <p className="text-poplar-text/60 text-sm leading-relaxed mt-6 mb-16">
            Prefer email? Write to{' '}
            <a href="mailto:tremylous@poplarlabs.xyz" className="underline hover:text-poplar-button transition-colors">
              tremylous@poplarlabs.xyz
            </a>
            . Prefer to talk first? Find us in the{' '}
            <a
              href="https://app.towns.com/t/0xa13c14f46c11e61679bcbecfd1b4c389b685e9e4/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-poplar-button transition-colors"
            >
              Towns chat
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
