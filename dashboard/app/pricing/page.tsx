import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, Check, ArrowRight, HelpCircle, Shield, Zap, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing Plans',
  description: 'Simple, transparent pricing for AI candidate screening, resume ranking, and automated interview question generation.',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '[PRICE]',
      period: 'Forever free',
      description: 'Ideal for small teams and solo recruiters testing AI resume screening.',
      badge: null,
      features: [
        'Up to 3 Active Job Postings',
        '25 Resume Screenings / Month',
        'Multi-Model Skill Matching',
        'TF-IDF & Semantic Similarity Scoring',
        'Basic Interview Question Generation',
        'Standard Email Support',
      ],
      ctaText: 'Get Started Free',
      ctaHref: '/register',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '[PRICE]',
      period: 'Per recruiter / month',
      description: 'Designed for fast-growing companies and active talent acquisition teams.',
      badge: 'Most Popular',
      features: [
        'Unlimited Active Job Postings',
        '500 Resume Screenings / Month',
        'Advanced Composite NLP Scoring',
        'AI Hiring Summaries & Candidate Recommendations',
        'Tailored Technical Interview Packages',
        'Export Shortlists to PDF & CSV',
        'Direct Hiring Manager Email Dispatch',
        'Priority Email & Chat Support',
      ],
      ctaText: 'Start Pro Trial',
      ctaHref: '/register',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '[CONTACT SALES]',
      period: 'Custom annual plan',
      description: 'Custom workflows, dedicated account management, and high-volume limits.',
      badge: 'Enterprise',
      features: [
        'Unlimited Job Postings & Resumes',
        'Custom Skill Taxonomy Integration',
        'Custom SSO & Security Policy Compliance',
        'Dedicated Account Manager & Onboarding',
        '99.9% Uptime SLA',
        'Custom API Access & Webhooks',
      ],
      ctaText: 'Contact Sales',
      ctaHref: 'mailto:recruitpro.notifications@gmail.com?subject=RecruitPro%20AI%20Enterprise%20Inquiry',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: 'Do I need a credit card to start the free plan?',
      a: 'No credit card is required to sign up and start screening resumes on the Free plan.',
    },
    {
      q: 'Can I upgrade or downgrade my plan at any time?',
      a: 'Yes, you will be able to manage your tier and seat allocations seamlessly from your account dashboard.',
    },
    {
      q: 'How does resume parsing work?',
      a: 'RecruitPro AI extracts structured text from PDF and DOCX resumes, matching candidate skills and experience against your job requirements using NLP and semantic embeddings.',
    },
    {
      q: 'Is my candidate data kept private?',
      a: 'Yes, candidate resumes and data are strictly isolated to your workspace and processed securely.',
    },
  ];

  return (
    <div style={{ background: 'var(--color-bg, #0b0f19)', minHeight: '100vh', color: '#fff' }}>
      {/* Header Nav */}
      <nav className="landing-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <img src="/recruitpro-logo.svg" alt="RecruitPro AI logo" />
          </div>
          <span>RecruitPro AI</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="/#features">Features</Link></li>
          <li><Link href="/#how-it-works">How It Works</Link></li>
          <li><Link href="/pricing" className="active">Pricing</Link></li>
        </ul>
        <div className="nav-actions">
          <Link href="/login" className="btn btn-secondary">Log In</Link>
          <Link href="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Header */}
      <div style={{ padding: '80px 24px 40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div className="hero-badge" style={{ margin: '0 auto 16px' }}>
          <Sparkles size={14} /> Transparent & Flexible Plans
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
          Simple Pricing for <span className="highlight">Powerful Hiring</span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: '1.6' }}>
          Choose the right plan to automate candidate ranking, skill extraction, and interview preparation.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        alignItems: 'stretch'
      }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: plan.highlighted ? 'linear-gradient(180deg, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0.8) 100%)' : 'rgba(255,255,255,0.03)',
              border: plan.highlighted ? '2px solid var(--color-primary, #6366f1)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.highlighted ? '0 12px 40px rgba(99,102,241,0.2)' : 'none'
            }}
          >
            {plan.badge && (
              <span style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                padding: '4px 14px',
                borderRadius: '20px',
                letterSpacing: '0.05em'
              }}>
                {plan.badge}
              </span>
            )}

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>{plan.name}</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '24px', minHeight: '40px' }}>{plan.description}</p>

            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff' }}>{plan.price}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.9rem', display: 'block', marginTop: '4px' }}>{plan.period}</span>
            </div>

            <Link
              href={plan.ctaHref}
              className={plan.highlighted ? 'btn btn-primary btn-full' : 'btn btn-secondary btn-full'}
              style={{ marginBottom: '32px', textAlign: 'center', justifyContent: 'center' }}
            >
              {plan.ctaText} <ArrowRight size={16} />
            </Link>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', flexGrow: 1 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '16px', letterSpacing: '0.05em' }}>
                Included Features
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {plan.features.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#e5e7eb' }}>
                    <Check size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 100px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', textAlign: 'center', marginBottom: '40px', color: 'var(--color-text, #111827)' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {faqs.map((faq) => (
            <div key={faq.q} style={{ background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '12px', padding: '24px', boxShadow: '0 8px 24px rgba(15,23,42,0.04)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text, #111827)' }}>{faq.q}</h3>
              <p style={{ color: 'var(--color-text-secondary, #374151)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-bottom" style={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} RecruitPro AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
