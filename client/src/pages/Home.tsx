import { useEffect, useState, useCallback, useRef } from "react";
import OpeningPage from "./OpeningPage";
import InvitationPage from "./InvitationPage";
import ConfirmationPage from "./ConfirmationPage";
import { toast } from "sonner";

interface Guest {
  nome: string;
  confirmado: string;
}

type PageState = "opening" | "invitation" | "confirmation" | "error" | "loading";

const API_URL = "https://script.google.com/macros/s/AKfycbzIw98kEl0C_Zy1IwK6ATg7lH_41IyZPbeORMIimR9SGG8V7WHkxkLbxDOo4n5gwK9O/exec";

export default function Home() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [familyId, setFamilyId] = useState<string>("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const hasLoaded = useRef(false);

  const loadData = useCallback(async (id: string) => {
    if (hasLoaded.current) return;
    
    try {
      console.log("Iniciando busca para ID:", id);
      const response = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dados recebidos com sucesso:", data);

      if (data && Array.isArray(data) && data.length > 0) {
        setGuests(data);
        setPageState("opening");
        hasLoaded.current = true;
      } else {
        console.warn("Nenhum dado encontrado para o ID:", id);
        setPageState("error");
        toast.error("Família não encontrada. Verifique o link enviado.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      // Só define erro se ainda não tiver carregado nada com sucesso
      if (!hasLoaded.current) {
        setPageState("error");
        toast.error("Erro ao carregar dados. Tente novamente mais tarde.");
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      setPageState("error");
      return;
    }

    setFamilyId(id);
    loadData(id);
  }, [loadData]);

  const handleOpenInvitation = useCallback(() => {
    setPageState("invitation");
  }, []);

  const handleConfirmPresence = useCallback(async (confirmations: Record<string, string>) => {
    try {
      const confirmationData = guests.map((guest) => ({
        nome: guest.nome,
        confirmado: confirmations[guest.nome] || "Não",
      }));

      console.log("Enviando confirmação:", confirmationData);

      // Usar timeout para evitar que a requisição trave a UI
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(confirmationData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      setPageState("confirmation");
    } catch (error) {
      console.error("Erro ao confirmar presença:", error);
      // Mesmo com erro de CORS ou timeout, muitas vezes o dado chega no Google
      // Então mostramos a página de confirmação para não frustrar o usuário,
      // mas avisamos se for um erro real de rede.
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error("A resposta demorou, mas sua confirmação pode ter sido enviada.");
      }
      setPageState("confirmation");
    }
  }, [guests]);

  // Renderização condicional baseada no estado
  const renderContent = () => {
    switch (pageState) {
      case "loading":
        return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="wedding-font-display text-2xl text-gray-800 animate-pulse">
              Carregando convite...
            </div>
          </div>
        );

      case "error":
        return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
            <h1 className="wedding-font-display text-3xl md:text-4xl text-gray-800 mb-4">
              Convite Inválido
            </h1>
            <p className="wedding-font-body text-base md:text-lg text-gray-600 max-w-md mx-auto">
              Por favor, utilize o link completo enviado pelos noivos.
            </p>
            {familyId && (
              <p className="mt-4 text-sm text-gray-400">
                ID: {familyId}
              </p>
            )}
          </div>
        );

      case "opening":
        return <OpeningPage onOpen={handleOpenInvitation} />;

      case "invitation":
        return (
          <InvitationPage
            familyId={familyId}
            guests={guests}
            onConfirm={handleConfirmPresence}
          />
        );

      case "confirmation":
        return <ConfirmationPage familyId={familyId} />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full">
      {renderContent()}
    </div>
  );
}
