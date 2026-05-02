(function () {
  const history = [];

  const widgetHTML = `
  <div class="help-widget" id="helpWidget">
    <button class="btn-help-text" id="btnHelpText">Precisa de Ajuda?</button>
    <button class="btn-help-avatar" id="btnHelpAvatar" aria-label="Assistente">
      <span class="badge" id="chatBadge">1</span>
      <img src="img/persona.png" alt="Assistente" />
    </button>
  </div>

  <div class="chat-overlay" id="chatOverlay">
    <div class="chat-box" id="chatBox">
      <div class="chat-header">
        <div class="chat-header-info">
          <img src="img/persona.png" alt="Prof. Xande" class="chat-avatar-img" />
          <div>
            <span class="chat-name">Professor Xande Bezerra</span>
            <span class="chat-badge-label">BETA</span>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="chat-btn-icon" id="btnClear" title="Limpar conversa">&#x1F5D1;</button>
          <button class="chat-btn-icon" id="btnExpand" title="Expandir">&#x26F6;</button>
          <button class="chat-btn-icon" id="btnClose" title="Fechar">&#x2715;</button>
        </div>
      </div>

      <div class="chat-messages" id="chatMessages">
        <div class="chat-msg assistant">
          <img src="img/persona.png" alt="Prof. Xande" class="msg-avatar" />
          <div class="msg-bubble">
            Oi, meu filho! Beleza? Eu sou o Professor Xande Bezerra, mas pode me chamar de Prof. Xande! Aqui pra tirar suas dúvidas de Geografia e História a qualquer hora. Bora estudar? 📚
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <textarea id="chatInput" class="chat-input" placeholder="Digite sua mensagem aqui..." rows="1"></textarea>
        <button class="chat-send-btn" id="btnSend">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  const overlay   = document.getElementById('chatOverlay');
  const chatBox   = document.getElementById('chatBox');
  const messages  = document.getElementById('chatMessages');
  const input     = document.getElementById('chatInput');
  const btnSend   = document.getElementById('btnSend');
  const btnClose  = document.getElementById('btnClose');
  const btnExpand = document.getElementById('btnExpand');
  const btnClear  = document.getElementById('btnClear');
  const btnAvatar = document.getElementById('btnHelpAvatar');
  const btnText   = document.getElementById('btnHelpText');
  const badge     = document.getElementById('chatBadge');

  let isOpen     = false;
  let isExpanded = false;

  function openChat() {
    isOpen = true;
    overlay.classList.add('active');
    badge.style.display = 'none';
    input.focus();
  }

  function closeChat() {
    isOpen = false;
    overlay.classList.remove('active');
  }

  btnAvatar.addEventListener('click', () => isOpen ? closeChat() : openChat());
  btnText.addEventListener('click',   () => isOpen ? closeChat() : openChat());
  btnClose.addEventListener('click',  closeChat);

  btnClear.addEventListener('click', () => {
    history.length = 0;
    messages.innerHTML = `
      <div class="chat-msg assistant">
        <img src="img/persona.png" alt="Prof. Xande" class="msg-avatar" />
        <div class="msg-bubble">
          Oi, meu filho! Beleza? Eu sou o Professor Xande Bezerra, mas pode me chamar de Prof. Xande! Aqui pra tirar suas dúvidas de Geografia e História a qualquer hora. Bora estudar? 📚
        </div>
      </div>`;
  });

  btnExpand.addEventListener('click', () => {
    isExpanded = !isExpanded;
    chatBox.classList.toggle('expanded', isExpanded);
    btnExpand.innerHTML = isExpanded ? '&#x2922;' : '&#x26F6;';
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  btnSend.addEventListener('click', sendMessage);

  function appendMessage(role, text) {
    const isAssistant = role === 'assistant';
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.innerHTML = isAssistant
      ? `<img src="img/persona.png" alt="Prof. Xande" class="msg-avatar" /><div class="msg-bubble">${text}</div>`
      : `<div class="msg-bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg assistant';
    div.id = 'typingIndicator';
    div.innerHTML = `
      <img src="img/persona.png" alt="Prof. Xande" class="msg-avatar" />
      <div class="msg-bubble typing-bubble">
        <span></span><span></span><span></span>
      </div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';
    btnSend.disabled = true;

    appendMessage('user', text);
    history.push({ role: 'user', content: text });

    showTyping();

    try {
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content
        || 'Eita, deu um erro aqui! Tenta de novo, meu filho. 😅';

      removeTyping();
      appendMessage('assistant', reply);
      history.push({ role: 'assistant', content: reply });

    } catch (err) {
      removeTyping();
      appendMessage('assistant', 'Poxa, tive um probleminha técnico! Verifique se o servidor está rodando e tenta de novo. 😅');
    }

    btnSend.disabled = false;
    input.focus();
  }
})();