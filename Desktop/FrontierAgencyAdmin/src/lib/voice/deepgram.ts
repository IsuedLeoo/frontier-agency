/**
 * Deepgram STT/TTS Integration
 *
 * Streaming STT: wss://api.deepgram.com/v1/listen
 * Streaming TTS: wss://api.deepgram.com/v1/speak
 *
 * Aura-2 voices (English):
 *   Female: amalthea, andromeda, apollo, arcas, aries, asteria, athena, atlas,
 *           aurora, callista, cordelia, cora, delia, draco, electra, harmonia,
 *           helena, hera, hermes, hyperion, iris, janus, juno, jupiter, luna,
 *           mars, minerva, neptune, odysseus, ophelia, orion, orpheus, pandora,
 *           phoebe, pluto, saturn, selene, thalia, theia, vesta, zeus
 *
 * Recommended for Alex (deep male): arcas, orion, orpheus, odysseus, hermes
 * Recommended for Mia (warm female): asteria, athena, aurora, callista, selene
 */

const DEEPGRAM_API_URL = "https://api.deepgram.com";

export interface DeepgramConfig {
  apiKey: string;
}

// ─── TTS (Text-to-Speech) ────────────────────────────────────────────────────

export interface TTSOptions {
  text: string;
  model: string; // e.g. "aura-2-arcas-en"
  encoding?: string;
  sampleRate?: number;
  speed?: number;
  onAudio: (audioBuffer: ArrayBuffer) => void;
  onDone: () => void;
  onError: (err: Error) => void;
}

/**
 * Stream text to speech via Deepgram TTS WebSocket.
 * Returns a controller with flush() and close() methods.
 */
export function streamTTS(config: DeepgramConfig, options: TTSOptions) {
  const {
    text,
    model,
    encoding = "linear16",
    sampleRate = 24000,
    speed = 1.0,
    onAudio,
    onDone,
    onError,
  } = options;

  const wsUrl = `${DEEPGRAM_API_URL.replace("https", "wss")}/v1/speak?model=${encodeURIComponent(model)}&encoding=${encoding}&sample_rate=${sampleRate}&speed=${speed}`;

  const ws = new WebSocket(wsUrl);
  ws.binaryType = "arraybuffer";

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "Speak", text }));
    ws.send(JSON.stringify({ type: "Flush" }));
  };

  ws.onmessage = (event: MessageEvent) => {
    if (event.data instanceof ArrayBuffer) {
      onAudio(event.data);
    } else {
      try {
        const msg = JSON.parse(event.data as string);
        if (msg.type === "Flushed") {
          ws.send(JSON.stringify({ type: "Close" }));
        } else if (msg.type === "Closed") {
          onDone();
        } else if (msg.type === "Warning" || msg.type === "Error") {
          onError(new Error(`Deepgram TTS: ${msg.description || msg.type}`));
        }
      } catch {
        // ignore non-JSON text messages
      }
    }
  };

  ws.onerror = () => onError(new Error("Deepgram TTS WebSocket error"));
  ws.onclose = () => onDone();

  return {
    flush: () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "Flush" }));
      }
    },
    close: () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "Close" }));
      }
    },
  };
}

// ─── STT (Speech-to-Text) ────────────────────────────────────────────────────

export interface STTOptions {
  model?: string;
  language?: string;
  encoding?: string;
  sampleRate?: number;
  channels?: number;
  punctuate?: boolean;
  interimResults?: boolean;
  smartFormat?: boolean;
  onTranscript: (text: string, isFinal: boolean) => void;
  onDone: () => void;
  onError: (err: Error) => void;
}

/**
 * Stream audio to text via Deepgram STT WebSocket.
 * Returns a controller with sendAudio() and close() methods.
 */
export function streamSTT(config: DeepgramConfig, options: STTOptions) {
  const {
    model = "nova-2",
    language = "en-US",
    encoding = "linear16",
    sampleRate = 16000,
    channels = 1,
    punctuate = true,
    interimResults = true,
    smartFormat = true,
    onTranscript,
    onDone,
    onError,
  } = options;

  const params = new URLSearchParams({
    model,
    language,
    encoding,
    sample_rate: String(sampleRate),
    channels: String(channels),
    punctuate: String(punctuate),
    interim_results: String(interimResults),
    smart_format: String(smartFormat),
  });

  const wsUrl = `${DEEPGRAM_API_URL.replace("https", "wss")}/v1/listen?${params}`;

  const ws = new WebSocket(wsUrl);
  ws.binaryType = "arraybuffer";

  ws.onopen = () => {
    // Ready to receive audio
  };

  ws.onmessage = (event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data as string);
      if (msg.type === "Results") {
        const alt = msg.channel?.alternatives?.[0];
        if (alt?.transcript) {
          onTranscript(alt.transcript, msg.is_final ?? false);
        }
        if (msg.speech_final) {
          // End of utterance
        }
      } else if (msg.type === "UtteranceEnd") {
        // Utterance boundary
      } else if (msg.type === "Error") {
        onError(new Error(`Deepgram STT: ${msg.description || "Unknown error"}`));
      }
    } catch {
      // ignore
    }
  };

  ws.onerror = () => onError(new Error("Deepgram STT WebSocket error"));
  ws.onclose = () => onDone();

  return {
    sendAudio: (audioData: ArrayBuffer) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(audioData);
      }
    },
    close: () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    },
  };
}

// ─── Voice Presets ───────────────────────────────────────────────────────────

export const VOICES = {
  // Deep, warm male voices (good for Alex)
  arcas: "aura-2-arcas-en",
  orion: "aura-2-orion-en",
  orpheus: "aura-2-orpheus-en",
  odysseus: "aura-2-odysseus-en",
  hermes: "aura-2-hermes-en",
  // Warm, friendly female voices (good for Mia)
  asteria: "aura-2-asteria-en",
  athena: "aura-2-athena-en",
  aurora: "aura-2-aurora-en",
  callista: "aura-2-callista-en",
  selene: "aura-2-selene-en",
  // Other good options
  amalthea: "aura-2-amalthea-en",
  andromeda: "aura-2-andromeda-en",
  luna: "aura-2-luna-en",
  stella: "aura-2-stella-en",
} as const;

export type VoiceName = keyof typeof VOICES;
