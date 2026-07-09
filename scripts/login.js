// 1. Importações do Firebase (Auth + Database)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 2. Credenciais da Lecitech
const firebaseConfig = {
    apiKey: "AIzaSyD507yI1k5nIKAHit-xNEglMfbvyU-mwjo",
    databaseURL: "https://lecitech-c0846-default-rtdb.firebaseio.com/",
    projectId: "lecitech-c0846"
};

// 3. Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Conectando o banco de dados!

// ---------------------------------------------------------
// LÓGICA DE INTERFACE: Alternar entre Login e Cadastro
// ---------------------------------------------------------
const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");
const btnIrCadastro = document.getElementById("btn-ir-cadastro");
const btnIrLogin = document.getElementById("btn-ir-login");

btnIrCadastro.addEventListener("click", () => {
    formLogin.classList.remove("active");
    formCadastro.classList.add("active");
});

btnIrLogin.addEventListener("click", () => {
    formCadastro.classList.remove("active");
    formLogin.classList.add("active");
});

// ---------------------------------------------------------
// LÓGICA DO FIREBASE: Fazer Login
// ---------------------------------------------------------
formLogin.addEventListener("submit", (e) => {
    e.preventDefault(); 
    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;

    signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            console.log("Usuário logado com sucesso!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Erro ao fazer login. Verifique seu e-mail e senha.");
            console.error(error.code, error.message);
        });
});

// ---------------------------------------------------------
// LÓGICA DO FIREBASE: Cadastrar e Salvar no Banco de Dados
// ---------------------------------------------------------
formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("senha-cadastro").value;

    // 1º Passo: Cria a conta criptografada no Firebase Auth
    createUserWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // 2º Passo: Salva os dados públicos do usuário no Realtime Database
            // Isso criará uma pasta "usuarios" e salvará o email usando o ID único da pessoa
            set(ref(database, 'usuarios/' + user.uid), {
                email: user.email,
                dataCadastro: new Date().toISOString(),
                nivelAcesso: "comum" // Você pode usar isso depois para dar privilégios diferentes!
            })
            .then(() => {
                alert("Conta criada com sucesso! Bem-vindo à Lecitech.");
                window.location.href = "index.html"; // Redireciona para o painel principal
            })
            .catch((dbError) => {
                console.error("Erro ao salvar perfil no banco:", dbError);
                alert("Conta criada, mas houve um erro ao registrar no banco.");
            });
        })
        .catch((error) => {
            if (error.code === 'auth/weak-password') {
                alert("Sua senha precisa ter pelo menos 6 caracteres.");
            } else if (error.code === 'auth/email-already-in-use') {
                alert("Este e-mail já está cadastrado no sistema.");
            } else {
                alert("Erro inesperado ao criar a conta.");
            }
            console.error(error.code, error.message);
        });
});