/**
 * AWS Bedrock Integration
 * AI model integration for enhanced code generation and assistance
 */

import { BedrockRuntimeClient, InvokeModelCommand, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime';

/**
 * Initialize Bedrock client
 */
export function createBedrockClient(region = 'ap-south-1') {
    return new BedrockRuntimeClient({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
}

/**
 * Invoke Claude model via Bedrock
 * @param {string} prompt - User prompt
 * @param {Object} options - Model options
 * @returns {Promise<string>} AI response
 */
export async function invokeClaudeModel(prompt, options = {}) {
    const client = createBedrockClient(options.region);
    
    const modelId = options.modelId || 'anthropic.claude-3-5-sonnet-20241022-v2:0';
    
    const payload = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: options.maxTokens || 4096,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: options.temperature || 0.7
    };

    const command = new InvokeModelCommand({
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload)
    });

    try {
        const response = await client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        return responseBody.content[0].text;
    } catch (error) {
        console.error('Bedrock invocation error:', error);
        throw error;
    }
}

/**
 * Stream Claude model response
 * @param {string} prompt - User prompt
 * @param {Function} onChunk - Callback for each chunk
 * @param {Object} options - Model options
 */
export async function streamClaudeModel(prompt, onChunk, options = {}) {
    const client = createBedrockClient(options.region);
    
    const modelId = options.modelId || 'anthropic.claude-3-5-sonnet-20241022-v2:0';
    
    const payload = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: options.maxTokens || 4096,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: options.temperature || 0.7
    };

    const command = new InvokeModelWithResponseStreamCommand({
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload)
    });

    try {
        const response = await client.send(command);
        
        for await (const event of response.body) {
            if (event.chunk) {
                const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes));
                if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
                    onChunk(chunk.delta.text);
                }
            }
        }
    } catch (error) {
        console.error('Bedrock streaming error:', error);
        throw error;
    }
}

/**
 * Code analysis and suggestions
 * @param {string} code - Code to analyze
 * @param {string} language - Programming language
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeCode(code, language = 'javascript') {
    const prompt = `Analyze this ${language} code and provide:
1. Potential bugs or issues
2. Performance improvements
3. Security vulnerabilities
4. Best practice recommendations

Code:
\`\`\`${language}
${code}
\`\`\`

Provide response in JSON format with keys: bugs, performance, security, recommendations`;

    const response = await invokeClaudeModel(prompt, { temperature: 0.3 });
    
    try {
        return JSON.parse(response);
    } catch {
        return { analysis: response };
    }
}

/**
 * Generate code from natural language
 * @param {string} description - Code description
 * @param {string} language - Target language
 * @returns {Promise<string>} Generated code
 */
export async function generateCode(description, language = 'javascript') {
    const prompt = `Generate ${language} code for: ${description}

Requirements:
- Clean, readable code
- Include comments
- Follow best practices
- Handle edge cases

Provide only the code without explanations.`;

    return await invokeClaudeModel(prompt, { temperature: 0.5 });
}

/**
 * Translate code comments to Indic languages
 * @param {string} code - Code with English comments
 * @param {string} targetLanguage - Target language (hindi, tamil, etc.)
 * @returns {Promise<string>} Code with translated comments
 */
export async function translateCodeComments(code, targetLanguage) {
    const prompt = `Translate all comments in this code to ${targetLanguage}. Keep the code unchanged, only translate comments:

${code}

Provide the complete code with translated comments.`;

    return await invokeClaudeModel(prompt, { temperature: 0.3 });
}
