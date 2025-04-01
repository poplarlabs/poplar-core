'use client';

import Image from 'next/image';
import { Leaf, Users, Wallet, Building, Sprout, ArrowRight, Map, Store, Handshake } from 'lucide-react';
import RoadmapSection from './components/RoadmapSection';
import Link from 'next/link';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F7F2] to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/logo-transparent.png"
              alt="Poplar Labs Logo"
              width={32}
              height={32}
              className="h-8 w-8"
              style={{ objectFit: 'contain' }}
              quality={100}
            />
            <span className="text-2xl font-bold text-[#556B2F]">Poplar Labs</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/whitepaper" className="text-[#6B8E23] hover:text-[#556B2F]">Whitepaper</Link>
            <a href="#roadmap" className="text-[#6B8E23] hover:text-[#556B2F]">Roadmap</a>
          </div>
          <a target="_blank" rel="noopener noreferrer" href="https://app.poplarlabs.xyz" className="bg-[#6B8E23] text-white px-6 py-2 rounded-full hover:bg-[#556B2F] transition-colors">
            Open App
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-[#556B2F] leading-tight mb-6">
              Community-Owned Network Villages
            </h1>
            <p className="text-lg text-[#6B8E23] mb-8">
              Build decentralized villages on secure land registries, create community-owned economies, and enable community lending for home ownership.
            </p>
            <div className="flex space-x-4">
              <a target="_blank" rel="noopener noreferrer" href="https://app.poplarlabs.xyz" className="bg-[#6B8E23] text-white px-8 py-3 rounded-full hover:bg-[#556B2F] transition-colors flex items-center">
                Explore the Protocol<ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <Link href="/whitepaper" className="border-2 border-[#6B8E23] text-[#6B8E23] px-8 py-3 rounded-full hover:bg-[#6B8E23] hover:text-white transition-colors">
                Read Whitepaper
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/images/hero-path.jpg"
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
          <h2 className="text-3xl font-bold text-center text-[#556B2F] mb-16">Network Villages</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-[#F7F7F2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Map className="h-8 w-8 text-[#6B8E23]" />
              </div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-4">Land-Based Communities</h3>
              <p className="text-[#6B8E23]">Decentralized governance structures founded on verifiable property records secured by ROOT token.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#F7F7F2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="h-8 w-8 text-[#6B8E23]" />
              </div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-4">Locally-Owned Economies</h3>
              <p className="text-[#6B8E23]">Community-owned digital economies that enable sustainable local development and inter-village trade networks.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#F7F7F2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8 text-[#6B8E23]" />
              </div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-4">Community Lending for Housing</h3>
              <p className="text-[#6B8E23]">Community-aligned capital and lending protocols for accessible home ownership within network villages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section - Now using the new component */}
      <RoadmapSection />

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-[#6B8E23] rounded-2xl p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <Sprout className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Contribute?
            </h2>
            <p className="text-[#F7F7F2] mb-8">
              Explore the Poplar Protocol app to see how you can contribute to building transparent, secure property registries for community-owned network villages.
            </p>
            <a target="_blank" rel="noopener noreferrer" href="https://app.poplarlabs.xyz" className="bg-white text-[#6B8E23] px-8 py-3 rounded-full hover:bg-[#F7F7F2] transition-colors inline-flex items-center">
              Explore the Protocol <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <div className="mt-4">
              <Link href="/whitepaper" className="text-[#F7F7F2] hover:text-white underline">
                Or, learn more by reading the Whitepaper
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#556B2F] text-white py-12">
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
              <p className="text-[#F7F7F2] opacity-80">
                Community-Owned Network Villages
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-[#F7F7F2] opacity-80">
                <li><a href="#" className="hover:opacity-100">Communities (Coming Soon)</a></li>
                <li><a href="#" className="hover:opacity-100">Governance (Coming Soon)</a></li>
                <li><a href="#" className="hover:opacity-100">Token (Coming Soon)</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-[#F7F7F2] opacity-80">
                <li><a href="#" className="hover:opacity-100">Documentation (Coming Soon)</a></li>
                <li><Link href="/whitepaper" className="hover:opacity-100">Whitepaper</Link></li>
                <li><a href="#" className="hover:opacity-100">GitHub (Coming Soon)</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-[#F7F7F2] opacity-80">
                <li><a href="https://app.towns.com/poplar-labs" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">Towns Chat</a></li>
                <li><a href="https://x.com/poplarlabsxyz" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-[#F7F7F2] opacity-80">
            <p>&copy; 2025 Poplar Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
