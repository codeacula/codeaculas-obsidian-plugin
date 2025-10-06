import { AIPersonalityFrontmatter, AIConfig, ProviderName } from './types';

/**
 * Default AI configuration values
 */
const DEFAULT_CONFIG = {
  temperature: 0.7,
  maxTokens: 1024,
  stream: true,
  outputTarget: 'insert' as const,
};

/**
 * Validates and normalizes AI personality frontmatter
 * @param frontmatter Raw frontmatter from the personality note
 * @returns Normalized AI configuration
 * @throws Error if frontmatter is invalid
 */
export function parseAIConfig(frontmatter: any): AIConfig {
  // Validate note-type
  if (frontmatter['note-type'] !== 'ai-personality') {
    throw new Error('Note must have note-type: ai-personality in frontmatter');
  }

  // Validate provider
  const provider = frontmatter.provider as ProviderName;
  if (!provider || !['openai', 'gemini'].includes(provider)) {
    throw new Error('Provider must be either "openai" or "gemini"');
  }

  // Validate model
  const model = frontmatter.model;
  if (!model || typeof model !== 'string') {
    throw new Error('Model must be specified as a string');
  }

  // Parse optional fields with defaults
  const temperature = typeof frontmatter.temperature === 'number'
    ? frontmatter.temperature
    : DEFAULT_CONFIG.temperature;

  const maxTokens = typeof frontmatter.maxTokens === 'number'
    ? frontmatter.maxTokens
    : DEFAULT_CONFIG.maxTokens;

  const stream = typeof frontmatter.stream === 'boolean'
    ? frontmatter.stream
    : DEFAULT_CONFIG.stream;

  const outputTarget = frontmatter.output?.target || DEFAULT_CONFIG.outputTarget;

  // Parse Gemini-specific settings
  let geminiSensitivity;
  if (provider === 'gemini' && frontmatter.gemini?.sensitivity) {
    geminiSensitivity = frontmatter.gemini.sensitivity;
  }

  return {
    provider,
    model,
    temperature,
    maxTokens,
    stream,
    outputTarget,
    geminiSensitivity,
  };
}

/**
 * Validates that required API key is present
 * @param provider Provider name
 * @param openaiKey OpenAI API key
 * @param geminiKey Gemini API key
 * @returns The appropriate API key for the provider
 * @throws Error if the required API key is missing
 */
export function validateApiKey(
  provider: ProviderName,
  openaiKey: string,
  geminiKey: string
): string {
  if (provider === 'openai') {
    if (!openaiKey) {
      throw new Error('OpenAI API key is not configured. Please set it in plugin settings.');
    }
    return openaiKey;
  } else if (provider === 'gemini') {
    if (!geminiKey) {
      throw new Error('Gemini API key is not configured. Please set it in plugin settings.');
    }
    return geminiKey;
  }
  throw new Error(`Unknown provider: ${provider}`);
}
