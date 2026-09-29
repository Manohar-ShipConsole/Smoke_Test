// ============================================================
// FILE: ai_engine/ai.config.js
// PURPOSE: Central configuration for all AI engine modules.
//          All Claude model settings and API config live here.
//          Claude is accessed via Amazon Bedrock — AWS credentials
//          are resolved from the AWS_PROFILE (loaded from .env).
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

const aiConfig = {

  maxTokens: 8096,

  // ─── Amazon Bedrock (loaded from .env) ────────────────────
  awsRegion:      process.env.AWS_REGION,
  awsProfile:     process.env.AWS_PROFILE,
  bedrockModelId: process.env.BEDROCK_MODEL_ID,

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