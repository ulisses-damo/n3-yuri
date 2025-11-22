import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const auth = getAuth();

const userName = document.getElementById('userName');
const userPhoto = document.getElementById('userPhoto');
const welcomeMessage = document.getElementById('welcomeMessage');
const logoutBtn = document.getElementById('logoutBtn');

let checkingAuth = true;
let authCheckComplete = false;

onAuthStateChanged(auth, (user) => {
    checkingAuth = false;
    
    if (authCheckComplete) return;
    authCheckComplete = true;
    
    if (user) {
        userName.textContent = user.displayName || 'Usuário';
        
        if (user.photoURL) {
            userPhoto.src = user.photoURL;
            userPhoto.style.display = 'block';
        } else {
            userPhoto.style.display = 'none';
        }

        welcomeMessage.textContent = `Olá ${user.displayName || user.email}! Você está autenticado com sucesso.`;
        
        document.body.style.visibility = 'visible';
    } else {
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    }
});

setTimeout(() => {
    if (checkingAuth) {
        window.location.href = 'index.html';
    }
}, 3000);

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao fazer logout. Tente novamente.');
    }
});
