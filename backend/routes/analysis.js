/**
 * Code Analysis Routes - AWS Comprehend integration
 */

import express from 'express';
import { analyzeSentiment, detectEntities, extractKeyPhrases, analyzeCodeReviewComment } from '../aws/comprehend.js';

const router = express.Router();

/**
 * POST /analysis/sentiment
 * Analyze sentiment of text
 */
router.post('/sentiment', async (req, res) => {
    try {
        const { text, languageCode } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const sentiment = await analyzeSentiment(text, languageCode);

        res.json({
            success: true,
            sentiment
        });
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        res.status(500).json({
            error: 'Sentiment analysis failed',
            message: error.message
        });
    }
});

/**
 * POST /analysis/entities
 * Detect entities in text
 */
router.post('/entities', async (req, res) => {
    try {
        const { text, languageCode } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const entities = await detectEntities(text, languageCode);

        res.json({
            success: true,
            entities
        });
    } catch (error) {
        console.error('Entity detection error:', error);
        res.status(500).json({
            error: 'Entity detection failed',
            message: error.message
        });
    }
});

/**
 * POST /analysis/key-phrases
 * Extract key phrases from text
 */
router.post('/key-phrases', async (req, res) => {
    try {
        const { text, languageCode } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const keyPhrases = await extractKeyPhrases(text, languageCode);

        res.json({
            success: true,
            keyPhrases
        });
    } catch (error) {
        console.error('Key phrase extraction error:', error);
        res.status(500).json({
            error: 'Key phrase extraction failed',
            message: error.message
        });
    }
});

/**
 * POST /analysis/code-review
 * Analyze code review comment
 */
router.post('/code-review', async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ error: 'Comment is required' });
        }

        const analysis = await analyzeCodeReviewComment(comment);

        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('Code review analysis error:', error);
        res.status(500).json({
            error: 'Code review analysis failed',
            message: error.message
        });
    }
});

export default router;
