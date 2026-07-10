import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD507yI1k5nIKAHit-xNEglMfbvyU-mwjo",
    databaseURL: "https://lecitech-c0846-default-rtdb.firebaseio.com/",
    projectId: "lecitech-c0846"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const formRecuperar = document.getElementById("form-recuperar");

formRecuperar.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email-recuperar").value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            // Sucesso!
            alert("Sucesso! Verifique sua caixa de entrada (e a pasta de Spam) para redefinir sua senha.");
            window.location.href = "login.html"; // Manda o usuário de volta pro login
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-email') {
                alert("O formato do e-mail é inválido.");
            } else {
                alert("Erro ao enviar o e-mail. Verifique se o e-mail está correto.");
            }
            console.error("Erro Firebase:", error.code);
        });
});