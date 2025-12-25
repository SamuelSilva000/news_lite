/**
 * PROJETO: NewsLite - Sistema Editorial
 * LÓGICA: Redirecionamento para artigo e filtros dinâmicos.
 */

// 1. Banco de Dados Editorial
const baseNews = [
    { cat: "MUNDO", title: "ESPECIAL: Relações Taiwan e China em 2025 - O que esperar da geopolítica asiática", especial: true, date: "25 Dez 2025", period: "today" },
    { cat: "BRASIL", title: "Oásis Urbano: Como Curitiba está redefinindo o conceito de cidades verdes", date: "25 Dez 2025", period: "today" },
    { cat: "TECNOLOGIA", title: "Além da Tela: Óculos de RA prometem substituir smartphones em 2026", date: "25 Dez 2025", period: "today" },
    { cat: "NEGÓCIOS", title: "A Recompensa do Risco: Startups brasileiras atraem bilhões em novo ciclo", date: "25 Dez 2025", period: "today" },
    { cat: "CIÊNCIA", title: "Segredos Estelares: Telescópio capta o nascimento de um sistema solar", date: "24 Dez 2025", period: "week" },
    { cat: "BRASIL", title: "Ritmo e Sabor: O renascimento dos mercados municipais pelo país", date: "23 Dez 2025", period: "week" },
    { cat: "MUNDO", title: "Veneza 2.0: O plano audacioso para salvar a cidade das águas", date: "22 Dez 2025", period: "week" },
    { cat: "TECNOLOGIA", title: "Inteligência Artificial agora compõe sinfonias inéditas", date: "21 Dez 2025", period: "week" }
];

// Gerador para completar as categorias
const categories = ["BRASIL", "MUNDO", "TECNOLOGIA", "NEGÓCIOS", "CIÊNCIA"];
let allNewsDB = [...baseNews];

categories.forEach(cat => {
    const currentCount = allNewsDB.filter(n => n.cat === cat).length;
    for (let i = currentCount + 1; i <= 12; i++) {
        allNewsDB.push({
            cat: cat,
            title: `Reportagem ${cat}: Análise sobre os novos rumos do mercado global (#${i})`,
            img: `https://picsum.photos/seed/${cat}${i}/400/225`,
            date: `${20 - i} Dez 2025`,
            period: "week",
            especial: false
        });
    }
});

// Adicionando imagens para as notícias da base
allNewsDB = allNewsDB.map((n, idx) => ({
    ...n,
    img: n.img || `https://picsum.photos/seed/main${idx}/400/225`
}));

// 2. Variáveis de Controle
let visibleCount = 8;
const containerToday = document.getElementById('news-container-today');
const containerWeek = document.getElementById('news-container-week');
const labelToday = document.getElementById('label-today');
const loadMoreBtn = document.getElementById('load-more-btn');

/**
 * 3. Função de Renderização
 */
function renderNews(filter = "TUDO") {
    containerToday.innerHTML = "";
    containerWeek.innerHTML = "";
    
    let filtered = allNewsDB.filter(n => filter === "TUDO" || n.cat === filter);

    if (filter === "TUDO") {
        labelToday.classList.remove('hidden');
        containerToday.classList.remove('hidden');

        const newsToday = filtered.filter(n => n.period === "today");
        newsToday.forEach(item => containerToday.appendChild(createCard(item)));

        const newsWeek = filtered.filter(n => n.period === "week");
        const weekBatch = newsWeek.slice(0, visibleCount);
        weekBatch.forEach(item => containerWeek.appendChild(createCard(item)));
        
        loadMoreBtn.style.display = (visibleCount >= newsWeek.length) ? "none" : "inline-block";
    } else {
        labelToday.classList.add('hidden');
        containerToday.classList.add('hidden');

        const batch = filtered.slice(0, visibleCount);
        batch.forEach(item => containerWeek.appendChild(createCard(item)));

        loadMoreBtn.style.display = (visibleCount >= filtered.length) ? "none" : "inline-block";
    }
}

/**
 * 4. Helper para Criar o Card com Link para Artigo
 */
function createCard(item) {
    const article = document.createElement('article');
    article.className = `card-news ${item.especial ? 'especial' : ''}`;
    
    // CONEXÃO COM A PÁGINA DE ARTIGO
    article.onclick = () => {
        if (item.especial || item.title.includes("Taiwan")) {
            window.location.href = 'artigo.html';
        } else {
            console.log("Artigo em desenvolvimento.");
            // Opcional: window.location.href = 'artigo.html'; (se quiser que todas abram o mesmo modelo)
        }
    };

    article.innerHTML = `
        <img src="${item.img}" class="card-img" alt="${item.title}">
        <div class="card-meta">
            <span>${item.cat}</span>
            <span class="news-date">${item.date}</span>
        </div>
        <h3>${item.title}</h3>
    `;
    return article;
}

/**
 * 5. Eventos de Clique
 */
document.querySelectorAll('#main-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('#main-menu a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        visibleCount = 8;
        renderNews(link.getAttribute('data-cat'));
    });
});

loadMoreBtn.onclick = () => {
    visibleCount += 4;
    const activeCat = document.querySelector('#main-menu a.active').getAttribute('data-cat');
    renderNews(activeCat);
};

window.onload = () => {
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    document.getElementById('top-date').innerText = new Date().toLocaleDateString('pt-BR', options);
    renderNews("TUDO");
};
