import Input from "../components/Input.jsx";
import GlassBox from "../layouts/GlassBox.jsx";
import Button from "../components/ButtonAuth.jsx";
import logo from "../assets/logo-nippon.png";
import axios from "../services/Axios.js";
import { AuthBoxLogo, AuthDivButtons, AuthDivInputs, AuthLogo } from "../styles/auth.styled.jsx";
import { Toast } from "../utils/swal.jsx";
import { useRef } from "react";

export default function Auth({ onLoginSucess }) {
  const userRef = useRef();
  const passwordRef = useRef();

  async function handleLogin() {
    const user = userRef.current.value;
    const password = passwordRef.current.value;
    if (!user || !password)
      return Toast.fire({
        icon: "error",
        text: "Preencha os dois campos obrigatóriamente.",
        timer: 2000,
      });

    try {
      const {
        data: { message, token },
      } = await axios.post("/auth/login", { name: user, password });

      if (token) {
        userRef.current.value = "";
        passwordRef.current.value = "";

        onLoginSucess();
        return Toast.fire({
          icon: "success",
          text: message,
          timer: 2000,
        });
      }
    } catch ({ response }) {
      console.log(response);
      return Toast.fire({
        icon: "error",
        text: response?.data?.message || "Erro de conexão.",
        timer: 2000,
      });
    }
  }

  async function handleRegister() {
    const user = userRef.current.value;
    const password = passwordRef.current.value;
    if (!user || !password)
      return Toast.fire({
        icon: "error",
        text: "Preencha os dois campos obrigatóriamente.",
        timer: 2000,
      });

    try {
      const {
        data: { message },
      } = await axios.post("/auth/register", { name: user, password });
      return Toast.fire({
        icon: "success",
        text: message,
        timer: 2000,
      });
    } catch ({ response: { data } }) {
      return Toast.fire({
        icon: "error",
        text: data?.message,
        timer: 2000,
      });
    }
  }

  return (
    <GlassBox $h="h-full">
      <AuthBoxLogo>
        <AuthLogo src={logo} alt="logo nippon-photos" />
      </AuthBoxLogo>
      <AuthDivInputs>
        <Input label="Usuário:" placeholder="Preencha o nome" key="user" unique="user" type="text" ref={userRef} />
        <Input
          label="Senha:"
          placeholder="Preencha a senha"
          key="password"
          unique="password"
          type="password"
          ref={passwordRef}
        />
      </AuthDivInputs>
      <AuthDivButtons>
        <Button text="Login" onClick={handleLogin} />
        <Button text="Registrar" onClick={handleRegister} />
      </AuthDivButtons>
    </GlassBox>
  );
}
