import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Credenciais Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD507yI1k5nIKAHit-xNEglMfbvyU-mwjo",
    databaseURL: "https://lecitech-c0846-default-rtdb.firebaseio.com/",
    projectId: "lecitech-c0846"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Apontamos agora para o nó 'historico' que acumula os dados
const historicoRef = ref(database, 'historico');

// ================= VARIÁVEIS DE CONTROLE =================
let meuGrafico = null; 
let sensorAtivo = ""; 
let todoOHistoricoFirebase = null; // Guarda todas as leituras da nuvem na memória

// Elementos da Interface
const menuGraficos = document.getElementById('menu-graficos');
const areaGrafico = document.getElementById('area-grafico');
const btnVoltar = document.getElementById('btn-voltar');
const tituloSecao = document.getElementById('titulo-secao');
const subtituloSecao = document.getElementById('subtitulo-secao');
const ctx = document.getElementById('graficoCanvas').getContext('2d');

// ================= FUNÇÃO PARA PROCESSAR E EXIBIR O GRÁFICO =================
function abrirGrafico(sensorID, cor, icone, nomeExibicao) {
    sensorAtivo = sensorID; 
    
    // 1. Troca as telas na interface
    menuGraficos.style.display = 'none';
    areaGrafico.style.display = 'block';
    
    tituloSecao.innerText = `Análise de Histórico: ${nomeExibicao}`;
    subtituloSecao.innerText = "Relatório de variações climáticas com base nos dados armazenados.";
    
    document.getElementById('nome-grafico-ativo').innerHTML = `<i class="fa-solid ${icone}" style="color: ${cor};"></i> ${nomeExibicao}`;
    document.getElementById('valor-atual-destaque').style.color = cor;

    // 2. Destrói o gráfico anterior para não sobrepor dados
    if (meuGrafico != null) {
        meuGrafico.destroy();
    }

    // 3. Inicializa a estrutura do Chart.js vazia
    meuGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Eixo X (Horários)
            datasets: [{
                label: nomeExibicao,
                data: [], // Eixo Y (Valores)
                borderColor: cor,
                backgroundColor: cor.replace(')', ', 0.08)').replace('rgb', 'rgba').replace('#FF4B4B', 'rgba(255, 75, 75, 0.08)').replace('#00E5FF', 'rgba(0, 229, 255, 0.08)').replace('#4FC3F7', 'rgba(79, 195, 247, 0.08)').replace('#B0BEC5', 'rgba(176, 190, 197, 0.08)'),
                borderWidth: 3,
                pointBackgroundColor: '#1a2430',
                pointBorderColor: cor,
                pointBorderWidth: 2,
                pointRadius: 3,
                fill: true,
                tension: 0.3 // Linha levemente suavizada
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ba6b5' } },
                x: { grid: { display: false }, ticks: { color: '#9ba6b5', maxTicksLimit: 12 } // Limita marcações no eixo X para não amontoar
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // 4. Se o banco de dados já tiver carregado na memória, processa os pontos
    if (todoOHistoricoFirebase) {
        gerarRelatorioGrafico(todoOHistoricoFirebase);
    }
}

// ================= LÓGICA DE MONTAGEM DO RELATÓRIO =================
function gerarRelatorioGrafico(dadosHistorico) {
    if (!meuGrafico || sensorAtivo === "") return;

    const listaLabels = [];
    const listaValores = [];
    let ultimoValorLido = 0;
    let unidade = "";

    // Como o Firebase push gera um objeto de objetos, varremos cada ID único
    Object.keys(dadosHistorico).forEach(idUnico => {
        const leitura = dadosHistorico[idUnico];
        
        let valor = 0;
        if (sensorAtivo === "temperatura") { valor = parseFloat(leitura.temperatura); unidade = " °C"; }
        else if (sensorAtivo === "umidade") { valor = parseFloat(leitura.umidade); unidade = " %"; }
        else if (sensorAtivo === "chuva") { valor = parseFloat(leitura.chuva); unidade = " mm"; }
        else if (sensorAtivo === "vento") { valor = parseFloat(leitura.vento); unidade = " km/h"; }

        // Formata o rótulo do eixo X. 
        // Se a datahora for "10-07-2026 08:54:27", pegamos apenas o dia e a hora/minuto -> "10 08:54"
        const partes = leitura.datahora.split(' ');
        const dia = partes[0].split('-')[0]; // Pega só o dia do mês
        const horaMinuto = partes[1].substring(0, 5); // Pega só HH:MM
        const labelFormatado = `${dia} às ${horaMinuto}`;

        listaLabels.push(labelFormatado);
        listaValores.push(valor.toFixed(1));
        ultimoValorLido = valor.toFixed(1);
    });

    // Filtro para relatórios longos: Mostra apenas as últimas 96 leituras no gráfico
    // Se o ESP32 envia a cada 15 min, 96 leituras representam exatamente as últimas 24 horas (1 dia completo)!
    if (listaLabels.length > 96) {
        meuGrafico.data.labels = listaLabels.slice(-96);
        meuGrafico.data.datasets[0].data = listaValores.slice(-96);
    } else {
        meuGrafico.data.labels = listaLabels;
        meuGrafico.data.datasets[0].data = listaValores;
    }

    // Atualiza o display do valor de destaque com o último dado registrado
    document.getElementById('valor-atual-destaque').innerText = `${ultimoValorLido}${unidade}`;
    
    // Renderiza o gráfico atualizado na tela
    meuGrafico.update();
}

// ================= ESCUTA O BANCO DE DADOS EM TEMPO REAL =================
onValue(historicoRef, (snapshot) => {
    const dados = snapshot.val();
    if (dados) {
        todoOHistoricoFirebase = dados; // Salva o banco de dados completo na memória cache do site
        
        // Se o usuário estiver com um gráfico aberto no momento da atualização, renova o gráfico
        if (sensorAtivo !== "") {
            gerarRelatorioGrafico(dados);
        }
    }
});

// ================= EVENTOS DE CLIQUE (NAVEGAÇÃO) =================
document.querySelectorAll('.card-clicavel').forEach(card => {
    card.addEventListener('click', () => {
        const sensorID = card.getAttribute('data-sensor');
        const cor = card.getAttribute('data-cor');
        const icone = card.getAttribute('data-icone');
        const nome = card.getAttribute('data-nome');
        
        abrirGrafico(sensorID, cor, icone, nome);
    });
});

btnVoltar.addEventListener('click', () => {
    sensorAtivo = ""; 
    areaGrafico.style.display = 'none';
    menuGraficos.style.display = 'grid'; 
    tituloSecao.innerText = "Selecione um Sensor para Análise";
    subtituloSecao.innerText = "Escolha uma variável climática para gerar o relatório gráfico.";
});