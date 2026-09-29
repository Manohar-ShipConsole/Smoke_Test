import dotenv from 'dotenv';
dotenv.config();

const aiConfig = {

  // ─── AWS Bedrock Model ────────────────────────────────────
  model:     process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-opus-4-5-20250514-v1:0',
  maxTokens: 8096,

  // ─── AWS Bedrock Config (loaded from .env) ────────────────
  awsRegion:  process.env.AWS_REGION  || 'us-west-2',
  awsProfile: process.env.AWS_PROFILE || 'default',

  // ─── Test Generator Settings ──────────────────────────────
  testGenerator: {
    excelFile:  'ManualTestCases.xlsx',
    sheetName:  'Sheet1',
    outputDir:  'ai_generated/test_cases',
    outputFile: 'generatedTests.test.js',
  },

  // ─── Failure Analyzer Settings ────────────────────────────
  failureAnalyzer: {
    outputDir:  'ai_engine/reports',
    outputFile: 'TC_FAIL_analysis.md',
  },

  // ─── Self Healer Settings ─────────────────────────────────
  selfHealer: {
    outputDir:  'ai_engine/reports',
    outputFile: 'healingReport.md',
  },

};

export default aiConfig;