import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Credenciais da Lecitech
const firebaseConfig = {
    apiKey: "AIzaSyD507yI1k5nIKAHit-xNEglMfbvyU-mwjo",
    databaseURL: "https://lecitech-c0846-default-rtdb.firebaseio.com/",
    projectId: "lecitech-c0846"
};

// Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const formLogin = document.getElementById("form-login");

// Lógica de Autenticação
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
            // Tratamento de erros amigável para o usuário
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                alert("E-mail ou senha incorretos. Tente novamente.");
            } else {
                alert("Erro ao tentar entrar: " + error.message);
            }
            console.error("Código do erro:", error.code);
        });
});