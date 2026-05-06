const { GoogleGenerativeAI } = require("@google/generative-ai");

// Prefer a server-side API key variable but fall back to the public key if present.
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const DEFAULT_MODEL = "gemini-3-flash-preview";
const DEFAULT_FALLBACK_MODELS = [
  "gemini-3.1-flash-lite-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];
const modelName =
  process.env.GEMINI_MODEL || process.env.NEXT_PUBLIC_GEMINI_MODEL || DEFAULT_MODEL;
const fallbackModelNames = (
  process.env.GEMINI_FALLBACK_MODELS || DEFAULT_FALLBACK_MODELS.join(",")
)
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean)
  .filter((model) => model !== modelName);
const modelNames = [modelName, ...fallbackModelNames];
console.log(`[AiModelWrapper] Using Gemini model order: ${modelNames.join(" -> ")}`);

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

function isRetryableError(errorMsg) {
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("503") ||
    /quota|too many requests|rate limit|overloaded|high demand|service unavailable|fetch failed/i.test(
      errorMsg
    )
  );
}

function shouldTryFallbackSoon(errorMsg) {
  return /503|overloaded|high demand|service unavailable|fetch failed/i.test(errorMsg);
}

function retryDelayForAttempt(errorMsg, attempt) {
  return extractRetryDelay(errorMsg) || 1000 * Math.pow(2, attempt);
}

function makeLazyChat(initialHistory = []) {
  let chat = null;
  let activeModelName = modelNames[0];

  function resetChat(nextModelName = activeModelName) {
    if (!genAI) {
      throw new Error(
        "Gemini API key missing. Set GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY."
      );
    }
    activeModelName = nextModelName;
    const gm = genAI.getGenerativeModel({ model: activeModelName });
    chat = gm.startChat({ generationConfig, history: initialHistory });
  }

  return {
    async sendMessage(message, maxRetries = 3) {
      if (!chat) resetChat();

      for (const currentModelName of modelNames) {
        resetChat(currentModelName);

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            return await chat.sendMessage(message);
          } catch (e) {
            const msg = (e && e.message) || String(e);
            const isRetryable = isRetryableError(msg);
            const hasFallback = currentModelName !== modelNames[modelNames.length - 1];
            const retryLimit = shouldTryFallbackSoon(msg) && hasFallback ? 1 : maxRetries;
            const canRetrySameModel = isRetryable && attempt < retryLimit;

            if (canRetrySameModel) {
              const retryDelay = retryDelayForAttempt(msg, attempt);
              console.warn(
                `[AiModelWrapper] ${activeModelName} failed with a retryable error ` +
                  `on attempt ${attempt + 1}/${maxRetries + 1}. ` +
                  `Waiting ${retryDelay}ms before retry...`
              );
              await sleep(retryDelay);
              resetChat();
              continue;
            }

            const canTryFallback = isRetryable && hasFallback;

            if (canTryFallback) {
              console.warn(
                `[AiModelWrapper] ${activeModelName} is unavailable. Trying fallback model...`
              );
              break;
            }

            throw e;
          }
        }
      }

      throw new Error("All configured Gemini models failed to generate content.");
    },
  };
}

export const courseOutlineAIModel = makeLazyChat();
export const generateNotesAiModel = makeLazyChat();
export const GenerateStudyTypeContentAiModel = makeLazyChat();
export const GenerateQuizAiModel = makeLazyChat();
export const GenerateQaAiModel = makeLazyChat();
