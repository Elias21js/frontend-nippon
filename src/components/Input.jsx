import { forwardRef } from "react";
import { InputStyled } from "../styles/auth.styled.jsx";

function Input({ type, label, placeholder, unique }, ref) {
  return (
    <div className="flex items-start justify-center flex-col gap-2">
      {label ? <label htmlFor={unique}>{label}</label> : ``}
      <InputStyled type={type} name={unique} id={unique} autoComplete="off" ref={ref} placeholder={placeholder} />
    </div>
  );
}

export default forwardRef(Input);
