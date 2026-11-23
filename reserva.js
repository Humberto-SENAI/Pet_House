document.addEventListener("DOMContentLoaded", function () {
  const PRECO_NOITE = 85.0;

  const btnToggle = document.getElementById("btn-toggle-reserva");
  const painelReserva = document.getElementById("painel-reserva");
  const formReserva = document.getElementById("form-calculo-reserva");

  const inputCheckin = document.getElementById("checkin");
  const inputCheckout = document.getElementById("checkout");
  const selectQtdPets = document.getElementById("qtd-pets");
  const checkAssinante = document.getElementById("sou-assinante");

  const resumoCalculo = document.getElementById("resumo-calculo");
  const labelDiarias = document.getElementById("label-diarias");
  const valorSubtotal = document.getElementById("valor-subtotal");
  const linhaDesconto = document.getElementById("linha-desconto");
  const valorDesconto = document.getElementById("valor-desconto");
  const valorTotal = document.getElementById("valor-total");

  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // 1. Abre e fecha o menu ao clicar no botão "Reservar"
  btnToggle.addEventListener("click", function () {
    const estaOculto = painelReserva.classList.contains("painel-reserva-oculto");

    if (estaOculto) {
      painelReserva.classList.remove("painel-reserva-oculto");
      btnToggle.textContent = "Fechar reserva";
    } else {
      painelReserva.classList.add("painel-reserva-oculto");
      btnToggle.textContent = "Reservar";
    }
  });

  // 2. Calcula os valores em tempo real conforme as datas e opções mudam
  function atualizarCalculo() {
    if (!inputCheckin.value || !inputCheckout.value) {
      resumoCalculo.classList.add("oculto");
      return;
    }

    const dataEntrada = new Date(inputCheckin.value + "T00:00:00");
    const dataSaida = new Date(inputCheckout.value + "T00:00:00");
    const diffMs = dataSaida - dataEntrada;
    const noites = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (noites <= 0) {
      resumoCalculo.classList.add("oculto");
      return;
    }

    const qtdPets = parseInt(selectQtdPets.value, 10) || 1;
    const subtotal = PRECO_NOITE * noites * qtdPets;
    const desconto = checkAssinante.checked ? subtotal * 0.2 : 0;
    const total = subtotal - desconto;

    const textoNoites = noites === 1 ? "1 noite" : `${noites} noites`;
    const textoPets = qtdPets === 1 ? "1 pet" : `${qtdPets} pets`;

    labelDiarias.textContent = `${formatarMoeda(PRECO_NOITE)} x ${textoNoites} (${textoPets})`;
    valorSubtotal.textContent = formatarMoeda(subtotal);

    if (desconto > 0) {
      linhaDesconto.classList.remove("oculto");
      valorDesconto.textContent = `- ${formatarMoeda(desconto)}`;
    } else {
      linhaDesconto.classList.add("oculto");
    }

    valorTotal.textContent = formatarMoeda(total);
    resumoCalculo.classList.remove("oculto");
  }

  inputCheckin.addEventListener("change", function () {
    inputCheckout.min = inputCheckin.value;
    atualizarCalculo();
  });

  inputCheckout.addEventListener("change", atualizarCalculo);
  selectQtdPets.addEventListener("change", atualizarCalculo);
  checkAssinante.addEventListener("change", atualizarCalculo);

  // 3. Confirmação do formulário
  formReserva.addEventListener("submit", function (e) {
    e.preventDefault();

    const dataEntrada = new Date(inputCheckin.value + "T00:00:00");
    const dataSaida = new Date(inputCheckout.value + "T00:00:00");

    if (dataSaida <= dataEntrada) {
      alert("A data de Check-out precisa ser posterior à data de Check-in.");
      return;
    }

    alert(`Reserva solicitada feito! ૮ >ﻌ< ა Total: ${valorTotal.textContent}`);
    formReserva.reset();
    resumoCalculo.classList.add("oculto");
    painelReserva.classList.add("painel-reserva-oculto");
    btnToggle.textContent = "Reservar";
  });
});