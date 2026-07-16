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
    <div
      style={{
        minHeight: '100vh', 
        backgroundColor: '#e3e3e3', 
        color: 'black', 
        padding: '20px', 
        borderRadius: '8px', 
        border: '8px solid #ef4444'
      }}>
      <header
        style={{
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
          <h1
            style={{
              fontSize: "60px",
              lineHeight: '2.5rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
            }}>
            Pokédex
          </h1>
          {trainerInfo && (
            <p
              style={{
                color: '#000000',
                marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}>
              <div>
                Treinador: <span
                  style={{
                    color: '#444649',
                    fontWeight: 600
                  }}>{trainerInfo.trainer}</span>
              </div>
              <div>
                Região: <span
                  style={{
                    color: '#444649',
                    fontWeight: 600
                  }}> {trainerInfo.region}</span>
              </div>
            </p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
          <button
            onClick={() => navigate('/badges')}
            style={{
              backgroundColor: '#e9d354',
              color: '#000',
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: 600,
              transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}>
            Minhas Insígnias
          </button>

          <button
            onClick={() => navigate('/teams')}
            style={{
              backgroundColor: '#7cdaf4',
              color: '#000',
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: 600,
              transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}>
            Gerenciar Times
          </button>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: '#000',
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: 600,
              transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}>
            Sair da Conta
          </button>
        </div>
      </header>

      <main style={{
        maxWidth: '90rem',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <section style={{
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '3rem',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Registrar Nova Captura
          </h2>
          <form onSubmit={handleCapture}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '1rem',
              alignItems: 'flex-end',
              paddingBottom: '1rem',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <label style={{
                  fontSize: '0.95rem',
                  lineHeight: '1rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  marginLeft: '10px'
                }}>Espécie</label>
                <select
                  value={selectedPokemonId}
                  onChange={e => setSelectedPokemonId(e.target.value)}
                  style={{
                    backgroundColor: '#020617',
                    border: '1px solid #1e293b',
                    borderRadius: '0.75rem',
                    padding: '0.625rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                    color: '#e2e8f0',
                    outline: 'none'
                  }}
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
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <label style={{
                  fontSize: '0.95rem',
                  lineHeight: '1rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  marginLeft: '10px'
                }}>Apelido (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Sparky"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  style={{
                    backgroundColor: '#020617',
                    border: '1px solid #1e293b',
                    borderRadius: '0.75rem',
                    padding: '0.625rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                    color: '#e2e8f0',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <label style={{
                  fontSize: '0.95rem',
                  lineHeight: '1rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  marginLeft: '10px'
                }}>Nivel inicial</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={level}
                  onChange={e => setLevel(Number(e.target.value))}
                  style={{
                    backgroundColor: '#020617',
                    border: '1px solid #1e293b',
                    borderRadius: '0.75rem',
                    padding: '0.625rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                    color: '#e2e8f0',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCapturing}
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                width: '60%',
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                borderRadius: '0.75rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isCapturing ? 'Capturando...' : 'Lançar Pokébola!'}
            </button>
          </form>
        </section>

        <h2 style={{
          fontSize: '1.5rem',
          lineHeight: '2rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '9999px',
            backgroundColor: '#f43f5e'
          }}></span>
          Pokémons Capturados
        </h2>

        {loading ? (
          <p style={{
            color: '#94a3b8'
          }}>Carregando Pokémons do banco...</p>
        ) : !trainerInfo || trainerInfo.team.length === 0 ? (
          <p style={{
            color: '#64748b',
            fontStyle: 'italic'
          }}>Nenhum Pokémon capturado no time.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '1.5rem'
          }}>
            {trainerInfo.team.map((captured) => (
              <div
                key={captured.id}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid #1e293b',
                  borderRadius: '1rem',
                  padding: '10%   ',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <span style={{
                        fontSize: '0.75rem',
                        lineHeight: '1rem',
                        color: '#000',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                      }}>
                        #{String(captured.pokemon.pokedexNum).padStart(3, '0')}</span>
                      <h3 style={{
                        fontSize: '1.25rem',
                        lineHeight: '1.75rem',
                        fontWeight: 700
                      }}>
                        {captured.nickname || captured.pokemon.name}</h3>
                      <p style={{
                        fontSize: '1rem',
                        lineHeight: '1rem',
                        color: '#000',
                        fontStyle: 'italic'
                      }}>Espécie: {captured.pokemon.name}</p>
                    </div>
                    <span style={{
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      paddingLeft: '0.75rem',
                      paddingRight: '0.75rem',
                      paddingTop: '0.25rem',
                      paddingBottom: '0.25rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      lineHeight: '1rem',
                      fontWeight: 700
                    }}>
                      Nv. {captured.level}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    marginBottom: '1.5rem'
                  }}>
                    <span style={{
                      backgroundColor: 'rgba(23, 37, 84, 0.4)',
                      color: '#fff',
                      border: '1px solid rgba(30, 58, 138, 0.5)',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      paddingTop: '0.125rem',
                      paddingBottom: '0.125rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      lineHeight: '1rem',
                      textTransform: 'uppercase',
                      fontWeight: 500
                    }}>
                      {captured.pokemon.type1}
                    </span>
                    {captured.pokemon.type2 && (
                      <span style={{
                        backgroundColor: 'rgba(59, 7, 100, 0.4)',
                        color: '#fff',
                        border: '1px solid rgba(76, 29, 149, 0.5)',
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem',
                        paddingTop: '0.125rem',
                        paddingBottom: '0.125rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        lineHeight: '1rem',
                        textTransform: 'uppercase',
                        fontWeight: 500
                      }}>
                        {captured.pokemon.type2}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginTop: '1rem'
                }}>
                  <button
                    onClick={() => handleEvolve(captured.id)}
                    disabled={!captured.pokemon.evolvesToId}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0',
                      borderRadius: '0.75rem',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: captured.pokemon.evolvesToId
                        ? 'linear-gradient(to right, #2563eb, #3b82f6)'
                        : '#1e293b',
                      color: captured.pokemon.evolvesToId ? '#ffffff' : '#64748b',
                      cursor: captured.pokemon.evolvesToId ? 'pointer' : 'not-allowed',
                      border: 'none'
                    }}
                  >
                    {captured.pokemon.evolvesToId ? ' Evoluir Pokémon!' : ' Ultima evolução atingida!'}
                  </button>


                  <button
                    onClick={() => handleRelease(captured.id)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0',
                      backgroundColor: '#21d454', 
                      border: '1px solid #1e293b', 
                      color: '#000', 
                      borderRadius: '0.75rem', 
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      transition: 'all 300ms ease'
                    }}
                  >
                    Soltar na Natureza
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