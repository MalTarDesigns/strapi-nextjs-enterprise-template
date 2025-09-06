#!/usr/bin/env node

/**
 * Full-Stack Deployment Orchestrator
 * Coordinates deployment of both Strapi CMS and Next.js frontend
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const StrapiDeployer = require('./deploy-strapi');
const VercelDeployer = require('./deploy-vercel');

class FullStackDeployer {
  constructor() {
    this.rootDir = path.join(__dirname, '../..');
    this.options = this.parseArguments();
  }

  parseArguments() {
    const args = process.argv.slice(2);
    return {
      strapiOnly: args.includes('--strapi-only'),
      vercelOnly: args.includes('--vercel-only'),
      preview: args.includes('--preview'),
      skipTests: args.includes('--skip-tests'),
      parallel: args.includes('--parallel'),
      verbose: args.includes('--verbose')
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showHelp() {
    console.log(`
Full-Stack Deployment Script

Usage: node deploy-full-stack.js [options]

Options:
  --strapi-only     Deploy only Strapi CMS
  --vercel-only     Deploy only Next.js frontend  
  --preview         Deploy as preview (development)
  --skip-tests      Skip test execution
  --parallel        Deploy both services in parallel
  --verbose         Enable verbose logging
  --help           Show this help message

Examples:
  node deploy-full-stack.js                    # Deploy both services sequentially
  node deploy-full-stack.js --preview          # Deploy both as preview
  node deploy-full-stack.js --strapi-only      # Deploy only Strapi
  node deploy-full-stack.js --parallel         # Deploy both in parallel
`);
  }

  validateDeploymentOrder() {
    if (this.options.vercelOnly) {
      this.log('⚠️  Warning: Deploying frontend without backend may cause issues', 'warn');
      this.log('Ensure Strapi is already deployed and accessible', 'warn');
    }
  }

  async preDeploymentChecks() {
    this.log('Running pre-deployment checks...');

    // Check Git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        this.log('Warning: You have uncommitted changes', 'warn');
        this.log('Consider committing your changes before deployment', 'warn');
      }
    } catch (error) {
      this.log('Not in a git repository or git not available', 'warn');
    }

    // Check for required environment files
    const requiredFiles = [
      { path: 'apps/strapi/.env.production', condition: !this.options.vercelOnly },
      { path: 'apps/web/.env.production', condition: !this.options.strapiOnly },
    ];

    for (const file of requiredFiles) {
      if (file.condition) {
        const filePath = path.join(this.rootDir, file.path);
        if (!fs.existsSync(filePath)) {
          this.log(`Missing required file: ${file.path}`, 'error');
          process.exit(1);
        }
      }
    }

    this.log('Pre-deployment checks completed ✓');
  }

  async deployStrapi() {
    this.log('🚀 Starting Strapi deployment...');
    
    try {
      const strapiDeployer = new StrapiDeployer();
      await strapiDeployer.deploy();
      this.log('Strapi deployment completed successfully ✓');
      return true;
    } catch (error) {
      this.log(`Strapi deployment failed: ${error.message}`, 'error');
      return false;
    }
  }

  async deployVercel() {
    this.log('🚀 Starting Vercel deployment...');
    
    try {
      const vercelDeployer = new VercelDeployer();
      await vercelDeployer.deploy();
      this.log('Vercel deployment completed successfully ✓');
      return true;
    } catch (error) {
      this.log(`Vercel deployment failed: ${error.message}`, 'error');
      return false;
    }
  }

  async deployParallel() {
    this.log('🚀 Starting parallel deployment...');

    const deployments = [];
    const results = {};

    if (!this.options.vercelOnly) {
      deployments.push(
        this.deployStrapi().then(success => {
          results.strapi = success;
          return success;
        })
      );
    }

    if (!this.options.strapiOnly) {
      // Add a small delay for frontend deployment to allow backend to start
      deployments.push(
        this.delay(5000).then(() => 
          this.deployVercel().then(success => {
            results.vercel = success;
            return success;
          })
        )
      );
    }

    const deploymentResults = await Promise.all(deployments);
    const allSuccessful = deploymentResults.every(result => result === true);

    if (allSuccessful) {
      this.log('🎉 All parallel deployments completed successfully!');
    } else {
      this.log('❌ Some deployments failed. Check logs above for details.', 'error');
    }

    return { success: allSuccessful, results };
  }

  async deploySequential() {
    this.log('🚀 Starting sequential deployment...');

    let strapiSuccess = true;
    let vercelSuccess = true;

    // Deploy Strapi first (backend)
    if (!this.options.vercelOnly) {
      strapiSuccess = await this.deployStrapi();
      
      if (!strapiSuccess) {
        this.log('Strapi deployment failed. Aborting frontend deployment.', 'error');
        return { success: false, results: { strapi: false } };
      }

      // Wait for Strapi to be fully available
      this.log('Waiting for Strapi to be fully available...');
      await this.delay(10000);
    }

    // Deploy Vercel (frontend)  
    if (!this.options.strapiOnly) {
      vercelSuccess = await this.deployVercel();
    }

    const allSuccessful = strapiSuccess && vercelSuccess;

    if (allSuccessful) {
      this.log('🎉 Sequential deployment completed successfully!');
    } else {
      this.log('❌ Deployment failed. Check logs above for details.', 'error');
    }

    return { 
      success: allSuccessful, 
      results: { 
        strapi: strapiSuccess, 
        vercel: vercelSuccess 
      } 
    };
  }

  async postDeploymentValidation() {
    this.log('Running post-deployment validation...');

    // Test connectivity between services
    const strapiUrl = process.env.STRAPI_URL;
    const vercelUrl = process.env.APP_PUBLIC_URL;

    if (strapiUrl && !this.options.vercelOnly) {
      try {
        this.log('Testing Strapi health...');
        execSync(`curl -f ${strapiUrl}/_health`, { stdio: 'pipe' });
        this.log('Strapi health check passed ✓');
      } catch (error) {
        this.log('Strapi health check failed', 'warn');
      }
    }

    if (vercelUrl && !this.options.strapiOnly) {
      try {
        this.log('Testing Next.js health...');
        execSync(`curl -f ${vercelUrl}/api/health`, { stdio: 'pipe' });
        this.log('Next.js health check passed ✓');
      } catch (error) {
        this.log('Next.js health check failed', 'warn');
      }
    }

    // Test integration between services
    if (!this.options.strapiOnly && !this.options.vercelOnly) {
      this.log('Testing service integration...');
      // Add integration tests here
      this.log('Integration tests would run here (implement based on your needs)', 'warn');
    }

    this.log('Post-deployment validation completed ✓');
  }

  async deploy() {
    try {
      if (process.argv.includes('--help')) {
        this.showHelp();
        return;
      }

      this.log('🚀 Starting Full-Stack Deployment Process...');
      this.log(`Deployment mode: ${this.options.preview ? 'Preview' : 'Production'}`);
      
      this.validateDeploymentOrder();
      await this.preDeploymentChecks();

      let deploymentResult;

      if (this.options.parallel) {
        deploymentResult = await this.deployParallel();
      } else {
        deploymentResult = await this.deploySequential();
      }

      if (deploymentResult.success) {
        await this.postDeploymentValidation();
        
        this.log('🎉 Full-Stack deployment completed successfully!');
        this.log('📊 Deployment Summary:');
        
        if (deploymentResult.results.strapi !== undefined) {
          this.log(`   Strapi: ${deploymentResult.results.strapi ? '✅ Success' : '❌ Failed'}`);
        }
        
        if (deploymentResult.results.vercel !== undefined) {
          this.log(`   Vercel: ${deploymentResult.results.vercel ? '✅ Success' : '❌ Failed'}`);
        }
        
      } else {
        this.log('❌ Full-Stack deployment failed!', 'error');
        process.exit(1);
      }

    } catch (error) {
      this.log(`Deployment process failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Script execution
if (require.main === module) {
  const deployer = new FullStackDeployer();
  deployer.deploy();
}

module.exports = FullStackDeployer;