import axios from "axios";
import flatpickr from "flatpickr";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import Swal from "sweetalert2";
import { getStyleInputs, Toast } from "../utils/swal.jsx";

export function changeMonth(handleChange, { ano, mes }) {
  Swal.fire({
    title: "Mudar mês/ano de exibição",
    icon: "info",
    customClass: {
      popup: "swal-glass",
    },
    html: `
        <div class="edit-div">
            <div>
                <label for="dataForExib">Mudar Data:</label>
                <input name="dataForExib" class="swal2-input dataExib" id="dataForExib" type="text" autocomplete="off" placeholder="Data para exibição" >
            </div>
        </div>
        `,
    didOpen: () => {
      setTimeout(() => {
        const el = document.querySelector(".dataExib");
        if (!el) return console.warn("Input .dataExib não encontrado!");

        flatpickr(el, {
          defaultDate: `${mes}-${ano}`,
          plugins: [
            new monthSelectPlugin({
              shorthand: true,
              dateFormat: "m/Y",
              altFormat: "M Y",
            }),
          ],
          locale: Portuguese,
          disableMobile: true,
        });
      }, 0);
    },
    preConfirm() {
      const dataChange = document.getElementById("dataForExib").value;

      if (dataChange.trim() === "") {
        return Swal.showValidationMessage("Preencha os campos obrigatórios.");
      }

      return dataChange.split("/");
    },
  }).then(async ({ isConfirmed, value }) => {
    if (isConfirmed) {
      return handleChange({ mes: value[0], ano: value[1] });
    }
  });
}

const headContainer = (descontos) => {
  if (descontos.length > 0) {
    return `<div class="head-container">
            <span class="span-header">DIA</span>
            <span class="span-header">MOTIVO</span>
            <span class="span-header">VALOR</span>
        </div>
        <div id="listagem" class="listagem"></div>`;
  } else {
    return `<div>
          <h2 class="text-3xl">
            Ainda não há descontos por aqui.
          </h2>
      </div>`;
  }
};

export async function handleDiscounts({ ano, mes }, onRender) {
  // const { data: descontos } = await axios.get(import.meta.env.VITE_API_URL + `/discounts/${ano}/${mes}`, {
  //   withCredentials: true,
  // });
  const { descontos } = JSON.parse(localStorage.getItem("user_cache"));

  Swal.fire({
    title: "Lista de descontos",
    icon: "info",
    confirmButtonText: "Adicionar Desconto",
    cancelButtonText: "Fechar",
    showCancelButton: true,
    showConfirmButton: true,
    reverseButtons: true,
    customClass: {
      popup: "swal-glass",
    },
    html: `
      `,
    didOpen: async () => {
      const htmlContainer = Swal.getHtmlContainer();
      if (htmlContainer) htmlContainer.innerHTML = "";

      htmlContainer.innerHTML = headContainer(descontos);
      setTimeout(() => {
        const lista = document.getElementById("listagem");

        descontos?.forEach(({ discount_id, data: date, reason, value }) => {
          const splitData = date.split("T")[0].split("-");
          const day = splitData[2];
          const month = splitData[1];
          const year = splitData[0];

          const container = document.createElement("div");
          container.classList.add("registro", "div-estilosa");
          container.style.cursor = "pointer";

          container.addEventListener("click", () =>
            editOrRemove({ discount_id, day, reason, value }, { ano, mes }, onRender)
          );

          const dataR = document.createElement("span");

          function descobrirDiaDaSemana(dataString) {
            const diasDaSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

            const data = new Date(dataString);
            const diaDaSemana = data.getDay();

            return diasDaSemana[diaDaSemana];
          }

          const relaDate = new Date(year, Number(month) - 1, day);

          dataR.textContent = `${day} - ${descobrirDiaDaSemana(relaDate)}`;

          const motivoR = document.createElement("span");
          motivoR.textContent = reason;
          motivoR.classList.add("reason-discount");
          const valorR = document.createElement("span");
          valorR.textContent = `R$ ${value}`;
          // if (reason.toLowerCase() === "foto ausente") valorR.textContent = `R$ ${parseInt(fotos) * 20}`;

          container.append(dataR, motivoR, valorR);

          lista.appendChild(container);
        });
      }, 0);
    },
  }).then(async ({ isConfirmed }) => {
    if (isConfirmed) {
      await addDiscounts({ ano, mes }, onRender);
    }
  });
}

export async function addDiscounts({ ano, mes }, onRender) {
  Swal.fire({
    title: `Adicionar desconto: `,
    icon: "info",
    inputAttributes: {
      autoComplete: "off",
    },
    confirmButtonText: "Adicionar",
    denyButtonText: "Voltar",
    showDenyButton: true,
    customClass: {
      popup: "swal-glass",
    },
    reverseButtons: true,
    html: `
        <div class="label-float">
            <input id="swal-input1" class="data disable-months" placeholder=" " autocomplete="off">
            <label for="swal-input1">Dia: </label>
        </div>
        <div class="label-float">
            <input id="swal-input2" placeholder=" " autocomplete="off">
            <label for="swal-input2">Motivo: </label>
        </div>
        <div class="label-float">
            <input id="swal-input3" placeholder=" " autocomplete="off">
            <label for="swal-input3">Valor: </label>
        </div>
      `,
    didOpen: () => {
      const style = document.createElement("style");
      style.textContent = getStyleInputs;
      document.head.appendChild(style);

      flatpickr(".data", {
        dateFormat: "d",
        defaultDate: "today",
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
      const dia = document.getElementById("swal-input1").value;
      const motivo = document.getElementById("swal-input2").value;
      const valor = document.getElementById("swal-input3").value;

      if (!dia || dia.trim() === "") return false;
      if (!valor || valor.trim() === "") return false;

      return { data: `${ano}-${mes}-${dia}`, reason: motivo.trim() === "" ? "Não informado." : motivo, valor };
    },
  }).then(async ({ isConfirmed, isDenied, value }) => {
    if (isConfirmed) {
      const { data, reason, valor } = value;
      const {
        data: { message },
      } = await axios.post(
        import.meta.env.VITE_API_URL + `/discounts`,
        {
          data,
          reason,
          valor,
        },
        {
          withCredentials: true,
        }
      );

      await onRender({ ano, mes });

      return Toast.fire({ icon: "success", text: message, timer: 2000 });
    } else if (isDenied) {
    }
  });
}

const editOrRemove = ({ discount_id, day, reason, value }, { ano, mes }, onRender) => {
  Swal.fire({
    title: "Editar ou Remover",
    icon: "warning",
    customClass: "swal-glass",
    showDenyButton: true,
    showConfirmButton: true,
    reverseButtons: true,
    confirmButtonText: "Editar",
    denyButtonText: "Remover",
    html: `
        <div class="label-float">
            <input id="swal-input1" class="data disable-months" placeholder=" " value=${day} autocomplete="off">
            <label for="swal-input1">Dia: </label>
        </div>
        <div class="label-float">
            <input id="swal-input2" placeholder=" " autocomplete="off" value="${reason}">
            <label for="swal-input2">Motivo: </label>
        </div>
        <div class="label-float">
            <input id="swal-input3" placeholder=" " autocomplete="off" value=${value}>
            <label for="swal-input3">Valor: </label>
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
    preConfirm: () => {
      const day = document.getElementById("swal-input1").value;
      let reason = document.getElementById("swal-input2").value;
      const valor = document.getElementById("swal-input3").value;

      if (!day || day.trim() === "") return Swal.showValidationMessage("Insira um dia válido.");

      if (!reason || reason.trim() === "") reason = "Não informado";

      if (!valor || valor.trim() === "" || parseInt(valor) === 0)
        return Swal.showValidationMessage("Insira um valor válido.");

      return { discount_id, day, reason, valor };
    },
  }).then(async ({ isConfirmed, isDenied, value }) => {
    if (isConfirmed) {
      const { day, reason, valor } = value;

      const data = `${ano}-${mes}-${day}`;

      const {
        data: { message },
      } = await axios.put(
        import.meta.env.VITE_API_URL + `/discounts/${discount_id}`,
        { data, reason, value: valor },
        {
          withCredentials: true,
        }
      );

      Toast.fire({ icon: "success", text: message, timer: 2000 });
      await onRender({ ano, mes });

      setTimeout(() => {
        return handleDiscounts({ ano, mes });
      }, 1000);
    } else if (isDenied) {
      const {
        data: { message },
      } = await axios.delete(import.meta.env.VITE_API_URL + `/discounts/${discount_id}`, {
        withCredentials: true,
      });

      Toast.fire({ icon: "success", text: message, timer: 2000 });

      setTimeout(() => {
        return handleDiscounts({ ano, mes });
      }, 1000);
    }
  });
};

export async function handleRibbon() {
  const storaged = JSON.parse(localStorage.getItem(`ribbon_cache`));

  Swal.fire({
    title: "Gerenciar Fotos",
    icon: "info",
    customClass: {
      popup: "swal-glass",
    },
    html: `
        <div class="edit-div">
            <div class="label-float">
            <input name="initialR" id="initialR" type="text" autocomplete="off" placeholder="Ribbon Inicial" value="${
              storaged?.inicial ?? ""
            }">
            <label for="initialR">Inicial</label>
            </div>

            <div class="label-float"> 
            <input name="atualR" id="atualR" type="text" autocomplete="off" placeholder="Ribbon atual">
            <label for="atualR">Atual</label>
            </div>

             <div class="label-float">
             <input id="ribbonSobras" name="ribbonSobras" type="text" autocomplete="off" placeholder="Sobras">
             <label for="ribbonSobras">Sobras</label>
            </div>

            <div class="label-float">
            <input id="ribbonOthers" name="ribbonOthers" type="text" autocomplete="off" placeholder="Descontar revelações" value="${
              storaged?.descontar ?? ""
            }">
            <label for="ribbonOthers">Descontar</label>
            </div>

        </div>
    `,
    didOpen: () => {
      const style = document.createElement("style");
      style.textContent = getStyleInputs;
      document.head.appendChild(style);
    },
    preConfirm() {
      const inicial = document.getElementById("initialR").value;
      const atual = document.getElementById("atualR").value;
      const sobras = document.getElementById("ribbonSobras").value;
      const descontar = document.getElementById("ribbonOthers").value || 0;

      if (inicial.trim() === "" || atual.trim() === "" || sobras.trim() === "") {
        return Swal.showValidationMessage("Preencha os campos obrigatórios.");
      }

      if (
        !Number.isInteger(parseInt(inicial)) ||
        !Number.isInteger(parseInt(atual)) ||
        !Number.isInteger(parseInt(sobras))
      ) {
        return Swal.showValidationMessage("Os valores deverão conter apenas números.");
      }

      if (descontar !== 0 && descontar.trim() !== "" && !Number.isInteger(parseInt(descontar))) {
        return Swal.showValidationMessage("As fotos a ser descontadas deverá ser um número.");
      }

      if (inicial > atual)
        localStorage.setItem(
          `ribbon_cache`,
          JSON.stringify({
            inicial,
            descontar: descontar === 0 ? "" : descontar,
          })
        );

      return { inicial, atual, sobras, descontar };
    },
  }).then(({ isConfirmed, value }) => {
    if (isConfirmed) {
      const { inicial, atual, sobras, descontar } = value;

      if (parseInt(inicial) < parseInt(atual)) {
        Swal.fire({
          title: "Troca de Ribbon",
          icon: "warning",
          customClass: {
            popup: "swal-glass",
          },
          html: `
            <div class="edit-div">
                <div class="label-float">
                  <input name="finishR" id="finishR" type="text" autocomplete="off" placeholder="Ex: (-1, 2)" value="${
                    storaged?.finishR ?? ""
                  }">
                  <label for="finishR">Terminou</label>
                </div>

                <div class="label-float"> 
                  <input name="resetedR" id="resetedR" type="text" autocomplete="off" placeholder="Ex: (698, 700)" value="${
                    storaged?.resetedR ?? ""
                  }">
                  <label for="resetedR">Começou</label>
                </div>
            </div>
          `,
          didOpen: () => {
            const style = document.createElement("style");
            style.textContent = getStyleInputs;
            document.head.appendChild(style);
          },
          preConfirm() {
            const finishR = document.getElementById("finishR").value;
            const resetedR = document.getElementById("resetedR").value;

            if (finishR.trim() === "" || resetedR.trim() === "")
              return Swal.showValidationMessage("Preencha os campos obrigatórios.");

            if (!Number.isInteger(parseInt(finishR)) || !Number.isInteger(parseInt(resetedR)))
              return Swal.showValidationMessage("Os valores deverão conter apenas números.");

            return { finishR, resetedR };
          },
        }).then(({ isConfirmed, value }) => {
          if (isConfirmed) {
            localStorage.setItem(
              `ribbon_cache`,
              JSON.stringify({
                inicial,
                descontar: descontar === 0 ? "" : descontar,
                finishR: value.finishR,
                resetedR: value.resetedR,
              })
            );

            const { finishR, resetedR } = value;
            const oldRibbon = parseInt(inicial) - parseInt(finishR);
            const newRibbon = parseInt(resetedR) - parseInt(atual);

            const totalRev = oldRibbon + newRibbon;
            const minhasRev = totalRev - parseInt(descontar);
            const minhasVendas = minhasRev - parseInt(sobras);
            const aprov = ((minhasVendas / minhasRev) * 100).toFixed(2) + "%";

            return Swal.fire({
              title: `📸 Relatório de Produção`,
              icon: "success",
              html: `
                <div class="swal-cont">
                    <p>🧾 Vendas: ${minhasVendas} Fotos.</p>
                    <p>📦 Sobras: ${sobras} Fotos.</p>
                    <p>🏭 Produção: ${minhasRev} Fotos.</p>
                    <p>🏭 Aprov.: ${aprov}</p>
                </div>
            `,
              customClass: {
                popup: "swal-glass",
              },
            });
          }
        });
      } else {
        const totalRevelado = parseInt(inicial) - parseInt(atual);
        const minhasRevl = totalRevelado - parseInt(descontar);
        const minhasVendas = minhasRevl - parseInt(sobras);
        const aprov = ((minhasVendas / minhasRevl) * 100).toFixed(2) + "%";

        return Swal.fire({
          title: `📸 Relatório de Produção`,
          icon: "success",
          html: `
            <div class="swal-cont">
                <p>🧾 Vendas: ${minhasVendas} Fotos.</p>
                <p>📦 Sobras: ${sobras} Fotos.</p>
                <p>🏭 Produção: ${minhasRevl} Fotos.</p>
                <p>🏭 Aprov.: ${aprov}</p>
            </div>
          `,
          customClass: {
            popup: "swal-glass",
          },
        });
      }
    }
  });
}
