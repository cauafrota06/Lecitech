import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 2. Suas configurações exatas do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD5O7yI1k5nIKAHit-xNEglMfbvyU-mwjo",
    authDomain: "lecitech-c0846.firebaseapp.com",
    projectId: "lecitech-c0846",
    storageBucket: "lecitech-c0846.firebasestorage.app",
    messagingSenderId: "160358322782",
    appId: "1:160358322782:web:cd3c3890dab446205fdacf"
};

// 3. Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 4. Apontando exatamente para a pasta "estacao" que você criou
const estacaoRef = ref(database, 'estacao');

// 5. Escutando o banco em Tempo Real
onValue(estacaoRef, (snapshot) => {
    const dados = snapshot.val();
    
    if (dados) {
        console.log("Dados recebidos da placa:", dados); // Mostra no console do navegador

        // Atualiza o HTML (formatando com casas decimais para ficar bonito)
        // O "if" garante que o site não quebre se algum ID não existir no HTML
        if (document.getElementById("temperatura")) {
            document.getElementById("temperatura").textContent = dados.temperatura.toFixed(1);
        }
        if (document.getElementById("umidade")) {
            document.getElementById("umidade").textContent = dados.umidade.toFixed(1);
        }
        if (document.getElementById("pressao")) {
            document.getElementById("pressao").textContent = dados.pressao.toFixed(1);
        }
        if (document.getElementById("co2")) {
            document.getElementById("co2").textContent = dados.co2.toFixed(0);
        }
        if (document.getElementById("nh3")) {
            document.getElementById("nh3").textContent = dados.nh3.toFixed(2);
        }
        if (document.getElementById("qualidadeAr")) {
            document.getElementById("qualidadeAr").textContent = dados.qualidadeAr;
        }
    }
});

// 6. Seu relógio (mantido intacto)
function atualizarRelogio() {
    const agora = new Date();

    if(document.getElementById("hora")) {
        document.getElementById("hora").textContent = agora.toLocaleTimeString("pt-BR", {
            timeZone: "America/Manaus",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    if(document.getElementById("data")) {
        document.getElementById("data").textContent = agora.toLocaleDateString("pt-BR", {
            timeZone: "America/Manaus",
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);