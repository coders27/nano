/**
 * AWS Transcribe Integration
 * Voice-to-text for Indic languages
 */

import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Initialize Transcribe client
 */
export function createTranscribeClient(region = 'ap-south-1') {
    return new TranscribeClient({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
}

/**
 * Initialize S3 client
 */
export function createS3Client(region = 'ap-south-1') {
    return new S3Client({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
}

/**
 * Supported Indic languages for transcription
 */
export const SUPPORTED_LANGUAGES = {
    'hi-IN': 'Hindi',
    'ta-IN': 'Tamil',
    'te-IN': 'Telugu',
    'bn-IN': 'Bengali',
    'mr-IN': 'Marathi',
    'gu-IN': 'Gujarati',
    'kn-IN': 'Kannada',
    'ml-IN': 'Malayalam',
    'en-IN': 'English (India)'
};

/**
 * Upload audio to S3
 * @param {Buffer} audioBuffer - Audio file buffer
 * @param {string} fileName - File name
 * @returns {Promise<string>} S3 URI
 */
export async function uploadAudioToS3(audioBuffer, fileName) {
    const s3Client = createS3Client();
    const bucketName = process.env.AWS_S3_BUCKET || 'luma-cli-audio';
    
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `audio/${fileName}`,
        Body: audioBuffer,
        ContentType: 'audio/wav'
    });

    await s3Client.send(command);
    return `s3://${bucketName}/audio/${fileName}`;
}

/**
 * Start transcription job
 * @param {string} audioUri - S3 URI of audio file
 * @param {string} languageCode - Language code (e.g., 'hi-IN')
 * @returns {Promise<string>} Job name
 */
export async function startTranscription(audioUri, languageCode = 'hi-IN') {
    const client = createTranscribeClient();
    const jobName = `transcribe-${Date.now()}`;

    const command = new StartTranscriptionJobCommand({
        TranscriptionJobName: jobName,
        LanguageCode: languageCode,
        MediaFormat: 'wav',
        Media: {
            MediaFileUri: audioUri
        },
        OutputBucketName: process.env.AWS_S3_BUCKET || 'luma-cli-audio'
    });

    await client.send(command);
    return jobName;
}

/**
 * Get transcription result
 * @param {string} jobName - Transcription job name
 * @returns {Promise<Object>} Transcription result
 */
export async function getTranscriptionResult(jobName) {
    const client = createTranscribeClient();

    const command = new GetTranscriptionJobCommand({
        TranscriptionJobName: jobName
    });

    const response = await client.send(command);
    const job = response.TranscriptionJob;

    if (job.TranscriptionJobStatus === 'COMPLETED') {
        // Fetch transcript from S3
        const transcriptUri = job.Transcript.TranscriptFileUri;
        const transcriptResponse = await fetch(transcriptUri);
        const transcript = await transcriptResponse.json();
        
        return {
            status: 'completed',
            text: transcript.results.transcripts[0].transcript,
            confidence: transcript.results.items.reduce((sum, item) => 
                sum + (item.alternatives[0].confidence || 0), 0) / transcript.results.items.length
        };
    } else if (job.TranscriptionJobStatus === 'FAILED') {
        return {
            status: 'failed',
            error: job.FailureReason
        };
    } else {
        return {
            status: 'in_progress'
        };
    }
}

/**
 * Transcribe audio (complete flow)
 * @param {Buffer} audioBuffer - Audio file buffer
 * @param {string} languageCode - Language code
 * @returns {Promise<string>} Transcribed text
 */
export async function transcribeAudio(audioBuffer, languageCode = 'hi-IN') {
    const fileName = `audio-${Date.now()}.wav`;
    
    // Upload to S3
    const audioUri = await uploadAudioToS3(audioBuffer, fileName);
    
    // Start transcription
    const jobName = await startTranscription(audioUri, languageCode);
    
    // Poll for result
    let result;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max
    
    while (attempts < maxAttempts) {
        result = await getTranscriptionResult(jobName);
        
        if (result.status === 'completed') {
            return result.text;
        } else if (result.status === 'failed') {
            throw new Error(`Transcription failed: ${result.error}`);
        }
        
        // Wait 1 second before next check
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
    }
    
    throw new Error('Transcription timeout');
}
