export interface PromptSummary {
  id: string; // serial id as string, or a "spec_…" id for memory-records (no DATABASE_URL)
  persisted?: "database" | "memory";
  rawPrompt: string;
  title: string;
  industry: string;
  industryId: string;
  brandName: string;
  wordCount: number;
  createdAt: string;
}

export interface PromptListResponse {
  prompts: PromptSummary[];
  total: number;
}
