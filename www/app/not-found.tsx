import Link from 'next/link';
import PoplarMark from './components/PoplarMark';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-poplar-cream flex flex-col">
      <nav className="container mx-auto px-6 py-6">
        <Link href="/" className="flex items-center space-x-2 w-fit">
          <PoplarMark className="h-8 w-8 text-poplar-text" />
          <span className="text-2xl font-display text-poplar-text">Poplar</span>
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md pb-24">
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-poplar-moss mb-4">404</p>
          <h1 className="font-display text-4xl text-poplar-text mb-4">There&rsquo;s no clearing here.</h1>
          <p className="text-poplar-text/75 leading-relaxed mb-8">
            This page doesn&rsquo;t exist — or hasn&rsquo;t been planted yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-poplar-button text-white font-medium px-6 py-3 rounded-lg hover:bg-poplar-button/90 transition-colors"
          >
            Back to the grove
          </Link>
        </div>
      </div>
    </div>
  );
}
