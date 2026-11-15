
// ==========================================
// ELEMENTOS PRINCIPAIS
// ==========================================

const formulario = document.getElementById("formReserva");
const mensagem = document.getElementById("mensagem");
const campoData = document.getElementById("data");

const botaoMenu = document.getElementById("menuMobile");
const menuNavegacao = document.getElementById("menuNavegacao");

const formContato = document.getElementById("formContato");

const botoesFiltro = document.querySelectorAll(".filtro");
const pratos = document.querySelectorAll(".prato");

const campoPesquisa = document.getElementById("pesquisaPratos");
const mensagemNenhumPrato = document.getElementById("nenhumPrato");


// ==========================================
// FORMULÁRIO DE RESERVAS
// ==========================================

// Impedir datas passadas

if (campoData) {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    campoData.min = `${ano}-${mes}-${dia}`;
}

// Palavras bloqueadas

const palavrasBloqueadas = [
    "cuzao",
    "caralho",
    "arrombado",
    "puta"
];

// Processar reservas

if (formulario && mensagem && campoData) {

    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();

        const nomeValido = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(nome);

        if (nome.length < 3 || !nomeValido) {
            mensagem.textContent =
                "Digite um nome válido, com pelo menos 3 letras.";
            return;
        }

        const nomeNormalizado = nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const contemPalavraBloqueada = palavrasBloqueadas.some(
            palavra => nomeNormalizado.includes(palavra)
        );

        if (contemPalavraBloqueada) {
            mensagem.textContent =
                "Nome não permitido! Digite um nome apropriado.";
            return;
        }

        const telefone = document.getElementById("telefone").value;
        const telefoneLimpo = telefone.replace(/\D/g, "");

        if (telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11) {
            mensagem.textContent =
                "Digite um telefone válido com DDD.";
            return;
        }

        const data = campoData.value;
        const horario = document.getElementById("horario").value;
        const pessoas = document.getElementById("pessoas").value;

        mensagem.textContent =
            `Obrigado, ${nome}! Sua solicitação de reserva para ${pessoas} pessoa(s), no dia ${data}, às ${horario}, foi registrada nesta demonstração.`;

        formulario.reset();

    });

}


// ==========================================
// ANIMAÇÕES DURANTE A ROLAGEM
// ==========================================

const elementosParaRevelar = document.querySelectorAll(
    ".prato, .sobre-conteudo, #contato form"
);

if ("IntersectionObserver" in window) {

    elementosParaRevelar.forEach(elemento => {
        elemento.classList.add("revelar");
    });

    const observador = new IntersectionObserver((entradas) => {

        entradas.forEach(entrada => {

            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                observador.unobserve(entrada.target);
            }

        });

    }, {
        threshold: 0.15
    });

    elementosParaRevelar.forEach(elemento => {
        observador.observe(elemento);
    });

} else {

    elementosParaRevelar.forEach(elemento => {
        elemento.classList.add("visivel");
    });

}


// ==========================================
// MENU MOBILE
// ==========================================

if (botaoMenu && menuNavegacao) {

    botaoMenu.addEventListener("click", function() {

        const menuAberto = menuNavegacao.classList.toggle("aberto");

        botaoMenu.setAttribute("aria-expanded", menuAberto);

        botaoMenu.textContent = menuAberto ? "✕" : "☰";

    });

    menuNavegacao.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function() {

            menuNavegacao.classList.remove("aberto");

            botaoMenu.setAttribute("aria-expanded", "false");

            botaoMenu.textContent = "☰";

        });

    });

}


// ==========================================
// FORMULÁRIO DE CONTATO
// ==========================================

if (formContato) {

    const mensagemContato = document.getElementById("mensagemContato");

    formContato.addEventListener("submit", function(event) {

        event.preventDefault();

        if (mensagemContato) {
            mensagemContato.textContent =
                "Mensagem enviada com sucesso! (Demonstração)";

            mensagemContato.style.color = "#244536";
        }

        formContato.reset();

    });

}


// ==========================================
// FILTROS E PESQUISA DO CARDÁPIO
// ==========================================

let categoriaAtual = "todos";
let termoPesquisa = "";

function atualizarCardapio() {

    let quantidadeEncontrada = 0;

    pratos.forEach(prato => {

        const categoriaPrato = prato.dataset.categoria;

        const nomePrato = prato.querySelector("h3").textContent.toLowerCase();

        const descricaoPrato = prato.querySelector("p").textContent.toLowerCase();

        const correspondeCategoria =
            categoriaAtual === "todos" ||
            categoriaPrato === categoriaAtual;

        const correspondePesquisa =
            nomePrato.includes(termoPesquisa) ||
            descricaoPrato.includes(termoPesquisa);

        const encontrado =
            correspondeCategoria && correspondePesquisa;

        prato.style.display = encontrado ? "block" : "none";

        if (encontrado) {
            quantidadeEncontrada++;
        }

    });

    if (mensagemNenhumPrato) {
        mensagemNenhumPrato.style.display =
            quantidadeEncontrada === 0 ? "block" : "none";
    }

}


// BOTÕES DE FILTRO

botoesFiltro.forEach(botao => {

    botao.addEventListener("click", function() {

        categoriaAtual = this.dataset.categoria;

        botoesFiltro.forEach(btn => {
            btn.classList.remove("ativo");
        });

        this.classList.add("ativo");

        atualizarCardapio();

    });

});


// CAMPO DE PESQUISA

if (campoPesquisa) {

    campoPesquisa.addEventListener("input", function() {

        termoPesquisa = this.value.toLowerCase().trim();

        atualizarCardapio();

    });

}


// ==========================================
// MODO CLARO E MODO ESCURO
// ==========================================

const botaoTemaClaro = document.getElementById("temaClaro");
const botaoTemaEscuro = document.getElementById("temaEscuro");

function aplicarTema(tema) {

    document.body.classList.toggle("tema-escuro", tema === "escuro");

    try {
        localStorage.setItem("temaBellaTavola", tema);
    } catch (erro) {
        console.warn("Não foi possível salvar a preferência de tema.");
    }

}

if (botaoTemaClaro) {
    botaoTemaClaro.addEventListener("click", function() {
        aplicarTema("claro");
    });
}

if (botaoTemaEscuro) {
    botaoTemaEscuro.addEventListener("click", function() {
        aplicarTema("escuro");
    });
}


// Recuperar tema salvo

try {

    const temaSalvo = localStorage.getItem("temaBellaTavola");

    aplicarTema(temaSalvo === "escuro" ? "escuro" : "claro");

} catch (erro) {

    aplicarTema("claro");

}
