'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '@/lib/DataContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to request password reset');
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

          <h1>Reset Password</h1>
          <p className="auth-subtitle">Enter your registered email address to receive password reset instructions.</p>

          {submitted ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', fontWeight: '700', marginBottom: '8px' }}>
                <CheckCircle2 size={24} /> Reset Email Sent
              </div>
              <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                If an account exists for <strong>{email}</strong>, we have sent instructions to reset your password. Please check your inbox and spam folder.
              </p>
              <Link href="/login" className="btn btn-secondary btn-full" style={{ marginTop: '20px', textAlign: 'center', justifyContent: 'center' }}>
                <ArrowLeft size={16} /> Return to Login
              </Link>
            </div>
          ) : (
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

              {error && <div className="form-error-message" style={{ color: 'var(--color-error)', marginBottom: '12px' }}>{error}</div>}

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Send Reset Link'} <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <Link href="/login" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="auth-right">
        <div className="bg-circles">
          <div className="circle" style={{ width: 400, height: 400, top: -100, right: -100 }} />
        </div>
        <div className="auth-right-content">
          <h2>Secure Candidate Screening</h2>
          <p>Protecting recruiter accounts with encrypted authentication and single-use reset security tokens.</p>
        </div>
      </div>
    </div>
  );
}
