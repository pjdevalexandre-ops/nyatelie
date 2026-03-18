// Configuração do WhatsApp
const WHATSAPP_CONFIG = "5591984829252";

// Catálogo de produtos
const produtos = [
    { id: 1, nome: "Biquíni Brasil", preco: 129.90, img: "image/1.png" },
    { id: 2, nome: "Top Brasil", preco: 189.00, img: "image/2.png" },
    { id: 3, nome: "Short Brasil", preco: 210.00, img: "image/3.png" },
    { id: 4, nome: "Top Biquíni", preco: 89.90, img: "image/4.png" },
    { id: 5, nome: "Mini saia Brasil", preco: 349.00, img: "image/5.png" },
    { id: 6, nome: "Cropped Bege Brasil", preco: 115.00, img: "image/6.png" }
];

// Estado da aplicação
let carrinho = [];
let menuAberto = false;
let carrinhoAberto = false;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    inicializarComponentes();
    renderizarProdutos();
    configurarEventosGlobais();
    atualizarContadorCarrinho();
});

function inicializarComponentes() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Menu mobile
    const menuToggle = document.getElementById('menuToggle');
    const navDrawer = document.getElementById('navDrawer');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeDrawer = document.getElementById('closeDrawer');

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (closeDrawer) {
        closeDrawer.addEventListener('click', toggleMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', toggleMenu);
    }

    // Fechar menu com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuAberto) {
            toggleMenu();
        }
    });

    // Links do drawer
    document.querySelectorAll('.drawer-link, .drawer-btn-explorar').forEach(link => {
        link.addEventListener('click', () => {
            if (menuAberto) toggleMenu();
        });
    });
}

function configurarEventosGlobais() {
    // Fechar carrinho com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && carrinhoAberto) {
            toggleCarrinho();
        }
    });

    // Fechar carrinho ao clicar no overlay
    const carrinhoOverlay = document.getElementById('carrinho-overlay');
    if (carrinhoOverlay) {
        carrinhoOverlay.addEventListener('click', () => {
            if (carrinhoAberto) toggleCarrinho();
        });
    }

    // Destacar opção de pagamento selecionada
    document.addEventListener('change', (e) => {
        if (e.target.name === 'pagamento') {
            document.querySelectorAll('.pagamento-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            e.target.closest('.pagamento-option').classList.add('selected');
        }
    });

    // Remover erro do campo nome quando começar a digitar
    document.addEventListener('input', (e) => {
        if (e.target.id === 'nome-cliente') {
            e.target.classList.remove('erro');
        }
    });
}

// ===== MENU FUNCTIONS =====
function toggleMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navDrawer = document.getElementById('navDrawer');
    const menuOverlay = document.getElementById('menuOverlay');
    
    menuAberto = !menuAberto;
    
    menuToggle.classList.toggle('active');
    navDrawer.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    
    // Bloquear scroll do body quando menu aberto
    document.body.style.overflow = menuAberto ? 'hidden' : '';
}

// ===== PRODUTOS =====
function renderizarProdutos() {
    const lista = document.getElementById('lista-produtos');
    if (!lista) return;
    
    lista.innerHTML = produtos.map(produto => `
        <div class="card-produto" data-id="${produto.id}">
            <div class="img-wrapper">
                <img src="${produto.img}" alt="${produto.nome}" loading="lazy">
            </div>
            <div class="info-produto">
                <h3>${produto.nome}</h3>
                
                <div class="controles-card">
                    <!-- Seletor de Tamanho e Quantidade -->
                    <div class="seletor-grupo">
                        <div>
                            <span class="label-seletor">Tamanho</span>
                            <select id="tam-${produto.id}" class="select-tam">
                                <option value="P">P (36-38)</option>
                                <option value="M" selected>M (40-42)</option>
                                <option value="G">G (44-46)</option>
                            </select>
                        </div>
                        
                        <div>
                            <span class="label-seletor">Quantidade</span>
                            <div class="qtd-wrapper">
                                <button class="qtd-btn" onclick="alterarQuantidade(${produto.id}, -1)" aria-label="Diminuir quantidade">−</button>
                                <span class="qtd-num" id="qtd-${produto.id}">1</span>
                                <button class="qtd-btn" onclick="alterarQuantidade(${produto.id}, 1)" aria-label="Aumentar quantidade">+</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Seletor de Cores - Swatches -->
                    <div class="seletor-cores">
                        <span class="label-cores">Cor</span>
                        <div class="swatches-wrapper" id="cor-${produto.id}">
                            <div class="swatch active" data-color="Azul" data-cor="Azul" style="background: #007bff" title="Azul"></div>
                            <div class="swatch" data-color="Verde" data-cor="Verde" style="background: #28a745" title="Verde"></div>
                            <div class="swatch" data-color="Amarelo" data-cor="Amarelo" style="background: #ffc107" title="Amarelo"></div>
                            <div class="swatch" data-color="Branco" data-cor="Branco" style="background: #ffffff; border: 2px solid #ddd;" title="Branco"></div>
                            <div class="swatch" data-color="Azul Escuro" data-cor="Azul Escuro" style="background: #0056b3" title="Azul Escuro"></div>
                        </div>
                    </div>
                </div>
                
                <span class="preco">R$ ${formatarPreco(produto.preco)}</span>
                
                <button class="btn-add" onclick="adicionarAoCarrinho(${produto.id})">
                    <i class="fas fa-shopping-bag"></i>
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

// ===== QUANTIDADE =====
function alterarQuantidade(id, delta) {
    const el = document.getElementById(`qtd-${id}`);
    if (!el) return;
    
    let valor = parseInt(el.innerText) || 1;
    valor = Math.max(1, Math.min(10, valor + delta)); // Máx 10 unidades
    el.innerText = valor;
}

// ===== SWATCHES (CORES) =====
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('swatch')) {
        const parent = e.target.closest('.swatches-wrapper');
        if (parent) {
            parent.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
            e.target.classList.add('active');
        }
    }
});

// ===== CARRINHO =====
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    const tam = document.getElementById(`tam-${id}`)?.value || 'M';
    const qtd = parseInt(document.getElementById(`qtd-${id}`)?.innerText) || 1;
    const corElement = document.querySelector(`#cor-${id} .swatch.active`);
    const cor = corElement ? corElement.dataset.cor : 'Azul';
    
    // Verificar se já existe item igual no carrinho
    const itemExistente = carrinho.find(item => 
        item.id === produto.id && item.tamanho === tam && item.cor === cor
    );
    
    if (itemExistente) {
        // Se existir, aumenta a quantidade
        itemExistente.quantidade += qtd;
        mostrarNotificacao(`Quantidade atualizada: ${itemExistente.nome}`);
    } else {
        // Se não existir, adiciona novo item
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: qtd,
            tamanho: tam,
            cor: cor,
            imagem: produto.img
        });
        mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
    }
    
    // Renderizar carrinho
    renderizarCarrinho();
    
    // Atualizar contador
    atualizarContadorCarrinho();
}

function renderizarCarrinho() {
    const container = document.getElementById('itens-carrinho');
    const totalEl = document.getElementById('valor-total');
    
    if (!container) return;
    
    if (carrinho.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--cinza);">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                <p>Seu carrinho está vazio</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Explore nossa coleção e escolha suas peças</p>
            </div>
        `;
        if (totalEl) totalEl.innerText = 'R$ 0,00';
        return;
    }
    
    let total = 0;
    
    container.innerHTML = carrinho.map((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        return `
            <div class="item-carrinho" data-index="${index}">
                <div class="item-info">
                    <strong>${item.quantidade}x ${item.nome}</strong>
                    <div class="item-detalhes">
                        <span>🎨 ${item.cor}</span> • 
                        <span>📏 Tam ${item.tamanho}</span>
                    </div>
                </div>
                <div class="item-preco">
                    <p>R$ ${formatarPreco(subtotal)}</p>
                    <span class="btn-remover" onclick="removerItem(${index})">Remover</span>
                </div>
            </div>
        `;
    }).join('');
    
    if (totalEl) {
        totalEl.innerText = `R$ ${formatarPreco(total)}`;
    }
}

function removerItem(index) {
    carrinho.splice(index, 1);
    renderizarCarrinho();
    atualizarContadorCarrinho();
    
    if (carrinho.length === 0) {
        mostrarNotificacao('Carrinho vazio');
    }
}

function atualizarContadorCarrinho() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
        contador.textContent = totalItens;
        
        // Animação simples no contador
        contador.style.transform = 'scale(1.2)';
        setTimeout(() => {
            contador.style.transform = 'scale(1)';
        }, 200);
    }
}

function toggleCarrinho(abrir = null) {
    const cart = document.getElementById('carrinho-container');
    const overlay = document.getElementById('carrinho-overlay');
    
    if (abrir !== null) {
        carrinhoAberto = abrir;
    } else {
        carrinhoAberto = !carrinhoAberto;
    }
    
    if (carrinhoAberto) {
        cart.classList.remove('carrinho-hidden');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cart.classList.add('carrinho-hidden');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== WHATSAPP - VERSÃO CORRIGIDA COM EMOJIS =====
function enviarPedido() {
    if (carrinho.length === 0) {
        mostrarNotificacao('Seu carrinho está vazio!', 'erro');
        return;
    }
    
    // Validar campo nome
    const nomeInput = document.getElementById('nome-cliente');
    const nome = nomeInput ? nomeInput.value.trim() : '';
    
    if (!nome) {
        nomeInput.classList.add('erro');
        nomeInput.focus();
        mostrarNotificacao('Digite seu nome para continuar!', 'erro');
        
        // Remover erro após 3 segundos
        setTimeout(() => {
            nomeInput.classList.remove('erro');
        }, 3000);
        return;
    }
    
    // Capturar forma de pagamento selecionada
    const pagamentoSelected = document.querySelector('input[name="pagamento"]:checked');
    if (!pagamentoSelected) {
        mostrarNotificacao('Selecione a forma de pagamento!', 'erro');
        return;
    }
    const formaPagamento = pagamentoSelected.value;
    
    // Construir mensagem com emojis
    let mensagem = "";
    
    // Cabeçalho com emojis
    mensagem += "🛍️ *NOVO PEDIDO - Ny Ateliê* 🛍️\n";
    mensagem += "═══════════════════════\n\n";
    
    // Dados do cliente
    mensagem += "👤 *Cliente:* " + nome + "\n\n";
    
    // Itens do pedido
    mensagem += "📦 *ITENS DO PEDIDO*\n";
    mensagem += "────────────────────\n\n";
    
    carrinho.forEach((item) => {
        mensagem += "• *" + item.quantidade + "x " + item.nome + "*\n";
        mensagem += "  🎨 Cor: " + item.cor + " 🟢🟡🔵\n";
        mensagem += "  📏 Tamanho: " + item.tamanho + "\n";
        mensagem += "  💰 Subtotal: R$ " + formatarPreco(item.preco * item.quantidade) + "\n\n";
    });
    
    // Total
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    mensagem += "────────────────────\n";
    mensagem += "💎 *TOTAL DO PEDIDO: R$ " + formatarPreco(total) + "* 💎\n\n";
    
    // Pagamento
    mensagem += "💳 *FORMA DE PAGAMENTO*\n";
    mensagem += "────────────────────\n";
    mensagem += "👉 " + formaPagamento + "\n\n";
    
    // Condições especiais
    mensagem += "📌 *CONDIÇÕES ESPECIAIS*\n";
    mensagem += "────────────────────\n";
    mensagem += "🔸 Para clientes da região: 50% para iniciar e 50% na entrega 💝\n\n";
    
    // Entrega e finalização
    mensagem += "🚚 *Entrega:* (calcular frete)\n\n";
    mensagem += "✨ *Aguardando retorno para finalizar!* ✨\n\n";
    mensagem += "═══════════════════════";
    
    // SOLUÇÃO CORRIGIDA PARA EMOJIS
       const url = `https://wa.me/${WHATSAPP_CONFIG}?text=${encodeURIComponent(unescape(encodeURIComponent(mensagem)))}`;
    
    // Abrir WhatsApp
    window.open(url, '_blank');
    
    // Perguntar se quer limpar carrinho
    if (confirm('Deseja limpar o carrinho após enviar o pedido?')) {
        carrinho = [];
        renderizarCarrinho();
        toggleCarrinho(false);
        atualizarContadorCarrinho();
        mostrarNotificacao('Carrinho limpo!');
    }
}

// ===== UTILITÁRIOS =====
function formatarPreco(valor) {
    return valor.toFixed(2).replace('.', ',');
}

function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
        <i class="fas ${tipo === 'sucesso' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${mensagem}</span>
    `;
    
    // Estilo inline para a notificação
    notificacao.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${tipo === 'sucesso' ? 'var(--ciano)' : '#ff4444'};
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notificacao);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000);
}

// Adicionar animações CSS para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
    }
`;
document.head.appendChild(style);
