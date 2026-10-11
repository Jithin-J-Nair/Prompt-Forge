export interface PromptSummary {
  id: number;
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
