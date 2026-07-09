import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const AdminBadges = () => {
  const navigate = useNavigate();
  const [badges, setBadges] = useState([]);
  const [form, setForm] = useState({ name: '', gym: '' });

  const loadBadges = async () => {
    const { data } = await api.get('/global-badges');
    setBadges(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/global-badges', form);
    setForm({ name: '', gym: '' });
    loadBadges();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remover insígnia do catálogo oficial?")) {
      await api.delete(`/global-badges/${id}`);
      loadBadges();
    }
  };

  useEffect(() => { loadBadges(); }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto flex justify-between mb-8">
        <h1 className="text-2xl font-bold text-amber-500">🛠️ Gerenciar Catálogo de Insígnias</h1>
        <button onClick={() => navigate('/admin/pokemons')} className="bg-slate-800 px-4 py-2 rounded-xl text-sm">Voltar ao Admin</button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleCreate} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 h-fit">
          <h3 className="font-bold">Nova Insígnia</h3>
          <input placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-sm"/>
          <input placeholder="Ginásio" value={form.gym} onChange={e => setForm({...form, gym: e.target.value})} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-sm"/>
          <button type="submit" className="bg-amber-600 py-2 rounded-lg font-bold">Adicionar ao Catálogo</button>
        </form>

        <div className="md:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="grid grid-cols-1 gap-3">
            {badges.map((b: any) => (
              <div key={b.id} className="bg-slate-950 p-4 rounded-xl flex justify-between items-center border border-slate-800">
                <p className="font-bold">🏅 {b.name} <span className="text-xs text-slate-500 ml-2">({b.gym})</span></p>
                <button onClick={() => handleDelete(b.id)} className="text-red-500 text-xs font-bold">Excluir</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};