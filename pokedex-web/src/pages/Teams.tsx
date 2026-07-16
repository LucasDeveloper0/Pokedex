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


  const [capturedPokemons, setCapturedPokemons] = useState<CapturedPokemon[]>([])
  const [trainerTeams, setTrainerTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)


  const [newTeamName, setNewTeamName] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState('')

  const getTrainerId = () => {
    const storedTrainer = localStorage.getItem('@pokedex:trainer')
    return storedTrainer ? JSON.parse(storedTrainer).id : ""
  }


  const loadData = async () => {
    const trainerId = getTrainerId()
    if (!trainerId) return

    try {
      setLoading(true)


      const teamResponse = await api.get(`/treinadores/${trainerId}/time`)
      setCapturedPokemons(teamResponse.data.team)


      const teamsResponse = await api.get(`/treinadores/${trainerId}/teams`)
      setTrainerTeams(teamsResponse.data)


      if (teamsResponse.data.length > 0 && !selectedTeamId) {
        setSelectedTeamId(teamsResponse.data[0].id)
      }
    } catch (error) {
      console.error("Erro ao carregar dados dos times:", error)
    } finally {
      setLoading(false)
    }
  }


  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim()) return

    try {
      await api.post('/teams', {
        name: newTeamName,
        trainerId: getTrainerId()
      })

      alert("Time estruturado com sucesso! Agora escale os membros.")
      setNewTeamName('')
      loadData()
    } catch (error: any) {
      alert(`Erro ao criar time: ${error.response?.data?.error || 'Tente novamente.'}`)
    }
  }


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
      loadData()
    } catch (error: any) {
      alert(`Não foi possível escalar: ${error.response?.data?.error || 'Erro desconhecido.'}`)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedTeamId])


  const activeTeam = trainerTeams.find(t => t.id === selectedTeamId)

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#e3e3e3',
      color: 'black',
      padding: '20px',
      borderRadius: '8px',
      border: '8px solid #ef4444'
    }}>
      <header style={{
        maxWidth: '100rem',
        marginBottom: '3rem',
        borderLeft: '4px solid #ef4444',
        border: '2px solid black',
        borderRadius: '8px',
        paddingLeft: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: "40px",
            lineHeight: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.025em',
          }}>
            Gerenciador de Times
          </h1>
          <p style={{
            color: '#585c60',
            marginTop: '0.5rem'
          }}>Monte seu time com 6 Pokémons!</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: '#74acff',
            color: '#000',
            marginRight: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: 600,
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
        >
          Voltar ao Dashboard
        </button>
      </header>

      <main style={{
        maxWidth: '90rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumn: 'span 1 / span 1',
          gap: '1rem'
        }}>
          <section style={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
            padding: '1rem'
          }}>
            <h2 style={{
              lineHeight: '1.75rem',
              fontWeight: 700,
              color: '#000'
            }}> Novo time</h2>
            <form onSubmit={handleCreateTeam} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <input
                type="text"
                placeholder="Ex: Time de Elite do Lucas"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                style={{
                  backgroundColor: '#020617',
                  color: '#fff',
                  border: '1px solid #1e293b',
                  borderRadius: '0.75rem',
                  padding: '0.625rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  outline: 'none'
                }}
                required
              />
              <button type="submit" style={{
                backgroundColor: '#16bf8a',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                borderRadius: '0.75rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}>
                Criar Estrutura
              </button>
            </form>
          </section>

          <section style={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: '#000'
            }}> Selecionar Grupo</h2>
            {trainerTeams.length === 0 ? (
              <p style={{
                fontSize: '0.95rem',
                lineHeight: '1rem',
                color: '#cfd4dd',
                fontStyle: 'italic'
              }}>Nenhum time estruturado ainda.</p>
            ) : (
              <select
                value={selectedTeamId}
                onChange={e => setSelectedTeamId(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: '0.75rem',
                  padding: '0.625rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  color: '#e2e8f0',
                  outline: 'none'
                }}
              >
                {trainerTeams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.members.length}/6)</option>
                ))}
              </select>
            )}
          </section>
        </div>

        <div style={{
          gridColumn: 'span 2 / span 2',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <section style={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
              fontWeight: 700,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {activeTeam ? activeTeam.name : 'Selecione um Time'}
              <span style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                fontWeight: 400,
                color: '#c9cacb',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
              }}>
                ({activeTeam ? activeTeam.members.length : 0}/6 slots ocupados)
              </span>
            </h2>

            {loading ? (
              <p style={{
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                color: '#94a3b8'
              }}>Carregando escalações...</p>
            ) : !activeTeam || activeTeam.members.length === 0 ? (
              <p style={{
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                color: '#bdc3cc',
                fontStyle: 'italic',
                padding: '1rem',
                border: '1px dashed #1e293b',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                Nenhum Pokémon convocado para este grupo de batalha ainda. Use a lista abaixo para convocá-los.
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '1rem',
              }}>
                {activeTeam.members.map(m => (
                  <div key={m.id} style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid rgba(6, 78, 59, 0.3)',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        lineHeight: '1.25rem',
                        color: '#ffffff'
                      }}>{m.captured.nickname || m.captured.pokemon.name}</h4>
                      <p style={{
                        fontSize: '0.75rem',
                        lineHeight: '1rem',
                        color: '#94a3b8',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                      }}><div style={{ color: '#cfd1d4' }}>Espécie: {m.captured.pokemon.name}</div> Nv. {m.captured.level}</p>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>

          {/* LISTA DE POKÉMONS CAPTURADOS DISPONÍVEIS */}
          <section style={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: '#000'
            }}>Seus Pokémons</h2>
            {capturedPokemons.length === 0 ? (
              <p style={{
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                color: '#64748b',
                fontStyle: 'italic'
              }}>Você não possui nenhum Pokémon capturado.</p>
            ) : (
              <div style={{
                maxHeight: '16rem',
                overflowY: 'auto',
                paddingRight: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                border: '1px solid #0f172a',
                borderRadius: '0.75rem',
                padding: '0.5rem',
                backgroundColor: 'rgba(2, 6, 23, 0.2)'
              }}>
                {capturedPokemons.map(cp => (
                  <div key={cp.id} style={{
                    backgroundColor: 'rgba(2, 6, 23, 0.4)',
                    border: '1px solid #0f172a',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem'
                  }}>
                    <div>
                      <span style={{
                        color: '#ffffff',
                        fontWeight: 400
                      }}>{cp.nickname || cp.pokemon.name}</span>
                      <span style={{
                        fontSize: '0.75rem',
                        lineHeight: '1rem',
                        color: '#cfd1d4',
                        marginLeft: '0.5rem',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                      }}>({cp.pokemon.name} Nv.{cp.level})</span>
                    </div>
                    <button
                      onClick={() => handleAddMember(cp.id)}
                      style={{
                        backgroundColor: '#25eb32',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        lineHeight: '1rem',
                        paddingLeft: '0.75rem',
                        paddingRight: '0.75rem',
                        paddingTop: '0.375rem',
                        paddingBottom: '0.375rem',
                        borderRadius: '0.5rem',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      + Adicionar ao Grupo
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