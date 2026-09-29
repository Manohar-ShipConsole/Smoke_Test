// ============================================================
// FILE: ai_engine/ai.config.js
// PURPOSE: Central configuration for all AI engine modules.
//          All Claude model settings and API config live here.
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

const aiConfig = {

  // ─── Claude Model (accessed via Amazon Bedrock) ───────────
  model:     process.env.BEDROCK_MODEL_ID,
  maxTokens: 8096,

  // ─── AWS Bedrock Access (loaded from .env) ────────────────
  // Credentials are resolved via the AWS SDK's default provider chain
  // (AWS_PROFILE → shared ~/.aws/credentials, or AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY).
  awsRegion:  process.env.AWS_REGION,
  awsProfile: process.env.AWS_PROFILE,

  // ─── Test Generator Settings ──────────────────────────────
  testGenerator: {
    excelFile:  'ManualTestCases.xlsx',
    sheetName:  'Sheet1',
    outputDir:  'tests/ai_generated',
    outputFile: 'aiGenerated.test.js',
  },

  // ─── Failure Analyzer Settings ────────────────────────────
  failureAnalyzer: {
    outputDir:  'ai_engine/reports',
    outputFile: 'failureReport.md',
  },

  // ─── Self Healer Settings ─────────────────────────────────
  selfHealer: {
    outputDir:  'ai_engine/reports',
    outputFile: 'healingReport.md',
  },

};

export default aiConfig;