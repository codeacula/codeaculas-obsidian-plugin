# Obsidian Sample Plugin

This is a sample plugin for Obsidian (https://obsidian.md).

This project uses TypeScript to provide type checking and documentation.
The repo depends on the latest plugin API (obsidian.d.ts) in TypeScript Definition format, which contains TSDoc comments describing what it does.

This plugin demonstrates some of the basic functionality the plugin API can do.
- Process notes with automatic frontmatter and file organization
- AI Personality system with OpenAI and Gemini support
- AI-powered text generation with customizable personalities

## First time developing plugins?

Quick starting guide for new plugin devs:

- Check if [someone already developed a plugin for what you want](https://obsidian.md/plugins)! There might be an existing plugin similar enough that you can partner up with.
- Make a copy of this repo as a template with the "Use this template" button (login to GitHub if you don't see it).
- Clone your repo to a local development folder. For convenience, you can place this folder in your `.obsidian/plugins/your-plugin-name` folder.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## How to use

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint ./src/`

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
    "fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
    "fundingUrl": {
        "Buy Me a Coffee": "https://buymeacoffee.com",
        "GitHub Sponsor": "https://github.com/sponsors",
        "Patreon": "https://www.patreon.com/"
    }
}
```

## AI Personality Feature

This plugin includes an AI Personality system that allows you to create reusable AI personalities with custom prompts and settings.

### Setup

1. Enable network requests in plugin settings (**Settings → Codeacula's Obsidian Plugin → Allow network requests**)
2. Add your API keys:
   - **OpenAI API key** for GPT models (e.g., gpt-4, gpt-3.5-turbo)
   - **Gemini API key** for Google Gemini models (e.g., gemini-1.5-pro)

### Creating an AI Personality Note

Create a new note with the following frontmatter structure:

```yaml
---
note-type: ai-personality
provider: gemini
model: gemini-1.5-pro
temperature: 0.7
maxTokens: 1024
stream: true
output:
  target: insert
gemini:
  sensitivity:
    harassment: medium
    hate: medium
    sexual: medium
    dangerous: medium
---

You are a helpful writing assistant. Help the user improve their text while maintaining their original voice and intent.
```

### Frontmatter Schema

- **note-type** (required): Must be `ai-personality`
- **provider** (required): Either `openai` or `gemini`
- **model** (required): Model name (e.g., `gpt-4`, `gemini-1.5-pro`)
- **temperature** (optional): Creativity level, 0.0-1.0, default: 0.7
- **maxTokens** (optional): Maximum response length, default: 1024
- **stream** (optional): Enable streaming output, default: true
- **output.target** (optional): Output location, currently only `insert` supported
- **gemini.sensitivity** (optional): Gemini-specific content filtering settings
  - **harassment**: `none`, `low`, `medium`, `high`
  - **hate**: `none`, `low`, `medium`, `high`
  - **sexual**: `none`, `low`, `medium`, `high`
  - **dangerous**: `none`, `low`, `medium`, `high`

### Example: OpenAI Personality

```yaml
---
note-type: ai-personality
provider: openai
model: gpt-4
temperature: 0.8
maxTokens: 2000
stream: true
---

You are a creative writer. Help users craft engaging narratives with vivid descriptions and compelling characters.
```

### Usage

1. **Run AI with Personality…**: Opens a modal to select a personality note. Select text in your current note first.
2. **Re-run last Personality**: Quickly re-runs the last used personality.
3. **Use personality referenced by current note**: If your current note has `personality: path/to/persona.md` in its frontmatter, this command will use that personality.

The AI response will be inserted below your cursor (or below your selection) in the active note.

### Privacy and Network Usage

- Network calls are only made when explicitly enabled in settings
- API keys are stored locally in Obsidian's plugin data
- No data is sent to AI providers unless you explicitly run an AI command
- You control what text is sent by selecting it before running a command

## API Documentation

See https://github.com/obsidianmd/obsidian-api
