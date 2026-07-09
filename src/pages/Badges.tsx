import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const Badges = () => {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState([]);
  const [myBadges, setMyBadges] = useState([]);

  const loadData = async () => {
    const stored = JSON.parse(localStorage.getItem('@pokedex:trainer') || '{}');
    const [catRes, myRes] = await Promise.all([
      api.get('/global-badges'),
      api.get(`/treinadores/${stored.id}`)
    ]);
    setCatalog(catRes.data);
    setMyBadges(myRes.data.badges || []);
  };

  const claimBadge = async (badge: any) => {
    const stored = JSON.parse(localStorage.getItem('@pokedex:trainer') || '{}');
    try {
      await api.post('/treinadores/badges', {
        trainerId: stored.id,
        name: badge.name,
        gym: badge.gym
      });
      alert(`Insígnia ${badge.name} conquistada! 🏆`);
      loadData();
    } catch (err: any) { alert(err.response?.data?.error); }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400">🏆 Galeria de Insígnias</h1>
        <button onClick={() => navigate('/dashboard')} className="bg-slate-800 px-4 py-2 rounded-xl text-sm">Voltar</button>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Catálogo Disponível</h2>
          <div className="grid grid-cols-1 gap-3">
            {catalog.map((b: any) => (
              <div key={b.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-200">{b.name}</p>
                  <p className="text-xs text-slate-500">Ginásio: {b.gym}</p>
                </div>
                <button onClick={() => claimBadge(b)} className="bg-blue-600 text-xs px-3 py-2 rounded-lg font-bold">Reivindicar</button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Minhas Conquistas</h2>
          <div className="flex flex-wrap gap-4">
            {myBadges.map((b: any) => (
              <div key={b.id} className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-full text-center w-24 h-24 flex flex-col justify-center items-center">
                <span className="text-2xl">🏅</span>
                <p className="text-[10px] font-bold mt-1 uppercase">{b.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};