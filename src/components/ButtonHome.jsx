import { ButtonHomeStyled } from "../styles/home.styled.jsx";

export default function ButtonAuth({ onClick, text, id }) {
  return (
    <ButtonHomeStyled onClick={onClick} data-aos="fade-up" type="button" id={id}>
      {text}
    </ButtonHomeStyled>
  );
}
