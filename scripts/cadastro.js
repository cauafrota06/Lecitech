import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD507yI1k5nIKAHit-xNEglMfbvyU-mwjo",
    databaseURL: "https://lecitech-c0846-default-rtdb.firebaseio.com/",
    projectId: "lecitech-c0846"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const formCadastro = document.getElementById("form-cadastro");

formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("senha-cadastro").value;

    // 1º Passo: Cria conta segura
    createUserWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // 2º Passo: Grava perfil no banco de dados Realtime
            set(ref(database, 'usuarios/' + user.uid), {
                email: user.email,
                dataCadastro: new Date().toISOString(),
                nivelAcesso: "comum"
            })
            .then(() => {
                alert("Conta criada e registrada no banco de dados com sucesso!");
                // Redireciona para o painel principal
                window.location.href = "monitoramento.html"; 
            })
            .catch((dbError) => {
                console.error("Erro no DB:", dbError);
                alert("Conta criada, mas erro ao escrever no banco de dados.");
            });
        })
        .catch((error) => {
            if (error.code === 'auth/weak-password') {
                alert("A senha precisa ter pelo menos 6 caracteres.");
            } else if (error.code === 'auth/email-already-in-use') {
                alert("Este e-mail já existe no banco de dados.");
            } else {
                alert("Erro ao criar conta: " + error.message);
            }
        });
});