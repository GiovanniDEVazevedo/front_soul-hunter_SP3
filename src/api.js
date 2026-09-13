const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export function criarUsuario(nome, email, senha) {
  return request("/usuario", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha }),
  });
}

export function buscarUsuario(id) {
  return request(`/usuario/${id}`);
}

export function investigarCasa(latitude, longitude) {
  return request("/casa/investigar", {
    method: "POST",
    body: JSON.stringify({ latitude, longitude }),
  });
}

export function capturarFantasma(id_usuario, id_fantasma, latitude, longitude) {
  return request("/captura", {
    method: "POST",
    body: JSON.stringify({ id_usuario, id_fantasma, latitude, longitude }),
  });
}

export function listarSpawns() {
  return request("/spawn");
}

export function buscarFantasma(id) {
  return request(`/fantasma/${id}`);
}
