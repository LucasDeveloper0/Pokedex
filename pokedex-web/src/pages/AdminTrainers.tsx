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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#e3e3e3',
      border: '8px solid #ef4444',
      color: '#000000',
      padding: '2rem'
    }}>
      {/* Cabeçalho de Navegação */}
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
          fontWeight: '700',
          color: '#eab308'
        }}>👑 Controle de Treinadores (Clientes)</h1>
        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => navigate('/admin/pokemons')}
            style={{
              backgroundColor: '#7cdaf4',
              color: '#000',
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: 600,
              transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
          >
            Voltar ao Painel Principal
          </button>

          <button
            onClick={() => navigate('/admin/treinadores/novo')}
            style={{
              backgroundColor: '#92ec6b',
              color: '#000',
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: 600,
              transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
          >
            ➕ Novo Treinador
          </button>

          <button
            onClick={() => { localStorage.clear(); navigate('/'); }}
            style={{
              backgroundColor: '#ef4444',
              color: '#000',
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: 600,
              transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
          >
            Sair do Painel
          </button>
        </div>
      </div>


      <div style={{
        maxWidth: '56rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '1rem',
        padding: '1rem'
      }}>
        {trainers.length === 0 ? (
          <p style={{
            color: '#94a3b8',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            textAlign: 'center',
            padding: '1rem'
          }}>Nenhum treinador cadastrado no sistema.</p>
        ) : (
          <table style={{
            width: '100%',
            textAlign: 'left',
            fontSize: '0.875rem'
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid #1e293b',
                color: '#94a3b8'
              }}>
                <th style={{ padding: '0.5rem' }}>Nome</th>
                <th style={{ padding: '0.5rem' }}>E-mail</th>
                <th style={{ padding: '0.5rem' }}>Região</th>
                <th style={{ padding: '0.5rem' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((t: any) => (
                <tr key={t.id} style={{
                  borderBottom: '1px solid #1e293b',
                  color: '#fff'
                }}>
                  <td style={{ padding: '0.5rem' }}>
                    {editingId === t.id ? (
                      <input
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        style={{
                          backgroundColor: '#020617',
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          border: '1px solid #334155',
                          color: '#fff',
                          outline: 'none'
                        }}
                      />
                    ) : t.name}
                  </td>
                  <td style={{
                    padding: '0.5rem',
                    color: '#fff'
                  }}>{t.email}</td>
                  <td className="p-2">
                    {editingId === t.id ? (
                      <input
                        value={editForm.originRegion}
                        onChange={e => setEditForm({ ...editForm, originRegion: e.target.value })}
                        style={{
                          backgroundColor: '#020617',
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          border: '1px solid #334155',
                          color: '#fff',
                          outline: 'none'
                        }}
                      />
                    ) : t.originRegion}
                  </td>
                  <td style={{
                    padding: '0.5rem',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    {editingId === t.id ? (
                      <button onClick={() => handleSaveEdit(t.id)} style={{
                        color: '#fff', 
                        cursor: 'pointer', 
                        background: '#22c55e', 
                        borderRadius: '0.5rem'
                      }}>Salvar</button>
                    ) : (
                      <button onClick={() => { setEditingId(t.id); setEditForm({ name: t.name, originRegion: t.originRegion }); }} style={{
                        color: '#fff',
                        cursor: 'pointer',
                        background: '#3b82f6',
                        borderRadius: '0.5rem'
                      }}>Editar</button>
                    )}
                    <button onClick={() => handleDelete(t.id)} style={{
                      color: '#fff',
                      cursor: 'pointer',
                      background: '#ef4444',
                      borderRadius: '0.5rem'
                    }}>Excluir</button>
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