// firebase-init.js

// Importar todas as funções que você vai usar
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js"; // Para os vídeos

// Configuração (Mantenha as suas credenciais reais aqui)
const firebaseConfig = {
    apiKey: "AIzaSyCK91P43nXGZjLoGh_jtK3F7xBoX-zLpvc",
  authDomain: "site-franciosi-1dcd3.firebaseapp.com",
  projectId: "site-franciosi-1dcd3",
  storageBucket: "site-franciosi-1dcd3.firebasestorage.app",
  messagingSenderId: "538592100141",
  appId: "1:538592100141:web:a354aeffbb0ebe5f795da4",
};

// Inicializar a App
const app = initializeApp(firebaseConfig);

// Inicializar e exportar os serviços (CRUCIAL!)
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const storage = getStorage(app);