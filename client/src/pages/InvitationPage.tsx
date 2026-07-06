import { useState, useEffect } from "react";

// Interface para tipar os dados que vêm da API
interface Guest {
  index: number;
  nome: string;
  confirmado: string; // "Sim", "Não" ou "Pendente"
}

export default function InvitationPage() {
  // A SUA URL DO GOOGLE APPS SCRIPT VAI AQUI:
  const API_URL = "https://script.google.com/macros/s/AKfycbzIw98kEl0C_Zy1IwK6ATg7lH_41IyZPbeORMIimR9SGG8V7WHkxkLbxDOo4n5gwK9O/exec";

  // Estados para controlar a tela
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lê o ID da URL (?id=Silvinha)
  const urlParams = new URLSearchParams(window.location.search);
  const idFamilia = urlParams.get("id");

  useEffect(() => {
    // Se não tiver ID na URL, já mostra erro na hora
    if (!idFamilia) {
      setError("Convite Inválido. Por favor, utilize o link completo enviado pelos noivos.");
      setLoading(false);
      return;
    }

    // Busca os dados da família no Google Sheets
    fetch(`${API_URL}?id=${idFamilia}`)
      .then((res) => {
        if (!res.ok) throw new Error("Falha na comunicação com o servidor.");
        return res.json();
      })
      .then((data) => {
        if (data.error || data.length === 0) {
          setError("Família não encontrada. Verifique o link enviado.");
        } else {
          setGuests(data);
        }
      })
      .catch((err) => {
        console.error("Erro no fetch:", err);
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idFamilia]); // O useEffect roda de novo se o ID mudar

  // Função para lidar com a mudança no checkbox
  const handleCheckboxChange = (index: number) => {
    setGuests((prevGuests) =>
      prevGuests.map((guest, i) => {
        if (i === index) {
          return {
            ...guest,
            confirmado: guest.confirmado === "Sim" ? "Não" : "Sim",
          };
        }
        return guest;
      })
    );
  };

  // Função para enviar os dados de volta para a planilha
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita recarregar a página
    setIsSubmitting(true);

    fetch(API_URL, {
      method: "POST",
      mode: "no-cors", // Crucial para não dar erro de CORS no POST pro Google
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guests),
    })
      .then(() => {
        // Como é no-cors, o response é opaco, então assumimos sucesso se não cair no catch
        setSuccess(true);
      })
      .catch((err) => {
        console.error("Erro ao salvar:", err);
        alert("Ocorreu um erro ao salvar a confirmação. Tente novamente.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // --- RENDERIZAÇÃO DA TELA ---

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f5f2]">
        <div className="text-xl text-[#8b7355] animate-pulse">Carregando convite...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f5f2] p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-800 mb-4">Ops!</h1>
          <p className="text-[#5a4a38]">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f5f2] p-6 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-3xl font-serif text-[#8b7355] mb-4">Obrigado!</h2>
          <p className="text-gray-700">Sua confirmação de presença foi salva com sucesso. Esperamos por vocês!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl p-8 border border-[#e6dfd5]">
        
        {/* Cabeçalho do Convite */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-[#8b7355] mb-2">Alana & Guilherme</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Confirmação de Presença</p>
        </div>

        {/* Formulário Dinâmico */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#fcfbf9] p-6 rounded-lg border border-[#f0ebe1]">
            <p className="text-gray-700 mb-4 text-center font-medium">
              Por favor, selecione quem da sua família poderá comparecer:
            </p>
            
            <div className="space-y-4">
              {guests.map((guest, i) => (
                <label 
                  key={guest.index} 
                  className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${guest.confirmado === "Sim" ? 'bg-[#f0ebe1]' : 'hover:bg-gray-50'}`}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-[#8b7355] rounded focus:ring-[#8b7355] border-gray-300"
                    checked={guest.confirmado === "Sim"}
                    onChange={() => handleCheckboxChange(i)}
                  />
                  <span className="ml-3 text-gray-800 text-lg">{guest.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#8b7355] hover:bg-[#7a6548] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b7355] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? "Salvando..." : "Confirmar Presença"}
          </button>
        </form>
      </div>
    </div>
  );
}