/**
 * AI Provider types and interfaces
 */

export type ProviderName = 'openai' | 'gemini';

export type OutputTarget = 'insert';

export type GeminiSensitivityLevel = 'none' | 'low' | 'medium' | 'high';

/**
 * Gemini-specific sensitivity settings for content filtering
 */
export interface GeminiSensitivitySettings {
  harassment?: GeminiSensitivityLevel;
  hate?: GeminiSensitivityLevel;
  sexual?: GeminiSensitivityLevel;
  dangerous?: GeminiSensitivityLevel;
}

/**
 * AI Personality note frontmatter schema
 */
export interface AIPersonalityFrontmatter {
  'note-type': 'ai-personality';
  provider: ProviderName;
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  output?: {
    target?: OutputTarget;
  };
  gemini?: {
    sensitivity?: GeminiSensitivitySettings;
  };
}

/**
 * Normalized AI configuration after parsing frontmatter
 */
export interface AIConfig {
  provider: ProviderName;
  model: string;
  temperature: number;
  maxTokens: number;
  stream: boolean;
  outputTarget: OutputTarget;
  geminiSensitivity?: GeminiSensitivitySettings;
}

/**
 * Message format for AI providers
 */
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Parameters for AI generation requests
 */
export interface AIGenerationParams {
  model: string;
  temperature: number;
  maxTokens: number;
  stream: boolean;
  geminiSensitivity?: GeminiSensitivitySettings;
}

/**
 * AI Provider interface
 */
export interface AIProvider {
  readonly name: ProviderName;
  readonly supportsStreaming: boolean;
  
  /**
   * Send messages to the AI provider
   * @param messages Array of messages to send
   * @param params Generation parameters
   * @param apiKey API key for authentication
   * @returns Promise for non-streaming, AsyncIterable for streaming
   */
  send(
    messages: AIMessage[],
    params: AIGenerationParams,
    apiKey: string
  ): Promise<string> | AsyncIterable<string>;
  
  /**
   * Map frontmatter config to normalized generation parameters
   * @param config Parsed frontmatter config
   * @returns Normalized generation parameters
   */
  mapConfig(config: AIConfig): AIGenerationParams;
}
