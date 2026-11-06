const API = "http://localhost:3000";

// Função para mostrar mensagens de erro/sucesso no seu layout
function mostrarMensagem(texto, tipo) {
    const div = document.getElementById("mensagem");
    if (div) {
        div.textContent = texto;
        div.className = `mensagem ${tipo}`;
        setTimeout(() => { div.className = "mensagem"; }, 4000); // some após 4s
    }
}

// Função para carregar os dados do perfil (index.html)
async function carregarPerfil() {
    const token = localStorage.getItem("token");
    const divPerfil = document.getElementById("perfil-info");

    try {
        const res = await fetch(`${API}/cliente/perfil`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Sessão expirada");

        const dados = await res.json();
        
        divPerfil.innerHTML = `
            <p><strong>Nome:</strong> ${dados.nome}</p>
            <p><strong>CPF:</strong> ${dados.cpf || 'Não informado'}</p>
            <p><strong>Celular:</strong> ${dados.celular || 'Não informado'}</p>
            <p><strong>Email:</strong> ${dados.email}</p>
        `;
    } catch (error) {
        logout(); // Se o token for inválido, desloga
    }
}

// Função de sair da conta
function logout() {
    localStorage.removeItem("nome_cliente");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
