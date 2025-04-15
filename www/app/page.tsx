'use client';

import Image from 'next/image';
import { Leaf, Users, Wallet, Building, Sprout, ArrowRight, Map, Store, Handshake } from 'lucide-react';
import RoadmapSection from './components/RoadmapSection';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the LaunchListWidget with SSR disabled
const DynamicLaunchListWidget = dynamic(() => import('./components/LaunchListWidget'), {
  ssr: false,
  // Optional: Add a loading state while the component loads
  // loading: () => <p>Loading waitlist...</p>,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F7F2] to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo-transparent.png"
              alt="Poplar Labs Logo"
              width={32}
              height={32}
              className="h-8 w-8"
              style={{ objectFit: 'contain' }}
              quality={100}
            />
            <div className="text-2xl font-bold text-poplar-text">Poplar Labs</div>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="#roadmap" className="text-poplar-text hover:bg-poplar-accent px-3 py-2 rounded-md transition-colors">Roadmap</Link>
            <Link href="/litepaper" className="text-poplar-text hover:bg-poplar-accent px-3 py-2 rounded-md transition-colors">Litepaper</Link>
            <Link href="mailto:tremylous@poplarlabs.xyz" className="text-poplar-text hover:bg-poplar-accent px-3 py-2 rounded-md transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-poplar-text leading-tight mb-6">
              Community-Owned Network Villages
            </h1>
            <p className="text-lg text-poplar-text/80 mb-8">
              Build decentralized villages on secure land registries, create community-owned economies, and enable community lending for home ownership.
            </p>
            <div className="mt-8 mb-4">
              <p className="text-lg font-semibold text-poplar-text mb-2">Launching Soon: Be the First to Know!</p>
              <p className="text-poplar-text/80">Be the first to know when Poplar Labs launches. Get exclusive updates and early access to help build the future of community-owned network villages.</p>
            </div>
            <DynamicLaunchListWidget />
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/images/hero-path.png"
              alt="Winding path through aspen trees in a green mountain landscape"
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

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-poplar-text mb-16">Network Villages</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-poplar-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Map className="h-8 w-8 text-poplar-text" />
              </div>
              <h3 className="text-xl font-semibold text-poplar-text mb-4">Land-Based Communities</h3>
              <p className="text-poplar-text/80">Decentralized governance structures founded on verifiable property records secured by ROOT token.</p>
            </div>
            <div className="text-center">
              <div className="bg-poplar-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="h-8 w-8 text-poplar-text" />
              </div>
              <h3 className="text-xl font-semibold text-poplar-text mb-4">Locally-Owned Economies</h3>
              <p className="text-poplar-text/80">Community-owned digital economies that enable sustainable local development and inter-village trade networks.</p>
            </div>
            <div className="text-center">
              <div className="bg-poplar-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8 text-poplar-text" />
              </div>
              <h3 className="text-xl font-semibold text-poplar-text mb-4">Community Lending for Housing</h3>
              <p className="text-poplar-text/80">Community-aligned capital and lending protocols for accessible home ownership within network villages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section - Now using the new component */}
      <RoadmapSection />

      {/* CTA Section */}
      <section className="container mx-auto px-6 pb-20">
        <div className="bg-poplar-accent rounded-2xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <Sprout className="h-12 w-12 text-poplar-text mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-poplar-text mb-4">
              Launching Soon: Be the First to Know!
            </h2>
            <p className="text-poplar-text/90 mb-6">
              Poplar Labs is preparing to launch. Sign up below to join our waitlist and get exclusive early access and updates on community-owned network villages.
            </p>
            <DynamicLaunchListWidget variant="cta" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-poplar-text text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Image
                  src="/images/logo-transparent.png"
                  alt="Poplar Labs Logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                  style={{ objectFit: 'contain' }}
                  quality={100}
                />
                <span className="text-xl font-bold">Poplar Labs</span>
              </div>
              <p className="text-white/80">
                Community-Owned Network Villages
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Communities (Coming Soon)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Governance (Coming Soon)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Token (Coming Soon)</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Documentation (Coming Soon)</a></li>
                <li><Link href="/litepaper" className="hover:text-white transition-colors">Litepaper</Link></li>
                <li><a href="https://github.com/poplarlabs/poplar-core" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-white/80">
                <li><a href="https://app.towns.com/poplar-labs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Towns Chat</a></li>
                <li><a href="https://x.com/poplarlabsxyz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/80">
            <p>&copy; 2025 Poplar Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
