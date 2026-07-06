import { useEffect, useRef, useState } from "react";

interface OpeningPageProps {
  onOpen: () => void;
}

export default function OpeningPage({ onOpen }: OpeningPageProps) {
  const ribbonRef = useRef<SVGSVGElement>(null);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const handleTap = () => {
      if (!isOpening) {
        setIsOpening(true);
        if (ribbonRef.current) {
          ribbonRef.current.classList.add("ribbon-opening");
        }
        setTimeout(() => {
          onOpen();
        }, 800);
      }
    };

    window.addEventListener("click", handleTap);
    window.addEventListener("touchstart", handleTap);

    return () => {
      window.removeEventListener("click", handleTap);
      window.removeEventListener("touchstart", handleTap);
    };
  }, [isOpening, onOpen]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Iniciais A&G em dourado */}
      <div className="mb-8 text-center">
        <h1 className="wedding-font-display text-5xl md:text-6xl gold-text">
          A & G
        </h1>
      </div>

      {/* Laço SVG branco */}
      <svg
        ref={ribbonRef}
        viewBox="0 0 200 200"
        width="140"
        height="140"
        className="mb-8 cursor-pointer hover:opacity-80 transition-opacity"
        style={{ perspective: "1000px" }}
      >
        <defs>
          <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="#F5F5F5" stopOpacity="1" />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Laço esquerdo */}
        <ellipse
          cx="60"
          cy="75"
          rx="32"
          ry="38"
          fill="url(#ribbonGradient)"
          stroke="#D0D0D0"
          strokeWidth="1.5"
          filter="url(#shadow)"
        />
        <ellipse cx="60" cy="75" rx="28" ry="34" fill="white" opacity="0.5" />

        {/* Laço direito */}
        <ellipse
          cx="140"
          cy="75"
          rx="32"
          ry="38"
          fill="url(#ribbonGradient)"
          stroke="#D0D0D0"
          strokeWidth="1.5"
          filter="url(#shadow)"
        />
        <ellipse cx="140" cy="75" rx="28" ry="34" fill="white" opacity="0.5" />

        {/* Fita central vertical */}
        <rect
          x="88"
          y="40"
          width="24"
          height="120"
          fill="url(#ribbonGradient)"
          stroke="#D0D0D0"
          strokeWidth="1.5"
          rx="2"
          filter="url(#shadow)"
        />
        <rect x="90" y="42" width="20" height="116" fill="white" opacity="0.4" rx="1" />

        {/* Nó central com efeito 3D */}
        <circle
          cx="100"
          cy="100"
          r="15"
          fill="#D4AF37"
          stroke="#C19A2E"
          strokeWidth="1.5"
          filter="url(#shadow)"
        />
        <circle cx="100" cy="100" r="11" fill="#E8C547" opacity="0.6" />
        <circle cx="102" cy="97" r="4" fill="white" opacity="0.6" />
      </svg>

      {/* Texto "Toque para abrir" */}
      <p className="wedding-font-body text-center text-gray-600 text-sm md:text-base">
        Toque para abrir
      </p>

      {/* Indicador de animação */}
      <div className="mt-12 flex justify-center">
        <div className="animate-bounce text-gray-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
}
