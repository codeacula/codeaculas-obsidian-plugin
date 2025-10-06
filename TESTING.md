# AI Personality Testing Guide

This document provides a comprehensive test plan for the AI Personality feature.

## Prerequisites

1. Install the plugin in Obsidian
2. Obtain API keys:
   - OpenAI API key from https://platform.openai.com/api-keys
   - Gemini API key from https://aistudio.google.com/app/apikey

## Setup Tests

### Test 1: Configure Settings
1. Open **Settings → Codeacula's Obsidian Plugin**
2. Enable "Allow network requests"
3. Enter your OpenAI API key
4. Enter your Gemini API key
5. Close settings
6. ✓ Settings should be saved and persist after reload

### Test 2: Copy Example Personalities
1. Copy files from `examples/` directory to your vault
2. Open each example file in Obsidian
3. ✓ Verify frontmatter displays correctly
4. ✓ Verify no syntax errors in frontmatter

## Command Tests

### Test 3: Run AI with Personality (Gemini)
1. Create a new note with some text
2. Select the text
3. Run command: "Run AI with Personality…"
4. Select `gemini-writer.md` from the modal
5. ✓ Modal should show personality files filtered by note-type
6. ✓ Loading notice should appear
7. ✓ Response should stream in below your selection
8. ✓ Final notice "AI response complete" should appear

### Test 4: Run AI with Personality (OpenAI)
1. Create a new note with a code snippet
2. Select the code
3. Run command: "Run AI with Personality…"
4. Select `openai-coder.md` from the modal
5. ✓ Response should stream in below your selection
6. ✓ Verify OpenAI model is used (check console if needed)

### Test 5: Re-run Last Personality
1. After running Test 3 or 4, select different text
2. Run command: "Re-run last Personality"
3. ✓ Same personality should be used without showing modal
4. ✓ Response should appear below cursor

### Test 6: Use Referenced Personality
1. Create a new note with frontmatter:
   ```yaml
   ---
   personality: examples/gemini-writer.md
   ---
   ```
2. Add some text in the note body and select it
3. Run command: "Use personality referenced by current note"
4. ✓ Should use the referenced personality without showing modal
5. ✓ Response should stream in

## Error Handling Tests

### Test 7: Network Disabled
1. Disable "Allow network requests" in settings
2. Try to run any AI command
3. ✓ Should show notice: "Network calls are disabled..."

### Test 8: Missing API Key
1. Enable network requests
2. Clear the OpenAI API key in settings
3. Try to use an OpenAI personality
4. ✓ Should show error: "OpenAI API key is not configured..."

### Test 9: Invalid Frontmatter
1. Create a note with incorrect frontmatter:
   ```yaml
   ---
   note-type: ai-personality
   provider: unknown-provider
   ---
   ```
2. Try to use it as a personality
3. ✓ Should show error about invalid provider

### Test 10: No Selection
1. Open a note without selecting text
2. Run "Run AI with Personality…"
3. Select a personality
4. ✓ Should show notice: "Please select some text to process"

### Test 11: Invalid Personality Reference
1. Create a note with non-existent personality reference:
   ```yaml
   ---
   personality: does-not-exist.md
   ---
   ```
2. Run "Use personality referenced by current note"
3. ✓ Should show error: "Personality file not found..."

## Sensitivity Settings Tests (Gemini Only)

### Test 12: High Sensitivity
1. Create a personality with all sensitivity set to "high"
2. Try with text that might be borderline
3. ✓ Gemini should be more restrictive

### Test 13: Low Sensitivity
1. Use `gemini-creative.md` (has lower sensitivity)
2. Try with creative/edgy content
3. ✓ Should allow more creative freedom

## Streaming Tests

### Test 14: Streaming Enabled
1. Use any personality with `stream: true`
2. Run the command
3. ✓ Text should appear progressively as it's generated

### Test 15: Streaming Disabled
1. Create a personality with `stream: false`
2. Run the command
3. ✓ Full response should appear at once after processing

## Configuration Tests

### Test 16: Temperature Effects
1. Use `gemini-creative.md` (temperature: 0.9)
2. Run multiple times with same input
3. ✓ Results should vary significantly (creative)
4. Use `openai-coder.md` (temperature: 0.3)
5. Run multiple times with same input
6. ✓ Results should be more consistent (deterministic)

### Test 17: Max Tokens
1. Create personality with low maxTokens (e.g., 100)
2. Request a long response
3. ✓ Response should be cut off at token limit

### Test 18: Custom Models
1. Update personality to use different models:
   - OpenAI: gpt-3.5-turbo, gpt-4
   - Gemini: gemini-1.5-pro, gemini-1.5-flash
2. ✓ Should work with different models
3. ✓ Performance/quality differences should be noticeable

## Integration Tests

### Test 19: Multiple Personalities
1. Run different personalities in sequence
2. ✓ Each should maintain its own behavior/style

### Test 20: Long Sessions
1. Process multiple texts in one session
2. ✓ Plugin should remain stable
3. ✓ No memory leaks or slowdowns

## Modal Tests

### Test 21: Search in Modal
1. Open "Run AI with Personality…"
2. Type to filter personalities
3. ✓ List should filter by filename

### Test 22: Modal with Many Personalities
1. Create 10+ personality notes
2. Open the modal
3. ✓ All should appear in the list
4. ✓ Only ai-personality notes should appear

## Expected Behaviors

- Responses always insert below cursor/selection
- Streaming shows text progressively
- Network calls only when enabled in settings
- Clear error messages for all failure cases
- API keys stored securely in Obsidian data
- No data sent without explicit user command

## Known Limitations

- Mobile support not implemented in MVP
- No templating variables in prompt bodies
- Output target is always "insert" (below cursor)
- Cannot edit text in place (append only)
