'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Users, 
  Award, 
  Clock, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useData } from '@/lib/DataContext';
import { formatDate } from '@/lib/utils';
import { scoreDistributionData } from '@/lib/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function DashboardHome() {
  const { jobs, activities, stats, user } = useData();

  const activeJobs = jobs.filter(j => j.status === 'Active');

  return (
    <div>
      {/* Welcome Banner */}
      <div className="page-header">
        <div>
          <h1>Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Here is what's happening with your recruitment pipeline today.
          </p>
        </div>

        <div className="page-header-actions">
          <Link href="/dashboard/jobs/new" className="btn btn-primary">
            <Plus size={18} /> New Job Posting
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Active Jobs</span>
            <div className="stat-card-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Briefcase size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.activeJobs}</div>
          <div className="stat-card-sub positive">
            <TrendingUp size={14} style={{ display: 'inline', marginRight: 4 }} />
            2 jobs created this week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Candidates</span>
            <div className="stat-card-icon" style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalCandidates}</div>
          <div className="stat-card-sub">
            {stats.processedToday} processed today
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Average Score</span>
            <div className="stat-card-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              <Award size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.avgScore}</div>
          <div className="stat-card-sub">Out of 1.0 composite match</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Pending Review</span>
            <div className="stat-card-icon" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.pendingReview}</div>
          <div className="stat-card-sub">Awaiting recruiter action</div>
        </div>
      </div>

      {/* Main Grid: Chart + Recent Jobs & Activity */}
      <div className="dashboard-grid">
        {/* Left Column: Score Distribution + Recent Jobs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Score Distribution Chart */}
          <div className="card score-distribution-card">
            <div className="card-header">
              <div>
                <h3>Score Distribution Analytics</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  Composite score frequency across all screened candidates
                </span>
              </div>
            </div>
            <div className="card-body">
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}
                      formatter={(val: any) => [`${val} candidates`, 'Count']}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {scoreDistributionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index >= 7 ? 'var(--color-primary)' : index >= 4 ? '#8b5cf6' : '#c4b5fd'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Active Jobs */}
          <div className="card">
            <div className="card-header">
              <h3>Active Job Postings ({activeJobs.length})</h3>
              <Link href="/dashboard/jobs" className="btn btn-ghost btn-sm">
                View All <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="card-body" style={{ padding: '0 24px' }}>
              {activeJobs.map((job) => (
                <div key={job.id} className="recent-job-item">
                  <div className="recent-job-info">
                    <div className="recent-job-icon">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <Link href={`/dashboard/jobs/${job.id}`} className="recent-job-title" style={{ color: 'var(--color-text)' }}>
                        {job.title}
                      </Link>
                      <div className="recent-job-meta">
                        {job.department} • Created {formatDate(job.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="recent-job-candidates">
                    <div className="recent-job-count">{job.candidateCount}</div>
                    <div className="recent-job-label">Candidates</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3>Activity Timeline</h3>
            </div>
            <div className="card-body" style={{ padding: '0 24px' }}>
              {activities.slice(0, 6).map((item) => (
                <div key={item.id} className="activity-item">
                  <div className={`activity-dot ${
                    item.type === 'resume_uploaded' ? 'upload' :
                    item.type === 'candidate_screened' ? 'screen' :
                    item.type === 'status_changed' ? 'status' :
                    item.type === 'job_created' ? 'job' : 'export'
                  }`} />
                  <div className="activity-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="activity-time">{formatDate(item.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
