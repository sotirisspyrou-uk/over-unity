# Over Unity 🚀
## AI-Powered Recruitment Platform - MVP v1.0


**"We Don't Promise Engagement, We Deliver Perfect Matches"**

Over Unity is a next-generation AI-powered recruitment platform that prioritizes quality matches over application volume, providing complete transparency to candidates about hiring decisions and helping them improve for future opportunities.

## 🎯 Mission Statement

To match the right employer, the right job, and the right employee as quickly and painlessly as possible while providing **CLEAR TRANSPARENCY** to every applicant about why they didn't advance, so both they and the AI can refine and improve the application process next time.

## 🌟 Key Features

### For Employers
- **Smart Job Posting**: AI-optimized job descriptions with Google Jobs schema
- **Bias-Free Screening**: Advanced AI that eliminates discriminatory patterns
- **Quality Candidates**: Pre-qualified applicants, not spam
- **Real-time Analytics**: Comprehensive hiring insights and diversity metrics
- **ATS Integration**: Full applicant tracking system with modern UI

### For Candidates  
- **Transparent Feedback**: Clear explanations for rejections with improvement suggestions
- **AI-Powered Matching**: Get matched to jobs that fit your actual skills
- **Resume Optimization**: AI suggestions for ATS-friendly resumes
- **Learning Paths**: Personalized skill development recommendations
- **Fair Treatment**: Bias-aware AI ensures equal opportunity

### For Recruiters
- **Intelligent Sourcing**: AI-powered candidate discovery
- **Automated Workflows**: Streamlined communication and scheduling
- **Compliance Built-in**: NYC Local Law 144 and EU AI Act compliant
- **Mobile-First Design**: Recruit on the go with responsive interface

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API Routes + Supabase Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + TailwindUI components
- **AI/ML**: Anthropic Claude API for content generation and analysis
- **Deployment**: Vercel (Frontend) + Supabase (Backend)
- **Storage**: Supabase Storage for resumes/documents
- **Email**: Resend for transactional emails
- **Analytics**: Mixpanel for user behavior tracking

## 📋 Market Opportunity

**Market Size**: $3.2B by 2026 (6.7% CAGR)
**Target Market**: SME-Enterprise recruitment ($25-50K ARR per customer)
**Key Problem**: 88% of employers admit their ATS rejects qualified candidates

### Competitive Advantages
1. **Transparency-First Approach**: Only platform providing detailed rejection feedback
2. **Built-in Bias Detection**: Compliance-ready from day one
3. **Google Jobs Optimized**: Native schema markup for maximum visibility
4. **Modern Architecture**: Fast, scalable, mobile-first design
5. **Acquisition-Ready**: Built with enterprise buyers in mind

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/sotirisspyrou-uk/over-unity.git
cd over-unity

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and Anthropic API keys

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
over-unity/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard layouts
│   ├── jobs/              # Job listing pages
│   ├── candidates/        # Candidate management
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── supabase/             # Database schema & migrations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_api_key

# Email
RESEND_API_KEY=your_resend_api_key

# Analytics
MIXPANEL_TOKEN=your_mixpanel_token

# Domain
NEXT_PUBLIC_APP_URL=https://overunity.ai
```

## 🗄 Database Schema

### Core Tables
- `companies` - Employer profiles and settings
- `jobs` - Job postings with Google Jobs schema
- `candidates` - Candidate profiles and resumes
- `applications` - Application tracking and status
- `feedback` - AI-generated feedback for candidates
- `audit_logs` - Compliance and bias detection logs

## 🔗 API Documentation

### Authentication
All API endpoints require authentication via Supabase Auth JWT tokens.

### Key Endpoints
- `POST /api/jobs` - Create job posting
- `GET /api/jobs/[id]` - Get job details with schema
- `POST /api/applications` - Submit application
- `GET /api/feedback/[id]` - Get candidate feedback
- `POST /api/ai/analyze` - Run bias analysis

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📈 Deployment

### Vercel Deployment
1. Connect your GitHub repo to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Supabase Setup
1. Create new Supabase project
2. Run migrations: `npm run db:migrate`
3. Configure Row Level Security policies

## 📊 Analytics & Monitoring

- **User Analytics**: Mixpanel for behavior tracking
- **Performance**: Vercel Analytics
- **Error Tracking**: Vercel monitoring
- **Database**: Supabase dashboard

## 🔒 Security & Compliance

- **Data Privacy**: GDPR/CCPA compliant by design
- **AI Compliance**: NYC Local Law 144 ready
- **Authentication**: Supabase Auth with RLS
- **API Security**: Rate limiting and input validation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🎯 Roadmap

### Phase 1 - MVP (Q3 2025)
- [x] Core ATS functionality
- [x] AI-powered feedback system
- [x] Google Jobs integration
- [x] Basic analytics dashboard

### Phase 2 - Growth (Q4 2025)
- [ ] Advanced AI matching algorithms
- [ ] Video interview integration
- [ ] Mobile app development
- [ ] Enterprise SSO

### Phase 3 - Scale (Q1 2026)
- [ ] Multi-language support
- [ ] Advanced analytics suite
- [ ] API marketplace
- [ ] Acquisition preparation

## 🔗 Links

- **Live Demo**: https://overunity.ai
- **Documentation**: https://docs.overunity.ai
- **Support**: support@overunity.ai
- **Blog**: https://overunity.ai/blog

## 📞 Contact

**Sotiris Spyrou**
- Email: sotiris@overunity.ai
- LinkedIn: [linkedin.com/in/sotirisspyrou](https://linkedin.com/in/sotirisspyrou)
- GitHub: [@sotirisspyrou-uk](https://github.com/sotirisspyrou-uk)

---

**Built with ❤️ for a more transparent and fair recruitment process**
