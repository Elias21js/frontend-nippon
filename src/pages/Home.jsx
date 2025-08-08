import ButtonHome from "../components/ButtonHome.jsx";
import Input from "../components/Input.jsx";
import GlassBox from "../layouts/GlassBox.jsx";
import Header from "../layouts/Header.jsx";
import bg from "../assets/index.webp";
import { AuthDivButtons, AuthDivInputs } from "../styles/auth.styled.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import {
  ButtonHomeStyled,
  Listagem,
  RankingMenu,
  Registro,
  RegistroHeader,
  Relatorio,
} from "../styles/home.styled.jsx";
import {
  addVendas,
  generateChart,
  generateMensal,
  generatePerformance,
  generateReport,
  generateSemanal,
  handleVendas,
} from "../services/Home.services.jsx";
import { DataContext } from "../context/date.context.jsx";
import { getRegistros } from "../services/Registros.jsx";
import { descobrirDiaDaSemana } from "../utils/weekDay.jsx";

export default function Home({ onLogOut }) {
  document.body.classList.add("home");

  const [registros, setRegistros] = useState([]);
  const { dataSelecionada, setDataSelecionada } = useContext(DataContext);

  const dateRef = useRef();
  const solds20 = useRef();
  const solds15 = useRef();
  const sobras = useRef();
  const digitais = useRef();

  const render = async ({ ano, mes }) => {
    const {
      data: { registros, descontos },
    } = await getRegistros({ ano, mes });

    localStorage.setItem("user_cache", JSON.stringify(registros, descontos));
    setRegistros(registros);
    resetInputs();
  };

  function resetInputs() {
    solds20.current.value = "";
    solds15.current.value = "";
    sobras.current.value = "";
    digitais.current.value = "";
  }

  useEffect(() => {
    // Aplica o background no body
    document.body.style.backgroundImage = `url(${bg})`;
    document.body.classList.add("home");

    // Inicializa o Flatpickr só depois que o input estiver no DOM
    if (dateRef.current) {
      flatpickr(dateRef.current, {
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
    }

    return () => {
      document.body.style.backgroundImage = "";
      document.body.classList.remove("home");
    };
  }, []);

  useEffect(() => {
    render(dataSelecionada);
  }, [dataSelecionada]);

  const sourceDate = () => {
    const day = dateRef.current.value;
    return new Date(dataSelecionada.ano, dataSelecionada.mes - 1, day);
  };

  return (
    <>
      <Header onLogOut={onLogOut} onRender={render} />
      <GlassBox>
        <AuthDivInputs $rg="1.5rem">
          <h2 className="text-2xl pt-3.5 text-center">Adicionar Registro</h2>
          <Input placeholder="DD/MM" key="date-d" unique="date-d" type="text" ref={dateRef} />
          <Input placeholder="Vendas a R$20" key="solds20" unique="solds20" type="text" ref={solds20} />
          <Input placeholder="Vendas a R$15" key="solds15" unique="solds15" type="text" ref={solds15} />
          <Input placeholder="Arquivos digitais" key="digitais" unique="digitais" type="text" ref={digitais} />
          <Input placeholder="Sobras" key="text" unique="text" type="text" ref={sobras} />
        </AuthDivInputs>
        <AuthDivButtons>
          <ButtonHome
            onClick={() => {
              addVendas(
                {
                  data: sourceDate(),
                  solds20: solds20.current.value,
                  solds15: solds15.current.value,
                  digitais: digitais.current.value,
                  sobras: sobras.current.value,
                },
                render,
                dataSelecionada
              );
            }}
            text="Adicionar Venda"
          />
        </AuthDivButtons>
      </GlassBox>

      {registros.length >= 1 && (
        <>
          <Listagem>
            <RegistroHeader data-aos="fade-up">
              <span>Data</span>
              <span>Vendas</span>
              <span>Sobras</span>
              <span>Produção</span>
              <span>Aprov.</span>
            </RegistroHeader>
            {registros?.map(({ register_id, data, vendas_20, vendas_15, sobras, digitais }) => {
              const vendas = vendas_20 + vendas_15;
              const producao = vendas_20 + vendas_15 + sobras;
              const aprov = ((vendas / producao) * 100).toFixed(2) + "%";
              const splitData = data.split("T")[0].split("-");
              // const formatedData = splitData[2] + "/" + splitData[1];
              const formatedData = descobrirDiaDaSemana({ dia: splitData[2], mes: splitData[1] });

              return (
                <Registro
                  key={register_id}
                  data-aos="fade-up"
                  onClick={() =>
                    handleVendas(
                      {
                        register_id,
                        data: { dia: splitData[2], mes: splitData[1], ano: dataSelecionada.ano },
                        vendas_20,
                        vendas_15,
                        sobras,
                        digitais,
                      },
                      render
                    )
                  }
                >
                  <span>{formatedData}</span>
                  <span>{vendas}</span>
                  <span>{sobras}</span>
                  <span>{producao}</span>
                  <span>{aprov}</span>
                </Registro>
              );
            })}
          </Listagem>
          <Relatorio data-aos="fade-in" data-aos-offset="50">
            <ButtonHomeStyled onClick={() => generateReport(dataSelecionada)}>Gerar Relatório</ButtonHomeStyled>
            <ButtonHomeStyled
              onClick={(event) => {
                setTimeout(async () => {
                  await generateChart(event.target, dataSelecionada);
                }, 500);
              }}
            >
              Mostrar Gráficos
            </ButtonHomeStyled>
            <ButtonHomeStyled
              onClick={(event) => {
                setTimeout(async () => {
                  await generateMensal(event.target, dataSelecionada);
                }, 500);
              }}
            >
              Mostrar Ranking
            </ButtonHomeStyled>
          </Relatorio>
          <RankingMenu data-aos="fade-in" className="ranking-div">
            <ButtonHomeStyled
              onClick={async (event) => {
                await generateSemanal(event.target, dataSelecionada);
              }}
            >
              Semanal
            </ButtonHomeStyled>
            <ButtonHomeStyled
              onClick={async (event) => {
                await generateMensal(event.target, dataSelecionada);
              }}
            >
              Mensal
            </ButtonHomeStyled>
            <ButtonHomeStyled
              className="btn-performance"
              onClick={async (event) => {
                await generatePerformance(event.target, dataSelecionada);
              }}
            >
              Desempenho
            </ButtonHomeStyled>
          </RankingMenu>
          <div id="charts">
            <canvas id="doughnut-chart"></canvas>
            <canvas id="line-chart"></canvas>
          </div>
          <div id="ranking-chart">
            <canvas id="bar-chart"></canvas>
          </div>
          <div id="ranking-performance">
            <canvas
              className="charts__performance-chart"
              id="performance-chart"
              width="1200"
              height="800"
              style={{ maxWidth: "1200px", maxHeight: "800px" }}
            ></canvas>
          </div>
          {/* <!-- Carrossel de rankings semanais --> */}
          <div className="ranking-swiper swiper" id="ranking-semanal">
            <div className="ranking-swiper__wrapper swiper-wrapper" id="wrapper">
              {/* <!-- Gráficos inseridos via JS --> */}
            </div>
          </div>
        </>
      )}
    </>
  );
}
