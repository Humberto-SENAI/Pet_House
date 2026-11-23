document.addEventListener("DOMContentLoaded", function () {
  const formAvaliacao = document.getElementById("form-nova-avaliacao");
  const listaAvaliacoes = document.getElementById("lista-avaliacoes");
  const contadorAvaliacoes = document.getElementById("contador-avaliacoes");

  if (!formAvaliacao) return;

  formAvaliacao.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("aval-nome").value.trim();
    const pet = document.getElementById("aval-pet").value.trim();
    const nota = parseInt(document.getElementById("aval-nota").value, 10);
    const comentario = document.getElementById("aval-comentario").value.trim();

    if (!nome || !pet || !comentario) return;

    const inicial = nome.charAt(0).toUpperCase();
    const estrelas = "⭐".repeat(nota);

    const novoCard = document.createElement("article");
    novoCard.className = "avaliacao-item";

    const cabecalho = document.createElement("div");
    cabecalho.className = "avaliacao-cabecalho";

    const autorDiv = document.createElement("div");
    autorDiv.className = "avaliacao-autor";

    const avatarDiv = document.createElement("div");
    avatarDiv.className = "avatar-letra";
    avatarDiv.textContent = inicial;

    const infoDiv = document.createElement("div");
    const nomeStrong = document.createElement("strong");
    nomeStrong.textContent = nome;

    const dataSpan = document.createElement("span");
    dataSpan.className = "avaliacao-data";
    dataSpan.textContent = `Agora mesmo • Tutor(a) de ${pet}`;

    infoDiv.appendChild(nomeStrong);
    infoDiv.appendChild(dataSpan);
    autorDiv.appendChild(avatarDiv);
    autorDiv.appendChild(infoDiv);

    const estrelasDiv = document.createElement("div");
    estrelasDiv.className = "avaliacao-estrelas";
    estrelasDiv.textContent = estrelas;

    cabecalho.appendChild(autorDiv);
    cabecalho.appendChild(estrelasDiv);

    const textoP = document.createElement("p");
    textoP.className = "avaliacao-texto";
    textoP.textContent = comentario;

    novoCard.appendChild(cabecalho);
    novoCard.appendChild(textoP);

    listaAvaliacoes.prepend(novoCard);

    // Atualiza o contador total de avaliações
    const totalAtual = parseInt(contadorAvaliacoes.textContent, 10) || 616;
    contadorAvaliacoes.textContent = totalAtual + 1;

    formAvaliacao.reset();
  });
});