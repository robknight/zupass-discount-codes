"use client";

import {
  ClientConnectionState,
  ParcnetClientProvider,
  Toolbar,
  useParcnetClient,
} from "@parcnet-js/app-connector-react";
import { useState, useCallback } from "react";
import { getTicketProofRequest } from "@/lib/ticketProof";
import { ProveResult, serializeProofResult } from "@/lib/serialize";

export default function Home() {
  return (
    <ParcnetClientProvider
      zapp={{
        name: "DappCon Discount Portal",
        permissions: {
          REQUEST_PROOF: { collections: ["Devcon SEA"] },
          READ_PUBLIC_IDENTIFIERS: {},
        },
      }}
    >
      <div className="min-h-screen" style={{background: 'var(--background)'}}>
        <Header />
        <main>
          <HeroSection />
          <RequestProof />
        </main>
        <Footer />
      </div>
    </ParcnetClientProvider>
  );
}

function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="https://dappcon.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
            >
              DAPPCON
              <svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3 ml-1" fill="none" viewBox="0 0 16 16" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 10l4-4m0 0H7m3 0v3" /><rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            </a>
            <a 
              href="https://protocol.berlin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
            >
              PROTOCOL BERG
              <svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3 ml-1" fill="none" viewBox="0 0 16 16" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 10l4-4m0 0H7m3 0v3" /><rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            </a>
          </nav>

          {/* Center Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/dappcon-logo.svg" 
              alt="DappCon" 
              className="h-10 w-auto"
              style={{filter: 'none'}}
            />
            <div className="text-sm text-gray-500 font-medium">× Protocol Berg</div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
              <Toolbar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section id="discount" className="hero-section hero-bg">
      <div className="geometric-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="protocol-badge">
          Protocol Berg → DappCon
        </div>
        <h1 className="text-5xl md:text-6xl dappcon-heading text-gradient mb-4">
          Exclusive Discount
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
          Protocol Berg attendees get <span className="font-bold" style={{color: 'var(--accent)'}}>25% off</span> DappCon tickets. 
          Proof you have a unique Protocol Berg ticket using Zupass and zero-knowledge proofs to unlock your discount.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'var(--accent)'}}></div>
            First 1,000 attendees
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'var(--accent-blue)'}}></div>
            Privacy-preserving verification
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="privacy" style={{backgroundColor: 'var(--foreground)'}} className="text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DappCon</h3>
            <p className="text-gray-400 mb-4">
              The leading conference for decentralized application development and blockchain innovation.
            </p>
            <a 
              href="https://dappcon.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 font-medium"
            >
              Visit DappCon →
            </a>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Protocol Berg</h3>
            <p className="text-gray-400 mb-4">
              The decentralized protocol and infrastructure conference bringing together protocol engineers and researchers.
            </p>
            <a 
              href="https://protocol.berlin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
            >
              Visit Protocol Berg →
            </a>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Privacy</h3>
            <p className="text-gray-400">
              Thanks to zero-knowledge proofs and <a href="https://pod.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">PODs</a>, DappCon can verify that your Protocl Berg ticket is valid without needing to contact Protocol Berg organizers.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DappCon Discount Portal. Powered by Zupass & Zero-Knowledge Proofs.</p>
        </div>
      </div>
    </footer>
  );
}

function RequestProof() {
  const { z, connectionState } = useParcnetClient();
  const [proof, setProof] = useState<ProveResult | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [claimedCode, setClaimedCode] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestProof = useCallback(async () => {
    if (connectionState !== ClientConnectionState.CONNECTED) return;
    setIsLoading(true);
    setClaimError(null);
    try {
      const req = getTicketProofRequest();
      console.log(req.schema);
      const res = await z.gpc.prove({
        request: req.schema,
        collectionIds: ["Devcon SEA"],
      });

      if (res.success) {
        setProof(res);
      } else {
        console.error(res.error);
        if (res.error === "Not enough PODs") {
          setClaimError("There is no Protocol Berg ticket POD associated with this Zupass account.");
        } else {
          setClaimError(res.error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [z, connectionState]);

  const verifyProof = useCallback(async () => {
    if (!proof) return;
    setIsLoading(true);
    setClaimedCode(null);
    setClaimError(null);

    try {
      const serializedProofResult = serializeProofResult(proof);

      const res = await fetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({
          serializedProofResult,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setVerified(data.verified);
        setClaimedCode(data.code ?? null);
        setClaimError(data.error ?? null);
      } else {
        setVerified(false);
        setClaimedCode(null);
        setClaimError("Server error verifying proof.");
        console.error(res.statusText);
      }
    } finally {
      setIsLoading(false);
    }
  }, [proof]);

  if (connectionState !== ClientConnectionState.CONNECTED) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="card text-center">
            <h2 className="text-2xl font-bold mb-3">Connect Your Zupass</h2>
            <p className="text-gray-600 mb-4">
              Connect your Zupass wallet to verify your Protocol Berg ticket and claim your DappCon discount.
            </p>
            <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <div className="animate-pulse w-2 h-2 rounded-full" style={{backgroundColor: 'var(--accent)'}}></div>
              Waiting for Zupass connection...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="verify" className="py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        {!proof ? (
          <div className="card text-center">
            <h2 className="text-2xl font-bold mb-3">Verify Your Attendance</h2>
            <p className="text-gray-600 mb-6">
              Generate a zero-knowledge proof to verify your Protocol Berg attendance without revealing personal information.
            </p>
            {claimError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-red-800">
                <strong>🥺</strong> {claimError}
              </div>
            )}
            <button
              className={`button-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={requestProof}
              disabled={isLoading}
            >
              {isLoading ? 'Generating Proof...' : 'Generate Proof'}
            </button>
            <div className="mt-6 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Privacy-preserving verification</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>One-time claim per attendee</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{backgroundColor: 'var(--accent)', opacity: 0.1}}>
                <svg className="w-6 h-6" style={{color: 'var(--accent)'}} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Proof Generated</h2>
              <p className="text-gray-600">Your Protocol Berg attendance has been verified</p>
            </div>
            
            <div className="rounded-lg p-4 mb-4" style={{backgroundColor: 'var(--muted)'}}>
              <h3 className="font-semibold mb-3">Privacy-Preserving Verification</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Unique Nullifier Hash:</div>
                  <div className="font-mono text-sm p-2 bg-white rounded border break-all">
                    {proof.revealedClaims.owner?.nullifierHashV4?.toString()}
                  </div>
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  This nullifier is derived from your Protocol Berg ticket and prevents double-claiming 
                  while keeping your identity private. DappCon can verify you attended Protocol Berg 
                  without learning your name, email, or other personal details.
                </div>
              </div>
            </div>

            {verified !== null && (
              <div className={`p-4 rounded-lg mb-6 ${verified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className={`font-semibold ${verified ? 'text-green-800' : 'text-red-800'}`}>
                  {verified ? '✓ Verification Successful' : '✗ Verification Failed'}
                </div>
              </div>
            )}

            {claimedCode && (
              <div className="accent-gradient p-6 rounded-lg text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your DappCon Discount Code</h3>
                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <code className="text-2xl font-mono font-bold text-gray-900">{claimedCode}</code>
                </div>
                <p className="text-gray-800 text-sm">
                  Use this code for 25% off your DappCon ticket. Valid until event capacity is reached.
                </p>
              </div>
            )}

            {claimError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-red-800">
                <strong>Error:</strong> {claimError}
              </div>
            )}

            {!claimedCode && !claimError && (
              <div className="text-center">
                <button
                  className={`button-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={verifyProof}
                  disabled={isLoading}
                >
                  {isLoading ? 'Claiming Discount...' : 'Claim Your Discount'}
                </button>
              </div>
            )}

            {claimedCode && (
              <div className="text-center">
                <a 
                  href="https://dappcon.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="button-secondary"
                >
                  Get Your DappCon Ticket →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
