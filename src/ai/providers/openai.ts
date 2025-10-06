import { AIProvider, AIMessage, AIGenerationParams, AIConfig } from '../types';

/**
 * OpenAI provider implementation
 */
export class OpenAIProvider implements AIProvider {
  readonly name = 'openai' as const;
  readonly supportsStreaming = true;

  mapConfig(config: AIConfig): AIGenerationParams {
    return {
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      stream: config.stream,
    };
  }

  async *send(
    messages: AIMessage[],
    params: AIGenerationParams,
    apiKey: string
  ): AsyncIterable<string> {
    const url = 'https://api.openai.com/v1/chat/completions';
    
    const requestBody = {
      model: params.model,
      messages: messages,
      temperature: params.temperature,
      max_tokens: params.maxTokens,
      stream: params.stream,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    if (!params.stream) {
      const data = await response.json();
      yield data.choices[0].message.content;
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
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
