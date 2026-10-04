import axios from "axios";
import seed from "../../data/courses";
const KEY = "videobelajar_courses";
const baseURL = import.meta.env.VITE_API_BASE_URL;
// Adapter mock Axios: data tetap tersedia setelah browser dimuat ulang.
async function mockAdapter(config) {
  let rows = JSON.parse(localStorage.getItem(KEY) || "null") || seed;
  const id = config.url.split("/")[2];
  const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
  let data;
  const index = rows.findIndex(row => String(row.id) === id);
  if (config.method === "get") data = rows;
  else if (config.method === "post") {
    data = { ...body, id: Math.max(0, ...rows.map(row => Number(row.id))) + 1 };
    rows = [...rows, data];
  } else {
    if (index < 0) throw new Error("Kelas tidak ditemukan.");
    if (config.method === "patch") {
      data = { ...rows[index], ...body, id: rows[index].id };
      rows = rows.map((row, i) => i === index ? data : row);
    } else if (config.method === "delete") {
      data = rows[index]; rows = rows.filter((_, i) => i !== index);
    } else throw new Error("Metode API tidak didukung.");
  }
  if (config.method !== "get") localStorage.setItem(KEY, JSON.stringify(rows));
  return { data, status: 200, statusText: "OK", headers: {}, config };
}
export const api = axios.create({ baseURL: baseURL || "/", timeout: 15000,
  ...(baseURL ? {} : { adapter: mockAdapter }) });
export const getData = async () => (await api.get("/courses")).data;
export const addData = async data => (await api.post("/courses", data)).data;
export const editData = async (id, data) => (await api.patch(`/courses/${id}`, data)).data;
export const deleteData = async id => { await api.delete(`/courses/${id}`); return id; };
