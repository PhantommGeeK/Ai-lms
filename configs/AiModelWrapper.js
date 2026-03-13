const { GoogleGenerativeAI } = require("@google/generative-ai");

// Prefer a server-side API key variable but fall back to the public key if present.
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const MODEL_FALLBACK = "gemini-3-flash-preview";
const modelName = process.env.GEMINI_MODEL || process.env.NEXT_PUBLIC_GEMINI_MODEL || MODEL_FALLBACK;
console.log(`[AiModelWrapper] Using model: ${modelName}`);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 65536,
  responseMimeType: "application/json",
};

// Helper: sleep for ms
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Extract retry delay from 429 error message (e.g. "Please retry in 35.646s")
function extractRetryDelay(errorMsg) {
  const match = errorMsg.match(/retry in ([\d.]+)s/i);
  if (match) return Math.ceil(parseFloat(match[1]) * 1000) + 500; // add 500ms buffer
  return null;
}

function makeLazyChat(initialHistory = []) {
  let chat = null;

  function resetChat() {
    const gm = genAI.getGenerativeModel({ model: modelName });
    chat = gm.startChat({ generationConfig, history: initialHistory });
  }

  return {
    async sendMessage(message, maxRetries = 3) {
      if (!chat) resetChat();

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await chat.sendMessage(message);
        } catch (e) {
          const msg = (e && e.message) || String(e);
          const is429 = msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests");

          if (is429 && attempt < maxRetries) {
            // Extract delay from error message, or use exponential backoff
            const retryDelay = extractRetryDelay(msg) || (2000 * Math.pow(2, attempt));
            console.warn(
              `[AiModelWrapper] Rate limited (429) on attempt ${attempt + 1}/${maxRetries + 1}. ` +
              `Waiting ${retryDelay}ms before retry...`
            );
            await sleep(retryDelay);
            // Reset chat since the previous session may be invalidated
            resetChat();
            continue;
          }

          // For non-429 errors or final attempt, throw
          throw e;
        }
      }
    },
  };
}

export const courseOutlineAIModel = makeLazyChat();
export const generateNotesAiModel = makeLazyChat();
export const GenerateStudyTypeContentAiModel = makeLazyChat();
export const GenerateQuizAiModel = makeLazyChat();
export const GenerateQaAiModel = makeLazyChat();
