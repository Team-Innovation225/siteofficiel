document.addEventListener("DOMContentLoaded", function () {
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --bot-primary: #0078d7; --bot-bg: #ffffff; --bot-msg-bg: #f0f2f5; --bot-text: #333; --bot-user-text: #fff; --bot-shadow: 0 12px 28px rgba(0, 0, 0, 0.15); --bot-radius: 18px; --z-index: 9999; }

        #bot-launcher { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: var(--bot-primary); color: white; border-radius: 50%; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer; z-index: var(--z-index); display: flex; align-items: center; justify-content: center; font-size: 30px; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        #bot-launcher:hover { transform: scale(1.1); }
        #bot-launcher.hidden { transform: scale(0); opacity: 0; pointer-events: none; }

        #bot-window { position: fixed; bottom: 90px; right: 20px; width: 380px; height: 550px; background: var(--bot-bg); border-radius: var(--bot-radius); box-shadow: var(--bot-shadow); display: flex; flex-direction: column; overflow: hidden; z-index: var(--z-index); font-family: 'Segoe UI', system-ui, sans-serif; opacity: 0; transform: translateY(20px) scale(0.95); pointer-events: none; transition: all 0.3s ease; }
        #bot-window.active { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

        .bot-header { background: var(--bot-primary); color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
        .bot-close { cursor: pointer; font-size: 1.2rem; opacity: 0.8; transition:0.2s; }
        .bot-close:hover { opacity: 1; }

        .bot-messages { flex: 1; padding: 15px; overflow-y: auto; background: #fff; scroll-behavior: smooth; position: relative; }

        .msg-row { display: flex; margin-bottom: 10px; opacity: 0; animation: slideIn 0.3s forwards; }
        .msg-row.user { justify-content: flex-end; }
        .msg-bubble { max-width: 80%; padding: 10px 14px; border-radius: 18px; font-size: 0.95rem; line-height: 1.4; word-wrap: break-word; }
        .msg-row.bot .msg-bubble { background: var(--bot-msg-bg); color: var(--bot-text); border-bottom-left-radius: 4px; }
        .msg-row.user .msg-bubble { background: var(--bot-primary); color: var(--bot-user-text); border-bottom-right-radius: 4px; }

        .bot-input-area { border-top: 1px solid #eee; padding: 10px; display: flex; align-items: center; background: #fff; gap: 8px; }
        .bot-input { flex: 1; border: 1px solid #ddd; border-radius: 20px; padding: 10px 15px; outline: none; font-size: 0.95rem; transition: border-color 0.2s; }
        .bot-input:focus { border-color: var(--bot-primary); }
        .bot-btn-send, .bot-btn-sug { background: none; border: none; cursor: pointer; color: var(--bot-primary); font-size: 1.2rem; padding: 5px; transition: transform 0.2s; }
        .bot-btn-send:hover, .bot-btn-sug:hover { transform: scale(1.1); }

        .bot-suggestions-drawer { position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(255,255,255,0.98); backdrop-filter: blur(5px); border-top: 1px solid #eee; border-top-left-radius: 20px; border-top-right-radius: 20px; padding: 20px 15px; transform: translateY(110%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 -5px 20px rgba(0,0,0,0.1); max-height: 60%; overflow-y: auto; z-index: 10; }
        .bot-suggestions-drawer.open { transform: translateY(0); }

        .sug-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 0.9rem; color: #888; font-weight: bold; }

        .sug-chip { display: block; width: 100%; text-align: left; padding: 10px 15px; margin-bottom: 8px; background: #f0f7ff; color: var(--bot-primary); border: 1px solid rgba(0, 120, 215, 0.2); border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
        .sug-chip:hover { background: var(--bot-primary); color: white; }

        .chat-choice-btn { background: #eef6ff; border: 1px solid #d6e8ff; padding: 6px 10px; border-radius: 10px; cursor: pointer; margin: 4px 6px 0 0; font-size: 0.9rem; }
        .chat-choice-btn:hover { background: #d6e8ff; }

        .typing { font-style: italic; color: #888; font-size: 0.8rem; margin-left: 10px; display: none; margin-bottom: 10px; }
        .typing span { animation: blink 1.4s infinite both; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }

        @media (max-width: 480px) {
            #bot-window { width: 100%; height: 100%; bottom: 0; right: 0; border-radius: 0; transform: translateY(100%); }
            #bot-window.active { transform: translateY(0); }
            #bot-launcher { bottom: 15px; right: 15px; }
            .bot-header { padding: 15px 20px; }
        }
    `;
    document.head.appendChild(style);

    function unique(array) { return Array.from(new Set(array)); }
    function formatList(arr, limit = 5) {
        if (arr.length === 0) return 'Aucun élément trouvé.';
        if (arr.length === 1) return arr[0];
        if (arr.length <= limit) return arr.join(', ').replace(/, ([^,]*)$/, ' et $1');
        return arr.slice(0, limit).join(', ') + ' et ' + (arr.length - limit) + ' autres';
    }

    function collectData() {
        const members = [];
        const projects = [];
        const skills = [];
        let contacts = { emails: [], links: [] };

        document.querySelectorAll('.team-grid .member-card').forEach(card => {
            const name = card.querySelector('.member-name')?.innerText.trim();
            const role = card.querySelector('.member-role')?.innerText.trim();
            if (name) members.push({ name, role });
        });
        document.querySelectorAll('.member-page').forEach(page => {
            const name = page.querySelector('.member-hero h1')?.innerText.trim();
            if (!name) return;
            const role = page.querySelector('.member-role')?.innerText.trim() || '';
            const bio = page.querySelector('.detail-section p')?.innerText.trim() || '';
            const contactEls = Array.from(page.querySelectorAll('.contact-grid a'));
            const emails = contactEls.filter(a => a.href.startsWith('mailto:')).map(a => a.href.replace('mailto:', ''));
            const links = contactEls.map(a => a.href).filter(h => !h.startsWith('mailto:'));
            
            const idx = members.findIndex(m => m.name === name);
            const details = { name, role, bio, emails, links };
            if (idx === -1) members.push(details);
            else members[idx] = { ...members[idx], ...details };
        });

        document.querySelectorAll('.project-item').forEach(item => {
            const title = item.querySelector('.project-title')?.innerText.trim();
            const desc = item.querySelector('.project-description')?.innerText.trim() || '';
            if (title) projects.push({ title, desc });
        });

        document.querySelectorAll('.skill-name').forEach(s => skills.push(s.innerText.trim()));

        contacts.emails = unique(Array.from(document.querySelectorAll('a[href^="mailto:"]')).map(a => a.href.replace('mailto:', '')));
        contacts.links = unique(Array.from(document.querySelectorAll('.contact-grid a')).map(a => a.href).filter(h => h && !h.startsWith('mailto:')));

        return { members, projects, skills: unique(skills).filter(Boolean), contacts };
    }

    let conversationContext = null;

    function findMemberByName(query, members) {
        if (!query) return null;
        const q = query.toLowerCase();
        return members.find(m => m.name && m.name.toLowerCase().includes(q));
    }

    function formatMemberDetails(m) {
        let resp = `<b>${m.name}</b>`;
        if (m.role) resp += ` - ${m.role}`;
        if (m.bio) resp += `<br><br><i>${m.bio}</i>`;
        if (m.emails && m.emails.length) resp += `<br>📧 <a href="mailto:${m.emails[0]}">${m.emails[0]}</a>`;
        if (m.links && m.links.length) resp += `<br>🔗 ${m.links.map(l => `<a href="${l}" target="_blank">Lien</a>`).join(' ')}`;
        return resp;
    }

    function getBotResponse(input) {
        const data = collectData();
        const cle = (input || '').toLowerCase().trim();

        if (conversationContext === 'waiting_member_selection') {
            if (cle === 'oui' || cle === 'o' || cle === 'yes' || cle === 'ok') {
                return "Lequel vous intéresse ? Tapez son prénom ou son nom pour obtenir plus de détails.";
            }
            if (cle === 'non' || cle === 'no') {
                conversationContext = null;
                return "D'accord. D'autres questions ?";
            }
            const found = findMemberByName(cle, data.members);
            if (found) {
                conversationContext = null;
                return formatMemberDetails(found);
            }
            return "Je n'ai pas trouvé ce nom. Tapez le nom exact ou répondez 'Non'.";
        }

        if (cle.match(/bonjour|salut|coucou|hello/)) {
            conversationContext = null;
            return 'Bonjour ! 👋 Je suis l\'assistant du portfolio. Je peux parler des projets, de l\'équipe ou des compétences.';
        }

        if (cle.includes('qui') || cle.includes('équipe') || cle.includes('team') || cle.includes('membres')) {
            if (data.members.length === 0) return "Je ne trouve pas la liste des membres ici.";
            const noms = data.members.map(m => m.name);
            conversationContext = 'waiting_member_selection';
            return `L'équipe est composée de : <b>${formatList(noms)}</b>.<br><br>Souhaitez-vous des détails sur un membre en particulier ? (Répondez "Oui" ou tapez son nom).`;
        }

        if (cle.includes('projet') || cle.includes('réalisations')) {
            if (data.projects.length === 0) return 'Aucun projet affiché pour le moment.';
            const titres = data.projects.map(p => `<b>${p.title}</b>` + (p.desc ? ` (${p.desc})` : ''));
            conversationContext = null;
            return `Nous avons travaillé sur : <br>• ${titres.join('<br>• ')}`;
        }

        if (cle.includes('compétence') || cle.includes('skill') || cle.includes('techno')) {
            if (data.skills.length === 0) return 'Nos compétences sont vastes mais non listées ici.';
            conversationContext = null;
            return `Notre stack technique inclut : ${formatList(data.skills, 10)}.`;
        }

        if (cle.includes('contact') || cle.includes('email') || cle.includes('joindre')) {
            if (data.contacts.emails.length === 0 && data.contacts.links.length === 0) return 'Consultez les fiches membres pour les contacts.';
            conversationContext = null;
            return `Vous pouvez nous joindre via :<br>${data.contacts.emails.join('<br>')}<br>${data.contacts.links.map(l => `<a href="${l}" target="_blank">Lien externe</a>`).join('<br>')}`;
        }

        const direct = findMemberByName(cle, data.members);
        if (direct) {
            conversationContext = null;
            return formatMemberDetails(direct);
        }

        return null;
    }

    const uiHTML = `
        <div id="bot-launcher">🤖</div>
        <div id="bot-window">
            <div class="bot-header">
                <span>Team Bot</span>
                <span class="bot-close">&times;</span>
            </div>
            <div class="bot-messages" id="bot-msgs"></div>
            
            <div class="typing" id="bot-typing">Team Innovation écrit<span>.</span><span>.</span><span>.</span></div>

            <div class="bot-input-area">
                <button class="bot-btn-sug" id="btn-toggle-sug" title="Suggestions">💡</button>
                <input type="text" class="bot-input" id="bot-input-field" placeholder="Posez une question..." autocomplete="off">
                <button class="bot-btn-send" id="bot-send">➤</button>
            </div>

            <div class="bot-suggestions-drawer" id="bot-drawer">
                <div class="sug-header">
                    <span>Suggestions</span>
                    <span style="cursor:pointer; font-size:1.2rem" id="close-drawer">&times;</span>
                </div>
                <div id="sug-content"></div>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = uiHTML;
    document.body.appendChild(container);

    const launcher = document.getElementById('bot-launcher');
    const windowEl = document.getElementById('bot-window');
    const closeBtn = document.querySelector('.bot-close');
    const msgsEl = document.getElementById('bot-msgs');
    const inputField = document.getElementById('bot-input-field');
    const sendBtn = document.getElementById('bot-send');
    const toggleSugBtn = document.getElementById('btn-toggle-sug');
    const drawerEl = document.getElementById('bot-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer');
    const sugContent = document.getElementById('sug-content');
    const typingEl = document.getElementById('bot-typing');

    function toggleChat() {
        const isActive = windowEl.classList.contains('active');
        if (isActive) {
            windowEl.classList.remove('active');
            launcher.classList.remove('hidden');
            conversationContext = null;
            drawerEl.classList.remove('open');
        } else {
            windowEl.classList.add('active');
            launcher.classList.add('hidden');
            setTimeout(() => inputField.focus(), 300);
        }
    }

    function toggleDrawer(forceClose = false) {
        if (forceClose) {
            drawerEl.classList.remove('open');
        } else {
            drawerEl.classList.toggle('open');
            if (drawerEl.classList.contains('open')) updateSuggestions();
        }
    }

    function addMessage(sender, html) {
        const row = document.createElement('div');
        row.className = `msg-row ${sender}`;
        const bubble = document.createElement('span');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = html;
        row.appendChild(bubble);
        msgsEl.appendChild(row);
        scrollToBottom();
    }

    function scrollToBottom() {
        msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function updateSuggestions() {
        sugContent.innerHTML = '';
        const basicSug = [
            { txt: '👋 Qui êtes-vous ?', val: 'qui etes vous' },
            { txt: '🚀 Voir les projets', val: 'projets' },
            { txt: '💻 Vos compétences', val: 'competences' },
            { txt: '📞 Comment contacter ?', val: 'contact' }
        ];

        const data = collectData();
        const memberSug = data.members.slice(0, 3).map(m => ({ txt: `👤 Info sur ${m.name}`, val: m.name }));
        
        [...basicSug, ...memberSug].forEach(s => {
            const btn = document.createElement('button');
            btn.className = 'sug-chip';
            btn.innerText = s.txt;
            btn.onclick = () => {
                handleInput(s.val);
                toggleDrawer(true);
            };
            sugContent.appendChild(btn);
        });
    }

    function handleInput(text) {
        if (!text) return;
        addMessage('user', text);
        inputField.value = '';
        typingEl.style.display = 'block';
        scrollToBottom();
        setTimeout(() => {
            const response = getBotResponse(text);
            typingEl.style.display = 'none';
            if (response) {
                addMessage('bot', response);
                if (conversationContext === 'waiting_member_selection') {
                    const dataForChoices = collectData();
                    const choices = dataForChoices.members.slice(0, 4).map(m => `<button class="chat-choice-btn" data-name="${m.name}">${m.name}</button>`).join(' ');
                    addMessage('bot', `Choisissez un membre pour voir les détails :<br>${choices}`);
                    const lastRow = msgsEl.lastElementChild;
                    if (lastRow) {
                        lastRow.querySelectorAll('.chat-choice-btn').forEach(btn => {
                            btn.addEventListener('click', () => {
                                const name = btn.dataset.name;
                                handleInput(name);
                            });
                        });
                    }

                    drawerEl.classList.add('open');
                    updateSuggestions();
                }
            } else {
                addMessage('bot', "Je n'ai pas compris. Essayez d'ouvrir les suggestions 💡.");
            }
        }, 600);
    }

    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    
    toggleSugBtn.addEventListener('click', () => toggleDrawer());
    closeDrawerBtn.addEventListener('click', () => toggleDrawer(true));

    sendBtn.addEventListener('click', () => handleInput(inputField.value.trim()));
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInput(inputField.value.trim());
    });

    setTimeout(() => {
        if (msgsEl.children.length === 0) {
            addMessage('bot', "Bonjour ! 👋<br>Je suis l'assistant virtuel. Je ne suis pas un modèle de chatbot , encore moins une IA, je ne suis qu'un simple programme qui scrappe cette page en essayant de vous donner quelques informations sur le portfolio. Posez-moi une question ou cliquez sur 💡 pour des idées.");
        }
    }, 1000);
});