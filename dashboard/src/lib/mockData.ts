// ═══════════════════════════════════════════════════════════════
// RecruitPro AI — Mock Data for UI Development
// Replace with real API calls once backend is ready
// ═══════════════════════════════════════════════════════════════

import { Job, Candidate, ActivityItem, DashboardStats, User, CandidateStatus } from './types';

// ─── Current User ────────────────────────────────────────────
export const mockUser: User = {
  id: 'u1',
  name: 'Sarah Mitchell',
  email: 'sarah@company.com',
  company: 'TechVision Inc.',
  role: 'recruiter',
};

// ─── Jobs ────────────────────────────────────────────────────
export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Backend Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
    description: `We are looking for a Senior Backend Engineer to join our team and help build scalable, high-performance backend systems. You will work closely with product and frontend teams to design and implement REST APIs, manage PostgreSQL databases, and deploy services using Docker and Kubernetes.

Requirements:
- 5+ years of experience with Python or Go
- Strong knowledge of PostgreSQL and database design
- Experience with REST API development and microservices
- Docker and container orchestration (Kubernetes preferred)
- Familiarity with CI/CD pipelines
- Experience with cloud platforms (AWS/GCP)
- Strong understanding of data structures and algorithms`,
    detectedSkills: ['Python', 'PostgreSQL', 'REST API', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'Go', 'Data Structures and Algorithms'],
    status: 'Active',
    candidateCount: 142,
    processedCount: 120,
    avgScore: 0.48,
    topScore: 0.92,
    createdAt: '2025-07-28T09:00:00Z',
    updatedAt: '2025-08-04T14:30:00Z',
  },
  {
    id: 'job-2',
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    description: `Looking for a talented Frontend Developer with expertise in React and TypeScript to build beautiful, responsive user interfaces. You will collaborate with designers and backend developers to deliver exceptional user experiences.

Requirements:
- 3+ years of experience with React
- TypeScript proficiency
- CSS/SCSS and responsive design
- State management (Redux, Zustand, or Context API)
- Testing (Jest, React Testing Library)
- Git version control
- Experience with Next.js is a plus`,
    detectedSkills: ['React', 'TypeScript', 'CSS', 'Redux', 'Jest', 'Git', 'Next.js', 'Responsive Design'],
    status: 'Active',
    candidateCount: 89,
    processedCount: 89,
    avgScore: 0.52,
    topScore: 0.88,
    createdAt: '2025-07-20T10:00:00Z',
    updatedAt: '2025-08-03T11:00:00Z',
  },
  {
    id: 'job-3',
    title: 'Machine Learning Engineer',
    department: 'Data Science',
    location: 'New York, NY',
    employmentType: 'Full-time',
    description: `Join our ML team to build and deploy machine learning models at scale. You will work on NLP, recommendation systems, and real-time inference pipelines.

Requirements:
- MS/PhD in Computer Science or related field
- Python, TensorFlow/PyTorch
- NLP experience (transformers, embeddings)
- MLOps (MLflow, Kubeflow)
- SQL and data engineering basics
- Experience with A/B testing`,
    detectedSkills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Machine Learning', 'SQL', 'MLOps', 'Data Engineering'],
    status: 'Active',
    candidateCount: 56,
    processedCount: 56,
    avgScore: 0.41,
    topScore: 0.85,
    createdAt: '2025-08-01T08:00:00Z',
    updatedAt: '2025-08-04T10:00:00Z',
  },
  {
    id: 'job-4',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Austin, TX',
    employmentType: 'Contract',
    description: `Seeking a DevOps Engineer to streamline our CI/CD pipelines and manage cloud infrastructure on AWS.`,
    detectedSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Ansible'],
    status: 'Closed',
    candidateCount: 34,
    processedCount: 34,
    avgScore: 0.55,
    topScore: 0.91,
    createdAt: '2025-06-15T09:00:00Z',
    updatedAt: '2025-07-20T16:00:00Z',
  },
  {
    id: 'job-5',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    employmentType: 'Full-time',
    description: `We need a Product Designer to create intuitive, visually stunning interfaces for our SaaS platform.`,
    detectedSkills: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research', 'Design Systems', 'Adobe XD'],
    status: 'Draft',
    candidateCount: 0,
    processedCount: 0,
    avgScore: 0,
    topScore: 0,
    createdAt: '2025-08-04T12:00:00Z',
    updatedAt: '2025-08-04T12:00:00Z',
  },
];

// ─── Candidates (for job-1: Senior Backend Engineer) ─────────
export const mockCandidates: Candidate[] = [
  {
    id: 'c1',
    jobId: 'job-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@email.com',
    phone: '+1-555-0101',
    resumeFileName: 'Aarav_Sharma_Resume.pdf',
    resumeText: `AARAV SHARMA
Senior Software Engineer | San Francisco, CA
aarav.sharma@email.com | (555) 010-1001

PROFESSIONAL SUMMARY
Experienced backend engineer with 7+ years building high-performance distributed systems. Expert in Python, Go, and cloud-native architectures. Passionate about clean code, scalable design, and mentoring junior developers.

EXPERIENCE
Lead Backend Engineer — CloudScale Inc. (2021 – Present)
- Designed and built microservices handling 50K+ requests/second using Python (FastAPI) and Go
- Managed PostgreSQL clusters with read replicas, reducing query latency by 40%
- Implemented CI/CD pipelines with GitHub Actions and ArgoCD, cutting deployment time from 2 hours to 15 minutes
- Deployed services on Kubernetes (EKS) with Docker, achieving 99.95% uptime
- Built REST APIs consumed by 3 frontend teams and 2 mobile teams

Senior Software Engineer — DataFlow Systems (2018 – 2021)
- Developed data processing pipelines using Python and Apache Kafka
- Optimized PostgreSQL queries, improving report generation speed by 60%
- Implemented authentication and authorization using OAuth2 and JWT
- Mentored 4 junior developers through code reviews and pair programming

EDUCATION
B.S. Computer Science — Stanford University (2018)

SKILLS
Python, Go, PostgreSQL, Docker, Kubernetes, AWS (EKS, S3, Lambda), REST API, Microservices, CI/CD, Redis, Kafka, Git, Data Structures, Algorithms`,
    scores: {
      skillMatchRatio: 0.9,
      tfidfSimilarity: 0.88,
      semanticSimilarity: 0.95,
      finalScore: 0.92,
    },
    matchedSkills: ['Python', 'PostgreSQL', 'REST API', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'Go', 'Data Structures and Algorithms'],
    missingSkills: [],
    allSkillsFound: ['Python', 'PostgreSQL', 'REST API', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'Go', 'Data Structures and Algorithms', 'Redis', 'Kafka', 'Git', 'OAuth2'],
    aiSummary: 'Aarav Sharma is an exceptional fit for the Senior Backend Engineer role, scoring 0.92 out of 1.0. His 7+ years of experience building high-performance distributed systems with Python, Go, PostgreSQL, and Kubernetes directly align with all listed requirements. He demonstrates strong leadership through mentoring and cross-team API design. Recommendation: Interview — top candidate with comprehensive skill coverage and proven production experience.',
    aiRecommendation: 'Interview',
    interviewQuestions: [
      'Describe your approach to designing a microservices architecture that handles 50K+ requests per second. What trade-offs did you consider between synchronous REST calls and asynchronous messaging?',
      'Walk me through how you optimized PostgreSQL query performance at DataFlow Systems. What profiling tools did you use, and how did you decide between indexing strategies?',
      'How do you approach CI/CD pipeline design? Describe a situation where a deployment pipeline you built caught a critical issue before production.',
      'Explain your experience with Kubernetes cluster management. How do you handle rolling deployments and rollbacks in a production environment?',
      'Tell me about a challenging distributed systems bug you debugged. What tools and techniques did you use to identify the root cause?',
      'How do you mentor junior developers effectively while maintaining your own productivity? Give a specific example.',
    ],
    aiFeedback: '- **Highlight:** Your microservices experience handling 50K+ req/s with quantified outcomes (40% latency reduction, 99.95% uptime) is exactly what hiring managers want to see. Keep emphasizing these measurable impacts.\n\n- **Enhancement:** Consider adding specific versions/frameworks (e.g., FastAPI 0.100+, Go 1.21) and any contributions to system design documents or architecture decision records (ADRs) to further demonstrate senior-level ownership.',
    status: 'Interview',
    recruiterNotes: 'Strong Python background, excellent system design experience. Top candidate — schedule final round.',
    experience: '7 yrs Experience',
    uploadedAt: '2025-08-01T10:00:00Z',
    processedAt: '2025-08-01T10:02:30Z',
  },
  {
    id: 'c2',
    jobId: 'job-1',
    name: 'Neha Verma',
    email: 'neha.verma@email.com',
    phone: '+1-555-0102',
    resumeFileName: 'Neha_Verma_CV.pdf',
    resumeText: `NEHA VERMA
Backend Developer | Remote
neha.verma@email.com

SUMMARY
Backend developer with 4 years of experience in Python and Django. Looking to grow into senior engineering roles with focus on distributed systems.

EXPERIENCE
Backend Developer — WebTech Solutions (2021 – Present)
- Built REST APIs using Django REST Framework serving 200+ endpoints
- Managed PostgreSQL and Redis databases
- Wrote unit tests achieving 85% code coverage
- Deployed applications using Docker on AWS EC2

Junior Developer — StartupXYZ (2019 – 2021)
- Developed features in Python/Flask
- Created database schemas in PostgreSQL
- Participated in code reviews

EDUCATION
B.Tech Computer Science — IIT Delhi (2019)

SKILLS
Python, Django, PostgreSQL, REST API, Docker, AWS, Redis, Git, Linux`,
    scores: {
      skillMatchRatio: 0.5,
      tfidfSimilarity: 0.36,
      semanticSimilarity: 0.48,
      finalScore: 0.45,
    },
    matchedSkills: ['Python', 'PostgreSQL', 'REST API', 'Docker', 'AWS'],
    missingSkills: ['Kubernetes', 'CI/CD', 'Microservices', 'Go', 'Data Structures and Algorithms'],
    allSkillsFound: ['Python', 'Django', 'PostgreSQL', 'REST API', 'Docker', 'AWS', 'Redis', 'Git', 'Linux'],
    aiSummary: 'Neha Verma shows moderate fit for the Senior Backend Engineer role, scoring 0.45 out of 1.0. She has solid Python and PostgreSQL experience but lacks exposure to Kubernetes, CI/CD pipelines, microservices architecture, and Go — all critical requirements for this senior position. Her 4 years of experience is below the 5+ year threshold. Recommendation: Hold — consider for a mid-level backend role instead.',
    aiRecommendation: 'Hold',
    interviewQuestions: [
      'How would you transition a monolithic Django application to a microservices architecture? What challenges do you anticipate?',
      'Describe your experience with Docker. Have you used container orchestration tools like Kubernetes or Docker Swarm?',
      'What CI/CD tools have you used? How would you set up an automated deployment pipeline from scratch?',
      'Tell me about a time you had to learn a new programming language or framework quickly. How did you approach it?',
      'How do you approach database schema design for a system that needs to scale to millions of records?',
      'What testing strategies do you employ beyond unit tests? How do you ensure API reliability?',
    ],
    aiFeedback: '- **Highlight:** Your REST API development experience with 200+ endpoints and 85% test coverage demonstrates strong backend fundamentals. Quantify the scale more — how many users, requests per second?\n\n- **Skill gap to address:** Learn Kubernetes and CI/CD pipelines (GitHub Actions or Jenkins) — these are expected at senior level. Consider contributing to an open-source project that uses microservices to build practical experience.',
    status: 'Interview',
    recruiterNotes: '',
    experience: '4 yrs Experience',
    uploadedAt: '2025-08-01T10:05:00Z',
    processedAt: '2025-08-01T10:07:20Z',
  },
  {
    id: 'c3',
    jobId: 'job-1',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@email.com',
    resumeFileName: 'Rohan_Mehta_Resume.docx',
    resumeText: `Rohan Mehta
Full Stack Developer
rohan.mehta@email.com

Experience:
Software Developer at TechCorp (2022-Present)
- Built web applications using React and Node.js
- Used MongoDB for data storage
- Deployed to Heroku and Vercel

Intern at CodeLab (2021-2022)
- Learned Python basics
- Assisted with frontend development

Education:
B.Sc Computer Science — University of Mumbai (2022)

Skills: JavaScript, React, Node.js, MongoDB, HTML, CSS, Python (basic)`,
    scores: {
      skillMatchRatio: 0.1,
      tfidfSimilarity: 0.15,
      semanticSimilarity: 0.22,
      finalScore: 0.16,
    },
    matchedSkills: ['Python'],
    missingSkills: ['PostgreSQL', 'REST API', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'Go', 'Data Structures and Algorithms'],
    allSkillsFound: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'HTML', 'CSS'],
    aiSummary: 'Rohan Mehta is a poor fit for the Senior Backend Engineer role, scoring 0.16 out of 1.0. His experience is primarily in frontend/full-stack development with React and Node.js, with only basic Python knowledge. He lacks all critical backend requirements including PostgreSQL, Docker, Kubernetes, and microservices experience. His 2 years of experience is well below the 5+ year requirement. Recommendation: Reject — skill set does not align with this senior backend position.',
    aiRecommendation: 'Reject',
    interviewQuestions: [
      'You list Python as a basic skill — can you describe a backend project where you used Python beyond simple scripts?',
      'How would you approach learning PostgreSQL coming from a MongoDB background? What key differences do you see?',
      'Describe your understanding of REST API design principles. How have you implemented APIs in Node.js?',
      'What is your experience with containerization? Have you used Docker in any capacity?',
      'How do you approach testing backend services? What tools and methodologies are you familiar with?',
      'Where do you see your career heading — do you want to specialize in backend, or continue as a full-stack developer?',
    ],
    aiFeedback: '- **Highlight:** Your full-stack experience with React and Node.js shows versatility. If applying for full-stack or frontend roles, emphasize your end-to-end project delivery.\n\n- **Skill gap to address:** For backend engineering roles, you need to significantly deepen your Python, PostgreSQL, and DevOps skills. Consider building a side project with Python (FastAPI), PostgreSQL, Docker, and deploying it on AWS.',
    status: 'Rejected',
    recruiterNotes: 'Not a fit for senior backend role. Consider for junior full-stack positions.',
    experience: '2 yrs Experience',
    uploadedAt: '2025-08-01T10:10:00Z',
    processedAt: '2025-08-01T10:12:00Z',
  },
  {
    id: 'c4',
    jobId: 'job-1',
    name: 'Anita Singh',
    email: 'anita.singh@email.com',
    phone: '+1-555-0104',
    resumeFileName: 'Anita_Singh_Resume.pdf',
    resumeText: `ANITA SINGH
Senior Software Engineer | Seattle, WA
anita.singh@email.com | (555) 010-4004

PROFESSIONAL SUMMARY
6+ years building cloud-native backend systems. Strong in Python and Go with deep PostgreSQL expertise. Certified AWS Solutions Architect.

EXPERIENCE
Senior Engineer — ScaleUp Technologies (2020 – Present)
- Architected microservices platform processing 100M+ daily transactions
- Built CI/CD pipelines using Jenkins and GitHub Actions
- Managed Kubernetes clusters on AWS EKS (50+ pods)
- Designed REST APIs with OpenAPI specs and versioning strategy

Backend Engineer — DataPrime (2018 – 2020)
- Developed ETL pipelines in Python
- Optimized PostgreSQL performance (partitioning, indexing)
- Containerized legacy applications using Docker

EDUCATION
M.S. Computer Science — University of Washington (2018)

CERTIFICATIONS
- AWS Solutions Architect Associate
- Certified Kubernetes Administrator

SKILLS
Python, Go, PostgreSQL, Docker, Kubernetes, AWS, CI/CD, Microservices, REST API, Terraform, Redis`,
    scores: {
      skillMatchRatio: 0.9,
      tfidfSimilarity: 0.72,
      semanticSimilarity: 0.88,
      finalScore: 0.84,
    },
    matchedSkills: ['Python', 'PostgreSQL', 'REST API', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'Go'],
    missingSkills: ['Data Structures and Algorithms'],
    allSkillsFound: ['Python', 'Go', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'REST API', 'Terraform', 'Redis'],
    aiSummary: 'Anita Singh is a strong fit for the Senior Backend Engineer role, scoring 0.84 out of 1.0. Her 6+ years of experience with cloud-native architectures, 100M+ daily transactions scale, and AWS/Kubernetes certifications demonstrate senior-level competency. The only gap is explicit mention of data structures and algorithms, though her technical depth implies strong fundamentals. Recommendation: Interview — excellent candidate with proven production-scale experience.',
    aiRecommendation: 'Interview',
    interviewQuestions: [
      'Describe the architecture of the microservices platform handling 100M+ daily transactions. How did you handle data consistency across services?',
      'Walk me through your Kubernetes cluster management experience. How do you handle auto-scaling and resource optimization for 50+ pods?',
      'How do you approach API versioning strategy? What trade-offs did you consider between URL versioning, header versioning, and query parameter approaches?',
      'Tell me about a production incident you handled. What was your debugging process and how did you prevent recurrence?',
      'How do you design CI/CD pipelines for a microservices environment? How do you handle dependencies between service deployments?',
      'Describe your approach to PostgreSQL performance optimization. Walk me through a specific case where partitioning or indexing solved a performance bottleneck.',
    ],
    aiFeedback: '- **Highlight:** Your 100M+ daily transactions scale and dual certifications (AWS SA + CKA) are standout credentials. Lead with these in interviews.\n\n- **Enhancement:** Add data structures and algorithms to your skills section explicitly, and consider including any competitive programming or system design interview prep to address the only detected gap.',
    status: 'Screening',
    recruiterNotes: '',
    experience: '6 yrs Experience',
    uploadedAt: '2025-08-02T09:00:00Z',
    processedAt: '2025-08-02T09:03:00Z',
  },
  {
    id: 'c5',
    jobId: 'job-1',
    name: 'Kiran Joshi',
    email: 'kiran.joshi@email.com',
    resumeFileName: 'Kiran_Joshi_Resume.pdf',
    resumeText: `Kiran Joshi
Software Engineer
kiran.joshi@email.com

Summary: 5 years of software development experience with a focus on backend systems.

Experience:
Software Engineer — MidTier Solutions (2020 – Present)
- Developed APIs using Python Flask
- Used PostgreSQL and MySQL databases
- Wrote Docker containers for local development
- Familiar with AWS services (S3, EC2)

Junior Developer — FreshCode (2019 – 2020)
- Built backend features in Python
- SQL database management

Education: B.E. Computer Engineering — Pune University (2019)

Skills: Python, Flask, PostgreSQL, MySQL, Docker, AWS, SQL, Git`,
    scores: {
      skillMatchRatio: 0.4,
      tfidfSimilarity: 0.19,
      semanticSimilarity: 0.41,
      finalScore: 0.35,
    },
    matchedSkills: ['Python', 'PostgreSQL', 'Docker', 'AWS'],
    missingSkills: ['REST API', 'Kubernetes', 'CI/CD', 'Microservices', 'Go', 'Data Structures and Algorithms'],
    allSkillsFound: ['Python', 'Flask', 'PostgreSQL', 'MySQL', 'Docker', 'AWS', 'SQL', 'Git'],
    aiSummary: 'Kiran Joshi has moderate-to-low fit for the Senior Backend Engineer role, scoring 0.35 out of 1.0. While he has 5 years of Python and database experience, his exposure is limited to basic Flask APIs and simple Docker usage. He lacks experience with Kubernetes, CI/CD, microservices, and Go — key requirements for this role. Recommendation: Reject — experience level and technical depth are below senior expectations.',
    aiRecommendation: 'Reject',
    interviewQuestions: [
      'How have you designed RESTful APIs in Flask? Do you follow any specific patterns or standards?',
      'Describe your Docker usage. Have you moved beyond local development to production deployments?',
      'What AWS services have you used beyond S3 and EC2? Are you familiar with managed container services like ECS or EKS?',
      'How do you approach database optimization? Give an example of a query you significantly improved.',
      'Have you worked with any CI/CD tools? How do you currently deploy your applications?',
      'What interests you about moving to a senior engineering role? What areas are you actively developing?',
    ],
    aiFeedback: '- **Highlight:** Your 5 years of Python backend experience provides a solid foundation. Emphasize any complex business logic or performance optimization work you\'ve done.\n\n- **Skill gap to address:** To reach senior backend level, invest in learning Kubernetes, setting up CI/CD pipelines, and understanding microservices patterns. The jump from Flask to FastAPI and from simple Docker to orchestrated containers is critical.',
    status: 'New',
    recruiterNotes: '',
    experience: '5 yrs Experience',
    uploadedAt: '2025-08-03T14:00:00Z',
    processedAt: '2025-08-03T14:02:00Z',
  },
  {
    id: 'c6',
    jobId: 'job-1',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+1-555-0106',
    resumeFileName: 'Priya_Patel_Resume.pdf',
    resumeText: `PRIYA PATEL
Staff Software Engineer | San Jose, CA

SUMMARY
8+ years of backend engineering experience. Expert in Python, Go, and distributed systems.
Led platform engineering teams of 5-8 engineers.

EXPERIENCE
Staff Engineer — MegaScale (2020 – Present)
- Led backend platform team serving 200M+ monthly active users
- Architected event-driven microservices using Go and Python
- Managed 200+ Kubernetes pods across multi-region AWS deployment
- Built real-time data pipelines processing 500K events/second
- Established CI/CD best practices reducing deployment failures by 80%

Senior Engineer — BackendPro (2017 – 2020)
- Built REST APIs and GraphQL services
- PostgreSQL performance tuning and sharding
- Docker containerization and AWS infrastructure

EDUCATION
M.S. Computer Science — MIT (2017)

SKILLS
Python, Go, PostgreSQL, Docker, Kubernetes, AWS, CI/CD, Microservices, REST API, GraphQL, Kafka, Redis, Terraform, Data Structures, Algorithms, System Design`,
    scores: {
      skillMatchRatio: 1.0,
      tfidfSimilarity: 0.82,
      semanticSimilarity: 0.93,
      finalScore: 0.92,
    },
    matchedSkills: ['Python', 'PostgreSQL', 'REST API', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'Go', 'Data Structures and Algorithms'],
    missingSkills: [],
    allSkillsFound: ['Python', 'Go', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'REST API', 'GraphQL', 'Kafka', 'Redis', 'Terraform', 'Data Structures and Algorithms', 'System Design'],
    aiSummary: 'Priya Patel is an outstanding fit for the Senior Backend Engineer role, scoring 0.92 out of 1.0. With 8+ years of experience, leadership of platform teams, and expertise across every listed requirement, she exceeds expectations. Her scale (200M+ MAU, 500K events/second) and leadership experience make her potentially overqualified but an exceptional hire. Recommendation: Interview — top-priority candidate.',
    aiRecommendation: 'Interview',
    interviewQuestions: [
      'Tell me about architecting event-driven microservices at MegaScale. How did you handle exactly-once delivery and event ordering?',
      'Describe your multi-region Kubernetes deployment strategy. How did you handle failover and data replication across regions?',
      'As a Staff Engineer, how did you establish CI/CD best practices across multiple teams? What metrics did you track?',
      'Walk me through your approach to PostgreSQL sharding. What were the trade-offs and how did you handle cross-shard queries?',
      'How do you balance technical leadership with individual contribution? Give an example of a technical decision you drove.',
      'What would you look for in evaluating our current backend architecture? Where would you focus improvement efforts?',
    ],
    aiFeedback: '- **Highlight:** Your scale (200M+ MAU, 500K events/sec) and team leadership are exceptional. These numbers immediately signal senior-plus capability.\n\n- **Enhancement:** Consider whether this role matches your career trajectory — your Staff-level experience may position you for a Principal or Engineering Manager role.',
    status: 'New',
    recruiterNotes: '',
    experience: '8 yrs Experience',
    uploadedAt: '2025-08-04T08:00:00Z',
    processedAt: '2025-08-04T08:03:00Z',
  },
  {
    id: 'c7',
    jobId: 'job-1',
    name: 'David Chen',
    email: 'david.chen@email.com',
    resumeFileName: 'David_Chen_Resume.pdf',
    resumeText: `David Chen - Backend Engineer
5 years of experience in Java and Python backend development.

Experience:
Backend Developer — TechServe (2020 – Present)
- Built REST APIs using Spring Boot and FastAPI
- PostgreSQL and MongoDB database management
- Docker-based deployment pipelines
- AWS services (EC2, RDS, S3, Lambda)

Software Developer — AppBuilder (2019 – 2020)
- Java/Spring development
- MySQL database management
- Basic CI/CD with Jenkins

Education: B.S. Computer Science — UC Berkeley (2019)
Skills: Java, Python, Spring Boot, FastAPI, PostgreSQL, MongoDB, Docker, AWS, REST API, Jenkins, Git`,
    scores: {
      skillMatchRatio: 0.6,
      tfidfSimilarity: 0.42,
      semanticSimilarity: 0.58,
      finalScore: 0.54,
    },
    matchedSkills: ['Python', 'PostgreSQL', 'REST API', 'Docker', 'AWS', 'CI/CD'],
    missingSkills: ['Kubernetes', 'Microservices', 'Go', 'Data Structures and Algorithms'],
    allSkillsFound: ['Java', 'Python', 'Spring Boot', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'REST API', 'Jenkins', 'Git'],
    aiSummary: 'David Chen is a moderate fit for the Senior Backend Engineer role, scoring 0.54 out of 1.0. He has solid Python and Java backend experience with good AWS and Docker exposure, but lacks Kubernetes, microservices architecture, and Go experience. His 5 years meet the minimum threshold. Recommendation: Hold — could be a fit if willing to learn Kubernetes and microservices on the job.',
    aiRecommendation: 'Hold',
    interviewQuestions: [
      'Compare your experience with Spring Boot and FastAPI. How do you choose between them for a new project?',
      'How have you used Docker in production? Have you explored container orchestration beyond single-host deployments?',
      'Describe a complex REST API you designed. How did you handle authentication, rate limiting, and error handling?',
      'What is your experience with microservices? How would you decompose a monolithic application?',
      'Tell me about your CI/CD experience with Jenkins. What would an ideal pipeline look like for you?',
      'How do you stay current with backend technologies? What are you learning right now?',
    ],
    aiFeedback: '- **Highlight:** Dual Java/Python backend experience makes you versatile. Emphasize FastAPI and any high-traffic API work with specific metrics.\n\n- **Skill gap to address:** Add Kubernetes to your toolkit — start with minikube locally, then try EKS on AWS. Also explore microservices patterns like circuit breakers, service meshes, and distributed tracing.',
    status: 'New',
    recruiterNotes: '',
    experience: '5 yrs Experience',
    uploadedAt: '2025-08-04T09:30:00Z',
    processedAt: '2025-08-04T09:32:00Z',
  },
  {
    id: 'c8',
    jobId: 'job-1',
    name: 'Maya Williams',
    email: 'maya.williams@email.com',
    resumeFileName: 'Maya_Williams_Resume.pdf',
    resumeText: `Maya Williams
Senior Backend Engineer | Portland, OR

7 years of experience specializing in Python backend systems, Kubernetes, and AWS infrastructure.

Experience:
Senior Backend Engineer — CloudFirst (2019 – Present)
- Built and maintained Python microservices (FastAPI) on Kubernetes
- Managed PostgreSQL databases with automated backups and failover
- Designed REST APIs with comprehensive OpenAPI documentation
- CI/CD with GitHub Actions, Docker, and ArgoCD
- AWS infrastructure (EKS, RDS, ElastiCache, SQS)
- Go services for performance-critical paths

Backend Developer — WebScale (2017 – 2019)
- Python Django REST framework APIs
- PostgreSQL optimization and migrations
- Docker containerization

Education: B.S. Computer Science — Oregon State University (2017)
Skills: Python, Go, PostgreSQL, Docker, Kubernetes, AWS, CI/CD, Microservices, REST API, FastAPI, Redis, Git`,
    scores: {
      skillMatchRatio: 0.9,
      tfidfSimilarity: 0.78,
      semanticSimilarity: 0.91,
      finalScore: 0.87,
    },
    matchedSkills: ['Python', 'PostgreSQL', 'REST API', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'Go'],
    missingSkills: ['Data Structures and Algorithms'],
    allSkillsFound: ['Python', 'Go', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'REST API', 'FastAPI', 'Redis', 'Git'],
    aiSummary: 'Maya Williams is a strong fit for the Senior Backend Engineer role, scoring 0.87 out of 1.0. Her 7 years of experience with Python microservices on Kubernetes, combined with Go and comprehensive AWS usage, closely match the requirements. The only gap is explicit mention of data structures and algorithms. Recommendation: Interview — strong candidate with directly relevant experience.',
    aiRecommendation: 'Interview',
    interviewQuestions: [
      'How do you structure FastAPI microservices for maintainability and testability at scale?',
      'Describe your Kubernetes deployment strategy. How do you handle blue-green or canary deployments?',
      'Walk me through your PostgreSQL failover setup. How do you ensure zero data loss during failover?',
      'When do you choose Go over Python for a service? Give a specific example from your experience.',
      'How do you design REST APIs that are backward compatible? What versioning strategy do you prefer?',
      'Describe your approach to monitoring and observability in a microservices environment.',
    ],
    aiFeedback: '- **Highlight:** Your FastAPI + Kubernetes + ArgoCD stack is exactly what modern backend teams want. Lead with this combination in your applications.\n\n- **Enhancement:** Add data structures and algorithms to your resume skills section and consider including any LeetCode/system design preparation to address the gap.',
    status: 'Interview',
    recruiterNotes: 'Strong candidate — very similar profile to Aarav. Schedule for same interview panel to compare.',
    experience: '7 yrs Experience',
    uploadedAt: '2025-08-04T10:00:00Z',
    processedAt: '2025-08-04T10:03:00Z',
  },
];

// ─── Activity Feed ───────────────────────────────────────────
export const mockActivities: ActivityItem[] = [
  {
    id: 'a1',
    type: 'resume_uploaded',
    title: 'Resumes Uploaded',
    description: '8 new resumes uploaded to Senior Backend Engineer',
    timestamp: '2025-08-04T10:00:00Z',
    jobId: 'job-1',
  },
  {
    id: 'a2',
    type: 'candidate_screened',
    title: 'Screening Complete',
    description: 'All 8 candidates processed for Senior Backend Engineer',
    timestamp: '2025-08-04T10:05:00Z',
    jobId: 'job-1',
  },
  {
    id: 'a3',
    type: 'status_changed',
    title: 'Status Updated',
    description: 'Aarav Sharma moved to Interview stage',
    timestamp: '2025-08-04T11:00:00Z',
    jobId: 'job-1',
    candidateId: 'c1',
  },
  {
    id: 'a4',
    type: 'status_changed',
    title: 'Status Updated',
    description: 'Maya Williams moved to Interview stage',
    timestamp: '2025-08-04T11:30:00Z',
    jobId: 'job-1',
    candidateId: 'c8',
  },
  {
    id: 'a5',
    type: 'job_created',
    title: 'New Job Created',
    description: 'Machine Learning Engineer job posted',
    timestamp: '2025-08-01T08:00:00Z',
    jobId: 'job-3',
  },
  {
    id: 'a6',
    type: 'status_changed',
    title: 'Candidate Rejected',
    description: 'Rohan Mehta marked as Rejected for Senior Backend Engineer',
    timestamp: '2025-08-04T12:00:00Z',
    jobId: 'job-1',
    candidateId: 'c3',
  },
  {
    id: 'a7',
    type: 'export',
    title: 'Shortlist Exported',
    description: 'PDF shortlist exported for Frontend Developer job',
    timestamp: '2025-08-03T16:00:00Z',
    jobId: 'job-2',
  },
];

// ─── Dashboard Stats ─────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  totalJobs: 5,
  totalCandidates: 321,
  avgScore: 0.48,
  pendingReview: 37,
  activeJobs: 3,
  processedToday: 15,
};

// ─── Score Distribution Data (for charts) ────────────────────
export const scoreDistributionData = [
  { range: '0.0-0.1', count: 5 },
  { range: '0.1-0.2', count: 12 },
  { range: '0.2-0.3', count: 22 },
  { range: '0.3-0.4', count: 35 },
  { range: '0.4-0.5', count: 28 },
  { range: '0.5-0.6', count: 18 },
  { range: '0.6-0.7', count: 12 },
  { range: '0.7-0.8', count: 6 },
  { range: '0.8-0.9', count: 3 },
  { range: '0.9-1.0', count: 1 },
];

// ─── Helper to get candidates for a specific job ─────────────
export function getCandidatesForJob(jobId: string): Candidate[] {
  return mockCandidates.filter(c => c.jobId === jobId);
}

export function getJobById(jobId: string): Job | undefined {
  return mockJobs.find(j => j.id === jobId);
}

export function getCandidateById(candidateId: string): Candidate | undefined {
  return mockCandidates.find(c => c.id === candidateId);
}

// ─── Skill suggestions for job creation form ─────────────────
export const allAvailableSkills = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Rust',
  'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Express.js',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'Oracle', 'DynamoDB',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions',
  'REST API', 'GraphQL', 'gRPC', 'WebSockets', 'Microservices', 'CI/CD',
  'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch', 'Computer Vision',
  'Git', 'Linux', 'Agile', 'Scrum', 'System Design', 'Data Structures and Algorithms',
  'Figma', 'UI/UX Design', 'CSS', 'HTML', 'SCSS', 'Responsive Design',
  'Cybersecurity', 'Encryption', 'OAuth2', 'JWT', 'HTTPS',
];
