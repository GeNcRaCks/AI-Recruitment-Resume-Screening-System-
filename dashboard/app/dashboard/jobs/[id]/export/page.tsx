'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Mail, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';
import { API_BASE, getToken, useData } from '@/lib/DataContext';

export default function ExportPage() {
  const params = useParams();
  const jobId = params.id as string;
  const { getJob, getCandidatesForJob } = useData();

  const job = getJob(jobId);
  const candidates = getCandidatesForJob(jobId);
  const shortlist = candidates.filter(c => c.status === 'Interview' || c.scores.finalScore >= 0.7);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [exporting, setExporting] = useState<'pdf' | 'csv' | null>(null);
  const [exportError, setExportError] = useState('');

  if (!job) return <div>Job not found</div>;

  const downloadReport = async (format: 'pdf' | 'csv') => {
    setExporting(format);
    setExportError('');
    try {
      const response = await fetch(`${API_BASE}/jobs/${job.id}/candidates/export-${format}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Unable to generate ${format.toUpperCase()} report.`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="?([^";]+)"?/i);
      const filename = filenameMatch?.[1] || `${job.title.replace(/[^a-z0-9]+/gi, '_')}_candidates.${format}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : `Unable to generate ${format.toUpperCase()} report.`);
    } finally {
      setExporting(null);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email domain and TLD (e.g., user@domain.com)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address with a valid domain (e.g., user@company.com).');
      return;
    }
    
    setEmailError('');
    try {
      const response = await fetch(`${API_BASE}/jobs/${job.id}/candidates/email-shortlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ emails: [email] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Unable to send shortlist email.');
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Unable to send shortlist email.');
    }
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
        <div className="export-option">
          <div className="export-option-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <FileText size={28} />
          </div>
          <h3>Export PDF Summary Report</h3>
          <p>Download a clean formatted PDF with candidate score breakdowns and AI summaries.</p>
          <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }} onClick={() => downloadReport('pdf')} disabled={exporting !== null}>
            <Download size={14} /> {exporting === 'pdf' ? 'Preparing PDF...' : 'Download PDF'}
          </button>
        </div>

        <div className="export-option">
          <div className="export-option-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <FileSpreadsheet size={28} />
          </div>
          <h3>Export CSV Spreadsheet</h3>
          <p>Download structured CSV data compatible with Excel, Google Sheets, and ATS systems.</p>
          <button type="button" className="btn btn-success btn-sm" style={{ marginTop: '16px' }} onClick={() => downloadReport('csv')} disabled={exporting !== null}>
            <Download size={14} /> {exporting === 'csv' ? 'Preparing CSV...' : 'Download CSV'}
          </button>
        </div>
      </div>

      {exportError && (
        <div className="form-error-message" style={{ color: 'var(--color-error)', marginTop: '12px' }}>
          {exportError}
        </div>
      )}

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
