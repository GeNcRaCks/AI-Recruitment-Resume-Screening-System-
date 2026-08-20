'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Zap, 
  BarChart, 
  FileText, 
  Users, 
  Star,
  Brain,
  Search,
  Filter,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav className={`landing-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <Sparkles size={20} />
          </div>
          <span>RecruitPro AI</span>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-visible' : ''}`}>
          <li><a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
          <li><a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a></li>
          <li><a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Reviews</a></li>
          <li><a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a></li>
        </ul>

        <div className={`nav-actions ${mobileMenuOpen ? 'mobile-visible' : ''}`}>
          <Link href="/login" className="btn btn-secondary">Log In</Link>
          <Link href="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-badge">
            <span className="dot" /> AI-Powered Resume Screening
          </div>

          <h1 className="hero-title">
            Hire the Best, <br />
            <span className="highlight">Faster</span> with AI
          </h1>

          <p className="hero-subtitle">
            Automate candidate screening, rank top resumes with multi-model NLP, and generate interview questions — all in one intelligent platform.
          </p>

          <div className="hero-ctas">
            <Link href="/register" className="btn btn-primary btn-lg">
              Start Screening Free <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <CheckCircle2 size={16} /> Save 80% Screening Time
            </div>
            <div className="hero-stat">
              <CheckCircle2 size={16} /> Improve Quality of Hire
            </div>
            <div className="hero-stat">
              <CheckCircle2 size={16} /> Unbiased Shortlisting
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div style={{ padding: '20px', background: '#fff', borderBottom: '1px solid #eee', display: 'flex', gap: '8px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
          </div>
          <div style={{ padding: '24px', background: 'var(--color-bg)' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Senior Backend Engineer</h4>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>142 Resumes Processed</span>
                </div>
                <span className="score-badge high">92% Match Score</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="skill-chip matched">Python</span>
                <span className="skill-chip matched">PostgreSQL</span>
                <span className="skill-chip matched">Docker</span>
                <span className="skill-chip matched">Kubernetes</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted By Logos */}
      <section className="trusted-section">
        <p>Trusted by modern recruiting teams worldwide</p>
        <div className="trusted-logos">
          <span className="trusted-logo">Microsoft</span>
          <span className="trusted-logo">Shopify</span>
          <span className="trusted-logo">Amazon</span>
          <span className="trusted-logo">Airbnb</span>
          <span className="trusted-logo">Stripe</span>
          <span className="trusted-logo">Notion</span>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section" id="how-it-works">
        <span className="section-badge">How It Works</span>
        <h2 className="section-title">
          Recruitment, Simplified in <span className="highlight">3 Core Steps</span>
        </h2>
        <p className="section-subtitle">
          From posting job descriptions to reviewing candidate rankings — everything you need in one seamless workflow.
        </p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Post & Detect Skills</h3>
            <p>Paste your job description. RecruitPro AI automatically extracts and displays required skills as interactive chips to confirm.</p>
            <ul className="step-features">
              <li><CheckCircle2 size={14} /> Instant NLP skill parsing</li>
              <li><CheckCircle2 size={14} /> 770+ technical skills DB</li>
            </ul>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Bulk Resume Upload</h3>
            <p>Drag and drop 5, 15, or 50 resumes at once. PDFs and DOCX files are processed in real-time with background scoring.</p>
            <ul className="step-features">
              <li><CheckCircle2 size={14} /> Multi-file drag & drop</li>
              <li><CheckCircle2 size={14} /> Real-time progress bar</li>
            </ul>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>AI Rank & Interview</h3>
            <p>Review composite match scores (TF-IDF + Semantic + Skills), candidate summaries, and auto-generated interview questions.</p>
            <ul className="step-features">
              <li><CheckCircle2 size={14} /> Score breakdown chart</li>
              <li><CheckCircle2 size={14} /> Export shortlist as PDF/CSV</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="section-badge">Powerful Features</span>
          <h2 className="section-title">Everything You Need to Screen Candidates</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon purple"><Brain size={24} /></div>
            <h3>Multi-Model NLP Scoring</h3>
            <p>Combines exact skill matching, TF-IDF lexical frequency, and MiniLM semantic embeddings for true contextual match scoring.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green"><Zap size={24} /></div>
            <h3>AI Interview Questions</h3>
            <p>Generates tailored technical interview questions targeting matched strengths and probing identified skill gaps.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue"><FileText size={24} /></div>
            <h3>Candidate Summaries</h3>
            <p>Provides concise neutral hiring summaries with clear recommendations (Interview, Hold, or Reject) with justification.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon orange"><BarChart size={24} /></div>
            <h3>Score Analytics & Charts</h3>
            <p>Visual score distribution charts help you quickly spot top talent above standard thresholds.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon red"><Filter size={24} /></div>
            <h3>Side-by-Side Comparison</h3>
            <p>Compare top candidates head-to-head across score breakdowns, skill matches, and recruiter notes.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon cyan"><Shield size={24} /></div>
            <h3>Shortlist & Export</h3>
            <p>Export candidate shortlists to PDF or CSV and email summaries directly to hiring managers.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="section-badge">Recruiter Reviews</span>
          <h2 className="section-title">What Hiring Teams Are Saying</h2>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" stroke="none" />)}
            </div>
            <p className="testimonial-text">
              &quot;RecruitPro AI cut our resume screening time from 3 days down to 20 minutes. The candidate summaries and interview questions are shockingly accurate!&quot;
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">SM</div>
              <div className="testimonial-author-info">
                <h4>Sarah Mitchell</h4>
                <p>Lead Recruiter, TechVision</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" stroke="none" />)}
            </div>
            <p className="testimonial-text">
              &quot;The side-by-side comparison and score breakdown give us complete confidence in our interview decisions. Our hiring managers love the PDF exports!&quot;
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">DK</div>
              <div className="testimonial-author-info">
                <h4>David Kapoor</h4>
                <p>VP of Talent, CloudScale</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" stroke="none" />)}
            </div>
            <p className="testimonial-text">
              &quot;The skill extraction chip preview allows us to catch parser misses before screening even starts. It&apos;s an indispensable tool for our team.&quot;
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">EL</div>
              <div className="testimonial-author-info">
                <h4>Elena Lopez</h4>
                <p>Head of HR, InnovateX</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="cta-section">
        <h2>Ready to Streamline Your Recruitment?</h2>
        <p>Join hundreds of hiring managers using RecruitPro AI to find top candidates faster.</p>
        <Link href="/dashboard" className="btn btn-primary btn-lg">
          Launch Dashboard Now <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>RecruitPro AI</h3>
            <p>Next-generation AI recruitment and resume screening platform designed for modern hiring teams.</p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} RecruitPro AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
