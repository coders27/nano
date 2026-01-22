/**
 * Text-to-Speech Routes - AWS Polly integration
 */

import express from 'express';
import { textToSpeech, explainCodeWithVoice, INDIC_VOICES } from '../aws/polly.js';

const router = express.Router();

/**
 * GET /tts/voices
 * Get available voices
 */
router.get('/voices', (req, res) => {
    res.json({
        success: true,
        voices: INDIC_VOICES
    });
});

/**
 * POST /tts/speak
 * Convert text to speech
 */
router.post('/speak', async (req, res) => {
    try {
        const { text, languageCode, format } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const audioBuffer = await textToSpeech(text, languageCode, { format });

        res.set({
            'Content-Type': `audio/${format || 'mp3'}`,
            'Content-Length': audioBuffer.length
        });
        res.send(audioBuffer);
    } catch (error) {
        console.error('TTS error:', error);
        res.status(500).json({
            error: 'Text-to-speech failed',
            message: error.message
        });
    }
});

/**
 * POST /tts/explain-code
 * Convert code explanation to speech
 */
router.post('/explain-code', async (req, res) => {
    try {
        const { explanation, languageCode } = req.body;

        if (!explanation) {
            return res.status(400).json({ error: 'Explanation is required' });
        }

        const audioBuffer = await explainCodeWithVoice(explanation, languageCode);

        res.set({
            'Content-Type': 'audio/mp3',
            'Content-Length': audioBuffer.length
        });
        res.send(audioBuffer);
    } catch (error) {
        console.error('Code explanation TTS error:', error);
        res.status(500).json({
            error: 'Code explanation TTS failed',
            message: error.message
        });
    }
});

export default router;
