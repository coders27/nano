/**
 * AWS Translate Integration
 * Multi-language support for Indic languages
 */

import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';

/**
 * Initialize Translate client
 */
export function createTranslateClient(region = 'ap-south-1') {
    return new TranslateClient({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
}

/**
 * Supported language codes
 */
export const LANGUAGE_CODES = {
    english: 'en',
    hindi: 'hi',
    tamil: 'ta',
    telugu: 'te',
    bengali: 'bn',
    marathi: 'mr',
    gujarati: 'gu',
    kannada: 'kn',
    malayalam: 'ml',
    punjabi: 'pa',
    urdu: 'ur'
};

/**
 * Translate text
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (default: auto-detect)
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLanguage, sourceLanguage = 'auto') {
    const client = createTranslateClient();

    const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: sourceLanguage,
        TargetLanguageCode: targetLanguage
    });

    try {
        const response = await client.send(command);
        return response.TranslatedText;
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

/**
 * Translate UI strings
 * @param {Object} strings - Object with English strings
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<Object>} Translated strings
 */
export async function translateUIStrings(strings, targetLanguage) {
    const translated = {};
    
    for (const [key, value] of Object.entries(strings)) {
        if (typeof value === 'string') {
            translated[key] = await translateText(value, targetLanguage, 'en');
        } else if (typeof value === 'object') {
            translated[key] = await translateUIStrings(value, targetLanguage);
        }
    }
    
    return translated;
}

/**
 * Batch translate
 * @param {Array<string>} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code
 * @returns {Promise<Array<string>>} Translated texts
 */
export async function batchTranslate(texts, targetLanguage, sourceLanguage = 'auto') {
    const promises = texts.map(text => translateText(text, targetLanguage, sourceLanguage));
    return await Promise.all(promises);
}

/**
 * Get language name
 * @param {string} code - Language code
 * @returns {string} Language name
 */
export function getLanguageName(code) {
    const names = {
        en: 'English',
        hi: 'हिंदी',
        ta: 'தமிழ்',
        te: 'తెలుగు',
        bn: 'বাংলা',
        mr: 'मराठी',
        gu: 'ગુજરાતી',
        kn: 'ಕನ್ನಡ',
        ml: 'മലയാളം',
        pa: 'ਪੰਜਾਬੀ',
        ur: 'اردو'
    };
    return names[code] || code;
}
