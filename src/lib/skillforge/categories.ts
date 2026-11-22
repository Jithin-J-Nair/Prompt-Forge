export const PROJECT_CATEGORIES = [
  { key: "ai-product", label: "AI Product" },
  { key: "ai-agent", label: "AI Agent" },
  { key: "rag-platform", label: "RAG Platform" },
  { key: "saas", label: "SaaS" },
  { key: "startup-mvp", label: "Startup MVP" },
  { key: "mobile-app", label: "Mobile App" },
  { key: "web-application", label: "Web Application" },
  { key: "awwwards-website", label: "Awwwards Website" },
  { key: "threejs-experience", label: "Three.js Experience" },
  { key: "enterprise-platform", label: "Enterprise Platform" },
  { key: "e-commerce", label: "E-Commerce" },
  { key: "automation-system", label: "Automation System" },
  { key: "analytics-platform", label: "Analytics Platform" },
  { key: "marketplace", label: "Marketplace" },
  { key: "internal-tool", label: "Internal Tool" },
] as const;

export type ProjectCategoryKey = (typeof PROJECT_CATEGORIES)[number]["key"];

export function isProjectCategoryKey(value: string): value is ProjectCategoryKey {
  return PROJECT_CATEGORIES.some((category) => category.key === value);
}

export function getCategoryLabel(key: ProjectCategoryKey): string {
  const match = PROJECT_CATEGORIES.find((category) => category.key === key);
  if (!match) throw new Error(`Unknown category ${key}`);
  return match.label;
}
