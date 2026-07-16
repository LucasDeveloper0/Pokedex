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

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Catálogo Disponível */}
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Catálogo Disponível</h2>
          <div className="grid grid-cols-1 gap-3">
            {catalog.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhuma insígnia no catálogo global.</p>
            ) : (
              catalog.map((b: any) => {
                const jaTem = myBadges.some((myB: any) => myB.name === b.name);

                return (
                  <div key={b.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-200">{b.name}</p>
                      <p className="text-xs text-slate-500">Ginásio: {b.gym}</p>
                    </div>
                    {jaTem ? (
                      <span className="text-xs bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-lg font-bold">
                        Conquistada ✔
                      </span>
                    ) : (
                      <button 
                        onClick={() => claimBadge(b)} 
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded-lg font-bold transition-all"
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

        {/* Minhas Conquistas */}
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Minhas Conquistas</h2>
          {myBadges.length === 0 ? (
            <p className="text-slate-500 text-sm">Nenhuma insígnia conquistada ainda.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {myBadges.map((b: any) => (
                <div key={b.id} className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-full text-center w-24 h-24 flex flex-col justify-center items-center">
                  <span className="text-2xl">🏅</span>
                  <p className="text-[10px] font-bold mt-1 uppercase text-emerald-400 truncate w-full px-1">{b.name}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};