#!/usr/bin/env node
/**
 * Environment Variables Check Script
 * Runs during build to ensure all required variables are present
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment variables...');

// Load environment variables from .env or .env.local if they exist (for local development)
const envPath = path.join(__dirname, '..', '.env');
const envLocalPath = path.join(__dirname, '..', '.env.local');

const envFiles = [envPath, envLocalPath].filter(p => fs.existsSync(p));

for (const envFilePath of envFiles) {
  const envContent = fs.readFileSync(envFilePath, 'utf8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
  console.log(`📁 Loaded environment variables from ${path.basename(envFilePath)}`);
}

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingVars = [];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n📖 Setup instructions:');
  console.error('   1. Copy .env.example to .env.local');
  console.error('   2. Fill in your Supabase credentials');
  console.error('   3. For Vercel deployment, set environment variables in your project settings');
  console.error('\n🔗 Get your Supabase credentials from: https://app.supabase.com/project/_/settings/api');
  process.exit(1);
}

// Validate URL format
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl.startsWith('https://')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL');
  console.error(`   Current value: ${supabaseUrl}`);
  process.exit(1);
}

console.log('✅ All required environment variables are present');
console.log(`✅ Supabase URL validated: ${supabaseUrl}`);