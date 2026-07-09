import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const AdminNewPokemon = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', pokedexNum: '', type1: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/pokemons', form);
      alert('Espécie adicionada com sucesso!');
      navigate('/admin/pokemons'); // Retorna automaticamente para a lista
    } catch (err) { alert('Erro ao cadastrar.'); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md flex flex-col gap-4">
        <h2 className="text-xl font-bold text-red-500">🧬 Cadastrar Nova Espécie Global</h2>
        <input placeholder="Nome (Ex: Pikachu)" onChange={e => setForm({...form, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm" required/>
        <input type="number" placeholder="Nº da Pokédex (Ex: 25)" onChange={e => setForm({...form, pokedexNum: e.target.value})} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm" required/>
        <input placeholder="Tipo (Ex: Eletrico)" onChange={e => setForm({...form, type1: e.target.value})} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm" required/>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-red-600 w-full py-2.5 rounded-xl text-sm font-bold">Salvar na Base</button>
          <button type="button" onClick={() => navigate('/admin/pokemons')} className="bg-slate-800 w-full py-2.5 rounded-xl text-sm">Cancelar</button>
        </div>
      </form>
    </div>
  );
};