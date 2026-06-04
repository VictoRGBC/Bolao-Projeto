import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminJogos from './pages/AdminJogos';
import Profile from './pages/Perfil';

const PrivateRoute = ({ children }) => {
    const { authenticated, loading } = useContext(AuthContext);
    if (loading) return <div>Carregando...</div>;
    if (!authenticated) return <Navigate to="/login" />;
    return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin-jogos" element={<PrivateRoute><AdminJogos /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;