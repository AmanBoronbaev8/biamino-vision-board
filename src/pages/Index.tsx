
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import Layout from '../components/Layout';
import HomePage from '../components/HomePage';
import ProjectsList from '../components/ProjectsList';
import ProjectDetail from '../components/ProjectDetail';

const AppRoutes: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚀</div>
          <div className="text-xl text-gray-600">Загрузка Biamino...</div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:department" element={<ProjectsList />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;
