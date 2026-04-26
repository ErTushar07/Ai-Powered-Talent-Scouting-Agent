document.addEventListener('DOMContentLoaded', () => {
    const jdInput = document.getElementById('jd-input');
    const scoutBtn = document.getElementById('scout-btn');
    const scoutLoader = document.getElementById('scout-loader');
    const resultsPanel = document.getElementById('results-panel');
    const candidatesList = document.getElementById('candidates-list');
    
    // Config
    const apiKeyInput = document.getElementById('api-key-input');
    const saveKeyBtn = document.getElementById('save-key-btn');
    
    // Chat Modal
    const chatModal = document.getElementById('chat-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const chatCandidateName = document.getElementById('chat-candidate-name');
    const chatCandidateRole = document.getElementById('chat-candidate-role');
    const modalInterestBadge = document.getElementById('modal-interest-badge');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendMsgBtn = document.getElementById('send-msg-btn');
    
    let currentCandidateId = null;
    let chatHistory = [];
    let stateCandidates = [];

    // Setup Config
    saveKeyBtn.addEventListener('click', async () => {
        const key = apiKeyInput.value.trim();
        if(!key) return;
        saveKeyBtn.textContent = 'Saving...';
        try {
            await fetch('/api/config', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({api_key: key})
            });
            saveKeyBtn.textContent = 'Saved';
            setTimeout(() => saveKeyBtn.textContent = 'Save Key', 2000);
        } catch(e) {
            saveKeyBtn.textContent = 'Error';
        }
    });

    // Scout Candidates
    scoutBtn.addEventListener('click', async () => {
        const jd = jdInput.value.trim();
        if(!jd) return;

        scoutBtn.classList.add('hidden');
        scoutLoader.classList.remove('hidden');
        resultsPanel.classList.add('hidden');
        candidatesList.innerHTML = '';

        try {
            const res = await fetch('/api/agents/scout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({job_description: jd})
            });
            const data = await res.json();
            
            if(data.status === 'success') {
                stateCandidates = data.candidates.map(c => ({
                    ...c,
                    final_score: Math.round((c.match_score * 0.6) + ((c.interest_score || 0) * 0.4))
                }));
                stateCandidates.sort((a,b) => b.final_score - a.final_score);
                renderCandidates();
                resultsPanel.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error scouting:', error);
            alert('Failed to scout candidates.');
        } finally {
            scoutBtn.classList.remove('hidden');
            scoutLoader.classList.add('hidden');
        }
    });

    function getScoreClass(score) {
        if(score >= 75) return 'score-high';
        if(score >= 50) return 'score-med';
        return 'score-low';
    }

    function renderCandidates() {
        candidatesList.innerHTML = stateCandidates.map(c => `
            <div class="candidate-row" id="card-${c.id}">
                <div class="candidate-header">
                    <div class="candidate-info">
                        <h3>${c.name}</h3>
                        <div class="candidate-role">${c.role}</div>
                    </div>
                    <button class="btn-secondary" onclick="openChat('${c.id}')">
                        Evaluate Interest
                    </button>
                </div>
                
                <div class="score-group">
                    <div class="score-col ${getScoreClass(c.match_score)}">
                        <span class="score-label">Match</span>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${c.match_score}%"></div>
                        </div>
                        <span class="score-text">${c.match_score}%</span>
                    </div>
                    
                    <div class="score-col ${getScoreClass(c.interest_score)}">
                        <span class="score-label">Interest</span>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${c.interest_score}%"></div>
                        </div>
                        <span class="score-text">${c.interest_score}%</span>
                    </div>

                    <div class="score-col ${getScoreClass(c.final_score)}">
                        <span class="score-label">Final</span>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${c.final_score}%"></div>
                        </div>
                        <span class="score-text">${c.final_score}%</span>
                    </div>
                </div>

                <div class="explanation">
                    <strong>Breakdown:</strong> ${c.explanation}
                </div>
            </div>
        `).join('');
    }

    // Modal Handling
    window.openChat = (id) => {
        const c = stateCandidates.find(idx => idx.id === id);
        if(!c) return;

        currentCandidateId = id;
        chatCandidateName.textContent = c.name;
        chatCandidateRole.textContent = c.role;
        modalInterestBadge.textContent = `Interest: ${c.interest_score}%`;

        chatHistory = [];
        chatMessages.innerHTML = '<div class="sys-msg">Simulation Started. Assess candidate interest.</div>';
        chatModal.classList.remove('hidden');
    };

    closeModalBtn.addEventListener('click', () => {
        chatModal.classList.add('hidden');
    });

    // Chat functionality
    async function sendMessage() {
        const msg = chatInput.value.trim();
        if(!msg || !currentCandidateId) return;

        appendMessage('user', msg);
        chatInput.value = '';
        
        const loaderDiv = document.createElement('div');
        loaderDiv.className = 'sys-msg';
        loaderDiv.textContent = 'Typing...';
        chatMessages.appendChild(loaderDiv);
        
        try {
            const res = await fetch('/api/agents/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    candidate_id: currentCandidateId,
                    message: msg,
                    history: chatHistory
                })
            });
            const data = await res.json();
            loaderDiv.remove();
            
            if(data.status === 'success') {
                appendMessage('bot', data.reply);
                
                chatHistory.push({sender: 'Recruiter', text: msg});
                chatHistory.push({sender: 'Candidate', text: data.reply});

                // Update candidate State globally
                const cIndex = stateCandidates.findIndex(idx => idx.id === currentCandidateId);
                if(cIndex !== -1) {
                    stateCandidates[cIndex].interest_score = data.interest_score;
                    stateCandidates[cIndex].final_score = Math.round((stateCandidates[cIndex].match_score * 0.6) + (data.interest_score * 0.4));
                    
                    modalInterestBadge.textContent = `Interest: ${data.interest_score}%`;
                    renderCandidates(); // re-render the list to update progress bars visually
                }
            }
        } catch(e) {
            loaderDiv.remove();
        }
    }

    sendMsgBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendMessage();
    });

    function appendMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
