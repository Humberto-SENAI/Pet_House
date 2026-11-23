document.addEventListener("DOMContentLoaded", function () {
  const tituloMesAno = document.getElementById("cal-mes-ano");
  const gradeDias = document.getElementById("cal-grade-dias");
  const btnAnterior = document.getElementById("cal-mes-anterior");
  const btnProximo = document.getElementById("cal-mes-proximo");
  const statusClique = document.getElementById("cal-status-clique");

  if (!gradeDias || !tituloMesAno) return;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  let mesExibido = hoje.getMonth();
  let anoExibido = hoje.getFullYear();

  const cacheDisponibilidade = {};

  function formatarChaveData(ano, mes, dia) {
    const m = String(mes + 1).padStart(2, "0");
    const d = String(dia).padStart(2, "0");
    return `${ano}-${m}-${d}`;
  }

  function formatarDataBR(ano, mes, dia) {
    const m = String(mes + 1).padStart(2, "0");
    const d = String(dia).padStart(2, "0");
    return `${d}/${m}/${ano}`;
  }

  function obterStatusDia(chaveData) {
    if (!cacheDisponibilidade[chaveData]) {
      const sorteio = Math.random();
      if (sorteio < 0.5) {
        cacheDisponibilidade[chaveData] = "totalmente-disponivel"; // Verde
      } else if (sorteio < 0.78) {
        cacheDisponibilidade[chaveData] = "com-hospedes"; // Azul
      } else {
        cacheDisponibilidade[chaveData] = "sem-vaga"; // Riscado
      }
    }
    return cacheDisponibilidade[chaveData];
  }

  function renderizarCalendario() {
    gradeDias.innerHTML = "";

    const dataReferencia = new Date(anoExibido, mesExibido, 1);
    const nomeMes = dataReferencia.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    tituloMesAno.textContent = nomeMes.replace(" de ", " ");

    // Ajusta o índice para semana começando na Segunda-feira (S=0 ... D=6)
    const espacosVazios = (dataReferencia.getDay() + 6) % 7;
    const totalDiasMes = new Date(anoExibido, mesExibido + 1, 0).getDate();

    for (let i = 0; i < espacosVazios; i++) {
      const vazio = document.createElement("span");
      vazio.className = "cal-celula";
      gradeDias.appendChild(vazio);
    }

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const dataCelula = new Date(anoExibido, mesExibido, dia);
      const chave = formatarChaveData(anoExibido, mesExibido, dia);
      const dataBR = formatarDataBR(anoExibido, mesExibido, dia);

      const btnDia = document.createElement("button");
      btnDia.type = "button";
      btnDia.className = "cal-celula";

      const spanNum = document.createElement("span");
      spanNum.className = "num-dia";
      spanNum.textContent = dia;
      btnDia.appendChild(spanNum);

      if (dataCelula < hoje) {
        btnDia.classList.add("passado");
        btnDia.disabled = true;
      } else {
        const status = obterStatusDia(chave);
        btnDia.classList.add(status);

        if (status === "totalmente-disponivel" || status === "com-hospedes") {
          const bolinha = document.createElement("span");
          bolinha.className = "bolinha-status";
          btnDia.appendChild(bolinha);

          const textoStatus =
            status === "totalmente-disponivel"
              ? "Totalmente disponível"
              : "Disponível com hóspedes";

          btnDia.title = `${dataBR}: ${textoStatus}`;

          btnDia.addEventListener("click", function () {
            statusClique.textContent = `${dataBR} — ${textoStatus}`;
            statusClique.style.color =
              status === "totalmente-disponivel" ? "#2e8540" : "#2563eb";

            const inputCheckin = document.getElementById("checkin");
            if (inputCheckin) {
              inputCheckin.value = chave;
              inputCheckin.dispatchEvent(new Event("change"));
            }
          });
        } else {
          btnDia.title = `${dataBR}: Sem vaga`;
          btnDia.addEventListener("click", function () {
            statusClique.textContent = `${dataBR} — Sem vagas disponíveis`;
            statusClique.style.color = "#94a3b8";
          });
        }
      }

      gradeDias.appendChild(btnDia);
    }
  }

  btnAnterior.addEventListener("click", function () {
    mesExibido--;
    if (mesExibido < 0) {
      mesExibido = 11;
      anoExibido--;
    }
    renderizarCalendario();
  });

  btnProximo.addEventListener("click", function () {
    mesExibido++;
    if (mesExibido > 11) {
      mesExibido = 0;
      anoExibido++;
    }
    renderizarCalendario();
  });

  renderizarCalendario();
});
