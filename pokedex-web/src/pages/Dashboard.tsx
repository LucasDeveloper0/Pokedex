import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // <-- Adicionado para navegação
import { api } from '../services/api'

interface PokemonBase {
  id: string
  name: string
  pokedexNum: number
  type1: string
  type2?: string | null
  evolvesToId?: string | null
}

interface CapturedPokemon {
  id: string
  nickname: string
  level: number
  pokemon: PokemonBase
}

interface TrainerData {
  trainer: string
  region: string
  team: CapturedPokemon[]
}

export const Dashboard = () => {
  const navigate = useNavigate() // <-- Inicializando o hook de navegação
  const [trainerInfo, setTrainerInfo] = useState<TrainerData | null>(null)
  const [availablePokemons, setAvailablePokemons] = useState<PokemonBase[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedPokemonId, setSelectedPokemonId] = useState('')
  const [nickname, setNickname] = useState('')
  const [level, setLevel] = useState(1)
  const [isCapturing, setIsCapturing] = useState(false)

  const fetchTeam = async () => {
    try {
      setLoading(true)
      const storedTrainer = localStorage.getItem('@pokedex:trainer');
      const trainerId = storedTrainer ? JSON.parse(storedTrainer).id : "";
      
      const response = await api.get(`/treinadores/${trainerId}/time`)
      setTrainerInfo(response.data) 
    } catch (error) {
      console.error("Erro ao buscar time:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailablePokemons = async () => {
    try {
      const response = await api.get('/pokemons')
      setAvailablePokemons(response.data)
    } catch (error) {
      console.error("Erro ao buscar Pokémons globais:", error)
    }
  }

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPokemonId) return alert('Selecione um Pokémon!')

    try {
      setIsCapturing(true)
      const storedTrainer = localStorage.getItem('@pokedex:trainer');
      const trainerId = storedTrainer ? JSON.parse(storedTrainer).id : "";

      await api.post('/capturas', {
        trainerId,
        pokemonId: selectedPokemonId,
        nickname: nickname || undefined,
        level: Number(level)
      })

      alert("Pokémon capturado com sucesso!")
      setSelectedPokemonId('')
      setNickname('')
      setLevel(1)
      fetchTeam()
    } catch (error: any) {
      alert(`Erro ao capturar: ${error.response?.data?.error || 'Tente novamente.'}`)
    } finally {
      setIsCapturing(false)
    }
  }

  const handleEvolve = async (capturedId: string) => {
    try {
      const response = await api.patch(`/pokemons/${capturedId}/evoluir`, { level: 16 })
      if (response.status === 200 || response.status === 204) {
        alert("Parabéns! Seu Pokémon evoluiu com sucesso!")
        fetchTeam() 
      }
    } catch (error: any) {
      alert(`Erro: ${error.response?.data?.error || 'Não foi possível evoluir'}`)
    }
  }


  const handleRelease = async (capturedId: string) => {
    if (!confirm("Tem certeza que deseja soltar este Pokémon na natureza? 🍃")) return;
    
    try {
      await api.delete(`/pokemons/${capturedId}`)
      alert("Pokémon liberado com sucesso!")
      fetchTeam()
    } catch (error: any) {
      alert(`Erro ao liberar: ${error.response?.data?.error || 'Tente novamente.'}`)
    }
  }

  useEffect(() => {
    fetchTeam()
    fetchAvailablePokemons()
  }, [])

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="max-w-5xl mx-auto mb-12 border-l-4 border-blue-500 pl-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-red-600">
            Pokédex 
          </h1>
          {trainerInfo && (
            <p className="text-slate-400 mt-2">
              Treinador: <span className="text-slate-200 font-semibold">{trainerInfo.trainer}</span> | 
              Região: <span className="text-slate-200 font-semibold"> {trainerInfo.region}</span>
            </p>
          )}
        </div>
        
        <div className="flex gap-3">
            {/* 🏆 BOTÃO ADICIONADO PARA IR ÀS INSÍGNIAS */}
            <button 
                onClick={() => navigate('/badges')}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
                🏆 Minhas Insígnias
            </button>

            <button 
                onClick={() => navigate('/teams')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
                🛡️ Gerenciar Times
            </button>
            
            <button 
                onClick={handleLogout}
                className="bg-slate-900 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
                Sair da Conta
            </button>
            </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-12 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
            🎒 Registrar Nova Captura
          </h2>
          <form onSubmit={handleCapture} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold">ESPÉCIE</label>
              <select
                value={selectedPokemonId}
                onChange={e => setSelectedPokemonId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Selecione o Pokémon...</option>
                {availablePokemons.map(p => (
                  <option key={p.id} value={p.id}>
                    #{String(p.pokedexNum).padStart(3, '0')} - {p.name} ({p.type1})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold">APELIDO (OPCIONAL)</label>
              <input
                type="text"
                placeholder="Ex: Sparky"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold">NÍVEL INICIAL</label>
              <input
                type="number"
                min="1"
                max="100"
                value={level}
                onChange={e => setLevel(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isCapturing}
              className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-semibold text-sm transition-all disabled:bg-slate-800 disabled:text-slate-500"
            >
              {isCapturing ? 'Capturando...' : 'Lançar Pokébola 🔴'}
            </button>
          </form>
        </section>

        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          Time Atual
        </h2>

        {loading ? (
          <p className="text-slate-400">Carregando Pokémons do banco...</p>
        ) : !trainerInfo || trainerInfo.team.length === 0 ? (
          <p className="text-slate-500 italic">Nenhum Pokémon capturado no time.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainerInfo.team.map((captured) => (
              <div 
                key={captured.id} 
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs text-slate-500 font-mono">#{String(captured.pokemon.pokedexNum).padStart(3, '0')}</span>
                      <h3 className="text-xl font-bold">{captured.nickname || captured.pokemon.name}</h3>
                      <p className="text-xs text-slate-400 italic">Espécie: {captured.pokemon.name}</p>
                    </div>
                    <span className="bg-slate-800 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                      Nv. {captured.level}
                    </span>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <span className="bg-blue-950/40 text-blue-400 border border-blue-900/50 px-2 py-0.5 rounded text-xs uppercase font-medium">
                      {captured.pokemon.type1}
                    </span>
                    {captured.pokemon.type2 && (
                      <span className="bg-purple-950/40 text-purple-400 border border-purple-900/50 px-2 py-0.5 rounded text-xs uppercase font-medium">
                        {captured.pokemon.type2}
                      </span>
                    )}
                  </div>
                </div>

                {/* BOTÕES DE AÇÃO: Agrupados em coluna */}
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => handleEvolve(captured.id)}
                    disabled={!captured.pokemon.evolvesToId}
                    className={`w-full py-2 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
                      captured.pokemon.evolvesToId
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-md shadow-blue-500/20 active:scale-[0.98]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {captured.pokemon.evolvesToId ? '⚡ Evoluir Pokémon' : '✨ Evolução Máxima'}
                  </button>

                  {/* BOTÃO NOVO: Deletar/Liberar */}
                  <button
                    onClick={() => handleRelease(captured.id)}
                    className="w-full py-2 bg-slate-900 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 rounded-xl font-semibold text-xs transition-all"
                  >
                    🍃 Soltar na Natureza
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}