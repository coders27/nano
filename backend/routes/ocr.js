/**
 * OCR Routes - AWS Rekognition integration
 */

import express from 'express';
import multer from 'multer';
import { extractTextFromImage, analyzeDiagram, extractAndAnalyzeCode } from '../aws/rekognition.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /ocr/extract-text
 * Extract text from image
 */
router.post('/extract-text', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const result = await extractTextFromImage(req.file.buffer);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Text extraction error:', error);
        res.status(500).json({
            error: 'Text extraction failed',
            message: error.message
        });
    }
});

/**
 * POST /ocr/analyze-diagram
 * Analyze diagram or architecture image
 */
router.post('/analyze-diagram', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const result = await analyzeDiagram(req.file.buffer);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Diagram analysis error:', error);
        res.status(500).json({
            error: 'Diagram analysis failed',
            message: error.message
        });
    }
});

/**
 * POST /ocr/extract-code
 * Extract code from screenshot
 */
router.post('/extract-code', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const result = await extractAndAnalyzeCode(req.file.buffer);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Code extraction error:', error);
        res.status(500).json({
            error: 'Code extraction failed',
            message: error.message
        });
    }
});

export default router;
