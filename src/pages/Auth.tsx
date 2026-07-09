import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    originRegion: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/login' : '/treinadores';
      
      const dataToSend = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const { data } = await api.post(endpoint, dataToSend);

      if (isLogin) {
        // Salva o Token e os Dados do Treinador/Admin no LocalStorage
        localStorage.setItem('@pokedex:token', data.token);
        localStorage.setItem('@pokedex:trainer', JSON.stringify(data.trainer));
        
        // 🔀 REDIRECIONAMENTO INTELIGENTE (Treinador vs Modo Deus)
        if (data.isAdmin) {
          alert('Modo Deus Ativado! Bem-vindo ao Painel de Controle ⚡');
          navigate('/admin/pokemons'); 
        } else {
          alert('Bem-vindo, Treinador! 🎮');
          navigate('/dashboard'); 
        }
      } else {
        alert('Cadastro realizado! Agora faça o login.');
        setIsLogin(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro na autenticação. Verifique os dados.');
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
      <form onSubmit={handleAuth}>
        {!isLogin && (
          <>
            <input 
              placeholder="Nome" 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required
            />
            <input 
              placeholder="Região (Kanto, Johto...)" 
              onChange={e => setFormData({...formData, originRegion: e.target.value})} 
              required
            />
          </>
        )}
        <input 
          type="email" 
          placeholder="E-mail" 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          required
        />
        <input 
          type="password" 
          placeholder="Senha" 
          onChange={e => setFormData({...formData, password: e.target.value})} 
          required
        />
        <button type="submit">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: '#38bdf8', marginTop: '15px' }}>
        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
      </p>
    </div>
  );
};