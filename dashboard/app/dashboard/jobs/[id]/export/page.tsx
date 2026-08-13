'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Mail, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';
import { useData } from '@/lib/DataContext';
import { downloadCSV } from '@/lib/utils';

export default function ExportPage() {
  const params = useParams();
  const jobId = params.id as string;
  const { getJob, getCandidatesForJob } = useData();

  const job = getJob(jobId) || getJob('job-1');
  const candidates = getCandidatesForJob(job ? job.id : 'job-1');
  const shortlist = candidates.filter(c => c.status === 'Interview' || c.scores.finalScore >= 0.7);

  const [email, setEmail] = useState('hiring.manager@company.com');
  const [message, setMessage] = useState('Hi, attached is the candidate shortlist for Senior Backend Engineer. Top candidates are highlighted with AI scores and summaries.');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  if (!job) return <div>Job not found</div>;

  const handleExportCSV = () => {
    const csvData = shortlist.map(c => ({
      Rank: c.scores.finalScore,
      Name: c.name,
      Email: c.email,
      FinalScore: c.scores.finalScore,
      SkillMatchRatio: c.scores.skillMatchRatio,
      Recommendation: c.aiRecommendation,
      Status: c.status,
      MatchedSkills: c.matchedSkills.join('; '),
      MissingSkills: c.missingSkills.join('; '),
      Summary: c.aiSummary,
      RecruiterNotes: c.recruiterNotes,
    }));

    downloadCSV(csvData, `${job.title.replace(/\s+/g, '_')}_Shortlist.csv`);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email domain and TLD (e.g., user@domain.com)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address with a valid domain (e.g., user@company.com).');
      return;
    }
    
    setEmailError('');
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href={`/dashboard/jobs/${job.id}`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Job Pipeline
        </Link>
        <h1 style={{ marginTop: '8px' }}>Export & Share Candidate Shortlist</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Export clean candidate PDF/CSV reports or email directly to hiring managers.
        </p>
      </div>

      <div className="export-options">
        <div className="export-option" onClick={handleExportPDF}>
          <div className="export-option-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <FileText size={28} />
          </div>
          <h3>Export PDF Summary Report</h3>
          <p>Download a clean formatted PDF with candidate score breakdowns and AI summaries.</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
            <Download size={14} /> Download PDF
          </button>
        </div>

        <div className="export-option" onClick={handleExportCSV}>
          <div className="export-option-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <FileSpreadsheet size={28} />
          </div>
          <h3>Export CSV Spreadsheet</h3>
          <p>Download structured CSV data compatible with Excel, Google Sheets, and ATS systems.</p>
          <button className="btn btn-success btn-sm" style={{ marginTop: '16px' }}>
            <Download size={14} /> Download CSV
          </button>
        </div>
      </div>

      {/* Email Shortlist to Hiring Manager */}
      <div className="email-form">
        <h3><Mail size={18} style={{ color: 'var(--color-primary)' }} /> Email Shortlist to Hiring Manager</h3>

        {emailSent ? (
          <div style={{ padding: '16px', background: 'var(--color-success-light)', color: '#047857', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <CheckCircle2 size={18} /> Shortlist email sent successfully to {email}!
          </div>
        ) : (
          <form onSubmit={handleSendEmail}>
            <div className="form-group">
              <label className="form-label">Recipient Email</label>
              <input
                type="email"
                className={`form-input ${emailError ? 'form-input-error' : ''}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                pattern="[^\s@]+@[^\s@]+\.[^\s@]{2,}"
                title="Please provide a valid email address with a domain (e.g., user@company.com)"
                required
              />
              {emailError && (
                <div className="form-error-message" style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginTop: '6px' }}>
                  {emailError}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Message Note</label>
              <textarea
                className="form-input"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Includes {shortlist.length} candidate summaries & score breakdown attachments.
              </span>
              <button type="submit" className="btn btn-primary">
                <Mail size={16} /> Send Shortlist Email
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Audit History Log (Scene 9) */}
      <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
        <h3>Job Status History & Audit Log</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Full history of candidates and hiring decisions kept on record for compliance and auditing.
        </p>

        <table className="candidate-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Score</th>
              <th>Status</th>
              <th>AI Recommendation</th>
              <th>Recruiter Notes</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.scores.finalScore}</td>
                <td><span className="status-badge" style={{ background: 'var(--color-bg-subtle)' }}>{c.status}</span></td>
                <td>{c.aiRecommendation}</td>
                <td style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{c.recruiterNotes || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
