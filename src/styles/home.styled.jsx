import styled from "styled-components";

export const HeaderStyled = styled.header`
  display: flex;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  justify-items: end;
  padding: 1rem 4rem;
  background: rgba(255, 255, 255, 0.061);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  outline: 1px solid rgba(255, 255, 255, 0.2);

  @media screen and (max-width: 680px) {
    justify-content: center;
    flex-flow: column nowrap;
    row-gap: 2rem;
    height: max-content;
    padding: 3rem 0rem;
  }
`;

export const HeaderActions = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  user-select: none;
  gap: 2rem;

  @media screen and (max-width: 942px) {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 680px) {
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const GlassPanel = styled.div`
  padding: 3rem;
  user-select: none;
  border-top-left-radius: 10rem;
  border-bottom-right-radius: 10rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.061);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  -webkit-box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  width: clamp(230px, 100%, 500px);
  color: white;
`;

export const ButtonHomeStyled = styled.button`
  user-select: none;
  position: relative;
  padding: 1.4rem 3rem;
  font-size: 1.6rem;
  color: #fff;
  background: transparent;
  border-top-left-radius: 4rem;
  border-bottom-right-radius: 4rem;
  border: none;
  outline: none;
  cursor: pointer;
  overflow: hidden;
  -webkit-transition: background 0.7s, -webkit-transform 0.7s;
  transition: background 0.7s, -webkit-transform 0.7s;
  transition: background 0.7s, transform 0.7s;
  transition: background 0.7s, transform 0.7s, -webkit-transform 0.7s;
  -webkit-box-shadow: 0 0.8rem 1.5rem rgba(0, 0, 0, 0.3);
  box-shadow: 0 0.8rem 1.5rem rgba(0, 0, 0, 0.3);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    -webkit-transform: skewX(-20deg);
    -ms-transform: skewX(-20deg);
    transform: skewX(-20deg);
  }

  &:hover::after {
    left: 100%;
  }

  &:focus {
    -webkit-animation: pulso 0.6s ease-in-out;
    animation: pulso 0.6s ease-in-out;
    -webkit-transform: scale(1.01);
    -ms-transform: scale(1.01);
    transform: scale(1.01);
    background: linear-gradient(135deg, #e37777, #fb6eef);

    &::after {
      left: 100%;
    }
  }

  &:hover {
    -webkit-transform: scale(1.03);
    -ms-transform: scale(1.03);
    transform: scale(1.03);
    background: linear-gradient(135deg, #e37777, #fb6eef);
  }

  &:active {
    -webkit-animation: pulso 0.6s ease-in-out;
    animation: pulso 0.6s ease-in-out;
    -webkit-transform: scale(0.95);
    -ms-transform: scale(0.95);
    transform: scale(0.95);
  }
`;

export const Listagem = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 100%;
  max-width: 1248.8px;
  margin: 0 auto;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;
  gap: 0.8rem;
  padding: 0rem 3rem;
  font-size: 1.6rem;

  @media screen and (max-width: 730px) {
    padding: 0rem 3rem;
  }
`;

export const RegistroHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(114px, 251px));
  background: transparent;
  padding: 1.6rem;
  text-align: center;
  font-weight: bold;
  user-select: none;
  border-radius: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  border-bottom: 2px solid white;
  margin-bottom: 0.8rem;

  & span {
    font-weight: bold;
    cursor: pointer;
    color: white;
    font-size: 1.6rem;

    &:first-child {
      text-align: left;
    }

    &:last-child {
      text-align: end;
    }
  }

  @media screen and (max-width: 730px) {
    display: none;
  }
`;

export const Registro = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 0;
  user-select: none;
  background: rgba(255, 255, 255, 0.061);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  padding: 1.6rem;
  width: 100%;
  border-radius: 0.8rem;
  -webkit-box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.1);
  box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  -webkit-transition: -webkit-transform 0.7s ease;
  transition: -webkit-transform 0.7s ease;
  transition: transform 0.7s ease;
  transition: transform 0.7s ease, -webkit-transform 0.7s ease;
  color: white;

  &:first-child:hover {
    -webkit-transform: scaleX(1);
    -ms-transform: scaleX(1);
    transform: scaleX(1);
    cursor: default;
  }

  &:hover {
    -webkit-transform: scale(1.01);
    -ms-transform: scale(1.01);
    transform: scale(1.01);
  }

  & span {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: center;
    position: relative;
    z-index: 1;
    min-width: 8rem;

    &:first-child {
      text-align: left;
    }

    &:last-child {
      text-align: right;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(120deg, transparent 40%, #8828ff 50%, transparent 60%);
    -webkit-transform: skewX(-20deg);
    -ms-transform: skewX(-20deg);
    transform: skewX(-20deg);
    -webkit-transition: left 0.7s ease;
    transition: left 0.7s ease;
    z-index: 0;
  }

  &:hover::before {
    left: 0%;
  }

  @media screen and (max-width: 730px) {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-flow: column nowrap;
    flex-flow: column nowrap;
    width: 100%;
    gap: 0.8rem;
    background: linear-gradient(135deg, transparent, rgba(119, 0, 255, 0.2470588235));
    color: white;
    padding: 1.5rem;
    border-radius: 1.5rem;
    -webkit-box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    margin-bottom: 1.5rem;
    font-weight: 500;
    text-align: center;
    grid-template-columns: 1fr;

    & span:first-child {
      font-size: 1.45rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #fff;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

      &::before {
        content: "📅 ";
      }
    }

    & span:not(:first-child) {
      font-size: 1.3rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.3rem 0.7rem;
      border-radius: 10px;
    }
    
    & span:nth-child(2)::before {
      content: "🛒 Vendas: ";
      }

    & span:nth-child(3)::before {
      content: "🍞 Sobras: ";
      }

    & span:nth-child(4)::before {
      content: "🏭 Produção: ";
      }

    & span:nth-child(5)::before {
      content: "📈 Aproveitamento: ";
      text-align: center;
    }

      
`;

export const Relatorio = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 4rem;
  margin-top: 4rem;
  margin-bottom: 4rem;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
`;

export const RankingMenu = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 4rem;
  display: none;
  -webkit-transition: all 0.5s ease;
  transition: all 0.5s ease;
  opacity: 0;
  height: 0;

  &.visible {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    opacity: 1;
    height: auto;
    margin-top: 3rem;
    margin-bottom: 5rem;
  }
`;
