import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const AdminNewTrainer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', originRegion: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Reutiliza a rota padrão de criação de treinador do sistema
      await api.post('/treinadores', form);
      alert('Treinador (Cliente) cadastrado com sucesso!');
      navigate('/admin/treinadores'); // <-- Ajustado para garantir o retorno correto
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao cadastrar.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md flex flex-col gap-4">
        <h2 className="text-xl font-bold text-yellow-500">👤 Cadastrar Treinador (Admin)</h2>
        <input placeholder="Nome Completo" onChange={e => setForm({...form, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm" required/>

        <input type="email" placeholder="E-mail de Acesso" onChange={e => setForm({...form, email: e.target.value})} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm" required/>

        <input type="password" placeholder="Senha Provisória" onChange={e => setForm({...form, password: e.target.value})} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm" required/>

        <input placeholder="Região Natal (Ex: Johto)" onChange={e => setForm({...form, originRegion: e.target.value})} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm" required/>

        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-yellow-600 text-slate-950 w-full py-2.5 rounded-xl text-sm font-bold">Criar Conta</button>
          
          <button type="button" onClick={() => navigate('/admin/treinadores')} className="bg-slate-800 w-full py-2.5 rounded-xl text-sm">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};