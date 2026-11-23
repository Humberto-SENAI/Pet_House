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

  // Guarda os dias sorteados para não mudarem ao navegar entre meses
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

  function temVagaNoDia(chaveData) {
    if (cacheDisponibilidade[chaveData] === undefined) {
      // ~65% de chance de ter vaga e ~35% de estar lotado
      cacheDisponibilidade[chaveData] = Math.random() < 0.65;
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
    tituloMesAno.textContent = nomeMes;

    const primeiroDiaSemana = dataReferencia.getDay(); // 0 (Dom) a 6 (Sáb)
    const totalDiasMes = new Date(anoExibido, mesExibido + 1, 0).getDate();

    // Espaços vazios antes do dia 1
    for (let i = 0; i < primeiroDiaSemana; i++) {
      const vazio = document.createElement("span");
      vazio.className = "cal-dia vazio";
      gradeDias.appendChild(vazio);
    }

    // Dias do mês
    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const dataAtualCelula = new Date(anoExibido, mesExibido, dia);
      const chave = formatarChaveData(anoExibido, mesExibido, dia);
      const dataBR = formatarDataBR(anoExibido, mesExibido, dia);

      const btnDia = document.createElement("button");
      btnDia.type = "button";
      btnDia.textContent = dia;
      btnDia.className = "cal-dia";

      if (dataAtualCelula < hoje) {
        btnDia.classList.add("passado");
        btnDia.disabled = true;
        btnDia.title = "Data passada";
      } else {
        const disponivel = temVagaNoDia(chave);

        if (disponivel) {
          btnDia.classList.add("vaga");
          btnDia.title = `${dataBR}: Vaga disponível`;
          btnDia.addEventListener("click", function () {
            statusClique.textContent = `✅ ${dataBR}: Vaga disponível!`;
            statusClique.style.color = "#15803d";

            // Preenche o Check-in no formulário de reserva, se existir
            const inputCheckin = document.getElementById("checkin");
            if (inputCheckin) {
              inputCheckin.value = chave;
              inputCheckin.dispatchEvent(new Event("change"));
            }
          });
        } else {
          btnDia.classList.add("lotado");
          btnDia.title = `${dataBR}: Sem vagas`;
          btnDia.addEventListener("click", function () {
            statusClique.textContent = `❌ ${dataBR}: Sem vagas nesta data.`;
            statusClique.style.color = "#b91c1c";
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