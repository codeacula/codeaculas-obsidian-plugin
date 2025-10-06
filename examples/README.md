# AI Personality Examples

This directory contains example AI personality notes that demonstrate how to configure different AI providers and settings.

## Example Files

### gemini-writer.md
A Gemini-based writing assistant with:
- Medium sensitivity settings for content filtering
- Temperature: 0.7 (balanced creativity)
- Focus on grammar, clarity, and maintaining voice

### openai-coder.md
An OpenAI GPT-4 based coding assistant with:
- Temperature: 0.3 (more deterministic for code)
- Higher token limit (2000) for detailed code explanations
- Focus on code review, best practices, and examples

### gemini-creative.md
A Gemini-based creative writing coach with:
- Temperature: 0.9 (maximum creativity)
- Lower sensitivity settings to allow more creative freedom
- Focus on narrative development and creative exploration

## Usage

1. Copy these examples to your Obsidian vault
2. Configure your API keys in plugin settings
3. Enable network requests in settings
4. Select text in any note
5. Run command: "Run AI with Personality…"
6. Choose one of these personality notes
7. The AI response will be inserted below your selection

## Creating Your Own

Use these as templates to create your own AI personalities. Adjust:
- **Provider**: OpenAI or Gemini
- **Model**: Different models have different capabilities
- **Temperature**: Lower for consistent, higher for creative
- **Sensitivity**: Gemini-specific content filtering
- **Prompt**: The system message that defines the AI's behavior
