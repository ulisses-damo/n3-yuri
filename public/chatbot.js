import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { GEMINI_API_KEY, GEMINI_CONFIG } from './config.js';

const auth = getAuth();
const db = getFirestore();

const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

let currentUser = null;
let conversationHistory = [];

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        loadChatHistory();
    }
});

chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        chatInput.focus();
    }
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    chatInput.value = '';
    chatSend.disabled = true;

    conversationHistory.push({
        role: 'user',
        parts: [{ text: message }]
    });

    const typingIndicator = showTypingIndicator();

    try {
        const response = await callGeminiAPI(message);
        typingIndicator.remove();
        addMessage(response, false);

        conversationHistory.push({
            role: 'model',
            parts: [{ text: response }]
        });

        if (currentUser) {
            await saveChatToFirestore(message, response);
        }

    } catch (error) {
        typingIndicator.remove();
        console.error('Erro ao chamar Gemini API:', error);
        addMessage('Desculpe, ocorreu um erro. Tente novamente.', false);
    } finally {
        chatSend.disabled = false;
    }
}

async function callGeminiAPI(userMessage) {
    const systemPrompt = `Você é um assistente virtual prestativo de um sistema de login e autenticação. 
    Ajude os usuários com problemas de login, recuperação de senha, criação de conta e outras questões relacionadas.
    Seja educado, claro e objetivo nas respostas. Responda em português do Brasil.`;

    const contents = [
        {
            role: 'user',
            parts: [{ text: systemPrompt }]
        },
        ...conversationHistory.slice(-10),
        {
            role: 'user',
            parts: [{ text: userMessage }]
        }
    ];

    const requestBody = {
        contents: contents,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
        }
    };

    const response = await fetch(`${GEMINI_CONFIG.apiUrl}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function saveChatToFirestore(userMessage, botResponse) {
    try {
        await addDoc(collection(db, 'chat_history'), {
            userId: currentUser.uid,
            userMessage: userMessage,
            botResponse: botResponse,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao salvar chat:', error);
    }
}

async function loadChatHistory() {
    if (!currentUser) return;

    try {
        const q = query(
            collection(db, 'chat_history'),
            where('userId', '==', currentUser.uid),
            orderBy('timestamp', 'asc')
        );

        const querySnapshot = await getDocs(q);
        const messages = chatMessages.querySelectorAll('.message:not(:first-child)');
        messages.forEach(msg => msg.remove());

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            addMessage(data.userMessage, true);
            addMessage(data.botResponse, false);
            
            conversationHistory.push(
                { role: 'user', parts: [{ text: data.userMessage }] },
                { role: 'model', parts: [{ text: data.botResponse }] }
            );
        });
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}
