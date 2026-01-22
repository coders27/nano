/**
 * Collaboration Routes - Real-time coding sessions
 */

import express from 'express';
import {
    createSession,
    joinSession,
    updateSessionCode,
    addAISuggestion,
    getSession,
    leaveSession,
    getActiveSessions
} from '../features/codeCollaboration.js';

const router = express.Router();

/**
 * POST /collaboration/create
 * Create new collaboration session
 */
router.post('/create', (req, res) => {
    try {
        const { hostId, name, language, code, maxParticipants, allowEditing, aiAssistance } = req.body;

        if (!hostId) {
            return res.status(400).json({ error: 'Host ID is required' });
        }

        const result = createSession(hostId, {
            name,
            language,
            code,
            maxParticipants,
            allowEditing,
            aiAssistance
        });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
            error: 'Failed to create session',
            message: error.message
        });
    }
});

/**
 * POST /collaboration/join
 * Join collaboration session
 */
router.post('/join', (req, res) => {
    try {
        const { sessionId, userId, userName } = req.body;

        if (!sessionId || !userId || !userName) {
            return res.status(400).json({ error: 'Session ID, user ID, and user name are required' });
        }

        const result = joinSession(sessionId, userId, userName);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Join session error:', error);
        res.status(500).json({
            error: 'Failed to join session',
            message: error.message
        });
    }
});

/**
 * PUT /collaboration/update-code
 * Update code in session
 */
router.put('/update-code', (req, res) => {
    try {
        const { sessionId, userId, code } = req.body;

        if (!sessionId || !userId || !code) {
            return res.status(400).json({ error: 'Session ID, user ID, and code are required' });
        }

        const result = updateSessionCode(sessionId, userId, code);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Update code error:', error);
        res.status(500).json({
            error: 'Failed to update code',
            message: error.message
        });
    }
});

/**
 * POST /collaboration/ai-suggestion
 * Add AI suggestion to session
 */
router.post('/ai-suggestion', (req, res) => {
    try {
        const { sessionId, suggestion } = req.body;

        if (!sessionId || !suggestion) {
            return res.status(400).json({ error: 'Session ID and suggestion are required' });
        }

        const result = addAISuggestion(sessionId, suggestion);

        res.json({
            success: true,
            suggestion: result
        });
    } catch (error) {
        console.error('AI suggestion error:', error);
        res.status(500).json({
            error: 'Failed to add AI suggestion',
            message: error.message
        });
    }
});

/**
 * GET /collaboration/session/:sessionId
 * Get session details
 */
router.get('/session/:sessionId', (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = getSession(sessionId);

        res.json({
            success: true,
            session
        });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({
            error: 'Failed to get session',
            message: error.message
        });
    }
});

/**
 * POST /collaboration/leave
 * Leave session
 */
router.post('/leave', (req, res) => {
    try {
        const { sessionId, userId } = req.body;

        if (!sessionId || !userId) {
            return res.status(400).json({ error: 'Session ID and user ID are required' });
        }

        leaveSession(sessionId, userId);

        res.json({
            success: true,
            message: 'Left session successfully'
        });
    } catch (error) {
        console.error('Leave session error:', error);
        res.status(500).json({
            error: 'Failed to leave session',
            message: error.message
        });
    }
});

/**
 * GET /collaboration/active
 * Get active sessions
 */
router.get('/active', (req, res) => {
    try {
        const sessions = getActiveSessions();

        res.json({
            success: true,
            sessions
        });
    } catch (error) {
        console.error('Get active sessions error:', error);
        res.status(500).json({
            error: 'Failed to get active sessions',
            message: error.message
        });
    }
});

export default router;
