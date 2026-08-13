'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  UploadCloud, 
  Search, 
  SlidersHorizontal, 
  FileText, 
  CheckCircle2, 
  ArrowUpDown,
  Share2,
  Download,
  Users,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { useData } from '@/lib/DataContext';
import { getScoreColor, getStatusColor, formatDate } from '@/lib/utils';
import { CandidateStatus } from '@/lib/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const { getJob, getCandidatesForJob, updateCandidateStatus, addCandidatesToJob } = useData();

  const job = getJob(jobId) || getJob('job-1');
  const candidates = getCandidatesForJob(job ? job.id : 'job-1');

  // Filters state
  const [search, setSearch] = useState('');
  const [minScore, setMinScore] = useState<number>(0);
  const [skillFilter, setSkillFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);

  if (!job) return <div>Job not found</div>;

  // Allowed file extensions for resume uploads
  const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc'];

  const isFileTypeAllowed = (fileName: string): boolean => {
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return ALLOWED_EXTENSIONS.includes(ext);
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase());
    const matchesScore = c.scores.finalScore >= minScore;
    const matchesSkill = skillFilter === 'All' || c.matchedSkills.includes(skillFilter);
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesScore && matchesSkill && matchesStatus;
  }).sort((a, b) => b.scores.finalScore - a.scores.finalScore);

  // Bulk Upload simulator (Scene 2 & 3)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setRejectedFiles([]);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(f => isFileTypeAllowed(f.name));
    const invalidFiles = files.filter(f => !isFileTypeAllowed(f.name));

    if (invalidFiles.length > 0) {
      setRejectedFiles(invalidFiles.map(f => f.name));
      // Auto-dismiss after 5 seconds
      setTimeout(() => setRejectedFiles([]), 5000);
    }

    if (validFiles.length > 0) {
      simulateFileUpload(validFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setRejectedFiles([]);
      // The file input already has accept=".pdf,.docx,.doc", but validate again as defense-in-depth
      const validFiles = files.filter(f => isFileTypeAllowed(f.name));
      const invalidFiles = files.filter(f => !isFileTypeAllowed(f.name));

      if (invalidFiles.length > 0) {
        setRejectedFiles(invalidFiles.map(f => f.name));
        setTimeout(() => setRejectedFiles([]), 5000);
      }

      if (validFiles.length > 0) {
        simulateFileUpload(validFiles);
      }
    }
  };

  const simulateFileUpload = (files: File[]) => {
    if (files.length === 0) return;

    const fileItems = files.map(f => ({ name: f.name, progress: 10 }));
    setUploadingFiles(fileItems);

    // Simulate batch scoring progress
    const interval = setInterval(() => {
      setUploadingFiles(prev => {
        const updated = prev.map(f => ({
          ...f,
          progress: Math.min(100, f.progress + 25)
        }));
        if (updated.every(f => f.progress >= 100)) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadingFiles([]);
            // Add new candidates to store
            const newCandData = files.map((f, idx) => ({
              name: f.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
              email: `candidate.${idx + 1}@example.com`,
              resumeFileName: f.name,
              matchedSkills: job.detectedSkills.slice(0, Math.floor(Math.random() * 4) + 2),
              missingSkills: job.detectedSkills.slice(4, 6),
            }));
            addCandidatesToJob(job.id, newCandData);
          }, 600);
        }
        return updated;
      });
    }, 400);
  };

  const toggleSelectCandidate = (id: string) => {
    setSelectedCandidateIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const selectAllCandidates = () => {
    if (selectedCandidateIds.length === filteredCandidates.length) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(filteredCandidates.map(c => c.id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="job-detail-header">
        <div className="job-detail-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1>{job.title}</h1>
            <span 
              className="status-badge" 
              style={{ background: `${getStatusColor(job.status)}15`, color: getStatusColor(job.status) }}
            >
              {job.status}
            </span>
          </div>
          <div className="job-detail-meta">
            <span><Briefcase size={14} /> {job.department}</span>
            <span>{job.location}</span>
            <span>{job.employmentType}</span>
          </div>
        </div>

        <div className="page-header-actions">
          <Link href={`/dashboard/jobs/${job.id}/export`} className="btn btn-secondary">
            <Share2 size={16} /> Export / Share
          </Link>
          <Link href={`/dashboard/jobs/${job.id}/compare`} className="btn btn-primary">
            <Users size={16} /> Compare Finalists
          </Link>
        </div>
      </div>

      {/* Stats Row & Processing Progress Indicator (Scene 3) */}
      <div className="pipeline-stats">
        <div className="pipeline-stat">
          <div className="pipeline-stat-label">Total Resumes</div>
          <div className="pipeline-stat-value">{job.candidateCount}</div>
        </div>
        <div className="pipeline-stat">
          <div className="pipeline-stat-label">Screened & Scored</div>
          <div className="pipeline-stat-value" style={{ color: 'var(--color-success)' }}>
            {job.processedCount} of {job.candidateCount}
          </div>
          <div className="pipeline-stat-sub">
            {Math.round((job.processedCount / Math.max(1, job.candidateCount)) * 100)}% complete
          </div>
        </div>
        <div className="pipeline-stat">
          <div className="pipeline-stat-label">Average Match Score</div>
          <div className="pipeline-stat-value" style={{ color: 'var(--color-primary)' }}>
            {job.avgScore}
          </div>
        </div>
        <div className="pipeline-stat">
          <div className="pipeline-stat-label">Top Candidate Score</div>
          <div className="pipeline-stat-value" style={{ color: 'var(--color-success)' }}>
            {job.topScore}
          </div>
        </div>
      </div>

      {/* Bulk Upload Zone (Scene 2) */}
      <div
        className={`upload-zone ${isDragging ? 'drag-over' : ''} ${rejectedFiles.length > 0 ? 'has-error' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload-input')?.click()}
      >
        <input
          id="file-upload-input"
          type="file"
          multiple
          accept=".pdf,.docx,.doc"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <div className="upload-zone-icon">
          <UploadCloud size={28} />
        </div>
        <h3>Bulk Upload Candidate Resumes</h3>
        <p>
          Drag and drop multiple resumes here or <span className="browse-link">browse files</span> from your computer
        </p>
        <div className="file-types">Supports PDF and DOCX files (Up to 50 resumes at once)</div>
        
        {/* Rejected Files Message */}
        {rejectedFiles.length > 0 && (
          <div className="upload-error-message" style={{ marginTop: '16px', color: 'var(--color-error)', fontSize: '0.85rem', fontWeight: 500 }}>
            Unsupported file type(s): {rejectedFiles.join(', ')}. Please upload PDF or DOCX files only.
          </div>
        )}
      </div>

      {/* Uploading progress bars (Scene 3) */}
      {uploadingFiles.length > 0 && (
        <div className="upload-progress">
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Sparkles size={16} className="text-primary" /> Processing Resumes ({uploadingFiles.filter(f => f.progress >= 100).length} of {uploadingFiles.length} done)...
          </div>
          {uploadingFiles.map((f, i) => (
            <div key={i} className="upload-file-item">
              <div className="upload-file-icon">
                <FileText size={18} />
              </div>
              <div className="upload-file-info">
                <div className="upload-file-name">{f.name}</div>
                <div className="upload-progress-bar">
                  <div className="upload-progress-fill" style={{ width: `${f.progress}%` }} />
                </div>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{f.progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Table & Filters (Scene 4) */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3>Ranked Candidates List ({filteredCandidates.length})</h3>

          {selectedCandidateIds.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => router.push(`/dashboard/jobs/${job.id}/compare`)}
              >
                Compare ({selectedCandidateIds.length}) Selected
              </button>
            </div>
          )}
        </div>

        <div className="card-body" style={{ padding: '20px' }}>
          {/* Filters Bar */}
          <div className="candidate-filters">
            <div className="filter-search">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search candidates by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Score filter slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
              <span>Min Score: <strong>{minScore}</strong></span>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.1"
                value={minScore}
                onChange={(e) => setMinScore(parseFloat(e.target.value))}
                style={{ width: '100px' }}
              />
            </div>

            {/* Must-have skill filter */}
            <select
              className="filter-select"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option value="All">Filter by Skill: All</option>
              {job.detectedSkills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Filter by Status: All</option>
              <option value="New">New</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Table */}
          <div className="candidate-table-wrapper">
            <table className="candidate-table">
              <thead>
                <tr>
                  <th style={{ width: '30px' }}>
                    <input
                      type="checkbox"
                      checked={selectedCandidateIds.length === filteredCandidates.length && filteredCandidates.length > 0}
                      onChange={selectAllCandidates}
                    />
                  </th>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>Final Score</th>
                  <th>Skill Match</th>
                  <th>Lexical (TF-IDF)</th>
                  <th>Semantic</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((c, index) => (
                  <tr key={c.id} onClick={() => router.push(`/dashboard/jobs/${job.id}/candidates/${c.id}`)}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedCandidateIds.includes(c.id)}
                        onChange={() => toggleSelectCandidate(c.id)}
                      />
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-secondary)' }}>#{index + 1}</td>
                    <td>
                      <div className="candidate-name-cell">
                        <div className="candidate-avatar" style={{ background: 'var(--color-primary)' }}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="candidate-name">{c.name}</div>
                          <div className="candidate-experience">{c.experience}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`score-badge ${c.scores.finalScore >= 0.7 ? 'high' : c.scores.finalScore >= 0.4 ? 'medium' : 'low'}`}>
                        {c.scores.finalScore}
                      </span>
                    </td>
                    <td>{(c.scores.skillMatchRatio * 100).toFixed(0)}%</td>
                    <td>{c.scores.tfidfSimilarity}</td>
                    <td>{c.scores.semanticSimilarity}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className="status-select"
                        value={c.status}
                        onChange={(e) => updateCandidateStatus(c.id, e.target.value as CandidateStatus)}
                        style={{
                          borderColor: getStatusColor(c.status),
                          color: getStatusColor(c.status),
                          background: `${getStatusColor(c.status)}10`,
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Screening">Screening</option>
                        <option value="Interview">Interview</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <Link 
                        href={`/dashboard/jobs/${job.id}/candidates/${c.id}`} 
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
