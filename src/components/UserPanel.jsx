import { useState } from "react";

export default function UserPanel({ usuario, onCriarUsuario, onVerificarUsuario }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [idBusca, setIdBusca] = useState("");
  const [modo, setModo] = useState("criar");

  function handleSubmit(e) {
    e.preventDefault();
    if (modo === "criar") {
      onCriarUsuario(nome, email, senha);
    } else {
      onVerificarUsuario(Number(idBusca));
    }
  }

  if (usuario) {
    return (
      <div className="user-panel">
        <h3>Jogador</h3>
        <p className="user-name">{usuario.nome}</p>
        <div className="user-stats">
          <div className="stat">
            <span className="stat-value">{usuario.pontos}</span>
            <span className="stat-label">Pontos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{usuario.nivel}</span>
            <span className="stat-label">Nível</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-panel">
      <h3>Soul Hunter</h3>
      <div className="mode-toggle">
        <button
          className={modo === "criar" ? "active" : ""}
          onClick={() => setModo("criar")}
        >
          Criar Conta
        </button>
        <button
          className={modo === "buscar" ? "active" : ""}
          onClick={() => setModo("buscar")}
        >
          Já tenho conta
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {modo === "criar" ? (
          <>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </>
        ) : (
          <input
            type="number"
            placeholder="ID do usuário"
            value={idBusca}
            onChange={(e) => setIdBusca(e.target.value)}
            required
          />
        )}
        <button type="submit">
          {modo === "criar" ? "Criar Conta" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
