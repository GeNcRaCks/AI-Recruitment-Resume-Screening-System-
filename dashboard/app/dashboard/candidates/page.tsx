'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/lib/DataContext';
import { getStatusColor } from '@/lib/utils';
import { CandidateStatus } from '@/lib/types';

export default function AllCandidatesPage() {
  const { candidates, jobs, updateCandidateStatus, deleteCandidate } = useData();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCandidates = candidates.filter(c => {
    const job = jobs.find((item) => item.id === c.jobId);
    const searchText = search.toLowerCase().trim();
    const matchesSearch = !searchText ||
      c.name.toLowerCase().includes(searchText) ||
      c.email.toLowerCase().includes(searchText) ||
      c.matchedSkills.some((skill) => skill.toLowerCase().includes(searchText)) ||
      (job?.title.toLowerCase().includes(searchText) ?? false);
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>All Candidates Directory</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Browse and filter candidates across all active job postings.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div className="candidate-filters">
          <div className="filter-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search candidate name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Filter Status: All</option>
            <option value="New">New</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="candidate-table-wrapper">
          <table className="candidate-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Position</th>
                <th>Final Score</th>
                <th>Skill Match</th>
                <th>AI Recommendation</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map(c => {
                const job = jobs.find(j => j.id === c.jobId);
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="candidate-name-cell">
                        <div className="candidate-avatar" style={{ background: 'var(--color-primary)' }}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="candidate-name">{c.name}</div>
                          <div className="candidate-experience">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{job ? job.title : 'Backend Engineer'}</td>
                    <td>
                      <span className={`score-badge ${c.scores.finalScore >= 0.7 ? 'high' : c.scores.finalScore >= 0.4 ? 'medium' : 'low'}`}>
                        {c.scores.finalScore}
                      </span>
                    </td>
                    <td>{(c.scores.skillMatchRatio * 100).toFixed(0)}%</td>
                    <td>{c.aiRecommendation}</td>
                    <td>
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
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        title="Delete candidate"
                        onClick={() => {
                          if (window.confirm(`Delete candidate "${c.name}"?`)) deleteCandidate(c.id);
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                      <Link 
                        href={`/dashboard/jobs/${c.jobId}/candidates/${c.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
