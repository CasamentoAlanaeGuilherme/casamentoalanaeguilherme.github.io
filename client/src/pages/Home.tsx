import { useEffect, useState } from "react";
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

  // Carregar dados de convidados e extrair ID da URL
  useEffect(() => {
    // Usar window.location.search para pegar os parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    console.log("ID extraído da URL:", id);

    if (!id) {
      setPageState("error");
      return;
    }

    setFamilyId(id);

    // Carregar dados de convidados da API do Google Apps Script
    // Usamos encodeURIComponent para garantir que caracteres especiais no ID não quebrem a URL
    fetch(`${API_URL}?id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dados recebidos da API:", data);
        if (data && Array.isArray(data) && data.length > 0) {
          setGuests(data);
          setPageState("opening");
        } else {
          console.warn("Nenhum convidado encontrado para o ID:", id);
          setPageState("error");
          toast.error("Família não encontrada. Verifique o link enviado.");
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar convidados:", err);
        setPageState("error");
        toast.error("Erro ao carregar dados. Tente novamente mais tarde.");
      });
  }, []);

  const handleOpenInvitation = () => {
    setPageState("invitation");
  };

  const handleConfirmPresence = async (confirmations: Record<string, string>) => {
    try {
      // Mapear os convidados atuais com o novo status de confirmação
      const confirmationData = guests.map((guest) => ({
        nome: guest.nome,
        confirmado: confirmations[guest.nome] || "Não",
      }));

      console.log("Enviando confirmação:", confirmationData);

      // Enviar para API via POST
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // Necessário para Google Apps Script
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(confirmationData),
      });

      // Como no-cors não permite ler a resposta, assumimos sucesso se não houver erro de rede
      setPageState("confirmation");
    } catch (error) {
      console.error("Erro ao confirmar presença:", error);
      toast.error("Erro ao confirmar presença. Tente novamente.");
    }
  };

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="wedding-font-display text-2xl text-gray-800 animate-pulse">
          Carregando convite...
        </div>
      </div>
    );
  }

  if (pageState === "error") {
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
            ID tentado: {familyId}
          </p>
        )}
      </div>
    );
  }

  if (pageState === "opening") {
    return <OpeningPage onOpen={handleOpenInvitation} />;
  }

  if (pageState === "invitation") {
    return (
      <InvitationPage
        familyId={familyId}
        guests={guests}
        onConfirm={handleConfirmPresence}
      />
    );
  }

  if (pageState === "confirmation") {
    return <ConfirmationPage familyId={familyId} />;
  }

  return null;
}
