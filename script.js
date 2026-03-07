
// Smooth scrolling para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Função para alternar visibilidade de password
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Adicionar event listeners aos botões de toggle de password
document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const inputId = this.parentElement.querySelector('input').id;
            togglePassword(inputId);
        });
    });
    
    // Verificar se o utilizador está autenticado
    checkAuthStatus();
    
    // Inicializar calendário se estiver na página do professor
    if (document.getElementById('calendarWidget')) {
        initializeCalendar();
    }
    
    // Toggle do menu de perfil
    const profileButton = document.querySelector('.profile-button');
    const profileMenu = document.querySelector('.profile-menu');
    
    if (profileButton) {
        profileButton.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.classList.toggle('active');
        });
    }
    
    // Fechar menu quando clicar fora
    document.addEventListener('click', function(e) {
        const menus = ['profileMenu', 'profileMenu2', 'profileMenu3', 'profileMenu4'];
        menus.forEach(menuId => {
            const menu = document.getElementById(menuId);
            if (menu && !menu.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    const logoutBtn2 = document.getElementById('logoutBtn2');
    if (logoutBtn2) {
        logoutBtn2.addEventListener('click', handleLogout);
    }
    
    const logoutBtn3 = document.getElementById('logoutBtn3');
    if (logoutBtn3) {
        logoutBtn3.addEventListener('click', handleLogout);
    }
    
    const logoutBtn4 = document.getElementById('logoutBtn4');
    if (logoutBtn4) {
        logoutBtn4.addEventListener('click', handleLogout);
    }
    
    const logoutBtn6 = document.getElementById('logoutBtn6');
    if (logoutBtn6) {
        logoutBtn6.addEventListener('click', handleLogout);
    }
    
    const logoutBtn7 = document.getElementById('logoutBtn7');
    if (logoutBtn7) {
        logoutBtn7.addEventListener('click', handleLogout);
    }
    
    // Setup modal de recuperação de password
    setupForgotPasswordModal();
    
    // Setup botões de Google
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleGoogleLogin();
        });
    }
    
    const googleRegisterBtn = document.getElementById('googleRegisterBtn');
    if (googleRegisterBtn) {
        googleRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleGoogleLogin();
        });
    }
});

/**
 * Função para verificar o estado de autenticação do utilizador
 */
function checkAuthStatus() {
    onAuthStateChanged(auth, async (user) => {
        currentUser = user; // Atualizar variável global
        const authLink = document.getElementById('authLink');
        
        // Todos os profile menus
        const profileMenus = [
            { menu: 'profileMenu', email: 'userEmail', avatar: 'profileAvatar' },
            { menu: 'profileMenu2', email: 'userEmail2', avatar: 'profileAvatar2' },
            { menu: 'profileMenu3', email: 'userEmail3', avatar: 'profileAvatar3' },
            { menu: 'profileMenu4', email: 'userEmail4', avatar: 'profileAvatar4' },
            { menu: 'profileMenu5', email: 'userEmail5', avatar: 'profileAvatar5' },
            { menu: 'profileMenu6', email: 'userEmail6', avatar: 'profileAvatar6' },
            { menu: 'profileMenu7', email: 'userEmail7', avatar: 'profileAvatar7' }
        ];
        
        // Botões de role para cada página
        const roleButtons = [
            { aluno: 'alunoBtn', professor: 'professorBtn', admin: 'adminBtn' },
            { aluno: 'alunoBtn2', professor: 'professorBtn2', admin: 'adminBtn2' },
            { aluno: 'alunoBtn3', professor: 'professorBtn3', admin: 'adminBtn3' },
            { aluno: 'alunoBtn4', professor: 'professorBtn4', admin: 'adminBtn4' },
            { aluno: 'alunoBtn5', professor: 'professorBtn5', admin: 'adminBtn5' },
            { aluno: 'alunoBtn6', professor: 'professorBtn6', admin: 'adminBtn6' },
            { aluno: 'alunoBtn7', professor: 'professorBtn7', admin: 'adminBtn7' }
        ];
        
        if (user) {
            // Utilizador está logado - buscar o nome e role do Firestore
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userName = userData.nome || user.email;
                    const userAvatar = userData.avatar;
                    const userRole = (userData.role || 'aluno').toLowerCase();
                    const hasSubscription = userData.subscriptionPlan ? true : false;
                    
                    // Armazenar subscrição do utilizador
                    currentUserSubscription = userData.subscriptionPlan || null;
                    
                    // Atualizar classes do utilizador (se professor)
                    if (userRole === 'professor' && userData.classes) {
                        currentUserClasses = userData.classes || [];
                    } else {
                        currentUserClasses = [];
                    }
                    
                    // Carregar videochamadas se for professor
                    if (userRole === 'professor') {
                        loadVideoCalls();
                        loadPendingReplies();
                    }
                    
                    // Carregar contador de vídeos para alunos
                    if (userRole === 'aluno' && userData.subscriptionPlan) {
                        countAvailableVideos(userData.subscriptionPlan);
                    }
                    
                    // Carregar contador de videochamadas para alunos
                    if (userRole === 'aluno') {
                        countScheduledCalls();
                    }
                    // Nota: Alunos carregarão videochamadas apenas na página my-classes
                    
                    if (authLink) authLink.style.display = 'none';
                    
                    // Atualizar todos os profile menus
                    profileMenus.forEach(({ menu, email, avatar }) => {
                        const profileMenu = document.getElementById(menu);
                        const userEmailEl = document.getElementById(email);
                        const profileAvatarEl = document.getElementById(avatar);
                        
                        if (profileMenu) {
                            profileMenu.style.display = 'flex';
                            if (userEmailEl) userEmailEl.textContent = userName;
                            if (profileAvatarEl && userAvatar) profileAvatarEl.src = userAvatar;
                        }
                    });
                    
                    // Mostrar apenas o botão da role do utilizador
                    roleButtons.forEach((buttons) => {
                        const alunoBtn = document.getElementById(buttons.aluno);
                        const professorBtn = document.getElementById(buttons.professor);
                        const adminBtn = document.getElementById(buttons.admin);
                        
                        if (alunoBtn) {
                            // Alunos só veem "Minhas Aulas" se têm subscrição
                            if (userRole === 'aluno' && hasSubscription) {
                                alunoBtn.classList.add('show');
                            } else {
                                alunoBtn.classList.remove('show');
                            }
                        }
                        if (professorBtn) {
                            if (userRole === 'professor') {
                                professorBtn.classList.add('show');
                            } else {
                                professorBtn.classList.remove('show');
                            }
                        }
                        if (adminBtn) {
                            if (userRole === 'admin') {
                                adminBtn.classList.add('show');
                            } else {
                                adminBtn.classList.remove('show');
                            }
                        }
                    });
                } else {
                    // Fallback para email se não encontrar documento
                    if (authLink) authLink.style.display = 'none';
                    
                    profileMenus.forEach(({ menu, email }) => {
                        const profileMenu = document.getElementById(menu);
                        const userEmailEl = document.getElementById(email);
                        
                        if (profileMenu) {
                            profileMenu.style.display = 'flex';
                            if (userEmailEl) userEmailEl.textContent = user.email;
                        }
                    });
                    
                    // Esconder todos os botões de role
                    roleButtons.forEach((buttons) => {
                        const alunoBtn = document.getElementById(buttons.aluno);
                        const professorBtn = document.getElementById(buttons.professor);
                        const adminBtn = document.getElementById(buttons.admin);
                        
                        if (alunoBtn) alunoBtn.classList.remove('show');
                        if (professorBtn) professorBtn.classList.remove('show');
                        if (adminBtn) adminBtn.classList.remove('show');
                    });
                }
            } catch (error) {
                console.error("Erro ao buscar dados do utilizador:", error);
                // Fallback para email se houver erro
                if (authLink) authLink.style.display = 'none';
                
                profileMenus.forEach(({ menu, email }) => {
                    const profileMenu = document.getElementById(menu);
                    const userEmailEl = document.getElementById(email);
                    
                    if (profileMenu) {
                        profileMenu.style.display = 'flex';
                        if (userEmailEl) userEmailEl.textContent = user.email;
                    }
                });
                
                // Esconder todos os botões de role
                roleButtons.forEach((buttons) => {
                    const alunoBtn = document.getElementById(buttons.aluno);
                    const professorBtn = document.getElementById(buttons.professor);
                    const adminBtn = document.getElementById(buttons.admin);
                    
                    if (alunoBtn) alunoBtn.classList.remove('show');
                    if (professorBtn) professorBtn.classList.remove('show');
                    if (adminBtn) adminBtn.classList.remove('show');
                });
            }
        } else {
            // Utilizador não está logado
            currentUser = null;
            currentUserClasses = [];
            if (authLink) authLink.style.display = 'block';
            
            profileMenus.forEach(({ menu }) => {
                const profileMenu = document.getElementById(menu);
                if (profileMenu) profileMenu.style.display = 'none';
            });
            
            // Esconder todos os botões de role
            roleButtons.forEach((buttons) => {
                const alunoBtn = document.getElementById(buttons.aluno);
                const professorBtn = document.getElementById(buttons.professor);
                const adminBtn = document.getElementById(buttons.admin);
                
                if (alunoBtn) alunoBtn.classList.remove('show');
                if (professorBtn) professorBtn.classList.remove('show');
                if (adminBtn) adminBtn.classList.remove('show');
            });
        }
    });
}

/**
 * Função para fazer logout do utilizador
 */
async function handleLogout() {
    try {
        await signOut(auth);
        showToast('✓ Logout realizado com sucesso!', 'success');
        
        // Redirecionar para a página inicial após 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        showToast('Erro ao fazer logout: ' + error.message, 'error');
    }
}

/**
 * Abrir modal de recuperação de password
 */
function openForgotPasswordModal(event) {
    if (event) {
        event.preventDefault();
    }
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('forgotError').style.display = 'none';
        document.getElementById('forgotSuccess').style.display = 'none';
        document.getElementById('forgotEmail').value = '';
    }
}

/**
 * Fechar modal de recuperação de password
 */
function closeForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Enviar email de recuperação de password
 */
async function sendPasswordReset(event) {
    event.preventDefault();

    const email = document.getElementById('forgotEmail').value.trim();
    const errorDiv = document.getElementById('forgotError');
    const successDiv = document.getElementById('forgotSuccess');

    if (!email) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = '❌ Por favor, insira o seu email';
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        
        // Esconder erro e mostrar sucesso
        errorDiv.style.display = 'none';
        successDiv.style.display = 'block';
        
        // Fechar modal após 3 segundos
        setTimeout(() => {
            closeForgotPasswordModal();
        }, 3000);
    } catch (error) {
        errorDiv.style.display = 'block';
        
        if (error.code === 'auth/user-not-found') {
            errorDiv.textContent = '❌ Email não encontrado na base de dados';
        } else if (error.code === 'auth/invalid-email') {
            errorDiv.textContent = '❌ Email inválido';
        } else {
            errorDiv.textContent = '❌ Erro ao enviar email: ' + error.message;
        }
        
        successDiv.style.display = 'none';
    }
}

/**
 * Setup para fechar modal ao clicar fora
 */
function setupForgotPasswordModal() {
    setTimeout(function() {
        const forgotModal = document.getElementById('forgotPasswordModal');
        if (forgotModal) {
            forgotModal.addEventListener('click', function(e) {
                if (e.target === forgotModal) {
                    closeForgotPasswordModal();
                }
            });
        }
    }, 100);
}

// Adicionar animação ao carregar a página
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        this.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Importar as funções necessárias do Firebase
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { setDoc, doc, getDoc, updateDoc, getDocs, collection, addDoc, deleteDoc, query, where, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { auth, db, storage } from "./firebase-init.js";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, signOut, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { STRIPE_CONFIG, getPriceIdForPlan } from "./stripe-config.js";
import { ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

/**
 * Função para registar um novo utilizador
 * @param {string} email - Email do utilizador
 * @param {string} password - Password do utilizador
 * @param {object} userData - Dados adicionais do utilizador (nome, etc)
 * @returns {Promise<object>} Retorna os dados do utilizador criado
 */
async function handleUserRegistration(email, password, userData = {}) {
    try {
        // Criar utilizador com email e password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Dados a guardar no Firestore
        const userDataToSave = {
            uid: user.uid,
            email: user.email,
            role: 'aluno', // Por defeito, todos os utilizadores são alunos
            createdAt: new Date().toISOString(),
            ...userData // Propagar dados adicionais como nome, telefone, etc
        };
        
        // Guardar dados do utilizador no Firestore
        await setDoc(doc(db, "users", user.uid), userDataToSave);
        
        console.log("✓ Utilizador registado com sucesso:", user.uid);
        return userDataToSave;
        
    } catch (error) {
        // Tratamento de erros específicos
        if (error.code === 'auth/email-already-in-use') {
            console.error("✗ Este email já está registado.");
            throw new Error("Este email já está registado. Por favor, utilize outro email.");
        } else if (error.code === 'auth/invalid-email') {
            console.error("✗ Email inválido.");
            throw new Error("Email inválido. Por favor, verifique o formato.");
        } else if (error.code === 'auth/weak-password') {
            console.error("✗ Password muito fraca.");
            throw new Error("A password deve ter pelo menos 6 caracteres.");
        } else if (error.code === 'auth/operation-not-allowed') {
            console.error("✗ Operação não permitida.");
            throw new Error("Registo temporariamente desativado. Tente mais tarde.");
        } else {
            console.error("✗ Erro no registo:", error.message);
            throw new Error("Erro ao registar utilizador: " + error.message);
        }
    }
}

/**
 * Função para fazer login de um utilizador
 * @param {string} email - Email do utilizador
 * @param {string} password - Password do utilizador
 * @param {boolean} rememberMe - Se deve manter a sessão persistente
 * @returns {Promise<object>} Retorna os dados do utilizador
 */
async function handleUserLogin(email, password, rememberMe = false) {
    try {
        // Definir o tipo de persistência
        if (rememberMe) {
            // Local persistence - mantém o utilizador logado mesmo depois de fechar o navegador
            await setPersistence(auth, browserLocalPersistence);
        } else {
            // Session persistence - limpa quando o navegador é fechado
            await setPersistence(auth, browserSessionPersistence);
        }
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log("✓ Login bem-sucedido:", user.uid);
        return user;
        
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            throw new Error("Email não encontrado. Por favor, registe-se.");
        } else if (error.code === 'auth/wrong-password') {
            throw new Error("Password incorreta. Tente novamente.");
        } else if (error.code === 'auth/invalid-email') {
            throw new Error("Email inválido.");
        } else if (error.code === 'auth/user-disabled') {
            throw new Error("Esta conta foi desativada.");
        } else {
            throw new Error("Erro no login: " + error.message);
        }
    }
}

/**
 * Fazer login com Google
 */
async function handleGoogleLogin() {
    try {
        const provider = new GoogleAuthProvider();
        
        // Mostrar popup de login do Google
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Verificar se é novo utilizador
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
            // Novo utilizador - criar documento
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                nome: user.displayName || user.email,
                avatar: user.photoURL || '',
                role: 'aluno',
                createdAt: new Date().toISOString()
            });
            
            console.log("✓ Novo utilizador criado com Google:", user.uid);
            showToast('✓ Conta criada com sucesso via Google!', 'success');
        } else {
            console.log("✓ Login com Google bem-sucedido:", user.uid);
            showToast('✓ Login bem-sucedido!', 'success');
        }
        
        // Redirecionar após 1.5 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
        return user;
        
    } catch (error) {
        console.error("Erro no login com Google:", error);
        
        if (error.code === 'auth/popup-closed-by-user') {
            showToast('Login cancelado. Tente novamente.', 'error');
        } else if (error.code === 'auth/popup-blocked') {
            showToast('Pop-up bloqueado. Verifique as permissões do navegador.', 'error');
        } else {
            showToast('Erro ao fazer login com Google: ' + error.message, 'error');
        }
    }
}

// Função para mostrar notificação toast
function showToast(message, type = 'success') {
    // Remover toast anterior se existir
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remover após 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Event listener para o formulário de registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impedir reload da página
        
        const fullName = document.getElementById('fullName').value.trim();
        const registerEmail = document.getElementById('registerEmail').value.trim();
        const registerPassword = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const registerErrorDiv = document.getElementById('registerError');
        
        // Limpar mensagem de erro anterior
        registerErrorDiv.textContent = '';
        
        // Validações
        if (!fullName) {
            registerErrorDiv.textContent = '✗ Por favor, insira o seu nome completo.';
            return;
        }
        
        if (!registerEmail) {
            registerErrorDiv.textContent = '✗ Por favor, insira um email válido.';
            return;
        }
        
        if (registerPassword.length < 6) {
            registerErrorDiv.textContent = '✗ A password deve ter pelo menos 6 caracteres.';
            return;
        }
        
        if (registerPassword !== confirmPassword) {
            registerErrorDiv.textContent = '✗ As passwords não coincidem.';
            return;
        }
        
        try {
            // Desabilitar botão durante o registo
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'A registar...';
            
            // Registo o utilizador
            await handleUserRegistration(registerEmail, registerPassword, {
                nome: fullName
            });
            
            // Sucesso - mostrar apenas toast
            registerErrorDiv.textContent = '';
            showToast('✓ Registo realizado com sucesso!', 'success');
            
            // Limpar formulário
            registerForm.reset();
            
            // Verificar se há um plano selecionado
            const selectedPlan = sessionStorage.getItem('selectedPlan');
            let redirectUrl = 'index.html';
            
            // Verificar parâmetro de retorno na URL
            const params = new URLSearchParams(window.location.search);
            const returnTo = params.get('returnTo');
            
            if (selectedPlan && returnTo === 'pricing') {
                try {
                    const planData = JSON.parse(selectedPlan);
                    // Redirecionar para a página de pricing e completar a compra automaticamente
                    const planId = planData.id ? `&planId=${planData.id}` : '';
                    const isFree = planData.isFree ? '&isFree=true' : '';
                    redirectUrl = `pricing.html?plan=${encodeURIComponent(planData.name)}&price=${planData.price}${planId}${isFree}`;
                    sessionStorage.removeItem('selectedPlan');
                } catch (e) {
                    console.error('Erro ao processar plano selecionado:', e);
                }
            } else if (returnTo === 'pricing') {
                redirectUrl = 'pricing.html';
            }
            
            // Redirecionar após 1 segundo
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
            
        } catch (error) {
            registerErrorDiv.textContent = '';
            showToast(error.message, 'error');
            
            // Reabilitar botão
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registar';
        }
    });
}

// Event listener para o formulário de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const loginEmail = document.getElementById('loginEmail').value.trim();
        const loginPassword = document.getElementById('loginPassword').value;
        const loginErrorDiv = document.getElementById('loginError');
        
        // Limpar mensagem de erro anterior
        loginErrorDiv.textContent = '';
        
        // Validações
        if (!loginEmail) {
            loginErrorDiv.textContent = '✗ Por favor, insira o seu email.';
            return;
        }
        
        if (!loginPassword) {
            loginErrorDiv.textContent = '✗ Por favor, insira a sua password.';
            return;
        }
        
        try {
            // Desabilitar botão durante o login
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'A entrar...';
            
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Fazer login
            await handleUserLogin(loginEmail, loginPassword, rememberMe);
            
            // Sucesso - mostrar apenas toast
            loginErrorDiv.textContent = '';
            showToast('✓ Login realizado com sucesso!', 'success');
            
            // Limpar formulário
            loginForm.reset();
            
            // Verificar se há um plano selecionado
            const selectedPlan = sessionStorage.getItem('selectedPlan');
            let redirectUrl = 'index.html';
            
            // Verificar parâmetro de retorno na URL
            const params = new URLSearchParams(window.location.search);
            const returnTo = params.get('returnTo');
            
            if (selectedPlan && returnTo === 'pricing') {
                try {
                    const planData = JSON.parse(selectedPlan);
                    // Redirecionar para a página de pricing e completar a compra automaticamente
                    const planId = planData.id ? `&planId=${planData.id}` : '';
                    const isFree = planData.isFree ? '&isFree=true' : '';
                    redirectUrl = `pricing.html?plan=${encodeURIComponent(planData.name)}&price=${planData.price}${planId}${isFree}`;
                    sessionStorage.removeItem('selectedPlan');
                } catch (e) {
                    console.error('Erro ao processar plano selecionado:', e);
                }
            } else if (returnTo === 'pricing') {
                redirectUrl = 'pricing.html';
            }
            
            // Redirecionar após 1 segundo
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
            
        } catch (error) {
            loginErrorDiv.textContent = '';
            showToast(error.message, 'error');
            
            // Reabilitar botão
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';
        }
    });
}

// ===== Profile Page Functions =====
/**
 * Inicializar funcionalidades da página de perfil
 */
function initProfilePage() {
    // Tabs do menu de perfil
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchProfileTab(tabId);
        });
    });
    
    // Toggle password buttons na página de perfil
    const toggleButtons = document.querySelectorAll('.profile-content .toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const inputId = this.parentElement.querySelector('input').id;
            togglePassword(inputId);
        });
    });
    
    // Carregar dados do utilizador
    loadProfileData();
    
    // Logout button da página de perfil
    const logoutBtn3 = document.getElementById('logoutBtn3');
    if (logoutBtn3) {
        logoutBtn3.addEventListener('click', handleLogout);
    }
    
    // Botão de guardar alterações
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfileChanges);
    }
    
    // Botão de alterar password
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', changePassword);
    }
    
    // Toggle para editar nome
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const field = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            toggleEditMode(field);
        });
    });
    
    // Avatar edit functionality
    const editAvatarBtn = document.getElementById('editAvatarBtn');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', openAvatarModal);
    }
    
    // Modal close buttons
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalX = document.querySelector('.close-modal');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAvatarModal);
    if (closeModalX) closeModalX.addEventListener('click', closeAvatarModal);
    
    // URL confirm button
    const urlBtn = document.getElementById('urlBtn');
    if (urlBtn) {
        urlBtn.addEventListener('click', handleAvatarUrl);
    }
    
    // Fechar modal ao clicar fora
    const modal = document.getElementById('avatarModal');
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeAvatarModal();
            }
        });
    }
    
    // Modal de cancelamento de plano
    const cancelPlanModal = document.getElementById('cancelPlanModal');
    if (cancelPlanModal) {
        window.addEventListener('click', function(event) {
            if (event.target === cancelPlanModal) {
                closeCancelPlanModal();
            }
        });
    }
}

/**
 * Trocar aba do perfil
 */
function switchProfileTab(tabId) {
    // Remover aba ativa
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    
    // Adicionar aba ativa
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    
    // Marcar menu item como ativo
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

/**
 * Selecionar plano de subscrição
 */
function selectPlan(planName, price, planId, isFree) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Utilizador não está autenticado - redirecionar para login com parâmetro de retorno
            // Guardar o plano selecionado na sessionStorage
            sessionStorage.setItem('selectedPlan', JSON.stringify({ name: planName, price: price, id: planId, isFree: isFree }));
            window.location.href = 'login.html?returnTo=pricing';
            return;
        }
        
        try {
            // Se for plano free, atualizar diretamente sem Stripe
            if (isFree || price === 0) {
                await updateDoc(doc(db, "users", user.uid), {
                    subscriptionPlan: planName,
                    subscriptionPrice: 0,
                    subscriptionDate: new Date().toISOString(),
                    planId: planId,
                    isFree: true
                });
                
                showToast('✓ Subscrição grátis ativada com sucesso!', 'success');
                
                // Redirecionar para my-classes após 1 segundo
                setTimeout(() => {
                    window.location.href = 'my-classes.html';
                }, 1000);
                return;
            }
            
            // Obter o Price ID do plano no Stripe
            const priceId = getPriceIdForPlan(planName);
            
            if (!priceId) {
                showToast('Erro: Plano não encontrado. Contacte o suporte.', 'error');
                return;
            }
            
            // Chamar a Cloud Function para criar a sessão de checkout
            const response = await fetch('https://us-central1-site-franciosi-1dcd3.cloudfunctions.net/createCheckoutSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: priceId,
                    planName: planName,
                    userEmail: user.email,
                    userId: user.uid
                })
            });
            
            if (!response.ok) {
                throw new Error('Erro ao criar sessão de checkout');
            }
            
            const data = await response.json();
            
            // Redirecionar para o Stripe Checkout
            if (data.sessionId) {
                // Usar Stripe.js para redirecionar
                const stripe = Stripe(STRIPE_CONFIG.publishableKey);
                await stripe.redirectToCheckout({ sessionId: data.sessionId });
            } else if (data.error) {
                showToast('Erro: ' + data.error, 'error');
            }
            
        } catch (error) {
            console.error("Erro ao selecionar plano:", error);
            showToast('Erro ao processar compra. Tente novamente.', 'error');
        }
    });
}

/**
 * Abrir modal de cancelamento de plano
 */
function openCancelPlanModal() {
    const modal = document.getElementById('cancelPlanModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de cancelamento de plano
 */
function closeCancelPlanModal() {
    const modal = document.getElementById('cancelPlanModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Confirmar cancelamento do plano
 */
async function confirmCancelPlan() {
    try {
        const user = auth.currentUser;
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Atualizar documento do utilizador no Firestore
        await updateDoc(doc(db, "users", user.uid), {
            subscriptionPlan: null,
            subscriptionPrice: null,
            subscriptionDate: null,
            renewalDate: null
        });

        showToast('✓ Plano cancelado com sucesso!', 'success');
        closeCancelPlanModal();

        // Atualizar os campos na página
        document.getElementById('currentPlan').value = 'Nenhum plano selecionado';
        document.getElementById('subscriptionPrice').value = '—';
        document.getElementById('renewalDate').value = '—';
        document.getElementById('cancelPlanBtn').style.display = 'none';

        // Recarregar dados do perfil
        setTimeout(() => {
            loadProfileData();
        }, 500);
    } catch (error) {
        console.error("Erro ao cancelar plano:", error);
        showToast('Erro ao cancelar plano. Tente novamente.', 'error');
    }
}

// Expor a função globalmente para uso em onclick
window.selectPlan = selectPlan;
window.deleteUser = deleteUser;
window.openDeleteModal = openDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDeleteUser = confirmDeleteUser;
window.openPlanModal = openPlanModal;
window.closePlanModal = closePlanModal;
window.togglePriceField = togglePriceField;
window.savePlan = savePlan;
window.editPlan = editPlan;
window.deletePlan = deletePlan;
window.openForgotPasswordModal = openForgotPasswordModal;
window.closeForgotPasswordModal = closeForgotPasswordModal;
window.sendPasswordReset = sendPasswordReset;
window.handleGoogleLogin = handleGoogleLogin;
window.openCancelPlanModal = openCancelPlanModal;
window.closeCancelPlanModal = closeCancelPlanModal;
window.confirmCancelPlan = confirmCancelPlan;
window.closeRestrictedAccessModal = closeRestrictedAccessModal;
window.redirectToPricing = redirectToPricing;

// ========== FUNÇÕES PARA GERENCIAMENTO DE VÍDEOS ==========

let selectedVideoFolder = null;

async function refreshVideoFolders() {
    try {
        const select = document.getElementById('videoPastaSelect');
        const folderTree = document.getElementById('folderTree');
        
        if (!select || !folderTree) return;

        select.innerHTML = '<option value="">Carregando pastas...</option>';
        folderTree.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Carregando estrutura de pastas...</p>';

        // Listar todas as pastas na raiz do storage
        const listRef = ref(storage, '');
        const result = await listAll(listRef);

        const folders = result.prefixes.map(p => p.name).sort();
        
        if (folders.length === 0) {
            select.innerHTML = '<option value="">Nenhuma pasta encontrada</option>';
            folderTree.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">📁 / (vazia)</p>';
            return;
        }

        // Preencher select
        select.innerHTML = '<option value="">Selecionar pasta...</option>';
        folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder;
            option.textContent = folder;
            select.appendChild(option);
        });

        // Construir árvore de pastas
        let treeHTML = '<div style="padding: 5px;">📁 /</div>';
        for (const folder of folders) {
            const folderRef = ref(storage, folder);
            try {
                const result = await listAll(folderRef);
                const itemCount = result.items.length;
                const subfolderCount = result.prefixes.length;
                treeHTML += `<div style="padding-left: 20px; padding: 5px 5px 5px 20px; border-left: 1px solid #ddd;">📂 ${folder} <span style="color: #999;">(${itemCount} ficheiros${subfolderCount > 0 ? `, ${subfolderCount} subpastas` : ''})</span></div>`;
            } catch (error) {
                treeHTML += `<div style="padding-left: 20px; padding: 5px 5px 5px 20px;">📂 ${folder}</div>`;
            }
        }
        
        folderTree.innerHTML = treeHTML;
    } catch (error) {
        console.error('Erro ao carregar pastas:', error);
        showToast('❌ Erro ao carregar pastas: ' + error.message, 'error');
    }
}

async function uploadVideo() {
    try {
        const fileInput = document.getElementById('videoInput');
        const pastaSelect = document.getElementById('videoPastaSelect');
        const novaFasta = document.getElementById('videoNovaFasta');
        const file = fileInput.files[0];

        if (!file) {
            showToast('Por favor, selecione um vídeo', 'warning');
            return;
        }

        // Determinar qual pasta usar
        let pastaDestino = novaFasta.value.trim();
        
        if (!pastaDestino) {
            pastaDestino = pastaSelect.value;
        }

        if (!pastaDestino) {
            showToast('Por favor, selecione uma pasta ou digite o nome de uma nova pasta', 'warning');
            return;
        }

        // Validar tipo
        const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!validTypes.includes(file.type)) {
            showToast('Tipo de ficheiro não suportado. Use MP4, WebM ou OGG', 'error');
            return;
        }

        // Validar tamanho (máx 3GB)
        const maxSize = 3 * 1024 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast('O vídeo não pode exceder 3GB', 'error');
            return;
        }

        // Mostrar progresso
        const progressDiv = document.getElementById('uploadProgress');
        const uploadBar = document.getElementById('uploadBar');
        const uploadPercentage = document.getElementById('uploadPercentage');
        progressDiv.style.display = 'block';

        // Upload para Firebase Storage
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `${pastaDestino}/${fileName}`;
        const fileRef = ref(storage, filePath);

        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Atualizar progresso
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploadBar.style.width = progress + '%';
                uploadPercentage.textContent = Math.round(progress) + '%';
            },
            (error) => {
                // Erro
                progressDiv.style.display = 'none';
                console.error('Erro no upload:', error);
                showToast('❌ Erro ao fazer upload: ' + error.message, 'error');
            },
            async () => {
                // Upload completo
                progressDiv.style.display = 'none';
                uploadBar.style.width = '0%';
                uploadPercentage.textContent = '0%';
                
                const videoUrl = await getDownloadURL(fileRef);
                
                // Salvar metadados no Firestore
                await setDoc(doc(db, 'videos', `${pastaDestino}_${fileName}`), {
                    name: file.name,
                    folder: pastaDestino,
                    url: videoUrl,
                    size: file.size,
                    type: file.type,
                    uploadedAt: new Date().toISOString(),
                    uploadedBy: auth.currentUser.email
                });

                showToast('✓ Vídeo carregado com sucesso!', 'success');
                fileInput.value = '';
                novaFasta.value = '';
                refreshVideoFolders();
                loadVideosList();
            }
        );
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        showToast('❌ Erro: ' + error.message, 'error');
    }
}

async function loadVideosList() {
    try {
        const videosList = document.getElementById('videosList');
        const searchInput = document.getElementById('searchVideos');
        
        if (!videosList) return;

        videosList.innerHTML = '<div style="text-align: center; padding: 30px; grid-column: 1/-1; color: #999;">Carregando vídeos...</div>';

        const querySnapshot = await getDocs(collection(db, 'videos'));
        let videos = [];

        querySnapshot.forEach(doc => {
            videos.push({ id: doc.id, ...doc.data() });
        });

        if (videos.length === 0) {
            videosList.innerHTML = '<div style="text-align: center; padding: 30px; grid-column: 1/-1; color: #999;">Nenhum vídeo carregado ainda</div>';
            return;
        }

        // Função para filtrar vídeos
        function displayVideos(filter = '') {
            const filtered = videos.filter(v => 
                v.name.toLowerCase().includes(filter.toLowerCase()) ||
                v.folder.toLowerCase().includes(filter.toLowerCase())
            );

            if (filtered.length === 0) {
                videosList.innerHTML = '<div style="text-align: center; padding: 30px; grid-column: 1/-1; color: #999;">Nenhum vídeo encontrado</div>';
                return;
            }

            videosList.innerHTML = filtered.map(video => `
                <div style="background: white; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; text-align: center; font-size: 2em;">
                        🎬
                    </div>
                    <div style="padding: 12px;">
                        <h4 style="margin: 0 0 8px 0; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${video.name}</h4>
                        <p style="margin: 4px 0; font-size: 0.85em; color: #666;">📁 ${video.folder}</p>
                        <p style="margin: 4px 0; font-size: 0.85em; color: #999;">${(video.size / (1024*1024)).toFixed(2)} MB</p>
                        <p style="margin: 4px 0; font-size: 0.8em; color: #999;">📅 ${new Date(video.uploadedAt).toLocaleDateString('pt-PT')}</p>
                        <div style="margin-top: 10px; display: flex; gap: 6px;">
                            <button onclick="deleteVideo('${video.id}')" style="flex: 1; padding: 6px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8em; transition: background 0.2s;" onmouseover="this.style.background='#c82333'" onmouseout="this.style.background='#dc3545'">🗑️ Eliminar</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        displayVideos();

        // Listener para pesquisa
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                displayVideos(e.target.value);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
    }
}

async function deleteVideo(videoId) {
    try {
        // Obter informações do vídeo
        const videoDoc = await getDoc(doc(db, 'videos', videoId));
        if (!videoDoc.exists()) {
            showToast('Vídeo não encontrado', 'error');
            return;
        }

        const videoData = videoDoc.data();
        
        // Guardar dados globalmente para usar no modal
        window.currentDeleteVideoId = videoId;
        window.currentDeleteVideoData = videoData;

        // Preencher modal com dados
        document.getElementById('deleteVideoName').textContent = videoData.name;
        document.getElementById('deleteVideoFolder').textContent = videoData.folder;
        document.getElementById('deleteVideoSize').textContent = (videoData.size / (1024*1024)).toFixed(2) + ' MB';

        // Abrir modal
        const modal = document.getElementById('deleteVideoModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    } catch (error) {
        console.error('Erro ao preparar eliminação:', error);
        showToast('❌ Erro: ' + error.message, 'error');
    }
}

function closeDeleteVideoModal() {
    const modal = document.getElementById('deleteVideoModal');
    if (modal) {
        modal.style.display = 'none';
    }
    window.currentDeleteVideoId = null;
    window.currentDeleteVideoData = null;
}

async function confirmDeleteVideo() {
    try {
        const videoId = window.currentDeleteVideoId;
        const videoData = window.currentDeleteVideoData;

        if (!videoId || !videoData) {
            showToast('Erro: dados inválidos', 'error');
            return;
        }

        // Desabilitar botão
        const deleteBtn = document.getElementById('confirmDeleteVideoBtn');
        deleteBtn.disabled = true;
        deleteBtn.textContent = '⏳ A eliminar...';

        // Eliminar do Storage
        const filePath = `${videoData.folder}/${videoData.name.split('/').pop()}`;
        try {
            await deleteObject(ref(storage, filePath));
        } catch (storageError) {
            console.warn('Arquivo não encontrado no storage:', storageError);
        }

        // Eliminar do Firestore
        await deleteDoc(doc(db, 'videos', videoId));

        // Fechar modal
        closeDeleteVideoModal();

        // Restaurar botão
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Eliminar Permanentemente';

        showToast('✓ Vídeo eliminado com sucesso!', 'success');
        loadVideosList();
    } catch (error) {
        console.error('Erro ao eliminar vídeo:', error);
        showToast('❌ Erro ao eliminar: ' + error.message, 'error');

        // Restaurar botão
        const deleteBtn = document.getElementById('confirmDeleteVideoBtn');
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Eliminar Permanentemente';
    }
}

// Exportar funções para vídeos
window.refreshVideoFolders = refreshVideoFolders;
window.uploadVideo = uploadVideo;
window.deleteVideo = deleteVideo;
window.loadVideosList = loadVideosList;
window.closeDeleteVideoModal = closeDeleteVideoModal;
window.confirmDeleteVideo = confirmDeleteVideo;
window.checkAdminAccessVideos = checkAdminAccessVideos;

// Função para verificar acesso admin à tab de vídeos
async function checkAdminAccessVideos() {
    try {
        const user = auth.currentUser;
        if (!user) {
            showToast('Por favor, faça login', 'error');
            return;
        }

        // Buscar dados do utilizador
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
            // Não é admin - mostrar mensagem
            const videosTab = document.getElementById('videos');
            videosTab.innerHTML = `
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 60vh; text-align: center;">
                    <div style="font-size: 3em; margin-bottom: 20px;">🔒</div>
                    <h2 style="color: #333; margin-bottom: 10px;">Acesso Restrito</h2>
                    <p style="color: #666; font-size: 1.1em; margin-bottom: 20px;">Apenas administradores podem gerir vídeos</p>
                    <p style="color: #999; font-size: 0.95em;">Contacte o administrador se necessário</p>
                </div>
            `;
            showToast('⛔ Sem permissão para aceder a esta secção', 'error');
            return;
        }

        // É admin - carregar dados
        refreshVideoFolders();
        loadVideosList();
    } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        showToast('Erro ao verificar permissões: ' + error.message, 'error');
    }
}

window.checkAdminAccessVideos = checkAdminAccessVideos;

/**
 * Carregar dados do utilizador do Firestore
 */
function loadProfileData() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Utilizador não está autenticado - redirecionar para login
            window.location.href = 'login.html';
            return;
        }
        
        try {
            // Buscar dados do Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // Preencher os campos
                document.getElementById('fullNameInput').value = userData.nome || '';
                document.getElementById('emailInput').value = user.email || '';
                document.getElementById('roleInput').value = userData.role || 'aluno';
                
                // Carregar avatar se existir
                if (userData.avatar) {
                    document.getElementById('avatarImage').src = userData.avatar;
                }
                
                // Formatar data de registo
                if (userData.createdAt) {
                    const date = new Date(userData.createdAt);
                    document.getElementById('createdAtInput').value = date.toLocaleDateString('pt-PT');
                }
                
                // Carregar informações de subscrição
                if (userData.subscriptionPlan) {
                    document.getElementById('currentPlan').value = userData.subscriptionPlan || '';
                    document.getElementById('subscriptionPrice').value = userData.subscriptionPrice ? `€${userData.subscriptionPrice}/mês` : '';
                    // Mostrar botão de cancelamento
                    const cancelBtn = document.getElementById('cancelPlanBtn');
                    if (cancelBtn) {
                        cancelBtn.style.display = 'block';
                    }
                } else {
                    document.getElementById('currentPlan').value = 'Nenhum plano selecionado';
                    document.getElementById('subscriptionPrice').value = '—';
                    // Esconder botão de cancelamento
                    const cancelBtn = document.getElementById('cancelPlanBtn');
                    if (cancelBtn) {
                        cancelBtn.style.display = 'none';
                    }
                }
                
                // Formatar data de renovação
                if (userData.renewalDate) {
                    const renewalDateObj = new Date(userData.renewalDate);
                    document.getElementById('renewalDate').value = renewalDateObj.toLocaleDateString('pt-PT');
                } else {
                    document.getElementById('renewalDate').value = '—';
                }
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            showToast('Erro ao carregar dados do perfil', 'error');
        }
    });
}

/**
 * Alternar modo de edição
 */
function toggleEditMode(field) {
    const input = document.getElementById(field + 'Input');
    const btn = event.target;
    
    if (input.readOnly) {
        input.readOnly = false;
        btn.textContent = 'Cancelar';
        document.getElementById('saveProfileBtn').style.display = 'block';
    } else {
        input.readOnly = true;
        btn.textContent = 'Editar';
        document.getElementById('saveProfileBtn').style.display = 'none';
    }
}

/**
 * Guardar alterações do perfil
 */
async function saveProfileChanges() {
    try {
        const user = auth.currentUser;
        if (!user) return;
        
        const newName = document.getElementById('fullNameInput').value.trim();
        
        if (!newName) {
            showToast('Por favor, insira o nome', 'error');
            return;
        }
        
        // Atualizar no Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            nome: newName
        });
        
        // Voltar ao modo read-only
        document.getElementById('fullNameInput').readOnly = true;
        document.querySelector('.edit-btn').textContent = 'Editar';
        document.getElementById('saveProfileBtn').style.display = 'none';
        
        showToast('✓ Perfil atualizado com sucesso!', 'success');
        
        // Atualizar o nome na navbar
        checkAuthStatus();
    } catch (error) {
        console.error("Erro ao guardar:", error);
        showToast('Erro ao guardar alterações: ' + error.message, 'error');
    }
}

/**
 * Alterar password do utilizador
 */
async function changePassword() {
    try {
        const user = auth.currentUser;
        if (!user) return;
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        const securityError = document.getElementById('securityError');
        
        securityError.textContent = '';
        
        // Validações
        if (!currentPassword) {
            securityError.textContent = '✗ Por favor, insira a password atual.';
            securityError.classList.add('show');
            return;
        }
        
        if (newPassword.length < 6) {
            securityError.textContent = '✗ A nova password deve ter pelo menos 6 caracteres.';
            securityError.classList.add('show');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            securityError.textContent = '✗ As passwords não coincidem.';
            securityError.classList.add('show');
            return;
        }
        
        // Re-autenticar o utilizador
        const credential = await signInWithEmailAndPassword(auth, user.email, currentPassword);
        
        // Atualizar password
        await updateUserPassword(user, newPassword);
        
        // Limpar formulário
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
        
        securityError.textContent = '';
        showToast('✓ Password alterada com sucesso!', 'success');
    } catch (error) {
        console.error("Erro ao alterar password:", error);
        const securityError = document.getElementById('securityError');
        
        if (error.code === 'auth/wrong-password') {
            securityError.textContent = '✗ Password atual incorreta.';
        } else {
            securityError.textContent = 'Erro ao alterar password: ' + error.message;
        }
        securityError.classList.add('show');
    }
}

/**
 * Função auxiliar para atualizar password
 */
async function updateUserPassword(user, newPassword) {
    const response = await fetch('/.netlify/functions/update-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uid: user.uid,
            newPassword: newPassword
        })
    });
    
    if (!response.ok) {
        throw new Error('Erro ao atualizar password');
    }
}

// Chamar initProfilePage quando estiver em profile.html
if (document.body.contains(document.querySelector('.profile-section'))) {
    document.addEventListener('DOMContentLoaded', initProfilePage);
}

// ===== Avatar Functions =====
/**
 * Abrir modal de edição de avatar
 */
function openAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de edição de avatar
 */
function closeAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Limpar campos se existirem
    const avatarUrl = document.getElementById('avatarUrl');
    const avatarFile = document.getElementById('avatarFile');
    if (avatarUrl) avatarUrl.value = '';
    if (avatarFile) avatarFile.value = '';
}

/**
 * Trocar aba do modal de avatar
 */
function switchAvatarModalTab(tabName) {
    // Remover active de todas as abas e botões
    document.querySelectorAll('.modal-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adicionar active à aba e botão clicado
    const tabContent = document.getElementById(tabName + 'Tab');
    if (tabContent) tabContent.classList.add('active');
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

/**
 * Processar upload de arquivo de avatar
 */
async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        showToast('Por favor, selecione um arquivo de imagem', 'error');
        return;
    }
    
    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('A imagem deve ter menos de 5MB', 'error');
        return;
    }
    
    try {
        const user = auth.currentUser;
        if (!user) {
            showToast('Erro: Utilizador não autenticado', 'error');
            return;
        }
        
        // Mostrar mensagem de carregamento
        showToast('A carregar imagem...', 'info');
        
        // Fazer upload para Firebase Storage
        const avatarRef = ref(storage, `avatars/${user.uid}/avatar`);
        await uploadBytes(avatarRef, file);
        
        // Obter URL para download
        const avatarUrl = await getDownloadURL(avatarRef);
        
        // Guardar URL no Firestore
        await updateDoc(doc(db, "users", user.uid), {
            avatar: avatarUrl
        });
        
        // Atualizar a imagem no perfil
        const avatarImg = document.getElementById('avatarImage');
        if (avatarImg) {
            avatarImg.src = avatarUrl;
        }
        
        showToast('✓ Avatar atualizado com sucesso!', 'success');
        closeAvatarModal();
    } catch (error) {
        console.error("Erro ao fazer upload:", error);
        showToast('Erro ao fazer upload: ' + error.message, 'error');
    }
}

/**
 * Processar URL de avatar
 */
async function handleAvatarUrl() {
    const avatarUrl = document.getElementById('avatarUrl').value.trim();
    
    if (!avatarUrl) {
        showToast('Por favor, insira um URL válido', 'error');
        return;
    }
    
    try {
        // Validar se a URL é válida testando carregar a imagem
        const img = new Image();
        img.onerror = function() {
            showToast('URL da imagem inválida', 'error');
        };
        img.onload = async function() {
            try {
                // Guardar no Firestore
                const user = auth.currentUser;
                if (user) {
                    await updateDoc(doc(db, "users", user.uid), {
                        avatar: avatarUrl
                    });
                    
                    // Atualizar a imagem no perfil
                    const avatarImg = document.getElementById('avatarImage');
                    if (avatarImg) avatarImg.src = avatarUrl;
                    
                    showToast('✓ Avatar atualizado com sucesso!', 'success');
                    closeAvatarModal();
                    
                    // Atualizar navbar
                    checkAuthStatus();
                }
            } catch (error) {
                console.error("Erro ao guardar:", error);
                showToast('Erro ao guardar avatar: ' + error.message, 'error');
            }
        };
        img.src = avatarUrl;
    } catch (error) {
        console.error("Erro:", error);
        showToast('Erro ao processar URL: ' + error.message, 'error');
    }
}

/**
 * Inicializar Admin Dashboard
 */
function initAdminDashboard() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        try {
            // Verificar se é admin
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists() || userDoc.data().role?.toLowerCase() !== 'admin') {
                window.location.href = 'index.html';
                return;
            }

            // Carregar dados do dashboard
            await loadDashboardData();
            
            // Setup do navbar com profileMenu5
            checkAuthStatus();
            setupAdminMenuListeners();
            
        } catch (error) {
            console.error("Erro ao inicializar admin dashboard:", error);
            window.location.href = 'index.html';
        }
    });
}

// Processar plano selecionado após retorno do login
document.addEventListener('DOMContentLoaded', function() {
            const params = new URLSearchParams(window.location.search);
            const planName = params.get('plan');
            const planPrice = params.get('price');
            const planId = params.get('planId');
            const isFree = params.get('isFree') === 'true';
            
            if (planName && planPrice !== null) {
                // Aguardar um pouco para garantir que o script.js está carregado
                setTimeout(() => {
                    // Verificar se o utilizador está autenticado
                    if (window.selectPlan) {
                        selectPlan(decodeURIComponent(planName), parseFloat(planPrice), planId, isFree);
                    }
                }, 500);
                
                // Limpar a URL
                window.history.replaceState({}, document.title, 'pricing.html');
            }
        });

/**
 * Carregar dados do dashboard
 */
async function loadDashboardData() {
    try {
        // Buscar todos os utilizadores (agora com permissão de admin)
        const usersSnapshot = await getDocs(collection(db, "users"));
        let totalUsers = 0;
        let totalAlunos = 0;
        let totalProfessores = 0;
        let totalAdmins = 0;
        let totalRevenue = 0;
        
        const usersData = [];
        const planStats = {};

        // Inicializar estatísticas dos planos
        if (window.allPlans) {
            window.allPlans.forEach(plan => {
                planStats[plan.name] = { users: 0, revenue: 0 };
            });
        }

        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            
            // Ignorar utilizadores marcados como eliminados
            if (userData.deleted) return;
            
            totalUsers++;
            
            const role = userData.role?.toLowerCase() || 'aluno';
            if (role === 'aluno') totalAlunos++;
            else if (role === 'professor') totalProfessores++;
            else if (role === 'admin') totalAdmins++;

            // Calcular receita por plano
            if (userData.subscriptionPlan && userData.subscriptionPrice) {
                const planName = userData.subscriptionPlan;
                totalRevenue += userData.subscriptionPrice;
                
                if (planStats[planName]) {
                    planStats[planName].users++;
                    planStats[planName].revenue += userData.subscriptionPrice;
                }
            }

            // Adicionar para a tabela de utilizadores
            usersData.push({
                uid: doc.id,
                nome: userData.nome || 'N/A',
                email: userData.email || doc.id,
                role: userData.role || 'aluno',
                plan: userData.subscriptionPlan || 'Sem plano',
                createdAt: userData.createdAt || new Date().toISOString()
            });
        });

        // Guardar dados globalmente para filtro
        window.allUsersData = usersData;

        // Atualizar Dashboard
        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('activeStudents').textContent = totalAlunos;
        document.getElementById('totalTeachers').textContent = totalProfessores;
        document.getElementById('totalRevenue').textContent = `€${totalRevenue}`;

        // Atualizar Gráficos
        document.getElementById('chartAlunos').textContent = totalAlunos;
        document.getElementById('chartProfessores').textContent = totalProfessores;
        document.getElementById('chartAdmins').textContent = totalAdmins;
        
        // Atualizar estatísticas dos planos dinâmicos
        if (window.allPlans) {
            let basicUsers = 0, basicRevenue = 0;
            let standardUsers = 0, standardRevenue = 0;
            let premiumUsers = 0, premiumRevenue = 0;
            let otherCount = 0;

            window.allPlans.forEach(plan => {
                const stats = planStats[plan.name] || { users: 0, revenue: 0 };
                
                // Atualizar elementos específicos do plano
                const usersEl = document.getElementById(`users-${plan.id}`);
                const revenueEl = document.getElementById(`revenue-${plan.id}`);
                
                if (usersEl) usersEl.textContent = stats.users;
                if (revenueEl) revenueEl.textContent = `€${stats.revenue}`;

                // Categorizar para os gráficos
                if (plan.name === 'Básico') {
                    basicUsers = stats.users;
                    basicRevenue = stats.revenue;
                } else if (plan.name === 'Standard') {
                    standardUsers = stats.users;
                    standardRevenue = stats.revenue;
                } else if (plan.name === 'Premium') {
                    premiumUsers = stats.users;
                    premiumRevenue = stats.revenue;
                } else {
                    otherCount += stats.users;
                }
            });

            document.getElementById('chartBasico').textContent = basicUsers;
            document.getElementById('chartStandard').textContent = standardUsers;
            document.getElementById('chartPremium').textContent = premiumUsers;

            // Atualizar antigos elementos de Planos se existirem
            if (document.getElementById('basicUsers')) {
                document.getElementById('basicUsers').textContent = basicUsers;
                document.getElementById('basicRevenue').textContent = `€${basicRevenue}`;
                document.getElementById('standardUsers').textContent = standardUsers;
                document.getElementById('standardRevenue').textContent = `€${standardRevenue}`;
                document.getElementById('premiumUsers').textContent = premiumUsers;
                document.getElementById('premiumRevenue').textContent = `€${premiumRevenue}`;
            }

            // Relatórios
            if (document.getElementById('reportBasicPlan')) {
                document.getElementById('reportBasicPlan').textContent = basicUsers;
                document.getElementById('reportStandardPlan').textContent = standardUsers;
                document.getElementById('reportPremiumPlan').textContent = premiumUsers;
            }
        }

        // Atualizar Relatórios
        document.getElementById('reportTotalUsers').textContent = totalUsers;
        document.getElementById('reportActiveUsers').textContent = totalAlunos;
        document.getElementById('reportNewUsers').textContent = totalAlunos;
        document.getElementById('reportTotalRevenue').textContent = `€${totalRevenue}`;
        document.getElementById('reportMonthRevenue').textContent = `€${totalRevenue}`;
        const avgRevenue = totalAlunos > 0 ? (totalRevenue / totalAlunos).toFixed(2) : 0;
        document.getElementById('reportAvgRevenue').textContent = `€${avgRevenue}`;

        // Atualizar tabela de utilizadores
        updateUsersTable(usersData);

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showToast('Erro ao carregar dados: ' + error.message, 'error');
        setupEmptyDashboard();
    }
}

/**
 * Setup dashboard vazio quando há erro
 */
function setupEmptyDashboard() {
    document.getElementById('totalUsers').textContent = '—';
    document.getElementById('activeStudents').textContent = '—';
    document.getElementById('totalTeachers').textContent = '—';
    document.getElementById('totalRevenue').textContent = '€—';
    
    document.getElementById('chartAlunos').textContent = '—';
    document.getElementById('chartProfessores').textContent = '—';
    document.getElementById('chartAdmins').textContent = '—';
    
    document.getElementById('chartBasico').textContent = '—';
    document.getElementById('chartStandard').textContent = '—';
    document.getElementById('chartPremium').textContent = '—';
    
    document.getElementById('basicUsers').textContent = '—';
    document.getElementById('basicRevenue').textContent = '€—';
    document.getElementById('standardUsers').textContent = '—';
    document.getElementById('standardRevenue').textContent = '€—';
    document.getElementById('premiumUsers').textContent = '—';
    document.getElementById('premiumRevenue').textContent = '€—';
    
    document.getElementById('reportTotalUsers').textContent = '—';
    document.getElementById('reportActiveUsers').textContent = '—';
    document.getElementById('reportNewUsers').textContent = '—';
    document.getElementById('reportTotalRevenue').textContent = '€—';
    document.getElementById('reportMonthRevenue').textContent = '€—';
    document.getElementById('reportAvgRevenue').textContent = '€—';
    document.getElementById('reportBasicPlan').textContent = '—';
    document.getElementById('reportStandardPlan').textContent = '—';
    document.getElementById('reportPremiumPlan').textContent = '—';
    
    updateUsersTable([]);
}

/**
 * Atualizar tabela de utilizadores
 */
function updateUsersTable(users) {
    const tableBody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Nenhum utilizador encontrado</td></tr>';
        return;
    }

    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>
                <select class="role-select" data-uid="${user.uid}" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
                    <option value="aluno" ${user.role === 'aluno' ? 'selected' : ''}>Aluno</option>
                    <option value="professor" ${user.role === 'professor' ? 'selected' : ''}>Professor</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
            </td>
            <td>${user.plan}</td>
            <td>${new Date(user.createdAt).toLocaleDateString('pt-PT')}</td>
            <td>
                <button class="btn-secondary btn-delete" data-uid="${user.uid}" style="font-size: 0.85rem; padding: 5px 10px; background-color: #dc3545;">Eliminar</button>
            </td>
        </tr>
    `).join('');

    // Setup de event listeners para os selects de role
    document.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', async function() {
            const uid = this.getAttribute('data-uid');
            const newRole = this.value;
            await updateUserRole(uid, newRole);
        });
    });

    // Setup de event listeners para botões de eliminar
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async function() {
            const uid = this.getAttribute('data-uid');
            await deleteUser(uid);
        });
    });
}

/**
 * Atualizar role do utilizador
 */
async function updateUserRole(uid, newRole) {
    try {
        await updateDoc(doc(db, "users", uid), {
            role: newRole
        });
        showToast(`✓ Role atualizado para ${newRole}!`, 'success');
        // Recarregar dados
        await loadDashboardData();
    } catch (error) {
        console.error("Erro ao atualizar role:", error);
        showToast('Erro ao atualizar role: ' + error.message, 'error');
        // Recarregar tabela para reverter alteração
        await loadDashboardData();
    }
}

/**
 * Eliminar utilizador
 */
async function deleteUser(uid) {
    // Buscar dados do utilizador para mostrar no modal
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Verificar se é admin
            if (userData.role?.toLowerCase() === 'admin') {
                showToast('⛔ Não é possível eliminar contas de administrador!', 'error');
                return;
            }
            
            // Preencher modal com dados
            document.getElementById('confirmEmail').textContent = userData.email || 'N/A';
            document.getElementById('confirmUserName').textContent = userData.nome || 'N/A';
            
            // Guardar uid globalmente para confirmação
            window.userToDelete = {
                uid: uid,
                email: userData.email,
                nome: userData.nome,
                role: userData.role
            };
            
            // Mostrar modal
            openDeleteModal();
        }
    } catch (error) {
        console.error("Erro ao buscar dados do utilizador:", error);
        showToast('Erro ao buscar dados do utilizador', 'error');
    }
}

/**
 * Abrir modal de confirmação de eliminação
 */
function openDeleteModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de confirmação de eliminação
 */
function closeDeleteModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.style.display = 'none';
    }
    window.userToDelete = null;
}

/**
 * Confirmar eliminação do utilizador
 */
async function confirmDeleteUser() {
    if (!window.userToDelete) return;

    const uid = window.userToDelete.uid;
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    // Desabilitar botão durante o processo
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'A eliminar...';

    try {
        // Marcar como eliminado
        await updateDoc(doc(db, "users", uid), {
            deleted: true,
            deletedAt: new Date().toISOString()
        });
        
        showToast('✓ Utilizador eliminado com sucesso!', 'success');
        closeDeleteModal();
        
        // Recarregar dados
        await loadDashboardData();
    } catch (error) {
        console.error("Erro ao eliminar utilizador:", error);
        showToast('Erro ao eliminar utilizador: ' + error.message, 'error');
    } finally {
        // Reabilitar botão
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Eliminar Permanentemente';
    }
}

/**
 * Setup dos listeners do menu admin
 */
function setupAdminMenuListeners() {
    const menuItems = document.querySelectorAll('.admin-menu-item');
    const tabs = document.querySelectorAll('.admin-tab');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remover classe active de todos
            menuItems.forEach(m => m.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            
            // Adicionar classe active ao elemento clicado
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            // Carregar dados quando abrir tabs do professor
            if (tabName === 'messages' && window.loadProfessorMessages) {
                loadProfessorMessages();
            }

            // Carregar dados quando abrir tab de vídeos - APENAS ADMINS
            if (tabName === 'videos') {
                checkAdminAccessVideos();
            }
        });
    });

    // Setup do search input
    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('input', filterUsersTable);
    }

    // Setup do filter select
    const filterRole = document.getElementById('filterRole');
    if (filterRole) {
        filterRole.addEventListener('change', filterUsersTable);
    }

    // Fechar modal ao clicar fora
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }

    // Fechar modal de plano ao clicar fora
    const planModal = document.getElementById('planModal');
    if (planModal) {
        planModal.addEventListener('click', function(e) {
            if (e.target === planModal) {
                closePlanModal();
            }
        });
    }

    // Fechar modal de acesso restrito ao clicar fora
    const restrictedAccessModal = document.getElementById('restrictedAccessModal');
    if (restrictedAccessModal) {
        restrictedAccessModal.addEventListener('click', function(e) {
            if (e.target === restrictedAccessModal) {
                closeRestrictedAccessModal();
            }
        });
    }
}

/**
 * Filtrar tabela de utilizadores por busca e role
 */
function filterUsersTable() {
    const searchInput = document.getElementById('searchUsers');
    const filterRole = document.getElementById('filterRole');
    
    if (!searchInput || !filterRole || !window.allUsersData) return;

    const searchTerm = searchInput.value.toLowerCase();
    const selectedRole = filterRole.value.toLowerCase();

    // Filtrar dados
    let filteredUsers = window.allUsersData;

    // Filtro por busca (nome ou email)
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
            user.nome.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm)
        );
    }

    // Filtro por role
    if (selectedRole) {
        filteredUsers = filteredUsers.filter(user => 
            user.role.toLowerCase() === selectedRole
        );
    }

    // Atualizar tabela
    updateUsersTable(filteredUsers);
}

/**
 * Carregar planos da base de dados
 */
async function loadPlans() {
    try {
        const plansSnapshot = await getDocs(collection(db, "plans"));
        const plans = [];
        
        plansSnapshot.forEach(doc => {
            plans.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Armazenar globalmente - ordenar populares em primeiro, depois por preço
        window.allPlans = plans.sort((a, b) => {
            // Se um é popular e o outro não, o popular vem primeiro
            if (a.popular && !b.popular) return -1;
            if (!a.popular && b.popular) return 1;
            // Se ambos são populares ou ambos não são, ordenar por preço
            return a.price - b.price;
        });

        // Atualizar grid de planos no admin
        const plansGrid = document.getElementById('plansGrid');
        if (plansGrid) {
            updatePlansGrid(plans);
        }

        // Atualizar pricing page
        const pricingGrid = document.getElementById('pricingGrid');
        if (pricingGrid) {
            updatePricingGrid(plans);
        }

        // Atualizar estatísticas do dashboard
        updatePlansStats(plans);
    } catch (error) {
        console.error("Erro ao carregar planos:", error);
    }
}

/**
 * Atualizar grid de planos no admin
 */
function updatePlansGrid(plans) {
    const plansGrid = document.getElementById('plansGrid');
    if (!plansGrid) return;

    if (plans.length === 0) {
        plansGrid.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p>Nenhum plano criado. Clique em "Adicionar Novo Plano" para começar.</p></div>';
        return;
    }

    plansGrid.innerHTML = plans.map(plan => `
        <div class="plan-card-admin">
            ${plan.popular ? '<div class="badge-popular">Popular</div>' : ''}
            ${plan.isFree ? '<div class="badge-free" style="background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; display: inline-block; margin-bottom: 8px;">Grátis</div>' : ''}
            <h3>${plan.name}</h3>
            <p class="plan-price">${plan.isFree ? '<span style="color: #4CAF50; font-size: 1.5em;">Grátis</span>' : `€${plan.price.toFixed(2)}<span>/mês</span>`}</p>
            <p class="plan-desc">${plan.description}</p>
            <div class="plan-stats">
                <p>${plan.lessons} aulas/mês</p>
                <p>${plan.duration} minutos/aula</p>
                <p>Utilizadores: <strong id="users-${plan.id}">0</strong></p>
                <p>Receita: <strong id="revenue-${plan.id}">€0</strong></p>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="btn-secondary" style="flex: 1;" onclick="editPlan('${plan.id}')">Editar</button>
                <button class="btn-delete" style="flex: 1;" onclick="deletePlan('${plan.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

/**
 * Atualizar grid de planos na página de pricing
 */
function updatePricingGrid(plans) {
    const pricingGrid = document.getElementById('pricingGrid');
    if (!pricingGrid) return;

    if (plans.length === 0) {
        pricingGrid.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p>Nenhum plano disponível no momento.</p></div>';
        return;
    }

    pricingGrid.innerHTML = plans.map(plan => `
        <div class="pricing-card ${plan.popular ? 'featured' : ''}">
            ${plan.popular ? '<div class="badge">Popular</div>' : ''}
            ${plan.isFree ? '<div class="badge" style="background: #4CAF50;">Grátis</div>' : ''}
            <div class="price-header">
                <h3>${plan.name}</h3>
                <div class="price">
                    ${plan.isFree ? '<span style="color: #4CAF50; font-size: 2em;">Grátis</span>' : `<span class="currency">€</span>
                    <span class="amount">${plan.price.toFixed(2)}</span>
                    <span class="period">/mês</span>`}
                </div>
            </div>
            <p class="price-description">${plan.description}</p>
            <ul class="price-features">
                ${plan.features && plan.features.length > 0 ? plan.features.map(feature => `<li>${feature}</li>`).join('') : '<li>Acesso a aulas premium</li>'}
            </ul>
            <button class="plan-button" onclick="selectPlan('${plan.name}', ${plan.price}, '${plan.id}', ${plan.isFree || false})">${plan.isFree ? 'Subscrever Grátis' : 'Escolher Plano'}</button>
        </div>
    `).join('');
}

/**
 * Atualizar estatísticas dos planos no dashboard
 */
function updatePlansStats(plans) {
    const usersSnapshot = getDocs(collection(db, "users"));
    
    usersSnapshot.then(snapshot => {
        const planStats = {};
        
        // Inicializar estatísticas
        plans.forEach(plan => {
            planStats[plan.name] = { users: 0, revenue: 0 };
        });

        // Calcular estatísticas
        snapshot.forEach(doc => {
            const userData = doc.data();
            if (userData && userData.subscriptionPlan && userData.subscriptionPrice) {
                const planName = userData.subscriptionPlan;
                if (planStats[planName]) {
                    planStats[planName].users++;
                    planStats[planName].revenue += userData.subscriptionPrice;
                }
            }
        });

        // Atualizar elementos
        plans.forEach(plan => {
            const stats = planStats[plan.name] || { users: 0, revenue: 0 };
            const usersEl = document.getElementById(`users-${plan.id}`);
            const revenueEl = document.getElementById(`revenue-${plan.id}`);
            
            if (usersEl) usersEl.textContent = stats.users || 0;
            if (revenueEl) revenueEl.textContent = `€${stats.revenue || 0}`;
        });
    }).catch(error => {
        console.error("Erro ao atualizar estatísticas dos planos:", error);
    });
}

/**
 * Abrir modal para criar novo plano
 */
function openPlanModal(planId = null) {
    const modal = document.getElementById('planModal');
    const form = document.getElementById('planForm');
    const title = document.getElementById('planModalTitle');
    
    if (!modal) return;

    // Limpar formulário
    form.reset();
    
    if (planId) {
        // Editar plano existente
        title.textContent = 'Editar Plano';
        const allPlans = window.allPlans || [];
        const plan = allPlans.find(p => p.id === planId);
        
        if (plan) {
            document.getElementById('planName').value = plan.name || '';
            document.getElementById('planIsFree').checked = plan.isFree || false;
            document.getElementById('planPrice').value = plan.price || '';
            document.getElementById('planDescription').value = plan.description || '';
            document.getElementById('planLessons').value = plan.lessons || '';
            document.getElementById('planDuration').value = plan.duration || '';
            document.getElementById('planFeatures').value = (plan.features || []).join('\n');
            document.getElementById('planPopular').checked = plan.popular || false;
            
            // Mostrar/esconder campo de preço baseado no isFree
            togglePriceField();
            
            // Armazenar ID do plano a editar
            window.editingPlanId = planId;
        } else {
            showToast('Plano não encontrado', 'error');
            return;
        }
    } else {
        // Criar novo plano
        title.textContent = 'Criar Novo Plano';
        document.getElementById('planIsFree').checked = false;
        window.editingPlanId = null;
        togglePriceField();
    }

    modal.style.display = 'flex';
}

/**
 * Fechar modal de plano
 */
function closePlanModal() {
    const modal = document.getElementById('planModal');
    if (modal) {
        modal.style.display = 'none';
    }
    window.editingPlanId = null;
}

/**
 * Alternar visibilidade do campo de preço
 */
function togglePriceField() {
    const isFree = document.getElementById('planIsFree').checked;
    const priceGroup = document.getElementById('priceGroup');
    const priceInput = document.getElementById('planPrice');
    
    if (isFree) {
        // Esconder campo de preço e remover atributo required
        priceGroup.style.display = 'none';
        priceInput.removeAttribute('required');
        priceInput.value = '0';
    } else {
        // Mostrar campo de preço e adicionar atributo required
        priceGroup.style.display = 'block';
        priceInput.setAttribute('required', '');
    }
}

/**
 * Guardar plano (criar ou editar)
 */
async function savePlan(event) {
    event.preventDefault();

    const name = document.getElementById('planName').value.trim();
    const isFree = document.getElementById('planIsFree').checked;
    const price = isFree ? 0 : parseFloat(document.getElementById('planPrice').value);
    const description = document.getElementById('planDescription').value.trim();
    const lessons = parseInt(document.getElementById('planLessons').value);
    const duration = parseInt(document.getElementById('planDuration').value);
    const featuresText = document.getElementById('planFeatures').value.trim();
    const popular = document.getElementById('planPopular').checked;

    // Validar
    if (!name || !description || !lessons || !duration) {
        showToast('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }

    // Validar preço se não for plano free
    if (!isFree && !price) {
        showToast('Por favor, indique o preço ou marque como "Plano Free"', 'error');
        return;
    }

    // Processar features
    const features = featuresText
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

    try {
        const planData = {
            name,
            price,
            isFree,
            description,
            lessons,
            duration,
            features,
            popular,
            updatedAt: new Date().toISOString()
        };

        if (window.editingPlanId) {
            // Editar plano existente
            await updateDoc(doc(db, "plans", window.editingPlanId), planData);
            showToast('✓ Plano atualizado com sucesso!', 'success');
        } else {
            // Criar novo plano
            planData.createdAt = new Date().toISOString();
            await addDoc(collection(db, "plans"), planData);
            showToast('✓ Plano criado com sucesso!', 'success');
        }

        closePlanModal();
        await loadPlans();
    } catch (error) {
        console.error("Erro ao guardar plano:", error);
        showToast('Erro ao guardar plano: ' + error.message, 'error');
    }
}

/**
 * Editar plano
 */
function editPlan(planId) {
    openPlanModal(planId);
}

/**
 * Eliminar plano
 */
async function deletePlan(planId) {
    if (!confirm('Tem a certeza que deseja eliminar este plano?')) {
        return;
    }

    try {
        await deleteDoc(doc(db, "plans", planId));
        showToast('✓ Plano eliminado com sucesso!', 'success');
        await loadPlans();
    } catch (error) {
        console.error("Erro ao eliminar plano:", error);
        showToast('Erro ao eliminar plano: ' + error.message, 'error');
    }
}

// Verificar se estamos na página do admin
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', initAdminDashboard);
}

// Carregar planos quando abrir pricing ou admin
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('pricing.html') || 
        window.location.pathname.includes('admin.html') ||
        window.location.pathname.includes('index.html')) {
        loadPlans();
    }
});

// ========== FUNÇÕES DO PAINEL PROFESSOR ==========

/**
 * Abrir modal de nova aula
 */
function openClassModal() {
    const modal = document.getElementById('classModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de aula
 */
function closeClassModal() {
    const modal = document.getElementById('classModal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.getElementById('classForm').reset();
}

/**
 * Guardar nova aula
 */
async function saveClass(event) {
    event.preventDefault();
    
    try {
        const user = auth.currentUser;
        if (!user) {
            showToast('Deve estar logado para criar aulas', 'error');
            return;
        }

        const className = document.getElementById('className').value;
        const classDescription = document.getElementById('classDescription').value;
        const classSchedule = document.getElementById('classSchedule').value;

        // Guardar na Firestore
        await addDoc(collection(db, 'classes'), {
            professorId: user.uid,
            professorName: user.displayName || user.email,
            className: className,
            description: classDescription,
            schedule: classSchedule,
            createdAt: new Date().toISOString(),
            students: [],
            materials: [],
            assignments: []
        });

        showToast('✓ Aula criada com sucesso!', 'success');
        closeClassModal();
        loadProfessorClasses();
    } catch (error) {
        console.error('Erro ao criar aula:', error);
        showToast('Erro ao criar aula: ' + error.message, 'error');
    }
}

/**
 * Carregar aulas do professor
 */
async function loadProfessorClasses() {
    return new Promise((resolve) => {
        // Aguardar se o utilizador está autenticado
        onAuthStateChanged(auth, async (user) => {
            try {
                if (!user) {
                    resolve();
                    return;
                }

                const q = query(collection(db, 'classes'), where('professorId', '==', user.uid));
                const snapshot = await getDocs(q);
                
                const classes = [];
                snapshot.forEach(doc => {
                    classes.push({ id: doc.id, ...doc.data() });
                });

                // Atualizar contadores (com verificação de null)
                const myClassesEl = document.getElementById('myClasses');
                if (myClassesEl) myClassesEl.textContent = classes.length;
                
                const statsClassesEl = document.getElementById('statsClasses');
                if (statsClassesEl) statsClassesEl.textContent = classes.length;

                // Renderizar tabela
                const tbody = document.getElementById('classesTableBody');
                if (!tbody) {
                    resolve();
                    return;
                }

                if (classes.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">Nenhuma aula criada ainda</td></tr>';
                } else {
                    tbody.innerHTML = classes.map(cls => `
                        <tr>
                            <td>${cls.className}</td>
                            <td>${cls.description || '-'}</td>
                            <td>${(cls.students && cls.students.length) || 0}</td>
                            <td><span class="status-badge status-active">Ativa</span></td>
                            <td style="display: flex; gap: 8px;">
                                <button class="btn-small" onclick="editClass('${cls.id}')" title="Editar aula">✏️ Editar</button>
                                <button class="btn-small btn-danger" onclick="deleteClass('${cls.id}')" title="Eliminar aula">🗑️ Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                }

                // Atualizar dropdowns
                updateClassSelects(classes);
                resolve();
            } catch (error) {
                console.error('Erro ao carregar aulas:', error);
                resolve();
            }
        });
    });
}

/**
 * Atualizar dropdowns de aulas
 */
function updateClassSelects(classes) {
    const selects = document.querySelectorAll('[id$="Class"]');
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Selecionar Aula...</option>';
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.className;
            select.appendChild(option);
        });
        select.value = currentValue;
    });
}

/**
 * Eliminar aula
 */
async function deleteClass(classId) {
    openDeleteConfirmModal('Tem a certeza que deseja eliminar esta aula?', async () => {
        try {
            await deleteDoc(doc(db, 'classes', classId));
            showToast('✓ Aula eliminada com sucesso!', 'success');
            loadProfessorClasses();
        } catch (error) {
            console.error('Erro ao eliminar aula:', error);
            showToast('Erro ao eliminar aula', 'error');
        }
    });
}

/**
 * Remover aluno de uma aula
 */
async function removeStudentFromClass(studentId, classId) {
    openDeleteConfirmModal('Tem a certeza que deseja remover este aluno?', async () => {
        try {
            const classRef = doc(db, 'classes', classId);
            await updateDoc(classRef, {
                students: arrayRemove(studentId)
            });
            showToast('✓ Aluno removido com sucesso!', 'success');
            loadProfessorStudents();
        } catch (error) {
            console.error('Erro ao remover aluno:', error);
            showToast('Erro ao remover aluno', 'error');
        }
    });
}

/**
 * Ver desempenho do aluno
 */
function viewStudentGrade(studentId) {
    showToast('Abrindo desempenho do aluno...', 'info');
    // Esta função pode ser expandida no futuro para abrir um modal com detalhes do aluno
}

/**
 * Abrir modal de material
 */
function openMaterialModal() {
    const modal = document.getElementById('materialModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de material
 */
function closeMaterialModal() {
    const modal = document.getElementById('materialModal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.getElementById('materialForm').reset();
}

/**
 * Guardar material
 */
async function saveMaterial(event) {
    event.preventDefault();
    
    try {
        const materialClass = document.getElementById('materialClass').value;
        const materialTitle = document.getElementById('materialTitle').value;
        const materialType = document.getElementById('materialType').value;
        const materialUrl = document.getElementById('materialUrl').value;

        if (!materialClass) {
            showToast('Selecione uma aula', 'error');
            return;
        }

        // Adicionar material à aula
        const classRef = doc(db, 'classes', materialClass);
        await updateDoc(classRef, {
            materials: arrayUnion({
                title: materialTitle,
                type: materialType,
                url: materialUrl,
                createdAt: new Date().toISOString()
            })
        });

        showToast('✓ Material adicionado com sucesso!', 'success');
        closeMaterialModal();
    } catch (error) {
        console.error('Erro ao adicionar material:', error);
        showToast('Erro ao adicionar material', 'error');
    }
}

/**
 * Abrir modal de tarefa
 */
function openAssignmentModal() {
    const modal = document.getElementById('assignmentModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de tarefa
 */
function closeAssignmentModal() {
    const modal = document.getElementById('assignmentModal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.getElementById('assignmentForm').reset();
}

/**
 * Guardar tarefa
 */
async function saveAssignment(event) {
    event.preventDefault();
    
    try {
        const user = auth.currentUser;
        if (!user) {
            showToast('Deve estar logado', 'error');
            return;
        }

        const assignmentClass = document.getElementById('assignmentClass').value;
        const assignmentTitle = document.getElementById('assignmentTitle').value;
        const assignmentDescription = document.getElementById('assignmentDescription').value;
        const assignmentDeadline = document.getElementById('assignmentDeadline').value;

        if (!assignmentClass) {
            showToast('Selecione uma aula', 'error');
            return;
        }

        // Guardar tarefa
        await addDoc(collection(db, 'assignments'), {
            classId: assignmentClass,
            professorId: user.uid,
            title: assignmentTitle,
            description: assignmentDescription,
            deadline: assignmentDeadline,
            createdAt: new Date().toISOString(),
            submissions: []
        });

        showToast('✓ Tarefa criada com sucesso!', 'success');
        closeAssignmentModal();
        loadProfessorAssignments();
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        showToast('Erro ao criar tarefa', 'error');
    }
}

/**
 * Carregar alunos inscritos nas aulas do professor
 */
async function loadProfessorStudents() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            try {
                if (!user) {
                    resolve();
                    return;
                }

                // Carregar aulas do professor
                const classesQuery = query(collection(db, 'classes'), where('professorId', '==', user.uid));
                const classesSnapshot = await getDocs(classesQuery);
                
                const allStudents = [];
                
                // Para cada aula, obter os alunos
                for (const classDoc of classesSnapshot.docs) {
                    const classData = classDoc.data();
                    const students = classData.students || [];
                    
                    // Obter dados de cada aluno
                    for (const studentId of students) {
                        const studentDocRef = doc(db, 'users', studentId);
                        const studentDocSnap = await getDoc(studentDocRef);
                        
                        if (studentDocSnap.exists()) {
                            const studentData = studentDocSnap.data();
                            allStudents.push({
                                id: studentId,
                                nome: studentData.nome || 'N/A',
                                email: studentData.email || 'N/A',
                                aula: classData.className,
                                classId: classDoc.id,
                                status: 'Ativo',
                                media: '0%'
                            });
                        }
                    }
                }

                // Renderizar tabela
                const tbody = document.getElementById('studentsTableBody');
                if (!tbody) {
                    resolve();
                    return;
                }

                if (allStudents.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">Nenhum aluno inscrito</td></tr>';
                } else {
                    tbody.innerHTML = allStudents.map(student => `
                        <tr>
                            <td>${student.nome}</td>
                            <td>${student.email}</td>
                            <td>${student.aula}</td>
                            <td><span class="status-badge status-active">Ativo</span></td>
                            <td>${student.media}</td>
                            <td style="display: flex; gap: 8px;">
                                <button class="btn-small" onclick="viewStudentGrade('${student.id}')" title="Ver desempenho">👁️ Ver</button>
                                <button class="btn-small btn-danger" onclick="removeStudentFromClass('${student.id}', '${student.classId}')" title="Remover aluno">🗑️ Remover</button>
                            </td>
                        </tr>
                    `).join('');
                }

                resolve();
            } catch (error) {
                console.error('Erro ao carregar alunos:', error);
                resolve();
            }
        });
    });
}

/**
 * Carregar tarefas do professor
 */
async function loadProfessorAssignments() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, 'assignments'), where('professorId', '==', user.uid));
        const snapshot = await getDocs(q);
        
        const assignments = [];
        snapshot.forEach(doc => {
            assignments.push({ id: doc.id, ...doc.data() });
        });

        const activeAssignmentsEl = document.getElementById('activeAssignments');
        if (activeAssignmentsEl) activeAssignmentsEl.textContent = assignments.length;

        const tbody = document.getElementById('assignmentsTableBody');
        if (!tbody) return;

        if (assignments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">Nenhuma tarefa criada</td></tr>';
        } else {
            tbody.innerHTML = assignments.map(assignment => `
                <tr>
                    <td>${assignment.title}</td>
                    <td>${assignment.classId}</td>
                    <td>${assignment.deadline}</td>
                    <td>${(assignment.submissions && assignment.submissions.length) || 0}</td>
                    <td><span class="status-badge status-active">Ativa</span></td>
                    <td style="display: flex; gap: 8px;">
                        <button class="btn-small" onclick="viewAssignment('${assignment.id}')" title="Ver tarefa">👁️ Ver</button>
                        <button class="btn-small btn-danger" onclick="deleteAssignment('${assignment.id}')" title="Eliminar tarefa">🗑️ Eliminar</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}

/**
 * Eliminar tarefa
 */
async function deleteAssignment(assignmentId) {
    openDeleteConfirmModal('Tem a certeza que deseja eliminar esta tarefa?', async () => {
        try {
            await deleteDoc(doc(db, 'assignments', assignmentId));
            showToast('✓ Tarefa eliminada com sucesso!', 'success');
            loadProfessorAssignments();
        } catch (error) {
            console.error('Erro ao eliminar tarefa:', error);
            showToast('Erro ao eliminar tarefa', 'error');
        }
    });
}

/**
 * Configurar tab switching para professor
 */
document.addEventListener('DOMContentLoaded', function() {
    // Se estamos no painel (professor ou aluno)
    // Tab switching específico por tipo de utilizador está mais abaixo
});

// ========== FUNÇÕES DO PAINEL ALUNO ==========

/**
 * Abrir modal de detalhe da aula
 */
function openClassDetailModal(classId) {
    const modal = document.getElementById('classDetailModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de detalhe da aula
 */
function closeClassDetailModal() {
    const modal = document.getElementById('classDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Abrir modal de detalhe da tarefa
 */
function openAssignmentDetailModal(assignmentId) {
    const modal = document.getElementById('assignmentDetailModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de detalhe da tarefa
 */
function closeAssignmentDetailModal() {
    const modal = document.getElementById('assignmentDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Carregar aulas inscritas do aluno
 */
async function loadStudentClasses() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        // Buscar aulas onde o aluno está inscrito
        const q = query(collection(db, 'classes'));
        const snapshot = await getDocs(q);
        
        const enrolledClasses = [];
        const availableClasses = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const classData = { id: doc.id, ...data };
            
            // Verificar se o aluno está inscrito nesta aula
            if (data.students && data.students.includes(user.uid)) {
                enrolledClasses.push(classData);
            } else {
                // Se não está inscrito, é uma aula disponível
                availableClasses.push(classData);
            }
        });

        // Atualizar contadores (com verificação de null)
        const enrolledClassesEl = document.getElementById('enrolledClasses');
        if (enrolledClassesEl) enrolledClassesEl.textContent = enrolledClasses.length;
        
        const statsEnrolledEl = document.getElementById('statsEnrolled');
        if (statsEnrolledEl) statsEnrolledEl.textContent = enrolledClasses.length;

        // Renderizar aulas inscritas
        const tbody = document.getElementById('classesTableBody');
        if (tbody) {
            if (enrolledClasses.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">Não está inscrito em nenhuma aula</td></tr>';
            } else {
                tbody.innerHTML = enrolledClasses.map(cls => {
                    const progress = 50; // Placeholder
                    return `
                        <tr>
                            <td>${cls.className}</td>
                            <td>${cls.professorName || '-'}</td>
                            <td>
                                <div style="background: #f0f0f0; border-radius: 4px; overflow: hidden; height: 20px; min-width: 80px;">
                                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                                </div>
                            </td>
                            <td><span class="status-badge status-active">Ativa</span></td>
                            <td style="display: flex; gap: 8px;">
                                <button class="btn-small" onclick="openClassDetailModal('${cls.id}')" title="Ver detalhes">👁️ Ver</button>
                                <button class="btn-small btn-danger" onclick="unenrollClass('${cls.id}')" title="Sair da aula">🚪 Sair</button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // Renderizar aulas disponíveis
        const availableBody = document.getElementById('availableClassesTableBody');
        if (availableBody) {
            if (availableClasses.length === 0) {
                availableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">Todas as aulas disponíveis já estão inscritas</td></tr>';
            } else {
                availableBody.innerHTML = availableClasses.map(cls => `
                    <tr>
                        <td>${cls.className}</td>
                        <td>${cls.professorName || '-'}</td>
                        <td>${cls.schedule || '-'}</td>
                        <td>${cls.description || '-'}</td>
                        <td style="display: flex; gap: 8px;">
                            <button class="btn-small" onclick="enrollClass('${cls.id}')" title="Inscrever-se" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white;">✏️ Inscrever</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Erro ao carregar aulas:', error);
    }
}

/**
 * Inscrever aluno numa aula
 */
async function enrollClass(classId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            showToast('Deve estar logado para se inscrever', 'error');
            return;
        }

        const classRef = doc(db, 'classes', classId);
        
        // Adicionar o aluno ao array de students
        await updateDoc(classRef, {
            students: arrayUnion(user.uid)
        });

        showToast('✓ Inscrito na aula com sucesso!', 'success');
        loadStudentClasses();
    } catch (error) {
        console.error('Erro ao inscrever:', error);
        showToast('Erro ao inscrever: ' + error.message, 'error');
    }
}

/**
 * Sair de uma aula
 */
async function unenrollClass(classId) {
    if (confirm('Tem a certeza que deseja sair desta aula?')) {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const classRef = doc(db, 'classes', classId);
            
            // Remover o aluno do array de students
            await updateDoc(classRef, {
                students: arrayRemove(user.uid)
            });

            showToast('✓ Saiu da aula com sucesso!', 'success');
            loadStudentClasses();
        } catch (error) {
            console.error('Erro ao sair da aula:', error);
            showToast('Erro ao sair da aula', 'error');
        }
    }
}

/**
 * Carregar tarefas do aluno
 */
async function loadStudentAssignments() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, 'assignments'));
        const snapshot = await getDocs(q);
        
        const assignments = [];
        snapshot.forEach(doc => {
            assignments.push({ id: doc.id, ...doc.data() });
        });

        document.getElementById('pendingAssignments').textContent = assignments.length;
        document.getElementById('statsPending').textContent = assignments.length;

        const tbody = document.getElementById('assignmentsTableBody');
        if (!tbody) return;

        if (assignments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">Nenhuma tarefa atribuída</td></tr>';
        } else {
            tbody.innerHTML = assignments.map(assignment => `
                <tr>
                    <td>${assignment.title}</td>
                    <td>${assignment.classId}</td>
                    <td>${assignment.deadline}</td>
                    <td><span class="status-badge status-pending">Pendente</span></td>
                    <td>-</td>
                    <td style="display: flex; gap: 8px;">
                        <button class="btn-small" onclick="openAssignmentDetailModal('${assignment.id}')" title="Ver detalhes">👁️ Ver</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}

/**
 * Carregar notas do aluno
 */
async function loadStudentGrades() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) return;

        const tbody = document.getElementById('gradesTableBody');
        if (!tbody) return;

        // Placeholder para notas
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">Nenhuma nota registada</td></tr>';
    } catch (error) {
        console.error('Erro ao carregar notas:', error);
    }
}

/**
 * Configurar tab switching para aluno
 */
document.addEventListener('DOMContentLoaded', function() {
    // Se estamos na página de minhas aulas (aluno)
    if (document.getElementById('dashboard') && document.getElementById('calendar') && document.getElementById('studentCalendarTableBody')) {
        // Página de aluno - Minhas Aulas simplificada (apenas Dashboard, Calendário e Vídeo Aulas)
        
        // Aguardar um pequeno atraso para garantir que checkAuthStatus foi executado
        setTimeout(function() {
            // Desabilitar calendário e mensagens para FreesubscriptionPlan
            const calendarBtn = document.querySelector('[data-tab="calendar"]');
            const messagesBtn = document.querySelector('[data-tab="messages"]');
            
            if (currentUserSubscription === 'FreesubscriptionPlan') {
                if (calendarBtn) {
                    calendarBtn.style.opacity = '0.5';
                    calendarBtn.style.cursor = 'not-allowed';
                    calendarBtn.title = 'Funcionalidade não disponível no plano gratuito';
                }
                if (messagesBtn) {
                    messagesBtn.style.opacity = '0.5';
                    messagesBtn.style.cursor = 'not-allowed';
                    messagesBtn.title = 'Funcionalidade não disponível no plano gratuito';
                }
            }
        }, 500);
        
        document.querySelectorAll('.admin-menu-item').forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                // Bloquear acesso a calendário e mensagens para FreesubscriptionPlan
                if (currentUserSubscription === 'FreesubscriptionPlan' && (tabName === 'calendar' || tabName === 'messages')) {
                    openRestrictedAccessModal();
                    return;
                }
                
                document.querySelectorAll('.admin-menu-item').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(tabName).classList.add('active');

                // Carregar dados quando abrir tabs
                if (tabName === 'calendar') {
                    loadStudentVideoCalls();
                } else if (tabName === 'videoaulas') {
                    loadStudentVideoAulas();
                } else if (tabName === 'fichas') {
                    loadStudentFichas();
                } else if (tabName === 'messages') {
                    loadStudentMessages();
                }
            });
        });

        // Carregar dados iniciais
        // Página simplificada - apenas Dashboard, Calendário e Vídeo Aulas
        // Não carregamos dados aqui - apenas quando as tabs são abertas
    }
});

/**
 * Funções para Modal de Confirmação de Eliminação (Professor)
 */

let deleteConfirmCallback = null;

/**
 * Abrir modal de confirmação de eliminação
 */
function openDeleteConfirmModal(message, callback) {
    const modal = document.getElementById('deleteConfirmModal');
    const messageEl = document.getElementById('deleteConfirmMessage');
    
    if (modal && messageEl) {
        messageEl.textContent = message;
        deleteConfirmCallback = callback;
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de confirmação
 */
function closeDeleteConfirmModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        deleteConfirmCallback = null;
    }
}

// Listener para tabs de professor
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('messages') && document.getElementById('messagesList')) {
        // Página de professor
        const buttons = document.querySelectorAll('.admin-menu-item');
        if (buttons.length > 0) {
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    const tabName = this.getAttribute('data-tab');
                    
                    buttons.forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
                    
                    this.classList.add('active');
                    const tabEl = document.getElementById(tabName);
                    if (tabEl) tabEl.classList.add('active');

                    // Carregar dados quando abrir tabs do professor
                    if (tabName === 'messages' && typeof loadProfessorMessages === 'function') {
                        loadProfessorMessages();
                        loadPendingReplies();
                    } else if (tabName === 'fichas' && typeof loadProfessorFichas === 'function') {
                        loadProfessorFichas();
                    }
                });
            });
        }
    }
});

/**
 * Confirmar eliminação
 */
async function confirmDelete() {
    if (deleteConfirmCallback && typeof deleteConfirmCallback === 'function') {
        await deleteConfirmCallback();
    }
    closeDeleteConfirmModal();
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(event) {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal && event.target === modal) {
        closeDeleteConfirmModal();
    }
});

// ========== FUNÇÕES PARA AGENDAMENTO DE VIDEOCHAMADAS ==========

// Variáveis globais para videochamadas
let videoCalls = [];
let currentCalendarDate = new Date();
let currentUser = null; // Utilizador atualmente autenticado
let currentUserClasses = []; // Aulas do utilizador atual
let currentUserSubscription = null; // Subscrição atual do utilizador

// Abrir modal do calendário
function openCalendarModal() {
    // Esta função não é mais necessária
}

// Fechar modal do calendário
function closeCalendarModal() {
    // Esta função não é mais necessária
}

// Carregar e contar mensagens com respostas pendentes
async function loadPendingReplies() {
    if (!db) return;

    try {
        // Buscar todas as mensagens (sem filtro por professor)
        const q = query(collection(db, 'messages'));
        const querySnapshot = await getDocs(q);

        let pendingCount = 0;
        querySnapshot.forEach(doc => {
            const msg = doc.data();
            // Contar mensagens que não têm resposta (sem campo 'reply') ou que estão não lidas
            if (!msg.reply || msg.status === 'unread') {
                pendingCount++;
            }
        });

        // Atualizar o contador na interface
        const pendingRepliesEl = document.getElementById('pendingReplies');
        if (pendingRepliesEl) {
            pendingRepliesEl.textContent = pendingCount;
        }
    } catch (error) {
        console.error('Erro ao carregar respostas pendentes:', error);
    }
}

// Carregar videochamadas do Firestore
async function loadVideoCalls() {
    if (!currentUser || !db) return;
    
    try {
        const q = query(collection(db, 'videoCalls'), where('professorId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        videoCalls = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            videoCalls.push({
                id: doc.id,
                ...data
            });
        });
        
        // Renderizar calendário após carregar dados
        if (document.getElementById('calendarTableBody')) {
            renderCalendarModal(currentCalendarDate);
        }
    } catch (error) {
        console.error('Erro ao carregar videochamadas:', error);
    }
}

// Renderizar calendário no modal
function renderCalendarModal(date) {
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Atualizar header
    document.getElementById('calendarMonthYear').textContent = `${monthNames[month]} ${year}`;
    
    // Gerar dias do calendário
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    let tableHTML = '';
    let dayCounter = 1;
    const today = new Date();
    
    // Gerar 6 linhas (semanas)
    for (let week = 0; week < 6; week++) {
        tableHTML += '<tr style="height: 120px;">';
        
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            const cellIndex = week * 7 + dayOfWeek;
            
            if (cellIndex < startingDayOfWeek) {
                // Dias do mês anterior
                tableHTML += '<td style="border: 1px solid #ddd; background: #f9f9f9; padding: 8px; vertical-align: top; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background=\'#f0f0f0\'" onmouseout="this.style.background=\'#f9f9f9\'"></td>';
            } else if (dayCounter <= daysInMonth) {
                // Dias do mês atual
                const cellDate = new Date(year, month, dayCounter);
                const isToday = cellDate.toDateString() === today.toDateString();
                
                // Filtrar eventos para este dia - com melhor tratamento de datas
                const dayEvents = videoCalls.filter(call => {
                    // Tentar múltiplos formatos de data
                    let eventDate;
                    
                    if (typeof call.date === 'string') {
                        // Formato: YYYY-MM-DD (do input type="date")
                        eventDate = new Date(call.date + 'T00:00:00');
                    } else if (call.date instanceof Date) {
                        eventDate = call.date;
                    } else if (call.date.toDate && typeof call.date.toDate === 'function') {
                        // Timestamp do Firestore
                        eventDate = call.date.toDate();
                    } else {
                        try {
                            eventDate = new Date(call.date);
                        } catch(e) {
                            return false;
                        }
                    }
                    
                    return eventDate.toDateString() === cellDate.toDateString();
                });
                
                let eventsHTML = '';
                dayEvents.forEach(event => {
                    eventsHTML += `<div style="background: #667eea; color: white; border-radius: 4px; padding: 4px 6px; font-size: 0.7rem; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; cursor: pointer; transition: all 0.2s;" onclick="event.stopPropagation(); showVideoCallDetails('${event.id}')" onmouseover="this.style.background='#5568d3'" onmouseout="this.style.background='#667eea'" title="${event.title || event.className}">
                        <strong>${event.title || event.className}</strong><br/>
                        <span>${event.time}</span><br/>
                        <span style="font-size: 0.65rem; opacity: 0.9;">${event.link ? '🔗' : ''}</span>
                    </div>`;
                });
                
                const bgColor = isToday ? '#e3f2fd' : '#ffffff';
                const borderColor = isToday ? '#667eea' : '#ddd';
                const borderWidth = isToday ? '2px' : '1px';
                
                tableHTML += `<td style="border: ${borderWidth} solid ${borderColor}; background: ${bgColor}; padding: 8px; vertical-align: top; cursor: pointer; transition: all 0.3s; overflow-y: auto;" onclick="openVideoCallModalWithDate('${year}-${String(month + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}')" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='${bgColor}'">
                    <div style="font-weight: bold; color: #333; margin-bottom: 6px; font-size: 0.95rem;">${dayCounter}</div>
                    <div style="font-size: 0.8rem; overflow-y: auto; max-height: 95px;">
                        ${eventsHTML}
                    </div>
                </td>`;
                
                dayCounter++;
            } else {
                // Dias do próximo mês
                tableHTML += '<td style="border: 1px solid #ddd; background: #f9f9f9; padding: 8px; vertical-align: top; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background=\'#f0f0f0\'" onmouseout="this.style.background=\'#f9f9f9\'"></td>';
            }
        }
        
        tableHTML += '</tr>';
        
        if (dayCounter > daysInMonth) break;
    }
    
    document.getElementById('calendarTableBody').innerHTML = tableHTML;
}

// Navegar mês anterior
window.previousCalendarMonth = function() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendarModal(currentCalendarDate);
};

// Navegar próximo mês
window.nextCalendarMonth = function() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendarModal(currentCalendarDate);
};

// Inicializar o calendário na sidebar (removido - agora é modal)
function initializeCalendar() {
    // Função vazia - calendário agora abre em modal
}

// Abrir modal de videochamada
function openVideoCallModal() {
    document.getElementById('videoCallModal').style.display = 'flex';
    loadClassesForVideoCall();
}

// Abrir modal com data preenchida ao clicar no calendário
function openVideoCallModalWithDate(dateStr) {
    document.getElementById('videoCallModal').style.display = 'flex';
    document.getElementById('videoCallDate').value = dateStr;
    loadPlansForVideoCall();
}

// Fechar modal de videochamada
function closeVideoCallModal() {
    document.getElementById('videoCallModal').style.display = 'none';
    document.getElementById('videoCallForm').reset();
}

// Carregar planos para o select
async function loadPlansForVideoCall() {
    const select = document.getElementById('videoCallPlan');
    if (!select) return;
    
    select.innerHTML = '<option value="">Carregando planos...</option>';
    
    try {
        // Buscar todos os planos da coleção
        const querySnapshot = await getDocs(collection(db, 'plans'));
        const plans = [];
        
        querySnapshot.forEach(doc => {
            const plan = doc.data();
            plans.push({ id: doc.id, name: plan.name });
        });

        // Preencher select
        select.innerHTML = '<option value="">Selecionar Plano...</option>';
        plans.forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.id;
            option.setAttribute('data-name', plan.name); // Guardar nome como atributo
            option.textContent = plan.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar planos:', error);
        select.innerHTML = '<option value="">Erro ao carregar planos</option>';
    }
}

// Carregar aulas para o select (função antiga - mantida para compatibilidade)
function loadClassesForVideoCall() {
    loadPlansForVideoCall();
}

// Guardar videochamada
function saveVideoCall(event) {
    event.preventDefault();
    
    const planSelect = document.getElementById('videoCallPlan');
    const selectedPlan = planSelect.value;
    const selectedOption = planSelect.options[planSelect.selectedIndex];
    const selectedPlanName = selectedOption.getAttribute('data-name') || selectedOption.text;
    
    if (!selectedPlan) {
        alert('Por favor, selecione um tipo de aula');
        return;
    }
    
    const videoCall = {
        id: Date.now().toString(),
        title: document.getElementById('videoCallTitle').value,
        className: selectedPlanName,
        classId: selectedPlan,
        subscriptionPlan: selectedPlanName, // Guardar o NOME do plano, não o ID
        date: document.getElementById('videoCallDate').value,
        time: document.getElementById('videoCallTime').value,
        duration: document.getElementById('videoCallDuration').value,
        link: document.getElementById('videoCallLink').value,
        description: document.getElementById('videoCallDescription').value,
        status: 'agendada'
    };
    
    console.log('Salvando videochamada:', {
        titulo: videoCall.title,
        planoId: selectedPlan,
        planoNome: selectedPlanName,
        subscriptionPlan: videoCall.subscriptionPlan
    }); // DEBUG
    
    videoCalls.push(videoCall);
    
    // Guardar em Firestore
    if (currentUser && db) {
        const db_ref = doc(db, 'videoCalls', videoCall.id);
        setDoc(db_ref, {
            ...videoCall,
            professorId: currentUser.uid,
            createdAt: new Date(),
            updatedAt: new Date()
        }).then(() => {
            console.log('Videochamada guardada com sucesso:', videoCall.subscriptionPlan); // DEBUG
            renderVideoCallsTable();
            if (document.getElementById('calendarTableBody')) {
                renderCalendarModal(currentCalendarDate);
            }
            closeVideoCallModal();
            showToast('✓ Videochamada agendada com sucesso!', 'success');
        }).catch(err => {
            console.error('Erro ao guardar videochamada:', err);
            showToast('❌ Erro ao agendar videochamada: ' + err.message, 'error');
        });
    } else {
        showToast('Por favor, faça login para agendar videochamadas', 'error');
    }

}

// Renderizar tabela de videochamadas
function renderVideoCallsTable() {
    const tbody = document.getElementById('videoCallsTableBody');
    
    // Se não existir tabela, apenas retornar (o calendário renderizará os eventos)
    if (!tbody) {
        return;
    }
    
    if (videoCalls.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">Nenhuma videochamada agendada</td></tr>';
        return;
    }
    
    tbody.innerHTML = videoCalls
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(call => `
            <tr>
                <td>${call.className}</td>
                <td>${new Date(call.date).toLocaleDateString('pt-PT')}</td>
                <td>${call.time}</td>
                <td><a href="${call.link}" target="_blank" style="color: #667eea;">Abrir Reunião</a></td>
                <td>0</td>
                <td><span style="background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.9em;">${call.status}</span></td>
                <td>
                    <button onclick="editVideoCall('${call.id}')" style="background: #667eea; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Editar</button>
                    <button onclick="deleteVideoCall('${call.id}')" style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Eliminar</button>
                </td>
            </tr>
        `).join('');
}

// Editar videochamada
window.editVideoCall = function(id) {
    const call = videoCalls.find(c => c.id === id);
    if (call) {
        document.getElementById('videoCallTitle').value = call.title;
        document.getElementById('videoCallPlan').value = call.classId;
        document.getElementById('videoCallDate').value = call.date;
        document.getElementById('videoCallTime').value = call.time;
        document.getElementById('videoCallDuration').value = call.duration;
        document.getElementById('videoCallLink').value = call.link;
        document.getElementById('videoCallDescription').value = call.description;
        
        openVideoCallModal();
        // Remove o antigo antes de guardar o novo
        videoCalls = videoCalls.filter(c => c.id !== id);
    }
};

// Eliminar videochamada
window.deleteVideoCall = function(id) {
    if (confirm('Tem a certeza que deseja eliminar esta videochamada?')) {
        videoCalls = videoCalls.filter(c => c.id !== id);
        
        // Eliminar do Firestore
        if (db) {
            deleteDoc(doc(db, 'videoCalls', id))
                .then(() => {
                    renderVideoCallsTable();
                    if (document.getElementById('calendarTableBody')) {
                        renderCalendarModal(currentCalendarDate);
                    }
                })
                .catch(err => console.error('Erro ao eliminar videochamada:', err));
        }
    }
};

// Mostrar detalhes da videochamada e permitir eliminar
window.showVideoCallDetails = function(id) {
    const call = videoCalls.find(c => c.id === id);
    if (!call) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    const callDate = new Date(call.date).toLocaleDateString('pt-PT');
    
    content.innerHTML = `
        <h2 style="margin-top: 0; color: #333;">${call.title || call.className}</h2>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>📚 Tipo de Plano:</strong> <span style="background: #667eea; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.9em;">${call.subscriptionPlan || call.className}</span></p>
            <p style="margin: 8px 0;"><strong>📅 Data:</strong> ${callDate}</p>
            <p style="margin: 8px 0;"><strong>⏰ Hora:</strong> ${call.time}</p>
            <p style="margin: 8px 0;"><strong>⏱️ Duração:</strong> ${call.duration} minutos</p>
            ${call.link ? `<p style="margin: 8px 0;"><strong>🔗 Link:</strong> <a href="${call.link}" target="_blank" style="color: #667eea;">${call.link}</a></p>` : ''}
            ${call.description ? `<p style="margin: 8px 0;"><strong>📝 Descrição:</strong> ${call.description}</p>` : ''}
            <p style="margin: 8px 0;"><strong>Status:</strong> <span style="background: #4CAF50; color: white; padding: 2px 8px; border-radius: 4px;">${call.status}</span></p>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="closeDetailsBtn" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem;">Fechar</button>
            <a href="${call.link}" target="_blank" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem; text-decoration: none; display: inline-block;">Abrir Reunião</a>
            <button id="deleteDetailsBtn" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem;">🗑️ Eliminar</button>
        </div>
    `;
    
    modal.appendChild(content);
    
    // Fechar ao clicar no botão Fechar
    const closeBtn = content.querySelector('#closeDetailsBtn');
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    // Eliminar ao clicar no botão Eliminar
    const deleteBtn = content.querySelector('#deleteDetailsBtn');
    deleteBtn.addEventListener('click', function() {
        openDeleteConfirmModal('Tem a certeza que deseja eliminar esta videochamada?', async () => {
            await deleteVideoCall(id);
            modal.remove();
        });
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
};

// Exportar funções globalmente
window.openClassModal = openClassModal;
window.closeClassModal = closeClassModal;
window.saveClass = saveClass;
window.deleteClass = deleteClass;
window.openMaterialModal = openMaterialModal;
window.closeMaterialModal = closeMaterialModal;
window.openAssignmentModal = openAssignmentModal;
window.closeAssignmentModal = closeAssignmentModal;
window.saveAssignment = saveAssignment;
window.deleteAssignment = deleteAssignment;
window.openClassDetailModal = openClassDetailModal;
window.closeClassDetailModal = closeClassDetailModal;
window.openAssignmentDetailModal = openAssignmentDetailModal;
window.closeAssignmentDetailModal = closeAssignmentDetailModal;
window.saveMaterial = saveMaterial;
window.openAssignmentModal = openAssignmentModal;
window.closeAssignmentModal = closeAssignmentModal;
window.saveAssignment = saveAssignment;
window.deleteAssignment = deleteAssignment;
window.enrollClass = enrollClass;
window.unenrollClass = unenrollClass;
window.loadProfessorStudents = loadProfessorStudents;
window.removeStudentFromClass = removeStudentFromClass;
window.viewStudentGrade = viewStudentGrade;
window.openDeleteConfirmModal = openDeleteConfirmModal;
window.closeDeleteConfirmModal = closeDeleteConfirmModal;
window.confirmDelete = confirmDelete;
window.openVideoCallModal = openVideoCallModal;
window.openVideoCallModalWithDate = openVideoCallModalWithDate;
window.closeVideoCallModal = closeVideoCallModal;
window.saveVideoCall = saveVideoCall;
window.openCalendarModal = openCalendarModal;
window.loadStudentVideoAulas = loadStudentVideoAulas;
window.openVideoAulaDetail = openVideoAulaDetail;
window.loadVideosFromStorage = loadVideosFromStorage;
window.playVideo = playVideo;
window.sendMessage = sendMessage;
window.loadStudentMessages = loadStudentMessages;
window.loadProfessorMessages = loadProfessorMessages;
window.selectMessage = selectMessage;
window.replyToMessage = replyToMessage;
window.selectStudentMessage = selectStudentMessage;
window.openSendMessageModal = openSendMessageModal;
window.closeSendMessageModal = closeSendMessageModal;
window.sendMessageFromModal = sendMessageFromModal;
window.openReplyModal = openReplyModal;
window.closeReplyModal = closeReplyModal;
window.sendReplyFromModal = sendReplyFromModal;

// Listener para preview da imagem do modal de resposta
function initReplyModalImageListener() {
    const replyImageInput = document.getElementById('replyImageModal');
    if (replyImageInput) {
        replyImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('replyImagePreviewModal').innerHTML = `
                        <img src="${event.target.result}" style="max-width: 100%; max-height: 150px; border-radius: 6px; border: 2px solid #e0e0e0; margin-top: 10px;" />
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Chamar quando script carregar
initReplyModalImageListener();

// ========== FUNÇÕES PARA MENSAGENS COM PROFESSOR ==========

async function sendMessage() {
    try {
        const sendBtn = document.querySelector('.messages-container ~ button');
        
        // Desativar botão e mostrar loading
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.textContent = '⏳ Enviando...';
        }

        const user = auth.currentUser;
        if (!user) {
            showToast('Deve estar logado para enviar mensagens', 'error');
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.textContent = 'Enviar';
            }
            return;
        }

        const messageText = document.getElementById('messageText').value.trim();
        const messageImage = document.getElementById('messageImage');
        
        if (!messageText && !messageImage.files[0]) {
            showToast('Por favor, escreva uma mensagem ou selecione uma imagem', 'error');
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.textContent = 'Enviar';
            }
            return;
        }

        let imageUrl = null;
        
        // Se houver imagem, fazer upload
        if (messageImage.files[0]) {
            const file = messageImage.files[0];
            
            // Validar tipo
            if (!file.type.startsWith('image/')) {
                showToast('Por favor, selecione uma imagem', 'error');
                if (sendBtn) {
                    sendBtn.disabled = false;
                    sendBtn.textContent = 'Enviar';
                }
                return;
            }
            
            // Validar tamanho (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('A imagem deve ter menos de 5MB', 'error');
                if (sendBtn) {
                    sendBtn.disabled = false;
                    sendBtn.textContent = 'Enviar';
                }
                return;
            }

            // Upload para Storage
            const fileName = `messages/${user.uid}/${Date.now()}_${file.name}`;
            const fileRef = ref(storage, fileName);
            await uploadBytes(fileRef, file);
            imageUrl = await getDownloadURL(fileRef);
        }

        // Guardar mensagem no Firestore
        const messagesRef = collection(db, 'messages');
        await addDoc(messagesRef, {
            studentId: user.uid,
            studentEmail: user.email,
            studentName: (await getDoc(doc(db, 'users', user.uid))).data().nome || user.email,
            message: messageText,
            imageUrl: imageUrl,
            createdAt: new Date().toISOString(),
            status: 'unread'
        });

        // Limpar inputs
        document.getElementById('messageText').value = '';
        document.getElementById('messageImage').value = '';
        document.getElementById('imagePreview').innerHTML = '';
        
        // Restaurar botão
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Enviar';
        }
        
        showToast('✓ Mensagem enviada com sucesso!', 'success');
        
        // Recarregar mensagens
        loadStudentMessages();
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        
        // Restaurar botão em caso de erro
        const sendBtn = document.querySelector('.messages-container ~ button');
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Enviar';
        }
        
        showToast('❌ Erro ao enviar mensagem: ' + error.message, 'error');
    }
}

async function loadStudentMessages() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        // Buscar todas as mensagens do utilizador
        const q = query(collection(db, 'messages'), where('studentId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const studentMessagesList = document.getElementById('studentMessagesList');
        const studentMessageDetail = document.getElementById('studentMessageDetail');
        
        if (querySnapshot.empty) {
            studentMessagesList.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Nenhuma mensagem</p>';
            studentMessageDetail.innerHTML = '<div style="flex: 1; display: flex; align-items: center; justify-content: center;"><p style="text-align: center; color: #999;">Seleccione uma mensagem ou envie uma nova</p></div>';
            return;
        }

        let messages = [];
        
        querySnapshot.forEach(doc => {
            const msg = doc.data();
            msg.id = doc.id;
            messages.push(msg);
        });

        // Ordenar por data (mais recentes primeiro)
        messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Carregar lista
        let html = '';
        messages.forEach(msg => {
            const date = new Date(msg.createdAt);
            const dateStr = date.toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' });
            const timeStr = date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
            const statusBg = msg.status === 'unread' ? '#ff9800' : '#4CAF50';
            const statusText = msg.status === 'unread' ? '⏳' : '✓';
            
            html += `
                <div onclick="selectStudentMessage('${msg.id}')" style="padding: 12px; border-bottom: 1px solid #ddd; cursor: pointer; background: ${msg.status === 'unread' ? '#fff3e0' : '#f5f5f5'}; transition: background 0.3s;" onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background='${msg.status === 'unread' ? '#fff3e0' : '#f5f5f5'}'">
                    <div style="font-weight: bold; font-size: 0.85em; color: #333; margin-bottom: 4px;">Sua pergunta</div>
                    <div style="font-size: 0.8em; color: #666; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${msg.message.substring(0, 35)}...</div>
                    <div style="font-size: 0.75em; color: #999; display: flex; justify-content: space-between;">
                        <span>${dateStr} ${timeStr}</span>
                        <span style="background: ${statusBg}; color: white; padding: 2px 6px; border-radius: 2px; font-weight: bold;">${statusText}</span>
                    </div>
                </div>
            `;
        });

        studentMessagesList.innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
    }
}

function selectStudentMessage(messageId) {
    const docRef = doc(db, 'messages', messageId);
    getDoc(docRef).then(docSnap => {
        if (!docSnap.exists()) return;
        
        const msg = docSnap.data();
        const date = new Date(msg.createdAt);
        const dateStr = date.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

        const studentMessageDetail = document.getElementById('studentMessageDetail');
        studentMessageDetail.innerHTML = `
            <div style="flex: 1; overflow-y: auto; margin-bottom: 20px; padding-right: 10px;">
                <!-- Sua Pergunta -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                    <div style="font-weight: bold; margin-bottom: 12px; display: flex; align-items: center;">
                        <span style="font-size: 1.3em; margin-right: 10px;">📝</span>Sua Pergunta
                    </div>
                    <p style="margin: 12px 0; line-height: 1.6; font-size: 1em;">${msg.message}</p>
                    ${msg.imageUrl ? `<img src="${msg.imageUrl}" alt="Imagem" style="max-width: 100%; max-height: 250px; border-radius: 8px; margin-top: 12px; border: 2px solid rgba(255,255,255,0.3);" />` : ''}
                    <div style="margin-top: 12px; font-size: 0.85em; color: rgba(255,255,255,0.8); display: flex; justify-content: space-between; align-items: center;">
                        <span>📅 ${dateStr} às ${timeStr}</span>
                        <span style="background: ${msg.status === 'unread' ? '#ff6b6b' : '#4CAF50'}; padding: 4px 10px; border-radius: 12px; margin-left: 10px; font-weight: bold;">${msg.status === 'unread' ? '⏳ À espera' : '✓ Respondida'}</span>
                    </div>
                </div>
                
                ${msg.reply ? `
                    <!-- Resposta do Professor -->
                    <div style="background: #f0f9ff; border-left: 4px solid #4CAF50; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="font-weight: bold; color: #4CAF50; margin-bottom: 10px; display: flex; align-items: center;">
                            <span style="font-size: 1.3em; margin-right: 10px;">👨‍🏫</span>Resposta do Professor
                        </div>
                        <p style="color: #333; margin: 8px 0; line-height: 1.6;">${msg.reply}</p>
                        ${msg.replyImageUrl ? `<img src="${msg.replyImageUrl}" alt="Resposta com imagem" style="max-width: 100%; max-height: 200px; border-radius: 6px; margin-top: 10px;" />` : ''}
                        <div style="font-size: 0.85em; color: #999; margin-top: 8px;">
                            ${msg.replyDate ? new Date(msg.replyDate).toLocaleDateString('pt-PT') + ' às ' + new Date(msg.replyDate).toLocaleTimeString('pt-PT') : ''}
                        </div>
                    </div>
                ` : ''}
            </div>

            <div style="border-top: 2px solid #f0f0f0; padding-top: 15px;">
                <button class="btn-primary" onclick="openSendMessageModal()" style="padding: 11px 24px; font-size: 1em; width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white; cursor: pointer; border-radius: 6px; font-weight: bold; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    ✉️ Enviar Nova Mensagem
                </button>
            </div>
        `;
    }).catch(error => console.error('Erro ao carregar mensagem:', error));
}

function openSendMessageModal() {
    const modal = document.getElementById('sendMessageModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('modalMessageText').focus();
    }
}

function closeSendMessageModal() {
    const modal = document.getElementById('sendMessageModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('modalMessageText').value = '';
        document.getElementById('modalMessageImage').value = '';
        document.getElementById('modalImagePreview').innerHTML = '';
    }
}

/**
 * Abrir modal de acesso restrito (plano gratuito)
 */
function openRestrictedAccessModal() {
    const modal = document.getElementById('restrictedAccessModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de acesso restrito
 */
function closeRestrictedAccessModal() {
    const modal = document.getElementById('restrictedAccessModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Redirecionar para página de pricing
 */
function redirectToPricing() {
    closeRestrictedAccessModal();
    window.location.href = 'pricing.html';
}

async function sendMessageFromModal() {
    try {
        const user = auth.currentUser;
        if (!user) {
            showToast('Deve estar logado para enviar mensagens', 'error');
            return;
        }

        const messageText = document.getElementById('modalMessageText').value.trim();
        const messageImage = document.getElementById('modalMessageImage');
        
        if (!messageText && !messageImage.files[0]) {
            showToast('Por favor, escreva uma mensagem ou selecione uma imagem', 'error');
            return;
        }

        const sendBtn = document.querySelector('.modal-footer .btn-primary');
        sendBtn.disabled = true;
        sendBtn.textContent = '⏳ Enviando...';

        let imageUrl = null;
        
        // Se houver imagem, fazer upload
        if (messageImage.files[0]) {
            const file = messageImage.files[0];
            
            // Validar tipo
            if (!file.type.startsWith('image/')) {
                showToast('Por favor, selecione uma imagem', 'error');
                sendBtn.disabled = false;
                sendBtn.textContent = '📤 Enviar Mensagem';
                return;
            }
            
            // Validar tamanho (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('A imagem deve ter menos de 5MB', 'error');
                sendBtn.disabled = false;
                sendBtn.textContent = '📤 Enviar Mensagem';
                return;
            }

            // Upload para Storage
            const fileName = `messages/${user.uid}/${Date.now()}_${file.name}`;
            const fileRef = ref(storage, fileName);
            await uploadBytes(fileRef, file);
            imageUrl = await getDownloadURL(fileRef);
        }

        // Guardar mensagem no Firestore
        const messagesRef = collection(db, 'messages');
        await addDoc(messagesRef, {
            studentId: user.uid,
            studentEmail: user.email,
            studentName: (await getDoc(doc(db, 'users', user.uid))).data().nome || user.email,
            message: messageText,
            imageUrl: imageUrl,
            createdAt: new Date().toISOString(),
            status: 'unread'
        });

        showToast('✓ Mensagem enviada com sucesso!', 'success');
        closeSendMessageModal();
        loadStudentMessages();
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        showToast('❌ Erro ao enviar mensagem: ' + error.message, 'error');
        
        const sendBtn = document.querySelector('.modal-footer .btn-primary');
        sendBtn.disabled = false;
        sendBtn.textContent = '📤 Enviar Mensagem';
    }
}

// Adicionar preview de imagem
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('messageImage');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('imagePreview').innerHTML = `
                        <img src="${event.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 4px; border: 1px solid #ddd;" />
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Preview para modal de mensagens
    const modalImageInput = document.getElementById('modalMessageImage');
    if (modalImageInput) {
        modalImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('modalImagePreview').innerHTML = `
                        <img src="${event.target.result}" style="max-width: 100%; max-height: 150px; border-radius: 6px; border: 2px solid #e0e0e0;" />
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// ========== FUNÇÕES PARA CALENDÁRIO DE ALUNOS ==========

let studentCalendarDate = new Date();
let studentVideoCalls = []; // Videochamadas das aulas inscritas do aluno

// Carregar videochamadas das aulas inscritas do aluno
async function loadStudentVideoCalls() {
    // Aguardar até que currentUser e DB estejam prontos
    let retries = 0;
    while ((!currentUser || !db) && retries < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
    }
    
    if (!currentUser || !db) {
        console.log('Utilizador ou DB não está pronto após aguardar');
        return;
    }
    
    try {
        // Buscar o plano de subscrição do aluno
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userPlan = userDoc.exists() ? userDoc.data().subscriptionPlan : null;
        
        
        // Carregar apenas videochamadas do plano do aluno
        let querySnapshot;
        if (userPlan) {
            const q = query(collection(db, 'videoCalls'), where('subscriptionPlan', '==', userPlan));
            querySnapshot = await getDocs(q);
        } else {
            // Se não tem plano, carregar todas (compatibilidade com videochamadas antigas)
            const q = query(collection(db, 'videoCalls'));
            querySnapshot = await getDocs(q);
        }
        
        
        studentVideoCalls = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            studentVideoCalls.push({
                id: doc.id,
                ...data
            });
        });
        
        // Renderizar calendário após carregar dados (apenas se existir)
        setTimeout(() => {
            const tbody = document.getElementById('studentCalendarTableBody');
            if (tbody) {
                renderStudentCalendar(studentCalendarDate);
            }
        }, 100);
    } catch (error) {
        console.error('Erro ao carregar videochamadas do aluno:', error);
        console.error('Detalhes:', error.code, error.message);
        
        // Mostrar calendário vazio em caso de erro
        setTimeout(() => {
            if (document.getElementById('studentCalendarTableBody')) {
                renderStudentCalendar(studentCalendarDate);
            }
        }, 100);
    }
}

// Renderizar calendário para alunos
function renderStudentCalendar(date) {
    // Verificar se o elemento existe
    const tableBody = document.getElementById('studentCalendarTableBody');
    const monthYearEl = document.getElementById('studentCalendarMonthYear');
    
    
    if (!tableBody || !monthYearEl) {
        return;
    }
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Atualizar header
    monthYearEl.textContent = `${monthNames[month]} ${year}`;
    
    // Gerar dias do calendário
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    let tableHTML = '';
    let dayCounter = 1;
    const today = new Date();
    
    // Gerar 6 linhas (semanas)
    for (let week = 0; week < 6; week++) {
        tableHTML += '<tr style="height: 120px;">';
        
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            const cellIndex = week * 7 + dayOfWeek;
            
            if (cellIndex < startingDayOfWeek) {
                // Dias do mês anterior
                tableHTML += '<td style="border: 1px solid #ddd; background: #f9f9f9; padding: 8px; vertical-align: top; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background=\'#f0f0f0\'" onmouseout="this.style.background=\'#f9f9f9\'"></td>';
            } else if (dayCounter <= daysInMonth) {
                // Dias do mês atual
                const cellDate = new Date(year, month, dayCounter);
                const isToday = cellDate.toDateString() === today.toDateString();
                
                // Filtrar eventos para este dia
                const dayEvents = studentVideoCalls.filter(call => {
                    // Tentar múltiplos formatos de data
                    let eventDate;
                    
                    if (typeof call.date === 'string') {
                        // Formato: YYYY-MM-DD (do input type="date")
                        eventDate = new Date(call.date + 'T00:00:00');
                    } else if (call.date instanceof Date) {
                        eventDate = call.date;
                    } else if (call.date.toDate && typeof call.date.toDate === 'function') {
                        // Timestamp do Firestore
                        eventDate = call.date.toDate();
                    } else {
                        try {
                            eventDate = new Date(call.date);
                        } catch(e) {
                            console.log('Erro ao parsear data:', call.date, e);
                            return false;
                        }
                    }
                    
                    return eventDate.toDateString() === cellDate.toDateString();
                });
                
                if (dayEvents.length > 0) {
                }
                
                let eventsHTML = '';
                dayEvents.forEach(event => {
                    eventsHTML += `<div style="background: #667eea; color: white; border-radius: 4px; padding: 4px 6px; font-size: 0.7rem; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; cursor: pointer; transition: all 0.2s;" onclick="event.stopPropagation(); showStudentVideoCallDetails('${event.id}')" onmouseover="this.style.background='#5568d3'" onmouseout="this.style.background='#667eea'" title="${event.title || event.className}">
                        <strong>${event.title || event.className}</strong><br/>
                        <span>${event.time}</span><br/>
                        <span style="font-size: 0.65rem; opacity: 0.9;">${event.link ? '🔗' : ''}</span>
                    </div>`;
                });
                
                const bgColor = isToday ? '#e3f2fd' : '#ffffff';
                const borderColor = isToday ? '#667eea' : '#ddd';
                const borderWidth = isToday ? '2px' : '1px';
                
                tableHTML += `<td style="border: ${borderWidth} solid ${borderColor}; background: ${bgColor}; padding: 8px; vertical-align: top; cursor: pointer; transition: all 0.3s; overflow-y: auto;">
                    <div style="font-weight: bold; color: #333; margin-bottom: 6px; font-size: 0.95rem;">${dayCounter}</div>
                    <div style="font-size: 0.8rem; overflow-y: auto; max-height: 95px;">
                        ${eventsHTML}
                    </div>
                </td>`;
                
                dayCounter++;
            } else {
                // Dias do próximo mês
                tableHTML += '<td style="border: 1px solid #ddd; background: #f9f9f9; padding: 8px; vertical-align: top; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background=\'#f0f0f0\'" onmouseout="this.style.background=\'#f9f9f9\'"></td>';
            }
        }
        
        tableHTML += '</tr>';
        
        if (dayCounter > daysInMonth) break;
    }
    
    tableBody.innerHTML = tableHTML;
}

// Navegar mês anterior
window.previousStudentCalendarMonth = function() {
    studentCalendarDate.setMonth(studentCalendarDate.getMonth() - 1);
    renderStudentCalendar(studentCalendarDate);
};

// Navegar próximo mês
window.nextStudentCalendarMonth = function() {
    studentCalendarDate.setMonth(studentCalendarDate.getMonth() + 1);
    renderStudentCalendar(studentCalendarDate);
};

// Mostrar detalhes da videochamada para alunos (apenas visualizar, sem eliminar)
window.showStudentVideoCallDetails = function(id) {
    const call = studentVideoCalls.find(c => c.id === id);
    if (!call) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    const callDate = new Date(call.date).toLocaleDateString('pt-PT');
    
    content.innerHTML = `
        <h2 style="margin-top: 0; color: #333;">${call.title || call.className}</h2>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>📚 Tipo de Plano:</strong> <span style="background: #667eea; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.9em;">${call.subscriptionPlan || call.className}</span></p>
            <p style="margin: 8px 0;"><strong>📅 Data:</strong> ${callDate}</p>
            <p style="margin: 8px 0;"><strong>⏰ Hora:</strong> ${call.time}</p>
            <p style="margin: 8px 0;"><strong>⏱️ Duração:</strong> ${call.duration} minutos</p>
            ${call.link ? `<p style="margin: 8px 0;"><strong>🔗 Link:</strong> <a href="${call.link}" target="_blank" style="color: #667eea;">${call.link}</a></p>` : ''}
            ${call.description ? `<p style="margin: 8px 0;"><strong>📝 Descrição:</strong> ${call.description}</p>` : ''}
            <p style="margin: 8px 0;"><strong>Status:</strong> <span style="background: #4CAF50; color: white; padding: 2px 8px; border-radius: 4px;">${call.status}</span></p>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="closeDetailsBtn" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem;">Fechar</button>
            <a href="${call.link}" target="_blank" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem; text-decoration: none; display: inline-block;">Abrir Reunião</a>
        </div>
    `;
    
    modal.appendChild(content);
    
    // Fechar ao clicar no botão Fechar
    const closeBtn = content.querySelector('#closeDetailsBtn');
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
};

// ========== FUNÇÕES PARA VÍDEO AULAS ==========

async function loadStudentVideoAulas() {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('Utilizador não autenticado');
            return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            console.error('Documento do utilizador não encontrado');
            return;
        }

        const userData = userDocSnap.data();
        const subscriptionPlan = userData.subscriptionPlan;
        const isFree = userData.isFree || false;

        if (!subscriptionPlan || subscriptionPlan === 'free' || subscriptionPlan === '') {
            document.getElementById('videoAulasContainer').innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p style="color: #666; margin-bottom: 20px;">Faça upgrade para aceder às aulas em vídeo</p>
                    <button class="btn-primary" onclick="document.querySelector('[data-tab=pricing]').click()">
                        Upgrade Plano
                    </button>
                </div>
            `;
            // Atualizar stat-card
            document.getElementById('availableVideos').textContent = '0';
            return;
        }

        // Se é plano free, mostrar um cartão especial com estilo diferente
        let html = '';
        if (isFree) {
            html = `
                <div class="card" style="cursor: pointer; transition: transform 0.3s; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white;" 
                     onclick="openVideoAulaDetail('Vídeos Disponíveis', 'FreesubscriptionPlan')"
                     onmouseover="this.style.transform='translateY(-5px)'" 
                     onmouseout="this.style.transform='translateY(0)'">
                    <div style="padding: 20px; text-align: center;">
                        <h3 style="margin: 0 0 10px 0; color: white;">🎓 ${subscriptionPlan}</h3>
                        <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px;">Plano Gratuito - Clique para ver vídeos</p>
                    </div>
                </div>
            `;
        } else {
            // Mostrar cartão normal para planos pagos
            html = `
                <div class="card" style="cursor: pointer; transition: transform 0.3s;" 
                     onclick="openVideoAulaDetail('${subscriptionPlan}', '${subscriptionPlan}')"
                     onmouseover="this.style.transform='translateY(-5px)'" 
                     onmouseout="this.style.transform='translateY(0)'">
                    <div style="padding: 20px; text-align: center;">
                        <h3 style="margin: 0 0 10px 0; color: #333;">📚 ${subscriptionPlan}</h3>
                        <p style="margin: 0; color: #666; font-size: 14px;">Clique para ver aulas</p>
                    </div>
                </div>
            `;
        }

        document.getElementById('videoAulasContainer').innerHTML = html;
        
        // Contar vídeos disponíveis
        const folderForCount = isFree ? 'FreesubscriptionPlan' : subscriptionPlan;
        await countAvailableVideos(folderForCount);
    } catch (error) {
        console.error('Erro ao carregar vídeo aulas:', error);
    }
}

async function countAvailableVideos(plan) {
    try {
        const folderPath = plan;
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
        let videoCount = 0;
        
        // Função recursiva para contar vídeos em todas as subpastas
        async function countVideosRecursive(folderPath) {
            try {
                const folderRef = ref(storage, folderPath);
                const result = await listAll(folderRef);
                
                // Contar ficheiros de vídeo desta pasta
                const videosInFolder = result.items.filter(item => 
                    videoExtensions.some(ext => item.name.toLowerCase().endsWith(ext))
                ).length;
                
                videoCount += videosInFolder;
                
                // Procurar em subpastas
                for (const prefix of result.prefixes) {
                    await countVideosRecursive(prefix.fullPath);
                }
            } catch (error) {
                console.warn(`Não foi possível contar vídeos da pasta: ${folderPath}`, error);
            }
        }
        
        await countVideosRecursive(folderPath);
        
        // Atualizar stat-card
        document.getElementById('availableVideos').textContent = videoCount;
    } catch (error) {
        console.error('Erro ao contar vídeos:', error);
        document.getElementById('availableVideos').textContent = '0';
    }
}

async function countScheduledCalls() {
    try {
        const user = auth.currentUser;
        if (!user) {
            const element = document.getElementById('scheduledCalls');
            if (element) element.textContent = '0';
            return;
        }

        // Buscar o plano de subscrição do aluno
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            const element = document.getElementById('scheduledCalls');
            if (element) element.textContent = '0';
            return;
        }

        const userPlan = userDoc.data().subscriptionPlan;
        
        // Buscar videochamadas correspondentes ao plano do aluno
        let callCount = 0;
        if (userPlan) {
            const q = query(collection(db, 'videoCalls'), where('subscriptionPlan', '==', userPlan));
            const querySnapshot = await getDocs(q);
            callCount = querySnapshot.size;
        }
        
        // Atualizar stat-card
        const element = document.getElementById('scheduledCalls');
        if (element) {
            element.textContent = callCount;
        }
    } catch (error) {
        console.error('Erro ao contar videochamadas:', error);
        const element = document.getElementById('scheduledCalls');
        if (element) {
            element.textContent = '0';
        }
    }
}

async function openVideoAulaDetail(discipline, plan) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 10000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: white;
        border-radius: 8px;
        padding: 30px;
        width: 80%;
        max-width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;';
    header.innerHTML = `
        <h2 style="margin: 0; color: #333;">📚 ${discipline}</h2>
        <button style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
    `;

    const videosContainer = document.createElement('div');
    videosContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
    videosContainer.innerHTML = '<p style="text-align: center; color: #666;">Carregando vídeos...</p>';

    modalContent.appendChild(header);
    modalContent.appendChild(videosContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    header.querySelector('button').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    await loadVideosFromStorage(plan, discipline, videosContainer);
}

async function loadVideosFromStorage(plan, discipline, container) {
    try {
        const folderPath = plan;
        const folderRef = ref(storage, folderPath);
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
        
        // Função recursiva para listar vídeos em todas as subpastas
        let allVideoFiles = [];
        
        async function listVideosRecursive(folderPath) {
            try {
                const folderRef = ref(storage, folderPath);
                const result = await listAll(folderRef);
                
                // Adicionar ficheiros de vídeo desta pasta
                const videoFiles = result.items.filter(item => 
                    videoExtensions.some(ext => item.name.toLowerCase().endsWith(ext))
                );
                
                allVideoFiles = allVideoFiles.concat(videoFiles);
                
                // Procurar em subpastas
                for (const prefix of result.prefixes) {
                    await listVideosRecursive(prefix.fullPath);
                }
            } catch (error) {
                console.warn(`Não foi possível listar pasta: ${folderPath}`, error);
            }
        }
        
        await listVideosRecursive(folderPath);

        if (allVideoFiles.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">Nenhum vídeo disponível</p>';
            return;
        }

        // Obter vídeos já vistos do localStorage
        const viewedVideos = JSON.parse(localStorage.getItem('viewedVideos')) || {};
        
        // Armazenar URLs dos vídeos
        const videoUrls = {};
        
        let html = '';
        for (let i = 0; i < allVideoFiles.length; i++) {
            const file = allVideoFiles[i];
            const fileName = file.name;
            const downloadURL = await getDownloadURL(file);
            
            // Guardar URL com índice
            videoUrls['video-' + i] = { url: downloadURL, name: fileName };

            // Verificar se vídeo foi visto
            const isViewed = viewedVideos[fileName] || false;
            const viewedStyle = isViewed ? 'background: #e8f5e9; border-left: 4px solid #4caf50;' : '';
            const viewedBadge = isViewed ? '<span style="color: #4caf50; font-weight: bold; margin-right: 8px;">✓</span>' : '';

            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px; ${viewedStyle}">
                    <span style="flex: 1; color: #333; font-weight: 500;">${viewedBadge}📹 ${fileName}</span>
                    <button class="play-video-btn" data-video-id="video-${i}" style="padding: 8px 16px; font-size: 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Assistir
                    </button>
                </div>
            `;
        }

        container.innerHTML = html;
        
        // Guardar URLs globalmente para acesso
        window.videoUrlsCache = videoUrls;
        
        // Adicionar event listeners aos botões
        container.querySelectorAll('.play-video-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                const videoData = window.videoUrlsCache[videoId];
                if (videoData) {
                    playVideo(videoData.url, videoData.name);
                }
            });
        });
        
    } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
        container.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar vídeos</p>';
    }
}

function playVideo(url, fileName) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 10001;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        width: 90%;
        max-width: 900px;
        background-color: black;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        position: relative;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 24px;
        cursor: pointer;
        z-index: 10002;
        transition: background-color 0.3s;
    `;
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => modal.remove());
    closeBtn.addEventListener('mouseover', () => closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.9)');
    closeBtn.addEventListener('mouseout', () => closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)');

    const video = document.createElement('video');
    video.style.cssText = 'width: 100%; height: auto; display: block;';
    video.controls = true;
    video.controlsList = 'nodownload';
    video.oncontextmenu = function() { return false; };
    video.src = url;

    // Adicionar watermark com data/hora
    const watermark = document.createElement('div');
    watermark.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        pointer-events: none;
        text-align: right;
    `;
    const now = new Date();
    const timeStr = now.toLocaleString('pt-PT');
    watermark.textContent = timeStr;

    const title = document.createElement('div');
    title.style.cssText = 'color: white; padding: 10px 20px; background-color: rgba(0, 0, 0, 0.8); font-weight: bold;';
    title.textContent = fileName;

    modalContent.appendChild(title);
    modalContent.appendChild(video);
    modalContent.appendChild(watermark);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    video.play();
    
    // Guardar vídeo como visto
    const viewedVideos = JSON.parse(localStorage.getItem('viewedVideos')) || {};
    viewedVideos[fileName] = true;
    localStorage.setItem('viewedVideos', JSON.stringify(viewedVideos));
}

// ========== FUNÇÕES PARA MENSAGENS DO PROFESSOR ==========

async function loadProfessorMessages() {
    try {
        const messagesList = document.getElementById('messagesList');
        const messageDetail = document.getElementById('messageDetail');
        
        if (!messagesList || !messageDetail) return;

        // Carregar todas as mensagens (sem filtro por professor)
        const q = query(collection(db, 'messages'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            messagesList.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Nenhuma mensagem</p>';
            messageDetail.innerHTML = '<p style="text-align: center; color: #999; margin-top: 100px;">Nenhuma mensagem para responder</p>';
            return;
        }

        let html = '';
        let messages = [];
        
        querySnapshot.forEach(doc => {
            const msg = doc.data();
            msg.id = doc.id;
            messages.push(msg);
        });

        // Ordenar por data (mais recentes primeiro)
        messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        messages.forEach(msg => {
            const date = new Date(msg.createdAt);
            const dateStr = date.toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' });
            const timeStr = date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
            const statusBg = msg.status === 'unread' ? '#ff9800' : '#4CAF50';
            const statusText = msg.status === 'unread' ? '⏳ Não lido' : '✓ Respondido';
            
            html += `
                <div onclick="selectMessage('${msg.id}')" style="padding: 12px; border-bottom: 1px solid #ddd; cursor: pointer; background: ${msg.status === 'unread' ? '#fff3e0' : '#f5f5f5'}; transition: background 0.3s;" onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background='${msg.status === 'unread' ? '#fff3e0' : '#f5f5f5'}'">
                    <div style="font-weight: bold; font-size: 0.9em; color: #333; margin-bottom: 4px;">${msg.studentName || msg.studentEmail}</div>
                    <div style="font-size: 0.85em; color: #666; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${msg.message.substring(0, 40)}...</div>
                    <div style="font-size: 0.8em; color: #999; display: flex; justify-content: space-between;">
                        <span>${dateStr} ${timeStr}</span>
                        <span style="background: ${statusBg}; color: white; padding: 2px 6px; border-radius: 2px;">${statusText}</span>
                    </div>
                </div>
            `;
        });

        messagesList.innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar mensagens do professor:', error);
    }
}

function selectMessage(messageId) {
    // Guardar messageId para usar no modal
    window.currentReplyMessageId = messageId;
    
    // Buscar a mensagem
    const docRef = doc(db, 'messages', messageId);
    getDoc(docRef).then(docSnap => {
        if (!docSnap.exists()) return;
        
        const msg = docSnap.data();
        const date = new Date(msg.createdAt);
        const dateStr = date.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

        const messageDetail = document.getElementById('messageDetail');
        messageDetail.innerHTML = `
            <div style="flex: 1; overflow-y: auto; margin-bottom: 20px; padding-right: 10px;">
                <!-- Pergunta do Aluno -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                    <div style="font-weight: bold; margin-bottom: 12px; display: flex; align-items: center;">
                        <span style="font-size: 1.3em; margin-right: 10px;">👤</span>${msg.studentName || msg.studentEmail}
                    </div>
                    <p style="margin: 12px 0; line-height: 1.6; font-size: 1em;">${msg.message}</p>
                    ${msg.imageUrl ? `<img src="${msg.imageUrl}" alt="Imagem" style="max-width: 100%; max-height: 250px; border-radius: 8px; margin-top: 12px; border: 2px solid rgba(255,255,255,0.3);" />` : ''}
                    <div style="margin-top: 12px; font-size: 0.85em; color: rgba(255,255,255,0.8); display: flex; justify-content: space-between; align-items: center;">
                        <span>📅 ${dateStr} às ${timeStr}</span>
                        <span style="background: ${msg.status === 'unread' ? '#ff6b6b' : '#4CAF50'}; padding: 4px 10px; border-radius: 12px; font-weight: bold;">${msg.status === 'unread' ? '🔔 Nova' : '✓ Lida'}</span>
                    </div>
                </div>
                
                ${msg.reply ? `
                    <!-- Resposta já enviada -->
                    <div style="background: #f0f9ff; border-left: 4px solid #4CAF50; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="font-weight: bold; color: #4CAF50; margin-bottom: 10px; display: flex; align-items: center;">
                            <span style="font-size: 1.3em; margin-right: 10px;">✓</span>Resposta enviada em ${new Date(msg.replyDate).toLocaleDateString('pt-PT')}
                        </div>
                        <p style="color: #333; margin: 8px 0; line-height: 1.6;">${msg.reply}</p>
                        ${msg.replyImageUrl ? `<img src="${msg.replyImageUrl}" alt="Imagem da resposta" style="max-width: 100%; max-height: 200px; border-radius: 6px; margin-top: 10px;" />` : ''}
                    </div>
                ` : ''}
            </div>

            <div style="border-top: 2px solid #f0f0f0; padding-top: 15px;">
                <button onclick="openReplyModal('${messageId}')" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; padding: 11px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 1em; width: 100%; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(76, 175, 80, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">📤 Responder ao Aluno</button>
            </div>
        `;

        // Marcar como respondida (status muda)
        if (msg.status === 'unread') {
            updateDoc(docRef, {
                status: 'respondida'
            }).catch(error => console.error('Erro ao marcar como lido:', error));
        }
    }).catch(error => console.error('Erro ao carregar mensagem:', error));
}

function openReplyModal(messageId) {
    window.currentReplyMessageId = messageId;
    const modal = document.getElementById('replyModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('replyTextModal').focus();
    }
}

function closeReplyModal() {
    const modal = document.getElementById('replyModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('replyTextModal').value = '';
        document.getElementById('replyImageModal').value = '';
        document.getElementById('replyImagePreviewModal').innerHTML = '';
    }
}

async function sendReplyFromModal() {
    try {
        const messageId = window.currentReplyMessageId;
        const replyText = document.getElementById('replyTextModal').value.trim();
        const replyImageInput = document.getElementById('replyImageModal');
        
        if (!replyText) {
            showToast('Por favor, escreva uma resposta', 'error');
            return;
        }

        // Desabilitar botão
        const sendBtn = document.querySelector('#replyModal .modal-footer .btn-primary');
        sendBtn.disabled = true;
        sendBtn.textContent = '⏳ Enviando...';

        let replyImageUrl = null;

        // Se houver imagem, fazer upload
        if (replyImageInput && replyImageInput.files[0]) {
            const file = replyImageInput.files[0];
            
            // Validar tipo
            if (!file.type.startsWith('image/')) {
                showToast('Por favor, selecione uma imagem', 'error');
                sendBtn.disabled = false;
                sendBtn.textContent = '📤 Enviar Resposta';
                return;
            }
            
            // Validar tamanho (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('A imagem deve ter menos de 5MB', 'error');
                sendBtn.disabled = false;
                sendBtn.textContent = '📤 Enviar Resposta';
                return;
            }

            // Upload para Storage
            const fileName = `replies/${messageId}/${Date.now()}_${file.name}`;
            const fileRef = ref(storage, fileName);
            await uploadBytes(fileRef, file);
            replyImageUrl = await getDownloadURL(fileRef);
        }

        // Guardar resposta
        const docRef = doc(db, 'messages', messageId);
        const updateData = {
            reply: replyText,
            replyDate: new Date().toISOString(),
            status: 'respondida'
        };
        
        if (replyImageUrl) {
            updateData.replyImageUrl = replyImageUrl;
        }

        await updateDoc(docRef, updateData);

        showToast('✓ Resposta enviada com sucesso!', 'success');
        closeReplyModal();
        loadProfessorMessages();
        loadPendingReplies();

        // Restaurar botão
        sendBtn.disabled = false;
        sendBtn.textContent = '📤 Enviar Resposta';
    } catch (error) {
        console.error('Erro ao responder:', error);
        showToast('❌ Erro ao enviar resposta: ' + error.message, 'error');
        
        const sendBtn = document.querySelector('#replyModal .modal-footer .btn-primary');
        sendBtn.disabled = false;
        sendBtn.textContent = '📤 Enviar Resposta';
    }
}

async function replyToMessage(messageId) {
    try {
        const user = auth.currentUser;
        const replyText = document.getElementById('replyText').value.trim();
        const replyImageInput = document.getElementById('replyImage');
        
        if (!replyText) {
            showToast('Por favor, escreva uma resposta', 'error');
            return;
        }

        // Desabilitar botão
        const button = event.target;
        button.disabled = true;
        button.textContent = '⏳ Enviando...';

        let replyImageUrl = null;

        // Se houver imagem, fazer upload
        if (replyImageInput && replyImageInput.files[0]) {
            const file = replyImageInput.files[0];
            
            // Validar tipo
            if (!file.type.startsWith('image/')) {
                showToast('Por favor, selecione uma imagem', 'error');
                button.disabled = false;
                button.textContent = '📤 Enviar Resposta';
                return;
            }
            
            // Validar tamanho (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('A imagem deve ter menos de 5MB', 'error');
                button.disabled = false;
                button.textContent = '📤 Enviar Resposta';
                return;
            }

            // Upload para Storage
            const fileName = `replies/${messageId}/${Date.now()}_${file.name}`;
            const fileRef = ref(storage, fileName);
            await uploadBytes(fileRef, file);
            replyImageUrl = await getDownloadURL(fileRef);
        }

        // Guardar resposta
        const docRef = doc(db, 'messages', messageId);
        const updateData = {
            reply: replyText,
            replyDate: new Date().toISOString(),
            status: 'respondida'
        };
        
        if (replyImageUrl) {
            updateData.replyImageUrl = replyImageUrl;
        }

        await updateDoc(docRef, updateData);

        showToast('✓ Resposta enviada com sucesso!', 'success');
        
        // Limpar e recarregar
        document.getElementById('replyText').value = '';
        if (replyImageInput) replyImageInput.value = '';
        document.getElementById('replyImagePreview').innerHTML = '';
        loadProfessorMessages();

        // Restaurar botão
        button.disabled = false;
        button.textContent = '📤 Enviar Resposta';
    } catch (error) {
        console.error('Erro ao responder:', error);
        showToast('❌ Erro ao enviar resposta: ' + error.message, 'error');
        
        // Restaurar botão
        const button = event.target;
        button.disabled = false;
        button.textContent = '📤 Enviar Resposta';
    }
}

// ========== FUNÇÕES PARA GESTÃO DE FICHAS ==========

/**
 * Carregar fichas disponíveis para o aluno
 */
async function loadStudentFichas() {
    try {
        const container = document.getElementById('studentFichasContainer');
        if (!container) return;

        const user = auth.currentUser;
        if (!user) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p style="color: #999; font-size: 1.1rem;">Deve estar autenticado</p></div>';
            return;
        }

        // Carregar todos os planos e criar um mapa
        const plansSnapshot = await getDocs(collection(db, 'plans'));
        const plansMap = {};
        const plansColorMap = {};
        
        plansSnapshot.forEach(doc => {
            const planData = doc.data();
            plansMap[doc.id] = planData.name || 'Plano Desconhecido';
            // Atribuir cores baseadas no nome do plano
            const planName = (planData.name || '').toLowerCase();
            if (planName.includes('free') || planName.includes('gratuito')) {
                plansColorMap[doc.id] = '#28a745';
            } else if (planName.includes('basic') || planName.includes('basico') || planName.includes('padrão')) {
                plansColorMap[doc.id] = '#667eea';
            } else if (planName.includes('premium') || planName.includes('avancado')) {
                plansColorMap[doc.id] = '#764ba2';
            } else {
                plansColorMap[doc.id] = '#f39c12';
            }
        });

        // Carregar todas as fichas
        const snapshot = await getDocs(collection(db, 'fichas'));
        
        if (snapshot.empty) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p style="color: #999; font-size: 1.1rem;">Nenhuma ficha disponível</p></div>';
            return;
        }

        let htmlDisponiveis = '';
        let htmlBloqueadas = '';
        let fichasDisponiveisCount = 0;
        let fichasBloqueddasCount = 0;

        // Carregar informações do plano do aluno para filtrar fichas
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let userPlanId = userDoc.data()?.subscriptionPlan; // Pode ser ID ou nome
        const userPlanName = plansMap[userPlanId] || userDoc.data()?.subscriptionPlan || 'Gratuito';
        
        // Se o userPlanId é um nome em vez de um ID, procura o ID correspondente
        if (userPlanId && !plansMap[userPlanId]) {
            // Procura no mapa o plano cujo nome corresponde ao userPlanId
            for (const [planId, planName] of Object.entries(plansMap)) {
                if (planName === userPlanId) {
                    userPlanId = planId;
                    break;
                }
            }
        }
        
        

        snapshot.forEach(doc => {
            const ficha = doc.data();
            const fichaAccessLevelId = ficha.accessLevel; // Este é o ID do plano requerido
            const fichaAccessLevelName = plansMap[fichaAccessLevelId] || fichaAccessLevelId;
            
            

            // Verificar se o aluno tem acesso à ficha
            let temAcesso = false;
            
            // Se a ficha é de um plano free, todos têm acesso
            if (fichaAccessLevelId && plansMap[fichaAccessLevelId]) {
                const requirePlanName = plansMap[fichaAccessLevelId].toLowerCase();
                if (requirePlanName.includes('free') || requirePlanName.includes('gratuito')) {
                    temAcesso = true;
                } else if (userPlanId === fichaAccessLevelId) {
                    // Acesso se o plano do aluno é igual ao requerido
                    temAcesso = true;
                } else if (userPlanId && plansMap[userPlanId]) {
                    // Se o plano do aluno é premium, tem acesso a tudo
                    const userPlanNameLower = plansMap[userPlanId].toLowerCase();
                    if (userPlanNameLower.includes('premium') || userPlanNameLower.includes('avancado')) {
                        temAcesso = true;
                    }
                }
            }

            const professorName = ficha.professorEmail?.split('@')[0] || 'Professor';
            const planColor = plansColorMap[fichaAccessLevelId] || '#999';
            
            if (temAcesso) {
                fichasDisponiveisCount++;
                htmlDisponiveis += `
                    <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-top: 4px solid ${planColor}; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                        <h4 style="color: #333; margin: 0 0 10px 0; word-break: break-word;">${ficha.title}</h4>
                        <p style="color: #666; font-size: 0.9em; margin: 0 0 10px 0; word-break: break-word;">${ficha.description || 'Sem descrição'}</p>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                            <span style="background: ${planColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: bold;">
                                ✓ ${fichaAccessLevelName}
                            </span>
                            <span style="font-size: 0.85em; color: #999;">👨‍🏫 ${professorName}</span>
                        </div>
                        <div style="display: flex; justify-content: flex-end;">
                            ${ficha.fileUrl ? `<a href="${ficha.fileUrl}" target="_blank" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 0.9em; cursor: pointer; font-weight: bold; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">📥 Baixar PDF</a>` : '<span style="color: #999; font-size: 0.85em;">Sem ficheiro anexado</span>'}
                        </div>
                    </div>
                `;
            } else {
                fichasBloqueddasCount++;
                htmlBloqueadas += `
                    <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-top: 4px solid #ccc; opacity: 0.7;">
                        <h4 style="color: #666; margin: 0 0 10px 0; word-break: break-word;">🔒 ${ficha.title}</h4>
                        <p style="color: #999; font-size: 0.9em; margin: 0 0 10px 0; word-break: break-word;">${ficha.description || 'Sem descrição'}</p>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                            <span style="background: #999; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: bold;">
                                🔐 Bloqueado - ${fichaAccessLevelName}
                            </span>
                            <span style="font-size: 0.85em; color: #999;">👨‍🏫 ${professorName}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                            <span style="color: #666; font-size: 0.85em;">Upgrade para aceder a esta ficha</span>
                            <button onclick="window.location.href='pricing.html'" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: bold;">💳 Upgrade</button>
                        </div>
                    </div>
                `;
            }
        });

        let html = '';

        if (fichasDisponiveisCount > 0) {
            html += `<div style="grid-column: 1/-1;"><h3 style="color: #333; margin-top: 0;">✓ Minhas Fichas (${fichasDisponiveisCount})</h3></div>` + htmlDisponiveis;
        }

        if (fichasBloqueddasCount > 0) {
            html += `<div style="grid-column: 1/-1;"><h3 style="color: #666; margin-top: 20px;">🔒 Fichas Bloqueadas (${fichasBloqueddasCount})</h3></div>` + htmlBloqueadas;
        }

        if (fichasDisponiveisCount === 0 && fichasBloqueddasCount === 0) {
            html = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p style="color: #999; font-size: 1.1rem;">Nenhuma ficha disponível</p></div>';
        }

        container.innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar fichas:', error);
        const container = document.getElementById('studentFichasContainer');
        if (container) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p style="color: #999; font-size: 1.1rem;">Erro ao carregar fichas</p></div>';
        }
    }
}

/**
 * Abrir modal para criar ficha
 */
async function openCreateFichaModal() {
    const modal = document.getElementById('fichaModal');
    const title = document.getElementById('fichaModalTitle');
    const form = document.getElementById('fichaForm');
    const planSelect = document.getElementById('fichaAccessLevel');
    
    if (modal && title && form && planSelect) {
        title.textContent = 'Adicionar Ficha';
        form.reset();
        
        // Carregar planos do Firestore
        try {
            const plansSnapshot = await getDocs(collection(db, 'plans'));
            planSelect.innerHTML = '<option value="">Selecionar Plano...</option>';
            
            plansSnapshot.forEach(doc => {
                const plan = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = plan.name || doc.id;
                planSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar planos:', error);
            // Fallback para planos padrão
            planSelect.innerHTML = `
                <option value="">Selecionar Plano...</option>
                <option value="FreesubscriptionPlan">Gratuito</option>
                <option value="BasicsubscriptionPlan">Plano Básico</option>
                <option value="PremiumsubscriptionPlan">Plano Premium</option>
            `;
        }
        
        modal.style.display = 'flex';
    }
}

/**
 * Fechar modal de ficha
 */
function closeFichaModal() {
    const modal = document.getElementById('fichaModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Guardar ficha (criar ou atualizar)
 */
async function saveFicha(event) {
    event.preventDefault();
    
    try {
        const user = auth.currentUser;
        if (!user) {
            showToast('Utilizador não autenticado', 'error');
            return;
        }

        const title = document.getElementById('fichaTitle').value;
        const description = document.getElementById('fichaDescription').value;
        const accessLevel = document.getElementById('fichaAccessLevel').value;
        const fileInput = document.getElementById('fichaFile');
        
        if (!title) {
            showToast('Por favor, preencha o título da ficha', 'warning');
            return;
        }

        let fichaUrl = null;

        // Upload do ficheiro se foi selecionado
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            
            if (file.type !== 'application/pdf') {
                showToast('Por favor, selecione um ficheiro PDF', 'error');
                return;
            }

            const fileName = `${Date.now()}_${file.name}`;
            const filePath = `fichas/${user.uid}/${fileName}`;
            const fileRef = ref(storage, filePath);

            const uploadTask = uploadBytesResumable(fileRef, file);

            // Aguardar upload
            fichaUrl = await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', null,
                    (error) => {
                        console.error('Erro no upload:', error);
                        reject(error);
                    },
                    async () => {
                        const url = await getDownloadURL(fileRef);
                        resolve(url);
                    }
                );
            });
        }

        // Guardar metadados no Firestore
        const fichaData = {
            title,
            description,
            accessLevel,
            professorId: user.uid,
            professorEmail: user.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (fichaUrl) {
            fichaData.fileUrl = fichaUrl;
        }

        // Guardar na coleção de fichas
        await addDoc(collection(db, 'fichas'), fichaData);

        showToast('✓ Ficha adicionada com sucesso!', 'success');
        closeFichaModal();
        loadProfessorFichas();
    } catch (error) {
        console.error('Erro ao guardar ficha:', error);
        showToast('❌ Erro ao guardar ficha: ' + error.message, 'error');
    }
}

/**
 * Carregar fichas do professor
 */
async function loadProfessorFichas() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const container = document.getElementById('fichasContainer');
        if (!container) return;

        // Carregar todos os planos e criar um mapa
        const plansSnapshot = await getDocs(collection(db, 'plans'));
        const plansMap = {};
        const plansColorMap = {};
        
        plansSnapshot.forEach(doc => {
            const planData = doc.data();
            plansMap[doc.id] = planData.name || 'Plano Desconhecido';
            // Atribuir cores baseadas no nome do plano
            const planName = (planData.name || '').toLowerCase();
            if (planName.includes('free') || planName.includes('gratuito')) {
                plansColorMap[doc.id] = '#28a745';
            } else if (planName.includes('basic') || planName.includes('basico') || planName.includes('padrão')) {
                plansColorMap[doc.id] = '#667eea';
            } else if (planName.includes('premium') || planName.includes('avancado')) {
                plansColorMap[doc.id] = '#764ba2';
            } else {
                plansColorMap[doc.id] = '#f39c12';
            }
        });

        const q = query(
            collection(db, 'fichas'),
            where('professorId', '==', user.uid)
        );

        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p style="color: #999; font-size: 1.1rem;">Nenhuma ficha criada ainda</p></div>';
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const ficha = doc.data();
            const fichaAccessLevelId = ficha.accessLevel;
            const fichaAccessLevelName = plansMap[fichaAccessLevelId] || fichaAccessLevelId;
            const planColor = plansColorMap[fichaAccessLevelId] || '#999';
            
            html += `
                <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid ${planColor};">
                    <h4 style="color: #333; margin-top: 0; margin-bottom: 10px;">${ficha.title}</h4>
                    <p style="color: #666; font-size: 0.9em; margin-bottom: 15px;">${ficha.description || 'Sem descrição'}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="background: ${planColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: bold;">
                            ${fichaAccessLevelName}
                        </span>
                        <div style="display: flex; gap: 10px;">
                            ${ficha.fileUrl ? `<a href="${ficha.fileUrl}" target="_blank" style="background: #667eea; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 0.9em; cursor: pointer;">📥 Baixar</a>` : ''}
                            <button onclick="deleteFicha('${doc.id}')" style="background: #dc3545; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em;">🗑️ Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar fichas:', error);
        showToast('❌ Erro ao carregar fichas: ' + error.message, 'error');
    }
}

/**
 * Eliminar ficha
 */
function deleteFicha(fichaId) {
    if (confirm('Tem a certeza que deseja eliminar esta ficha?')) {
        try {
            deleteDoc(doc(db, 'fichas', fichaId));
            showToast('✓ Ficha eliminada com sucesso!', 'success');
            loadProfessorFichas();
        } catch (error) {
            console.error('Erro ao eliminar ficha:', error);
            showToast('❌ Erro ao eliminar ficha: ' + error.message, 'error');
        }
    }
}

/**
 * Helpers para exibição de níveis de acesso
 */
function getAccessLevelColor(planId) {
    const colorMap = {
        'FreesubscriptionPlan': '#28a745',
        'BasicsubscriptionPlan': '#667eea',
        'PremiumsubscriptionPlan': '#764ba2',
        'free': '#28a745',
        'basico': '#667eea',
        'avancado': '#764ba2'
    };
    return colorMap[planId] || '#999';
}

function getAccessLevelLabel(planId) {
    const labelMap = {
        'FreesubscriptionPlan': 'Gratuito',
        'BasicsubscriptionPlan': 'Plano Básico',
        'PremiumsubscriptionPlan': 'Plano Premium',
        'free': 'Gratuito',
        'basico': 'Plano Básico',
        'avancado': 'Plano Avançado'
    };
    return labelMap[planId] || planId;
}

// Exportar funções globalmente
window.openCreateFichaModal = openCreateFichaModal;
window.closeFichaModal = closeFichaModal;
window.saveFicha = saveFicha;
window.deleteFicha = deleteFicha;
window.loadStudentFichas = loadStudentFichas;