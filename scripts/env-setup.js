#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const apps = ['apps/api', 'apps/web'];

apps.forEach((appPath) => {
  const stubPath = path.join(appPath, '.env.stub');
  const envPath = path.join(appPath, '.env');

  if (fs.existsSync(stubPath) && !fs.existsSync(envPath)) {
    fs.copyFileSync(stubPath, envPath);
    console.log(`Created ${envPath} from ${stubPath}`);
  } else if (fs.existsSync(envPath)) {
    console.log(`${envPath} already exists, skipping`);
  } else {
    console.log(`${stubPath} not found, skipping`);
  }
});

console.log('Environment setup complete');
