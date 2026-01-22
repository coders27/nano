/**
 * Routes Module - Route aggregator
 */

import { createChatRouter } from './chat.js';
import { createSettingsRouter } from './settings.js';
import { createInteractionsRouter } from './interactions.js';
import { createSystemRouter } from './system.js';
import { createWorkspaceRouter } from './workspace.js';
import aiRouter from './ai.js';
import voiceRouter from './voice.js';
import translateRouter from './translate.js';
import ttsRouter from './tts.js';
import analysisRouter from './analysis.js';
import ocrRouter from './ocr.js';
import collaborationRouter from './collaboration.js';
import learningRouter from './learning.js';

/**
 * Register all routes on an Express app
 * @param {Object} app - Express app
 * @param {Object} options - Route options
 * @param {Object} options.cdpManager - CDP manager instance
 * @param {boolean} options.hasSSL - Whether SSL is enabled
 */
export function registerRoutes(app, options = {}) {
    const { cdpManager, hasSSL } = options;

    // Chat routes
    app.use(createChatRouter({ cdpManager }));

    // Settings routes
    app.use(createSettingsRouter({ cdpManager }));

    // Interactions routes
    app.use(createInteractionsRouter({ cdpManager }));

    // Workspace routes
    app.use(createWorkspaceRouter({ cdpManager }));

    // System routes
    app.use(createSystemRouter({ cdpManager, hasSSL }));

    // AWS AI routes
    app.use('/ai', aiRouter);
    app.use('/voice', voiceRouter);
    app.use('/translate', translateRouter);
    app.use('/tts', ttsRouter);
    app.use('/analysis', analysisRouter);
    app.use('/ocr', ocrRouter);
    
    // Feature routes
    app.use('/collaboration', collaborationRouter);
    app.use('/learning', learningRouter);
}

export {
    createChatRouter,
    createSettingsRouter,
    createInteractionsRouter,
    createSystemRouter,
    createWorkspaceRouter
};
