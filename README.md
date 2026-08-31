# RecruitPro AI — Smart AI Resume Screening & Recruitment Platform

An intelligent recruitment platform that automates candidate screening, ranks resumes using multi-model NLP, and generates tailored interview questions — all powered by AI.

## 🚀 Features

- **AI-Powered Resume Screening** — Extracts candidate skills and matches them against job requirements using TF-IDF, semantic similarity, and NLP
- **Multi-Model Scoring** — Combines multiple scoring algorithms for composite candidate rankings
- **Automated Interview Questions** — Generates tailored technical interview questions targeting matched strengths and skill gaps
- **Candidate Comparisons** — Side-by-side candidate analysis and scoring breakdowns
- **Bulk Resume Upload** — Process multiple resumes at once for large-scale hiring
- **Export & Reporting** — Export shortlists to PDF/CSV and email to hiring managers
- **Secure Authentication** — JWT-based auth with email verification and password reset flows
- **Dashboard Analytics** — Score distribution charts, activity timelines, and candidate insights

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16.3.0** — React app framework with App Router and server-side rendering
- **React 19.2.8** — UI component library
- **TypeScript 5** — Type-safe JavaScript
- **Tailwind CSS / Global CSS** — Responsive styling and design system
- **Framer Motion** — Landing page animations
- **Lucide React** — Icon library
- **Recharts** — Dashboard charting and analytics

### Backend
- **FastAPI** — High-performance Python web framework
- **SQLAlchemy 2.0** — ORM for database operations
- **Pydantic** — Data validation and request parsing
- **JWT (PyJWT)** — Token-based authentication
- **Bcrypt** — Password hashing
- **Resend / SMTP** — Transactional email delivery

### Database
- **PostgreSQL** (production on Neon)
- **SQLite** (local development, optional)

### Deployment
- **Frontend** — Vercel
- **Backend** — Cloud server (or local)

---

## 📋 Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **npm** or **yarn**
- **PostgreSQL** (or SQLite for local dev)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-recruitment-system.git
cd ai-recruitment-system
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/recruitment_db
# Or for SQLite (local development):
# DATABASE_URL=sqlite:///./instance/recruitment.db

# JWT & Security
JWT_SECRET_KEY=your-super-secret-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Frontend
FRONTEND_URL=http://localhost:3000

# Email
RESEND_API_KEY=your-resend-api-key
# Or for SMTP:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# LLM (Optional)
GROQ_API_KEY=your-groq-api-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Initialize Database

For PostgreSQL (Neon):
```sql
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
```

For SQLite:
```bash
python src/db/database.py
```

#### Start Backend Server

```bash
python -m uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

Server runs on: `http://localhost:8000`

---

### 3. Frontend Setup

#### Install Dependencies
```bash
cd dashboard
npm install
```

#### Create Frontend `.env.local`

Create `.env.local` in the `dashboard/` folder:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

#### Start Development Server

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔐 Authentication Flow

### Sign Up
1. User registers with email and password
2. Verification email is sent
3. User clicks verification link to activate account

### Login
1. User enters credentials
2. Backend validates and returns JWT access token
3. Token stored in secure HTTP-only cookie
4. User redirected to dashboard

### Forgot Password
1. User requests password reset
2. Email with reset link is sent (token valid for 24 hours)
3. User clicks link and sets new password
4. Password is hashed and stored securely

---

## 📁 Project Structure

```
ai-recruitment-system/
├── dashboard/                  # Next.js frontend
│   ├── app/                   # App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── reset-password/    # Password reset
│   │   ├── dashboard/         # Protected routes
│   │   │   ├── jobs/          # Job management
│   │   │   ├── candidates/    # Candidate screening
│   │   │   └── settings/      # User settings
│   │   ├── pricing/           # Pricing page
│   │   ├── privacy/           # Privacy policy
│   │   ├── terms/             # Terms of service
│   │   └── globals.css        # Global styles
│   ├── src/
│   │   ├── components/        # React components
│   │   └── lib/               # Utilities & DataContext
│   ├── public/                # Static assets
│   ├── middleware.ts          # Auth middleware
│   ├── next.config.ts         # Next.js config
│   └── package.json
│
├── src/                       # Python backend
│   ├── api/
│   │   ├── main.py           # FastAPI app, middleware, routes
│   │   └── auth_routes.py    # Auth endpoints
│   ├── auth/
│   │   ├── security.py       # JWT, hashing utilities
│   │   └── dependencies.py   # Auth dependency injection
│   ├── db/
│   │   ├── database.py       # DB connection & session
│   │   └── models.py         # SQLAlchemy models (User, Job, Candidate)
│   ├── generation/
│   │   ├── pipeline.py       # Scoring pipeline
│   │   ├── questions.py      # Interview question generation
│   │   ├── summary.py        # AI summaries
│   │   ├── feedback.py       # Feedback handling
│   │   └── client.py         # LLM client (Groq)
│   ├── nlp/
│   │   └── skill_extraction.py  # NLP skill extraction
│   ├── parsing/
│   │   ├── extract.py        # PDF/DOCX parsing
│   │   ├── clean.py          # Text cleaning
│   │   └── candidate_info.py # Candidate data extraction
│   ├── scoring/
│   │   ├── similarity.py     # Semantic similarity
│   │   └── final_score.py    # Composite scoring
│   └── notifications/
│       └── email.py          # Email service
│
├── data/                      # Sample data
│   ├── job_descriptions/      # Sample JDs
│   ├── resumes/               # Sample resumes
│   ├── parsed_output/         # Extracted resume text
│   └── skills_db.json         # Skills database
│
├── tests/                     # Pytest test suite
│   ├── test_generation.py
│   ├── test_jobs.py
│   └── test_skill_extraction.py
│
├── .env                       # Environment configuration
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

---

## 🧪 Testing

### Run Backend Tests
```bash
pytest tests/ -v
```

### Run Specific Test
```bash
pytest tests/test_generation.py -v
```

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repo to Vercel dashboard
3. Set environment variables in Vercel Settings:
   - `NEXT_PUBLIC_API_BASE` = your backend API URL
4. Deploy on push

### Backend (Cloud Server)

1. SSH into server
2. Clone repo and set up virtual environment
3. Configure `.env` with production database credentials
4. Install dependencies: `pip install -r requirements.txt`
5. Run with gunicorn:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.api.main:app --bind 0.0.0.0:8000
   ```
6. Use reverse proxy (nginx) for SSL and routing

---

## 📚 API Documentation

All API endpoints are documented at `/docs` when running the backend:
```
http://localhost:8000/docs
```

### Key Endpoints

**Authentication**
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login and get JWT token
- `POST /auth/forgot-password` — Request password reset
- `POST /auth/reset-password` — Reset password with token
- `POST /auth/verify-email` — Verify email token
- `GET /auth/me` — Get current user profile

**Jobs**
- `POST /jobs/create` — Create job posting
- `GET /jobs/list` — List all jobs
- `GET /jobs/{job_id}` — Get job details

**Candidates**
- `POST /upload` — Upload and screen resumes
- `GET /candidates/{job_id}` — Get ranked candidates
- `GET /candidates/{candidate_id}` — Get candidate details

**Scoring**
- `POST /score` — Get candidate scoring breakdown
- `POST /compare` — Compare multiple candidates

---

## 🔧 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `postgresql://...` |
| `JWT_SECRET_KEY` | Secret key for JWT signing | 64+ random characters |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `JWT_EXPIRATION_HOURS` | Token expiration time | `24` |
| `FRONTEND_URL` | Frontend base URL | `http://localhost:3000` |
| `RESEND_API_KEY` | Resend email API key | `re_...` |
| `GROQ_API_KEY` | Groq LLM API key | `gsk_...` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

---

## 📖 Usage

### 1. Register & Login
- Go to `http://localhost:3000/register`
- Create account and verify email
- Login with credentials

### 2. Create a Job
- Click "Jobs" in sidebar
- Click "New Job"
- Enter job title, description, and required skills
- System automatically extracts skills from description

### 3. Upload Resumes
- Go to job details page
- Click "Bulk Upload Resumes"
- Upload PDF or DOCX files
- System scores and ranks candidates automatically

### 4. Review Candidates
- View ranked candidate list
- Click candidate to see:
  - Composite match score (TF-IDF + Semantic + Skills)
  - Score breakdown by category
  - AI-generated summary
  - Suggested interview questions

### 5. Export & Share
- Select candidates to shortlist
- Export as PDF report or CSV
- Email shortlist to hiring managers

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License — see LICENSE file for details.

---

## 📧 Support

For questions, issues, or feedback:
- Email: `recruitpro.notifications@gmail.com`
- GitHub Issues: [Create an issue](https://github.com/yourusername/ai-recruitment-system/issues)

---

## 🎯 Roadmap

- [ ] Advanced skill taxonomy customization
- [ ] Custom SSO integration
- [ ] API webhooks for external integrations
- [ ] Candidate feedback loop
- [ ] Multi-language support
- [ ] Advanced analytics & reporting dashboard
- [ ] Mobile app (iOS/Android)

---

**Built with ❤️ by the RecruitPro AI Team**
