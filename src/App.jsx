import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/jogos';

function App() {
  const [pagina, setPagina] = useState('inicio');
  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState('');
  const [horas, setHoras] = useState('');
  const [zerado, setZerado] = useState(false);
  const [jogos, setJogos] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function carregarJogos() {
    setCarregando(true);
    setErro('');

    try {
      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error('Falha ao buscar jogos.');
      }

      const dados = await resposta.json();
      setJogos(dados);
    } catch {
      setErro(
        'Não foi possível conectar à API. Verifique se o json-server está ligado.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarJogos();
  }, []);

  function abrirPagina(novaPagina) {
    setPagina(novaPagina);
  }

  async function adicionar(e) {
    e.preventDefault();
    setErro('');

    if (!nome.trim() || !genero || horas === '') {
      setErro('Preencha o nome, o gênero e as horas jogadas.');
      return;
    }

    const novoJogo = {
      nome: nome.trim(),
      genero,
      horas: Number(horas),
      zerado,
    };

    setSalvando(true);

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoJogo),
      });

      if (!resposta.ok) {
        throw new Error('Falha ao salvar jogo.');
      }

      const jogoSalvo = await resposta.json();

      setJogos((listaAtual) => [...listaAtual, jogoSalvo]);
      setNome('');
      setGenero('');
      setHoras('');
      setZerado(false);
      setErro('');
    } catch {
      setErro(
        'Não foi possível salvar o jogo. Verifique se o json-server está ligado.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <header className="cabecalho">
        <h1>Lista de Jogos</h1>

        <nav className="menu">
          <button
            type="button"
            className={pagina === 'inicio' ? 'ativo' : ''}
            onClick={() => abrirPagina('inicio')}
          >
            Início
          </button>

          <button
            type="button"
            className={pagina === 'cadastro' ? 'ativo' : ''}
            onClick={() => abrirPagina('cadastro')}
          >
            Cadastro
          </button>

          <button
            type="button"
            className={pagina === 'sobre' ? 'ativo' : ''}
            onClick={() => abrirPagina('sobre')}
          >
            Sobre
          </button>
        </nav>
      </header>

      <main>
        {erro && (
          <p className="erro" role="alert">
            {erro}
            <button
              type="button"
              onClick={carregarJogos}
              style={{ marginLeft: '12px' }}
            >
              Tentar novamente
            </button>
          </p>
        )}

        {pagina === 'inicio' && (
          <section className="pagina">
            <h2>Bem-vindo à Lista de Jogos!</h2>

            <p>
              Este aplicativo permite cadastrar e organizar os jogos que você
              possui ou já jogou.
            </p>

            <p>
              Jogos cadastrados: <strong>{jogos.length}</strong>
            </p>

            <button type="button" onClick={() => abrirPagina('cadastro')}>
              Cadastrar jogo
            </button>
          </section>
        )}

        {pagina === 'cadastro' && (
          <section className="pagina">
            <h2>Cadastrar jogo</h2>

            <form onSubmit={adicionar}>
              <div className="campo">
                <label htmlFor="nome">Nome do jogo</label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome do jogo"
                />
              </div>

              <div className="campo">
                <label htmlFor="genero">Gênero</label>
                <select
                  id="genero"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                >
                  <option value="">Selecione o gênero</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Ação">Ação</option>
                  <option value="RPG">RPG</option>
                  <option value="Esporte">Esporte</option>
                  <option value="Estratégia">Estratégia</option>
                  <option value="Corrida">Corrida</option>
                </select>
              </div>

              <div className="campo">
                <label htmlFor="horas">Horas jogadas</label>
                <input
                  id="horas"
                  type="number"
                  min="0"
                  value={horas}
                  onChange={(e) => setHoras(e.target.value)}
                  placeholder="Digite as horas jogadas"
                />
              </div>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={zerado}
                  onChange={(e) => setZerado(e.target.checked)}
                />
                Já zerei
              </label>

              <button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Adicionar'}
              </button>
            </form>

            <h2>Jogos cadastrados</h2>

            {carregando && <p>Carregando jogos da API...</p>}

            {!carregando && jogos.length === 0 && !erro && (
              <p>Nenhum jogo cadastrado ainda.</p>
            )}

            <ul>
              {jogos.map((jogo) => (
                <li key={jogo.id}>
                  <strong>{jogo.nome}</strong>
                  <br />
                  Gênero: {jogo.genero}
                  <br />
                  Horas jogadas: {jogo.horas}
                  <br />
                  {jogo.zerado ? 'Já zerei' : 'Ainda não zerei'}
                </li>
              ))}
            </ul>
          </section>
        )}

        {pagina === 'sobre' && (
          <section className="pagina">
            <h2>Sobre o projeto</h2>

            <p>
              A Lista de Jogos é um aplicativo para cadastrar e organizar
              informações sobre jogos.
            </p>

            <p>
              É possível informar o nome, o gênero, as horas jogadas e se o jogo
              já foi zerado.
            </p>

          </section>
        )}
      </main>
    </>
  );
}

export default App;
