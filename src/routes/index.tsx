import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from '../pages/Auth';
import { Dashboard } from '../pages/Dashboard';
import { Teams } from '../pages/Teams';
import { AdminPokemons } from '../pages/AdminPokemons';
import { AdminNewPokemon } from '../pages/AdminNewPokemon';
import { AdminTrainers } from '../pages/AdminTrainers';
import { AdminNewTrainer } from '../pages/AdminNewTrainer';
import { Badges } from '../pages/Badges'; // <-- NOVO
import { AdminBadges } from '../pages/AdminBadges'; // <-- NOVO

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('@pokedex:token');
  return token ? children : <Navigate to="/" />;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Auth />} />

        {/* Rotas do Treinador (Protegidas) */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/teams" element={<PrivateRoute><Teams /></PrivateRoute>} />
        <Route path="/badges" element={<PrivateRoute><Badges /></PrivateRoute>} />

        {/* Rotas do Admin (Modo Deus) */}
        <Route path="/admin/pokemons" element={<AdminPokemons />} />
        <Route path="/admin/pokemons/novo" element={<AdminNewPokemon />} />
        <Route path="/admin/treinadores" element={<AdminTrainers />} />
        <Route path="/admin/treinadores/novo" element={<AdminNewTrainer />} />
        <Route path="/admin/badges" element={<AdminBadges />} />

        {/* Fallback de Segurança */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};