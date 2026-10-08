<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/82fd876e-f616-407b-8617-44ceb69e8cff

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and set `GEMINI_API_KEY` to your Gemini API key. Keep it server-only; do not add the `NEXT_PUBLIC_` prefix.
3. Run the app:
   `npm run dev`

The public chatbot uses `GEMINI_API_KEY` for text replies and creates a short-lived, single-use Gemini Live token for microphone conversations. Voice chat requires microphone permission and a secure browser context (localhost or HTTPS). The browser never receives the server API key.
