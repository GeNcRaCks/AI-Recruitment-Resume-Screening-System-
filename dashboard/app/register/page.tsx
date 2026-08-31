'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, User, Building, ArrowRight, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { API_BASE, useData } from '@/lib/DataContext';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useData();

  useEffect(() => {
    // Pre-warm backend container on register page mount
    fetch(`${API_BASE}/docs`).catch(() => {});
  }, []);

  // Password requirement checks
  const passwordChecks = useMemo(() => ({
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasDigit: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(formData.password),
  }), [formData.password]);

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setSubmitted(true);
    setError('');

    if (!isPasswordValid) {
      setPasswordError('Please meet all password requirements below.');
      return;
    }

    setPasswordError('');
    setLoading(true);
    
    try {
      await register(formData.name, formData.email, formData.password, formData.company);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register');
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

          <h1>Create an account</h1>
          <p className="auth-subtitle">Start screening resumes with AI in minutes.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Work Email</label>
              <div className="form-input-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Company Name</label>
              <div className="form-input-icon">
                <Building size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className={`form-input ${submitted && !isPasswordValid ? 'form-input-error' : ''}`}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (passwordError) setPasswordError('');
                  }}
                  minLength={8}
                  required
                />
              </div>
              {/* Password strength bar */}
              <div className="password-strength">
                <div className={`bar active ${formData.password.length > 0 ? 'weak' : ''}`} />
                <div className={`bar active ${formData.password.length >= 6 && passwordChecks.hasDigit ? 'medium' : ''}`} />
                <div className={`bar active ${isPasswordValid ? 'strong' : ''}`} />
              </div>
              {/* Password requirements checklist */}
              {formData.password.length > 0 && (
                <ul className="password-requirements">
                  <li className={passwordChecks.minLength ? 'met' : submitted ? 'unmet' : ''}>
                    {passwordChecks.minLength ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                    At least 8 characters
                  </li>
                  <li className={passwordChecks.hasUppercase ? 'met' : submitted ? 'unmet' : ''}>
                    {passwordChecks.hasUppercase ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                    One uppercase letter (A–Z)
                  </li>
                  <li className={passwordChecks.hasLowercase ? 'met' : submitted ? 'unmet' : ''}>
                    {passwordChecks.hasLowercase ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                    One lowercase letter (a–z)
                  </li>
                  <li className={passwordChecks.hasDigit ? 'met' : submitted ? 'unmet' : ''}>
                    {passwordChecks.hasDigit ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                    One digit (0–9)
                  </li>
                  <li className={passwordChecks.hasSpecial ? 'met' : submitted ? 'unmet' : ''}>
                    {passwordChecks.hasSpecial ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                    One special character (!@#$%...)
                  </li>
                </ul>
              )}
              {/* Error message */}
              {passwordError && (
                <div className="form-error-message">{passwordError}</div>
              )}
            </div>

            <div className="form-checkbox">
              <input type="checkbox" id="terms" required defaultChecked />
              <label htmlFor="terms">I agree to the Terms of Service &amp; Privacy Policy</label>
            </div>

            {error && <div className="form-error-message" style={{ color: 'var(--color-error)', marginBottom: '12px' }}>{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={(formData.password.length > 0 && !isPasswordValid) || loading}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Get Started Free'} <ArrowRight size={18} />
            </button>
            {loading && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '8px', textAlign: 'center' }}>
                Connecting to server — this can take up to a minute if it&apos;s been idle...
              </p>
            )}
          </form>

          <p className="auth-switch" style={{ marginTop: '24px' }}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="bg-circles">
          <div className="circle" style={{ width: 400, height: 400, top: -100, right: -100 }} />
        </div>
        <div className="auth-right-content">
          <h2>Join 1,000+ Modern Recruiters</h2>
          <p>Automate resume processing, review ranked candidate shortlists, and send email reports directly to hiring managers.</p>
        </div>
      </div>
    </div>
  );
}

