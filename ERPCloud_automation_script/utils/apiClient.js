// ============================================================
// FILE: utils/apiClient.js
// PURPOSE: Single reusable Claude API client used by all
//          ai_engine modules. All Claude API calls go through here.
//          Uses AWS Bedrock Runtime SDK with named profile auth.
// ============================================================

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { fromIni } from '@aws-sdk/credential-providers';
import aiConfig from '../ai_engine/ai.config.js';

const client = new BedrockRuntimeClient({
  region:      aiConfig.awsRegion,
  credentials: fromIni({ profile: aiConfig.awsProfile }),
});

/**
 * Sends a prompt to Claude AI via AWS Bedrock and returns the response text.
 *
 * @param {string} prompt        - The prompt to send
 * @param {number} [maxTokens]   - Override default max tokens
 * @returns {Promise<string>}    - Claude's response as plain text
 */
export async function callClaude(prompt, maxTokens = aiConfig.maxTokens) {
  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens:        maxTokens,
    messages: [
      { role: 'user', content: prompt }
    ],
  });

  const command = new InvokeModelCommand({
    modelId:     aiConfig.model,
    contentType: 'application/json',
    accept:      'application/json',
    body:        Buffer.from(body),
  });

  const response = await client.send(command);
  const result   = JSON.parse(Buffer.from(response.body).toString());

  const content = result.content?.find(block => block.type === 'text');
  if (!content) throw new Error('No text response received from Claude AI via Bedrock');

  return content.text;
}
