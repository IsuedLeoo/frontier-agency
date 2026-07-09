export interface ProviderConfig {
  id: string;
  name: string;
  preset: "openrouter" | "openai" | "anthropic" | "ollama" | "custom";
  baseUrl?: string;
  apiKey?: string;
  defaultModel?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow?: number;
  description?: string;
  tags?: string[];
}

const PROVIDERS_KEY = "am_providers";
const ACTIVE_PROVIDER_KEY = "am_active_provider";
const ACTIVE_MODEL_KEY = "am_active_model";

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* ------------------------------------------------------------------ */
/*  Default providers                                                 */
/* ------------------------------------------------------------------ */
export function getDefaultProviders(): ProviderConfig[] {
  return [
    {
      id: "ollama",
      name: "Ollama (Local)",
      preset: "ollama",
      baseUrl: "http://localhost:11434",
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      preset: "openrouter",
      baseUrl: "https://openrouter.ai/api/v1",
    },
    {
      id: "openai",
      name: "OpenAI",
      preset: "openai",
      baseUrl: "https://api.openai.com/v1",
    },
    {
      id: "anthropic",
      name: "Anthropic",
      preset: "anthropic",
      baseUrl: "https://api.anthropic.com/v1",
    },
  ];
}

export function getProviders(): ProviderConfig[] {
  const saved = getItem<ProviderConfig[]>(PROVIDERS_KEY, []);
  if (saved.length === 0) {
    const defaults = getDefaultProviders();
    setItem(PROVIDERS_KEY, defaults);
    return defaults;
  }
  return saved;
}

export function saveProvider(provider: ProviderConfig) {
  const providers = getProviders().filter((p) => p.id !== provider.id);
  providers.push(provider);
  setItem(PROVIDERS_KEY, providers);
}

export function deleteProvider(id: string) {
  const providers = getProviders().filter((p) => p.id !== id);
  setItem(PROVIDERS_KEY, providers);
}

export function getActiveProvider(): ProviderConfig | null {
  const id = localStorage.getItem(ACTIVE_PROVIDER_KEY);
  if (!id) return null;
  return getProviders().find((p) => p.id === id) || null;
}

export function setActiveProvider(id: string) {
  localStorage.setItem(ACTIVE_PROVIDER_KEY, id);
}

export function getActiveModel(): string | null {
  return localStorage.getItem(ACTIVE_MODEL_KEY);
}

export function setActiveModel(id: string) {
  localStorage.setItem(ACTIVE_MODEL_KEY, id);
}

/* ------------------------------------------------------------------ */
/*  Curated model list                                                */
/* ------------------------------------------------------------------ */
const CURATED: AIModel[] = [
  // OpenRouter popular
  { id: "openrouter/auto", name: "Auto (best for prompt)", provider: "openrouter", contextWindow: 128000, tags: ["free"] },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "openrouter", contextWindow: 200000, description: "Best coding and reasoning" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus", provider: "openrouter", contextWindow: 200000, description: "Most capable Claude" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", provider: "openrouter", contextWindow: 200000, description: "Fast and cheap", tags: ["fast"] },
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "openrouter", contextWindow: 128000, description: "OpenAI flagship" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "openrouter", contextWindow: 128000, description: "Fast and cheap", tags: ["fast", "cheap"] },
  { id: "openai/o1-preview", name: "o1 Preview", provider: "openrouter", contextWindow: 128000, description: "Reasoning model" },
  { id: "openai/o1-mini", name: "o1 Mini", provider: "openrouter", contextWindow: 128000, description: "Fast reasoning", tags: ["fast"] },
  { id: "google/gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "openrouter", contextWindow: 1000000, description: "Huge context window" },
  { id: "google/gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "openrouter", contextWindow: 1000000, description: "Fast and cheap", tags: ["fast", "cheap"] },
  { id: "meta-llama/llama-3.1-405b", name: "Llama 3.1 405B", provider: "openrouter", contextWindow: 128000, description: "Largest open model" },
  { id: "meta-llama/llama-3.1-70b", name: "Llama 3.1 70B", provider: "openrouter", contextWindow: 128000, description: "Best open model" },
  { id: "meta-llama/llama-3.1-8b", name: "Llama 3.1 8B", provider: "openrouter", contextWindow: 128000, description: "Fast local-sized", tags: ["fast", "cheap"] },
  { id: "mistralai/mistral-large", name: "Mistral Large", provider: "openrouter", contextWindow: 128000 },
  { id: "mistralai/mistral-medium", name: "Mistral Medium", provider: "openrouter", contextWindow: 32000, tags: ["fast", "cheap"] },
  { id: "mistralai/mistral-small", name: "Mistral Small", provider: "openrouter", contextWindow: 32000, tags: ["fast", "cheap"] },
  { id: "deepseek/deepseek-chat", name: "DeepSeek V3", provider: "openrouter", contextWindow: 64000, description: "Great coding", tags: ["cheap"] },
  { id: "deepseek/deepseek-coder", name: "DeepSeek Coder", provider: "openrouter", contextWindow: 64000, description: "Code specialist", tags: ["cheap"] },
  { id: "deepseek/deepseek-r1", name: "DeepSeek R1", provider: "openrouter", contextWindow: 64000, description: "Open reasoning model with visible chain-of-thought", tags: ["reasoning"] },
  { id: "deepseek/deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill 70B", provider: "openrouter", contextWindow: 128000, description: "Reasoning distilled into Llama 3.1 70B", tags: ["reasoning"] },
  { id: "deepseek/deepseek-r1-distill-qwen-32b", name: "DeepSeek R1 Distill Qwen 32B", provider: "openrouter", contextWindow: 128000, description: "Reasoning distilled into Qwen 2.5 32B", tags: ["reasoning"] },
  { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B", provider: "openrouter", contextWindow: 128000 },
  { id: "nvidia/llama-3.1-nemotron-70b", name: "Nemotron 70B", provider: "openrouter", contextWindow: 128000 },
  { id: "microsoft/wizardlm-2-8x22b", name: "WizardLM 2 8x22B", provider: "openrouter", contextWindow: 64000 },
  { id: "01-ai/yi-34b-chat", name: "Yi 34B", provider: "openrouter", contextWindow: 32000 },
  { id: "perplexity/sonar", name: "Perplexity Sonar", provider: "openrouter", contextWindow: 12000, description: "Web search", tags: ["search"] },
  { id: "perplexity/sonar-pro", name: "Perplexity Sonar Pro", provider: "openrouter", contextWindow: 12000, description: "Advanced search", tags: ["search"] },

  // OpenAI direct
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", contextWindow: 128000, description: "Flagship multimodal" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai", contextWindow: 128000, description: "Fast and cheap", tags: ["fast", "cheap"] },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "openai", contextWindow: 128000 },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "openai", contextWindow: 16000, tags: ["fast", "cheap"] },
  { id: "o1-preview", name: "o1 Preview", provider: "openai", contextWindow: 128000, description: "Reasoning" },
  { id: "o1-mini", name: "o1 Mini", provider: "openai", contextWindow: 128000, description: "Fast reasoning", tags: ["fast"] },

  // Anthropic direct
  { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", provider: "anthropic", contextWindow: 200000, description: "Best coding and reasoning" },
  { id: "claude-3-opus-20240229", name: "Claude 3 Opus", provider: "anthropic", contextWindow: 200000, description: "Most capable" },
  { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet", provider: "anthropic", contextWindow: 200000 },
  { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", provider: "anthropic", contextWindow: 200000, description: "Fast and cheap", tags: ["fast", "cheap"] },

  // Free / fast tags on OpenRouter
  { id: "google/gemini-flash-1.5", name: "Gemini Flash 1.5", provider: "openrouter", contextWindow: 1000000, tags: ["fast", "free"] },
  { id: "meta-llama/llama-3.2-1b", name: "Llama 3.2 1B", provider: "openrouter", contextWindow: 128000, tags: ["fast", "free"] },
  { id: "meta-llama/llama-3.2-3b", name: "Llama 3.2 3B", provider: "openrouter", contextWindow: 128000, tags: ["fast", "free"] },
  { id: "nousresearch/hermes-3-llama-3.1-405b", name: "Hermes 3 405B", provider: "openrouter", contextWindow: 128000 },
  { id: "huggingfaceh4/zephyr-7b-beta", name: "Zephyr 7B", provider: "openrouter", contextWindow: 32000, tags: ["fast", "free"] },
];

/* ------------------------------------------------------------------ */
/*  Ollama discovery                                                  */
/* ------------------------------------------------------------------ */
export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format?: string;
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
}

export async function fetchOllamaModels(
  baseUrl = "http://localhost:11434"
): Promise<AIModel[]> {
  try {
    const res = await fetch(`${baseUrl}/api/tags`, { method: "GET" });
    if (!res.ok) throw new Error("Ollama not responding");
    const data = await res.json();
    const models: OllamaModel[] = data.models || [];
    return models.map((m) => {
      const rawTags = m.details?.families ?? (m.details?.family ? [m.details.family] : []);
      const tags = rawTags.filter((t): t is string => !!t);
      return {
        id: m.name,
        name: m.name,
        provider: "ollama",
        description: m.details?.parameter_size || "Local model",
        tags,
      };
    });
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Get all models                                                    */
/* ------------------------------------------------------------------ */
export async function getAllModels(): Promise<AIModel[]> {
  const ollama = await fetchOllamaModels();
  const custom = getCustomModels();
  return [...ollama, ...CURATED, ...custom];
}

export function searchModels(
  models: AIModel[],
  query: string
): AIModel[] {
  const q = query.toLowerCase().trim();
  if (!q) return models;
  return models.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q)) ||
      (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
  );
}

/* ------------------------------------------------------------------ */
/*  Custom models                                                     */
/* ------------------------------------------------------------------ */
const CUSTOM_MODELS_KEY = "am_custom_models";

export function getCustomModels(): AIModel[] {
  return getItem<AIModel[]>(CUSTOM_MODELS_KEY, []);
}

export function addCustomModel(model: AIModel) {
  const existing = getCustomModels().filter((m) => m.id !== model.id);
  existing.push(model);
  setItem(CUSTOM_MODELS_KEY, existing);
}

export function removeCustomModel(id: string) {
  const remaining = getCustomModels().filter((m) => m.id !== id);
  setItem(CUSTOM_MODELS_KEY, remaining);
}
