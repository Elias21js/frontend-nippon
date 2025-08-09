import axios from "axios";
import Swal from "sweetalert2";
import flatpickr from "flatpickr";
import Chart from "chart.js/auto";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import { getStyleInputs, Toast } from "../utils/swal.jsx";
import { getDiaDaSemana } from "../utils/weekDay.jsx";
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import { handleChart } from "../utils/chart.jsx";

const fotografos_ranking = import.meta.env.VITE_PHOTOGRAPHERS_RANKING_LIST;

// função que adiciona dia.
export async function addVendas({ data, solds20, solds15, digitais, sobras }, render, dataSelecionada) {
  [data, solds20, solds15, digitais, sobras].forEach((element) => {
    if (isNaN(Number(element))) return Toast.fire({ icon: "error", text: "Apenas números são permitidos." });
    if (element < 0) return Toast.fire({ icon: "error", text: "Nenhum campo pode ser negativo." });
  });

  if (!data) return Toast.fire({ icon: "error", text: "A data deve ser válida." });

  const realDate = data.toISOString().split("T")[0];

  if (!solds20 && !solds15 && !digitais && !sobras)
    return Toast.fire({ icon: "error", text: "Não pode deixar todos os campos vazios." });

  try {
    const {
      data: { message },
    } = await axios.post(
      import.meta.env.VITE_API_URL + "/registros",
      {
        data: realDate,
        solds20: solds20 || 0,
        solds15: solds15 || 0,
        digitais: digitais || 0,
        sobras: sobras || 0,
      },
      {
        withCredentials: true,
      }
    );

    await render(dataSelecionada);

    return Toast.fire({ icon: "success", text: message });
  } catch (error) {
    if (error.code === "ERR_BAD_REQUEST")
      return Toast.fire({ icon: "error", text: error?.response?.data?.message, timer: 2000 });
    throw error;
  }
}

// função que edita/remove dia.
export async function handleVendas(
  { register_id, data: { dia, mes, ano }, vendas_20, vendas_15, sobras, digitais },
  render
) {
  Swal.fire({
    icon: "info",
    inputAttributes: {
      autoComplete: "off",
    },
    confirmButtonText: "Concluir edição",
    denyButtonText: "Remover dia",
    showDenyButton: true,
    customClass: {
      popup: "swal-glass",
    },
    reverseButtons: true,
    html: `
      <h2 class="edit-title">Editar dia.</h2>
      <div class="label-float">
        <input id="swal-input1" class="data only-day disable-months" value=${dia} placeholder=" ">
        <label for="swal-input1">Dia</label>
      </div>
      <div class="label-float">
        <input id="swal-input2" value=${vendas_20} autocomplete="off" placeholder=" ">
        <label for="swal-input2">Vendas a R$ 20</label>
      </div>
      <div class="label-float">
        <input id="swal-input3" value=${vendas_15} autocomplete="off" placeholder=" ">
        <label for="swal-input3">Vendas a $15</label>
      </div>
      <div class="label-float">
        <input id="swal-input4" value=${digitais} autocomplete="off" placeholder=" ">
        <label for="swal-input4">Digitais</label>
      </div>
      <div class="label-float">
        <input id="swal-input5" value=${sobras} autocomplete="off" placeholder=" ">
        <label for="swal-input5">Sobras</label>
      </div>
      `,
    didOpen: () => {
      const style = document.createElement("style");
      style.textContent = getStyleInputs;
      document.head.appendChild(style);

      flatpickr(".data", {
        dateFormat: "d",
        altInput: false,
        altFormat: "F j, Y",
        locale: Portuguese,
        disableMobile: true,
        onOpen: function (selectedDates, dateStr, instance) {
          instance.calendarContainer.classList.add("disable-months");
        },
        onClose: function (selectedDates, dateStr, instance) {
          instance.calendarContainer.classList.remove("disable-months");
        },
      });
    },
    focusConfirm: false,
    preConfirm: () => {
      const swal1 = document.getElementById("swal-input1").value;
      const swal2 = document.getElementById("swal-input2").value || 0;
      const swal3 = document.getElementById("swal-input3").value || 0;
      const swal4 = document.getElementById("swal-input4").value || 0;
      const swal5 = document.getElementById("swal-input5").value || 0;

      if (!swal1) return Swal.showValidationMessage("Insira uma data válida.");

      if (!swal2 && !swal3 && !swal4 && !swal5)
        return Swal.showValidationMessage("Não pode deixar todos os campos vazios.");

      return {
        data: `${ano}-${mes}-${swal1}`,
        solds20: swal2 || 0,
        solds15: swal3 || 0,
        digitais: swal4 || 0,
        sobras: swal5 || 0,
      };
    },
  }).then(async ({ isConfirmed, isDenied, value }) => {
    if (isConfirmed) {
      const { data, solds20, solds15, digitais, sobras } = value;

      try {
        const {
          data: { message },
        } = await axios.put(
          import.meta.env.VITE_API_URL + `/registros/${register_id}`,
          {
            register_id,
            data,
            solds20,
            solds15,
            digitais,
            sobras,
          },
          {
            withCredentials: true,
          }
        );

        console.log(message);
        await render({ mes, ano });
        return Toast.fire({ icon: "success", text: message, timer: 2000 });
      } catch (err) {
        if (err.code === "ERR_BAD_REQUEST") {
          return Toast.fire({ icon: "error", text: err.response.data.message, timer: 2000 });
        }
        Toast.fire({ icon: "error", text: "Ocorreu um erro interno, verifique o console.", timer: 2000 });
        throw err;
      }
    } else if (isDenied) {
      const data = `${ano}-${mes}-${document.querySelector("#swal-input1").value}`;

      try {
        const {
          data: { message },
        } = await axios.delete(import.meta.env.VITE_API_URL + `/registros/${register_id}/${data}`, {
          withCredentials: true,
        });

        await render({ ano, mes });
        return Toast.fire({ icon: "success", text: message, timer: 2000 });
      } catch (err) {
        Toast.fire({ icon: "error", text: "Ocorreu um erro interno, verifique o console.", timer: 2000 });
        throw err;
      }
    }
  });
}

// função que gera o relatório pessoal
export async function generateReport({ ano, mes }) {
  const url = import.meta.env.VITE_API_URL;
  const lucro = {
    sold15: 3,
    sold20: 4,
    digital: 1,
  };

  // const {
  //   data: { registros, descontos },
  // } = await axios.get(url + `/registros/${ano}/${mes}`, {
  //   withCredentials: true,
  // });

  const { registros, descontos } = JSON.parse(localStorage.getItem("user_cache"));

  if (registros.length < 1)
    return Toast.fire({ icon: "error", text: "Você deve adicionar um registro antes.", timer: 2000 });

  const { dias, vendas_20, vendas_15, digitais, sobras } = registros.reduce(
    (ac, { vendas_20, vendas_15, digitais, sobras }) => {
      ac.dias += 1;
      ac.vendas_20 += vendas_20;
      ac.vendas_15 += vendas_15;
      ac.digitais += digitais;
      ac.sobras += sobras;
      return ac;
    },
    { dias: 0, vendas_20: 0, vendas_15: 0, digitais: 0, sobras: 0 }
  );

  const discount_value = descontos.reduce((ac, { value }) => ac + value, 0);

  const vendas = vendas_20 + vendas_15;
  const lucro_20 = vendas_20 * lucro.sold20;
  const lucro_15 = vendas_15 * lucro.sold15;
  const lucro_digitais = digitais * lucro.digital;
  const producao = vendas + sobras;
  const salario_bruto = lucro_20 + lucro_15 + lucro_digitais;
  const salario_liquido = salario_bruto - discount_value;
  const capital_empresa = vendas_20 * 20 + vendas_15 * 15;
  const aproveitamento = (vendas / producao) * 100;

  Swal.fire({
    title: `📸 Relatório Geral`,
    width: "clamp(265px, 90vw, 500px)",
    customClass: {
      title: "rela-title",
      popup: "rela-geral swal-glass",
    },
    html: `
          <div class="rela-div">
            <ul class="ul-rela">
              <li><strong>📅 Dias trabalhados:</strong> <span class="destaque">${dias}</span></li>
              <li><strong>🛒 Vendas:</strong> <span class="destaque">${vendas}</span></li>
              <li><strong>🧾 Vendas a R$ 20:</strong> <span class="destaque">${vendas_20}</span></li>
              <li><strong>🧾 Vendas a R$ 15:</strong> <span class="destaque">${vendas_15}</span></li>
              <li><strong>📥 Arquivos digitais:</strong> <span class="destaque">${digitais}</span></li>
              <li><strong>📦 Sobras:</strong> <span class="destaque">${sobras}</span></li>
              <li><strong>🏭 Produção:</strong> <span class="destaque">${producao}</span></li>
              <li><strong>📉 Descontos:</strong> R$<span class="destaque"> ${discount_value}</span></li>
              <li><strong>🖼️ Fotos perdidas:</strong> <span class="destaque">0</span></li>
              <li><strong>📊 Aproveitamento:</strong><span class="destaque"> ${aproveitamento.toFixed(2)}</span>%</li>
              <li><strong>🏦 Capital p/ empresa:</strong> R$ <span class="destaque">${capital_empresa}</span></li>
              <li><strong>💰 Salário bruto:</strong> R$ <span class="destaque">${salario_bruto}</span></li>
              <li><strong>💸 Salário líquido:</strong> R$ <span class="destaque">${salario_liquido}</span></li>
            </ul>
          </div>
        `,
    confirmButtonText: "Fechar",
  });
}

// função que exibe os rankings pessoais
export async function generateChart(target, { ano, mes }) {
  // const {
  //   data: { registros },
  // } = await axios.get(import.meta.env.VITE_API_URL + `/registros/${ano}/${mes}`, {
  //   withCredentials: true,
  // });

  const { registros } = JSON.parse(localStorage.getItem("user_cache"));

  const vendas = registros.reduce((ac, { vendas_20, vendas_15 }) => ac + (vendas_20 + vendas_15), 0);
  const sobras = registros.reduce((ac, { sobras }) => ac + sobras, 0);
  const producao = vendas + sobras;

  if (vendas === 0) return Toast.fire({ icon: "warning", text: "Ainda não há registros.", timer: 2000 });

  handleChart(target, "pessoal");

  const ctx = document.getElementById("doughnut-chart").getContext("2d");

  if (window.DoughnutChartInstance) window.DoughnutChartInstance.destroy();

  const data = {
    labels: ["Produção", "Vendas", "Sobras"],
    datasets: [
      {
        data: [producao, vendas, sobras],
        backgroundColor: ["rgba(53, 195, 220, 0.7)", "rgba(54, 235, 114, 0.8)", "rgba(255, 86, 86, 0.8)"],
        borderColor: "#222",
        borderWidth: 2,
        hoverOffset: 30,
      },
    ],
  };

  window.DoughnutChartInstance = new Chart(ctx, {
    type: "doughnut",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "50%",
      layout: {
        padding: {
          top: 20,
          bottom: 50,
          left: 20,
          right: 20,
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#ffffff",
            font: {
              size: 20,
              weight: "400",
              family: "JetBrains Mono",
            },
          },
          padding: 40,
        },
        tooltip: {
          enabled: true,
          mode: "nearest",
          intersect: true,
          callbacks: {
            title: (context) => context[0].label,
            label: (context) => `Quantidade: ${context.parsed}`,
          },
          bodyFont: { size: 14 },
          titleFont: { size: 16, weight: "bold", family: "JetBrains Mono" },
        },
      },
      animation: {
        animateScale: true,
        duration: 1500,
        easing: "easeOutBounce",
      },
    },
  });

  {
    const ctx = document.getElementById("line-chart").getContext("2d");
    const element = document.getElementById("line-chart");

    const datas = registros.map(({ data: date }) => {
      const splited = date.split("T")[0].split("-");
      return `${splited[2]}/${splited[1]}`;
    });

    const vendas = registros.map(({ vendas_20, vendas_15 }) => vendas_20 + vendas_15);

    const sobras = registros.map(({ sobras }) => sobras);

    const producao = registros.map(({ vendas_20, vendas_15, sobras }) => vendas_20 + vendas_15 + sobras);

    if (vendas.length < 5) {
      element.style.display = "none";
      return;
    } else {
      element.style.display = "block";
    }

    if (window.barPessoalChartInstance) {
      window.barPessoalChartInstance.destroy();
    }

    window.barPessoalChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: datas,
        datasets: [
          {
            label: "Vendas",
            data: vendas,
            borderColor: "rgb(54, 235, 114)",
            backgroundColor: "rgba(54, 235, 114, 0.86)",
            borderWidth: 1,
            borderRadius: 8,
            hoverBackgroundColor: "#fff",
            hoverBorderWidth: 0,
          },
          {
            label: "Sobras",
            data: sobras,
            borderColor: "rgb(255, 86, 86)",
            backgroundColor: "rgba(255, 86, 86, 0.79)",
            borderWidth: 1,
            borderRadius: 8,
            hoverBackgroundColor: "#fff",
            hoverBorderWidth: 0,
          },
          {
            label: "Produção",
            data: producao,
            borderColor: "rgb(41, 71, 236)",
            backgroundColor: "rgba(41, 70, 236, 0.84)",
            borderWidth: 1,
            borderRadius: 8,
            hoverBackgroundColor: "#fff",
            hoverBorderWidth: 0,
          },
        ],
      },
      options: {
        indexAxis: "x",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
              font: {
                size: (ctx) => {
                  const width = ctx.chart.width;
                  return Math.max(8, Math.min(width * 0.03, 24));
                },
                family: "JetBrains Mono",
              },
            },
          },
          tooltip: {
            titleColor: "#fff",
            bodyColor: "#fff",
            footerColor: "#fff",
            mode: "index",
            intersect: false,
            callbacks: {
              title: (tooltipItems) => `${getDiaDaSemana(tooltipItems[0].label, { ano, mes })}`,
              label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}.`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#fff",
              stepSize: 5,
              font: {
                size: (ctx) => {
                  const width = ctx.chart.width;
                  if (width < 400) return 14;
                  if (width < 600) return 16;
                  return 20;
                },
              },
            },
          },
          x: {
            ticks: {
              color: "#fff",
              font: {
                size: (ctx) => {
                  const width = ctx.chart.width;
                  if (width < 400) return 14;
                  if (width < 600) return 16;
                  return 20;
                },
              },
            },
          },
        },
      },
    });
  }
}

// função que recebe e trata os dados mensais
async function getMensal({ ano, mes }) {
  const { data } = await axios.get(import.meta.env.VITE_API_URL + `/registros/${ano}/${mes}/${fotografos_ranking}`, {
    withCredentials: true,
  });

  const ranking = data.reduce((ac, { nome_fotografo, vendas_20, vendas_15, sobras }) => {
    if (!ac.find(({ fotografo }) => nome_fotografo === fotografo)) {
      ac.push({
        fotografo: nome_fotografo,
        vendas: vendas_20 + vendas_15,
        sobras,
        producao: vendas_20 + vendas_15 + sobras,
        aproveitamento: ((vendas_20 + vendas_15) / (vendas_20 + vendas_15 + sobras)) * 100,
      });
    } else {
      const existent = ac.find(({ fotografo }) => fotografo === nome_fotografo);

      existent.vendas += vendas_20 + vendas_15;
      existent.sobras += sobras;
      existent.producao += vendas_20 + vendas_15 + sobras;
      existent.aproveitamento = (existent.vendas / existent.producao) * 100;
    }

    return ac.sort((a, b) => b.vendas - a.vendas);
  }, []);

  const nomes = ranking.map(({ fotografo }) => fotografo);
  const vendas = ranking.map(({ vendas }) => vendas);
  const sobras = ranking.map(({ sobras }) => sobras);
  const producao = ranking.map(({ producao }) => producao);
  const aproveitamentos = ranking.map(({ aproveitamento }) => aproveitamento.toFixed(2));

  return {
    nomes,
    vendas,
    sobras,
    producao,
    aproveitamentos,
  };
}

// trigger que gera o ranking mensal
export async function generateMensal(target, { ano, mes }) {
  const { nomes: withoutMedal, vendas, sobras, producao, aproveitamentos } = await getMensal({ ano, mes });

  if (vendas.length === 0) {
    return Toast.fire({ icon: "warning", text: "Ainda não há registros no mês.", timer: 2000 });
  }

  handleChart(target, "ranking");

  const nomes = withoutMedal.map((fotografo, idx) => {
    const medalha = ["🥇", "🥈", "🥉"][idx] || "📸";
    return `${medalha} ${fotografo}`;
  });

  const ctx = document.getElementById("bar-chart").getContext("2d");

  if (window.barChartInstance) {
    window.barChartInstance.destroy();
  }

  window.barChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: nomes,
      datasets: [
        {
          label: "Vendas",
          data: vendas,
          backgroundColor: "rgba(75, 192, 192, 0.9)",
          borderColor: "rgb(51, 228, 228)",
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: "#fff",
          hoverBorderWidth: 0,
        },
        {
          label: "Sobras",
          data: sobras,
          backgroundColor: "rgba(255, 99, 133, 0.8)",
          borderColor: "rgb(255, 52, 96)",
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: "#fff",
          hoverBorderWidth: 0,
        },
        {
          label: "Produção",
          data: producao,
          backgroundColor: "rgba(45, 76, 250, 0.9)",
          borderColor: "rgb(41, 80, 255)",
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: "#fff",
          hoverBorderWidth: 0,
          hidden: true,
        },
      ],
    },
    options: {
      indexAxis: "x",
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#fff",
            font: {
              size: (ctx) => {
                const width = ctx.chart.width;
                return Math.max(8, Math.min(width * 0.03, 24));
              },
              family: "JetBrains Mono",
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const label = context.dataset.label;
              const valor = context.raw;
              const aproveitamento = aproveitamentos[index];
              return `${label}: ${valor} | Aproveitamento: ${aproveitamento}%`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: "#fff",
            font: {
              size: (ctx) => {
                const width = ctx.chart.width;
                if (width < 400) return 14;
                if (width < 600) return 16;
                return 20;
              },
              family: "JetBrains Mono",
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        y: {
          ticks: {
            color: "#fff",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
  });
}

// função que cria e anima o carrossel semanal
export const renderSwiper = async () => {
  Swiper.use([Navigation, Pagination, Autoplay]);

  return new Swiper(".swiper", {
    loop: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
};

// função que cuida dos slides do carrossel semanal
export const renderSlides = (week, id) => {
  if (!week) return false;
  const r = week.reduce((a, { vendas }) => a + parseInt(vendas), 0);
  if (r === 0) return false;

  const wrapper = document.getElementById("wrapper");

  if (document.getElementById(id)) {
    document.getElementById(id).remove();
    wrapper.innerHTML = "";
  }

  const swiperSlide = document.createElement("div");
  swiperSlide.classList.add("swiper-slide");
  swiperSlide.innerHTML = `<canvas
              id="${id}"
              class="semanal-charts"
              width="1200"
              height="800"
              style="max-width: 1200px; max-height: 800px"
            ></canvas>`;

  wrapper.appendChild(swiperSlide);
  return true;
};

// função que trata os dados semanais e retorna pro trigger
export async function getSemanal({ ano, mes }) {
  const { data } = await axios.get(import.meta.env.VITE_API_URL + `/registros/${ano}/${mes}/${fotografos_ranking}`, {
    withCredentials: true,
  });
  if (data.length === 0) return Toast.fire({ icon: "warning", text: "Ainda não há registros na semana.", timer: 2000 });

  const semanas = [
    { inicio: new Date(ano, mes - 1, 0), fim: new Date(ano, mes - 1, 7, 23, 59, 59, 999) },
    { inicio: new Date(ano, mes - 1, 8), fim: new Date(ano, mes - 1, 14, 23, 59, 59, 999) },
    { inicio: new Date(ano, mes - 1, 15), fim: new Date(ano, mes - 1, 21, 23, 59, 59, 999) },
    // Para o último intervalo, melhor pegar o último dia do mês
    {
      inicio: new Date(ano, mes - 1, 22),
      fim: new Date(ano, mes, 0, 23, 59, 59, 999), // dia 0 do próximo mês = último dia do mês atual
    },
  ];

  function normalizeDate(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  const weeks = data.reduce((ac, { data: dataRegistro, nome_fotografo, vendas_20, vendas_15, sobras }) => {
    const dataObj = normalizeDate(new Date(dataRegistro));

    semanas.forEach(({ inicio, fim }, index) => {
      const inicioNorm = normalizeDate(inicio);
      const fimNorm = normalizeDate(fim);

      console.log(dataObj, inicioNorm, fimNorm);
      if (dataObj >= inicioNorm && dataObj <= fimNorm) {
        if (!ac[index]) ac[index] = [];

        const existent = ac[index].find(({ fotografo }) => fotografo === nome_fotografo);
        if (!existent) {
          ac[index].push({
            fotografo: nome_fotografo,
            vendas: vendas_20 + vendas_15,
            sobras,
            producao: vendas_20 + vendas_15 + sobras,
            aproveitamento: ((vendas_20 + vendas_15) / (vendas_20 + vendas_15 + sobras)) * 100,
          });
        } else {
          existent.vendas += vendas_20 + vendas_15;
          existent.sobras += sobras;
          existent.producao += vendas_20 + vendas_15 + sobras;
          existent.aproveitamento = (existent.vendas / existent.producao) * 100;
        }
      }
    });

    return ac;
  }, []);

  // Agora sim, ordena as semanas depois do reduce:
  weeks.forEach((semana) => {
    if (semana) {
      semana.sort((a, b) => b.vendas - a.vendas);
    }
  });

  console.log(weeks);
  return weeks;
}

// trigger para gerar ranking semanal
export async function generateSemanal(target, { ano, mes }) {
  const weeks = await getSemanal({ ano, mes });
  console.log(weeks);

  handleChart(target, "semanal");

  [
    { data: weeks[0], id: "first-week" },
    { data: weeks[1], id: "second-week" },
    { data: weeks[2], id: "third-week" },
    { data: weeks[3], id: "fourth-week" },
  ].forEach(({ data, id }) => {
    if (renderSlides(data, id)) {
      const nomes = data.map(({ fotografo }, idx) => {
        const medalha = ["🥇", "🥈", "🥉"][idx] || "📸";
        return `${medalha} ${fotografo}`;
      });
      const vendas = data.map(({ vendas }) => vendas);
      const sobras = data.map(({ sobras }) => sobras);
      const producao = data.map(({ producao }) => producao);
      const aproveitamentos = data.map(({ aproveitamento }) => aproveitamento.toFixed(2));
      const titles = {
        "first-week": "Primeira Semana (01 ao 07)",
        "second-week": "Segunda Semana (08 ao 14)",
        "third-week": "Terceira Semana (15 ao 21)",
        "fourth-week": "Última Semana (22 ao 31)",
      };

      if (window[id]) delete window[id];
      window[id] = new Chart(document.getElementById(id).getContext("2d"), {
        type: "bar",
        data: {
          labels: nomes,
          datasets: [
            {
              label: "Vendas",
              data: vendas,
              backgroundColor: "rgba(75, 192, 192, 0.9)",
              borderColor: "rgb(51, 228, 228)",
              borderWidth: 1,
              borderRadius: 8,
              hoverBackgroundColor: "#fff",
              hoverBorderWidth: 0,
            },
            {
              label: "Sobras",
              data: sobras,
              backgroundColor: "rgba(255, 99, 133, 0.8)",
              borderColor: "rgb(255, 52, 96)",
              borderWidth: 1,
              borderRadius: 8,
              hoverBackgroundColor: "#fff",
              hoverBorderWidth: 0,
            },
            {
              label: "Produção",
              data: producao,
              backgroundColor: "rgba(45, 76, 250, 0.9)",
              borderColor: "rgb(41, 80, 255)",
              borderWidth: 1,
              borderRadius: 8,
              hoverBackgroundColor: "#fff",
              hoverBorderWidth: 0,
              hidden: true,
            },
          ],
        },
        options: {
          indexAxis: "x",
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: "#fff",
                font: {
                  size: (ctx) => {
                    const width = ctx.chart.width;
                    return Math.max(8, Math.min(width * 0.03, 24));
                  },
                  family: "JetBrains Mono",
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const index = context.dataIndex;
                  const label = context.dataset.label;
                  const valor = context.raw;
                  const aproveitamento = aproveitamentos[index];
                  return `${label}: ${valor} | Aproveitamento: ${aproveitamento}%`;
                },
              },
            },
            title: {
              display: true,
              text: titles[id],
              color: "#fff",
              font: {
                family: "JetBrains Mono",
                size: (ctx) => {
                  const width = ctx.chart.width;
                  return Math.max(8, Math.min(width * 0.03, 24));
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                color: "#fff",
                font: {
                  size: (ctx) => {
                    const width = ctx.chart.width;
                    if (width < 400) return 14;
                    if (width < 600) return 16;
                    return 20;
                  },
                  family: "JetBrains Mono",
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
            y: {
              ticks: {
                color: "#fff",
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
          },
        },
      });
    }
  });
}

// função que trata os dados da performance e retorna pro trigger
async function getPerformance({ ano, mes }) {
  const { data } = await axios.get(import.meta.env.VITE_API_URL + `/registros/${ano}/${mes}/${fotografos_ranking}`, {
    withCredentials: true,
  });

  const performances = data.map(({ data, nome_fotografo, vendas_20, vendas_15 }) => {
    const splitedDate = data.split("T")[0].split("-");
    const user = { nome: nome_fotografo };
    const registro = { data: `${splitedDate[2]}/${splitedDate[1]}`, vendas: vendas_20 + vendas_15 };

    return { user, registro };
  });

  return performances;
}

// trigger para gerar o ranking da performance
export async function generatePerformance(target, { ano, mes }) {
  const ctx = document.getElementById("performance-chart").getContext("2d");
  handleChart(target, "performance");
  const performance = await getPerformance({ ano, mes });

  if (window.performanceChartInstance) window.performanceChartInstance.destroy();

  const allDatesSet = new Set();
  performance.map(({ registro: { data } }) => allDatesSet.add(data));
  const labels = Array.from(allDatesSet).sort();

  const colors = ["yellow", "blue", "#DA70D6", "#000000"];

  const groupedData = {};

  performance.forEach(({ user: { nome }, registro: { data, vendas } }) => {
    if (!groupedData[nome]) {
      groupedData[nome] = {};
    }
    groupedData[nome][data] = vendas;
  });

  const datasets = Object.entries(groupedData).map(([nome, registros], idx) => ({
    label: nome,
    data: labels.map((label) => registros[label] ?? 0),
    fill: false,
    borderColor: colors[idx % colors.length],
    pointBackgroundColor: colors[idx % colors.length],
    backgroundColor: colors[idx % colors.length],
    tension: 0.2,
  }));

  window.performanceChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets,
    },
    options: {
      indexAxis: "x",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
            font: {
              size: (ctx) => {
                const width = ctx.chart.width;
                return Math.max(8, Math.min(width * 0.03, 24));
              },
              family: "JetBrains Mono",
            },
          },
        },
        tooltip: {
          titleColor: "#fff",
          bodyColor: "#fff",
          footerColor: "#fff",
          mode: "index",
          intersect: false,
          callbacks: {
            title: (tooltipItems) => `${getDiaDaSemana(tooltipItems[0].label, { mes, ano })}`,
            label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}.`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#fff",
            stepSize: 5,
            font: {
              size: (ctx) => {
                const width = ctx.chart.width;
                if (width < 400) return 14;
                if (width < 600) return 16;
                return 20;
              },
            },
          },
        },
        x: {
          ticks: {
            color: "#fff",
            font: {
              size: (ctx) => {
                const width = ctx.chart.width;
                if (width < 400) return 14;
                if (width < 600) return 16;
                return 20;
              },
            },
          },
        },
      },
    },
  });
}
