'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, User, Building, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
  });

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

          <h1>Create an account</h1>
          <p className="auth-subtitle">Start screening resumes with AI in minutes.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Sarah Mitchell"
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
                  placeholder="sarah@company.com"
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
                  placeholder="TechVision Inc."
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
                  className="form-input"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="password-strength">
                <div className={`bar active ${formData.password.length > 0 ? 'weak' : ''}`} />
                <div className={`bar active ${formData.password.length >= 6 ? 'medium' : ''}`} />
                <div className={`bar active ${formData.password.length >= 10 ? 'strong' : ''}`} />
              </div>
            </div>

            <div className="form-checkbox">
              <input type="checkbox" id="terms" required defaultChecked />
              <label htmlFor="terms">I agree to the Terms of Service & Privacy Policy</label>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg">
              Get Started Free <ArrowRight size={18} />
            </button>
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
