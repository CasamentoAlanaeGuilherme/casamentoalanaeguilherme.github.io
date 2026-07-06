import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Guest {
  nome: string;
  confirmado: string;
}

interface InvitationPageProps {
  familyId: string;
  guests: Guest[];
  onConfirm: (confirmations: Record<string, string>) => void;
}

export default function InvitationPage({
  familyId,
  guests,
  onConfirm,
}: InvitationPageProps) {
  const [confirmations, setConfirmations] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Inicializar confirmações baseado no status atual
    const initial: Record<string, boolean> = {};
    guests.forEach((guest) => {
      initial[guest.nome] = guest.confirmado === "Sim";
    });
    setConfirmations(initial);
  }, [guests]);

  const handleToggle = (guestName: string) => {
    setConfirmations((prev) => ({
      ...prev,
      [guestName]: !prev[guestName],
    }));
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const confirmationData: Record<string, string> = {};
      guests.forEach((guest) => {
        confirmationData[guest.nome] = confirmations[guest.nome] ? "Sim" : "Não";
      });

      onConfirm(confirmationData);
      toast.success("Presença confirmada com sucesso!");
    } catch (error) {
      toast.error("Erro ao confirmar presença. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 px-3 sm:px-4 md:px-6">
      <div className="max-w-2xl mx-auto w-full">
        {/* Imagem de mãos */}
        <div className="mb-8 fade-in fade-in-1">
          <img
            src="/Imagens/maos.JPG"
            alt="Mãos dos noivos"
            className="wedding-image rounded-lg"
          />
        </div>

        {/* Citação bíblica */}
        <div className="text-center mb-6 sm:mb-8 fade-in fade-in-2 px-2">
          <p className="wedding-font-accent text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            "ASSIM ELES JÁ NÃO SÃO DOIS, MAS SIM UMA SÓ CARNE. PORTANTO O QUE DEUS UNIU,
            NINGUÉM SEPARE."
          </p>
          <p className="wedding-font-body text-sm text-gray-500 mt-2">MATEUS 19:6</p>
        </div>

        {/* Nomes dos noivos */}
        <div className="text-center mb-6 sm:mb-8 fade-in fade-in-3">
          <h1 className="wedding-font-display text-3xl sm:text-4xl md:text-5xl gold-text">
            ALANA & GUILHERME
          </h1>
        </div>

        {/* Texto de convite */}
        <div className="text-center mb-6 sm:mb-8 fade-in fade-in-3 px-2">
          <p className="wedding-font-body text-sm sm:text-base md:text-lg text-gray-700">
            COM BENÇÃO DE SEUS PAIS, CONVIDAM PARA O SEU CASAMENTO
          </p>
        </div>

        {/* Data e local */}
        <div className="text-center mb-6 sm:mb-8 fade-in fade-in-4 border-t border-b border-gray-200 py-4 sm:py-6">
          <p className="wedding-font-heading text-base sm:text-lg md:text-xl text-gray-800 mb-2 sm:mb-3">
            13 DEZ | 16H
          </p>
          <p className="wedding-font-heading text-sm sm:text-base md:text-lg text-gray-700">
            CAPELA RAINHA DA PAZ
          </p>
          <p className="wedding-font-body text-xs sm:text-sm md:text-base text-gray-600">
            SANTA MARIA - DF
          </p>
        </div>

        {/* Imagem abraçados */}
        <div className="mb-8 fade-in fade-in-4">
          <img
            src="/Imagens/abracados.jpeg"
            alt="Alana e Guilherme abraçados"
            className="wedding-image rounded-lg"
          />
        </div>

        {/* Lista de convidados */}
        <div className="mb-6 sm:mb-8 fade-in fade-in-5">
          <h2 className="wedding-font-heading text-lg sm:text-xl md:text-2xl text-gray-800 mb-4 sm:mb-6 text-center">
            Confirmação de Presença
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {guests.map((guest) => (
              <div
                key={guest.nome}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-yellow-300 transition-colors"
              >
                <input
                  type="checkbox"
                  id={guest.nome}
                  checked={confirmations[guest.nome] || false}
                  onChange={() => handleToggle(guest.nome)}
                  className="wedding-checkbox flex-shrink-0"
                />
                <label
                  htmlFor={guest.nome}
                  className="wedding-font-body text-sm sm:text-base md:text-lg text-gray-700 flex-1 cursor-pointer"
                >
                  {guest.nome}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de confirmação */}
        <div className="text-center mb-6 sm:mb-8 fade-in fade-in-5">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="wedding-button text-sm sm:text-base"
          >
            {isSubmitting ? "Confirmando..." : "Confirmar Presença"}
          </button>
        </div>

        {/* Imagem beijando na ponte */}
        <div className="fade-in fade-in-5">
          <img
            src="/Imagens/beijando_na_ponte.JPG"
            alt="Alana e Guilherme beijando na ponte"
            className="wedding-image rounded-lg"
          />
        </div>

        {/* Mensagem de agradecimento */}
        <div className="text-center mt-6 sm:mt-8 fade-in fade-in-5 px-2">
          <p className="wedding-font-body text-xs sm:text-sm md:text-base text-gray-600">
            Obrigado por fazer parte deste momento especial!
          </p>
        </div>
      </div>
    </div>
  );
}
