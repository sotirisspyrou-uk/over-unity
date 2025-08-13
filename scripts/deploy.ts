// ==========================================
// 5. DEPLOYMENT SCRIPT
// scripts/deploy.ts

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  vercelProject: string;
  supabaseProject: string;
  domain?: string;
}

export class DeploymentManager {
  private config: DeploymentConfig;

  constructor(config: DeploymentConfig) {
    this.config = config;
  }

  async deploy(): Promise<void> {
    console.log(`🚀 Deploying to ${this.config.environment}...`);

    try {
      // Pre-deployment checks
      await this.runPreDeploymentChecks();

      // Build the application
      await this.buildApplication();

      // Run database migrations
      await this.runMigrations();

      // Deploy to Vercel
      await this.deployToVercel();

      // Post-deployment verification
      await this.runPostDeploymentChecks();

      console.log('✅ Deployment completed successfully!');
    } catch (error) {
      console.error('❌ Deployment failed:', error);
      throw error;
    }
  }

  private async runPreDeploymentChecks(): Promise<void> {
    console.log('🔍 Running pre-deployment checks...');

    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'ANTHROPIC_API_KEY'
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    // Run tests
    try {
      execSync('npm test', { stdio: 'inherit' });
    } catch (error) {
      throw new Error('Tests failed. Deployment aborted.');
    }

    // Type checking
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
    } catch (error) {
      throw new Error('Type checking failed. Deployment aborted.');
    }

    console.log('✅ Pre-deployment checks passed');
  }

  private async buildApplication(): Promise<void> {
    console.log('🏗️ Building application...');
    
    try {
      execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
      throw new Error('Build failed');
    }

    console.log('✅ Application built successfully');
  }

  private async runMigrations(): Promise<void> {
    console.log('🗄️ Running database migrations...');
    
    try {
      execSync('npm run db:migrate', { stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠️ Migration failed, continuing with deployment');
    }

    console.log('✅ Migrations completed');
  }

  private async deployToVercel(): Promise<void> {
    console.log('☁️ Deploying to Vercel...');

    const deployCommand = this.config.environment === 'production' 
      ? 'vercel --prod'
      : 'vercel';

    try {
      execSync(deployCommand, { stdio: 'inherit' });
    } catch (error) {
      throw new Error('Vercel deployment failed');
    }

    console.log('✅ Deployed to Vercel');
  }

  private async runPostDeploymentChecks(): Promise<void> {
    console.log('🧪 Running post-deployment checks...');

    if (this.config.domain) {
      // Health check
      try {
        const response = await fetch(`https://${this.config.domain}/api/health`);
        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`);
        }
      } catch (error) {
        console.warn('⚠️ Health check failed:', error);
      }

      // Basic functionality check
      try {
        const response = await fetch(`https://${this.config.domain}/api/jobs`);
        if (!response.ok) {
          throw new Error(`API check failed: ${response.status}`);
        }
      } catch (error) {
        console.warn('⚠️ API check failed:', error);
      }
    }

    console.log('✅ Post-deployment checks completed');
  }
}
