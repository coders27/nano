/**
 * AI-Powered Learning Path
 * Personalized coding curriculum for Indian developers
 */

import { invokeClaudeModel } from '../aws/bedrock.js';

/**
 * Learning topics for different skill levels
 */
const LEARNING_TOPICS = {
    beginner: [
        'Variables and Data Types',
        'Control Flow (if/else, loops)',
        'Functions and Scope',
        'Arrays and Objects',
        'Basic DOM Manipulation',
        'Event Handling',
        'Async/Await Basics'
    ],
    intermediate: [
        'ES6+ Features',
        'Promises and Async Programming',
        'REST API Integration',
        'Error Handling',
        'Testing Basics',
        'Git and Version Control',
        'Package Management (npm/yarn)'
    ],
    advanced: [
        'Design Patterns',
        'Performance Optimization',
        'Security Best Practices',
        'Microservices Architecture',
        'CI/CD Pipelines',
        'Cloud Deployment (AWS)',
        'System Design'
    ]
};

/**
 * Assess user's coding level
 * @param {string} code - User's code sample
 * @param {Array} answers - Quiz answers
 * @returns {Promise<Object>} Assessment result
 */
export async function assessCodingLevel(code, answers = []) {
    const prompt = `Analyze this code and determine the developer's skill level (beginner/intermediate/advanced):

Code:
\`\`\`javascript
${code}
\`\`\`

Quiz Answers: ${JSON.stringify(answers)}

Provide assessment in JSON format:
{
  "level": "beginner|intermediate|advanced",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "score": 0-100,
  "reasoning": "explanation"
}`;

    const response = await invokeClaudeModel(prompt, { temperature: 0.3 });
    
    try {
        return JSON.parse(response);
    } catch {
        return {
            level: 'beginner',
            strengths: [],
            weaknesses: [],
            score: 50,
            reasoning: response
        };
    }
}

/**
 * Generate personalized learning path
 * @param {Object} assessment - User assessment
 * @param {string} goal - Learning goal
 * @param {string} language - Preferred language
 * @returns {Promise<Object>} Learning path
 */
export async function generateLearningPath(assessment, goal = 'full-stack', language = 'hindi') {
    const topics = LEARNING_TOPICS[assessment.level] || LEARNING_TOPICS.beginner;
    
    const prompt = `Create a personalized learning path for an Indian developer:

Current Level: ${assessment.level}
Strengths: ${assessment.strengths.join(', ')}
Weaknesses: ${assessment.weaknesses.join(', ')}
Goal: ${goal}
Preferred Language: ${language}

Topics to cover: ${topics.join(', ')}

Create a 30-day learning plan with:
- Daily topics
- Practice exercises
- Real-world projects
- Resources in ${language}

Format as JSON with structure:
{
  "duration": "30 days",
  "weeks": [
    {
      "week": 1,
      "focus": "topic",
      "days": [
        {
          "day": 1,
          "topic": "topic name",
          "description": "what to learn",
          "exercises": ["exercise1", "exercise2"],
          "resources": ["resource1", "resource2"]
        }
      ]
    }
  ],
  "projects": ["project1", "project2"],
  "milestones": ["milestone1", "milestone2"]
}`;

    const response = await invokeClaudeModel(prompt, { 
        temperature: 0.7,
        maxTokens: 4096 
    });
    
    try {
        return JSON.parse(response);
    } catch {
        return {
            duration: '30 days',
            weeks: [],
            projects: [],
            milestones: [],
            rawPlan: response
        };
    }
}

/**
 * Get daily coding challenge
 * @param {string} level - Skill level
 * @param {string} language - Preferred language
 * @returns {Promise<Object>} Daily challenge
 */
export async function getDailyChallenge(level = 'beginner', language = 'hindi') {
    const prompt = `Create a coding challenge for ${level} level developer in ${language}:

Requirements:
- Problem statement in ${language}
- Example input/output
- Hints
- Solution approach (don't give full solution)
- Time complexity to aim for

Format as JSON:
{
  "title": "challenge title",
  "description": "problem in ${language}",
  "difficulty": "${level}",
  "examples": [
    {"input": "example", "output": "result"}
  ],
  "hints": ["hint1", "hint2"],
  "approach": "how to solve",
  "timeComplexity": "O(n)"
}`;

    const response = await invokeClaudeModel(prompt, { temperature: 0.8 });
    
    try {
        return JSON.parse(response);
    } catch {
        return {
            title: 'Daily Challenge',
            description: response,
            difficulty: level
        };
    }
}

/**
 * Track learning progress
 * @param {string} userId - User ID
 * @param {Object} activity - Learning activity
 * @returns {Object} Progress update
 */
export function trackProgress(userId, activity) {
    // In production, store in DynamoDB
    const progress = {
        userId,
        activity: activity.type, // 'challenge_completed', 'lesson_finished', 'project_done'
        topic: activity.topic,
        score: activity.score,
        timestamp: new Date(),
        timeSpent: activity.timeSpent
    };
    
    return {
        success: true,
        progress,
        nextRecommendation: getNextRecommendation(userId)
    };
}

/**
 * Get next recommendation
 * @param {string} userId - User ID
 * @returns {Object} Next recommendation
 */
function getNextRecommendation(userId) {
    // Simplified - in production, use ML model
    return {
        type: 'challenge',
        topic: 'Arrays',
        difficulty: 'intermediate',
        estimatedTime: '30 minutes'
    };
}

/**
 * Get learning statistics
 * @param {string} userId - User ID
 * @returns {Object} Statistics
 */
export function getLearningStats(userId) {
    // In production, query from database
    return {
        totalChallenges: 45,
        completed: 32,
        streak: 7, // days
        totalTime: 2400, // minutes
        level: 'intermediate',
        badges: ['7-day-streak', 'first-project', '50-challenges'],
        nextMilestone: {
            name: '100 Challenges',
            progress: 32,
            target: 100
        }
    };
}
