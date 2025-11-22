import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const userName = document.getElementById('userName');
const userPhoto = document.getElementById('userPhoto');
const welcomeMessage = document.getElementById('welcomeMessage');
const logoutBtn = document.getElementById('logoutBtn');

let authResolved = false;
const AUTH_TIMEOUT = 5000;

document.body.style.visibility = 'hidden';

onAuthStateChanged(auth, (user) => {
    authResolved = true;
    
    const currentPage = window.location.pathname;
    const isOnDashboard = currentPage.includes('dashboard.html');
    
    if (user && isOnDashboard) {
        console.log('Usuário autenticado na dashboard:', user.email);
        
        const displayName = user.displayName || user.email.split('@')[0];
        userName.textContent = displayName;
        
        if (user.photoURL) {
            userPhoto.src = user.photoURL;
            userPhoto.style.display = 'block';
        } else {
            userPhoto.style.display = 'none';
        }

        welcomeMessage.textContent = `Olá ${displayName}! Você está autenticado com sucesso.`;
        
        document.body.style.visibility = 'visible';
    } else if (!user) {
        console.log('Nenhum usuário autenticado, redirecionando para login...');
        window.location.replace('index.html');
    }
});

setTimeout(() => {
    if (!authResolved) {
        console.log('Timeout: autenticação não resolvida em ' + AUTH_TIMEOUT + 'ms');
        window.location.replace('index.html');
    }
}, AUTH_TIMEOUT);

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            console.log('Fazendo logout...');
            await signOut(auth);
            window.location.replace('index.html');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout. Tente novamente.');
        }
    });
}
