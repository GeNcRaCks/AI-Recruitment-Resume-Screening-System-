import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for RecruitPro AI resume screening and recruitment platform.',
};

export default function PrivacyPage() {
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--color-text, #111827)' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--color-text-secondary, #374151)', marginBottom: '40px' }}>Last Updated: August 31, 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--color-text-secondary, #374151)', lineHeight: '1.7' }}>
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>1. Introduction</h2>
            <p>
              Welcome to <strong>RecruitPro AI</strong>. We are committed to protecting the privacy of recruiters, hiring managers, and candidate data processed through our platform. This Privacy Policy outlines how we collect, use, process, and retain information when you use our AI recruitment and resume screening services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>2. Information We Collect</h2>
            <p style={{ marginBottom: '12px', color: 'var(--color-text-secondary, #374151)' }}>We collect information necessary to provide AI-assisted recruitment services:</p>
            <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-secondary, #374151)' }}>
              <li><strong>User Account Information:</strong> Name, work email address, hashed password, and company name when you register an account.</li>
              <li><strong>Job Postings:</strong> Job titles, job descriptions, required skills, and recruiter preferences uploaded to create screening benchmarks.</li>
              <li><strong>Candidate Resumes:</strong> PDF and DOCX documents uploaded by recruiters or submitted via candidate application links, containing candidate names, email addresses, skill histories, and work experience text.</li>
              <li><strong>Technical Usage Data:</strong> IP addresses, browser types, and API access logs for performance monitoring and security authentication.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>3. How We Process Candidate Resumes</h2>
            <p>
              Candidate resumes uploaded to RecruitPro AI are parsed strictly to perform skill extraction, TF-IDF lexical frequency matching, and semantic vector similarity scoring against user-specified job descriptions.
            </p>
            <p style={{ marginTop: '12px' }}>
              Resume data is isolated to your organization&apos;s workspace and is not sold, rented, or shared with unauthorized third-party advertisers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>4. Data Retention & Account Deletion</h2>
            <p>
              We retain account details, job postings, and candidate evaluation records as long as your account remains active. Users can update or permanently delete their account and associated job/candidate records at any time directly through the dashboard Settings page or by contacting support.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>5. Third-Party Service Providers</h2>
            <p>
              We utilize trusted infrastructure providers to deliver our services, including cloud hosting providers and transactional email providers (e.g., Resend / SMTP) solely for sending password reset emails, account verification links, and candidate shortlist notifications.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text, #111827)', marginBottom: '12px' }}>6. Contact Us</h2>
            <p>
              If you have any questions, privacy inquiries, or data removal requests regarding this policy, please reach out to us at:
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
