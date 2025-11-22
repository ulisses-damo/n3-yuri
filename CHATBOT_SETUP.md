# 🤖 Configuração do Chatbot com Gemini AI

## 📝 Como Obter a API Key do Google Gemini

### **Passo 1: Acessar o Google AI Studio**

1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google

### **Passo 2: Criar uma API Key**

1. Clique em **"Get API Key"** (Obter chave de API)
2. Clique em **"Create API key in new project"** (Criar chave de API em novo projeto)
   - OU selecione um projeto existente
3. Sua API Key será gerada automaticamente
4. **Copie a chave** (ela terá o formato: `AIzaSy...`)

### **Passo 3: Configurar no Projeto**

1. Abra o arquivo `public/config.js`
2. Substitua `'SUA_API_KEY_GEMINI_AQUI'` pela sua API Key:

```javascript
export const GEMINI_API_KEY = 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX';
```

### **Passo 4: Configurar Firestore Rules**

Adicione a coleção `chat_history` nas regras do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /chat_history/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## ✨ Funcionalidades do Chatbot

### **O que o chatbot faz:**

✅ **Assistência em Tempo Real**
- Responde perguntas sobre login
- Ajuda com recuperação de senha
- Orienta sobre criação de conta
- Suporte técnico geral

✅ **Histórico Persistente**
- Salva todas as conversas no Firestore
- Carrega histórico ao fazer login
- Mantém contexto entre sessões

✅ **Interface Moderna**
- Botão flutuante no canto da tela
- Janela de chat responsiva
- Animações suaves
- Indicador de digitação

✅ **Inteligência Artificial**
- Powered by Google Gemini
- Respostas contextualizadas
- Memória de conversação
- Linguagem natural em português

## 🎯 Como Usar

1. **Clique no botão flutuante** (ícone de chat) no canto inferior direito
2. **Digite sua pergunta** no campo de texto
3. **Pressione Enter** ou clique no botão enviar
4. **Aguarde a resposta** da IA

## 🔒 Segurança

- ⚠️ **IMPORTANTE**: Nunca exponha sua API Key em repositórios públicos
- Para produção, use variáveis de ambiente
- Configure rate limiting no Google Cloud Console
- A API Key gratuita tem limites de requisições

## 💡 Exemplos de Perguntas

- "Como faço para recuperar minha senha?"
- "Não estou conseguindo fazer login, o que fazer?"
- "Como criar uma nova conta?"
- "Esqueci meu email de cadastro"
- "O que fazer se não recebo o email de verificação?"

## 📊 Limites da API Gratuita do Gemini

- **60 requisições por minuto**
- **1.500 requisições por dia**
- Sem custo para desenvolvimento

Para aumentar os limites, consulte: https://ai.google.dev/pricing

## 🚀 Deploy

Após configurar a API Key, faça o deploy:

```bash
firebase deploy
```

## 🛠️ Troubleshooting

**Erro: "API key not valid"**
- Verifique se copiou a API Key corretamente
- Certifique-se de que a API do Gemini está ativada no Google Cloud

**Chat não abre**
- Verifique o console do navegador (F12)
- Confirme que todos os arquivos foram carregados

**Mensagens não salvam**
- Verifique as regras do Firestore
- Confirme que o usuário está autenticado

**Respostas muito lentas**
- Normal para a API gratuita em horários de pico
- Considere implementar cache de respostas comuns

## 📚 Recursos Adicionais

- [Documentação Gemini API](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

---

**Desenvolvido com 🤖 Google Gemini AI**
