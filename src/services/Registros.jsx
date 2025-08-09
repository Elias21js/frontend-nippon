import axios from "../services/Axios.js";

export async function getRegistros({ ano, mes }) {
  try {
    const registros = await axios.get(`/registros/${ano}/${mes}`);
    return registros;
  } catch (error) {
    throw error;
  }
}
