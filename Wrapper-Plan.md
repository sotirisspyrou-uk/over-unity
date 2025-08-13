# AI System Prompt Wrapper - Implementation Plan 🎯

## Overview

This document outlines the proposed approach to creating a robust wrapper system for Over Unity's AI prompts, ensuring consistent, reliable, and compliant AI interactions across the entire recruitment platform.

## Architecture Design

### 1. Core Wrapper System

```typescript
// lib/ai/wrapper.ts
interface AIServiceConfig {
  service: 'job_analyzer' | 'feedback_generator' | 'resume_analyzer' | 'bias_detector' | 'interview_generator' | 'analytics_generator';
  model: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt: string;
  fallbackStrategy: 'template' | 'simple' | 'error';
}

class AIServiceWrapper {
  private config: AIServiceConfig;
  private retryAttempts: number = 3;
  private rateLimiter: RateLimiter;
  
  constructor(config: AIServiceConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter(config.service);
  }

  async execute<T>(
    userInput: any,
    options?: {
      userId?: string;
      context?: Record<string, any>;
      priority?: 'low' | 'medium' | 'high';
    }
  ): Promise<AIResponse<T>> {
    const startTime = Date.now();
    
    try {
      // Rate limiting check
      await this.rateLimiter.checkLimit(options?.userId);
      
      // Input validation and sanitization
      const sanitizedInput = await this.validateAndSanitize(userInput);
      
      // Bias pre-check for sensitive operations
      if (this.requiresBiasCheck()) {
        await this.performBiasPreCheck(sanitizedInput);
      }
      
      // Execute AI request with retry logic
      const response = await this.executeWithRetry(sanitizedInput, options);
      
      // Post-process and validate response
      const validatedResponse = await this.validateResponse(response);
      
      // Log successful operation
      await this.logOperation({
        service: this.config.service,
        success: true,
        duration: Date.now() - startTime,
        userId: options?.userId,
        inputHash: this.hashInput(sanitizedInput)
      });
      
      return validatedResponse;
      
    } catch (error) {
      // Error handling with fallback strategies
      return await this.handleError(error, userInput, options, startTime);
    }
  }
}
```

### 2. Service-Specific Implementations

```typescript
// lib/ai/services/JobAnalyzerService.ts
export class JobAnalyzerService extends AIServiceWrapper {
  constructor() {
    super({
      service: 'job_analyzer',
      model: 'claude-sonnet-4-20250514',
      maxTokens: 2000,
      temperature: 0.3,
      systemPrompt: JOB_ANALYZER_PROMPT,
      fallbackStrategy: 'template'
    });
  }

  async analyzeJobDescription(jobData: JobDescriptionInput): Promise<JobAnalysisResult> {
    const result = await this.execute<JobAnalysisResult>(jobData, {
      priority: 'high',
      context: { type: 'job_analysis' }
    });

    // Additional job-specific validation
    if (result.bias_score > 80) {
      await this.triggerBiasAlert(jobData, result);
    }

    return result;
  }

  async optimizeForGoogleJobs(jobData: JobDescriptionInput): Promise<GoogleJobsSchema> {
    const analysis = await this.analyzeJobDescription(jobData);
    
    return {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": analysis.optimized_title,
      "description": analysis.optimized_description,
      "datePosted": new Date().toISOString(),
      "validThrough": jobData.validThrough,
      "hiringOrganization": {
        "@type": "Organization",
        "name": jobData.companyName,
        "sameAs": jobData.companyWebsite
      },
      "jobLocation": this.formatLocation(jobData.location),
      "baseSalary": this.formatSalary(jobData.salary),
      "employmentType": jobData.employmentType,
      ...analysis.schema_improvements
    };
  }
}
```

### 3. Prompt Management System

```typescript
// lib/ai/prompts/PromptManager.ts
interface PromptTemplate {
  id: string;
  version: string;
  service: string;
  template: string;
  variables: string[];
  createdAt: Date;
  isActive: boolean;
  complianceChecked: boolean;
}

class PromptManager {
  private prompts: Map<string, PromptTemplate> = new Map();
  
  async loadPrompt(service: string, version?: string): Promise<string> {
    const promptKey = `${service}_${version || 'latest'}`;
    
    if (!this.prompts.has(promptKey)) {
      await this.loadFromDatabase(service, version);
    }
    
    return this.prompts.get(promptKey)?.template || '';
  }

  async updatePrompt(service: string, newTemplate: string): Promise<void> {
    // Validate prompt for compliance
    const complianceCheck = await this.validateCompliance(newTemplate);
    if (!complianceCheck.passed) {
      throw new Error(`Prompt failed compliance: ${complianceCheck.issues.join(', ')}`);
    }

    // Version the current prompt
    await this.versionCurrentPrompt(service);
    
    // Store new prompt
    const promptTemplate: PromptTemplate = {
      id: generateId(),
      version: generateVersion(),
      service,
      template: newTemplate,
      variables: this.extractVariables(newTemplate),
      createdAt: new Date(),
      isActive: true,
      complianceChecked: true
    };

    await this.saveToDatabase(promptTemplate);
    this.prompts.set(`${service}_latest`, promptTemplate);
  }

  private async validateCompliance(template: string): Promise<ComplianceResult> {
    // Check for prohibited content
    const prohibitedPatterns = [
      /age|young|old/gi,
      /male|female|gender/gi,
      /family|children|marriage/gi,
      /religion|beliefs/gi,
      /disability|handicap/gi
    ];

    const issues: string[] = [];
    prohibitedPatterns.forEach((pattern, index) => {
      if (pattern.test(template)) {
        issues.push(`Potential bias pattern detected: ${pattern.source}`);
      }
    });

    return {
      passed: issues.length === 0,
      issues
    };
  }
}
```

### 4. Error Handling & Fallback System

```typescript
// lib/ai/fallback/FallbackStrategy.ts
abstract class FallbackStrategy {
  abstract execute(originalInput: any, error: Error): Promise<any>;
}

class TemplateFallbackStrategy extends FallbackStrategy {
  private templates: Map<string, (input: any) => any> = new Map();

  constructor() {
    super();
    this.initializeTemplates();
  }

  async execute(originalInput: any, error: Error): Promise<any> {
    const templateKey = this.determineTemplate(originalInput);
    const template = this.templates.get(templateKey);
    
    if (!template) {
      throw new Error('No fallback template available');
    }

    return template(originalInput);
  }

  private initializeTemplates(): void {
    // Candidate feedback template
    this.templates.set('candidate_feedback', (input) => ({
      message: `Thank you for your interest in the ${input.jobTitle} position. 
                After careful review, we've decided to move forward with other candidates 
                whose experience more closely matches our current needs. We encourage you 
                to apply for future opportunities that align with your background.`,
      improvements: [
        'Continue building relevant experience in this field',
        'Consider additional training or certifications',
        'Keep your resume updated with recent accomplishments'
      ],
      encouragement: 'We appreciate your interest and wish you success in your job search.'
    }));

    // Job analysis template
    this.templates.set('job_analysis', (input) => ({
      bias_score: 20, // Conservative low score
      detected_issues: [],
      google_jobs_optimization: {
        title_suggestions: [input.title],
        schema_improvements: {},
        seo_keywords: []
      },
      inclusivity_score: 80
    }));
  }
}
```

### 5. Rate Limiting & Cost Management

```typescript
// lib/ai/rateLimiting/RateLimiter.ts
interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  tokensPerDay: number;
}

class RateLimiter {
  private limits: Map<string, RateLimit> = new Map();
  private usage: Map<string, UsageTracker> = new Map();

  constructor() {
    this.initializeLimits();
  }

  async checkLimit(userId?: string, service?: string): Promise<boolean> {
    const key = `${userId || 'anonymous'}_${service || 'default'}`;
    const limit = this.limits.get(service || 'default');
    const usage = this.usage.get(key) || new UsageTracker();

    // Check various rate limits
    if (usage.requestsInLastMinute() >= limit.requestsPerMinute) {
      throw new RateLimitError('Minute limit exceeded');
    }

    if (usage.requestsInLastHour() >= limit.requestsPerHour) {
      throw new RateLimitError('Hour limit exceeded');
    }

    if (usage.requestsInLastDay() >= limit.requestsPerDay) {
      throw new RateLimitError('Daily limit exceeded');
    }

    // Track this request
    usage.recordRequest();
    this.usage.set(key, usage);

    return true;
  }

  private initializeLimits(): void {
    // Free tier limits
    this.limits.set('free', {
      requestsPerMinute: 10,
      requestsPerHour: 100,
      requestsPerDay: 500,
      tokensPerDay: 50000
    });

    // Professional tier limits
    this.limits.set('pro', {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 5000,
      tokensPerDay: 500000
    });

    // Enterprise tier limits
    this.limits.set('enterprise', {
      requestsPerMinute: 300,
      requestsPerHour: 5000,
      requestsPerDay: 25000,
      tokensPerDay: 2500000
    });
  }
}
```

### 6. Monitoring & Analytics

```typescript
// lib/ai/monitoring/AIMonitoring.ts
interface AIMetrics {
  service: string;
  responseTime: number;
  tokensUsed: number;
  success: boolean;
  errorType?: string;
  userId?: string;
  timestamp: Date;
}

class AIMonitoring {
  private metrics: AIMetrics[] = [];

  async logMetric(metric: AIMetrics): Promise<void> {
    this.metrics.push(metric);
    
    // Real-time alerts for issues
    if (!metric.success) {
      await this.handleError(metric);
    }

    if (metric.responseTime > 10000) { // 10 seconds
      await this.handleSlowResponse(metric);
    }

    // Batch send to analytics service
    if (this.metrics.length >= 100) {
      await this.flushMetrics();
    }
  }

  async generateDailyReport(): Promise<AIUsageReport> {
    const today = new Date();
    const todayMetrics = this.metrics.filter(m => 
      m.timestamp.toDateString() === today.toDateString()
    );

    return {
      totalRequests: todayMetrics.length,
      successRate: this.calculateSuccessRate(todayMetrics),
      averageResponseTime: this.calculateAverageResponseTime(todayMetrics),
      totalTokensUsed: todayMetrics.reduce((sum, m) => sum + m.tokensUsed, 0),
      serviceBreakdown: this.groupByService(todayMetrics),
      errorBreakdown: this.groupByError(todayMetrics.filter(m => !m.success))
    };
  }

  private async handleError(metric: AIMetrics): Promise<void> {
    // Log to error tracking service
    console.error(`AI Service Error: ${metric.service} - ${metric.errorType}`);
    
    // Alert if error rate too high
    const recentErrors = this.metrics
      .filter(m => m.timestamp > new Date(Date.now() - 300000)) // Last 5 minutes
      .filter(m => !m.success);

    if (recentErrors.length > 10) {
      await this.sendAlert('High error rate detected in AI services');
    }
  }
}
```

## Implementation Phases

### Phase 1: Core Wrapper Infrastructure (Week 1)
```typescript
// Deliverables:
- [ ] Base AIServiceWrapper class
- [ ] Error handling and retry logic
- [ ] Basic rate limiting
- [ ] Prompt management system
- [ ] Unit tests for core functionality
```

### Phase 2: Service-Specific Wrappers (Week 2)
```typescript
// Deliverables:
- [ ] JobAnalyzerService implementation
- [ ] FeedbackGeneratorService implementation
- [ ] ResumeAnalyzerService implementation
- [ ] BiasDetectorService implementation
- [ ] Integration tests
```

### Phase 3: Advanced Features (Week 3)
```typescript
// Deliverables:
- [ ] Fallback strategies implementation
- [ ] Advanced monitoring and analytics
- [ ] Cost optimization features
- [ ] A/B testing framework for prompts
- [ ] Performance optimization
```

### Phase 4: Production Readiness (Week 4)
```typescript
// Deliverables:
- [ ] Load testing and optimization
- [ ] Security audit and hardening
- [ ] Documentation completion
- [ ] Deployment automation
- [ ] Monitoring dashboard
```

## Configuration Management

### Environment-Specific Settings
```typescript
// config/ai.config.ts
export const AIConfig = {
  development: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY_DEV,
    model: 'claude-sonnet-4-20250514',
    rateLimits: 'relaxed',
    fallbackStrategy: 'template',
    logging: 'verbose'
  },
  staging: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY_STAGING,
    model: 'claude-sonnet-4-20250514',
    rateLimits: 'moderate',
    fallbackStrategy: 'template',
    logging: 'standard'
  },
  production: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY_PROD,
    model: 'claude-sonnet-4-20250514',
    rateLimits: 'strict',
    fallbackStrategy: 'graceful',
    logging: 'minimal'
  }
};
```

### Feature Flags
```typescript
// lib/ai/featureFlags.ts
export const AIFeatureFlags = {
  enableBiasDetection: true,
  enableAdvancedAnalytics: true,
  enableA11yCompliance: true,
  enableRealTimeMonitoring: true,
  enableCostOptimization: true,
  enableFallbackStrategies: true
};
```

## Security Considerations

### Input Sanitization
```typescript
class InputSanitizer {
  static sanitize(input: any): any {
    // Remove potentially malicious content
    if (typeof input === 'string') {
      return input
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (typeof input === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitize(value);
      }
      return sanitized;
    }
    
    return input;
  }
}
```

### Data Privacy
```typescript
class PrivacyManager {
  static redactPII(text: string): string {
    return text
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
      .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE_REDACTED]');
  }

  static anonymizeForTraining(data: any): any {
    // Remove or hash personally identifiable information
    // for AI model training purposes
    return {
      ...data,
      name: 'ANONYMOUS',
      email: 'ANONYMOUS',
      phone: 'ANONYMOUS',
      address: 'ANONYMOUS'
    };
  }
}
```

## Testing Strategy

### Unit Tests
```typescript
// __tests__/ai/wrapper.test.ts
describe('AIServiceWrapper', () => {
  it('should execute AI request successfully', async () => {
    const wrapper = new AIServiceWrapper(mockConfig);
    const result = await wrapper.execute({ test: 'input' });
    expect(result.success).toBe(true);
  });

  it('should handle rate limiting correctly', async () => {
    const wrapper = new AIServiceWrapper(mockConfig);
    // ... rate limiting test
  });

  it('should fallback gracefully on error', async () => {
    const wrapper = new AIServiceWrapper(mockConfig);
    // ... fallback test
  });
});
```

### Integration Tests
```typescript
// __tests__/ai/services.integration.test.ts
describe('AI Services Integration', () => {
  it('should analyze job description and detect bias', async () => {
    const service = new JobAnalyzerService();
    const result = await service.analyzeJobDescription(mockJobData);
    expect(result.bias_score).toBeGreaterThanOrEqual(0);
    expect(result.bias_score).toBeLessThanOrEqual(100);
  });
});
```

## Deployment & Monitoring

### Docker Configuration
```dockerfile
# AI Service Container
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Monitoring Setup
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'ai-services'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s
```

This comprehensive wrapper system ensures reliable, compliant, and scalable AI integration throughout the Over Unity platform while maintaining high performance and excellent user experience.
