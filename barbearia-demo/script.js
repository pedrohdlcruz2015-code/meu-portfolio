
// NAVALHA URBANA

console.log("Navalha Urbana carregada com sucesso!");

const links = document.querySelectorAll(".menu a");

links.forEach(function(link) {
    link.addEventListener("click", function() {
        console.log("Navegando para:", link.textContent);
    });
});
