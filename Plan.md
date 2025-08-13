# Over Unity - MVP Development Plan 📋

## Executive Summary

**Project**: Over Unity - AI-Powered Recruitment Platform MVP  
**Timeline**: 8-12 weeks to MVP launch  
**Budget**: $50K-75K initial development + $5K/month operational  
**Target**: Acquisition-ready SaaS platform for recruitment industry  

## 🎯 Core Value Proposition

1. **Transparency**: First ATS to provide detailed rejection feedback
2. **Bias-Free**: AI system designed from the ground up to eliminate discrimination
3. **Google Jobs Optimized**: Maximum job visibility through proper schema implementation
4. **Modern Experience**: Fast, mobile-first platform built for 2025

## 📊 Market Analysis Summary

### Market Size & Opportunity
- **Global ATS Market**: $3.2B by 2026 (6.7% CAGR)
- **Recruitment Software**: $2.38B in 2024 → $3.7B by 2033
- **Key Problem**: 88% of employers admit their AI rejects qualified candidates
- **Average Price**: $25-100 per user/month for SME market

### Competitive Landscape
| Company | Pricing | Weakness | Our Advantage |
|---------|---------|----------|---------------|
| Greenhouse | $6K-$24K/year | No transparency | Clear feedback system |
| BambooHR | $25/user/month | Basic AI | Advanced bias detection |
| Workable | $39/user/month | Poor Google integration | Native schema optimization |
| Zoho Recruit | $25/user/month | Limited customization | Purpose-built for modern hiring |

## 🚀 Development Phases

### Phase 1: Foundation (Weeks 1-3)
**Goal**: Core infrastructure and basic functionality

#### Week 1: Project Setup
- [ ] GitHub repository initialization
- [ ] Next.js 14 project scaffolding with TypeScript
- [ ] Supabase project setup and database design
- [ ] Vercel deployment pipeline
- [ ] TailwindCSS + TailwindUI integration
- [ ] Authentication system (Supabase Auth)

#### Week 2: Core Database Schema
```sql
-- Core tables structure
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  size_range TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  location JSONB, -- For Google Jobs schema
  employment_type TEXT,
  date_posted TIMESTAMP DEFAULT NOW(),
  valid_through TIMESTAMP,
  schema_data JSONB, -- Google Jobs structured data
  status TEXT DEFAULT 'active'
);

CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  resume_url TEXT,
  profile_data JSONB,
  skills TEXT[],
  experience_years INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  candidate_id UUID REFERENCES candidates(id),
  status TEXT DEFAULT 'submitted',
  ai_score DECIMAL(3,2),
  feedback_data JSONB,
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Week 3: Basic UI Components
- [ ] Landing page with value proposition
- [ ] Authentication pages (login/signup)
- [ ] Dashboard layouts for employers/candidates
- [ ] Job posting form with Google Jobs schema generation
- [ ] Basic job listing display

### Phase 2: Core Features (Weeks 4-6)

#### Week 4: Job Management System
- [ ] Job posting CRUD operations
- [ ] Google Jobs schema generation and validation
- [ ] Job board integration (Indeed, LinkedIn APIs)
- [ ] Search and filtering functionality
- [ ] SEO optimization for job pages

#### Week 5: Application Tracking
- [ ] Candidate application flow
- [ ] Resume upload and parsing
- [ ] Application status tracking
- [ ] Basic candidate filtering and search
- [ ] Email notification system

#### Week 6: AI Integration Foundation
- [ ] Anthropic Claude API integration
- [ ] Bias detection algorithms (initial version)
- [ ] Basic candidate feedback generation
- [ ] Resume analysis and scoring
- [ ] Job-candidate matching algorithms

### Phase 3: AI & Analytics (Weeks 7-8)

#### Week 7: Advanced AI Features
- [ ] Sophisticated bias detection engine
- [ ] Transparent feedback generation system
- [ ] Job description optimization suggestions
- [ ] Candidate improvement recommendations
- [ ] Interview question generation

#### Week 8: Analytics & Compliance
- [ ] Hiring analytics dashboard
- [ ] Diversity metrics tracking
- [ ] Compliance reporting (NYC Local Law 144)
- [ ] Performance monitoring
- [ ] A/B testing framework

### Phase 4: Polish & Launch (Weeks 9-12)

#### Week 9-10: User Experience
- [ ] Mobile responsiveness optimization
- [ ] Performance improvements
- [ ] Advanced search and filtering
- [ ] Bulk operations and workflows
- [ ] Integration testing

#### Week 11: Pre-Launch Preparation
- [ ] Security audit and penetration testing
- [ ] Load testing and optimization
- [ ] Documentation completion
- [ ] Beta user onboarding
- [ ] Feedback collection and iteration

#### Week 12: MVP Launch
- [ ] Production deployment
- [ ] Launch marketing campaign
- [ ] Product Hunt submission
- [ ] Press release distribution
- [ ] Initial customer acquisition

## 🛠 Technical Architecture

### Frontend Stack
```typescript
// Next.js 14 with App Router
├── app/
│   ├── (auth)/           // Authentication routes
│   ├── (dashboard)/      // Protected dashboard
│   ├── jobs/             // Public job listings
│   └── api/              // API routes
├── components/           // Reusable UI components
│   ├── ui/               // TailwindUI components
│   ├── forms/            // Form components
│   └── charts/           // Analytics components
└── lib/                  // Utilities and helpers
```

### Backend Infrastructure
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with JWT tokens
- **File Storage**: Supabase Storage for resumes/documents
- **Email**: Resend for transactional emails
- **AI Processing**: Anthropic Claude API
- **Deployment**: Vercel with automatic deployments

### Key Integrations
1. **Google Jobs API**: For job posting visibility
2. **LinkedIn Talent Solutions**: Professional network integration
3. **Indeed API**: Job board posting automation
4. **Stripe**: Payment processing for subscriptions
5. **Mixpanel**: User analytics and behavior tracking

## 💰 Pricing Strategy

### Freemium Model
**Free Tier** (0-5 jobs/month):
- Basic job posting
- Standard candidate management
- Limited AI features

**Professional** ($99/month):
- Unlimited job postings
- Advanced AI matching
- Bias detection and reporting
- Google Jobs optimization
- Email support

**Enterprise** ($299/month):
- Custom integrations
- Advanced analytics
- Compliance reporting
- Priority support
- Custom branding

### Revenue Projections
- **Year 1**: $250K ARR (100 customers avg $2.5K)
- **Year 2**: $1.2M ARR (400 customers avg $3K)
- **Year 3**: $3.5M ARR (1000 customers avg $3.5K)

## 🎯 Go-to-Market Strategy

### Phase 1: Beta Launch (Months 1-2)
- Target 50 beta customers
- Focus on SME companies (50-500 employees)
- Geographic focus: UK, then EU/US expansion
- Channel: Direct sales + content marketing

### Phase 2: Growth (Months 3-6)
- Scale to 200+ customers
- Partner with HR consultancies
- SEO-driven content strategy
- Webinar and demo campaigns

### Phase 3: Scale (Months 7-12)
- Enterprise customer acquisition
- Channel partnerships
- International expansion
- Acquisition conversations

### Marketing Channels
1. **Content Marketing**: Blog about AI recruitment bias
2. **SEO**: Target "ATS software", "recruitment platform" keywords
3. **LinkedIn**: B2B social selling and thought leadership
4. **Webinars**: Educational content about compliant hiring
5. **Partnerships**: HR software integrations

## 🔍 Risk Analysis & Mitigation

### Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI bias in algorithms | High | Medium | Extensive testing + human oversight |
| Scalability issues | Medium | Low | Cloud-native architecture |
| Data privacy compliance | High | Low | Privacy by design + legal review |
| Google Jobs API changes | Medium | Medium | Multiple job board integrations |

### Business Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Slow customer acquisition | High | Medium | Strong go-to-market strategy |
| Competitive response | Medium | High | Focus on unique value props |
| Regulatory changes | Medium | Medium | Proactive compliance monitoring |
| Economic downturn | High | Low | Diversified customer base |

## 📈 Success Metrics

### Technical KPIs
- **Page Load Speed**: <2 seconds
- **Uptime**: >99.9%
- **API Response Time**: <500ms
- **Mobile Performance**: >90 Lighthouse score

### Business KPIs
- **Customer Acquisition Cost**: <$500
- **Monthly Recurring Revenue**: $50K by month 12
- **Customer Churn**: <5% monthly
- **Net Promoter Score**: >50

### Product KPIs
- **Candidate Satisfaction**: >4.5/5 (feedback quality)
- **Bias Reduction**: <5% false negative rate
- **Time-to-Hire**: 25% improvement for customers
- **Job Visibility**: 80% of jobs appearing in Google Jobs

## 🤝 Team & Resources

### Core Team Requirements
- **Technical Lead**: Full-stack developer (Next.js/TypeScript)
- **AI/ML Engineer**: Python/ML experience for bias detection
- **Product Designer**: UI/UX focused on recruitment workflows
- **Marketing**: B2B SaaS marketing experience

### External Resources
- **Legal**: Employment law and AI compliance expert
- **Advisory**: Former ATS company executives
- **Development**: Additional contractors for sprint support

## 🎁 Funding Strategy

### Bootstrap Phase (Months 1-6)
- **Personal Investment**: £50K
- **Revenue**: Aim for break-even by month 6
- **Focus**: Product-market fit and initial traction

### Seed Funding (Months 6-12)
- **Target**: £500K-£1M seed round
- **Use**: Team expansion and customer acquisition
- **Investors**: B2B SaaS specialists, HR tech angels

### Series A (Year 2)
- **Target**: £3M-£5M
- **Use**: International expansion and enterprise features
- **Investors**: Tier 1 VCs with HR tech portfolio

## 🛣 Post-MVP Roadmap

### Q4 2025: Growth Features
- Video interview integration
- Advanced analytics suite
- Mobile applications
- API marketplace

### Q1 2026: Enterprise Features
- Single Sign-On (SSO)
- Advanced integrations
- Custom reporting
- Multi-language support

### Q2 2026: Acquisition Preparation
- Financial audit and due diligence prep
- Intellectual property portfolio
- Customer reference program
- Scalability demonstration

**Target Exit**: 24-36 months, $50M-$100M valuation to strategic buyer (Workday, SAP, Oracle, or recruitment-focused PE firm)
