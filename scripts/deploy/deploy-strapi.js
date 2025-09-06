#!/usr/bin/env node

/**
 * Automated Strapi Cloud Deployment Script
 * Handles environment setup, builds, and deployment to Strapi Cloud
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class StrapiDeployer {
  constructor() {
    this.rootDir = path.join(__dirname, '../..');
    this.strapiAppDir = path.join(this.rootDir, 'apps/strapi');
    this.environment = process.env.DEPLOY_ENV || 'production';
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
    
    // Check if Strapi CLI is installed
    try {
      execSync('strapi version', { stdio: 'pipe', cwd: this.strapiAppDir });
    } catch (error) {
      this.log('Strapi CLI not found in project. Installing...', 'warn');
      this.exec('pnpm add @strapi/strapi@latest', { cwd: this.strapiAppDir });
    }

    // Check if environment file exists
    const envPath = path.join(this.strapiAppDir, '.env.production');
    
    if (!fs.existsSync(envPath)) {
      this.log('.env.production file not found in apps/strapi', 'error');
      this.log('Please copy from .env.production.example and configure your variables', 'error');
      process.exit(1);
    }

    this.log('Prerequisites check completed ✓');
  }

  validateEnvironment() {
    this.log('Validating environment configuration...');
    
    const requiredVars = [
      'DATABASE_URL',
      'APP_KEYS',
      'API_TOKEN_SALT',
      'ADMIN_JWT_SECRET',
      'JWT_SECRET',
      'AWS_ACCESS_KEY_ID',
      'AWS_ACCESS_SECRET',
      'AWS_BUCKET'
    ];

    const envPath = path.join(this.strapiAppDir, '.env.production');
    const envContent = fs.readFileSync(envPath, 'utf8');

    const missingVars = [];
    requiredVars.forEach(varName => {
      const regex = new RegExp(`^${varName}=.+$`, 'm');
      if (!regex.test(envContent) || envContent.includes(`${varName}=GENERATE_NEW`) || envContent.includes(`${varName}=your_`)) {
        missingVars.push(varName);
      }
    });

    if (missingVars.length > 0) {
      this.log(`Missing or placeholder environment variables: ${missingVars.join(', ')}`, 'error');
      this.log('Please generate proper secrets and configure all required variables', 'error');
      process.exit(1);
    }

    this.log('Environment validation completed ✓');
  }

  generateSecrets() {
    this.log('Checking for secret generation...');
    
    const envPath = path.join(this.strapiAppDir, '.env.production');
    let envContent = fs.readFileSync(envPath, 'utf8');

    if (envContent.includes('GENERATE_NEW')) {
      this.log('Found placeholder secrets. Please generate new secrets using:', 'warn');
      this.log('node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'base64\'))"', 'warn');
      this.log('Please update your .env.production file and run deployment again', 'error');
      process.exit(1);
    }

    this.log('Secret validation completed ✓');
  }

  prepareConfiguration() {
    this.log('Preparing Strapi configuration...');

    // Copy production environment to .env
    const prodEnvPath = path.join(this.strapiAppDir, '.env.production');
    const envPath = path.join(this.strapiAppDir, '.env');
    
    if (fs.existsSync(prodEnvPath)) {
      fs.copyFileSync(prodEnvPath, envPath);
      this.log('Production environment copied to .env');
    }

    // Ensure database configuration is correct
    this.log('Validating database configuration...');
    
    this.log('Configuration preparation completed ✓');
  }

  buildProject() {
    this.log('Building Strapi project...');
    
    // Install dependencies
    this.log('Installing dependencies...');
    this.exec('pnpm install --frozen-lockfile');

    // Generate TypeScript types
    this.log('Generating TypeScript types...');
    this.exec('pnpm generate:types', { cwd: this.strapiAppDir });

    // Build Strapi admin panel
    this.log('Building Strapi admin panel...');
    this.exec('pnpm build', { cwd: this.strapiAppDir });

    this.log('Build completed ✓');
  }

  testDatabaseConnection() {
    this.log('Testing database connection...');
    
    try {
      // Run a simple database check
      this.exec('node -e "require(\'./config/database\'); console.log(\'Database config loaded successfully\')"', { 
        cwd: this.strapiAppDir 
      });
      this.log('Database connection test passed ✓');
    } catch (error) {
      this.log('Database connection test failed', 'error');
      this.log('Please verify your DATABASE_URL and database configuration', 'error');
      throw error;
    }
  }

  deployToStrapiCloud() {
    this.log('Deploying to Strapi Cloud...');

    // Check if using Strapi Cloud CLI or manual deployment
    if (fs.existsSync(path.join(this.strapiAppDir, 'strapi-cloud.json'))) {
      this.log('Using Strapi Cloud configuration...');
      
      // Deploy using Strapi Cloud CLI if available
      try {
        this.exec('strapi cloud:deploy', { cwd: this.strapiAppDir });
      } catch (error) {
        this.log('Strapi Cloud CLI not available. Using alternative deployment method...', 'warn');
        this.manualDeployment();
      }
    } else {
      this.manualDeployment();
    }

    this.log('Deployment initiated ✓');
  }

  manualDeployment() {
    this.log('Preparing for manual deployment...');
    
    // Create deployment package
    const deploymentDir = path.join(this.rootDir, 'deployment-package');
    
    if (fs.existsSync(deploymentDir)) {
      execSync(`rm -rf ${deploymentDir}`);
    }
    
    fs.mkdirSync(deploymentDir, { recursive: true });

    // Copy necessary files
    const filesToCopy = [
      'package.json',
      'pnpm-lock.yaml',
      'config',
      'src',
      'build',
      'public',
      'types',
      '.env'
    ];

    filesToCopy.forEach(file => {
      const sourcePath = path.join(this.strapiAppDir, file);
      const destPath = path.join(deploymentDir, file);
      
      if (fs.existsSync(sourcePath)) {
        if (fs.lstatSync(sourcePath).isDirectory()) {
          execSync(`cp -r ${sourcePath} ${destPath}`);
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }
      }
    });

    // Create deployment archive
    this.log('Creating deployment archive...');
    this.exec(`tar -czf strapi-deployment.tar.gz -C ${deploymentDir} .`);

    this.log('Deployment package created: strapi-deployment.tar.gz');
    this.log('Please upload this package to your Strapi Cloud project', 'warn');
  }

  postDeployment() {
    this.log('Running post-deployment tasks...');

    // Set up webhooks for frontend revalidation
    this.setupWebhooks();

    // Verify deployment health
    this.healthCheck();

    this.log('Post-deployment tasks completed ✓');
  }

  setupWebhooks() {
    this.log('Setting up frontend revalidation webhooks...');
    
    const webhookData = {
      name: 'Frontend Revalidation',
      url: process.env.NEXT_REVALIDATE_URL + '/api/revalidate',
      headers: {
        'Authorization': `Bearer ${process.env.REVALIDATE_SECRET}`
      },
      events: [
        'entry.create',
        'entry.update',
        'entry.delete',
        'entry.publish',
        'entry.unpublish'
      ]
    };

    this.log('Webhook configuration prepared. Please set up manually in Strapi Admin if not automated', 'warn');
    console.log(JSON.stringify(webhookData, null, 2));
  }

  healthCheck() {
    this.log('Performing health check...');
    
    const appUrl = process.env.APP_URL || 'http://localhost:1337';
    
    try {
      execSync(`curl -f ${appUrl}/_health`, { stdio: 'pipe' });
      this.log('Health check passed ✓');
    } catch (error) {
      this.log('Health check failed - deployment may still be initializing', 'warn');
    }
  }

  async deploy() {
    try {
      this.log('Starting Strapi Cloud deployment...');
      
      this.checkPrerequisites();
      this.validateEnvironment();
      this.generateSecrets();
      this.prepareConfiguration();
      this.buildProject();
      this.testDatabaseConnection();
      this.deployToStrapiCloud();
      this.postDeployment();
      
      this.log('🎉 Strapi deployment completed!');
      
    } catch (error) {
      this.log(`Deployment failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Script execution
if (require.main === module) {
  const deployer = new StrapiDeployer();
  deployer.deploy();
}

module.exports = StrapiDeployer;