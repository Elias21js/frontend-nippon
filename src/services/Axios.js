import axios from "axios";

// let requests = 0;

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

// Intercepta requisições
// axios.interceptors.request.use((config) => {
//   requests++;
//   document.body.style.cursor = "none !important";
//   return config;
// });

// // Intercepta respostas
// axios.interceptors.response.use(
//   (res) => {
//     requests--;
//     if (requests === 0) document.body.style.cursor = "default";
//     return res;
//   },
//   (err) => {
//     requests--;
//     if (requests === 0) document.body.style.cursor = "default";
//     return Promise.reject(err);
//   }
// );

export default axios;
