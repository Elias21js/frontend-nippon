import axios from "axios";

export async function getRegistros({ ano, mes }) {
  try {
    const registros = await axios.get(import.meta.env.VITE_API_URL + `/registros/${ano}/${mes}`, {
      withCredentials: true,
    });
    return registros;
  } catch (error) {
    throw error;
  }
}
