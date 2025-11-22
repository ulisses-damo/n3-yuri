import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const auth = getAuth();

const userName = document.getElementById('userName');
const userPhoto = document.getElementById('userPhoto');
const welcomeMessage = document.getElementById('welcomeMessage');
const logoutBtn = document.getElementById('logoutBtn');

let authResolved = false;

onAuthStateChanged(auth, (user) => {
    authResolved = true;
    
    if (user) {
        console.log('Usuário autenticado:', user);
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
        console.log('Usuário não autenticado, redirecionando...');
        window.location.href = 'index.html';
    }
});

setTimeout(() => {
    if (!authResolved) {
        console.log('Timeout: autenticação não resolvida');
        window.location.href = 'index.html';
    }
}, 5000);

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao fazer logout. Tente novamente.');
    }
});
