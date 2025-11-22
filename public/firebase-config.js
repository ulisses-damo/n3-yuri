import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDU7oOSmOrmjJezyfXcieVU-qWLGozurT0",
    authDomain: "n3-yuri-ulissesdamo-4d3ae.firebaseapp.com",
    projectId: "n3-yuri-ulissesdamo-4d3ae",
    storageBucket: "n3-yuri-ulissesdamo-4d3ae.firebasestorage.app",
    messagingSenderId: "442899283360",
    appId: "1:442899283360:web:01a284f1c18e1b9a68b8c5",
    measurementId: "G-GSC4TK2NLQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
