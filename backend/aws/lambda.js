/**
 * AWS Lambda Integration
 * Serverless code execution and testing
 */

import { LambdaClient, InvokeCommand, CreateFunctionCommand, UpdateFunctionCodeCommand } from '@aws-sdk/client-lambda';

/**
 * Initialize Lambda client
 */
export function createLambdaClient(region = 'ap-south-1') {
    return new LambdaClient({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
}

/**
 * Execute code in Lambda sandbox
 * @param {string} code - Code to execute
 * @param {string} language - Programming language
 * @param {Object} input - Input data
 * @returns {Promise<Object>} Execution result
 */
export async function executeCodeInSandbox(code, language = 'javascript', input = {}) {
    const client = createLambdaClient();
    
    // For demo purposes - in production, you'd have pre-deployed Lambda functions
    const functionName = `luma-code-executor-${language}`;
    
    const payload = {
        code,
        input,
        language
    };

    const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: JSON.stringify(payload)
    });

    try {
        const response = await client.send(command);
        const result = JSON.parse(new TextDecoder().decode(response.Payload));
        
        return {
            success: !response.FunctionError,
            output: result.output,
            error: result.error,
            executionTime: result.executionTime,
            memoryUsed: result.memoryUsed
        };
    } catch (error) {
        console.error('Lambda execution error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Test code with multiple test cases
 * @param {string} code - Code to test
 * @param {Array} testCases - Array of test cases
 * @param {string} language - Programming language
 * @returns {Promise<Object>} Test results
 */
export async function runTestCases(code, testCases, language = 'javascript') {
    const results = [];
    
    for (const testCase of testCases) {
        const result = await executeCodeInSandbox(code, language, testCase.input);
        
        results.push({
            name: testCase.name,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: result.output,
            passed: JSON.stringify(result.output) === JSON.stringify(testCase.expectedOutput),
            executionTime: result.executionTime,
            error: result.error
        });
    }
    
    const passedCount = results.filter(r => r.passed).length;
    
    return {
        totalTests: testCases.length,
        passed: passedCount,
        failed: testCases.length - passedCount,
        results,
        allPassed: passedCount === testCases.length
    };
}

/**
 * Benchmark code performance
 * @param {string} code - Code to benchmark
 * @param {Object} input - Input data
 * @param {number} iterations - Number of iterations
 * @returns {Promise<Object>} Benchmark results
 */
export async function benchmarkCode(code, input = {}, iterations = 10) {
    const executionTimes = [];
    
    for (let i = 0; i < iterations; i++) {
        const result = await executeCodeInSandbox(code, 'javascript', input);
        if (result.success) {
            executionTimes.push(result.executionTime);
        }
    }
    
    const avgTime = executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length;
    const minTime = Math.min(...executionTimes);
    const maxTime = Math.max(...executionTimes);
    
    return {
        iterations,
        averageTime: avgTime,
        minTime,
        maxTime,
        times: executionTimes
    };
}
