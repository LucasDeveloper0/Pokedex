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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#e3e3e3',
      color: 'black',
      padding: '20px',
      borderRadius: '8px',
      border: '8px solid #ef4444'
    }}>
      <div style={{
        maxWidth: '56rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          lineHeight: '2rem',
          fontWeight: 700,
          color: '#000'
        }}>🛠️ Gerenciar Catálogo de Insígnias</h1>
        <button onClick={() => navigate('/admin/pokemons')} style={{
          backgroundColor: '#334155',
          color: '#fff',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}>Voltar ao Admin</button>
      </div>

      <div style={{
        maxWidth: '56rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '2rem'
      }}>
        <form onSubmit={handleCreate} style={{
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          height: 'fit-content'
        }}>
          <h3 style={{
            fontWeight: '700'
          }}>Nova Insígnia</h3>
          <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{
            backgroundColor: '#0f172a',
            color: '#fff',
            border: '1px solid #334155',
            padding: '0.5rem',
            borderRadius: '0.5rem'
          }} />
          <input placeholder="Ginásio" value={form.gym} onChange={e => setForm({ ...form, gym: e.target.value })} style={{
            backgroundColor: '#0f172a',
            color: '#fff',
            border: '1px solid #334155',
            padding: '0.5rem',
            borderRadius: '0.5rem'
          }} />
          <button type="submit" style={{
            backgroundColor: '#5ee679',
            color: '#000',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>Adicionar ao Catálogo</button>
        </form>

        <div style={{
          gridColumn: 'span 2 / span 2',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid #1e293b'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            gap: '1rem'
          }}>
            {badges.map((b: any) => (
              <div key={b.id} style={{
                backgroundColor: '#ecf1a6',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #1e293b'
              }}>
                <p style={{
                  fontWeight: '700'
                }}>🏅 {b.name} <span style={{
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>({b.gym})</span></p>
                <button onClick={() => handleDelete(b.id)} style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}>
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};