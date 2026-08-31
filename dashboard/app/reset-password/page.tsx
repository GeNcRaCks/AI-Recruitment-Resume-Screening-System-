'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '@/lib/DataContext';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing password reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !token) return;
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setSubmitted(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
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

          <h1>Set New Password</h1>
          <p className="auth-subtitle">Enter your new account password below.</p>

          {submitted ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', fontWeight: '700', marginBottom: '8px' }}>
                <CheckCircle2 size={24} /> Password Reset Successful!
              </div>
              <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                Your password has been updated. Redirecting to the login page...
              </p>
              <Link href="/login" className="btn btn-primary btn-full" style={{ marginTop: '20px', textAlign: 'center', justifyContent: 'center' }}>
                Go to Sign In Now <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="form-input-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="form-input-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
              </div>

              {error && <div className="form-error-message" style={{ color: 'var(--color-error)', marginBottom: '12px' }}>{error}</div>}

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading || !token}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'} <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="auth-right">
        <div className="bg-circles">
          <div className="circle" style={{ width: 400, height: 400, top: -100, right: -100 }} />
        </div>
        <div className="auth-right-content">
          <h2>Account Security First</h2>
          <p>Passwords are hashed with industry-standard bcrypt algorithms for maximum recruiter data protection.</p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg)' }}>
        <Loader2 className="animate-spin" size={32} color="#6366f1" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
