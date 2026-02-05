import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import German from "./pages/German";
import GermanPlayer from "./pages/GermanPlayer";
import Login from "./pages/Login";
import "./index.css";

// 检查是否已授权
function checkAuth() {
  return localStorage.getItem("german_access") === "true";
}

// 路由守卫组件
function ProtectedRoute({ children }) {
  const isAuth = checkAuth();
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// 导航栏组件
function Navigation() {
  const location = useLocation();
  const isAuth = checkAuth();
  
  // 在登录页面不显示导航栏
  if (location.pathname === "/login" || !isAuth) {
    return null;
  }
  
  const handleLogout = () => {
    if (window.confirm("确定要退出吗？")) {
      localStorage.removeItem("german_access");
      localStorage.removeItem("german_access_time");
      window.location.reload();
    }
  };
  
  return (
    <header className="flex justify-between items-center px-10 py-6 bg-white shadow-sm text-lg font-light text-gray-800">
      <div className="flex gap-10">
        <Link to="/" className="hover:underline">学习</Link>
        <Link to="/player" className="hover:underline">播放器</Link>
      </div>
      <button 
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        退出
      </button>
    </header>
  );
}

function GermanApp() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-800">
        <Navigation />

        {/* 页面内容 */}
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <German />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/player" 
              element={
                <ProtectedRoute>
                  <GermanPlayer />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

createRoot(document.getElementById("root")).render(<GermanApp />);
