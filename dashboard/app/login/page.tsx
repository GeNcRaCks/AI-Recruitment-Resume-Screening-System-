'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('sarah@company.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-form-container">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <Sparkles size={20} />
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
                <a href="#">Forgot password?</a>
              </div>
              <div className="form-input-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
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

            <button type="submit" className="btn btn-primary btn-full btn-lg">
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div className="social-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn">Google</button>
            <button type="button" className="social-btn">LinkedIn</button>
          </div>

          <p className="auth-switch">
            Don't have an account? <Link href="/register">Create account</Link>
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
