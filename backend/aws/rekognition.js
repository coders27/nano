/**
 * AWS Rekognition Integration
 * OCR for code screenshots and diagram analysis
 */

import { RekognitionClient, DetectTextCommand, DetectLabelsCommand } from '@aws-sdk/client-rekognition';

/**
 * Initialize Rekognition client
 */
export function createRekognitionClient(region = 'ap-south-1') {
    return new RekognitionClient({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
}

/**
 * Extract text from code screenshot
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<Object>} Extracted text
 */
export async function extractTextFromImage(imageBuffer) {
    const client = createRekognitionClient();
    
    const command = new DetectTextCommand({
        Image: {
            Bytes: imageBuffer
        }
    });

    try {
        const response = await client.send(command);
        
        const lines = response.TextDetections
            .filter(text => text.Type === 'LINE')
            .map(text => ({
                text: text.DetectedText,
                confidence: text.Confidence
            }))
            .sort((a, b) => b.confidence - a.confidence);
        
        const fullText = lines.map(line => line.text).join('\n');
        
        return {
            fullText,
            lines,
            confidence: lines.length > 0 ? 
                lines.reduce((sum, line) => sum + line.confidence, 0) / lines.length : 0
        };
    } catch (error) {
        console.error('Rekognition text detection error:', error);
        throw error;
    }
}

/**
 * Analyze diagram or architecture image
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<Object>} Detected labels
 */
export async function analyzeDiagram(imageBuffer) {
    const client = createRekognitionClient();
    
    const command = new DetectLabelsCommand({
        Image: {
            Bytes: imageBuffer
        },
        MaxLabels: 20,
        MinConfidence: 70
    });

    try {
        const response = await client.send(command);
        
        return {
            labels: response.Labels.map(label => ({
                name: label.Name,
                confidence: label.Confidence,
                categories: label.Categories?.map(cat => cat.Name) || []
            }))
        };
    } catch (error) {
        console.error('Rekognition label detection error:', error);
        throw error;
    }
}

/**
 * Extract code from screenshot and analyze
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<Object>} Extracted code with analysis
 */
export async function extractAndAnalyzeCode(imageBuffer) {
    const textResult = await extractTextFromImage(imageBuffer);
    
    // Detect if it's code based on common patterns
    const codePatterns = [
        /function\s+\w+/,
        /const\s+\w+\s*=/,
        /class\s+\w+/,
        /import\s+.*from/,
        /def\s+\w+/,
        /public\s+class/
    ];
    
    const isCode = codePatterns.some(pattern => pattern.test(textResult.fullText));
    
    return {
        ...textResult,
        isCode,
        language: detectLanguage(textResult.fullText)
    };
}

/**
 * Detect programming language from text
 * @param {string} text - Code text
 * @returns {string} Detected language
 */
function detectLanguage(text) {
    if (/function\s+\w+|const\s+\w+|let\s+\w+/.test(text)) return 'javascript';
    if (/def\s+\w+|import\s+\w+/.test(text)) return 'python';
    if (/public\s+class|private\s+void/.test(text)) return 'java';
    if (/func\s+\w+|var\s+\w+/.test(text)) return 'go';
    return 'unknown';
}
