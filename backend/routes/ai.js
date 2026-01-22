/**
 * AI Routes - AWS Bedrock integration endpoints
 */

import express from 'express';
import { invokeClaudeModel, analyzeCode, generateCode, translateCodeComments } from '../aws/bedrock.js';

const router = express.Router();

/**
 * POST /ai/chat
 * Chat with AI model
 */
router.post('/chat', async (req, res) => {
    try {
        const { prompt, modelId, temperature, maxTokens } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const response = await invokeClaudeModel(prompt, {
            modelId,
            temperature,
            maxTokens
        });

        res.json({
            success: true,
            response,
            model: modelId || 'claude-3-5-sonnet'
        });
    } catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({
            error: 'AI chat failed',
            message: error.message
        });
    }
});

/**
 * POST /ai/analyze
 * Analyze code for bugs, performance, security
 */
router.post('/analyze', async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        const analysis = await analyzeCode(code, language);

        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('Code analysis error:', error);
        res.status(500).json({
            error: 'Code analysis failed',
            message: error.message
        });
    }
});

/**
 * POST /ai/generate
 * Generate code from description
 */
router.post('/generate', async (req, res) => {
    try {
        const { description, language } = req.body;

        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }

        const code = await generateCode(description, language);

        res.json({
            success: true,
            code,
            language: language || 'javascript'
        });
    } catch (error) {
        console.error('Code generation error:', error);
        res.status(500).json({
            error: 'Code generation failed',
            message: error.message
        });
    }
});

/**
 * POST /ai/translate-comments
 * Translate code comments to Indic languages
 */
router.post('/translate-comments', async (req, res) => {
    try {
        const { code, targetLanguage } = req.body;

        if (!code || !targetLanguage) {
            return res.status(400).json({ error: 'Code and target language are required' });
        }

        const translatedCode = await translateCodeComments(code, targetLanguage);

        res.json({
            success: true,
            code: translatedCode,
            targetLanguage
        });
    } catch (error) {
        console.error('Comment translation error:', error);
        res.status(500).json({
            error: 'Comment translation failed',
            message: error.message
        });
    }
});

export default router;
