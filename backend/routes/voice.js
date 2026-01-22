/**
 * Voice Routes - AWS Transcribe integration
 */

import express from 'express';
import multer from 'multer';
import { transcribeAudio, SUPPORTED_LANGUAGES } from '../aws/transcribe.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * GET /voice/languages
 * Get supported languages
 */
router.get('/languages', (req, res) => {
    res.json({
        success: true,
        languages: SUPPORTED_LANGUAGES
    });
});

/**
 * POST /voice/transcribe
 * Transcribe audio to text
 */
router.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Audio file is required' });
        }

        const languageCode = req.body.language || 'hi-IN';

        if (!SUPPORTED_LANGUAGES[languageCode]) {
            return res.status(400).json({ 
                error: 'Unsupported language',
                supported: Object.keys(SUPPORTED_LANGUAGES)
            });
        }

        const text = await transcribeAudio(req.file.buffer, languageCode);

        res.json({
            success: true,
            text,
            language: SUPPORTED_LANGUAGES[languageCode]
        });
    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({
            error: 'Transcription failed',
            message: error.message
        });
    }
});

export default router;
