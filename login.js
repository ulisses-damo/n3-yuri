// ===================================
// CONFIGURAÇÃO DO FIREBASE
// ===================================
// Importe as funções necessárias do Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuração do Firebase - Substitua pelos seus dados
const firebaseConfig = {
   apiKey: "AIzaSyDU7oOSmOrmjJezyfXcieVU-qWLGozurT0",
  authDomain: "n3-yuri-ulissesdamo-4d3ae.firebaseapp.com",
  projectId: "n3-yuri-ulissesdamo-4d3ae",
  storageBucket: "n3-yuri-ulissesdamo-4d3ae.firebasestorage.app",
  messagingSenderId: "442899283360",
  appId: "1:442899283360:web:01a284f1c18e1b9a68b8c5",
  measurementId: "G-GSC4TK2NLQ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ===================================
// ELEMENTOS DO DOM
// ===================================
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const registerBtn = document.getElementById('registerBtn');
const forgotPasswordLink = document.getElementById('forgotPassword');

// ===================================
// FUNÇÕES DE MENSAGEM
// ===================================
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

function hideMessage() {
    messageDiv.style.display = 'none';
    messageDiv.className = 'message';
}

// ===================================
// SALVAR DADOS DO USUÁRIO NO FIRESTORE
// ===================================
async function saveUserData(user) {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Usuário',
                photoURL: user.photoURL || '',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
            console.log('Dados do usuário salvos no Firestore');
        } else {
            // Atualizar último login
            await setDoc(userRef, {
                lastLogin: new Date().toISOString()
            }, { merge: true });
        }
    } catch (error) {
        console.error('Erro ao salvar dados do usuário:', error);
    }
}

// ===================================
// LOGIN COM EMAIL E SENHA
// ===================================
async function loginWithEmail(email, password) {
    try {
        showMessage('Autenticando...', 'loading');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Login bem-sucedido:', user);
        
        // Salvar/atualizar dados do usuário
        await saveUserData(user);

        showMessage('Login realizado com sucesso! Redirecionando...', 'success');

        // Redirecionar após 2 segundos
        setTimeout(() => {
            // window.location.href = 'dashboard.html';
            alert(`Bem-vindo, ${user.email}!`);
        }, 2000);

    } catch (error) {
        console.error('Erro no login:', error);
        handleAuthError(error);
    }
}

// ===================================
// LOGIN COM GOOGLE
// ===================================
async function loginWithGoogle() {
    try {
        showMessage('Abrindo login do Google...', 'loading');
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        console.log('Login com Google bem-sucedido:', user);
        
        // Salvar dados do usuário no Firestore
        await saveUserData(user);

        showMessage('Login realizado com sucesso!', 'success');

        setTimeout(() => {
            // window.location.href = 'dashboard.html';
            alert(`Bem-vindo, ${user.displayName}!`);
        }, 2000);

    } catch (error) {
        console.error('Erro no login com Google:', error);
        handleAuthError(error);
    }
}

// ===================================
// REGISTRO DE NOVO USUÁRIO
// ===================================
async function registerUser(email, password) {
    try {
        showMessage('Criando conta...', 'loading');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Conta criada com sucesso:', user);
        
        // Salvar dados do usuário
        await saveUserData(user);

        showMessage('Conta criada com sucesso!', 'success');

        setTimeout(() => {
            // window.location.href = 'dashboard.html';
            alert(`Conta criada! Bem-vindo, ${user.email}!`);
        }, 2000);

    } catch (error) {
        console.error('Erro ao criar conta:', error);
        handleAuthError(error);
    }
}

// ===================================
// RECUPERAR SENHA
// ===================================
async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        showMessage('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        handleAuthError(error);
    }
}

// ===================================
// TRATAMENTO DE ERROS
// ===================================
function handleAuthError(error) {
    let errorMessage = 'Erro ao processar sua solicitação.';

    switch (error.code) {
        case 'auth/user-not-found':
            errorMessage = 'Usuário não encontrado.';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Senha incorreta.';
            break;
        case 'auth/email-already-in-use':
            errorMessage = 'Este email já está em uso.';
            break;
        case 'auth/weak-password':
            errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Email inválido.';
            break;
        case 'auth/popup-closed-by-user':
            errorMessage = 'Login cancelado.';
            break;
        case 'auth/network-request-failed':
            errorMessage = 'Erro de conexão. Verifique sua internet.';
            break;
        default:
            errorMessage = error.message;
    }

    showMessage(errorMessage, 'error');
}

// ===================================
// EVENTOS
// ===================================

// Login com formulário
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }

    await loginWithEmail(email, password);
});

// Login com Google
googleLoginBtn.addEventListener('click', async () => {
    hideMessage();
    await loginWithGoogle();
});

// Botão de registro
registerBtn.addEventListener('click', async () => {
    hideMessage();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage('Por favor, preencha email e senha para criar uma conta.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }

    await registerUser(email, password);
});

// Esqueceu a senha
forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    hideMessage();

    const email = emailInput.value.trim();

    if (!email) {
        showMessage('Por favor, digite seu email para recuperar a senha.', 'error');
        return;
    }

    await resetPassword(email);
});

// ===================================
// VERIFICAR ESTADO DE AUTENTICAÇÃO
// ===================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('Usuário já está logado:', user);
        showMessage(`Olá, ${user.displayName || user.email}!`, 'success');
        
        // Opcional: redirecionar automaticamente
        // window.location.href = 'dashboard.html';
    } else {
        console.log('Usuário não está logado');
    }
});

// ===================================
// FUNÇÃO DE LOGOUT
// ===================================
async function logout() {
    try {
        await signOut(auth);
        console.log('Logout realizado com sucesso');
        showMessage('Você saiu da sua conta.', 'success');
        emailInput.value = '';
        passwordInput.value = '';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Expor função de logout globalmente
window.logoutUser = logout;
