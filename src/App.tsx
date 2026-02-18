import { useState, useRef } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Using Pollinations.ai - a free AI image generation API
      const encodedPrompt = encodeURIComponent(prompt + ", digital art, NFT style, vibrant colors, high quality");
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Date.now()}`;

      // Pre-load the image
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      setImageUrl(imageUrl);
    } catch {
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nft-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#EF233C] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 md:w-64 md:h-64 bg-black/10 rotate-45 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 md:w-48 md:h-48 bg-[#D4AF37]/20 rotate-12" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 md:w-32 md:h-32 border-4 border-black/20 rotate-45" />
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 md:w-40 md:h-40 border-4 border-[#D4AF37]/30 rounded-full" />
      </div>

      {/* Crown decoration at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
        <svg viewBox="0 0 200 80" className="w-32 h-16 md:w-48 md:h-24 text-[#D4AF37] drop-shadow-lg">
          <path
            fill="currentColor"
            d="M20 70 L40 30 L60 50 L80 20 L100 50 L120 20 L140 50 L160 30 L180 70 Z"
          />
          <circle cx="40" cy="35" r="8" fill="#22D3EE" />
          <circle cx="100" cy="20" r="8" fill="#22D3EE" />
          <circle cx="160" cy="35" r="8" fill="#22D3EE" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-20">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="font-bebas text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tight leading-none mb-2 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
            NFT<span className="text-[#D4AF37]">FORGE</span>
          </h1>
          <p className="font-outfit text-base md:text-xl text-white/90 max-w-md mx-auto px-4">
            Generate your unique NFT art & mint on OpenSea
          </p>
        </header>

        {/* Main Card */}
        <div className="w-full max-w-2xl bg-black/90 p-4 md:p-8 relative">
          {/* Geometric corner accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 md:w-8 md:h-8 border-t-4 border-l-4 border-[#D4AF37]" />
          <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 border-t-4 border-r-4 border-[#D4AF37]" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 md:w-8 md:h-8 border-b-4 border-l-4 border-[#D4AF37]" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 md:w-8 md:h-8 border-b-4 border-r-4 border-[#D4AF37]" />

          {/* Input Section */}
          <div className="mb-6 md:mb-8">
            <label className="font-bebas text-xl md:text-2xl text-[#D4AF37] tracking-wide mb-3 block">
              DESCRIBE YOUR NFT
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateImage()}
                placeholder="A cyberpunk crown on a red throne..."
                className="flex-1 bg-white/10 border-2 border-white/30 text-white font-outfit text-base md:text-lg px-4 md:px-6 py-3 md:py-4 placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
                className="bg-[#D4AF37] text-black font-bebas text-xl md:text-2xl tracking-wide px-6 md:px-8 py-3 md:py-4 hover:bg-[#22D3EE] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group min-h-[52px]"
              >
                <span className={`${isGenerating ? 'opacity-0' : 'opacity-100'}`}>
                  GENERATE
                </span>
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="relative">
            <div className="aspect-square w-full max-w-md mx-auto bg-white/5 border-2 border-dashed border-white/20 relative overflow-hidden">
              {!imageUrl && !isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                  <svg className="w-16 h-16 md:w-24 md:h-24 mb-4" viewBox="0 0 100 100" fill="none">
                    <rect x="10" y="30" width="80" height="50" stroke="currentColor" strokeWidth="3" />
                    <circle cx="35" cy="50" r="8" stroke="currentColor" strokeWidth="3" />
                    <path d="M25 75 L45 55 L60 70 L90 40" stroke="currentColor" strokeWidth="3" />
                  </svg>
                  <p className="font-outfit text-sm md:text-base px-4 text-center">Your NFT will appear here</p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-[#22D3EE]/30 border-b-[#22D3EE] rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
                    </div>
                  </div>
                  <p className="font-outfit text-white/80 mt-4 text-sm md:text-base">Forging your NFT...</p>
                </div>
              )}

              {imageUrl && !isGenerating && (
                <img
                  src={imageUrl}
                  alt="Generated NFT"
                  className="w-full h-full object-cover animate-fadeIn"
                />
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-[#EF233C] font-outfit text-center bg-white/10 py-2 px-4">
              {error}
            </div>
          )}

          {/* Download Button */}
          {imageUrl && !isGenerating && (
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={downloadImage}
                className="bg-[#22D3EE] text-black font-bebas text-xl md:text-2xl tracking-wide px-6 md:px-10 py-3 md:py-4 hover:bg-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                DOWNLOAD PNG
              </button>
              <a
                href="https://opensea.io/studio/create"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D4AF37] text-black font-bebas text-xl md:text-2xl tracking-wide px-6 md:px-10 py-3 md:py-4 hover:bg-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                MINT ON OPENSEA
              </a>
            </div>
          )}
        </div>

        {/* Feature Pills */}
        <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-2 md:gap-4 px-4">
          {['AI-POWERED', 'FREE TO USE', 'HIGH QUALITY', 'NO SIGN UP'].map((feature, i) => (
            <span
              key={feature}
              className="font-bebas text-sm md:text-lg tracking-wide bg-black/80 text-white px-3 md:px-4 py-1.5 md:py-2 border border-[#D4AF37]/50"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Floating steam animation */}
        <div className="absolute left-4 md:left-10 bottom-1/4 pointer-events-none hidden sm:block">
          <div className="relative">
            <div className="w-3 h-8 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-steam" />
            <div className="w-3 h-8 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-steam absolute left-4 top-2" style={{ animationDelay: '0.5s' }} />
            <div className="w-3 h-8 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-steam absolute left-8 top-1" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center">
        <p className="font-outfit text-xs text-white/40">
          Requested by <a href="https://twitter.com/OxUnseen" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">@OxUnseen</a> · Built by <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">@clonkbot</a>
        </p>
      </footer>

      {/* Custom Styles */}
      <style>{`
        @keyframes steam {
          0%, 100% {
            transform: translateY(0) scaleY(1);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) scaleY(1.5);
            opacity: 0.6;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-steam {
          animation: steam 3s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .font-bebas {
          font-family: 'Bebas Neue', sans-serif;
        }

        .font-outfit {
          font-family: 'Outfit', sans-serif;
        }
      `}</style>
    </div>
  );
}

export default App;
