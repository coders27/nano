/**
 * Translation Routes - AWS Translate integration
 */

import express from 'express';
import { translateText, translateUIStrings, batchTranslate, LANGUAGE_CODES, getLanguageName } from '../aws/translate.js';

const router = express.Router();

/**
 * GET /translate/languages
 * Get supported languages
 */
router.get('/languages', (req, res) => {
    const languages = Object.entries(LANGUAGE_CODES).map(([name, code]) => ({
        code,
        name,
        displayName: getLanguageName(code)
    }));

    res.json({
        success: true,
        languages
    });
});

/**
 * POST /translate/text
 * Translate text
 */
router.post('/text', async (req, res) => {
    try {
        const { text, targetLanguage, sourceLanguage } = req.body;

        if (!text || !targetLanguage) {
            return res.status(400).json({ error: 'Text and target language are required' });
        }

        const translated = await translateText(text, targetLanguage, sourceLanguage);

        res.json({
            success: true,
            original: text,
            translated,
            sourceLanguage: sourceLanguage || 'auto',
            targetLanguage
        });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({
            error: 'Translation failed',
            message: error.message
        });
    }
});

/**
 * POST /translate/batch
 * Batch translate multiple texts
 */
router.post('/batch', async (req, res) => {
    try {
        const { texts, targetLanguage, sourceLanguage } = req.body;

        if (!texts || !Array.isArray(texts) || !targetLanguage) {
            return res.status(400).json({ error: 'Texts array and target language are required' });
        }

        const translated = await batchTranslate(texts, targetLanguage, sourceLanguage);

        res.json({
            success: true,
            original: texts,
            translated,
            count: translated.length,
            targetLanguage
        });
    } catch (error) {
        console.error('Batch translation error:', error);
        res.status(500).json({
            error: 'Batch translation failed',
            message: error.message
        });
    }
});

/**
 * POST /translate/ui
 * Translate UI strings
 */
router.post('/ui', async (req, res) => {
    try {
        const { strings, targetLanguage } = req.body;

        if (!strings || !targetLanguage) {
            return res.status(400).json({ error: 'Strings object and target language are required' });
        }

        const translated = await translateUIStrings(strings, targetLanguage);

        res.json({
            success: true,
            translated,
            targetLanguage
        });
    } catch (error) {
        console.error('UI translation error:', error);
        res.status(500).json({
            error: 'UI translation failed',
            message: error.message
        });
    }
});

export default router;
