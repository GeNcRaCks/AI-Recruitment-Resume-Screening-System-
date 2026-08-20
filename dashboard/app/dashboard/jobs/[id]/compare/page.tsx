'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, Award } from 'lucide-react';
import { useData } from '@/lib/DataContext';
import { getScoreColor, getStatusColor } from '@/lib/utils';
import { CandidateStatus } from '@/lib/types';

export default function ComparePage() {
  const params = useParams();
  const jobId = params.id as string;
  const { getJob, getCandidatesForJob, updateCandidateStatus } = useData();

  const job = getJob(jobId);
  const candidates = getCandidatesForJob(jobId);

  // Compare candidates in Interview or top 3 candidates
  const compareCandidates = candidates
    .filter(c => c.status === 'Interview' || c.scores.finalScore >= 0.7)
    .slice(0, 3);

  if (!job) return <div>Job not found</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href={`/dashboard/jobs/${job.id}`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Job Pipeline
        </Link>
        <h1 style={{ marginTop: '8px' }}>Side-by-Side Candidate Comparison</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Compare finalists for {job.title} to decide interview order.
        </p>
      </div>

      <div className={`compare-grid cols-${compareCandidates.length}`}>
        {compareCandidates.map((c) => (
          <div key={c.id} className="compare-column">
            <div className="compare-column-header">
              <div className="compare-avatar" style={{ background: 'var(--color-primary)' }}>
                {c.name.charAt(0)}
              </div>
              <h3>{c.name}</h3>
              <p>{c.experience}</p>
            </div>

            <div className="compare-score">
              <div className="compare-score-value" style={{ color: getScoreColor(c.scores.finalScore) }}>
                {c.scores.finalScore}
              </div>
              <div className="compare-score-label">Final Match Score</div>
            </div>

            <div className="compare-section">
              <h4>Score Breakdown</h4>
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Skill Match:</span>
                  <strong>{(c.scores.skillMatchRatio * 100).toFixed(0)}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Lexical (TF-IDF):</span>
                  <strong>{c.scores.tfidfSimilarity}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Semantic:</span>
                  <strong>{c.scores.semanticSimilarity}</strong>
                </div>
              </div>
            </div>

            <div className="compare-section">
              <h4 style={{ color: 'var(--color-success)' }}>Matched Skills ({c.matchedSkills.length})</h4>
              <div className="skills-list">
                {c.matchedSkills.map(s => (
                  <span key={s} className="skill-chip matched">{s}</span>
                ))}
              </div>
            </div>

            <div className="compare-section">
              <h4 style={{ color: 'var(--color-error)' }}>Missing Skills ({c.missingSkills.length})</h4>
              <div className="skills-list">
                {c.missingSkills.length > 0 ? (
                  c.missingSkills.map(s => (
                    <span key={s} className="skill-chip missing">{s}</span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>None</span>
                )}
              </div>
            </div>

            <div className="compare-section">
              <h4>AI Recommendation</h4>
              <span className="recommendation-badge" style={{ marginTop: 0 }}>
                {c.aiRecommendation}
              </span>
            </div>

            <div className="compare-section">
              <h4>Recruiter Notes</h4>
              <div className="compare-notes">
                {c.recruiterNotes ? `"${c.recruiterNotes}"` : 'No notes added yet'}
              </div>
            </div>

            <div className="compare-section" style={{ textAlign: 'center' }}>
              <select
                className="status-select"
                value={c.status}
                onChange={(e) => updateCandidateStatus(c.id, e.target.value as CandidateStatus)}
                style={{
                  width: '100%',
                  borderColor: getStatusColor(c.status),
                  color: getStatusColor(c.status),
                  background: `${getStatusColor(c.status)}15`,
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
        ))}
      </div>
    </div>
  );
}
