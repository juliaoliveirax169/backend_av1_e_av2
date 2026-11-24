/* ============================================================
   AQUA - E-commerce | Front-end (AV3)
   scripts compartilhados entre todas as paginas
   ============================================================ */

const API = "http://localhost:3000";

// Chaves utilizadas no LocalStorage
const CHAVE_TOKEN     = "token";
const CHAVE_NOME      = "nome_cliente";
const CHAVE_CARRINHO  = "carrinho_aqua";

/* ==================== Utilidades ==================== */

// Formata um valor como moeda brasileira (ex.: R$ 1.250,00)
function formatBRL(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Converte link do Google Drive para uma versao que funciona melhor em <img>
function urlImagemProduto(imagemUrl) {
    if (!imagemUrl) return 'https://via.placeholder.com/600x450?text=Sem+Imagem';
    const match = imagemUrl.match(/[?&]id=([\w-]+)/);
    if (match && imagemUrl.includes('drive.google.com')) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }
    return imagemUrl;
}

// Pega o token salvo (null se nao estiver logado)
function obterToken() {
    return localStorage.getItem(CHAVE_TOKEN);
}

// Verifica se o usuario esta logado
function usuarioLogado() {
    return !!obterToken();
}

// Cabecalhos para rotas protegidas (JWT)
function cabecalhosAutenticacao() {
    return { "Authorization": `Bearer ${obterToken()}` };
}

// Protecao de rota: manda para o login guardando a pagina de origem
function exigirLogin() {
    if (!usuarioLogado()) {
        const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
        sessionStorage.setItem("rota_volta", paginaAtual);
        window.location.replace("login.html");
        return false;
    }
    return true;
}

/* ==================== Mensagens (toast) ==================== */

let _toastTimer = null;

function mostrarMensagem(texto, tipo) {
    // tipo: "sucesso" | "erro" | "info"
    tipo = tipo || "info";

    let toast = document.getElementById("toast-mensagem");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-mensagem";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    clearTimeout(_toastTimer);
    toast.textContent = texto;
    toast.className = `toast toast-${tipo} toast-visivel`;

    _toastTimer = setTimeout(() => {
        toast.className = `toast toast-${tipo}`;
    }, 3800);
}

/* ==================== Interface do cabecalho ==================== */

// Marca/sincroniza a area do usuario no menu (nome + contadores)
function iniciarInterfaceUsuario() {
    // Permite que o CSS mostre/oculte os blocos condicionais corretamente
    document.body.classList.add("sessao-iniciada");

    const nome = localStorage.getItem(CHAVE_NOME);

    const label = document.getElementById("usuario-nome");
    if (label) {
        if (nome) {
            label.textContent = nome.split(' ')[0]; // primeiro nome
            label.title = nome;
        }
    }

    const avatar = document.getElementById("usuario-avatar");
    if (avatar && nome) {
        avatar.textContent = nome.trim().charAt(0).toUpperCase();
    }

    // Bloco visivel apenas quando ha sessao ativa
    const blocoLogado = document.querySelectorAll('.area-logado');
    blocoLogado.forEach(el => {
        el.style.display = usuarioLogado() ? "" : "none";
    });

    // Bloco visivel apenas para visitantes (nao logados)
    const blocoVisitante = document.querySelectorAll('.area-visitante');
    blocoVisitante.forEach(el => {
        el.style.display = usuarioLogado() ? "none" : "";
    });

    atualizarBadgeCarrinho();
}

// Atualiza o balaozinho com a quantidade de itens do carrinho (todas as paginas)
function atualizarBadgeCarrinho() {
    const qtd = totalItensCarrinho();
    const badges = document.querySelectorAll('#badge-carrinho, .badge-carrinho');
    badges.forEach(badge => {
        badge.textContent = qtd > 0 ? qtd : "";
        badge.classList.toggle('badge-sombras', qtd > 0);
    });

    // Resumo do mini-carrinho (se existir na pagina)
    const resumoValor = document.getElementById('mini-carrinho-valor');
    if (resumoValor) resumoValor.textContent = formatBRL(valorTotalCarrinho());
    const resumoQtd = document.getElementById('mini-carrinho-qtd');
    if (resumoQtd) resumoQtd.textContent = `${qtd} item(ns)`;
}

/* ==================== Carrinho (LocalStorage) ==================== */

// Lê o carrinho salvo. Formato: [{ id, nome, categoria, preco, imagem_url, quantidade }]
function obterCarrinho() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        return [];
    }
}

// Salva o carrinho no LocalStorage
function salvarCarrinho(itens) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
    atualizarBadgeCarrinho();
}

// Adiciona um produto ao carrinho (ou aumenta a quantidade se ja existe)
function adicionarAoCarrinho(produto, quantidade) {
    quantidade = quantidade || 1;
    const itens = obterCarrinho();
    const existente = itens.find(item => String(item.id) === String(produto.id));

    if (existente) {
        existente.quantidade += quantidade;
    } else {
        itens.push({
            id: produto.id,
            nome: produto.nome,
            categoria: produto.categoria,
            preco: parseFloat(produto.preco),
            imagem_url: produto.imagem_url || '',
            quantidade: quantidade
        });
    }

    salvarCarrinho(itens);
    return itens.find(item => String(item.id) === String(produto.id));
}

// Muda a quantidade de um item (delta: +1 / -1). Remove se zerar.
function alterarQuantidadeItem(produtoId, delta) {
    let itens = obterCarrinho();
    const item = itens.find(i => String(i.id) === String(produtoId));
    if (!item) return itens;

    item.quantidade += delta;

    if (item.quantidade <= 0) {
        itens = itens.filter(i => String(i.id) !== String(produtoId));
    }

    salvarCarrinho(itens);
    return itens;
}

// Remove um item do carrinho de vez
function removerDoCarrinho(produtoId) {
    const itens = obterCarrinho().filter(i => String(i.id) !== String(produtoId));
    salvarCarrinho(itens);
    return itens;
}

// Total de itens (somando as quantidades)
function totalItensCarrinho() {
    return obterCarrinho().reduce((soma, item) => soma + item.quantidade, 0);
}

// Valor total do carrinho
function valorTotalCarrinho() {
    return obterCarrinho().reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

// Limpa o carrinho (usado apos a compra)
function esvaziarCarrinho() {
    localStorage.removeItem(CHAVE_CARRINHO);
    atualizarBadgeCarrinho();
}

/* ==================== Acoes do usuario ==================== */

// Sai da conta (mantem compatibilidade com o codigo antigo)
function logout() {
    localStorage.removeItem(CHAVE_NOME);
    localStorage.removeItem(CHAVE_TOKEN);
    window.location.href = "login.html";
}

// Encerra a sessao e volta para a tela de produtos
function sairConta(e) {
    if (e) e.preventDefault();
    logout();
}

// Redireciona para o perfil
function abrirPerfil() {
    window.location.href = "perfil.html";
}

// Exibe a lista de compras realizadas pelo usuario (GET /compras)
async function carregarHistoricoCompras(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const res = await fetch(`${API}/compras`, { headers: cabecalhosAutenticacao() });
        if (!res.ok) throw new Error("Falha ao carregar historico.");

        const compras = await res.json();

        if (!compras.length) {
            container.innerHTML = `<p class="texto-cinza">Voce ainda nao fez nenhuma compra.</p>`;
            return;
        }

        container.innerHTML = compras.map(compra => {
            const data = new Date(compra.data_compra).toLocaleDateString('pt-BR');
            const itens = (compra.itens || []).map(item =>
                `<li>${item.nome} x${item.quantidade} <span class="texto-cinza">(${formatBRL(item.preco_unitario)} un.)</span></li>`
            ).join('');

            return `
                <article class="card-compra">
                    <header class="card-compra-topo">
                        <span><strong>Pedido #${compra.id}</strong> &middot; ${data}</span>
                        <span class="texto-verde">${formatBRL(compra.valor_total)}</span>
                    </header>
                    <ul class="lista-itens-compra">${itens}</ul>
                </article>
            `;
        }).join('');
    } catch (error) {
        container.innerHTML = `<p class="texto-erro">Nao foi possivel carregar seu historico. Tente novamente mais tarde.</p>`;
    }
}

// Carrega os dados do perfil (GET /cliente/perfil)
async function carregarPerfil() {
    const divPerfil = document.getElementById("perfil-info");
    if (!divPerfil) return;

    try {
        const res = await fetch(`${API}/cliente/perfil`, {
            headers: cabecalhosAutenticacao()
        });

        if (!res.ok) throw new Error("Sessao expirada");

        const dados = await res.json();

        divPerfil.innerHTML = `
            <div class="campo-perfil"><span>Nome</span><strong>${dados.nome || '-'}</strong></div>
            <div class="campo-perfil"><span>CPF</span><strong>${dados.cpf || 'Nao informado'}</strong></div>
            <div class="campo-perfil"><span>Celular</span><strong>${dados.celular || 'Nao informado'}</strong></div>
            <div class="campo-perfil"><span>Email</span><strong>${dados.email}</strong></div>
        `;
    } catch (error) {
        logout(); // Se o token for invalido, desloga
    }
}

/* ==================== Inicializacao automatica ==================== */

// Roda em qualquer pagina que tenha o cabecalho padrao
document.addEventListener('DOMContentLoaded', () => {
    iniciarInterfaceUsuario();
});
