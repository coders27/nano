/**
 * AWS Polly Integration
 * Text-to-speech for Indic languages
 */

import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

/**
 * Initialize Polly client
 */
export function createPollyClient(region = 'ap-south-1') {
    return new PollyClient({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
}

/**
 * Supported voices for Indic languages
 */
export const INDIC_VOICES = {
    'hi-IN': { id: 'Aditi', name: 'Aditi (Hindi)', gender: 'Female' },
    'en-IN': { id: 'Raveena', name: 'Raveena (English India)', gender: 'Female' },
    'en-IN-male': { id: 'Kajal', name: 'Kajal (English India)', gender: 'Female' }
};

/**
 * Convert text to speech
 * @param {string} text - Text to convert
 * @param {string} languageCode - Language code (e.g., 'hi-IN')
 * @param {Object} options - Additional options
 * @returns {Promise<Buffer>} Audio buffer
 */
export async function textToSpeech(text, languageCode = 'hi-IN', options = {}) {
    const client = createPollyClient(options.region);
    
    const voice = INDIC_VOICES[languageCode] || INDIC_VOICES['hi-IN'];
    
    const command = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: options.format || 'mp3',
        VoiceId: voice.id,
        Engine: options.engine || 'neural',
        LanguageCode: languageCode
    });

    try {
        const response = await client.send(command);
        const chunks = [];
        
        for await (const chunk of response.AudioStream) {
            chunks.push(chunk);
        }
        
        return Buffer.concat(chunks);
    } catch (error) {
        console.error('Polly TTS error:', error);
        throw error;
    }
}

/**
 * Convert code explanation to speech
 * @param {string} explanation - Code explanation text
 * @param {string} languageCode - Language code
 * @returns {Promise<Buffer>} Audio buffer
 */
export async function explainCodeWithVoice(explanation, languageCode = 'hi-IN') {
    return await textToSpeech(explanation, languageCode, {
        engine: 'neural'
    });
}

/**
 * Generate SSML for better pronunciation
 * @param {string} text - Text to convert
 * @param {Object} options - SSML options
 * @returns {string} SSML formatted text
 */
export function generateSSML(text, options = {}) {
    const rate = options.rate || 'medium';
    const pitch = options.pitch || 'medium';
    
    return `<speak>
        <prosody rate="${rate}" pitch="${pitch}">
            ${text}
        </prosody>
    </speak>`;
}
