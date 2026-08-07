// ═══════════════════════════════════════════════════════════════
// RecruitPro AI — Type Definitions
// ═══════════════════════════════════════════════════════════════

export type CandidateStatus = 
  | 'New' 
  | 'Screening' 
  | 'Interview' 
  | 'Offered' 
  | 'Hired' 
  | 'Rejected';

export type JobStatus = 'Active' | 'Closed' | 'Draft';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  description: string;
  detectedSkills: string[];
  status: JobStatus;
  candidateCount: number;
  processedCount: number;
  avgScore: number;
  topScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScoreBreakdown {
  skillMatchRatio: number;
  tfidfSimilarity: number;
  semanticSimilarity: number;
  finalScore: number;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone?: string;
  resumeFileName: string;
  resumeText: string;
  scores: ScoreBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  allSkillsFound: string[];
  aiSummary: string;
  aiRecommendation: 'Interview' | 'Hold' | 'Reject';
  interviewQuestions: string[];
  aiFeedback: string;
  status: CandidateStatus;
  recruiterNotes: string;
  experience: string;
  uploadedAt: string;
  processedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'resume_uploaded' | 'candidate_screened' | 'status_changed' | 'job_created' | 'export';
  title: string;
  description: string;
  timestamp: string;
  jobId?: string;
  candidateId?: string;
}

export interface DashboardStats {
  totalJobs: number;
  totalCandidates: number;
  avgScore: number;
  pendingReview: number;
  activeJobs: number;
  processedToday: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  role: 'recruiter' | 'admin';
}
