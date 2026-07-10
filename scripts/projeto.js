// 1. Efeito de Aparecimento Suave (Scroll Reveal)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // Se o elemento entrar na tela
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.1 // Ativa quando 10% do elemento aparecer
});

// Pega todos os elementos com a classe .hidden e começa a observar
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// 2. Efeito "Lanterna" nos Cartões (Hover Dinâmico)
const cards = document.querySelectorAll('.info-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        // Calcula a posição do rato dentro do cartão
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Atualiza as variáveis do CSS em tempo real
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});