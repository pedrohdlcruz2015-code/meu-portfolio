
// =====================================
// CONFIGURAÇÕES INICIAIS
// =====================================

let saldoSalvo = localStorage.getItem("bluebankSaldo");

let movimentacoesSalvas;

try {
    movimentacoesSalvas = JSON.parse(
        localStorage.getItem("bluebankMovimentacoes")
    ) || [];
} catch {
    movimentacoesSalvas = [];
}

if (!Array.isArray(movimentacoesSalvas)) {
    movimentacoesSalvas = [];
}

let saldo = saldoSalvo === null
    ? 1000
    : Number(saldoSalvo);

if (!Number.isFinite(saldo)) {
    saldo = 1000;
}

let nomeSalvo = localStorage.getItem("bluebankNome");

let saldoVisivel = true;


// =====================================
// ATUALIZAR SALDO
// =====================================

function atualizarSaldo() {

    localStorage.setItem("bluebankSaldo", saldo);

    let elementoSaldo = document.getElementById("saldo");

    if (saldoVisivel) {

        elementoSaldo.innerText = saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    } else {

        elementoSaldo.innerText = "R$ ••••••";

    }

}


// =====================================
// REGISTRAR MOVIMENTAÇÕES
// =====================================

function registrarMovimentacao(tipo, valor) {

    let historico = document.getElementById("movimentacoes");

    if (historico.innerText.trim() === "Nenhuma movimentação ainda.") {
        historico.innerHTML = "";
    }

    let data = new Date();

    let dataFormatada = data.toLocaleString("pt-BR");

    let textoMovimentacao =
        tipo + " — " +
        valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        }) +
        " | " + dataFormatada;

    let movimentacao = document.createElement("p");

    movimentacao.innerText = textoMovimentacao;

    historico.prepend(movimentacao);

    movimentacoesSalvas.unshift(
        textoMovimentacao + "||" + data.toISOString()
    );

    localStorage.setItem(
        "bluebankMovimentacoes",
        JSON.stringify(movimentacoesSalvas)
    );

    atualizarDashboard();

}


// =====================================
// CARREGAR MOVIMENTAÇÕES
// =====================================

function carregarMovimentacoes() {

    let historico = document.getElementById("movimentacoes");

    historico.innerHTML = "";

    if (movimentacoesSalvas.length === 0) {

        historico.innerHTML = "<p>Nenhuma movimentação ainda.</p>";

        return;

    }

    movimentacoesSalvas.forEach(function(item) {

        let movimentacao = document.createElement("p");

        movimentacao.innerText = item.split("||")[0];

        historico.appendChild(movimentacao);

    });

}


// =====================================
// RECEBER DINHEIRO
// =====================================

function receberDinheiro() {

    let resposta = prompt(
        "Quanto deseja receber? (Valor fictício)"
    );

    if (resposta === null) return;

    let valor = Number(resposta);

    if (valor > 0 && Number.isFinite(valor)) {

        saldo += valor;

        atualizarSaldo();

        registrarMovimentacao("Recebimento", valor);

        alert("Recebimento simulado com sucesso!");

    } else {

        alert("Digite um valor válido!");

    }

}


// =====================================
// TRANSFERIR DINHEIRO
// =====================================

function transferirDinheiro() {

    let resposta = prompt(
        "Quanto deseja transferir? (Valor fictício)"
    );

    if (resposta === null) return;

    let valor = Number(resposta);

    if (!Number.isFinite(valor) || valor <= 0) {

        alert("Digite um valor válido!");

    } else if (valor > saldo) {

        alert("Saldo insuficiente!");

    } else {

        saldo -= valor;

        atualizarSaldo();

        registrarMovimentacao("Transferência", valor);

        alert("Transferência simulada realizada!");

    }

}


// =====================================
// CADASTRO
// =====================================

document.getElementById("formCadastro").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        let nome = document.getElementById("nomeUsuario").value.trim();

        let senha = document.getElementById("senhaUsuario").value;

        let confirmarSenha =
            document.getElementById("confirmarSenha").value;

        let mensagem = document.getElementById("mensagemCadastro");

        if (nome.length === 0) {

            mensagem.innerText = "Digite seu nome!";

            return;

        }

        if (senha.length < 6) {

            mensagem.innerText =
                "A senha precisa ter pelo menos 6 caracteres!";

            return;

        }

        if (senha !== confirmarSenha) {

            mensagem.innerText = "As senhas não são iguais!";

            return;

        }

        // Apenas demonstração local.
        // Nunca utilize senhas verdadeiras aqui.

        localStorage.setItem("bluebankNome", nome);
        localStorage.setItem("bluebankSenha", senha);

        nomeSalvo = nome;

        entrarNoBlueBank();

    }
);


// =====================================
// LOGIN
// =====================================

document.getElementById("formLogin").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        let nome = document.getElementById("nomeLogin").value.trim();

        let senha = document.getElementById("senhaLogin").value;

        let nomeCadastrado = localStorage.getItem("bluebankNome");

        let senhaCadastrada = localStorage.getItem("bluebankSenha");

        let mensagem = document.getElementById("mensagemLogin");

        if (nome !== nomeCadastrado || senha !== senhaCadastrada) {

            mensagem.innerText = "Nome ou senha incorretos!";

            return;

        }

        nomeSalvo = nomeCadastrado;

        entrarNoBlueBank();

    }
);


// =====================================
// ENTRAR NO BLUEBANK
// =====================================

function entrarNoBlueBank() {

    document.getElementById("telaCadastro").style.display = "none";

    document.getElementById("telaLogin").style.display = "none";

    document.querySelector("header").style.display = "block";

    document.getElementById("menuPrincipal").style.display = "flex";

    document.querySelector("main").style.display = "block";

    document.querySelector(".perfil-info h3").innerText = nomeSalvo;

    document.querySelector(".avatar").innerText =
        nomeSalvo.charAt(0).toUpperCase();

    atualizarSaldo();

    carregarMovimentacoes();

    atualizarDashboard();

    mostrarPagina("inicio");

}


// =====================================
// INICIAR SISTEMA
// =====================================

atualizarSaldo();

carregarMovimentacoes();

document.getElementById("menuPrincipal").style.display = "none";

if (nomeSalvo !== null) {

    document.getElementById("telaCadastro").style.display = "none";

    document.getElementById("telaLogin").style.display = "flex";

    document.querySelector("header").style.display = "none";

    document.querySelector("main").style.display = "none";

} else {

    document.getElementById("telaCadastro").style.display = "flex";

    document.getElementById("telaLogin").style.display = "none";

    document.querySelector("header").style.display = "none";

    document.querySelector("main").style.display = "none";

}


// =====================================
// SAIR DA CONTA
// =====================================

function sairDaConta() {

    let confirmar = confirm(
        "Deseja realmente sair da sua conta?"
    );

    if (confirmar) {

        document.querySelector("header").style.display = "none";

        document.querySelector("main").style.display = "none";

        document.getElementById("menuPrincipal").style.display = "none";

        document.getElementById("telaLogin").style.display = "flex";

        document.getElementById("nomeLogin").value = "";

        document.getElementById("senhaLogin").value = "";

        document.getElementById("mensagemLogin").innerText = "";

    }

}


// =====================================
// EDITAR PERFIL
// =====================================

function editarPerfil() {

    let novoNome = prompt(
        "Digite seu novo nome:",
        nomeSalvo
    );

    if (novoNome === null) return;

    novoNome = novoNome.trim();

    if (novoNome.length === 0) {

        alert("O nome não pode ficar vazio!");

        return;

    }

    nomeSalvo = novoNome;

    localStorage.setItem("bluebankNome", novoNome);

    document.querySelector(".perfil-info h3").innerText = novoNome;

    document.querySelector(".avatar").innerText =
        novoNome.charAt(0).toUpperCase();

    alert("Perfil atualizado com sucesso!");

}


// =====================================
// OCULTAR E MOSTRAR SALDO
// =====================================

function alternarSaldo() {

    let botao = document.getElementById("botaoSaldo");

    saldoVisivel = !saldoVisivel;

    atualizarSaldo();

    if (saldoVisivel) {

        botao.innerText = "Ocultar saldo";

    } else {

        botao.innerText = "Mostrar saldo";

    }

}


// =====================================
// NAVEGAÇÃO
// =====================================

function mostrarPagina(pagina) {

    document.querySelector(".saldo").style.display = "none";

    document.querySelector(".dashboard").style.display = "none";

    document.querySelector(".acoes").style.display = "none";

    document.querySelector(".extrato").style.display = "none";

    document.querySelector(".cartoes").style.display = "none";

    document.querySelector(".perfil").style.display = "none";

    if (pagina === "inicio") {

        document.querySelector(".dashboard").style.display = "block";

        document.querySelector(".saldo").style.display = "block";

        document.querySelector(".acoes").style.display = "flex";

    } else if (pagina === "conta") {

        document.querySelector(".perfil").style.display = "block";

    } else if (pagina === "extrato") {

        document.querySelector(".extrato").style.display = "block";

        filtrarMovimentacoes();

    } else if (pagina === "cartoes") {

        document.querySelector(".cartoes").style.display = "block";

    }

}


// =====================================
// ATUALIZAR DASHBOARD
// =====================================

function atualizarDashboard() {

    let entradas = 0;

    let saidas = 0;

    movimentacoesSalvas.forEach(function(item) {

        let texto = item.split("||")[0];

        let valorEncontrado = texto.match(/R\$\s*([\d.,]+)/);

        if (!valorEncontrado) return;

        let valor = Number(
            valorEncontrado[1]
                .replace(/\./g, "")
                .replace(",", ".")
        );

        if (!Number.isFinite(valor)) return;

        if (texto.startsWith("Recebimento")) {

            entradas += valor;

        }

        if (texto.startsWith("Transferência")) {

            saidas += valor;

        }

    });

    let cards = document.querySelectorAll(".resumo-card p");

    cards[0].innerText = entradas.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cards[1].innerText = saidas.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cards[2].innerText = movimentacoesSalvas.length;

    let maiorValor = Math.max(entradas, saidas, 1);

    let larguraEntradas = (entradas / maiorValor) * 100;

    let larguraSaidas = (saidas / maiorValor) * 100;

    document.getElementById("barraEntradas").style.width =
        larguraEntradas + "%";

    document.getElementById("barraSaidas").style.width =
        larguraSaidas + "%";

}


// =====================================
// INTERPRETAR DATA DA MOVIMENTAÇÃO
// =====================================

function obterDataMovimentacao(item) {

    let partes = item.split("||");

    if (partes[1]) {

        let dataISO = new Date(partes[1]);

        if (!isNaN(dataISO.getTime())) {
            return dataISO;
        }

    }

    let dataTexto = item.split(" | ")[1];

    if (!dataTexto) return null;

    let correspondencia = dataTexto.match(
        /^(\d{2})\/(\d{2})\/(\d{4}),?\s*(\d{2}):(\d{2})(?::(\d{2}))?$/
    );

    if (!correspondencia) return null;

    let [, dia, mes, ano, hora, minuto, segundo = "0"] =
        correspondencia;

    return new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia),
        Number(hora),
        Number(minuto),
        Number(segundo)
    );

}


// =====================================
// FILTRAR MOVIMENTAÇÕES
// =====================================

function filtrarMovimentacoes() {

    let filtro = document.getElementById("filtroMovimentacoes").value;

    let historico = document.getElementById("movimentacoes");

    historico.innerHTML = "";

    let listaFiltrada = movimentacoesSalvas;

    if (filtro !== "todas") {

        let dias = Number(filtro);

        let dataLimite = new Date();

        dataLimite.setDate(dataLimite.getDate() - dias);

        listaFiltrada = movimentacoesSalvas.filter(function(item) {

            let dataMovimentacao = obterDataMovimentacao(item);

            return dataMovimentacao !== null &&
                dataMovimentacao >= dataLimite;

        });

    }

    if (listaFiltrada.length === 0) {

        historico.innerHTML =
            "<p>Nenhuma movimentação encontrada.</p>";

        return;

    }

    listaFiltrada.forEach(function(item) {

        let movimentacao = document.createElement("p");

        movimentacao.innerText = item.split("||")[0];

        historico.appendChild(movimentacao);

    });

}
