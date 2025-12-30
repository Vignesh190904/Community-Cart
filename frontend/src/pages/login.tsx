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

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('cc_token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('cc_user') : null;
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
      router.replace('/customer/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const res = await api.auth.login({ email, password });
      const { token, user } = res.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cc_token', token);
        localStorage.setItem('cc_user', JSON.stringify(user));
        if (user.role === 'vendor') {
          localStorage.setItem('cc_vendorId', user.id);
        }
        if (user.role === 'user') {
          localStorage.setItem('cc_customerId', user.id);
        }
      }
      setAuthToken(token);
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
    <div className="container" style={{ maxWidth: 420, marginTop: '60px' }}>
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
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
