// ═══════════════════════════════════════════════════════════════
// RecruitPro AI — Data Store Context & Hooks
// ═══════════════════════════════════════════════════════════════

'use client';

import React, { createContext, useContext, useState } from 'react';
import { Job, Candidate, ActivityItem, CandidateStatus, JobStatus } from './types';
import { mockJobs, mockCandidates, mockActivities, mockDashboardStats, mockUser } from './mockData';
import { generateId } from './utils';

interface DataContextType {
  jobs: Job[];
  candidates: Candidate[];
  activities: ActivityItem[];
  stats: typeof mockDashboardStats;
  user: typeof mockUser;
  
  // Job actions
  addJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'candidateCount' | 'processedCount' | 'avgScore' | 'topScore'>) => Job;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  getJob: (jobId: string) => Job | undefined;
  
  // Candidate actions
  updateCandidateStatus: (candidateId: string, status: CandidateStatus) => void;
  updateCandidateNotes: (candidateId: string, notes: string) => void;
  addCandidatesToJob: (jobId: string, newCandidates: Partial<Candidate>[]) => void;
  getCandidate: (candidateId: string) => Candidate | undefined;
  getCandidatesForJob: (jobId: string) => Candidate[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [stats, setStats] = useState(mockDashboardStats);

  const addJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'candidateCount' | 'processedCount' | 'avgScore' | 'topScore'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${generateId()}`,
      candidateCount: 0,
      processedCount: 0,
      avgScore: 0,
      topScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJobs(prev => [newJob, ...prev]);
    setActivities(prev => [
      {
        id: generateId(),
        type: 'job_created',
        title: 'New Job Created',
        description: `${newJob.title} job posted`,
        timestamp: new Date().toISOString(),
        jobId: newJob.id,
      },
      ...prev,
    ]);
    return newJob;
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status, updatedAt: new Date().toISOString() } : j));
  };

  const getJob = (jobId: string) => jobs.find(j => j.id === jobId);

  const updateCandidateStatus = (candidateId: string, status: CandidateStatus) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status } : c));
    setActivities(prev => [
      {
        id: generateId(),
        type: 'status_changed',
        title: 'Status Updated',
        description: `${candidate.name} moved to ${status} stage`,
        timestamp: new Date().toISOString(),
        jobId: candidate.jobId,
        candidateId,
      },
      ...prev,
    ]);
  };

  const updateCandidateNotes = (candidateId: string, notes: string) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, recruiterNotes: notes } : c));
  };

  const addCandidatesToJob = (jobId: string, newCandidates: Partial<Candidate>[]) => {
    const created: Candidate[] = newCandidates.map((c, i) => {
      const matchRatio = c.matchedSkills ? c.matchedSkills.length / 10 : 0.5;
      const tfidf = Math.min(1, Math.max(0.1, matchRatio + (Math.random() * 0.2 - 0.1)));
      const sem = Math.min(1, Math.max(0.2, matchRatio + (Math.random() * 0.2 - 0.05)));
      const finalScore = Number((0.3 * matchRatio + 0.3 * tfidf + 0.4 * sem).toFixed(2));

      return {
        id: `c-${generateId()}-${i}`,
        jobId,
        name: c.name || `Candidate ${i + 1}`,
        email: c.email || `candidate${i + 1}@example.com`,
        resumeFileName: c.resumeFileName || 'Resume.pdf',
        resumeText: c.resumeText || 'Sample extracted resume text content...',
        scores: {
          skillMatchRatio: matchRatio,
          tfidfSimilarity: Number(tfidf.toFixed(2)),
          semanticSimilarity: Number(sem.toFixed(2)),
          finalScore,
        },
        matchedSkills: c.matchedSkills || ['Python', 'SQL'],
        missingSkills: c.missingSkills || ['Docker', 'Kubernetes'],
        allSkillsFound: ['Python', 'SQL', 'Git'],
        aiSummary: `${c.name || 'Candidate'} scored ${finalScore} out of 1.0. Demonstrates good foundation. Recommendation: ${finalScore > 0.7 ? 'Interview' : finalScore > 0.4 ? 'Hold' : 'Reject'}.`,
        aiRecommendation: finalScore > 0.7 ? 'Interview' : finalScore > 0.4 ? 'Hold' : 'Reject',
        interviewQuestions: [
          'Can you elaborate on your experience with Python backend systems?',
          'How do you approach database performance tuning?',
          'Describe a challenging project you owned end-to-end.',
        ],
        aiFeedback: '- **Highlight:** Strong core technical background.\n- **Gap:** Could gain deeper container orchestration experience.',
        status: 'New',
        recruiterNotes: '',
        experience: '3-5 yrs Experience',
        uploadedAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
      };
    });

    setCandidates(prev => [...created, ...prev]);

    // Update job candidate counts
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const count = j.candidateCount + created.length;
        const processed = j.processedCount + created.length;
        return { ...j, candidateCount: count, processedCount: processed };
      }
      return j;
    }));

    setActivities(prev => [
      {
        id: generateId(),
        type: 'resume_uploaded',
        title: 'Resumes Uploaded',
        description: `${created.length} new resume(s) uploaded to job`,
        timestamp: new Date().toISOString(),
        jobId,
      },
      ...prev,
    ]);
  };

  const getCandidate = (candidateId: string) => candidates.find(c => c.id === candidateId);
  const getCandidatesForJob = (jobId: string) => candidates.filter(c => c.jobId === jobId);

  return (
    <DataContext.Provider
      value={{
        jobs,
        candidates,
        activities,
        stats,
        user: mockUser,
        addJob,
        updateJobStatus,
        getJob,
        updateCandidateStatus,
        updateCandidateNotes,
        addCandidatesToJob,
        getCandidate,
        getCandidatesForJob,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
