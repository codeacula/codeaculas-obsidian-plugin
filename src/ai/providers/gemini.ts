import { AIProvider, AIMessage, AIGenerationParams, AIConfig, GeminiSensitivityLevel } from '../types';

/**
 * Map sensitivity level to Gemini API threshold
 */
function mapSensitivityToThreshold(level: GeminiSensitivityLevel): string {
  const mapping: Record<GeminiSensitivityLevel, string> = {
    'none': 'BLOCK_NONE',
    'low': 'BLOCK_ONLY_HIGH',
    'medium': 'BLOCK_MEDIUM_AND_ABOVE',
    'high': 'BLOCK_LOW_AND_ABOVE',
  };
  return mapping[level];
}

/**
 * Gemini provider implementation
 */
export class GeminiProvider implements AIProvider {
  readonly name = 'gemini' as const;
  readonly supportsStreaming = true;

  mapConfig(config: AIConfig): AIGenerationParams {
    return {
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      stream: config.stream,
      geminiSensitivity: config.geminiSensitivity,
    };
  }

  async *send(
    messages: AIMessage[],
    params: AIGenerationParams,
    apiKey: string
  ): AsyncIterable<string> {
    // Extract system message and user messages
    const systemMessages = messages.filter(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');
    
    // Combine system messages into systemInstruction
    const systemInstruction = systemMessages.length > 0
      ? systemMessages.map(m => m.content).join('\n\n')
      : undefined;

    // Build Gemini contents array
    const contents = chatMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Build safety settings
    const safetySettings = [];
    if (params.geminiSensitivity) {
      const categories = [
        { key: 'harassment', category: 'HARM_CATEGORY_HARASSMENT' },
        { key: 'hate', category: 'HARM_CATEGORY_HATE_SPEECH' },
        { key: 'sexual', category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' },
        { key: 'dangerous', category: 'HARM_CATEGORY_DANGEROUS_CONTENT' },
      ];

      for (const { key, category } of categories) {
        const level = params.geminiSensitivity[key as keyof typeof params.geminiSensitivity];
        if (level) {
          safetySettings.push({
            category,
            threshold: mapSensitivityToThreshold(level),
          });
        }
      }
    }

    const generationConfig = {
      temperature: params.temperature,
      maxOutputTokens: params.maxTokens,
    };

    const requestBody: any = {
      contents,
      generationConfig,
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    if (safetySettings.length > 0) {
      requestBody.safetySettings = safetySettings;
    }

    const endpoint = params.stream ? 'streamGenerateContent' : 'generateContent';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:${endpoint}?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    if (!params.stream) {
      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      yield content;
      return;
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;

          try {
            const parsed = JSON.parse(line);
            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
              yield content;
            }
          } catch (e) {
            // Skip malformed JSON
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
