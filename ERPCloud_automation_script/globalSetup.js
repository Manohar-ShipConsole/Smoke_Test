import { execSync, spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const PROFILE = process.env.AWS_PROFILE || 'BedrockQAEngineerAccess';

async function globalSetup() {
  console.log(`\n[GlobalSetup] Checking AWS SSO credentials for profile: ${PROFILE}`);

  const credentialsValid = checkCredentials();

  if (credentialsValid) {
    console.log(`[GlobalSetup] ✓ AWS credentials are valid — proceeding with tests.\n`);
    return;
  }

  console.log(`[GlobalSetup] ✗ Credentials expired. Launching: aws sso login --profile ${PROFILE}`);
  console.log(`[GlobalSetup] A browser window will open — please complete the AWS SSO login.\n`);

  await runSSOLogin();

  console.log(`\n[GlobalSetup] ✓ AWS SSO login successful — proceeding with tests.\n`);
}

function checkCredentials() {
  try {
    execSync(`aws sts get-caller-identity --profile ${PROFILE}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function runSSOLogin() {
  return new Promise((resolve, reject) => {
    const proc = spawn('aws', ['sso', 'login', '--profile', PROFILE], {
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`[GlobalSetup] aws sso login failed with exit code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`[GlobalSetup] Failed to run aws sso login: ${err.message}`));
    });
  });
}

export default globalSetup;
