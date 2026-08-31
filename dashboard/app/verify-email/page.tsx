'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE } from '@/lib/DataContext';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setMessage('Missing email verification token.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.detail || 'Email verification failed.');
        }
        setSuccess(true);
        setMessage(data.message || 'Your email address has been verified successfully!');
      } catch (err: unknown) {
        setSuccess(false);
        setMessage(err instanceof Error ? err.message : 'Verification failed.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

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

          <h1>Email Verification</h1>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px 0' }}>
              <Loader2 className="animate-spin" size={36} color="#6366f1" />
              <p style={{ color: '#9ca3af' }}>Verifying your email address...</p>
            </div>
          ) : success ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', fontWeight: '700', marginBottom: '8px' }}>
                <CheckCircle2 size={24} /> Email Verified!
              </div>
              <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                {message}
              </p>
              <Link href="/login" className="btn btn-primary btn-full" style={{ marginTop: '24px', textAlign: 'center', justifyContent: 'center' }}>
                Sign In to Dashboard <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', fontWeight: '700', marginBottom: '8px' }}>
                <AlertCircle size={24} /> Verification Failed
              </div>
              <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                {message}
              </p>
              <Link href="/login" className="btn btn-secondary btn-full" style={{ marginTop: '24px', textAlign: 'center', justifyContent: 'center' }}>
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="auth-right">
        <div className="bg-circles">
          <div className="circle" style={{ width: 400, height: 400, top: -100, right: -100 }} />
        </div>
        <div className="auth-right-content">
          <h2>Verified Recruiter Platform</h2>
          <p>Email verification keeps candidate records secure and ensures accurate delivery of candidate shortlist reports.</p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg)' }}>
        <Loader2 className="animate-spin" size={32} color="#6366f1" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
