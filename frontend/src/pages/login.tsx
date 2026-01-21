import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api, setAuthToken } from '../services/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
    if (storedToken && storedUser) {
      const user = JSON.parse(storedUser);
      setAuthToken(storedToken);
      redirectByRole(user.role);
    }
  }, []);

  const redirectByRole = (role: string) => {
    if (role === 'admin') {
      router.replace('/admin/dashboard');
    } else if (role === 'vendor') {
      router.replace('/vendor/dashboard');
    } else {
      router.replace('/customer/browse-products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const res = await api.auth.login({ email, password });
      const { auth_token, user } = res.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', auth_token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        if (user.role === 'vendor') {
          localStorage.setItem('cc_vendorId', user.id);
        }
        if (user.role === 'user') {
          localStorage.setItem('cc_customerId', user.id);
        }
      }
      setAuthToken(auth_token);
      setMessage('✅ Login successful');
      setMessageType('success');
      redirectByRole(user.role);
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container login-container">
      <h1>Community Cart</h1>
      <p className="subtitle">Sign in to continue</p>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="form" autoComplete="on">
        <input
          type="email"
          name="email"
          autoComplete="username"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-field-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <img
              src={showPassword ? '/customer/assets/icons/hide.svg' : '/customer/assets/icons/view.svg'}
              alt=""
              className="password-toggle-icon"
            />
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
