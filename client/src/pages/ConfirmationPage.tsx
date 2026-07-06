import { useEffect, useState } from "react";

interface ConfirmationPageProps {
  familyId: string;
}

export default function ConfirmationPage({ familyId }: ConfirmationPageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div
        className={`text-center transition-all duration-700 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Ícone de sucesso */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 md:w-20 md:h-20 mx-auto gold-text"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="wedding-font-display text-3xl md:text-4xl text-gray-800 mb-4">
          Obrigado!
        </h1>

        {/* Mensagem */}
        <p className="wedding-font-body text-base md:text-lg text-gray-600 mb-6 max-w-md">
          Sua presença foi confirmada com sucesso. Nos vemos em breve para celebrar este
          momento especial!
        </p>

        {/* Decoração */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full gold-text" style={{ backgroundColor: "#D4AF37" }} />
          <div className="w-2 h-2 rounded-full gold-text" style={{ backgroundColor: "#D4AF37" }} />
          <div className="w-2 h-2 rounded-full gold-text" style={{ backgroundColor: "#D4AF37" }} />
        </div>

        {/* Informação adicional */}
        <p className="wedding-font-body text-sm text-gray-500">
          Família: <span className="font-semibold text-gray-700">{familyId}</span>
        </p>
      </div>
    </div>
  );
}
