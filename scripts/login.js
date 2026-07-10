import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD507yI1k5nIKAHit-xNEglMfbvyU-mwjo",
    databaseURL: "https://lecitech-c0846-default-rtdb.firebaseio.com/",
    projectId: "lecitech-c0846"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", (e) => {
    e.preventDefault(); 
    
    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;

    signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            console.log("Acesso autorizado para:", userCredential.user.email);
            // Redireciona para o painel de sensores
            window.location.href = "index.html";
        })
        .catch((error) => {
            // Tratamento de erros amigável para o utilizador
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                alert("E-mail ou senha incorretos. Tente novamente.");
            } else {
                alert("Erro ao tentar entrar: " + error.message);
            }
            console.error("Código do erro:", error.code);
        });
});
// ---------------------------------------------------------
// LÓGICA DO OLHINHO DA SENHA (Segurar para ver)
// ---------------------------------------------------------
const senhaInput = document.getElementById("senha-login");
const olhoIcon = document.getElementById("olho-senha");

// Função que transforma bolinhas em texto
const mostrarSenha = () => {
    senhaInput.type = "text";
};

// Função que transforma texto em bolinhas
const esconderSenha = () => {
    senhaInput.type = "password";
};

// Eventos para Computador (Mouse)
olhoIcon.addEventListener("mousedown", mostrarSenha);
olhoIcon.addEventListener("mouseup", esconderSenha);
olhoIcon.addEventListener("mouseleave", esconderSenha); // Esconde se o rato sair de cima do olho

// Eventos para Celular (Touch)
olhoIcon.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Evita que o celular tente selecionar o ícone
    mostrarSenha();
});
olhoIcon.addEventListener("touchend", esconderSenha);