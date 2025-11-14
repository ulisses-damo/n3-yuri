# 🔐 Tela de Login com Firebase Authentication

Sistema de autenticação completo usando HTML, CSS, Firebase Authentication e Firestore para armazenamento de dados de usuários.

## 📋 Arquivos do Projeto

- `index.html` - Estrutura da página de login
- `style.css` - Estilos e design da interface
- `login.js` - Lógica de autenticação com Firebase

---

## 🚀 Passo a Passo para Configurar o Firebase

### **1. Criar um Projeto no Firebase**

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** (ou "Add project")
3. Digite um nome para o projeto (ex: `MeuAppLogin`)
4. (Opcional) Desabilite o Google Analytics se não for usar
5. Clique em **"Criar projeto"** e aguarde a conclusão

### **2. Configurar Firebase Authentication**

1. No menu lateral, clique em **"Authentication"** (Autenticação)
2. Clique em **"Get started"** (Começar)
3. Na aba **"Sign-in method"** (Método de login), habilite:

   **a) Email/Password:**
   - Clique em **"Email/Password"**
   - Ative o primeiro toggle (**Email/Password**)
   - Clique em **"Save"** (Salvar)

   **b) Google:**
   - Clique em **"Google"**
   - Ative o toggle
   - Configure um email de suporte do projeto
   - Clique em **"Save"** (Salvar)

### **3. Configurar Firestore Database**

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Create database"** (Criar banco de dados)
3. Selecione o modo:
   - **Teste mode** (para desenvolvimento) - Dados abertos por 30 dias
   - **Production mode** (para produção) - Requer regras de segurança
4. Escolha uma localização (ex: `southamerica-east1` para São Paulo)
5. Clique em **"Enable"** (Ativar)

### **4. Obter as Credenciais do Firebase**

1. No Firebase Console, clique no ícone de **engrenagem** ⚙️ ao lado de "Visão geral do projeto"
2. Selecione **"Configurações do projeto"** (Project settings)
3. Role até a seção **"Seus aplicativos"**
4. Clique no ícone **</>** (Web)
5. Registre o app:
   - **App nickname**: `MeuAppWeb` (ou qualquer nome)
   - **Marque** a opção "Firebase Hosting" (opcional)
   - Clique em **"Registrar app"**
6. Copie o objeto `firebaseConfig` que aparece:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

### **5. Configurar o Código**

Abra o arquivo `login.js` e substitua as credenciais na linha 20:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

Cole as suas credenciais copiadas do Firebase Console.

### **6. Configurar Regras de Segurança do Firestore**

No Firebase Console:

1. Vá em **"Firestore Database"**
2. Clique na aba **"Rules"** (Regras)
3. Substitua pelas regras abaixo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que usuários autenticados leiam/escrevam seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Clique em **"Publish"** (Publicar)

### **7. Configurar Domínios Autorizados (Opcional)**

Para produção, você precisa autorizar seus domínios:

1. Em **Authentication** → **Settings** → **Authorized domains**
2. Adicione seus domínios (ex: `seusite.com`)
3. `localhost` já está autorizado por padrão

---

## 💻 Como Executar o Projeto

### **Opção 1: Servidor Local com Python**

```bash
# Python 3
python -m http.server 8000
```

Acesse: `http://localhost:8000`

### **Opção 2: Servidor Local com Node.js**

```bash
# Instalar http-server globalmente
npm install -g http-server

# Executar
http-server
```

### **Opção 3: VS Code Live Server**

1. Instale a extensão **"Live Server"**
2. Clique com botão direito no `index.html`
3. Selecione **"Open with Live Server"**

---

## 🧪 Testando a Aplicação

### **1. Criar um Usuário com Email/Senha**

1. Abra a aplicação no navegador
2. Digite um email e senha (mínimo 6 caracteres)
3. Clique em **"Criar uma conta"**
4. O usuário será criado e salvo no Firestore

### **2. Login com Email/Senha**

1. Digite o email e senha do usuário criado
2. Clique em **"Entrar"**
3. Você verá a mensagem de sucesso

### **3. Login com Google**

1. Clique no botão **"Continuar com Google"**
2. Selecione sua conta Google
3. Autorize o acesso
4. O login será realizado e os dados salvos no Firestore

### **4. Recuperar Senha**

1. Digite seu email no campo de email
2. Clique em **"Esqueceu a senha?"**
3. Um email será enviado com link de recuperação

---

## � Verificar Dados no Firebase

### **Verificar Usuários Cadastrados**

1. No Firebase Console, vá em **"Authentication"**
2. Na aba **"Users"**, você verá todos os usuários cadastrados
3. Informações: UID, email, provedor (Password/Google), data de criação

### **Verificar Dados no Firestore**

1. No Firebase Console, vá em **"Firestore Database"**
2. Você verá a coleção **"users"**
3. Cada documento tem:
   - `uid`: ID único do usuário
   - `email`: Email do usuário
   - `displayName`: Nome (vazio para email/senha, preenchido no Google)
   - `photoURL`: Foto do perfil (Google)
   - `createdAt`: Data de criação
   - `lastLogin`: Último login

---

## 🔧 Funcionalidades Implementadas

✅ **Login com Email e Senha**
- Autenticação segura com Firebase Auth
- Validação de campos

✅ **Login com Google**
- Autenticação OAuth2
- Login com um clique
- Dados do perfil importados automaticamente

✅ **Registro de Novos Usuários**
- Criação de conta com email/senha
- Validação de senha (mínimo 6 caracteres)

✅ **Recuperação de Senha**
- Email de reset enviado automaticamente
- Link seguro de redefinição

✅ **Armazenamento no Firestore**
- Dados do usuário salvos automaticamente
- Rastreamento de último login
- Estrutura organizada por UID

✅ **Verificação de Sessão**
- Detecta se usuário já está logado
- Mantém sessão ativa

✅ **Logout**
- Função `window.logoutUser()` disponível globalmente

---

## 🔍 Console do Navegador

Abra o DevTools (F12) para ver:

- Logs de autenticação
- Dados do usuário logado
- Erros (se houver)

Exemplo de log após login bem-sucedido:
```javascript
Login bem-sucedido: {
  uid: "abc123...",
  email: "usuario@email.com",
  displayName: "Nome do Usuário",
  photoURL: "https://..."
}
```

---

## 📝 Mensagens de Erro Tratadas

| Código do Erro | Mensagem |
|----------------|----------|
| `auth/user-not-found` | Usuário não encontrado |
| `auth/wrong-password` | Senha incorreta |
| `auth/email-already-in-use` | Este email já está em uso |
| `auth/weak-password` | A senha deve ter pelo menos 6 caracteres |
| `auth/invalid-email` | Email inválido |
| `auth/popup-closed-by-user` | Login cancelado |
| `auth/network-request-failed` | Erro de conexão |

---

## 🎨 Personalizações

### **Alterar Cores do Tema**

Edite `style.css`, linha 7:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### **Mudar Provedor de Login Social**

No `login.js`, você pode adicionar outros provedores:

```javascript
import { FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';

const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
```

### **Adicionar Mais Campos no Firestore**

Edite a função `saveUserData()` no `login.js`:

```javascript
await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'Usuário',
    photoURL: user.photoURL || '',
    // Adicione mais campos:
    idade: null,
    telefone: null,
    cidade: null,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
});
```

---

## 🔒 Segurança para Produção

⚠️ **Importante:**

1. **Regras do Firestore:**
   - Configure regras de segurança adequadas
   - Não deixe o banco em modo de teste em produção

2. **API Keys:**
   - As chaves do Firebase podem ser públicas no frontend
   - A segurança é garantida pelas regras do Firestore e Auth

3. **HTTPS:**
   - Use sempre HTTPS em produção
   - Firebase exige HTTPS para autenticação

4. **Domínios Autorizados:**
   - Configure apenas domínios confiáveis
   - Remova domínios de teste/desenvolvimento

5. **Rate Limiting:**
   - Configure limites de requisições no Firebase Console
   - Previne abuso e ataques

---

## 🌐 Deploy (Hospedagem)

### **Opção 1: Firebase Hosting (Recomendado)**

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto
firebase init hosting

# Deploy
firebase deploy
```

### **Opção 2: Outras Plataformas**

- **Vercel**: Arraste a pasta do projeto
- **Netlify**: Deploy via Git ou drag & drop
- **GitHub Pages**: Comite e ative nas configurações do repo

---

## 📚 Recursos Adicionais

- [Documentação Firebase Authentication](https://firebase.google.com/docs/auth)
- [Documentação Firestore](https://firebase.google.com/docs/firestore)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Regras de Segurança do Firestore](https://firebase.google.com/docs/firestore/security/get-started)

---

## ❓ Problemas Comuns

**Problema:** Login com Google não funciona
- **Solução:** Verifique se habilitou o provedor Google no Firebase Console

**Problema:** CORS Error
- **Solução:** Use um servidor local (não abra o HTML diretamente)

**Problema:** "Firebase not defined"
- **Solução:** Verifique se está usando `type="module"` no script

**Problema:** Dados não salvam no Firestore
- **Solução:** Verifique as regras de segurança do Firestore

---

## 🎯 Próximos Passos

- [ ] Criar página de dashboard após login
- [ ] Implementar perfil do usuário editável
- [ ] Adicionar upload de foto de perfil
- [ ] Implementar sistema de recuperação de senha personalizado
- [ ] Adicionar outros provedores (Facebook, Twitter, GitHub)
- [ ] Implementar autenticação de dois fatores (2FA)

---

**Desenvolvido com ❤️ usando Firebase**

### **1. Acessar o Console AWS**

1. Acesse [AWS Console](https://aws.amazon.com/console/)
2. Faça login com sua conta AWS
3. Na barra de pesquisa, digite **"Cognito"** e selecione o serviço

### **2. Criar um User Pool**

1. Clique em **"Create user pool"** (Criar pool de usuários)

2. **Configure sign-in experience:**
   - Em "Cognito user pool sign-in options", selecione: **Email**
   - Clique em **Next**

3. **Configure security requirements:**
   - Em "Password policy mode", escolha: **Cognito defaults** (ou customize se preferir)
   - Em "Multi-factor authentication", escolha: **No MFA** (para simplicidade)
   - Clique em **Next**

4. **Configure sign-up experience:**
   - Deixe as opções padrão ou customize conforme necessário
   - Clique em **Next**

5. **Configure message delivery:**
   - Selecione: **Send email with Cognito**
   - Clique em **Next**

6. **Integrate your app:**
   - Em "User pool name", digite: `MeuUserPool` (ou o nome que preferir)
   - Em "Initial app client", configure:
     - **App client name**: `MeuAppClient`
     - **Client secret**: Selecione **Don't generate a client secret**
     - Deixe as outras opções padrão
   - Clique em **Next**

7. **Review and create:**
   - Revise todas as configurações
   - Clique em **Create user pool**

### **3. Obter as Credenciais**

Após criar o User Pool, você verá a página de detalhes:

1. **User Pool ID:**
   - Na página principal do User Pool, copie o **User pool ID**
   - Exemplo: `us-east-1_abcd1234`

2. **Client ID:**
   - Clique na aba **App integration** (Integração do app)
   - Role até a seção **App clients and analytics**
   - Clique no seu app client (`MeuAppClient`)
   - Copie o **Client ID**
   - Exemplo: `1234567890abcdefghijklmnop`

### **4. Configurar o Código**

Abra o arquivo `login.js` e substitua as credenciais:

```javascript
const poolData = {
    UserPoolId: 'sua-region_XXXXXXXXX', // Cole seu User Pool ID aqui
    ClientId: 'seu-client-id-aqui'       // Cole seu Client ID aqui
};
```

**Exemplo:**
```javascript
const poolData = {
    UserPoolId: 'us-east-1_abcd1234',
    ClientId: '1234567890abcdefghijklmnop'
};
```

### **5. Criar um Usuário de Teste**

Para testar o login, você precisa criar um usuário:

1. No console do AWS Cognito, acesse seu User Pool
2. Clique na aba **Users** (Usuários)
3. Clique em **Create user** (Criar usuário)
4. Configure:
   - **Email**: seu@email.com
   - **Temporary password**: Senha123! (ou uma senha de sua escolha)
   - Desmarque **Send an email invitation** se não quiser enviar email
   - Marque **Mark email as verified** (Marcar email como verificado)
5. Clique em **Create user**

**Importante:** Se você definiu uma senha temporária, o AWS pode exigir que o usuário troque a senha no primeiro login.

---

## 💻 Como Executar o Projeto

### **Opção 1: Abrir Diretamente no Navegador**

1. Navegue até a pasta do projeto
2. Clique duas vezes no arquivo `index.html`
3. O arquivo abrirá no seu navegador padrão

### **Opção 2: Usar um Servidor Local (Recomendado)**

Para evitar problemas de CORS, é recomendado usar um servidor local:

#### Usando Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Usando Node.js (http-server):
```bash
# Instalar (primeira vez)
npm install -g http-server

# Executar
http-server
```

#### Usando VS Code:
- Instale a extensão **Live Server**
- Clique com o botão direito no `index.html`
- Selecione **Open with Live Server**

Depois acesse: `http://localhost:8000` (ou a porta indicada)

---

## 🧪 Testando o Login

1. Abra a página de login
2. Digite o email do usuário que você criou
3. Digite a senha
4. Clique em **Entrar**

Se tudo estiver configurado corretamente, você verá:
- Mensagem de sucesso
- Os tokens serão exibidos no console do navegador (F12)

---

## 🔍 Verificar Tokens e Sessão

Para ver os tokens gerados:

1. Pressione **F12** para abrir o DevTools
2. Vá para a aba **Console**
3. Após fazer login, você verá:
   - Access Token
   - ID Token
   - Refresh Token

Você também pode verificar os tokens armazenados:

```javascript
// No console do navegador:
console.log(sessionStorage.getItem('accessToken'));
console.log(sessionStorage.getItem('idToken'));
```

---

## 📝 Mensagens de Erro Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `User does not exist` | Usuário não cadastrado | Crie o usuário no Cognito |
| `Incorrect username or password` | Credenciais inválidas | Verifique email e senha |
| `User is not confirmed` | Email não verificado | Marque como verificado no console |
| `NetworkError` | Credenciais incorretas no código | Verifique UserPoolId e ClientId |

---

## 🎨 Customizações

### Alterar Cores
Edite o arquivo `style.css`, linha 7-8:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adicionar Mais Campos
Edite `index.html` e adicione novos inputs no formulário.

### Implementar Registro de Usuários
Adicione a lógica de registro usando:
```javascript
userPool.signUp(email, password, attributeList, null, callback);
```

---

## 🔒 Segurança

⚠️ **Importante para Produção:**

- Nunca exponha suas credenciais AWS diretamente no código frontend
- Use variáveis de ambiente
- Implemente HTTPS
- Configure CORS adequadamente no AWS Cognito
- Habilite MFA (autenticação de dois fatores)
- Implemente rate limiting para prevenir ataques de força bruta

---

## 📚 Recursos Adicionais

- [Documentação AWS Cognito](https://docs.aws.amazon.com/cognito/)
- [SDK JavaScript AWS Cognito](https://github.com/aws-amplify/amplify-js)
- [Exemplos AWS Cognito](https://github.com/aws-samples/amazon-cognito-identity-js)

---

## ❓ Problemas Comuns

**Problema:** CORS Error
- **Solução:** Use um servidor local (http-server, Live Server, etc.)

**Problema:** "Unexpected token" no console
- **Solução:** Verifique se o SDK do Cognito foi carregado corretamente

**Problema:** Login não funciona
- **Solução:** Verifique as credenciais (UserPoolId e ClientId) no `login.js`

---

## 📄 Licença

Este projeto é livre para uso educacional e pessoal.

---

**Desenvolvido com ❤️ para aprendizado de AWS Cognito**
