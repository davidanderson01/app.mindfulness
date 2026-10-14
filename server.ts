

// Add your instrumentation key or use the APPLICATIONINSIGHTSKEY environment variable on your production machine to start collecting data.
var ai = require('applicationinsights');
ai.setup(process.env.APPLICATIONINSIGHTSKEY || 'your_instrumentation_key').start();import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI server-side with user's GEMINI_API_KEY
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please configure it in AI Studio Secrets.');
  }
  return new GoogleGenAI({ apiKey });
};

// API Route: Generate Music via Lyria
app.post('/api/generate-music', async (req, res) => {
  const { prompt, model = 'lyria-3-clip-preview' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'A text prompt is required for music generation.' });
  }

  try {
    const ai = getAiClient();
    const selectedModel = model === 'lyria-3-pro-preview' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

    console.log(`[Lyria] Starting music generation with model: ${selectedModel}, prompt: "${prompt}"`);

    const response = await ai.models.generateContentStream({
      model: selectedModel,
      contents: prompt,
      config: {
        responseModalities: [Modality.AUDIO],
      },
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      return res.status(502).json({
        error: 'No audio stream returned from the Lyria model. Please verify API key permissions.',
      });
    }

    console.log(`[Lyria] Successfully generated audio (${Math.round(audioBase64.length / 1024)} KB)`);

    return res.json({
      audioBase64,
      mimeType,
      lyrics: lyrics || 'Ambient meditation composition with no spoken lyrics.',
      prompt,
      model: selectedModel,
    });
  } catch (error: any) {
    console.error('[Lyria] Error generating music:', error);
    const errorMessage = error?.message || 'Failed to generate song with Lyria';
    const isPaidKeyIssue =
      errorMessage.includes('403') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('BILLING') ||
      errorMessage.includes('paid');

    return res.status(500).json({
      error: errorMessage,
      requiresPaidKey: isPaidKeyIssue,
    });
  }
});

// Mount Vite middleware in development or static dist in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Elevate-Mindfulness server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
