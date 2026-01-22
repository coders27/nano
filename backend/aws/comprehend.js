/**
 * AWS Comprehend Integration
 * Sentiment analysis and entity detection for code reviews
 */

import { ComprehendClient, DetectSentimentCommand, DetectEntitiesCommand, DetectKeyPhrasesCommand } from '@aws-sdk/client-comprehend';

/**
 * Initialize Comprehend client
 */
export function createComprehendClient(region = 'ap-south-1') {
    return new ComprehendClient({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
}

/**
 * Analyze sentiment of code comments or commit messages
 * @param {string} text - Text to analyze
 * @param {string} languageCode - Language code (default: 'en')
 * @returns {Promise<Object>} Sentiment analysis
 */
export async function analyzeSentiment(text, languageCode = 'en') {
    const client = createComprehendClient();
    
    const command = new DetectSentimentCommand({
        Text: text,
        LanguageCode: languageCode
    });

    try {
        const response = await client.send(command);
        return {
            sentiment: response.Sentiment,
            scores: response.SentimentScore,
            positive: response.SentimentScore.Positive,
            negative: response.SentimentScore.Negative,
            neutral: response.SentimentScore.Neutral,
            mixed: response.SentimentScore.Mixed
        };
    } catch (error) {
        console.error('Comprehend sentiment error:', error);
        throw error;
    }
}

/**
 * Detect entities in code documentation
 * @param {string} text - Text to analyze
 * @param {string} languageCode - Language code
 * @returns {Promise<Array>} Detected entities
 */
export async function detectEntities(text, languageCode = 'en') {
    const client = createComprehendClient();
    
    const command = new DetectEntitiesCommand({
        Text: text,
        LanguageCode: languageCode
    });

    try {
        const response = await client.send(command);
        return response.Entities.map(entity => ({
            text: entity.Text,
            type: entity.Type,
            score: entity.Score
        }));
    } catch (error) {
        console.error('Comprehend entities error:', error);
        throw error;
    }
}

/**
 * Extract key phrases from code documentation
 * @param {string} text - Text to analyze
 * @param {string} languageCode - Language code
 * @returns {Promise<Array>} Key phrases
 */
export async function extractKeyPhrases(text, languageCode = 'en') {
    const client = createComprehendClient();
    
    const command = new DetectKeyPhrasesCommand({
        Text: text,
        LanguageCode: languageCode
    });

    try {
        const response = await client.send(command);
        return response.KeyPhrases.map(phrase => ({
            text: phrase.Text,
            score: phrase.Score
        }));
    } catch (error) {
        console.error('Comprehend key phrases error:', error);
        throw error;
    }
}

/**
 * Analyze code review comment sentiment
 * @param {string} comment - Review comment
 * @returns {Promise<Object>} Analysis with suggestions
 */
export async function analyzeCodeReviewComment(comment) {
    const sentiment = await analyzeSentiment(comment);
    const keyPhrases = await extractKeyPhrases(comment);
    
    let suggestion = '';
    if (sentiment.sentiment === 'NEGATIVE' && sentiment.negative > 0.7) {
        suggestion = 'Consider rephrasing this comment to be more constructive';
    } else if (sentiment.sentiment === 'POSITIVE' && sentiment.positive > 0.8) {
        suggestion = 'Great positive feedback!';
    }
    
    return {
        sentiment,
        keyPhrases,
        suggestion,
        tone: sentiment.sentiment.toLowerCase()
    };
}
