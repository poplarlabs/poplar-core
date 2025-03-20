'use client';

import Image from 'next/image';
import { Leaf, Users, Wallet, Building, Sprout, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F7F2] to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-[#6B8E23]" />
            <span className="text-2xl font-bold text-[#556B2F]">Poplar Labs</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-[#6B8E23] hover:text-[#556B2F]">Communities</a>
            <a href="#" className="text-[#6B8E23] hover:text-[#556B2F]">Technology</a>
            <a href="#" className="text-[#6B8E23] hover:text-[#556B2F]">Governance</a>
          </div>
          <button className="bg-[#6B8E23] text-white px-6 py-2 rounded-full hover:bg-[#556B2F] transition-colors">
            Open App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-[#556B2F] leading-tight mb-6">
              Founding Network Towns with Local Economies
            </h1>
            <p className="text-lg text-[#6B8E23] mb-8">
              Found your own town, join a town, and trade with other towns.
            </p>
            <div className="flex space-x-4">
              <button className="bg-[#6B8E23] text-white px-8 py-3 rounded-full hover:bg-[#556B2F] transition-colors flex items-center">
                See What&apos;s Happening<ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-[#6B8E23] text-[#6B8E23] px-8 py-3 rounded-full hover:bg-[#6B8E23] hover:text-white transition-colors">
                Read Whitepaper
              </button>
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
          <h2 className="text-3xl font-bold text-center text-[#556B2F] mb-16">Network Towns</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-[#F7F7F2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-[#6B8E23]" />
              </div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-4">Community DAOs</h3>
              <p className="text-[#6B8E23]">Decentralized governance structures for local decision-making and resource allocation.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#F7F7F2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-8 w-8 text-[#6B8E23]" />
              </div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-4">Local Economies</h3>
              <p className="text-[#6B8E23]">Token-based microeconomies that support sustainable local development and commerce.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#F7F7F2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-8 w-8 text-[#6B8E23]" />
              </div>
              <h3 className="text-xl font-semibold text-[#556B2F] mb-4">Digital Infrastructure</h3>
              <p className="text-[#6B8E23]">Web3 tools and platforms for managing decentralized town resources and services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-[#6B8E23] rounded-2xl p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <Sprout className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Build A Network Town
            </h2>
            <p className="text-[#F7F7F2] mb-8">
              Join the movement to create self-sustaining digital communities that own their economy.
            </p>
            <button className="bg-white text-[#6B8E23] px-8 py-3 rounded-full hover:bg-[#F7F7F2] transition-colors">
              Start a Town
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#556B2F] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Leaf className="h-6 w-6" />
                <span className="text-xl font-bold">Poplar Labs</span>
              </div>
              <p className="text-[#F7F7F2] opacity-80">
                Founding Network Towns with Local Economies
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-[#F7F7F2] opacity-80">
                <li><a href="#" className="hover:opacity-100">Communities</a></li>
                <li><a href="#" className="hover:opacity-100">Governance</a></li>
                <li><a href="#" className="hover:opacity-100">Token</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-[#F7F7F2] opacity-80">
                <li><a href="#" className="hover:opacity-100">Documentation</a></li>
                <li><a href="#" className="hover:opacity-100">Whitepaper</a></li>
                <li><a href="#" className="hover:opacity-100">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-[#F7F7F2] opacity-80">
                <li><a href="https://app.towns.com/poplar-labs" className="hover:opacity-100">Towns Chat</a></li>
                <li><a href="https://x.com/poplarlabsxyz" className="hover:opacity-100">Twitter</a></li>
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