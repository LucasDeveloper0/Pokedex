import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const AdminPokemons = () => {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', type1: '' });

  const loadPokemons = async () => {
    const { data } = await api.get('/pokemons');
    setPokemons(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta espécie do catálogo global?")) return;
    await api.delete(`/admin/pokemons/${id}`);
    loadPokemons();
  };

  const handleSaveEdit = async (id: string) => {
    await api.patch(`/pokemons/${id}`, editForm);
    setEditingId(null);
    loadPokemons();
  };

  useEffect(() => { loadPokemons(); }, []);

  return (
    <><div className="min-h-screen bg-slate-950 text-slate-100 p-8">
          <div className="max-w-4xl mx-auto flex justify-between mb-6">
              <h1 className="text-2xl font-bold text-red-500">⚙️ Catálogo Global de Pokémons</h1>
              <div className="flex gap-2">
                  <div className="max-w-4xl mx-auto flex justify-between mb-6">
                    <h1 className="text-2xl font-bold text-red-500">⚙️ Catálogo Global de Pokémons</h1>
                    <div className="flex gap-2">
                        {/* 🏆 BOTÃO ADICIONADO PARA GERENCIAR INSÍGNIAS NO CATÁLOGO */}
                        <button 
                        onClick={() => navigate('/admin/badges')} 
                        className="bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-500 transition-all"
                        >
                        🏅 Catálogo de Insígnias
                        </button>

                        <button 
                        onClick={() => navigate('/admin/treinadores')} 
                        className="bg-yellow-600 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold hover:bg-yellow-500 transition-all"
                        >
                        👥 Ver Treinadores
                        </button>
                        
                        <button 
                        onClick={() => navigate('/admin/pokemons/novo')} 
                        className="bg-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500 transition-all"
                        >
                        ➕ Novo Pokémon
                        </button>
                        
                        <button 
                        onClick={() => { localStorage.clear(); navigate('/'); }} 
                        className="bg-slate-800 px-4 py-2 rounded-xl text-sm hover:bg-slate-700 transition-all"
                        >
                        Sair do Painel
                        </button>
                    </div>
                </div>
              </div>
          </div>
      </div><div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <table className="w-full text-left text-sm">
                  <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                          <th className="p-2">Nº Pokedex</th>
                          <th className="p-2">Nome</th>
                          <th className="p-2">Tipo Principal</th>
                          <th className="p-2">Ações</th>
                      </tr>
                  </thead>
                  <tbody>
                      {pokemons.map((p: any) => (
                          <tr key={p.id} className="border-b border-slate-800/50">
                              <td className="p-2">#{p.pokedexNum}</td>
                              <td className="p-2">
                                  {editingId === p.id ? (
                                      <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="bg-slate-950 p-1 rounded border border-slate-700" />
                                  ) : p.name}
                              </td>
                              <td className="p-2">
                                  {editingId === p.id ? (
                                      <input value={editForm.type1} onChange={e => setEditForm({ ...editForm, type1: e.target.value })} className="bg-slate-950 p-1 rounded border border-slate-700" />
                                  ) : p.type1}
                              </td>
                              <td className="p-2 flex gap-2">
                                  {editingId === p.id ? (
                                      <button onClick={() => handleSaveEdit(p.id)} className="text-green-400">Salvar</button>
                                  ) : (
                                      <button onClick={() => { setEditingId(p.id); setEditForm({ name: p.name, type1: p.type1 }); } } className="text-blue-400">Editar</button>
                                  )}
                                  <button onClick={() => handleDelete(p.id)} className="text-red-400">Excluir</button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div></>
  );
};