#!/usr/bin/env node

/**
 * Automated Vercel Deployment Script
 * Handles environment setup, builds, and deployment to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class VercelDeployer {
  constructor() {
    this.rootDir = path.join(__dirname, '../..');
    this.webAppDir = path.join(this.rootDir, 'apps/web');
    this.environment = process.env.DEPLOY_ENV || 'production';
    this.isPreview = process.argv.includes('--preview');
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  exec(command, options = {}) {
    try {
      this.log(`Executing: ${command}`);
      const result = execSync(command, {
        cwd: options.cwd || this.rootDir,
        stdio: 'inherit',
        ...options
      });
      return result;
    } catch (error) {
      this.log(`Command failed: ${command}`, 'error');
      this.log(error.message, 'error');
      process.exit(1);
    }
  }

  checkPrerequisites() {
    this.log('Checking deployment prerequisites...');
    
    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'pipe' });
    } catch (error) {
      this.log('Vercel CLI not found. Installing...', 'warn');
      this.exec('npm install -g vercel@latest');
    }

    // Check if logged into Vercel
    try {
      execSync('vercel whoami', { stdio: 'pipe' });
    } catch (error) {
      this.log('Not logged into Vercel. Please run: vercel login', 'error');
      process.exit(1);
    }

    // Check if environment file exists
    const envFile = this.isPreview ? '.env.local' : '.env.production';
    const envPath = path.join(this.webAppDir, envFile);
    
    if (!fs.existsSync(envPath)) {
      this.log(`Environment file ${envFile} not found in ${this.webAppDir}`, 'error');
      this.log(`Please copy from ${envFile}.example and configure your variables`, 'error');
      process.exit(1);
    }

    this.log('Prerequisites check completed ✓');
  }

  validateEnvironment() {
    this.log('Validating environment configuration...');
    
    const requiredVars = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'STRAPI_URL',
      'STRAPI_REST_READONLY_API_KEY',
      'APP_PUBLIC_URL'
    ];

    const envFile = this.isPreview ? '.env.local' : '.env.production';
    const envPath = path.join(this.webAppDir, envFile);
    const envContent = fs.readFileSync(envPath, 'utf8');

    const missingVars = [];
    requiredVars.forEach(varName => {
      const regex = new RegExp(`^${varName}=.+$`, 'm');
      if (!regex.test(envContent) || envContent.includes(`${varName}=REPLACE_WITH`)) {
        missingVars.push(varName);
      }
    });

    if (missingVars.length > 0) {
      this.log(`Missing or placeholder environment variables: ${missingVars.join(', ')}`, 'error');
      process.exit(1);
    }

    this.log('Environment validation completed ✓');
  }

  buildProject() {
    this.log('Building project for deployment...');
    
    // Install dependencies
    this.log('Installing dependencies...');
    this.exec('pnpm install --frozen-lockfile');

    // Run type checking
    this.log('Running type checks...');
    this.exec('pnpm typecheck', { cwd: this.webAppDir });

    // Run linting
    this.log('Running linting...');
    this.exec('pnpm lint', { cwd: this.webAppDir });

    // Run tests
    if (!this.isPreview) {
      this.log('Running tests...');
      this.exec('pnpm test', { cwd: this.webAppDir });
    }

    // Build the application
    this.log('Building Next.js application...');
    this.exec('pnpm build', { cwd: this.webAppDir });

    this.log('Build completed ✓');
  }

  deployToVercel() {
    this.log('Deploying to Vercel...');

    const deployCommand = this.isPreview 
      ? 'vercel --yes'
      : 'vercel --prod --yes';

    // Set environment for deployment
    process.env.NODE_ENV = this.environment;

    this.exec(deployCommand, { cwd: this.webAppDir });

    this.log('Deployment completed ✓');
  }

  postDeployment() {
    this.log('Running post-deployment tasks...');

    // Get deployment URL
    try {
      const inspectOutput = execSync('vercel inspect --wait', { 
        cwd: this.webAppDir,
        encoding: 'utf8'
      });
      const urlMatch = inspectOutput.match(/url:\s*(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        const deploymentUrl = urlMatch[1];
        this.log(`Deployment URL: ${deploymentUrl}`);
        
        // Health check
        this.log('Performing health check...');
        try {
          execSync(`curl -f ${deploymentUrl}/api/health`, { stdio: 'pipe' });
          this.log('Health check passed ✓');
        } catch (error) {
          this.log('Health check failed - deployment may still be initializing', 'warn');
        }
      }
    } catch (error) {
      this.log('Could not retrieve deployment URL', 'warn');
    }

    this.log('Post-deployment tasks completed ✓');
  }

  async deploy() {
    try {
      this.log(`Starting ${this.isPreview ? 'preview' : 'production'} deployment to Vercel...`);
      
      this.checkPrerequisites();
      this.validateEnvironment();
      this.buildProject();
      this.deployToVercel();
      this.postDeployment();
      
      this.log('🎉 Deployment successful!');
      
    } catch (error) {
      this.log(`Deployment failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Script execution
if (require.main === module) {
  const deployer = new VercelDeployer();
  deployer.deploy();
}

module.exports = VercelDeployer;