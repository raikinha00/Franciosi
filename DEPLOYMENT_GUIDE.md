# ✅ Guia Completo de Deployment - Stripe Stripe Metodo Franciosi

## 🔧 Correcções Já Feitas:

✅ URLs da Cloud Function corrigidas para `site-59d0c`
✅ `stripe-config.js` atualizado
✅ `script.js` atualizado
✅ `functions/package.json` criado

---

## 📝 Próximas Etapas:

### **Passo 1: Instalar Dependências**

```bash
cd functions
npm install
```

Se tiveres erro, tenta:
```bash
npm install --legacy-peer-deps
```

---

### **Passo 2: Deploy da Cloud Function**

```bash
firebase deploy --only functions
```

Ou se precisa fazer login:
```bash
firebase login
firebase deploy --only functions
```

**Aguarda até ver:** ✓ functions deployed successfully

---

### **Passo 3: Configurar Webhook no Stripe**

1. Vai a **Stripe Dashboard** → **Webhooks** (lateral esquerda)
2. Clica **"+ Add endpoint"**
3. **URL:** `https://us-central1-site-59d0c.cloudfunctions.net/stripeWebhook`
4. **Eventos:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Clica **"Add endpoint"**
6. Na linha do webhook, clica **"Reveal"** para ver o **Signing secret**
7. **Copia o Signing secret** (começa com `whsec_test_...`)

---

### **Passo 4: Atualizar Webhook Secret**

**Em `functions/index.js` (linha ~98):**

```javascript
const webhookSecret = 'whsec_test_COLA_AQUI_O_SIGNING_SECRET';
```

Substitui `COLA_AQUI_O_SIGNING_SECRET` pelo Signing secret que copiaste.

---

### **Passo 5: Redeploy**

```bash
firebase deploy --only functions
```

---

## ✅ Checklist Final:

- [ ] `npm install` executado com sucesso
- [ ] `firebase deploy --only functions` executado
- [ ] Webhook adicionado no Stripe
- [ ] Signing secret atualizado em `functions/index.js`
- [ ] Redeploy feito após atualizar Webhook secret

---

## 🧪 Testar:

1. Vai a `pricing.html`
2. Clica em "Escolher Plano"
3. Faz login (se necessário)
4. Deves ser redirecionado para **Stripe Checkout**

Se funcionar, vais ver a página de pagamento do Stripe! 🎉

---

## ❌ Se tiveres Erros:

### "Function not found"
- Verifica se a Cloud Function foi deployada com sucesso
- Executa: `firebase functions:list`

### "CORS error"
- Certifica-te que o `cors` está instalado: `npm list cors`
- Se não estiver, instala: `npm install cors`
- Redeploy: `firebase deploy --only functions`

### "Cannot read property 'planPriceIds'"
- Certifica-te que `stripe-config.js` está no mesmo diretório que `script.js`
- Verifica se tem `export const STRIPE_CONFIG`

---

## 📞 Suporte:

Se precisas de ajuda:
1. Envia os logs: `firebase functions:log`
2. Verifica os erros no Stripe Dashboard
3. Consulta: https://stripe.com/docs/checkout
