document.addEventListener("DOMContentLoaded", function () {
  const btnFalePaloma = document.getElementById("btn-fale-paloma");
  const btnIniciarConversa = document.getElementById("btn-iniciar-conversa");

  function abrirChatbotNaTela(event) {
    if (event) event.preventDefault();

    const chatWindow = document.getElementById("faq-chat-window");
    const toggleBtn = document.getElementById("faq-toggle-btn");
    const chatInput = document.getElementById("faq-input");

    if (!chatWindow || !toggleBtn) return;

    // Só clica no botão flutuante se a janela do chat ainda estiver fechada
    if (chatWindow.classList.contains("faq-hidden")) {
      toggleBtn.click();
    }

    if (chatInput) {
      setTimeout(() => chatInput.focus(), 100);
    }
  }

  if (btnFalePaloma) {
    btnFalePaloma.addEventListener("click", abrirChatbotNaTela);
  }

  if (btnIniciarConversa) {
    btnIniciarConversa.addEventListener("click", abrirChatbotNaTela);
  }
});