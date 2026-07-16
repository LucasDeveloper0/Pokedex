import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const AdminPokemons = () => {
    const navigate = useNavigate();
    const [pokemons, setPokemons] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: '', type1: '', type2: '', evolvesToId: '' });

    const loadPokemons = async () => {
    const { data } = await api.get('/pokemons');

    const sortedPokemons = data.sort((a: any, b: any) => Number(a.pokedexNum) - Number(b.pokedexNum));
    
    setPokemons(sortedPokemons);
};

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir esta espécie do catálogo global?")) return;
        await api.delete(`/admin/pokemons/${id}`);
        loadPokemons();
    };

    const handleSaveEdit = async (id: string) => {
        await api.patch(`/pokemons/${id}`, {
            ...editForm,
            type2: editForm.type2 || null,
            evolvesToId: editForm.evolvesToId || null
        });
        setEditingId(null);
        loadPokemons();
    };

    useEffect(() => { loadPokemons(); }, []);

    // Função auxiliar para encontrar o nome do Pokémon de evolução a partir do ID
    const getEvolutionName = (evolvesToId: string | null) => {
        if (!evolvesToId) return 'Nenhuma';
        const evolution = pokemons.find(p => p.id === evolvesToId);
        return evolution ? evolution.name : 'Nenhuma';
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#e3e3e3',
            color: 'black',
            padding: '20px',
            borderRadius: '8px',
            border: '8px solid #ef4444'
        }}>
            <div>
                <div style={{
                    maxWidth: '90rem',
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
                    }}>⚙️ Catálogo Global de Pokémons</h1>
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <div style={{
                            maxWidth: '56rem',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                <button
                                    onClick={() => navigate('/admin/badges')}
                                    style={{
                                        backgroundColor: '#e9d354',
                                        color: '#020617',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                        fontWeight: 700,
                                        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🏅 Catálogo de Insígnias
                                </button>

                                <button
                                    onClick={() => navigate('/admin/treinadores')}
                                    style={{
                                        backgroundColor: '#92ec6b',
                                        color: '#020617',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                        fontWeight: 700,
                                        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    👥 Ver Treinadores
                                </button>

                                <button
                                    onClick={() => navigate('/admin/pokemons/novo')}
                                    style={{
                                        backgroundColor: '#7cdaf4',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                        fontWeight: 700,
                                        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ➕ Novo Pokémon
                                </button>

                                <button
                                    onClick={() => { localStorage.clear(); navigate('/'); }}
                                    style={{
                                        backgroundColor: '#ef4444',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Sair do Panel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid #1e293b',
                borderRadius: '0.75rem',
                padding: '1rem'
            }}>
                <table style={{
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem'
                }}>
                    <thead>
                        <tr style={{
                            borderBottom: '1px solid #1e293b',
                            color: '#000'
                        }}>
                            <th style={{ padding: '0.5rem' }}>Nº Pokedex</th>
                            <th style={{ padding: '0.5rem' }}>Nome</th>
                            <th style={{ padding: '0.5rem' }}>Tipo Principal</th>
                            <th style={{ padding: '0.5rem' }}>Segundo Tipo</th>
                            <th style={{ padding: '0.5rem' }}>Evolução</th>
                            <th style={{ padding: '0.5rem' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pokemons.map((p: any) => (
                            <tr key={p.id} style={{
                                borderBottom: '1px solid rgba(30, 41, 59, 0.5)'
                            }}>
                                <td style={{ padding: '0.5rem' }}>#{p.pokedexNum}</td>
                                
                                {/* Nome */}
                                <td style={{ padding: '0.5rem' }}>
                                    {editingId === p.id ? (
                                        <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{
                                            backgroundColor: '#0f172a',
                                            color: '#fff',
                                            border: '1px solid #334155',
                                            padding: '0.25rem',
                                            borderRadius: '0.5rem'
                                        }} />
                                    ) : p.name}
                                </td>

                                {/* Tipo Principal */}
                                <td style={{ padding: '0.5rem' }}>
                                    {editingId === p.id ? (
                                        <input value={editForm.type1} onChange={e => setEditForm({ ...editForm, type1: e.target.value })} style={{
                                            backgroundColor: '#0f172a',
                                            color: '#fff',
                                            border: '1px solid #334155',
                                            padding: '0.25rem',
                                            borderRadius: '0.5rem'
                                        }} />
                                    ) : p.type1}
                                </td>

                                {/* Segundo Tipo (Novo) */}
                                <td style={{ padding: '0.5rem' }}>
                                    {editingId === p.id ? (
                                        <input value={editForm.type2} placeholder="Opcional" onChange={e => setEditForm({ ...editForm, type2: e.target.value })} style={{
                                            backgroundColor: '#0f172a',
                                            color: '#fff',
                                            border: '1px solid #334155',
                                            padding: '0.25rem',
                                            borderRadius: '0.5rem'
                                        }} />
                                    ) : (p.type2 || <span style={{ color: '#64748b' }}>-</span>)}
                                </td>

                                <td style={{ padding: '0.5rem' }}>
                                    {editingId === p.id ? (
                                        <select 
                                            value={editForm.evolvesToId} 
                                            onChange={e => setEditForm({ ...editForm, evolvesToId: e.target.value })} 
                                            style={{
                                                backgroundColor: '#0f172a',
                                                color: '#fff',
                                                border: '1px solid #334155',
                                                padding: '0.25rem',
                                                borderRadius: '0.5rem'
                                            }}
                                        >
                                            <option value="">Nenhuma</option>
                                            {pokemons
                                                .filter(item => item.id !== p.id) // Evita que evolua para si mesmo
                                                .map(item => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))
                                            }
                                        </select>
                                    ) : (
                                        <span style={{ color: p.evolvesToId ? 'inherit' : '#525252' }}>
                                            {getEvolutionName(p.evolvesToId)}
                                        </span>
                                    )}
                                </td>

                                {/* Ações */}
                                <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    {editingId === p.id ? (
                                        <button onClick={() => handleSaveEdit(p.id)} style={{ color: '#fff', cursor: 'pointer', background: '#22c55e', borderRadius: '0.5rem' }}>Salvar</button>
                                    ) : (
                                        <button onClick={() => { 
                                            setEditingId(p.id); 
                                            setEditForm({ 
                                                name: p.name, 
                                                type1: p.type1, 
                                                type2: p.type2 || '', 
                                                evolvesToId: p.evolvesToId || '' 
                                            }); 
                                        }} style={{ color: '#fff', cursor: 'pointer', background: '#3b82f6', borderRadius: '0.5rem' }}>Editar</button>
                                    )}
                                    <button onClick={() => handleDelete(p.id)} style={{ color: '#fff', cursor: 'pointer', background: '#ef4444', borderRadius: '0.5rem' }}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};