document.addEventListener("DOMContentLoaded", function () {
  const cardsFotos = document.querySelectorAll(".Foto-Galeria");
  const btnVerFotos = document.querySelector(".btn-ver-fotos");

  // Modal "Todas as fotos"
  const modalTodasFotos = document.getElementById("modal-todas-fotos");
  const modalFotosTitulo = document.getElementById("modal-fotos-titulo");
  const gradeTodasFotos = document.getElementById("grade-todas-fotos");
  const btnFecharTodasFotos = document.getElementById("btn-fechar-todas-fotos");

  // Lightbox (tela cheia)
  const lightbox = document.getElementById("lightbox-galeria");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxLegenda = document.getElementById("lightbox-legenda");
  const btnFecharLightbox = document.getElementById("lightbox-fechar");
  const btnAnterior = document.getElementById("lightbox-anterior");
  const btnProximo = document.getElementById("lightbox-proximo");

  if (!lightbox || cardsFotos.length === 0) return;

  // Fotos extras que aparecem ao clicar em "Ver fotos" (adicione quantas quiser)
  const FOTOS_EXTRAS = [
    // Exemplo:
    // { src: "passeio.jpg", alt: "Hora do passeio supervisionado no bairro" },
    // { src: "camas.jpg", alt: "Cantinho de descanso dentro de casa" }
    { src: "Beagles_Sentados.jpg", alt: "Cachorros no sofá" },
    { src: "Pug.jpg", alt: "Pug feliz" },
    { src: "Anitta.jpg", alt: "Beagle pedindo comida "},
    { src: "Pequenos.jpg", alt: "Irmãozinhos juntos" },
    { src: "Golden.jpg", alt: "Beagle aproveitando o sol"},
    { src: "Beagles_Sentados.jpg", alt: "Beagles sentados no sofá" },
    { src: "Sirius.jpg", alt: "Olhar de mil jardas"},
    { src: "Familia.jpg", alt: "Família de Beagles"},
    { src: "Quintal_Casa.jpg", alt: "Quintal de casa"},
    { src: "Beagle_Velinho.jpg", alt: "Velinho aproveitando o sol"}
  ];

  // Junta as fotos visíveis no mosaico com as fotos extras
  const fotosMosaico = Array.from(cardsFotos)
    .map((card) => card.querySelector("img"))
    .filter(Boolean)
    .map((img) => ({
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "Foto da hospedagem",
    }));

  const todasAsFotos = [...fotosMosaico, ...FOTOS_EXTRAS];
  let indiceAtual = 0;

  // --- FUNÇÕES DO LIGHTBOX ---
  function mostrarFotoLightbox(indice) {
    if (todasAsFotos.length === 0) return;
    indiceAtual = (indice + todasAsFotos.length) % todasAsFotos.length;
    const foto = todasAsFotos[indiceAtual];
    lightboxImg.src = foto.src;
    lightboxImg.alt = foto.alt;
    lightboxLegenda.textContent = `${indiceAtual + 1} / ${todasAsFotos.length} — ${foto.alt}`;
  }

  function abrirLightbox(indice) {
    mostrarFotoLightbox(indice);
    lightbox.classList.remove("lightbox-oculto");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function fecharLightbox() {
    lightbox.classList.add("lightbox-oculto");
    lightbox.setAttribute("aria-hidden", "true");
  }

  // --- FUNÇÕES DO MODAL "TODAS AS FOTOS" ---
  function renderizarGradeFotos() {
    if (!gradeTodasFotos) return;
    gradeTodasFotos.innerHTML = "";

    if (modalFotosTitulo) {
      modalFotosTitulo.textContent = `Todas as fotos (${todasAsFotos.length})`;
    }

    todasAsFotos.forEach((foto, index) => {
      const item = document.createElement("div");
      item.className = "item-grade-foto";

      const img = document.createElement("img");
      img.src = foto.src;
      img.alt = foto.alt;

      const legenda = document.createElement("span");
      legenda.textContent = foto.alt;

      item.appendChild(img);
      item.appendChild(legenda);

      // Ao clicar em uma miniatura da grade, abre ela ampliada no lightbox
      item.addEventListener("click", function () {
        abrirLightbox(index);
      });

      gradeTodasFotos.appendChild(item);
    });
  }

  function abrirTodasFotos(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Impede de abrir a foto de fundo ao clicar no botão
    }
    if (!modalTodasFotos) return;
    renderizarGradeFotos();
    modalTodasFotos.classList.remove("modal-fotos-oculto");
    modalTodasFotos.setAttribute("aria-hidden", "false");
  }

  function fecharTodasFotos() {
    if (!modalTodasFotos) return;
    modalTodasFotos.classList.add("modal-fotos-oculto");
    modalTodasFotos.setAttribute("aria-hidden", "true");
  }

  // --- EVENTOS ---
  cardsFotos.forEach((card, index) => {
    card.addEventListener("click", () => abrirLightbox(index));
  });

  if (btnVerFotos) {
    btnVerFotos.addEventListener("click", abrirTodasFotos);
  }

  if (btnFecharTodasFotos) {
    btnFecharTodasFotos.addEventListener("click", fecharTodasFotos);
  }

  if (modalTodasFotos) {
    modalTodasFotos.addEventListener("click", (e) => {
      if (e.target === modalTodasFotos) fecharTodasFotos();
    });
  }

  btnFecharLightbox.addEventListener("click", fecharLightbox);
  btnAnterior.addEventListener("click", () => mostrarFotoLightbox(indiceAtual - 1));
  btnProximo.addEventListener("click", () => mostrarFotoLightbox(indiceAtual + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) fecharLightbox();
  });

  document.addEventListener("keydown", (e) => {
    // Se o lightbox estiver aberto, fecha ele primeiro
    if (!lightbox.classList.contains("lightbox-oculto")) {
      if (e.key === "Escape") fecharLightbox();
      if (e.key === "ArrowLeft") mostrarFotoLightbox(indiceAtual - 1);
      if (e.key === "ArrowRight") mostrarFotoLightbox(indiceAtual + 1);
      return;
    }

    // Se apenas o modal de todas as fotos estiver aberto, fecha no Esc
    if (modalTodasFotos && !modalTodasFotos.classList.contains("modal-fotos-oculto")) {
      if (e.key === "Escape") fecharTodasFotos();
    }
  });
});
