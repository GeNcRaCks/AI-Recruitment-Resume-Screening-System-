'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Job, Candidate, ActivityItem, CandidateStatus, JobStatus, DashboardStats } from './types';

export interface UserData {
  id: number;
  email: string;
  name: string;
  company_name: string;
}

interface DataContextType {
  loading: boolean;
  jobs: Job[];
  candidates: Candidate[];
  activities: ActivityItem[];
  user: UserData | null;
  stats: DashboardStats;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, company_name: string) => Promise<void>;
  logout: () => void;
  updateUser: (name: string, company_name: string) => Promise<void>;

  fetchJobs: () => Promise<void>;
  addJob: (jobData: AddJobData) => Promise<Job>;
  deleteJob: (jobId: string) => Promise<void>;
  updateJobStatus: (jobId: string, status: JobStatus) => Promise<void>;
  getJob: (jobId: string) => Job | undefined;
  
  updateCandidateStatus: (candidateId: string, status: CandidateStatus) => Promise<void>;
  updateCandidateNotes: (candidateId: string, notes: string) => Promise<void>;
  deleteCandidate: (candidateId: string) => Promise<void>;
  addCandidatesToJob: (jobId: string, files: File[]) => Promise<void>;
  getCandidate: (candidateId: string) => Candidate | undefined;
  getCandidatesForJob: (jobId: string) => Candidate[];
}

interface AddJobData {
  title: string;
  department?: string;
  location?: string;
  employmentType?: Job['employmentType'];
  description?: string;
  detectedSkills?: string[];
  status?: JobStatus;
}

interface ApiJob {
  id: number;
  title: string;
  jd_text?: string;
  detected_skills?: string[];
  candidate_count?: number;
  avg_score?: number;
  top_score?: number;
  created_at: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("access_token");
  }
  return null;
}

function parseInterviewQuestions(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return value
      .split(/\r?\n|(?<=\?)\s+(?=\d+[.)]\s)/)
      .map((question) => question.replace(/^\s*\d+[.)]\s*/, '').trim())
      .filter(Boolean);
  }
  return [];
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const activities: ActivityItem[] = [];

  const stats = {
    totalCandidates: candidates.length,
    activeJobs: jobs.filter((job) => job.status === 'Active').length,
    pendingReview: candidates.filter((candidate) => candidate.status === 'New' || candidate.status === 'Screening').length,
    processedToday: candidates.length,
    avgScore: candidates.length > 0
      ? Number((candidates.reduce((sum, candidate) => sum + candidate.scores.finalScore, 0) / candidates.length).toFixed(2))
      : 0,
  };

  const fetchAuthUser = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        localStorage.removeItem("access_token");
        document.cookie = `access_token=; path=/; max-age=0`;
      }
    } catch (e) {
      console.error("Failed to fetch user", e);
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const formattedJobs: Job[] = data.map((j: ApiJob) => ({
          id: String(j.id),
          title: j.title,
          department: 'General',
          location: 'Remote',
          employmentType: 'Full-time',
          description: j.jd_text || '',
          detectedSkills: j.detected_skills || [],
          status: 'Active',
          candidateCount: j.candidate_count,
          processedCount: j.candidate_count,
          avgScore: j.avg_score || 0,
          topScore: j.top_score || 0,
          createdAt: j.created_at,
          updatedAt: j.created_at
        }));
        setJobs(formattedJobs);
      }
    } catch (e) {
      console.error("Failed to fetch jobs", e);
    }
  }, []);

  const fetchCandidates = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const jobsRes = await fetch(`${API_BASE}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        const allCandidates: Candidate[] = [];
        for (const j of jobsData) {
          const cRes = await fetch(`${API_BASE}/jobs/${j.id}/candidates`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (cRes.ok) {
            const cData = await cRes.json();
            for (const c of cData) {
              const detailRes = await fetch(`${API_BASE}/candidates/${c.id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const detail = detailRes.ok ? await detailRes.json() : c;
              allCandidates.push({
                id: String(c.id),
                jobId: String(j.id),
                name: c.name,
                email: c.email || '',
                resumeFileName: c.resume_filename || c.name,
                resumeText: detail?.resume_text || '',
                scores: {
                  skillMatchRatio: detail?.skill_match_ratio || c.final_score || 0,
                  tfidfSimilarity: detail?.tfidf_similarity || c.final_score || 0,
                  semanticSimilarity: detail?.semantic_similarity || c.final_score || 0,
                  finalScore: detail?.final_score || c.final_score || 0
                },
                matchedSkills: detail?.matched_skills || c.matched_skills || [],
                missingSkills: detail?.missing_skills || [],
                allSkillsFound: detail?.matched_skills || c.matched_skills || [],
                aiSummary: detail?.summary || '',
                aiRecommendation: (detail?.final_score || c.final_score || 0) > 0.7 ? 'Interview' : (detail?.final_score || c.final_score || 0) > 0.4 ? 'Hold' : 'Reject',
                interviewQuestions: parseInterviewQuestions(detail?.questions),
                aiFeedback: detail?.feedback || '',
                status: c.status,
                recruiterNotes: detail?.notes || '',
                experience: 'Unknown',
                uploadedAt: new Date().toISOString(),
                processedAt: new Date().toISOString()
              });
            }
          }
        }
        setCandidates(allCandidates);
      }
    } catch (e) {
      console.error("Failed to fetch candidates", e);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (getToken()) {
        await fetchAuthUser();
        await fetchJobs();
        await fetchCandidates();
      }
      setLoading(false);
    };
    init();
  }, [fetchAuthUser, fetchJobs, fetchCandidates]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed.");
    
    localStorage.setItem("access_token", data.access_token);
    document.cookie = `access_token=${data.access_token}; path=/; max-age=43200`;
    setUser(data.user);
    await fetchJobs();
    await fetchCandidates();
  };

  const register = async (name: string, email: string, password: string, company_name: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, company_name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Registration failed.");
    
    localStorage.setItem("access_token", data.access_token);
    document.cookie = `access_token=${data.access_token}; path=/; max-age=43200`;
    setUser(data.user);
    await fetchJobs();
    await fetchCandidates();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    document.cookie = `access_token=; path=/; max-age=0`;
    setUser(null);
    setJobs([]);
    setCandidates([]);
  };

  const updateUser = async (name: string, company_name: string) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ name, company_name }),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const updated = await res.json();
    setUser(prev => prev ? { ...prev, ...updated } : updated);
  };

  const addJob = async (jobData: AddJobData) => {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ title: jobData.title, jd_text: jobData.description || 'N/A' }),
    });
    if (!res.ok) throw new Error("Failed to create job");
    const newJob = await res.json();
    await fetchJobs();
    return {
      id: String(newJob.id),
      title: newJob.title,
      department: jobData.department || 'General',
      location: jobData.location || 'Remote',
      employmentType: jobData.employmentType || 'Full-time',
      description: jobData.description || '',
      detectedSkills: newJob.detected_skills || [],
      status: jobData.status || 'Active',
      candidateCount: 0,
      processedCount: 0,
      avgScore: 0,
      topScore: 0,
      createdAt: newJob.created_at,
      updatedAt: newJob.created_at,
    };
  };

  const updateJobStatus = async (jobId: string, status: JobStatus) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status, updatedAt: new Date().toISOString() } : j));
  };

  const deleteJob = async (jobId: string) => {
    const res = await fetch(`${API_BASE}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to delete job posting');
    setJobs(prev => prev.filter(job => job.id !== jobId));
    setCandidates(prev => prev.filter(candidate => candidate.jobId !== jobId));
  };

  const getJob = (jobId: string) => jobs.find(j => j.id === jobId);

  const updateCandidateStatus = async (candidateId: string, status: CandidateStatus) => {
    const res = await fetch(`${API_BASE}/candidates/${candidateId}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update candidate status");
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status } : c));
  };

  const updateCandidateNotes = async (candidateId: string, notes: string) => {
    const res = await fetch(`${API_BASE}/candidates/${candidateId}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error("Failed to update candidate notes");
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, recruiterNotes: notes } : c));
  };

  const deleteCandidate = async (candidateId: string) => {
    const res = await fetch(`${API_BASE}/candidates/${candidateId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to delete candidate');
    setCandidates(prev => prev.filter(candidate => candidate.id !== candidateId));
    await fetchJobs();
  };

  const addCandidatesToJob = async (jobId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    const res = await fetch(`${API_BASE}/jobs/${jobId}/upload-resumes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed.");
    await fetchCandidates();
    await fetchJobs();
  };

  const getCandidate = (candidateId: string) => candidates.find(c => c.id === candidateId);
  const getCandidatesForJob = (jobId: string) => candidates.filter(c => c.jobId === jobId);

  return (
    <DataContext.Provider
      value={{
        loading,
        jobs,
        candidates,
        activities,
        stats,
        user,
        login,
        register,
        logout,
        updateUser,
        fetchJobs,
        addJob,
        deleteJob,
        updateJobStatus,
        getJob,
        updateCandidateStatus,
        updateCandidateNotes,
        deleteCandidate,
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
