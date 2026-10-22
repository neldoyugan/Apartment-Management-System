import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaBuilding, FaLock, FaUser } from 'react-icons/fa';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch {
      toast.error('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          <FaBuilding />
          <span>Solara<b>Admin</b></span>
        </div>
        <h1 className="login-card__title">Admin Portal</h1>
        <p className="login-card__sub">Sign in to manage Solara Residences</p>

        <form onSubmit={handleSubmit} id="admin-login-form">
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <div className="input-icon-wrap">
              <FaUser className="input-icon" />
              <input
                id="login-username"
                name="username"
                type="text"
                required
                value={form.username}
                onChange={handleChange}
                placeholder="admin"
                autoComplete="username"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-icon-wrap">
              <FaLock className="input-icon" />
              <input
                id="login-password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>
          <button type="submit" className="btn btn--gold btn--lg btn--block mt-lg" disabled={loading} id="admin-login-submit-btn">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
