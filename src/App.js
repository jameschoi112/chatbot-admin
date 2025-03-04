import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './pages/LoginPage';
import CreateBot from './pages/CreateBot';
import BotList from './pages/bots/BotList';
import BotDetail from './pages/bots/BotDetail';
import UserAdd from './pages/users/UserAdd';
import UserList from './pages/users/UserList';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 토큰을 확인하여 인증 상태 결정
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // 로딩 중일 때 간단한 로딩 표시
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* 공개 경로 */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />
        } />

        {/* 보호된 경로 */}
        <Route path="/" element={
          isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />
        } />

        {/* 봇 생성 페이지 추가 */}
        <Route path="/create-bot" element={
          isAuthenticated ? <CreateBot /> : <Navigate to="/login" replace />
        } />

        {/* 기타 경로는 모두 대시보드 또는 로그인으로 리다이렉트 */}
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        } />
        <Route path="/bots" element={
          isAuthenticated ? <BotList /> : <Navigate to="/login" replace />
        } />

        <Route path="/bots/:botId" element={
          isAuthenticated ? <BotDetail /> : <Navigate to="/login" replace />
        } />

        <Route path="/users" element={
          isAuthenticated ? <UserList /> : <Navigate to="/login" replace />
        } />

        <Route path="/users/add" element={
          isAuthenticated ? <UserAdd /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;