import { useState, useEffect, useRef } from "react";
import MapView from "./components/MapView";
import GhostCard from "./components/GhostCard";
import UserPanel from "./components/UserPanel";
import {
  criarUsuario,
  buscarUsuario,
  investigarCasa,
  capturarFantasma,
} from "./api";
import { pontoAleatorio } from "./geo";
import "./App.css";

const geoSupported = typeof navigator !== "undefined" && "geolocation" in navigator;
const QTD_CASAS = 3;
const TEMPO_RESPAWN = 60000;

function App() {
  const [casas, setCasas] = useState([]);
  const [casaAtivaId, setCasaAtivaId] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [fantasma, setFantasma] = useState(null);
  const [playerPosition, setPlayerPosition] = useState(null);
  const [investigating, setInvestigating] = useState(false);
  const [capturando, setCapturando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(
    geoSupported ? null : "Geolocalização não suportada pelo navegador."
  );
  const geoWatched = useRef(false);

  useEffect(() => {
    if (!geoSupported || geoWatched.current) return;
    geoWatched.current = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const posicao = [pos.coords.latitude, pos.coords.longitude];
        setPlayerPosition(posicao);
        const novasCasas = Array.from({ length: QTD_CASAS }, (_, i) => ({
          id: i,
          posicao: pontoAleatorio(posicao, 50, 90),
          status: "ativa",
        }));
        setCasas(novasCasas);
      },
      (err) => {
        setErro(
          "Permissão de localização negada. Ative a geolocalização para jogar."
        );
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  async function handleCriarUsuario(nome, email, senha) {
    try {
      setErro(null);
      const data = await criarUsuario(nome, email, senha);
      setUsuario(data);
    } catch (err) {
      setErro(err.message || "Erro ao criar usuário");
    }
  }

  async function handleVerificarUsuario(id) {
    try {
      setErro(null);
      const data = await buscarUsuario(id);
      setUsuario(data);
    } catch (err) {
      setErro(err.message || "Usuário não encontrado");
    }
  }

  async function handleInvestigate(casa) {
    try {
      setInvestigating(true);
      setErro(null);
      setResultado(null);
      const [lat, lng] = casa.posicao;
      const data = await investigarCasa(lat, lng);
      setFantasma(data);
      setCasaAtivaId(casa.id);
    } catch (err) {
      setErro(err.message || "Erro ao investigar casa");
    } finally {
      setInvestigating(false);
    }
  }

  function marcarCasaCapturada(id) {
    setCasas((atual) =>
      atual.map((c) => (c.id === id ? { ...c, status: "capturada" } : c))
    );
    setTimeout(() => {
      setCasas((atual) =>
        atual.map((c) => (c.id === id ? { ...c, status: "ativa" } : c))
      );
    }, TEMPO_RESPAWN);
  }

  async function handleCapturar() {
    if (!usuario || !fantasma || !playerPosition) {
      setErro("Faça login e investigue a casa antes de capturar.");
      return;
    }
    try {
      setCapturando(true);
      setErro(null);
      const data = await capturarFantasma(
        usuario.id_usuario,
        fantasma.id_fantasma,
        playerPosition[0],
        playerPosition[1]
      );
      setResultado(data);
      if (casaAtivaId !== null) marcarCasaCapturada(casaAtivaId);
      const updated = await buscarUsuario(usuario.id_usuario);
      setUsuario(updated);
    } catch (err) {
      setResultado(err);
    } finally {
      setCapturando(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Soul Hunter</h1>
        {usuario && (
          <div className="header-stats">
            <span>{usuario.pontos} pts</span>
            <span>Nv. {usuario.nivel}</span>
          </div>
        )}
      </header>

      {erro && (
        <div className="error-banner">
          <span>{erro}</span>
          <button onClick={() => setErro(null)}>✕</button>
        </div>
      )}

      <div className="app-body">
        <div className="map-area">
          <MapView
            playerPosition={playerPosition}
            casas={casas}
            casaAtivaId={casaAtivaId}
            ghostPosition={
              fantasma?.latitude && fantasma?.longitude
                ? [fantasma.latitude, fantasma.longitude]
                : null
            }
            onInvestigate={handleInvestigate}
            investigating={investigating}
          />
        </div>

        <aside className="sidebar">
          <GhostCard
            fantasma={fantasma}
            onCapturar={handleCapturar}
            capturando={capturando}
            resultado={resultado}
          />
          <UserPanel
            usuario={usuario}
            onCriarUsuario={handleCriarUsuario}
            onVerificarUsuario={handleVerificarUsuario}
          />
        </aside>
      </div>
    </div>
  );
}

export default App;
