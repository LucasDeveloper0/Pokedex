import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const Badges = () => {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState([]);
  const [myBadges, setMyBadges] = useState([]);

  const loadData = async () => {
    // 1. Busca o catálogo global de insígnias
    try {
      const catRes = await api.get('/global-badges');
      setCatalog(catRes.data || []);
    } catch (error) {
      console.error("Erro ao buscar catálogo global de insígnias:", error);
    }

    // 2. Busca as insígnias adquiridas direto da rota dedicada
    try {
      const stored = JSON.parse(localStorage.getItem('@pokedex:trainer') || '{}');
      if (stored.id) {
        const myRes = await api.get(`/treinadores/${stored.id}/badges`);
        setMyBadges(myRes.data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar insígnias conquistadas:", error);
    }
  };

  const claimBadge = async (badge: any) => {
    const stored = JSON.parse(localStorage.getItem('@pokedex:trainer') || '{}');
    if (!stored.id) return alert("Sessão expirada. Faça login novamente.");

    try {
      await api.post('/treinadores/badges', {
        trainerId: stored.id,
        badgeId: badge.id,
        name: badge.name,
        gym: badge.gym
      });

      alert(`Insígnia ${badge.name} conquistada! 🏆`);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao reivindicar.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
        <h1 style={{
          fontSize: '1.875rem',
          lineHeight: '2.25rem',
          fontWeight: 700,
          color: '#db9e06'
        }}>Galeria de Insígnias</h1>
        <button onClick={() => navigate('/dashboard')} style={{
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
        }}>Voltar</button>
      </header>

      <main style={{
        maxWidth: '56rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        <section style={{
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid #1e293b'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#0665db'
          }}>Insígnias Disponível</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            gap: '0.75rem'
          }}>
            {catalog.length === 0 ? (
              <p style={{
                color: '#cfd4dd',
                fontSize: '0.875rem',
                lineHeight: '1.25rem'
              }}>Nenhuma insígnia no catálogo global.</p>
            ) : (
              catalog.map((b: any) => {
                const jaTem = myBadges.some((myB: any) => myB.name === b.name);

                return (
                  <div key={b.id} style={{
                    backgroundColor: '#f6fcd4',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #1e293b',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{
                        fontWeight: 700,
                        color: '#000'
                      }}>{b.name}</p>
                      <p style={{
                        fontSize: '0.75rem',
                        lineHeight: '1rem',
                        color: '#64748b'
                      }}>Ginásio: {b.gym}</p>
                    </div>
                    {jaTem ? (
                      <span style={{
                        fontSize: '0.75rem',
                        lineHeight: '1rem',
                        backgroundColor: '#34d399',
                        color: '#fff',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontWeight: 700
                      }}>
                        Conquistada ✔
                      </span>
                    ) : (
                      <button
                        onClick={() => claimBadge(b)}
                        style={{
                          backgroundColor: '#6292fa',
                          color: '#fff',
                          fontSize: '0.75rem',
                          lineHeight: '1rem',
                          border: '4px solid rgba(96, 165, 250, 0.3)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          fontWeight: 700,
                          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer'
                        }}
                      >
                        Reivindicar
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section style={{
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid #1e293b'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#5032b1'
          }}>Minhas Conquistas</h2>
          {myBadges.length === 0 ? (
            <p style={{
              color: '#cfd4dd',
              fontSize: '0.875rem',
              lineHeight: '1.25rem'
            }}>Nenhuma insígnia conquistada ainda.</p>
          ) : (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {myBadges.map((b: any) => (
                <div key={b.id} style={{
                  backgroundColor: 'rgba(135, 117, 212, 0.7)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.75rem',
                  borderRadius: '9999px',
                  textAlign: 'center',
                  width: '6rem',
                  height: '6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <p>{b.name}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};