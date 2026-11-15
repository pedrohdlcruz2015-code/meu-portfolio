
/* ANO AUTOMÁTICO NO RODAPÉ */

const rodape = document.querySelector("footer p");

const anoAtual = new Date().getFullYear();

rodape.textContent =
    `© ${anoAtual} Meu Portfólio | Desenvolvido com HTML, CSS e JavaScript.`;


/* NAVEGAÇÃO SUAVE */

const linksMenu = document.querySelectorAll("nav a");

linksMenu.forEach(link => {
    link.addEventListener("click", function() {
        const destino = document.querySelector(
            this.getAttribute("href")
        );

        if (destino) {
            destino.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});
