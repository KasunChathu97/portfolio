import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('http://localhost:5000/api/login', credentials)
      .then(res => {
        if (res.data.success) {
          // Login success nam browser eke mathakaya (localStorage) update karanawa
          localStorage.setItem('isAuthenticated', 'true');
          navigate('/admin'); // Kelinma Admin panel ekata geniyanawa
        }
      })
      .catch(err => {
        // Password hari namawath weradi nam error eka pennanawa
        setError('Username or Password incorrect!');
        console.error(err);
      });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Admin <span className="text-emerald-400">Login</span></h2>
          <p className="text-slate-400">Secure access to your workspace</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-6 text-center text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input type="text" name="username" value={credentials.username} onChange={handleChange} required 
              className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition" 
              placeholder="Enter username" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input type="password" name="password" value={credentials.password} onChange={handleChange} required 
              className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition" 
              placeholder="Enter password" />
          </div>

          <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl text-lg hover:from-emerald-400 hover:to-emerald-500 transition shadow-lg shadow-emerald-500/25">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;