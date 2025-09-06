#!/usr/bin/env node

/**
 * Production Environment Setup Script
 * Helps users set up production environment files with proper secrets
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ProductionEnvSetup {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.webAppDir = path.join(this.rootDir, 'apps/web');
    this.strapiAppDir = path.join(this.rootDir, 'apps/strapi');
  }

  log(message, level = 'info') {
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
    console.log(`${prefix} ${message}`);
  }

  generateSecret(length = 64) {
    return crypto.randomBytes(length).toString('base64');
  }

  generateJWTSecret() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateAppKeys() {
    return Array.from({ length: 4 }, () => this.generateSecret(32)).join(',');
  }

  promptUser(question) {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      readline.question(question, (answer) => {
        readline.close();
        resolve(answer.trim());
      });
    });
  }

  async setupStrapiEnvironment() {
    this.log('Setting up Strapi production environment...');

    const templatePath = path.join(this.strapiAppDir, '.env.production.example');
    const targetPath = path.join(this.strapiAppDir, '.env.production');

    if (!fs.existsSync(templatePath)) {
      this.log('Strapi environment template not found!', 'error');
      return false;
    }

    if (fs.existsSync(targetPath)) {
      const overwrite = await this.promptUser(
        '📋 Strapi .env.production already exists. Overwrite? (y/N): '
      );
      if (overwrite.toLowerCase() !== 'y') {
        this.log('Skipping Strapi environment setup');
        return true;
      }
    }

    let envContent = fs.readFileSync(templatePath, 'utf8');

    // Generate secrets
    const secrets = {
      'GENERATE_NEW_APP_KEY_1,GENERATE_NEW_APP_KEY_2,GENERATE_NEW_APP_KEY_3,GENERATE_NEW_APP_KEY_4': this.generateAppKeys(),
      'GENERATE_NEW_API_TOKEN_SALT': this.generateSecret(),
      'GENERATE_NEW_ADMIN_JWT_SECRET': this.generateSecret(),
      'GENERATE_NEW_JWT_SECRET': this.generateSecret(),
      'GENERATE_NEW_TRANSFER_TOKEN_SALT': this.generateSecret()
    };

    // Replace placeholders with generated secrets
    Object.entries(secrets).forEach(([placeholder, secret]) => {
      envContent = envContent.replace(placeholder, secret);
    });

    // Interactive configuration
    console.log('\n📝 Please provide the following information:\n');

    const userInputs = {
      'postgresql://username:password@hostname:port/database_name?sslmode=require': await this.promptUser(
        '🗄️  Database URL (from Strapi Cloud or your provider): '
      ),
      'your_aws_access_key_id': await this.promptUser(
        '🔑 AWS Access Key ID: '
      ),
      'your_aws_secret_access_key': await this.promptUser(
        '🔐 AWS Secret Access Key: '
      ),
      'your-production-bucket-name': await this.promptUser(
        '🪣 AWS S3 Bucket Name: '
      ),
      'your_mailgun_api_key': await this.promptUser(
        '📧 Mailgun API Key: '
      ),
      'your-mailgun-domain.com': await this.promptUser(
        '🌐 Mailgun Domain: '
      ),
      'https://your-domain.com': await this.promptUser(
        '🌍 Your Frontend Domain (https://your-domain.com): '
      )
    };

    // Generate preview and revalidation secrets
    const previewSecret = this.generateJWTSecret();
    const revalidateSecret = this.generateJWTSecret();
    
    userInputs['your_strong_preview_secret_here'] = previewSecret;
    userInputs['your_strong_revalidation_secret_here'] = revalidateSecret;

    // Replace user inputs
    Object.entries(userInputs).forEach(([placeholder, value]) => {
      if (value) {
        envContent = envContent.replace(new RegExp(placeholder, 'g'), value);
      }
    });

    fs.writeFileSync(targetPath, envContent);
    this.log('Strapi production environment created successfully!');

    // Save secrets for Next.js setup
    this.secrets = {
      previewSecret,
      revalidateSecret,
      frontendDomain: userInputs['https://your-domain.com'] || 'https://your-domain.com'
    };

    return true;
  }

  async setupNextjsEnvironment() {
    this.log('Setting up Next.js production environment...');

    const templatePath = path.join(this.webAppDir, '.env.production.example');
    const targetPath = path.join(this.webAppDir, '.env.production');

    if (!fs.existsSync(templatePath)) {
      this.log('Next.js environment template not found!', 'error');
      return false;
    }

    if (fs.existsSync(targetPath)) {
      const overwrite = await this.promptUser(
        '📋 Next.js .env.production already exists. Overwrite? (y/N): '
      );
      if (overwrite.toLowerCase() !== 'y') {
        this.log('Skipping Next.js environment setup');
        return true;
      }
    }

    let envContent = fs.readFileSync(templatePath, 'utf8');

    // Use secrets from Strapi setup or prompt for new ones
    const nextAuthSecret = this.generateSecret();
    const previewSecret = this.secrets?.previewSecret || this.generateJWTSecret();
    const revalidateSecret = this.secrets?.revalidateSecret || this.generateJWTSecret();
    const frontendDomain = this.secrets?.frontendDomain || await this.promptUser(
      '🌍 Your Frontend Domain (https://your-domain.com): '
    );

    console.log('\n📝 Please provide the following information:\n');

    const userInputs = {
      'REPLACE_WITH_STRONG_SECRET_IN_PRODUCTION': nextAuthSecret,
      'https://your-domain.com': frontendDomain,
      'https://your-strapi-instance.strapiapp.com': await this.promptUser(
        '🏗️  Strapi URL (from Strapi Cloud): '
      ),
      'your_readonly_api_key_here': await this.promptUser(
        '🔑 Strapi Read-only API Key (generate in Strapi Admin): '
      ),
      'your_custom_api_key_here': await this.promptUser(
        '🔐 Strapi Custom API Key (generate in Strapi Admin): '
      ),
      'your_strong_preview_secret_here': previewSecret,
      'your_strong_revalidation_secret_here': revalidateSecret
    };

    // Optional Sentry configuration
    const useSentry = await this.promptUser(
      '🐛 Do you want to configure Sentry for error monitoring? (y/N): '
    );

    if (useSentry.toLowerCase() === 'y') {
      userInputs['https://your-sentry-dsn@sentry.io/project-id'] = await this.promptUser(
        '📊 Sentry DSN: '
      );
      userInputs['your_sentry_auth_token_here'] = await this.promptUser(
        '🔐 Sentry Auth Token: '
      );
      userInputs['your-sentry-org'] = await this.promptUser(
        '🏢 Sentry Organization: '
      );
      userInputs['your-sentry-project'] = await this.promptUser(
        '📁 Sentry Project: '
      );
    }

    // Replace user inputs
    Object.entries(userInputs).forEach(([placeholder, value]) => {
      if (value) {
        envContent = envContent.replace(new RegExp(placeholder, 'g'), value);
      }
    });

    fs.writeFileSync(targetPath, envContent);
    this.log('Next.js production environment created successfully!');

    return true;
  }

  displaySummary() {
    this.log('\n🎉 Production environment setup completed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Review and verify all environment variables');
    console.log('   2. Create AWS S3 bucket and configure permissions');
    console.log('   3. Set up Mailgun domain and DNS records');
    console.log('   4. Deploy Strapi first: pnpm deploy:strapi');
    console.log('   5. Generate API keys in Strapi Admin panel');
    console.log('   6. Update API keys in Next.js environment');
    console.log('   7. Deploy Next.js: pnpm deploy:vercel');
    console.log('   8. Configure custom domain and DNS');
    console.log('   9. Set up monitoring and alerts');
    
    console.log('\n⚠️  Security Notes:');
    console.log('   - Never commit .env.production files to version control');
    console.log('   - Keep your secrets secure and rotate them regularly');
    console.log('   - Use different secrets for staging and production');
    
    console.log('\n📚 Documentation:');
    console.log('   - Full deployment guide: ./DEPLOYMENT.md');
    console.log('   - Quick deployment: pnpm deploy');
  }

  async setup() {
    try {
      console.log('🚀 Production Environment Setup Tool\n');
      console.log('This tool will help you create production-ready environment files');
      console.log('with proper security secrets and configuration.\n');

      const proceed = await this.promptUser('Continue with setup? (Y/n): ');
      if (proceed.toLowerCase() === 'n') {
        console.log('Setup cancelled.');
        return;
      }

      const strapiSuccess = await this.setupStrapiEnvironment();
      if (!strapiSuccess) {
        this.log('Failed to set up Strapi environment', 'error');
        return;
      }

      const nextjsSuccess = await this.setupNextjsEnvironment();
      if (!nextjsSuccess) {
        this.log('Failed to set up Next.js environment', 'error');
        return;
      }

      this.displaySummary();

    } catch (error) {
      this.log(`Setup failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Script execution
if (require.main === module) {
  const setup = new ProductionEnvSetup();
  setup.setup();
}

module.exports = ProductionEnvSetup;