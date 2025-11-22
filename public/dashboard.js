import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const auth = getAuth();
const db = getFirestore();

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userId = document.getElementById('userId');
const userPhoto = document.getElementById('userPhoto');
const welcomeMessage = document.getElementById('welcomeMessage');
const lastLogin = document.getElementById('lastLogin');
const logoutBtn = document.getElementById('logoutBtn');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        userName.textContent = user.displayName || 'Usuário';
        userEmail.textContent = user.email;
        userId.textContent = user.uid;
        
        if (user.photoURL) {
            userPhoto.src = user.photoURL;
            userPhoto.style.display = 'block';
        } else {
            userPhoto.style.display = 'none';
        }

        welcomeMessage.textContent = `Olá ${user.displayName || user.email}! Você está autenticado com sucesso.`;

        try {
            const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.lastLogin) {
                    const date = new Date(userData.lastLogin);
                    lastLogin.textContent = date.toLocaleString('pt-BR');
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        }
    } else {
        window.location.href = 'index.html';
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao fazer logout. Tente novamente.');
    }
});
