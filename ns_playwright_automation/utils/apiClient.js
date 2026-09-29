// ============================================================
// FILE: utils/apiClient.js
// PURPOSE: Single reusable Claude API client used by all
//         ai_engine modules. All Claude API calls go through here.
//         Routed through Amazon Bedrock — credentials are resolved
//         via the AWS SDK default provider chain (AWS_PROFILE / env).
// ============================================================

import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';
import aiConfig from '../ai_engine/ai.config.js';

const client = new AnthropicBedrock({ awsRegion: aiConfig.awsRegion });

/**
 * Sends a prompt to Claude AI (via Bedrock) and returns the response text.
 *
 * @param {string} prompt        - The prompt to send
 * @param {number} [maxTokens]   - Override default max tokens
 * @returns {Promise<string>}    - Claude's response as plain text
 */
export async function callClaude(prompt, maxTokens = aiConfig.maxTokens) {
  const message = await client.messages.create({
    model:      aiConfig.bedrockModelId,
    max_tokens: maxTokens,
    messages: [
      { role: 'user', content: prompt }
    ],
  });

  const content = message.content.find(block => block.type === 'text');
  if (!content) throw new Error('No text response received from Claude AI');

  return content.text;
}