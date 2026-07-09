import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

interface PokemonBase {
  name: string
  pokedexNum: number
}

interface CapturedPokemon {
  id: string
  nickname: string
  level: number
  pokemon: PokemonBase
}

interface TeamMember {
  id: string
  captured: CapturedPokemon
}

interface Team {
  id: string
  name: string
  members: TeamMember[]
}

export const Teams = () => {
  const navigate = useNavigate()
  
  // Dados vindos do Banco
  const [capturedPokemons, setCapturedPokemons] = useState<CapturedPokemon[]>([])
  const [trainerTeams, setTrainerTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  // Estados dos Formulários
  const [newTeamName, setNewTeamName] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState('')

  const getTrainerId = () => {
    const storedTrainer = localStorage.getItem('@pokedex:trainer')
    return storedTrainer ? JSON.parse(storedTrainer).id : ""
  }

  // Carrega os Pokémons Capturados e os Times existentes
  const loadData = async () => {
    const trainerId = getTrainerId()
    if (!trainerId) return

    try {
      setLoading(true)
      
      // 1. Puxa todos os capturados para saber quem está disponível para escalar
      const teamResponse = await api.get(`/treinadores/${trainerId}/time`)
      setCapturedPokemons(teamResponse.data.team)

      // 2. Puxa os times já criados pelo treinador
      const teamsResponse = await api.get(`/treinadores/${trainerId}/teams`)
      setTrainerTeams(teamsResponse.data)
      
      // Deixa o primeiro time selecionado por padrão se houver algum
      if (teamsResponse.data.length > 0 && !selectedTeamId) {
        setSelectedTeamId(teamsResponse.data[0].id)
      }
    } catch (error) {
      console.error("Erro ao carregar dados dos times:", error)
    } finally {
      setLoading(false)
    }
  }

  // Cria uma nova estrutura de time (Ex: "Time de Kanto")
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim()) return

    try {
      await api.post('/teams', {
        name: newTeamName,
        trainerId: getTrainerId()
      })
      
      alert("Time estruturado com sucesso! Agora escale os membros. 🛡️")
      setNewTeamName('')
      loadData()
    } catch (error: any) {
      alert(`Erro ao criar time: ${error.response?.data?.error || 'Tente novamente.'}`)
    }
  }

  // Adiciona o Pokémon capturado selecionado ao time ativo
  const handleAddMember = async (capturedId: string) => {
    if (!selectedTeamId) {
      return alert("Por favor, crie ou selecione um time primeiro!")
    }

    try {
      await api.post('/teams/members', {
        teamId: selectedTeamId,
        capturedId
      })

      alert("Pokémon escalado para o grupo! ⚔️")
      loadData() // Recarrega para exibir o slot preenchido e validar a trava de 6 elementos
    } catch (error: any) {
      alert(`Não foi possível escalar: ${error.response?.data?.error || 'Erro desconhecido.'}`)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedTeamId])

  // Localiza qual é o time selecionado na lista para renderizar os 6 slots ativos
  const activeTeam = trainerTeams.find(t => t.id === selectedTeamId)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="max-w-5xl mx-auto mb-12 border-l-4 border-emerald-500 pl-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Gerenciador de <span className="text-emerald-500">Elite</span>
          </h1>
          <p className="text-slate-400 mt-2">Monte sua composição tática limitando-se a até 6 combatentes.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        >
          ⬅️ Voltar ao Dashboard
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: Criação de Times e Seleção */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">🛡️ Novo Elenco</h2>
            <form onSubmit={handleCreateTeam} className="flex flex-col gap-3">
              <input 
                type="text"
                placeholder="Ex: Time de Elite do Lucas"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm outline-none focus:border-emerald-500"
                required
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 py-2 rounded-xl font-semibold text-sm transition-all">
                Criar Estrutura
              </button>
            </form>
          </section>

          <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-3 text-emerald-400">📂 Selecionar Grupo</h2>
            {trainerTeams.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Nenhum time estruturado ainda.</p>
            ) : (
              <select
                value={selectedTeamId}
                onChange={e => setSelectedTeamId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200 focus:border-emerald-500 outline-none"
              >
                {trainerTeams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.members.length}/6)</option>
                ))}
              </select>
            )}
          </section>
        </div>

        {/* COLUNA CENTRAL/DIREITA: Visualização dos 6 Slots e Pokémons Disponíveis */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* SLOTS ATIVOS */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              ⭐ {activeTeam ? activeTeam.name : 'Selecione um Time'} 
              <span className="text-xs font-normal text-slate-500 font-mono">
                ({activeTeam ? activeTeam.members.length : 0}/6 slots ocupados)
              </span>
            </h2>

            {loading ? (
              <p className="text-sm text-slate-400">Carregando escalações...</p>
            ) : !activeTeam || activeTeam.members.length === 0 ? (
              <p className="text-sm text-slate-500 italic p-4 border border-dashed border-slate-800 rounded-xl text-center">
                Nenhum Pokémon convocado para este grupo de batalha ainda. Use a lista abaixo para convocá-los.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTeam.members.map(m => (
                  <div key={m.id} className="bg-slate-950/60 border border-emerald-900/30 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-emerald-400">{m.captured.nickname || m.captured.pokemon.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">Espécie: {m.captured.pokemon.name} | Nv. {m.captured.level}</p>
                    </div>
                    <span className="text-xs bg-slate-900 text-slate-500 px-2 py-1 rounded">Membro</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* LISTA DE POKÉMONS CAPTURADOS DISPONÍVEIS */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 text-blue-400">💼 Seu Inventário / Armazenamento</h2>
            {capturedPokemons.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Você não possui nenhum Pokémon capturado.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto pr-2 flex flex-col gap-2 border border-slate-900 rounded-xl p-2 bg-slate-950/20">
                {capturedPokemons.map(cp => (
                  <div key={cp.id} className="bg-slate-950/40 border border-slate-900 p-3 rounded-xl flex justify-between items-center text-sm">
                    <div>
                      <span className="font-semibold">{cp.nickname || cp.pokemon.name}</span>
                      <span className="text-xs text-slate-500 ml-2 font-mono">({cp.pokemon.name} Nv.{cp.level})</span>
                    </div>
                    <button
                      onClick={() => handleAddMember(cp.id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    >
                      ➕ Escalar no Grupo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

      </main>
    </div>
  )
}