declare global {
  interface CloudflareEnv {
    frontier_agency_db: D1Database;
    OPENROUTER_API_KEY: string;
    VAPI_PRIVATE_KEY: string;
    VAPI_ASSISTANT_ID: string;
    VAPI_PHONE_NUMBER_ID: string;
  }
}

export {};
