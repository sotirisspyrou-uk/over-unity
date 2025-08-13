// ==========================================
// 6. MONITORING AND ANALYTICS SCRIPT
// lib/monitoring/analytics.ts

interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  userId?: string;
  timestamp: Date;
}

export class AnalyticsManager {
  private mixpanelToken: string;
  private environment: string;

  constructor(mixpanelToken: string, environment: string) {
    this.mixpanelToken = mixpanelToken;
    this.environment = environment;
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (this.environment === 'development') {
      console.log('📊 Analytics Event:', event);
      return;
    }

    try {
      await fetch('https://api.mixpanel.com/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: event.name,
          properties: {
            token: this.mixpanelToken,
            ...event.properties,
            timestamp: event.timestamp.toISOString(),
            environment: this.environment
          }
        })
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }

  // Predefined event tracking methods
  async trackJobPosted(jobId: string, companyId: string): Promise<void> {
    await this.trackEvent({
      name: 'Job Posted',
      properties: {
        job_id: jobId,
        company_id: companyId
      },
      timestamp: new Date()
    });
  }

  async trackApplicationSubmitted(applicationId: string, jobId: string, candidateId: string): Promise<void> {
    await this.trackEvent({
      name: 'Application Submitted',
      properties: {
        application_id: applicationId,
        job_id: jobId,
        candidate_id: candidateId
      },
      timestamp: new Date()
    });
  }

  async trackFeedbackGenerated(candidateId: string, jobId: string, feedbackQuality: number): Promise<void> {
    await this.trackEvent({
      name: 'Feedback Generated',
      properties: {
        candidate_id: candidateId,
        job_id: jobId,
        feedback_quality: feedbackQuality
      },
      timestamp: new Date()
    });
  }

  async trackBiasDetected(jobId: string, biasScore: number, biasTypes: string[]): Promise<void> {
    await this.trackEvent({
      name: 'Bias Detected',
      properties: {
        job_id: jobId,
        bias_score: biasScore,
        bias_types: biasTypes
      },
      timestamp: new Date()
    });
  }
}
