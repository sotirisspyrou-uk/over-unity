// ==========================================
// 3. AI BIAS DETECTION UTILITIES
// lib/ai/bias-detection.ts

interface BiasCheckResult {
  score: number; // 0-100, higher means more biased
  issues: BiasIssue[];
  suggestions: string[];
  compliant: boolean;
}

interface BiasIssue {
  type: 'gender' | 'age' | 'race' | 'disability' | 'socioeconomic' | 'education';
  text: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class BiasDetector {
  private genderBiasPatterns = [
    /\b(guys?|dudes?|bros?|ninjas?|rockstars?|gurus?)\b/gi,
    /\b(aggressive|competitive|dominant)\b/gi,
    /\b(nurturing|supportive|collaborative)\b/gi
  ];

  private ageBiasPatterns = [
    /\b(young|youthful|energetic|fresh|recent graduate)\b/gi,
    /\b(digital native|millennial|gen z)\b/gi,
    /\b(experienced|mature|seasoned|senior)\b/gi
  ];

  private educationBiasPatterns = [
    /\b(ivy league|prestigious university|top tier)\b/gi,
    /\b(must have degree|degree required|bachelor's required)\b/gi
  ];

  private socioeconomicBiasPatterns = [
    /\b(unpaid|volunteer|passion project|side hustle)\b/gi,
    /\b(own transportation|reliable car|must have vehicle)\b/gi
  ];

  async checkJobDescription(description: string): Promise<BiasCheckResult> {
    const issues: BiasIssue[] = [];
    let totalScore = 0;

    // Check for gender bias
    this.genderBiasPatterns.forEach(pattern => {
      const matches = description.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            type: 'gender',
            text: match,
            suggestion: this.getGenderNeutralAlternative(match),
            severity: 'medium'
          });
          totalScore += 15;
        });
      }
    });

    // Check for age bias
    this.ageBiasPatterns.forEach(pattern => {
      const matches = description.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            type: 'age',
            text: match,
            suggestion: this.getAgeNeutralAlternative(match),
            severity: 'high'
          });
          totalScore += 25;
        });
      }
    });

    // Check for education bias
    this.educationBiasPatterns.forEach(pattern => {
      const matches = description.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            type: 'education',
            text: match,
            suggestion: 'Consider "relevant experience or equivalent education"',
            severity: 'medium'
          });
          totalScore += 20;
        });
      }
    });

    // Check for socioeconomic bias
    this.socioeconomicBiasPatterns.forEach(pattern => {
      const matches = description.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            type: 'socioeconomic',
            text: match,
            suggestion: 'Remove barriers that may exclude qualified candidates',
            severity: 'high'
          });
          totalScore += 30;
        });
      }
    });

    const finalScore = Math.min(totalScore, 100);
    
    return {
      score: finalScore,
      issues,
      suggestions: this.generateSuggestions(issues),
      compliant: finalScore < 30
    };
  }

  private getGenderNeutralAlternative(word: string): string {
    const alternatives: Record<string, string> = {
      'guys': 'team members',
      'ninja': 'expert',
      'rockstar': 'talented professional',
      'guru': 'specialist',
      'aggressive': 'results-driven',
      'competitive': 'goal-oriented'
    };
    return alternatives[word.toLowerCase()] || 'professional';
  }

  private getAgeNeutralAlternative(word: string): string {
    const alternatives: Record<string, string> = {
      'young': 'motivated',
      'energetic': 'enthusiastic',
      'fresh': 'innovative',
      'digital native': 'tech-savvy',
      'recent graduate': 'entry-level professional'
    };
    return alternatives[word.toLowerCase()] || 'qualified professional';
  }

  private generateSuggestions(issues: BiasIssue[]): string[] {
    const suggestions = [
      'Use inclusive language that welcomes all qualified candidates',
      'Focus on skills and competencies rather than personal characteristics',
      'Consider if educational requirements are truly necessary for the role'
    ];

    if (issues.some(i => i.type === 'gender')) {
      suggestions.push('Review language for gender-coded words that may deter candidates');
    }

    if (issues.some(i => i.type === 'age')) {
      suggestions.push('Avoid age-related terms that could be seen as discriminatory');
    }

    return suggestions;
  }
}

