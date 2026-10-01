import type { Topic } from './types';
import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

const groq = new Groq({
  apiKey: apiKey || 'dummy-key',
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
You are generating topics for a spontaneous learning and speaking practice application.

Generate ONE genuinely interesting and researchable knowledge topic.
The topic can come from ANY field, including science, history, technology, psychology, sports, mathematics, business, geography, nature, medicine, engineering, entertainment, culture, philosophy, food, transportation, gaming, or unusual real-world events.

The topic should be something a general adult would benefit from learning about.

IMPORTANT:
Generate a SUBJECT, not an opinion question.

Good examples:
- The Fermi Paradox
- The Great Molasses Flood of 1919
- How GPS Determines Your Location
- The Duckworth–Lewis–Stern Method
- The Placebo Effect
- The History of the Panama Canal
- How Formula 1 Pit Stops Work

Bad examples:
- Should AI replace programmers?
- Is social media good or bad?
- What is confidence?
- Leadership
- Success
- Why should people exercise?

The topic should be specific, interesting, factual, and explainable within approximately one minute after a short research period.
Prefer surprising, unusual, educational, or lesser-known subjects over generic textbook topics.
Do not provide the complete answer in the description.

You MUST respond ONLY with valid JSON. Do not include markdown formatting or extra text.
The JSON must have the following structure:
{
  "title": "string",
  "category": "string",
  "difficulty": "Easy" | "Medium" | "Hard",
  "description": "string (short description that doesn't reveal the whole answer)",
  "suggestedResearchAreas": ["string", "string", "string"]
}
`;

// Fallback topic if API fails
const FALLBACK_TOPIC: Topic = {
  id: "fallback-1",
  title: "The Fermi Paradox",
  category: "Science",
  difficulty: "Medium",
  description: "The apparent contradiction between the lack of evidence for extraterrestrial civilizations and various high estimates for their probability.",
  suggestedResearchAreas: [
    "What is the paradox?",
    "What is the Drake equation?",
    "What are some proposed solutions?"
  ]
};

export const generateRandomTopic = async (): Promise<Topic> => {
  if (!apiKey) {
    console.warn("No Groq API key found. Using fallback topic. Set VITE_GROQ_API_KEY in .env.local");
    return FALLBACK_TOPIC;
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'Generate a new random knowledge topic.' }
      ],
      model: 'openai/gpt-oss-20b', // Current text model available on your API key
      temperature: 0.9,
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("No content received");

    const parsed = JSON.parse(content);
    return {
      id: Math.random().toString(36).substring(7),
      title: parsed.title,
      category: parsed.category,
      difficulty: parsed.difficulty,
      description: parsed.description,
      suggestedResearchAreas: parsed.suggestedResearchAreas || []
    };
  } catch (error) {
    console.error("Failed to generate topic with Groq:", error);
    return FALLBACK_TOPIC;
  }
};

export const getAudioFeedback = async (audioBlob: Blob, topicTitle: string) => {
  if (!apiKey) {
    throw new Error("No Groq API key found.");
  }
  
  // 1. Transcribe Audio
  const file = new File([audioBlob], 'audio.webm', { type: audioBlob.type });
  const transcription = await groq.audio.transcriptions.create({
    file: file,
    model: 'whisper-large-v3-turbo',
    response_format: 'json',
  });
  
  const transcriptText = transcription.text;
  
  if (!transcriptText || transcriptText.trim().length === 0) {
    return {
      transcript: "(No speech detected)",
      score: 0,
      strengths: [],
      improvements: ["Speak louder or check your microphone."],
      overall: "We couldn't hear you clearly."
    };
  }

  // 2. Evaluate Transcript
  const SYSTEM_PROMPT = `You are a public speaking coach. Evaluate the user's speech transcript about the topic: "${topicTitle}". 
Return ONLY a JSON object with the following structure:
{
  "score": number (0-100),
  "strengths": string[],
  "improvements": string[],
  "overall": string
}`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: transcriptText }
    ],
    model: 'openai/gpt-oss-20b',
    temperature: 0.5,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const feedback = JSON.parse(content);
  
  return {
    transcript: transcriptText,
    score: feedback.score || 0,
    strengths: feedback.strengths || [],
    improvements: feedback.improvements || [],
    overall: feedback.overall || "Good attempt!"
  };
};
