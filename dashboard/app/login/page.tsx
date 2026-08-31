'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { API_BASE, useData } from '@/lib/DataContext';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('oauth_error') || '';
  });
  const [loading, setLoading] = useState(false);
  const { login } = useData();

  useEffect(() => {
    // Fire-and-forget health-check request to wake cold backend container early
    fetch(`${API_BASE}/docs`).catch(() => {});
  }, []);

  const startOAuth = (provider: 'google' | 'linkedin') => {
    window.location.href = `${API_BASE}/auth/${provider}/login`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-form-container">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <img src="/recruitpro-logo.svg" alt="RecruitPro AI logo" />
            </div>
            <span>RecruitPro AI</span>
          </Link>

          <h1>Welcome back</h1>
          <p className="auth-subtitle">Log in to your recruiter dashboard to manage candidates.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="form-input-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-footer">
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <Link href="/forgot-password">Forgot password?</Link>
              </div>
              <div className="form-input-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-checkbox">
              <input type="checkbox" id="remember" defaultChecked />
              <label htmlFor="remember">Remember me for 30 days</label>
            </div>

            {error && <div className="form-error-message" style={{ color: 'var(--color-error)', marginBottom: '12px' }}>{error}</div>}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'} <ArrowRight size={18} />
            </button>
            {loading && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '8px', textAlign: 'center' }}>
                Connecting to server — this can take up to a minute if it&apos;s been idle...
              </p>
            )}
          </form>

          <div className="social-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn" onClick={() => startOAuth('google')}>Google</button>
            <button type="button" className="social-btn" onClick={() => startOAuth('linkedin')}>LinkedIn</button>
          </div>

          <p className="auth-switch">
            Don&apos;t have an account? <Link href="/register">Create account</Link>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="bg-circles">
          <div className="circle" style={{ width: 400, height: 400, top: -100, right: -100 }} />
          <div className="circle" style={{ width: 300, height: 300, bottom: -50, left: -50 }} />
        </div>
        <div className="auth-right-content">
          <h2>Streamline Candidate Screening</h2>
          <p>Rank resumes with multi-model NLP, extract candidate strengths & gaps, and generate interview questions in seconds.</p>
        </div>
      </div>
    </div>
  );
}
