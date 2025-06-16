"use client";

import {
  ClientConnectionState,
  ParcnetClientProvider,
  Toolbar,
  useParcnetClient,
} from "@parcnet-js/app-connector-react";
import { useState, useCallback, useEffect } from "react";
import { getTicketProofRequest } from "@/utils/ticketProof";
import { ProveResult, serializeProofResult } from "@/utils/serialize";
import { hashTicketId } from "@/utils/hash";

export default function Home() {
  return (
    <ParcnetClientProvider
      zapp={{
        name: "DappCon Discount Portal 2025",
        permissions: {
          REQUEST_PROOF: { collections: ["Protocol Berg v2"] },
          READ_PUBLIC_IDENTIFIERS: {},
        },
      }}
    >
      <div className="min-h-screen">
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 64);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`nav-sticky ${isScrolled ? '' : 'nav-hidden'}`}>
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="https://dappcon.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link"
            >
              DappCon
            </a>
            <a 
              href="https://protocol.berlin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link"
            >
              Protocol Berg
            </a>
          </nav>

          {/* Logo & Partnership */}
          <div className="flex items-center space-x-3">
            <div className="micro-text">DAPPCON × PROTOCOL BERG</div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center space-x-4">
            <a 
              href="https://dappcon.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link text-xs"
            >
              DC
            </a>
            <a 
              href="https://protocol.berlin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link text-xs"
            >
              PB
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="hero">
      {/* Floating accent blobs */}
      <div className="accent-blob accent-blob-1"></div>
      <div className="accent-blob accent-blob-2"></div>
      
      {/* Giant watermark */}
      <div 
        className="watermark-text" 
        style={{ 
          top: '20%', 
          left: '50%', 
          transform: 'translateX(-50%) rotate(-5deg)',
          textTransform: 'uppercase'
        }}
      >
        DISCOUNT
      </div>

      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="partnership-badge fade-in">
            Protocol Berg → DappCon
          </div>
          
          <h1 className="hero-title fade-in">
            DappCon<br />
            Discount Portal
          </h1>
          
          <div className="body-text max-w-2xl my-8 fade-in">
            <a 
              href="https://protocol.berlin/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link inline"
            >
              Protocol Berg
            </a>{' '}
            attendees get <strong style={{color: 'var(--accent-a)'}}>25% off</strong>{' '}
            <a 
              href="https://dappcon.io/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link inline"
            >
              DappCon
            </a>{' '}
            tickets. 
            Prove you have a unique Protocol Berg ticket using{' '}
            <a 
              href="https://pod.org/z-api/introduction" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link inline"
            >
              Zupass
            </a>{' '}
            and zero-knowledge proofs to unlock your discount.
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start justify-center sm:justify-start fade-in">
            <div className="micro-text flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{backgroundColor: 'var(--accent-a)'}}
              ></div>
              Limited discounts
            </div>
            <div className="micro-text flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{backgroundColor: 'var(--accent-c)'}}
              ></div>
              Privacy-preserving verification
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <>
      <hr className="section-divider-dashed" />
      <footer className="footer">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="section-title mb-3" style={{color: 'var(--paper-bg)'}}>DappCon</h3>
              <div className="body-text mb-3" style={{color: 'rgba(240, 239, 232, 0.8)'}}>
                The leading conference for decentralized application development and blockchain innovation.
              </div>
              <a 
                href="https://dappcon.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="micro-text"
                style={{color: 'var(--accent-a)'}}
              >
                Visit DappCon →
              </a>
            </div>
            
            <div>
              <h3 className="section-title mb-3" style={{color: 'var(--paper-bg)'}}>Protocol Berg</h3>
              <div className="body-text mb-3" style={{color: 'rgba(240, 239, 232, 0.8)'}}>
                The decentralized protocol and infrastructure conference bringing together protocol engineers and researchers.
              </div>
              <a 
                href="https://protocol.berlin/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="micro-text"
                style={{color: 'var(--accent-a)'}}
              >
                Visit Protocol Berg →
              </a>
            </div>
            
            <div>
              <h3 className="section-title mb-3" style={{color: 'var(--paper-bg)'}}>Privacy</h3>
              <div className="body-text mb-3" style={{color: 'rgba(240, 239, 232, 0.8)'}}>
                Thanks to zero-knowledge proofs and{' '}
                <a href="https://pod.org" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-a)'}}>PODs</a>, 
                DappCon can verify that your Protocol Berg ticket is valid without needing to contact 
                Protocol Berg organizers.
              </div>
              <a 
                href="https://pod.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="micro-text"
                style={{color: 'var(--accent-a)'}}
              >
                Read POD Documentation →
              </a>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-800">
            <div className="micro-text text-center" style={{color: 'rgba(240, 239, 232, 0.6)'}}>
              &copy; {new Date().getFullYear()} DappCon Discount Portal. Powered by Zupass & Zero-Knowledge Proofs.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function RequestProof() {
  const { z, connectionState } = useParcnetClient();
  const [proof, setProof] = useState<ProveResult | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [claimedCode, setClaimedCode] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const requestProof = useCallback(async () => {
    if (connectionState !== ClientConnectionState.CONNECTED) return;
    setIsLoading(true);
    setClaimError(null);
    try {
      const req = getTicketProofRequest();
      console.log(req.schema);
      const res = await z.gpc.prove({
        request: req.schema,
        collectionIds: ["Protocol Berg v2"],
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

  const copyToClipboard = useCallback(async () => {
    if (!claimedCode || isCopied) return;
    
    try {
      await navigator.clipboard.writeText(claimedCode);
      setIsCopied(true);
      
      // Reset copied state after animation completes
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = claimedCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [claimedCode, isCopied]);

  // --- Ticket ID hash display logic ---
  let ticketIdRaw = proof?.revealedClaims?.pods?.ticket?.entries?.ticketId?.value;
  let ticketId: string | undefined = typeof ticketIdRaw === 'string' ? ticketIdRaw : undefined;
  let ticketIdHash: string | null = null;
  let compactTicketIdHash: string | null = null;
  if (ticketId) {
    ticketIdHash = hashTicketId(ticketId);
    compactTicketIdHash = ticketIdHash.slice(0, 8) + '...' + ticketIdHash.slice(-8);
  }
  // --- End Ticket ID hash display logic ---

  if (connectionState !== ClientConnectionState.CONNECTED) {
    return (
      <section className="section">
        <div className="container max-w-2xl">
          <div className="card text-center fade-in">
            <h2 className="section-title mb-4">Connect Your Zupass</h2>
            <div className="body-text mb-6">
              Connect your Zupass wallet to verify your Protocol Berg ticket and claim your DappCon discount.
            </div>
            
            {/* Zupass Button - Centered */}
            <div className="flex justify-center">
              <Toolbar />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container max-w-2xl">
        {!proof ? (
          <div className="card text-center fade-in">
            <h2 className="section-title mb-4">Verify Your Attendance</h2>
            <div className="body-text mb-8">
              Generate a zero-knowledge proof to verify your Protocol Berg attendance without revealing personal information.
            </div>
            
            {claimError && (
              <div className="error-state mb-6">
                <strong>Error:</strong> {claimError}
              </div>
            )}
            
            <button
              className={`btn btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={requestProof}
              disabled={isLoading}
            >
              {isLoading ? 'Generating Proof...' : 'Generate Proof'}
            </button>
            
            <div className="mt-8 space-y-3">
              <div className="micro-text flex items-center justify-center gap-3">
                <div className="w-1 h-1 rounded-full" style={{backgroundColor: 'var(--accent-a)'}}></div>
                Privacy-preserving verification
              </div>
              <div className="micro-text flex items-center justify-center gap-3">
                <div className="w-1 h-1 rounded-full" style={{backgroundColor: 'var(--accent-c)'}}></div>
                One-time claim per attendee
              </div>
            </div>
          </div>
        ) : (
          <div className="card fade-in">
            <div className="text-center mb-8">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 proof-success-icon"
              >
                <svg 
                  className="w-10 h-10" 
                  style={{color: 'var(--ink)'}} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <h2 className="section-title mb-3">Proof Generated</h2>
              <div className="body-text">Your Protocol Berg ticket proof has been generated</div>
            </div>
            
            <div className="verification-section mb-6">
              <h3 className="subsection-title mb-4">Privacy-Preserving Verification</h3>
              <div className="space-y-4">
                {/* Ticket ID Hash Display - now first */}
                {ticketIdHash && (
                  <div>
                    <div className="micro-text mb-1 hash-label flex items-center gap-2">
                      Ticket ID Hash
                    </div>
                    <div className="proof-hash text-xs" style={{ fontFamily: 'monospace', letterSpacing: '0.03em', marginBottom: 2 }}>
                      {compactTicketIdHash}
                    </div>
                  </div>
                )}
                {/* End Ticket ID Hash Display */}
                <div>
                  <div className="micro-text mb-1 hash-label">Unique Nullifier Hash</div>
                  <div className="proof-hash" style={{marginBottom: 2}}>
                    {proof.revealedClaims.owner?.nullifierHashV4?.toString()}
                  </div>
                </div>
                <div className="body-text text-xs leading-relaxed mt-0">
                  The ticket ID hash and nullifier are derived from your Protocol Berg ticket <a href="https://pod.org" target="_blank" rel="noopener noreferrer" className="nav-link inline">POD</a> and prevent double-claiming while keeping your identity private. DappCon can verify you attended Protocol Berg without learning your name, email, or other personal details.
                </div>
              </div>
            </div>

            {verified !== null && (
              <div className={verified ? 'success-state-enhanced mb-6' : 'error-state mb-6'}>
                <div className="subsection-title">
                  {verified ? 'Verification Successful' : '✗ Verification Failed'}
                </div>
              </div>
            )}

            {claimedCode && (
              <div className="discount-code mb-8">
                <div className="discount-code-content">
                  <h3 className="discount-code-title">Your DappCon Discount Code</h3>
                  <div 
                    className={`discount-code-text ${isCopied ? 'copy-success' : ''}`}
                    onClick={copyToClipboard}
                    title="Click to copy"
                  >
                    {claimedCode}
                    {isCopied && (
                      <>
                        <div className="copy-flash" />
                        <div className="copy-ripple" />
                        <div className="copy-particles">
                          <div className="particle" />
                          <div className="particle" />
                          <div className="particle" />
                          <div className="particle" />
                          <div className="particle" />
                          <div className="particle" />
                          <div className="particle" />
                          <div className="particle" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="discount-code-subtitle">
                    {isCopied ? 'DappCon here we come 😎' : 'Click the code above to copy • Use for 25% off your DappCon ticket'}
                  </div>
                </div>
              </div>
            )}

            {claimError && (
              <div className="error-state mb-6">
                <strong>Error:</strong> {claimError}
              </div>
            )}

            {!claimedCode && !claimError && (
              <div className="text-center mb-6">
                <button
                  className={`btn btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  className="btn btn-secondary"
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