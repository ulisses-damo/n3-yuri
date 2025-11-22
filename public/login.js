import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    doc, 
    setDoc, 
    getDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const googleProvider = new GoogleAuthProvider();

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const registerBtn = document.getElementById('registerBtn');
const forgotPasswordLink = document.getElementById('forgotPassword');

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

function hideMessage() {
    messageDiv.style.display = 'none';
    messageDiv.className = 'message';
}

async function saveUserData(user) {
    try {
        const userRef = doc(db, 'usuarios', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Usuário',
                photoURL: user.photoURL || '',
            });
            console.log('Dados do usuário salvos no Firestore');
        } else {
            await setDoc(userRef, {
                lastLogin: new Date().toISOString()
            }, { merge: true });
        }
    } catch (error) {
        console.error('Erro ao salvar dados do usuário:', error);
    }
}

async function loginWithEmail(email, password) {
    try {
        isLoggingIn = true;
        showMessage('Autenticando...', 'loading');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Login bem-sucedido:', user);
        
        await saveUserData(user);

        showMessage('Login realizado com sucesso! Redirecionando...', 'success');
        
        window.location.replace('dashboard.html');

    } catch (error) {
        isLoggingIn = false;
        console.error('Erro no login:', error);
        handleAuthError(error);
    }
}

async function loginWithGoogle() {
    try {
        isLoggingIn = true;
        showMessage('Abrindo login do Google...', 'loading');
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        console.log('Login com Google bem-sucedido:', user);
        
        await saveUserData(user);

        showMessage('Login realizado com sucesso!', 'success');
        
        window.location.replace('dashboard.html');

    } catch (error) {
        isLoggingIn = false;
        console.error('Erro no login com Google:', error);
        handleAuthError(error);
    }
}

async function registerUser(email, password) {
    try {
        isLoggingIn = true;
        showMessage('Criando conta...', 'loading');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Conta criada com sucesso:', user);
        
        await saveUserData(user);

        showMessage('Conta criada com sucesso!', 'success');
        
        window.location.replace('dashboard.html');

    } catch (error) {
        isLoggingIn = false;
        console.error('Erro ao criar conta:', error);
        handleAuthError(error);
    }
}

async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        showMessage('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        handleAuthError(error);
    }
}

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

googleLoginBtn.addEventListener('click', async () => {
    hideMessage();
    await loginWithGoogle();
});

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

let isLoggingIn = false;

onAuthStateChanged(auth, (user) => {
    if (isLoggingIn) {
        console.log('Processo de login ativo, aguardando conclusão');
        return;
    }
    
    const currentPage = window.location.pathname;
    const isOnLoginPage = currentPage.endsWith('index.html') || currentPage === '/' || currentPage.endsWith('/');
    
    if (user && isOnLoginPage) {
        console.log('Usuário já está logado, redirecionando para dashboard');
        window.location.replace('dashboard.html');
    } else if (user) {
        console.log('Usuário logado:', user.email);
    } else {
        console.log('Usuário não está logado');
    }
});

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

window.logoutUser = logout;
