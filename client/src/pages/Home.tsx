import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import OpeningPage from "./OpeningPage";
import InvitationPage from "./InvitationPage";
import ConfirmationPage from "./ConfirmationPage";
import { toast } from "sonner";

interface Guest {
  nome: string;
  confirmado: string;
}

type PageState = "opening" | "invitation" | "confirmation" | "error";

export default function Home() {
  const [, setLocation] = useLocation();
  const [pageState, setPageState] = useState<PageState>("opening");
  const [familyId, setFamilyId] = useState<string>("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestsData, setGuestsData] = useState<Record<string, Guest[]>>({});

  // Carregar dados de convidados e extrair ID da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      setPageState("error");
      toast.error("Link inválido. Por favor, utilize o link completo enviado pelos noivos.");
      return;
    }

    setFamilyId(id);

    // Carregar dados de convidados do arquivo JSON
    fetch("/guests.json")
      .then((res) => res.json())
      .then((data) => {
        setGuestsData(data);

        // Buscar convidados da família
        if (data[id]) {
          setGuests(data[id]);
        } else {
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
      // Aqui você pode integrar com a API do Google Apps Script
      // Por enquanto, apenas mostramos a página de confirmação
      const API_URL =
        "https://script.google.com/macros/s/AKfycbzIw98kEl0C_Zy1IwK6ATg7lH_41IyZPbeORMIimR9SGG8V7WHkxkLbxDOo4n5gwK9O/exec";

      const confirmationData = guests.map((guest) => ({
        nome: guest.nome,
        confirmado: confirmations[guest.nome] || "Não",
      }));

      // Enviar para API (opcional - comentado por segurança)
      // await fetch(API_URL, {
      //   method: "POST",
      //   mode: "no-cors",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(confirmationData),
      // });

      setPageState("confirmation");
    } catch (error) {
      console.error("Erro ao confirmar presença:", error);
      toast.error("Erro ao confirmar presença. Tente novamente.");
    }
  };

  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h1 className="wedding-font-display text-3xl md:text-4xl text-gray-800 mb-4">
          Convite Inválido
        </h1>
        <p className="wedding-font-body text-base md:text-lg text-gray-600 text-center max-w-md">
          Por favor, utilize o link completo enviado pelos noivos.
        </p>
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
