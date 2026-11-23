/**
 * Chatbot FAQ Widget
 */
(function () {
  // Evita inicialização duplicada na página
  if (window.chatbotInicializado) return;
  window.chatbotInicializado = true;

  // 1. ESTILOS CSS
  const cssStyles = `
    #faq-chatbot-widget {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 99999999 !important;
    }

    #faq-toggle-btn {
      width: 60px !important;
      height: 60px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, rgb(200, 39, 214), rgb(202, 46, 194)) !important;
      color: #ffffff !important;
      border: none !important;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      outline: none !important;
    }

    #faq-toggle-btn svg {
      width: 28px !important;
      height: 28px !important;
      fill: #ffffff !important;
      pointer-events: none !important;
    }

    #faq-chat-window {
      position: fixed !important;
      bottom: 90px !important;
      right: 20px !important;
      width: 360px !important;
      max-width: calc(100vw - 40px) !important;
      height: 500px !important;
      max-height: calc(100vh - 120px) !important;
      background-color: #ffffff !important;
      border-radius: 16px !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      z-index: 99999999 !important;
    }

    /* Especificidade maior (#id.classe) para vencer o display: flex !important */
    #faq-chat-window.faq-hidden {
      display: none !important;
    }

    .faq-header {
      background: linear-gradient(135deg, #2563eb, rgb(194, 50, 182)) !important;
      color: #ffffff !important;
      padding: 14px 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
    }

    .faq-header-actions {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
    }

    .faq-header h3 {
      margin: 0 !important;
      font-size: 15px !important;
      color: #ffffff !important;
    }

    .faq-icon-btn {
      background: transparent !important;
      border: none !important;
      color: #ffffff !important;
      font-size: 18px !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 4px !important;
      opacity: 0.85;
    }

    .faq-icon-btn:hover {
      opacity: 1;
    }

    #faq-messages {
      flex: 1 !important;
      padding: 14px !important;
      overflow-y: auto !important;
      background-color: #f8fafc !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
    }

    .faq-msg {
      max-width: 82% !important;
      padding: 10px 12px !important;
      border-radius: 12px !important;
      font-size: 14px !important;
      line-height: 1.4 !important;
    }

    .faq-msg.bot {
      align-self: flex-start !important;
      background-color: #ffffff !important;
      color: #1e293b !important;
      border: 1px solid #e2e8f0 !important;
    }

    .faq-msg.user {
      align-self: flex-end !important;
      background-color: rgb(169, 27, 235) !important;
      color: #ffffff !important;
    }

    .faq-msg.system-info {
      align-self: center !important;
      background-color: #e0f2fe !important;
      color: #0369a1 !important;
      font-size: 12px !important;
      border-radius: 8px !important;
      padding: 6px 10px !important;
      text-align: center !important;
    }

    .faq-options {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 6px !important;
      margin-top: 4px !important;
    }

    .faq-chip {
      background-color: #eff6ff !important;
      color: #2563eb !important;
      border: 1px solid #bfdbfe !important;
      padding: 8px 12px !important;
      border-radius: 16px !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
    }

    .faq-chip:hover {
      background-color: #dbeafe !important;
    }

    .faq-footer {
      padding: 12px !important;
      background-color: #ffffff !important;
      border-top: 1px solid #e2e8f0 !important;
    }

    .faq-input-area {
      display: flex !important;
      gap: 8px !important;
      margin: 0 !important;
    }

    #faq-input {
      flex: 1 !important;
      padding: 10px 14px !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 20px !important;
      font-size: 14px !important;
      outline: none !important;
    }

    #faq-send-btn {
      background-color: #2563eb !important;
      color: #ffffff !important;
      border: none !important;
      width: 38px !important;
      height: 38px !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    #faq-send-btn svg {
      width: 18px !important;
      height: 18px !important;
      fill: #ffffff !important;
    }
  `;

  // 2. ESTRUTURA HTML
  const htmlTemplate = `
    <button id="faq-toggle-btn" type="button" aria-label="Abrir ou Fechar Chatbot">
      <svg id="faq-icon-open" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
      </svg>
      <svg id="faq-icon-close" viewBox="0 0 24 24" style="display: none;">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>

    <div id="faq-chat-window" class="faq-hidden">
      <div class="faq-header">
        <h3>Atendimento Virtual</h3>
        <div class="faq-header-actions">
          <label for="faq-json-file" class="faq-icon-btn" title="Anexar base JSON extra">📁</label>
          <input type="file" id="faq-json-file" accept=".json" style="display: none;" />
          <button type="button" id="faq-close-btn" class="faq-icon-btn" aria-label="Fechar Chatbot">✕</button>
        </div>
      </div>
      <div id="faq-messages"></div>
      <div class="faq-footer">
        <div class="faq-input-area">
          <input type="text" id="faq-input" placeholder="Digite sua pergunta..." autocomplete="off" />
          <button type="button" id="faq-send-btn" aria-label="Enviar">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // 3. BASE DE DADOS PADRÃO
  // 3. BASE DE DADOS PADRÃO (Aparecem como botões no menu inicial)
  const FAQ_PADRAO = [
    { titulo: "🕒 Horário de Atendimento", keywords: ["horario", "horas", "funciona", "aberto"], resposta: "Atendemos de **Segunda a Domingo, das 08h às 19h**." },
    { titulo: "💳 Formas de Pagamento", keywords: ["pagamento", "pagar", "pix", "cartao", "boleto"], resposta: "Aceitamos **Pix com desconto**, **Cartão até 12x** e **Boleto**." },
    { titulo: "📍 Localização / Endereço", keywords: ["onde", "endereco", "localizacao", "fica"], resposta: "Estamos na **R. Boa Aventura do Amaral, nº 229 - Pt. Preta**." },
    { titulo: "📞 Falar com Tia Paloma", keywords: ["contato", "atendente", "whatsapp", "telefone"], resposta: "Fale comigo pelo **WhatsApp: +55 19 99582-0167**." }
  ];

  // BANCO DE DADOS PARA PERGUNTAS DIGITADAS (Adicione quantas quiser aqui)
  const BANCO_PERGUNTAS = [
    {
      pergunta: "Como redefinir a minha senha?",
      keywords: ["senha", "redefinir", "esqueci", "trocar", "acesso"],
      resposta: "Para redefinir a sua senha, vá à página de login e clique em **'Esqueci a minha senha'**."
    },
    {
      pergunta: "Você aceita cachorro de porte-médio?",
      keywords: ["porte", "médio", "medio", "cachorro"],
      resposta: "Sim, aceito o seu pet de porte-médio."
    },
    {
      pergunta: "Você aceita cachorro de porte-grande?",
      keywords: ["grande", "porte grande", "porte-grande"],
      resposta: "Sim, aceito o seu pet de porte-grande."
    },
    {
      pergunta: "Você aceita cachorro de porte-pequeno?",
      keywords: ["pequeno", "porte grande", "porte-grande"],
      resposta: "Sim, aceito o seu pet de porte-pequeno."
    },
    {
      pergunta: "O que meu pet precisa levar junto?",
      keywords: ["levar", "coisas", "comida", "coleira", "cama", "caminha", "brinquedo", "Bagagem"],
      resposta: "O que é necessário para o seu amicão levar junto é comida e coleira. Caso o seu pet precise tomar remédio, traga. É opcional trazer sachê, brinquedo e caminha"
    },
    {
      pergunta: "Você tem algum outro tipo de contato?",
      keywords: ["Contato", "Email", "conversar", "Instagram"],
      resposta: "Você pode conversar comigo pelo email (thorchantilly@gmail.com), Telefone (19 99582-0167) e pelo Instagram (um_hotel_bom_para_cachorro)."
    }
  ];

  // Junta os botões iniciais com o banco de perguntas digitadas
  let baseConhecimento = [...FAQ_PADRAO, ...BANCO_PERGUNTAS];
  // 4. FUNÇÃO DE INICIALIZAÇÃO
  window.initChatbot = function (opcoes = {}) {
    if (document.getElementById("faq-chatbot-widget")) return;

    // Injeta Estilos
    const styleTag = document.createElement("style");
    styleTag.textContent = cssStyles;
    document.head.appendChild(styleTag);

    // Injeta Widget na Raiz do Body
    const container = document.createElement("div");
    container.id = "faq-chatbot-widget";
    container.innerHTML = htmlTemplate;
    document.body.appendChild(container);

    const toggleBtn = document.getElementById("faq-toggle-btn");
    const closeBtn = document.getElementById("faq-close-btn");
    const chatWindow = document.getElementById("faq-chat-window");
    const iconOpen = document.getElementById("faq-icon-open");
    const iconClose = document.getElementById("faq-icon-close");
    const messagesBox = document.getElementById("faq-messages");
    const sendBtn = document.getElementById("faq-send-btn");
    const input = document.getElementById("faq-input");
    const jsonFileInput = document.getElementById("faq-json-file");

    function addMessage(texto, tipo) {
      const div = document.createElement("div");
      div.className = `faq-msg ${tipo}`;
      div.innerHTML = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      messagesBox.appendChild(div);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    function carregarMenuInicial() {
      messagesBox.innerHTML = "";
      addMessage("Olá! 👋 Como posso ajudar você hoje?", "bot");

      const optsContainer = document.createElement("div");
      optsContainer.className = "faq-options";

      FAQ_PADRAO.forEach(item => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "faq-chip";
        btn.innerText = item.titulo;
        btn.addEventListener("click", () => {
          addMessage(item.titulo, "user");
          setTimeout(() => addMessage(item.resposta, "bot"), 200);
        });
        optsContainer.appendChild(btn);
      });

      messagesBox.appendChild(optsContainer);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    function normalizarTexto(txt) {
      return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, "");
    }

    function buscarResposta(textoUsuario) {
      const queryNorm = normalizarTexto(textoUsuario);
      const palavrasUsuario = queryNorm.split(/\s+/).filter(w => w.length > 2);

      let melhorMatch = null;
      let maiorPontuacao = 0;

      baseConhecimento.forEach(item => {
        let pontos = 0;
        const pergunta = normalizarTexto(item.titulo || item.pergunta || "");
        const resposta = normalizarTexto(item.resposta || "");

        if (pergunta.includes(queryNorm)) pontos += 10;

        palavrasUsuario.forEach(palavra => {
          if (pergunta.includes(palavra)) pontos += 3;
          if (resposta.includes(palavra)) pontos += 1;
          if (item.keywords && Array.isArray(item.keywords)) {
            item.keywords.forEach(kw => {
              if (normalizarTexto(kw).includes(palavra)) pontos += 4;
            });
          }
        });

        if (pontos > maiorPontuacao) {
          maiorPontuacao = pontos;
          melhorMatch = item;
        }
      });

      if (melhorMatch && maiorPontuacao >= 3) {
        return melhorMatch.resposta;
      }
      return "Não encontrei essa informação na minha base de dados. 😅 Tente selecionar uma das opções do menu ou refazer a pergunta.";
    }

    function dispararEnvio() {
      const txt = input.value.trim();
      if (!txt) return;

      addMessage(txt, "user");
      input.value = "";

      setTimeout(() => {
        addMessage(buscarResposta(txt), "bot");
      }, 300);
    }

    function abrirChat() {
      chatWindow.classList.remove("faq-hidden");
      iconOpen.style.display = "none";
      iconClose.style.display = "block";
      input.focus();
    }

    function fecharChat(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      chatWindow.classList.add("faq-hidden");
      iconOpen.style.display = "block";
      iconClose.style.display = "none";
    }

    function toggleChat() {
      const estaFechado = chatWindow.classList.contains("faq-hidden");
      if (estaFechado) {
        abrirChat();
      } else {
        fecharChat();
      }
    }

    // Carregar JSON via parâmetro opcional
    if (opcoes.jsonUrl) {
      fetch(opcoes.jsonUrl)
        .then(res => res.json())
        .then(dados => {
          if (Array.isArray(dados)) {
            baseConhecimento = [...FAQ_PADRAO, ...dados];
            addMessage(`📂 Base extra carregada (${dados.length} itens)`, "system-info");
          }
        })
        .catch(err => console.error("Erro ao carregar JSON:", err));
    }

    // Carregar JSON via Upload
    jsonFileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (evt) {
        try {
          const json = JSON.parse(evt.target.result);
          if (Array.isArray(json)) {
            baseConhecimento = [...FAQ_PADRAO, ...json];
            addMessage(`📂 Base extra carregada (${json.length} itens)`, "system-info");
          }
        } catch (err) {
          alert("Ficheiro JSON inválido.");
        }
      };
      reader.readAsText(file);
    });

    // Eventos de abrir, fechar e enviar
    toggleBtn.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", fecharChat);
    sendBtn.addEventListener("click", dispararEnvio);

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        dispararEnvio();
      }
    });

    // Renderiza o menu inicial imediatamente na montagem
    carregarMenuInicial();
  };

  // Auto-execução ao carregar a página
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      window.initChatbot();
    });
  } else {
    window.initChatbot();
  }
  // Auto-execução ao carregar a página
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    window.initChatbot({ jsonUrl: "perguntas.json" });
  });
} else {
  window.initChatbot({ jsonUrl: "perguntas.json" });
}
})();