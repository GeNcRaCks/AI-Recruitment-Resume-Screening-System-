'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Save, 
  MessageSquare,
  Award,
  BarChart2
  , Trash2
} from 'lucide-react';
import { useData } from '@/lib/DataContext';
import { getScoreColor, getStatusColor, getRecommendationColor } from '@/lib/utils';
import { CandidateStatus } from '@/lib/types';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const candidateId = params.candidateId as string;

  const { getCandidate, getJob, updateCandidateStatus, updateCandidateNotes, deleteCandidate } = useData();

  const candidate = getCandidate(candidateId);
  const job = getJob(jobId);

  const [notes, setNotes] = useState(candidate ? candidate.recruiterNotes : '');
  const [saveStatus, setSaveStatus] = useState('');

  if (!candidate || !job) return <div>Candidate not found</div>;

  const handleDeleteCandidate = async () => {
    if (!window.confirm(`Delete candidate "${candidate.name}"?`)) return;
    await deleteCandidate(candidate.id);
    router.push(`/dashboard/jobs/${job.id}`);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    updateCandidateNotes(candidate.id, val);
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <div>
      {/* Top Navigation */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={`/dashboard/jobs/${job.id}`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Candidates Pipeline
        </Link>

        <button type="button" className="btn btn-secondary" onClick={handleDeleteCandidate}>
          <Trash2 size={16} /> Delete Candidate
        </button>

        {/* Status Triage Dropdown (Scene 6) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Candidate Status:</span>
          <select
            className="status-select"
            value={candidate.status}
            onChange={(e) => updateCandidateStatus(candidate.id, e.target.value as CandidateStatus)}
            style={{
              padding: '8px 32px 8px 16px',
              fontSize: '0.85rem',
              borderColor: getStatusColor(candidate.status),
              color: getStatusColor(candidate.status),
              background: `${getStatusColor(candidate.status)}15`,
            }}
          >
            <option value="New">New</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Header Info */}
      <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="sidebar-avatar" style={{ width: 56, height: 56, fontSize: '1.2rem' }}>
              {candidate.name.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{candidate.name}</h1>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                <span>{candidate.email}</span>
                {candidate.phone && <span>• {candidate.phone}</span>}
                <span>• {candidate.experience}</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>Final Score</div>
            <div className="score-circle-number" style={{ color: getScoreColor(candidate.scores.finalScore) }}>
              {candidate.scores.finalScore}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Analysis + Right Original Resume (Scene 5) */}
      <div className="candidate-detail-layout">
        {/* Left Column: Analysis */}
        <div>
          {/* Score Breakdown Section */}
          <div className="detail-section">
            <h3><BarChart2 size={18} style={{ color: 'var(--color-primary)' }} /> Score Breakdown</h3>
            <div className="score-overview">
              <div className="score-breakdown-list">
                <div className="score-breakdown-item">
                  <div className="score-breakdown-dot" style={{ background: 'var(--color-primary)' }} />
                  <span className="score-breakdown-name">Skill Match (30% weight)</span>
                  <span className="score-breakdown-value">{(candidate.scores.skillMatchRatio * 100).toFixed(0)}%</span>
                </div>
                <div className="score-breakdown-item">
                  <div className="score-breakdown-dot" style={{ background: 'var(--color-info)' }} />
                  <span className="score-breakdown-name">Lexical TF-IDF Similarity (30%)</span>
                  <span className="score-breakdown-value">{candidate.scores.tfidfSimilarity}</span>
                </div>
                <div className="score-breakdown-item">
                  <div className="score-breakdown-dot" style={{ background: 'var(--color-success)' }} />
                  <span className="score-breakdown-name">Semantic Embedding (40%)</span>
                  <span className="score-breakdown-value">{candidate.scores.semanticSimilarity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Matched vs Missing Skills */}
          <div className="detail-section">
            <h3><Award size={18} style={{ color: 'var(--color-primary)' }} /> Skills Analysis</h3>
            <div className="skills-grid">
              <div className="skills-column">
                <h4 style={{ color: 'var(--color-success)' }}>
                  <CheckCircle2 size={16} /> Matched Skills ({candidate.matchedSkills.length})
                </h4>
                <div className="skills-list">
                  {candidate.matchedSkills.map(s => (
                    <span key={s} className="skill-chip matched">{s}</span>
                  ))}
                </div>
              </div>

              <div className="skills-column">
                <h4 style={{ color: 'var(--color-error)' }}>
                  <XCircle size={16} /> Missing Skills ({candidate.missingSkills.length})
                </h4>
                <div className="skills-list">
                  {candidate.missingSkills.length > 0 ? (
                    candidate.missingSkills.map(s => (
                      <span key={s} className="skill-chip missing">{s}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                      Matched all detected JD requirements
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary & Recommendation */}
          <div className="detail-section">
            <h3><Sparkles size={18} style={{ color: 'var(--color-primary)' }} /> AI Summary & Recommendation</h3>
            <p className="ai-summary-text">{candidate.aiSummary}</p>
            <div>
              <span 
                className="recommendation-badge"
                style={{
                  background: `${getRecommendationColor(candidate.aiRecommendation)}15`,
                  color: getRecommendationColor(candidate.aiRecommendation),
                }}
              >
                Recommendation: {candidate.aiRecommendation}
              </span>
            </div>
          </div>

          {/* Suggested Interview Questions */}
          <div className="detail-section">
            <h3><HelpCircle size={18} style={{ color: 'var(--color-primary)' }} /> AI Suggested Interview Questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {candidate.interviewQuestions.map((q, idx) => (
                <div key={idx} className="question-item">
                  <div className="question-number">{idx + 1}</div>
                  <div className="question-text">{q}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Notes (Scene 6) */}
          <div className="detail-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>
                <MessageSquare size={18} style={{ color: 'var(--color-primary)' }} /> Recruiter Team Notes
              </h3>
              {saveStatus && <span style={{ fontSize: '0.78rem', color: 'var(--color-success)' }}>{saveStatus}</span>}
            </div>
            <textarea
              className="notes-textarea"
              placeholder="Add quick recruiter note (e.g. Strong Python background, probe Docker in interview)..."
              value={notes}
              onChange={handleNotesChange}
            />
          </div>
        </div>

        {/* Right Column: Original Resume Text */}
        <div>
          <div className="resume-viewer">
            <div className="resume-viewer-header">
              <h3><FileText size={16} /> Original Resume Document</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>
                {candidate.resumeFileName}
              </span>
            </div>
            <div className="resume-viewer-body">
              <pre className="resume-text">{candidate.resumeText}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
