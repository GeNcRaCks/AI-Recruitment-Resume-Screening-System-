'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, MapPin, Users, Award, Calendar } from 'lucide-react';
import { useData } from '@/lib/DataContext';
import { formatDate, getStatusColor } from '@/lib/utils';
import { JobStatus } from '@/lib/types';

export default function JobsListPage() {
  const { jobs } = useData();
  const [filter, setFilter] = useState<'All' | JobStatus>('All');
  const [search, setSearch] = useState('');

  const filteredJobs = jobs.filter(j => {
    const matchesFilter = filter === 'All' || j.status === filter;
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                          j.department.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Job Postings</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage your open job positions and candidate screening pipelines.
          </p>
        </div>

        <Link href="/dashboard/jobs/new" className="btn btn-primary">
          <Plus size={18} /> New Job Posting
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="jobs-filters">
        <div className="filter-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search jobs by title or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {(['All', 'Active', 'Closed', 'Draft'] as const).map((status) => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="jobs-grid">
        {filteredJobs.map((job) => (
          <Link href={`/dashboard/jobs/${job.id}`} key={job.id} className="job-card">
            <div className="job-card-header">
              <div>
                <h3 className="job-card-title">{job.title}</h3>
                <div className="job-card-meta">
                  <span>{job.department}</span> • 
                  <span><MapPin size={12} /> {job.location}</span>
                </div>
              </div>
              <span
                className="status-badge"
                style={{
                  background: `${getStatusColor(job.status)}15`,
                  color: getStatusColor(job.status),
                }}
              >
                <span className="status-dot" style={{ background: getStatusColor(job.status) }} />
                {job.status}
              </span>
            </div>

            <div className="job-card-skills">
              {job.detectedSkills.slice(0, 4).map((skill) => (
                <span key={skill} className="skill-chip">{skill}</span>
              ))}
              {job.detectedSkills.length > 4 && (
                <span className="skill-chip more">+{job.detectedSkills.length - 4} more</span>
              )}
            </div>

            <div className="job-card-footer">
              <div className="job-card-stat">
                <div className="job-card-stat-value">{job.candidateCount}</div>
                <div className="job-card-stat-label">Candidates</div>
              </div>

              <div className="job-card-stat">
                <div className="job-card-stat-value" style={{ color: 'var(--color-primary)' }}>
                  {job.avgScore > 0 ? job.avgScore : 'N/A'}
                </div>
                <div className="job-card-stat-label">Avg Match Score</div>
              </div>

              <div className="job-card-stat">
                <div className="job-card-stat-value">{job.topScore > 0 ? job.topScore : 'N/A'}</div>
                <div className="job-card-stat-label">Top Score</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
