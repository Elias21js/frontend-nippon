import { ButtonAuthStyled } from "../styles/auth.styled.jsx";

export default function ButtonAuth({ onClick, text, id }) {
  return (
    <ButtonAuthStyled
      data-aos="fade-up"
      type="button"
      className="pt-4 pb-4 pl-12 pr-12 border rounded-tl-[5rem] rounded-br-[5rem] outline-0 cursor-pointer animado"
      id={id}
      onClick={onClick}
    >
      {text}
    </ButtonAuthStyled>
  );
}
