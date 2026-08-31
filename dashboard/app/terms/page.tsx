import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for RecruitPro AI resume screening and candidate ranking platform.',
};

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--color-bg, #f3f4f6)', minHeight: '100vh', color: 'var(--color-text, #111827)' }}>
      <nav className="landing-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <img src="/recruitpro-logo.svg" alt="RecruitPro AI logo" />
          </div>
          <span>RecruitPro AI</span>
        </Link>
        <div className="nav-actions">
          <Link href="/" className="btn btn-secondary"><ArrowLeft size={16} /> Back to Home</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '60px 24px 100px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--color-text, #111827)' }}>Terms of Service</h1>
        <p style={{ color: 'var(--color-text-secondary, #374151)', marginBottom: '40px' }}>Last Updated: August 31, 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--color-text-secondary, #374151)', lineHeight: '1.7' }}>
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
            <p>
              By accessing or using <strong>RecruitPro AI</strong>, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>2. Description of Service</h2>
            <p>
              RecruitPro AI provides recruiters, hiring managers, and HR professionals with software tools for job posting creation, automated resume skill extraction, composite NLP match scoring, candidate ranking, and AI-generated technical interview packages.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>3. User Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your account. You agree to immediately notify us of any unauthorized access to your account.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>4. Acceptable Use & Content Guidelines</h2>
            <p style={{ marginBottom: '12px', color: 'var(--color-text-secondary, #374151)' }}>You agree not to:</p>
            <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-secondary, #374151)' }}>
              <li>Upload malicious files, virus-laden documents, or illegal content.</li>
              <li>Attempt to reverse-engineer, exploit, or disrupt the backend platform or API endpoints.</li>
              <li>Use candidate screening data to engage in discriminatory or unlawful hiring practices.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>5. AI Recommendations Disclaimer</h2>
            <p>
              RecruitPro AI provides candidate scores, summaries, and generated questions as decision-support insights for human recruiters. Final hiring and interviewing decisions remain the sole responsibility of the user organization.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate access to accounts that violate these terms or engage in abusive platform activity. Users may close their account at any time.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>7. Contact Information</h2>
            <p>
              For questions regarding these Terms of Service, please contact:
            </p>
            <p style={{ marginTop: '8px', color: 'var(--color-primary, #4f46e5)', fontWeight: '600' }}>
              recruitpro.notifications@gmail.com
            </p>
          </section>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="footer-bottom" style={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} RecruitPro AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
