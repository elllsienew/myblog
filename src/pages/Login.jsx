import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 设置访问密码（可以随时修改）
const ACCESS_PASSWORD = "german2026";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === ACCESS_PASSWORD) {
      // 验证通过，保存到 localStorage
      localStorage.setItem("german_access", "true");
      localStorage.setItem("german_access_time", new Date().toISOString());
      navigate("/");
    } else {
      setError("密码错误，请重试");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-light text-gray-800 mb-2 text-center">德语学习平台</h1>
        <p className="text-gray-600 text-center mb-8">请输入访问密码</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              访问密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="请输入密码"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            进入
          </button>
        </form>
        
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>提示：购买后会收到访问密码</p>
        </div>
      </div>
    </div>
  );
}
