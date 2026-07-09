import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const AdminTrainers = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', originRegion: '' });

  const loadTrainers = async () => {
    try {
      const { data } = await api.get('/treinadores');
      setTrainers(data);
    } catch (error) {
      console.error("Erro ao carregar treinadores:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Banir e excluir permanentemente este treinador?")) return;
    try {
      await api.delete(`/admin/treinadores/${id}`);
      loadTrainers();
    } catch (error) {
      alert("Erro ao deletar treinador.");
    }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.patch(`/admin/treinadores/${id}`, editForm);
      setEditingId(null);
      loadTrainers();
    } catch (error) {
      alert("Erro ao editar treinador.");
    }
  };

  useEffect(() => { 
    loadTrainers(); 
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Cabeçalho de Navegação */}
      <div className="max-w-4xl mx-auto flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-yellow-500">👑 Controle de Treinadores (Clientes)</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/pokemons')}
            className="bg-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500 transition-all"
          >
            🦖 Ver Pokémons
          </button>

          <button
            onClick={() => navigate('/admin/treinadores/novo')}
            className="bg-yellow-600 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold hover:bg-yellow-500 transition-all"
          >
            ➕ Novo Treinador
          </button>

          <button
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="bg-slate-800 px-4 py-2 rounded-xl text-sm hover:bg-slate-700 transition-all"
          >
            Sair do Painel
          </button>
        </div>
      </div>

      {/* 🟢 TABELA ADICIONADA: Onde os dados da Sara e outros vão aparecer */}
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-4">
        {trainers.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">Nenhum treinador cadastrado no sistema.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-2">Nome</th>
                <th className="p-2">E-mail</th>
                <th className="p-2">Região</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((t: any) => (
                <tr key={t.id} className="border-b border-slate-800/50">
                  <td className="p-2">
                    {editingId === t.id ? (
                      <input 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})} 
                        className="bg-slate-950 p-1 rounded border border-slate-700 text-slate-200 outline-none"
                      />
                    ) : t.name}
                  </td>
                  <td className="p-2 text-slate-400">{t.email}</td>
                  <td className="p-2">
                    {editingId === t.id ? (
                      <input 
                        value={editForm.originRegion} 
                        onChange={e => setEditForm({...editForm, originRegion: e.target.value})} 
                        className="bg-slate-950 p-1 rounded border border-slate-700 text-slate-200 outline-none"
                      />
                    ) : t.originRegion}
                  </td>
                  <td className="p-2 flex gap-2">
                    {editingId === t.id ? (
                      <button onClick={() => handleSaveEdit(t.id)} className="text-green-400 hover:underline">Salvar</button>
                    ) : (
                      <button onClick={() => { setEditingId(t.id); setEditForm({ name: t.name, originRegion: t.originRegion }); }} className="text-blue-400 hover:underline">Editar</button>
                    )}
                    <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};