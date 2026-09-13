const ORDEM_CAMADAS = ["efeito", "corpo", "olho", "boca", "chapeu"];
const RARIDADE_CORES = {
  COMUM: "#aaa",
  RARO: "#3b82f6",
  EPICO: "#a855f7",
  LENDARIO: "#f59e0b",
};

export default function GhostCard({ fantasma, onCapturar, capturando, resultado }) {
  if (!fantasma) return null;
  const camadas = ORDEM_CAMADAS
    .filter((tipo) => fantasma.partes?.[tipo])
    .map((tipo) => ({ tipo, ...fantasma.partes[tipo] }))
  const acessorios = fantasma.partes?.acessorios || [];
  const cor = RARIDADE_CORES[fantasma.raridade] || "#fff";

  return (
    <div className="ghost-card" style={{ borderColor: cor }}>
      <div className="ghost-header">
        <span className="ghost-rarity" style={{ color: cor }}>
          {fantasma.raridade}
        </span>
        <span className="ghost-id">#{fantasma.id_fantasma}</span>
      </div>

      <div className="ghost-stage">
        {camadas.map((camada) => (
          <img key={camada.tipo} src={camada.url} alt={camada.descricao || camada.chave}
            className="ghost-layer"
            style={{zIndex: camadas.indexOf(camada)}}
          />
        ))}
        
          {acessorios.map((acc, i) => (
          <img
            key={i}
            src={acc.url}
            alt={acc.descricao || acc.chave}
            className="ghost-layer"
            style={{ zIndex: camadas.length + i + 1 }}
          />
        ))}
        
  

      </div>

      {resultado ? (
        <div className={`capture-result ${resultado.erro ? "error" : "success"}`}>
          {resultado.erro ? (
            <>
              <p className="error-msg">{resultado.erro}</p>
              {resultado.distancia_metros && (
                <p>Distância: {resultado.distancia_metros}m</p>
              )}
            </>
          ) : (
            <>
              <p className="success-msg">Captura bem-sucedida!</p>
              <p>+{resultado.pontos_ganhos} pontos</p>
              <p>Total: {resultado.pontos_totais} | Nível: {resultado.nivel}</p>
            </>
          )}
        </div>
      ) : (
        <button
          className="capture-btn"
          onClick={onCapturar}
          disabled={capturando}
          style={{ backgroundColor: cor }}
        >
          {capturando ? "Capturando..." : "Capturar Fantasma"}
        </button>
      )}
    </div>
  );
}
