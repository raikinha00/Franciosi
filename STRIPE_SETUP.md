# Guia de Implementação Stripe - Metodo Franciosi

## ✅ O que foi implementado:

1. **stripe-config.js** - Arquivo com configurações do Stripe
2. **script.js** - Atualizado com integração Stripe
3. **pricing.html** - Adicionado Stripe.js
4. **functions/index.js** - Cloud Functions para checkout e webhook

---

## 🔧 Próximas Ações:

### 1. **Atualizar URLs nos arquivos**

**Em `stripe-config.js`:**
```javascript
checkoutSessionUrl: 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/createCheckoutSession'
```
Substitui `YOUR_PROJECT_ID` pelo ID do teu projeto Firebase.

**Em `script.js` (função selectPlan):**
```javascript
const response = await fetch('https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/createCheckoutSession', {
```
Substitui `YOUR_PROJECT_ID` pelo ID do teu projeto Firebase.

---

### 2. **Obter Webhook Secret do Stripe**

1. Vai a **Stripe Dashboard** → **Webhooks** (Lateral esquerda)
2. Clica **"+ Add endpoint"** (ou "Adicionar endpoint")
3. **URL do endpoint:** `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/stripeWebhook`
4. **Eventos a ouvir:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Clica **"Add endpoint"**
6. Copia o **Signing secret** (começa com `whsec_test_...`)

---

### 3. **Atualizar Webhook Secret**

**Em `functions/index.js`:**
```javascript
const webhookSecret = 'whsec_test_COLA_AQUI_O_SIGNING_SECRET';
```

---

### 4. **Atualizar URLs de Retorno**

**Em `functions/index.js`:**
```javascript
success_url: `https://seudominio.com/profile.html?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `https://seudominio.com/pricing.html`,
```

Substitui `seudominio.com` pelo teu domínio real.

---

### 5. **Deploy das Cloud Functions**

```bash
cd functions
npm install
firebase deploy --only functions
```

---

### 6. **Atualizar Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Permitir leitura pública dos planos
    match /plans/{document=**} {
      allow read: if true;
    }
    
    // Utilizadores podem ler/escrever os seus dados
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 📋 Resumo do Fluxo:

1. ✅ Utilizador clica em "Escolher Plano"
2. ✅ Se não autenticado → vai para login
3. ✅ Se autenticado → chama Cloud Function
4. ✅ Cloud Function cria Stripe Checkout Session
5. ✅ Utilizador é redirecionado para Stripe Checkout
6. ✅ Após pagamento bem-sucedido → Webhook atualiza Firestore
7. ✅ Utilizador volta para profile.html com subscrição ativa

---

## 🔐 Informações Importantes:

- **Nunca** compartilhes a Secret Key publicamente
- A Secret Key deve estar apenas no backend (Cloud Functions)
- A Publishable Key pode estar no frontend
- Em produção, muda para `pk_live_...` e `sk_live_...`

---

## ❓ Se tiveres dúvidas:

Contacta o suporte ou consulta a documentação oficial:
- https://stripe.com/docs/checkout
- https://firebase.google.com/docs/functions
