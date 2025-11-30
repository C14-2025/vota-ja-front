import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import {
  LoginPage,
  RegisterPage,
  HomePage,
  CreatePollPage,
  PollDetailsPage,
} from '../pages';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/polls/:id" element={<PollDetailsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/polls/create" element={<CreatePollPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
