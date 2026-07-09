// 1. Importações do Firebase (SDK Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 2. Configuração do seu Banco de Dados (Firebase Lecitech)
const firebaseConfig = {
    apiKey: "AIzaSyD507yI1k5nIKAHit-xNEglMfbvyU-mwjo",
    databaseURL: "https://lecitech-c0846-default-rtdb.firebaseio.com/",
    projectId: "lecitech-c0846"
};

// 3. Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ---------------------------------------------------------
// 4. Função do Relógio Local (Data e Hora)
// ---------------------------------------------------------
function atualizarRelogio() {
    const agora = new Date();
    
    // Formata a data (ex: quinta-feira, 9 de julho de 2026)
    const opcoesData = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = agora.toLocaleDateString('pt-BR', opcoesData);
    
    // Formata a hora (ex: 10:52:35)
    const horaFormatada = agora.toLocaleTimeString('pt-BR');

    if (document.getElementById('hora')) {
        document.getElementById('hora').textContent = horaFormatada;
    }
    if (document.getElementById('data')) {
        document.getElementById('data').textContent = dataFormatada;
    }
}

// Inicia o relógio e atualiza a cada 1 segundo (1000 ms)
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// ---------------------------------------------------------
// 5. Comunicação em Tempo Real com a Estação Meteorológica
// ---------------------------------------------------------
const estacaoRef = ref(database, 'estacao');

onValue(estacaoRef, (snapshot) => {
    const dados = snapshot.val();
    
    if (dados) {
        console.log("Dados meteorológicos recebidos:", dados);

        // Preenche cada card validando se o dado existe no Firebase e se o card existe no HTML
        if (document.getElementById("temperatura") && dados.temperatura !== undefined) {
            document.getElementById("temperatura").textContent = dados.temperatura.toFixed(1);
        }
        
        if (document.getElementById("umidade") && dados.umidade !== undefined) {
            document.getElementById("umidade").textContent = dados.umidade.