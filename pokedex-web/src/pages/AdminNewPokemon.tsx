import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// 1. Interface corrigida incluindo todas as propriedades necessárias
interface PokemonOption {
  id: string;
  name: string;
  pokedexNum: number;
}

export const AdminNewPokemon = () => {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState<PokemonOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    pokedexNum: '',
    type1: '',
    type2: '',
    evolvesToId: ''
  });

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await api.get('/pokemons');
        const sorted = response.data.sort((a: any, b: any) => Number(a.pokedexNum) - Number(b.pokedexNum));
        setPokemons(sorted);
      } catch (err) {
        console.error('Erro ao buscar lista de pokémons para evolução:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        pokedexNum: Number(form.pokedexNum),
        type1: form.type1,
        type2: form.type2 || null,
        evolvesToId: form.evolvesToId || null
      };

      await api.post('/pokemons', payload);
      alert('Espécie adicionada com sucesso! 🎉');
      navigate('/admin/pokemons');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar o Pokémon no catálogo global.');
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
        }}> Cadastrar Nova Espécie</h2>

        {/* Nome */}
        <input
          placeholder="Nome (Ex: Pikachu)"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={{
            backgroundColor: '#020617',
            border: '1px solid #1e293b',
            padding: '0.625rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem'
          }}
          required
        />

        {/* Número da Pokédex */}
        <input
          type="number"
          placeholder="Nº da Pokédex (Ex: 25)"
          value={form.pokedexNum}
          onChange={e => setForm({ ...form, pokedexNum: e.target.value })}
          style={{
            backgroundColor: '#020617',
            border: '1px solid #1e293b',
            padding: '0.625rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem'
          }}
          required
        />

        {/* Tipagem */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '1rem'
        }}>
          <input
            placeholder="1º Tipo (Ex: Eletrico)"
            value={form.type1}
            onChange={e => setForm({ ...form, type1: e.target.value })}
            style={{
              backgroundColor: '#020617',
              border: '1px solid #1e293b',
              padding: '0.625rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem'
            }}
            required
          />
          <input
            placeholder="2º Tipo (Opcional)"
            value={form.type2}
            onChange={e => setForm({ ...form, type2: e.target.value })}
            style={{
              backgroundColor: '#020617',
              border: '1px solid #1e293b',
              padding: '0.625rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem'
            }}
          />
        </div>

        {/* Evolução */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem'
        }}>
          <label style={{
            fontSize: '0.75rem',
            color: '#000'
          }}>Evolução (Opcional)</label>
          <select
            value={form.evolvesToId}
            onChange={e => setForm({ ...form, evolvesToId: e.target.value })}
            style={{
              backgroundColor: '#020617',
              border: '1px solid #1e293b',
              padding: '0.625rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem'
            }}
            disabled={loading}
          >
            <option value="">Nenhuma evolução (Forma Final)</option>
            {pokemons.map((poke) => (
              <option key={poke.id} value={poke.id}>
                {poke.name} (#{poke.pokedexNum})
              </option>
            ))}
          </select>
        </div>

        {/* Botões */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.5rem'
        }}>
          <button type="submit" style={{
            backgroundColor: '#5fe85d',
            width: '100%',
            paddingTop: '0.625rem',
            paddingBottom: '0.625rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: '700',
            cursor: 'pointer',
            transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '150ms'
          }}>
            Salvar na Base
          </button>
          <button type="button" onClick={() => navigate('/admin/pokemons')} style={{
            backgroundColor: '#ef4444',
            width: '100%',
            paddingTop: '0.625rem',
            paddingBottom: '0.625rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: '700',
            cursor: 'pointer',
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