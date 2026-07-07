const API_URL = "https://script.google.com/macros/s/AKfycbzIw98kEl0C_Zy1IwK6ATg7lH_41IyZPbeORMIimR9SGG8V7WHkxkLbxDOo4n5gwK9O/exec";
const urlParams = new URLSearchParams(window.location.search);
const idFamilia = urlParams.get('id');
let listaConvidados = [];

// Função para abrir o convite
function openInvitation() {
    const splash = document.getElementById('splash-screen');
    const main = document.getElementById('main-content');
    
    splash.classList.add('fade-out');
    setTimeout(() => {
        splash.classList.add('hidden');
        main.classList.remove('hidden');
        setTimeout(() => {
            main.classList.add('fade-in');
            main.style.opacity = '1';
        }, 50);
    }, 800);
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
    if (!idFamilia) {
        const loadingGuests = document.getElementById('loading-guests');
        if (loadingGuests) {
            loadingGuests.innerHTML = "<p class='text-red-400 text-xs uppercase'>Link Inválido</p>";
        }
        return;
    }
    carregarConvidados();
});

function carregarConvidados() {
    fetch(`${API_URL}?id=${idFamilia}`)
        .then(res => res.json())
        .then(data => {
            listaConvidados = data;
            renderizarFormulario();
        })
        .catch(err => {
            console.error("Erro ao buscar dados:", err);
            const loadingGuests = document.getElementById('loading-guests');
            if (loadingGuests) {
                loadingGuests.innerHTML = "<p class='text-red-400 text-xs uppercase'>Erro ao carregar dados</p>";
            }
        });
}

function renderizarFormulario() {
    const guestListDiv = document.getElementById('guest-list');
    const loadingDiv = document.getElementById('loading-guests');
    const form = document.getElementById('rsvp-form');

    if (!guestListDiv || !loadingDiv || !form) return;

    if (listaConvidados.length === 0) {
        loadingDiv.innerHTML = "<p class='text-gray-400 text-xs uppercase'>Família não encontrada</p>";
        return;
    }

    loadingDiv.classList.add('hidden');
    form.classList.remove('hidden');

    guestListDiv.innerHTML = '';
    listaConvidados.forEach((c, i) => {
        const checked = c.confirmado === "Sim" ? "checked" : "";
        const guestItem = document.createElement('div');
        guestItem.className = "flex items-center justify-between p-4 bg-white border border-gray-100 rounded-sm shadow-sm";
        guestItem.innerHTML = `
            <span class="text-sm font-light text-gray-700 uppercase tracking-wider">${c.nome}</span>
            <input type="checkbox" id="chk-${i}" ${checked} class="checkbox-custom">
        `;
        guestListDiv.appendChild(guestItem);
    });
}

function abrirModal() {
    document.getElementById('confirmation-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Previne scroll ao abrir modal
}

function fecharModal() {
    document.getElementById('confirmation-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function confirmarEnvio() {
    fecharModal();
    enviarRSVP();
}

function enviarRSVP() {
    const btn = document.getElementById('btn-confirmar');
    const rsvpForm = document.getElementById('rsvp-form');
    const successMsg = document.getElementById('success-message');
    
    if (!btn || !rsvpForm || !successMsg) return;

    const originalText = btn.innerText;
    btn.innerText = "Salvando...";
    btn.disabled = true;

    // Atualiza a estrutura local baseado nos checkboxes marcados
    listaConvidados.forEach((c, i) => {
        const chk = document.getElementById(`chk-${i}`);
        if (chk) {
            c.confirmado = chk.checked ? "Sim" : "Não";
        }
    });

    // Envia as atualizações via POST
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listaConvidados)
    })
    .then(() => {
        rsvpForm.classList.add('hidden');
        successMsg.classList.remove('hidden');
        // Scroll para a mensagem de sucesso
        successMsg.scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => {
        console.error("Erro ao salvar RSVP:", err);
        alert("Erro ao salvar confirmação. Tente novamente.");
        btn.innerText = originalText;
        btn.disabled = false;
    });
}
