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
      navigate('/admin/treinadores'); 
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao cadastrar.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#e3e3e3',
      border: '8px solid #ef4444', 
      color: '#fff',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid #334155',
        padding: '1.5rem',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '28rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#000'
        }}>👤 Cadastrar Treinador (Admin)</h2>

        {/* Nome Completo */}
        <input 
          placeholder="Nome Completo" 
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} 
          style={{
            backgroundColor: '#020617',
            border: '1px solid #1e293b',
            padding: '0.625rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            color: '#fff'
          }} 
          required
        />

        {/* E-mail de Acesso */}
        <input 
          type="email" 
          placeholder="E-mail de Acesso" 
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} 
          style={{
            backgroundColor: '#020617',
            border: '1px solid #1e293b',
            padding: '0.625rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            color: '#fff'
          }} 
          required
        />

        {/* Senha Provisória */}
        <input 
          type="password" 
          placeholder="Senha Provisória" 
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} 
          style={{
            backgroundColor: '#020617',
            border: '1px solid #1e293b',
            padding: '0.625rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            color: '#fff'
          }} 
          required
        />

        {/* Região Natal */}
        <input 
          placeholder="Região Natal (Ex: Johto)" 
          value={form.originRegion}
          onChange={e => setForm({...form, originRegion: e.target.value})} 
          style={{
            backgroundColor: '#020617',
            border: '1px solid #1e293b',
            padding: '0.625rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            color: '#fff'
          }} 
          required
        />

        {/* Botões */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.5rem'
        }}>
          <button type="submit" style={{
            backgroundColor: '#5fe85d',
            color: '#020617',
            width: '100%',
            paddingTop: '0.625rem',
            paddingBottom: '0.625rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: '700',
            cursor: 'pointer',
            border: 'none',
            transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '150ms'
          }}>
            Criar Conta
          </button>
          
          <button type="button" onClick={() => navigate('/admin/treinadores')} style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            width: '100%',
            paddingTop: '0.625rem',
            paddingBottom: '0.625rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: '700',
            cursor: 'pointer',
            border: 'none',
            transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '150ms'
          }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};