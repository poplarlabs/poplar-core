import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import CopyBlock from '../components/CopyBlock';
import PoplarMark from '../components/PoplarMark';

export const metadata: Metadata = {
  title: 'Poplar — X profile kit',
  robots: { index: false, follow: false },
};

const BIO_FULL =
  'Poplar builds groves — hometowns you choose. Real land, community lending, and a share in what grows. Members anywhere. Roots in one place.';

const BIO_SHORT =
  'Poplar builds groves — hometowns you choose. Members anywhere. Roots in one place.';

const PINNED_TWEET = `Aspens look like a forest of separate trees. Underground, they're one organism — one root system, thousands of years old.

That's what we're building. Groves: communities that own things together — hometowns you choose.

poplarlabs.xyz`;

function ImageCard({
  src,
  title,
  detail,
  width,
  height,
}: {
  src: string;
  title: string;
  detail: string;
  width: number;
  height: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-poplar-text/5 p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-poplar-text font-semibold">{title}</p>
          <p className="text-poplar-text/55 text-sm">{detail}</p>
        </div>
        <a
          href={src}
          download
          className="shrink-0 text-sm font-medium bg-poplar-button text-white px-4 py-1.5 rounded-md hover:bg-poplar-button/90 transition-colors"
        >
          Download
        </a>
      </div>
      <Image
        src={src}
        alt={title}
        width={width}
        height={height}
        className="w-full h-auto rounded-lg border border-poplar-text/10"
        unoptimized
      />
    </div>
  );
}

export default function XKit() {
  return (
    <div className="min-h-screen bg-poplar-cream">
      <nav className="container mx-auto px-6 py-6">
        <Link href="/" className="flex items-center space-x-2 w-fit">
          <PoplarMark className="h-8 w-8 text-poplar-text" />
          <span className="text-2xl font-display text-poplar-text">Poplar</span>
        </Link>
      </nav>

      <div className="container mx-auto px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-poplar-moss mb-3">
            Internal — not linked or indexed
          </p>
          <h1 className="font-display text-4xl text-poplar-text leading-tight mb-4">
            X profile kit
          </h1>
          <p className="text-poplar-text/75 leading-relaxed mb-12">
            Everything for updating @poplarlabsxyz, in paste order. Deploy the site before
            updating the bio so the link lands on the new story.
          </p>

          <h2 className="font-display text-2xl text-poplar-text mb-6">1 · Profile fields</h2>
          <div className="space-y-4 mb-12">
            <CopyBlock label="Name" value="Poplar" />
            <CopyBlock
              label="Bio — recommended (139/160)"
              value={BIO_FULL}
            />
            <CopyBlock
              label="Bio — shorter alternative (83/160)"
              value={BIO_SHORT}
            />
            <CopyBlock label="Location" value="Members anywhere" />
            <CopyBlock label="Website" value="poplarlabs.xyz" />
          </div>

          <h2 className="font-display text-2xl text-poplar-text mb-6">2 · Images</h2>
          <div className="space-y-6 mb-12">
            <ImageCard
              src="/images/social/x-avatar-mark.png"
              title="Profile picture — recommended"
              detail="The root mark on soil green. 800×800, reads well in the circle crop."
              width={800}
              height={800}
            />
            <ImageCard
              src="/images/social/x-avatar.png"
              title="Profile picture — alternate"
              detail="Current logo on cream, if you want continuity. (The circuit-globe reads old-brand at this size.)"
              width={800}
              height={800}
            />
            <ImageCard
              src="/images/social/x-banner.png"
              title="Header / banner"
              detail="1500×500 at 2×. Text sits top-center, clear of the avatar overlap."
              width={1500}
              height={500}
            />
          </div>

          <h2 className="font-display text-2xl text-poplar-text mb-6">3 · Pinned tweet</h2>
          <div className="space-y-6 mb-16">
            <CopyBlock
              label="Tweet text"
              value={PINNED_TWEET}
              note="Post it, attach the card below, then pin it."
            />
            <ImageCard
              src="/images/social/x-pinned-card.png"
              title="Pinned tweet card"
              detail="1600×900 — attach to the pinned tweet."
              width={1600}
              height={900}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
