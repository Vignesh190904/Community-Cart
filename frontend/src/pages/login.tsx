import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api, setAuthToken } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { sign_in, is_authenticated, role } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // AUTH GUARD: Redirect if already authenticated
  useEffect(() => {
    if (is_authenticated && role) {
      redirectByRole(role);
    }
  }, [is_authenticated, role]);

  const redirectByRole = (userRole: string) => {
    if (userRole === 'admin') {
      router.replace('/admin/dashboard');
    } else if (userRole === 'vendor') {
      router.replace('/vendor/dashboard');
    } else {
      router.replace('/customer/browse-products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLocal(true);
    setMessage('');
    setMessageType('');

    try {
      const res = await api.auth.login({ email, password });
      const { auth_token, user } = res.data;

      // Update global auth state - this will trigger the useEffect above
      sign_in(user, auth_token);

      setMessage('✅ Login successful');
      setMessageType('success');

      // Manual redirect as backup in case useEffect is slow
      redirectByRole(user.role);
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
      setMessageType('error');
    } finally {
      setLoadingLocal(false);
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
        <button type="submit" disabled={loadingLocal}>
          {loadingLocal ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
