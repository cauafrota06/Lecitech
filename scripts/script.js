import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Suas credenciais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD507yI1k5nIKAHit-xNEglMfbvyU-mwjo",
    databaseURL: "https://lecitech-c0846-default-rtdb.firebaseio.com/",
    projectId: "lecitech-c0846"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Cria uma referência para a pasta 'estacao' no banco de dados
const estacaoRef = ref(database, 'estacao');

// O 'onValue' fica escutando o banco de dados em tempo real
onValue(estacaoRef, (snapshot) => {
    const dados = snapshot.val();

    if (dados) {
        // Pega os dados do banco e injeta nos IDs corretos do HTML
        // Usamos o .toFixed(1) para deixar apenas 1 casa decimal e ficar mais bonito
        document.getElementById('temp').innerText = parseFloat(dados.temperatura).toFixed(1);
        document.getElementById('umid').innerText = parseFloat(dados.umidade).toFixed(1);
        document.getElementById('chuva').innerText = parseFloat(dados.chuva).toFixed(1);
        document.getElementById('vento').innerText = parseFloat(dados.vento).toFixed(1);
        document.getElementById('pressao').innerText = parseFloat(dados.pressao).toFixed(1);
        
        // CO2 e NH3 geralmente são números inteiros
        document.getElementById('co2').innerText = parseInt(dados.co2);
        document.getElementById('nh3').innerText = parseInt(dados.nh3);
        
        // Textos
        document.getElementById('qualidade').innerText = dados.qualidadeAr;
        document.getElementById('datahora').innerText = "Última atualização: " + dados.datahora;

        console.log("Dados atualizados com sucesso!");
    } else {
        console.log("Nenhum dado encontrado no nó 'estacao'.");
    }
}, (error) => {
    console.error("Erro ao ler os dados:", error);
});