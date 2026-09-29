// ============================================================
// FILE: ai_engine/failureAnalyzer.js
//
// TWO MODES:
//
// MODE 1 — AUTO (triggered by Playwright globalTeardown)
//   Automatically runs after every test suite.
//   Detects all failed tests from test-results/ folder.
//   For each failure → sends to Claude AI → generates fix.
//
// MODE 2 — MANUAL (triggered by engineer)
//   node ai_engine/failureAnalyzer.js \
//     --test=tests/Shipping.test.js \
//     --page=pages_objects/ShippingPage.js \
//     --error="TimeoutError: Locator not found"
//
// OUTPUT (per failed test):
//   ai_engine/reports/TC_01_analysis.md  ← Root Cause Analysis
//   ai_engine/reports/TC_01_fixed.js     ← Fixed code for engineer review
//
// APPROVAL WORKFLOW:
//   Engineer reviews TC_01_fixed.js
//   If approved → manually replaces original file
//   If rejected → ignores, fixes manually
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { callClaude } from '../utils/apiClient.js';
import aiConfig from './ai.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const REPORTS_DIR  = path.resolve(__dirname, '../ai_generated/reports');
const TEST_RESULTS = path.resolve(__dirname, '../pulse-report/playwright-pulse-report.json');
const PAGES_DIR    = path.resolve(__dirname, '../pages_objects');
const TESTS_DIR    = path.resolve(__dirname, '../tests');

// ─── UTILS ───────────────────────────────────────────────────

function readFileSafe(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch { return null; }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ─── STEP 1: Parse pulse report JSON for failures ────────────
// Reads playwright-pulse-report.json and extracts failed tests

function scanFailures() {
  if (!fs.existsSync(TEST_RESULTS)) {
    console.log('⚠️  No pulse report found at pulse-report/playwright-pulse-report.json');
    return [];
  }

  const report   = JSON.parse(fs.readFileSync(TEST_RESULTS, 'utf8'));
  const results  = report.results || [];
  const failures = [];

  for (const result of results) {
    if (result.status !== 'failed') continue;

    // Strip ANSI color codes from error message
    const rawError  = result.errorMessage || result.stackTrace || 'Unknown error';
    const errorText = rawError.replace(/\u001b\[[0-9;]*m/g, '').trim();

    // Extract last failed step details for richer AI context
    const failedStep = result.steps?.find(s => s.status === 'failed');
    const stepInfo   = failedStep
      ? `\nFailed Step: ${failedStep.title}\nCode: ${failedStep.codeSnippet}\nLocation: ${failedStep.codeLocation}`
      : '';

    // Build full error context
    const fullError = `${errorText}${stepInfo}\n\nTest: ${result.name}\nFile: ${result.spec_file}\nDuration: ${result.duration}ms`;

    failures.push({
      folderName: result.spec_file?.replace('.js', '') || result.id,
      errorText:  fullError,
      errorFile:  TEST_RESULTS,
      folderPath: path.dirname(TEST_RESULTS),
      specFile:   result.spec_file,
      testName:   result.name,
      resultId:   result.id,
    });
  }

  return failures;
}

// ─── STEP 2: Find matching test file and page object ─────────

function findTestFile(folderName) {
  // Try to match folder name to a test file
  // Playwright folder: "tests-Shipping-test-js-..." → tests/Shipping.test.js
  const testFiles = fs.readdirSync(TESTS_DIR)
    .filter(f => f.endsWith('.test.js') || f.endsWith('.spec.js'));

  for (const file of testFiles) {
    const normalized = file.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const folderNorm = folderName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (folderNorm.includes(normalized.replace('testjs', ''))) {
      return path.join(TESTS_DIR, file);
    }
  }

  // Default to Shipping.test.js if no match
  const defaultTest = path.join(TESTS_DIR, 'Shipping.test.js');
  return fs.existsSync(defaultTest) ? defaultTest : null;
}

function findPageObjects(errorText, testCode) {
  // Find which page objects are mentioned in error or test code
  const combined  = (errorText + ' ' + (testCode || '')).toLowerCase();
  const pageFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.js'));
  const matched   = [];

  for (const file of pageFiles) {
    const name = file.replace('.js', '').toLowerCase();
    if (combined.includes(name)) {
      const content = readFileSafe(path.join(PAGES_DIR, file));
      if (content) matched.push({ file, content });
    }
  }

  // Always include ShippingPage as it is the main page
  if (!matched.find(m => m.file === 'ShippingPage.js')) {
    const sp = readFileSafe(path.join(PAGES_DIR, 'ShippingPage.js'));
    if (sp) matched.unshift({ file: 'ShippingPage.js', content: sp });
  }

  return matched;
}

// ─── STEP 3: Build analysis prompt ───────────────────────────

function buildAnalysisPrompt({ errorText, testCode, pageObjects, testName }) {
  const pageSection = pageObjects.map(p =>
    `--- ${p.file} ---\n${p.content}`
  ).join('\n\n');

  return `
You are a senior Playwright test automation engineer performing Root Cause Analysis.

A Playwright test has FAILED. Analyze the failure thoroughly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FAILED TEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${testName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR MESSAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${errorText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEST CODE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${testCode || 'Not available'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE OBJECT CODE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${pageSection || 'Not available'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROVIDE A DETAILED ANALYSIS WITH THESE SECTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 1. FAILURE SUMMARY
One paragraph — what failed, where, and when.

## 2. ROOT CAUSE
Exact technical reason. Mention specific line numbers, locators, method names.

## 3. FAILURE CATEGORY
Pick one:
- Locator Failure (element not found / selector changed)
- Timing Issue (element not ready / timeout)
- Data Issue (wrong test data / Excel mapping)
- Logic Error (incorrect test flow / wrong condition)
- Environment Issue (network / config / browser)
- Assertion Failure (value mismatch)

## 4. FIX EXPLANATION
Explain clearly what needs to change and why.
Show BEFORE and AFTER:
\`\`\`javascript
// BEFORE (broken)
...

// AFTER (fixed)
...
\`\`\`

## 5. PREVENTION
How to prevent this type of failure in future.

## 6. CONFIDENCE LEVEL
High / Medium / Low — and why.

Format as clean Markdown.
`;
}

// ─── STEP 4: Build fix prompt ─────────────────────────────────

function buildFixPrompt({ errorText, testCode, pageObjects, testName }) {
  const pageSection = pageObjects.map(p =>
    `--- ${p.file} ---\n${p.content}`
  ).join('\n\n');

  return `
You are a senior Playwright test automation engineer.

A test has failed. Based on the error and code below, generate the COMPLETE FIXED version
of the file that contains the bug.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FAILED TEST: ${testName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ERROR:
${errorText}

TEST CODE:
${testCode || 'Not available'}

PAGE OBJECT CODE:
${pageSection || 'Not available'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Identify which file contains the bug (test file or page object)
2. Generate the COMPLETE fixed version of that file
3. Add a comment above every fix explaining what was changed and why:
   // 🔧 FIX: [what was wrong] → [what was changed]
4. Do NOT change anything that is not related to the fix
5. Keep all existing imports, structure, and patterns exactly the same
6. Use ESM syntax (import/export) — no require()
7. Output ONLY the complete fixed JavaScript file
8. No markdown, no explanation text, no code fences

Generate the complete fixed file now:
`;
}

// ─── STEP 5: Save reports ─────────────────────────────────────

function saveReports({ testId, analysisReport, fixedCode }) {
  ensureDir(REPORTS_DIR);

  const timestamp     = new Date().toISOString().replace(/[:.]/g, '-');
  const analysisFile  = path.join(REPORTS_DIR, `${testId}_analysis.md`);
  const fixedFile     = path.join(REPORTS_DIR, `${testId}_fixed.js`);
  const timedAnalysis = path.join(REPORTS_DIR, `${testId}_analysis_${timestamp}.md`);

  // Save analysis report
  fs.writeFileSync(analysisFile,  analysisReport, 'utf8');
  fs.writeFileSync(timedAnalysis, analysisReport, 'utf8');

  // Save fixed code
  const cleanedFix = fixedCode
    .replace(/^```(?:javascript|js)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  fs.writeFileSync(fixedFile, cleanedFix, 'utf8');

  return { analysisFile, fixedFile };
}

// ─── PROCESS ONE FAILURE ──────────────────────────────────────

async function processFailure({ testId, testName, errorText, testFilePath }) {
  console.log(`\n🔍 Analyzing: ${testName}`);
  console.log(`   Error: ${errorText.slice(0, 100)}...`);

  // Read test code
  const testCode = testFilePath ? readFileSafe(testFilePath) : null;

  // Find relevant page objects
  const pageObjects = findPageObjects(errorText, testCode);
  console.log(`   📄 Page objects found: ${pageObjects.map(p => p.file).join(', ')}`);

  // Step A — Get Root Cause Analysis
  console.log(`   🤖 Getting Root Cause Analysis...`);
  const analysisPrompt = buildAnalysisPrompt({ errorText, testCode, pageObjects, testName });
  const analysisReport = await callClaude(analysisPrompt);

  // Step B — Get Fixed Code
  console.log(`   🔧 Generating fixed code...`);
  const fixPrompt = buildFixPrompt({ errorText, testCode, pageObjects, testName });
  const fixedCode = await callClaude(fixPrompt);

  // Save both reports
  const { analysisFile, fixedFile } = saveReports({ testId, analysisReport, fixedCode });

  console.log(`   ✅ Analysis → ${analysisFile}`);
  console.log(`   ✅ Fixed    → ${fixedFile}`);
  console.log(`   ⚠️  Engineer approval required before applying fix`);

  return { testId, testName, analysisFile, fixedFile };
}

// ─── MAIN ─────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍 AI FAILURE ANALYZER');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const args   = process.argv.slice(2);
  const getArg = key => {
    const match = args.find(a => a.startsWith(`--${key}=`));
    return match ? match.split('=').slice(1).join('=') : null;
  };

  const manualError    = getArg('error');
  const manualTestFile = getArg('test');
  const manualPageFile = getArg('page');
  const manualName     = getArg('name') || 'Manual Analysis';

  let failures = [];

  if (manualError || manualTestFile) {
    // ── MANUAL MODE ──────────────────────────────────────────
    console.log('📋 Mode: Manual');

    const testFilePath = manualTestFile
      ? path.resolve(process.cwd(), manualTestFile) : null;
    const pageCode     = manualPageFile
      ? readFileSafe(path.resolve(process.cwd(), manualPageFile)) : null;

    failures = [{
      testId:      'MANUAL',
      testName:    manualName,
      errorText:   manualError || 'No error provided — analyze test code',
      testFilePath,
      pageObjects: pageCode
        ? [{ file: path.basename(manualPageFile), content: pageCode }]
        : [],
    }];

  } else {
    // ── AUTO MODE ─────────────────────────────────────────────
    console.log('📋 Mode: Auto — scanning pulse-report/playwright-pulse-report.json');
    const rawFailures = scanFailures();

    if (rawFailures.length === 0) {
      console.log('✅ No failures found in pulse report.');
      console.log('   All tests passed or no results available.\n');
      return;
    }

    console.log(`   Found ${rawFailures.length} failure(s)\n`);

    failures = rawFailures.map((f, i) => {
      const testFilePath = findTestFile(f.specFile || f.folderName);
      const testId       = `TC_FAIL_${String(i + 1).padStart(2, '0')}`;
      return {
        testId,
        testName:    f.testName || f.folderName,
        errorText:   f.errorText,
        testFilePath,
        pageObjects: [],
      };
    });
  }

  // Process each failure
  const results = [];
  for (const failure of failures) {
    try {
      const result = await processFailure(failure);
      results.push({ ...result, status: 'success' });
    } catch (err) {
      console.error(`   ❌ Failed to analyze: ${err.message}`);
      results.push({ testId: failure.testId, status: 'failed', error: err.message });
    }
  }

  // Final summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 ANALYSIS COMPLETE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   ✅ Analyzed : ${results.filter(r => r.status === 'success').length}`);
  console.log(`   ❌ Failed   : ${results.filter(r => r.status === 'failed').length}`);
  console.log(`\n📁 Reports saved in: ai_generated/reports/`);
  console.log(`\n📋 APPROVAL WORKFLOW:`);
  console.log(`   1. Review ai_generated/reports/TC_FAIL_01_analysis.md`);
  console.log(`   2. Review ai_generated/reports/TC_FAIL_01_fixed.js`);
  console.log(`   3. If approved → replace the original file manually`);
  console.log(`   4. If rejected → fix manually or re-run analyzer`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// ─── ENTRY POINTS ─────────────────────────────────────────────
 
// Detect if running directly: node ai_engine/failureAnalyzer.js
const isDirectRun = process.argv[1]?.endsWith('failureAnalyzer.js');
 
if (isDirectRun) {
  main().catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  });
}
 

// ─── EXPORT for use as Playwright globalTeardown ──────────────
// ─── Playwright globalTeardown ────────────────────────────────
// Fires automatically after every test suite via playwright.config.js:
//   globalTeardown: './ai_engine/failureAnalyzer.js'
export default async function globalTeardown() {
  // Wait 3s for pulse reporter to finish writing the JSON file
  await new Promise(resolve => setTimeout(resolve, 3000));
 
  if (!fs.existsSync(TEST_RESULTS)) {
    console.log('\n⚠️  Pulse report not found — skipping AI Failure Analyzer');
    return;
  }
 
  const report      = JSON.parse(fs.readFileSync(TEST_RESULTS, 'utf8'));
  const hasFailures = (report.results || []).some(r => r.status === 'failed');
 
  if (!hasFailures) {
    console.log('\n✅ All tests passed — skipping AI Failure Analyzer');
    return;
  }
 
  console.log('\n🔍 AI Failure Analyzer — Auto triggered by Playwright');
  await main();
}