// Função de carregamento para vídeo aulas - Anexo ao script.js

// Quando o DOM estiver pronto, adiciona estas funções globalmente
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda um pouco para garantir que auth e db estão carregados
    setTimeout(function() {
        if (typeof auth === 'undefined' || typeof db === 'undefined') {
            console.error('auth ou db não estão definidos');
            return;
        }

        // ========== FUNÇÕES PARA VÍDEO AULAS ==========

        /**
         * Carregar disciplinas do plano do aluno
         */
        window.loadStudentVideoAulas = async function() {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.warn('Utilizador não autenticado');
                    return;
                }

                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                
                if (!userSnap.exists()) {
                    console.warn('Utilizador não encontrado');
                    return;
                }

                const userData = userSnap.data();
                const subscriptionPlan = userData.subscriptionPlan;

                const container = document.getElementById('videoAulasContainer');
                if (!container) return;

                if (!subscriptionPlan) {
                    container.innerHTML = `
                        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                            <h3 style="color: #667eea; margin-bottom: 15px;">📚 Sem Plano Ativo</h3>
                            <p style="color: #666; margin-bottom: 20px;">Para aceder às vídeo aulas, é necessário ter um plano ativo.</p>
                            <a href="pricing.html" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px;">Ver Planos Disponíveis</a>
                        </div>
                    `;
                    return;
                }

                const disciplinesByPlan = {
                    'Física A 10º': ['Mecânica', 'Termologia', 'Ondas e Luz'],
                    'Química A 10º': ['Estrutura Atómica', 'Tabela Periódica', 'Ligação Química'],
                    'Física A 11º': ['Eletromagnetismo', 'Física Moderna', 'Cinemática'],
                    'Química A 11º': ['Equilíbrio Químico', 'Termoquímica', 'Eletroquímica']
                };

                const disciplines = disciplinesByPlan[subscriptionPlan] || [];

                if (disciplines.length === 0) {
                    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p style="color: #999;">Nenhuma disciplina disponível.</p></div>`;
                    return;
                }

                container.innerHTML = disciplines.map(discipline => `
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; color: white; text-align: center; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);" 
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(102, 126, 234, 0.4)'" 
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.2)'"
                         onclick="window.openVideoAulaDetail('${discipline}', '${subscriptionPlan}')">
                        <div style="font-size: 2.5rem; margin-bottom: 10px;">📽️</div>
                        <h3 style="margin: 0 0 8px 0; font-size: 1.1rem;">${discipline}</h3>
                        <p style="margin: 0; font-size: 0.95rem; opacity: 0.9;">${subscriptionPlan}</p>
                    </div>
                `).join('');

            } catch (error) {
                console.error('Erro ao carregar vídeo aulas:', error);
                const container = document.getElementById('videoAulasContainer');
                if (container) {
                    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #e74c3c;">Erro ao carregar disciplinas. Tente novamente.</div>';
                }
            }
        };

        /**
         * Abrir detalhes da vídeo aula
         */
        window.openVideoAulaDetail = async function(discipline, plan) {
            const modal = document.createElement('div');
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
            
            modal.innerHTML = `
                <div style="background: white; border-radius: 12px; padding: 30px; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                    <h2 style="color: #667eea; margin-top: 0;">${discipline}</h2>
                    <p style="color: #666; margin-bottom: 20px;">
                        <strong>Plano:</strong> ${plan}<br/>
                        <strong>Status:</strong> <span style="color: #28a745;">✓ Acesso Desbloqueado</span>
                    </p>
                    
                    <div id="videoListContainer" style="margin: 20px 0;">
                        <div style="text-align: center; padding: 20px;">
                            <p style="color: #999;">Carregando vídeos...</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button style="flex: 1; background: #e0e0e0; color: #333; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 1rem;" onclick="this.closest('div').closest('div').remove();">Fechar</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            window.loadVideosFromStorage(plan, discipline, document.getElementById('videoListContainer'));
        };

        /**
         * Carregar vídeos do Storage
         */
        window.loadVideosFromStorage = async function(plan, discipline, container) {
            try {
                const { getStorage, ref, listAll, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js');
                
                const storage = getStorage();
                const folderRef = ref(storage, plan);
                const result = await listAll(folderRef);
                
                if (result.items.length === 0) {
                    container.innerHTML = `<div style="text-align: center; padding: 20px; color: #999;">Nenhum vídeo disponível.</div>`;
                    return;
                }
                
                const videoFiles = result.items.filter(item => {
                    const name = item.name.toLowerCase();
                    return name.endsWith('.mp4') || name.endsWith('.webm') || name.endsWith('.mov') || name.endsWith('.avi');
                });
                
                if (videoFiles.length === 0) {
                    container.innerHTML = `<div style="text-align: center; padding: 20px; color: #999;">Nenhum vídeo disponível.</div>`;
                    return;
                }
                
                let videoHTML = '<div style="display: grid; gap: 15px;">';
                
                for (const file of videoFiles) {
                    try {
                        const url = await getDownloadURL(file);
                        const fileName = file.name;
                        
                        videoHTML += `
                            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <div style="font-size: 2rem;">🎬</div>
                                    <div style="flex: 1;">
                                        <h4 style="margin: 0 0 5px 0; color: #333;">${fileName.replace(/\.[^/.]+$/, '')}</h4>
                                        <p style="margin: 0; font-size: 0.85rem; color: #999;">Clique para assistir</p>
                                    </div>
                                    <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;" onclick="window.playVideo('${url}', '${fileName}')">▶️ Ver</button>
                                </div>
                            </div>
                        `;
                    } catch (error) {
                        console.error('Erro ao gerar URL:', error);
                    }
                }
                
                videoHTML += '</div>';
                container.innerHTML = videoHTML;
                
            } catch (error) {
                console.error('Erro ao carregar vídeos:', error);
                container.innerHTML = `<div style="text-align: center; padding: 20px; color: #e74c3c;">Erro ao carregar vídeos. Tente novamente.</div>`;
            }
        };

        /**
         * Reproduzir vídeo
         */
        window.playVideo = function(url, fileName) {
            const videoModal = document.createElement('div');
            videoModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10001;';
            
            videoModal.innerHTML = `
                <div style="background: white; border-radius: 12px; padding: 20px; max-width: 900px; width: 90%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h3 style="margin: 0; color: #333;">${fileName}</h3>
                        <button style="background: #e0e0e0; border: none; padding: 8px 12px; cursor: pointer;" onclick="this.closest('div').closest('div').remove();">✕</button>
                    </div>
                    <video style="width: 100%; height: auto; background: #000;" controls>
                        <source src="${url}" type="video/mp4">
                    </video>
                </div>
            `;
            
            videoModal.onclick = function(e) {
                if (e.target === videoModal) videoModal.remove();
            };
            
            document.body.appendChild(videoModal);
        };

    }, 500);
});
