import styled from "styled-components";

export const AuthDivButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row nowrap;
  column-gap: clamp(2rem, 4vw, 5rem);
`;

export const AuthDivInputs = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  height: max-content;
  padding: 1rem;
  justify-content: center;
  row-gap: ${(props) => props.$rg || "3rem"};
`;

export const InputStyled = styled.input`
  padding: 1rem;
  padding-left: 3rem;

  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  font-size: 1.6rem;
  border-top-left-radius: 4rem;
  border-bottom-right-radius: 4rem;
  background: rgba(255, 255, 255, 0.061);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  color: white;
  outline: none;

  &:focus {
    border-color: rgba(0, 255, 255, 0.8);
  }

  &:hover {
    border-color: rgba(0, 255, 255, 0.8);
  }
`;

export const ButtonAuthStyled = styled.button`
  padding: 1rem 2rem;
  outline: none;
  border: 2px solid white;
  color: white;
  font-size: 1.6rem;
  font-weight: bold;
  border-top-left-radius: 25px;
  border-bottom-right-radius: 25px;
  cursor: pointer;
  background-color: transparent;

  & :last-child {
    border-top-left-radius: 25px;
    border-bottom-right-radius: 25px;
    position: relative;

    & .spinner {
      display: none;
      width: 25px;
      height: 25px;
      border: 3px solid #ffffff;
      border-top: 3px solid transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      position: absolute;
      left: 40%;
      top: 23%;
    }
  }
`;

export const AuthBoxLogo = styled.div`
  width: clamp(150px, 78%, 215px);
  height: auto;
`;

export const AuthLogo = styled.img`
  width: 100% !important;
  height: 100%;
  max-height: 81.64px;
  aspect-radio: 1/1;
`;
