/**
 * Learning Path Routes - AI-powered personalized learning
 */

import express from 'express';
import {
    assessCodingLevel,
    generateLearningPath,
    getDailyChallenge,
    trackProgress,
    getLearningStats
} from '../features/learningPath.js';

const router = express.Router();

/**
 * POST /learning/assess
 * Assess user's coding level
 */
router.post('/assess', async (req, res) => {
    try {
        const { code, answers } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Code sample is required' });
        }

        const assessment = await assessCodingLevel(code, answers);

        res.json({
            success: true,
            assessment
        });
    } catch (error) {
        console.error('Assessment error:', error);
        res.status(500).json({
            error: 'Assessment failed',
            message: error.message
        });
    }
});

/**
 * POST /learning/generate-path
 * Generate personalized learning path
 */
router.post('/generate-path', async (req, res) => {
    try {
        const { assessment, goal, language } = req.body;

        if (!assessment) {
            return res.status(400).json({ error: 'Assessment is required' });
        }

        const learningPath = await generateLearningPath(assessment, goal, language);

        res.json({
            success: true,
            learningPath
        });
    } catch (error) {
        console.error('Learning path generation error:', error);
        res.status(500).json({
            error: 'Learning path generation failed',
            message: error.message
        });
    }
});

/**
 * GET /learning/daily-challenge
 * Get daily coding challenge
 */
router.get('/daily-challenge', async (req, res) => {
    try {
        const { level, language } = req.query;

        const challenge = await getDailyChallenge(level, language);

        res.json({
            success: true,
            challenge
        });
    } catch (error) {
        console.error('Daily challenge error:', error);
        res.status(500).json({
            error: 'Failed to get daily challenge',
            message: error.message
        });
    }
});

/**
 * POST /learning/track-progress
 * Track learning progress
 */
router.post('/track-progress', (req, res) => {
    try {
        const { userId, activity } = req.body;

        if (!userId || !activity) {
            return res.status(400).json({ error: 'User ID and activity are required' });
        }

        const result = trackProgress(userId, activity);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Track progress error:', error);
        res.status(500).json({
            error: 'Failed to track progress',
            message: error.message
        });
    }
});

/**
 * GET /learning/stats/:userId
 * Get learning statistics
 */
router.get('/stats/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        const stats = getLearningStats(userId);

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            error: 'Failed to get statistics',
            message: error.message
        });
    }
});

export default router;
