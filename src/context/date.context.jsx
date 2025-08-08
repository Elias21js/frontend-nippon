import { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const local = localStorage.getItem("dataSelecionada");
    const actualMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    const actualYear = new Date().getFullYear();
    return local ? JSON.parse(local) : { mes: actualMonth, ano: actualYear }; // padrão
  });

  useEffect(() => {
    localStorage.setItem("dataSelecionada", JSON.stringify(dataSelecionada));
  }, [dataSelecionada]);

  return <DataContext.Provider value={{ dataSelecionada, setDataSelecionada }}>{children}</DataContext.Provider>;
}
