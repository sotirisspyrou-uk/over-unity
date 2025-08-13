// ==========================================
// 4. CANDIDATE FEEDBACK GENERATOR
// lib/ai/feedback-generator.ts

interface CandidateProfile {
  name: string;
  email: string;
  experience: number;
  skills: string[];
  education: string;
  resumeText: string;
}

interface JobRequirements {
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequired: number;
  educationRequired?: string;
  industry: string;
}

interface FeedbackResult {
  message: string;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  encouragement: string;
  nextSteps: string[];
}

export class FeedbackGenerator {
  async generateFeedback(
    candidate: CandidateProfile,
    job: JobRequirements,
    rejectionReason: string
  ): Promise<FeedbackResult> {
    const strengths = this.identifyStrengths(candidate, job);
    const gaps = this.identifyGaps(candidate, job);
    const suggestions = this.generateSuggestions(gaps, job);

    return {
      message: this.createPersonalizedMessage(candidate, job),
      strengths,
      improvements: gaps,
      suggestions,
      encouragement: this.createEncouragement(candidate),
      nextSteps: this.generateNextSteps(gaps, job)
    };
  }

  private identifyStrengths(candidate: CandidateProfile, job: JobRequirements): string[] {
    const strengths: string[] = [];

    // Check skill matches
    const matchingSkills = candidate.skills.filter(skill => 
      job.requiredSkills.some(required => 
        required.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(required.toLowerCase())
      )
    );

    if (matchingSkills.length > 0) {
      strengths.push(`Strong background in ${matchingSkills.join(', ')}`);
    }

    // Check experience level
    if (candidate.experience >= job.experienceRequired * 0.8) {
      strengths.push(`Relevant professional experience (${candidate.experience} years)`);
    }

    // Check education
    if (job.educationRequired && candidate.education.toLowerCase().includes(job.educationRequired.toLowerCase())) {
      strengths.push(`Educational background aligns with requirements`);
    }

    // Default strength if none found
    if (strengths.length === 0) {
      strengths.push('Clear interest in the role and industry');
    }

    return strengths;
  }

  private identifyGaps(candidate: CandidateProfile, job: JobRequirements): string[] {
    const gaps: string[] = [];

    // Check missing skills
    const missingSkills = job.requiredSkills.filter(required => 
      !candidate.skills.some(skill => 
        skill.toLowerCase().includes(required.toLowerCase()) ||
        required.toLowerCase().includes(skill.toLowerCase())
      )
    );

    if (missingSkills.length > 0) {
      gaps.push(`Additional experience needed in: ${missingSkills.join(', ')}`);
    }

    // Check experience gap
    if (candidate.experience < job.experienceRequired) {
      const experienceGap = job.experienceRequired - candidate.experience;
      gaps.push(`Role requires ${experienceGap} more years of relevant experience`);
    }

    return gaps;
  }

  private generateSuggestions(gaps: string[], job: JobRequirements): string[] {
    const suggestions: string[] = [];

    if (gaps.some(gap => gap.includes('experience needed'))) {
      suggestions.push('Consider taking online courses or certifications in the required technologies');
      suggestions.push('Build portfolio projects that demonstrate these skills');
      suggestions.push('Look for volunteer or freelance opportunities to gain experience');
    }

    if (gaps.some(gap => gap.includes('more years'))) {
      suggestions.push('Apply for roles with lower experience requirements to build your background');
      suggestions.push('Highlight transferable skills from other industries or roles');
      suggestions.push('Consider internship or mentorship opportunities in this field');
    }

    suggestions.push('Keep your LinkedIn profile and resume updated with recent accomplishments');
    suggestions.push(`Set up job alerts for similar ${job.industry} positions`);

    return suggestions;
  }

  private createPersonalizedMessage(candidate: CandidateProfile, job: JobRequirements): string {
    return `Dear ${candidate.name},

Thank you for your interest in the ${job.title} position. We appreciate the time and effort you put into your application and the opportunity to learn about your background.

After careful consideration, we have decided to move forward with candidates whose experience more closely aligns with our current requirements. This decision was not easy, as we received many qualified applications.`;
  }

  private createEncouragement(candidate: CandidateProfile): string {
    return `We encourage you to continue developing your skills and applying for opportunities that match your growing expertise. Your background shows promise, and we believe you'll find the right fit with continued effort and development.

Please don't hesitate to apply for future positions with us that better align with your evolving skillset. We wish you the best of luck in your career journey.`;
  }

  private generateNextSteps(gaps: string[], job: JobRequirements): string[] {
    const nextSteps: string[] = [];

    if (gaps.length > 0) {
      nextSteps.push('Focus on developing the specific skills mentioned in the improvement areas');
      nextSteps.push('Update your resume to better highlight relevant experience');
      nextSteps.push('Consider informational interviews with professionals in this field');
    }

    nextSteps.push('Follow our company page for future opportunities');
    nextSteps.push('Continue building your professional network in the industry');

    return nextSteps;
  }
}
