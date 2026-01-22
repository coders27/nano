/**
 * Real-time Code Collaboration Features
 * Multi-user coding sessions with AI assistance
 */

import { v4 as uuidv4 } from 'uuid';

// In-memory storage (use Redis/DynamoDB in production)
const sessions = new Map();
const users = new Map();

/**
 * Create a new collaboration session
 * @param {string} hostId - Host user ID
 * @param {Object} options - Session options
 * @returns {Object} Session details
 */
export function createSession(hostId, options = {}) {
    const sessionId = uuidv4();
    
    const session = {
        id: sessionId,
        hostId,
        name: options.name || 'Untitled Session',
        language: options.language || 'javascript',
        code: options.code || '',
        participants: [hostId],
        createdAt: new Date(),
        isActive: true,
        settings: {
            maxParticipants: options.maxParticipants || 10,
            allowEditing: options.allowEditing !== false,
            aiAssistance: options.aiAssistance !== false
        }
    };
    
    sessions.set(sessionId, session);
    
    return {
        sessionId,
        joinUrl: `${process.env.BASE_URL}/session/${sessionId}`,
        session
    };
}

/**
 * Join a collaboration session
 * @param {string} sessionId - Session ID
 * @param {string} userId - User ID
 * @param {string} userName - User name
 * @returns {Object} Session details
 */
export function joinSession(sessionId, userId, userName) {
    const session = sessions.get(sessionId);
    
    if (!session) {
        throw new Error('Session not found');
    }
    
    if (!session.isActive) {
        throw new Error('Session is no longer active');
    }
    
    if (session.participants.length >= session.settings.maxParticipants) {
        throw new Error('Session is full');
    }
    
    if (!session.participants.includes(userId)) {
        session.participants.push(userId);
    }
    
    users.set(userId, {
        id: userId,
        name: userName,
        sessionId,
        joinedAt: new Date()
    });
    
    return {
        session,
        participants: session.participants.map(id => users.get(id))
    };
}

/**
 * Update code in session
 * @param {string} sessionId - Session ID
 * @param {string} userId - User ID
 * @param {string} code - Updated code
 * @returns {Object} Update result
 */
export function updateSessionCode(sessionId, userId, code) {
    const session = sessions.get(sessionId);
    
    if (!session) {
        throw new Error('Session not found');
    }
    
    if (!session.participants.includes(userId)) {
        throw new Error('User not in session');
    }
    
    if (!session.settings.allowEditing && userId !== session.hostId) {
        throw new Error('Only host can edit');
    }
    
    session.code = code;
    session.lastUpdatedBy = userId;
    session.lastUpdatedAt = new Date();
    
    return {
        success: true,
        code: session.code,
        updatedBy: users.get(userId)?.name
    };
}

/**
 * Add AI suggestion to session
 * @param {string} sessionId - Session ID
 * @param {string} suggestion - AI suggestion
 * @returns {Object} Suggestion details
 */
export function addAISuggestion(sessionId, suggestion) {
    const session = sessions.get(sessionId);
    
    if (!session) {
        throw new Error('Session not found');
    }
    
    if (!session.aiSuggestions) {
        session.aiSuggestions = [];
    }
    
    const suggestionObj = {
        id: uuidv4(),
        text: suggestion,
        timestamp: new Date(),
        applied: false
    };
    
    session.aiSuggestions.push(suggestionObj);
    
    return suggestionObj;
}

/**
 * Get session details
 * @param {string} sessionId - Session ID
 * @returns {Object} Session details
 */
export function getSession(sessionId) {
    const session = sessions.get(sessionId);
    
    if (!session) {
        throw new Error('Session not found');
    }
    
    return {
        ...session,
        participants: session.participants.map(id => users.get(id))
    };
}

/**
 * Leave session
 * @param {string} sessionId - Session ID
 * @param {string} userId - User ID
 */
export function leaveSession(sessionId, userId) {
    const session = sessions.get(sessionId);
    
    if (session) {
        session.participants = session.participants.filter(id => id !== userId);
        
        // Close session if host leaves
        if (userId === session.hostId) {
            session.isActive = false;
        }
        
        // Delete session if empty
        if (session.participants.length === 0) {
            sessions.delete(sessionId);
        }
    }
    
    users.delete(userId);
}

/**
 * Get active sessions
 * @returns {Array} Active sessions
 */
export function getActiveSessions() {
    return Array.from(sessions.values())
        .filter(session => session.isActive)
        .map(session => ({
            id: session.id,
            name: session.name,
            language: session.language,
            participants: session.participants.length,
            maxParticipants: session.settings.maxParticipants,
            createdAt: session.createdAt
        }));
}
