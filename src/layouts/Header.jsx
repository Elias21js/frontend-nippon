import { AuthBoxLogo, AuthLogo } from "../styles/auth.styled.jsx";
import logo from "../assets/logo-nippon.png";
import { HeaderActions, HeaderStyled } from "../styles/home.styled.jsx";
import ButtonAuth from "../components/ButtonAuth.jsx";
import { Toast } from "../utils/swal.jsx";
import axios from "axios";
import { useContext } from "react";
import { DataContext } from "../context/date.context.jsx";
import { changeMonth, handleDiscounts, handleRibbon } from "../services/Header.services.jsx";
import { handleChart } from "../utils/chart.jsx";

export default function Header({ onLogOut, onRender }) {
  const { dataSelecionada, setDataSelecionada } = useContext(DataContext);

  async function handleMonth(data = dataSelecionada) {
    const { ano, mes } = data;
    setDataSelecionada({ ano, mes });
    await handleChart(null, null, "hide");
    localStorage.clear();
    onRender({ ano, mes });
  }

  async function handleLogOut() {
    try {
      await axios.get(import.meta.env.VITE_API_URL + "/auth/logout", {
        withCredentials: true,
      });

      localStorage.clear();
      onLogOut();
      return Toast.fire({ icon: "success", text: "Deslogado com sucesso." });
    } catch (err) {
      return Toast.fire({ icon: "error", text: "Ocorreu um erro ao efetuar logOut.", timer: 2000 });
    }
  }

  return (
    <HeaderStyled>
      <AuthBoxLogo>
        <AuthLogo data-aos="fade-up" src={logo} alt="logo nippon-photos" />
      </AuthBoxLogo>
      <HeaderActions>
        <ButtonAuth
          text="Trocar Mês"
          id="changeMonth"
          key="changeMonth"
          onClick={() => changeMonth(handleMonth, dataSelecionada)}
        />
        <ButtonAuth text="Ribbon" id="countRibbon" key="countRibbon" onClick={handleRibbon} />
        <ButtonAuth
          text="Descontos"
          id="handleDiscounts"
          key="handleDiscounts"
          onClick={() => handleDiscounts(dataSelecionada)}
        />
        <ButtonAuth text="Sair" id="handleLogout" key="handleLogout" onClick={handleLogOut} />
      </HeaderActions>
    </HeaderStyled>
  );
}
