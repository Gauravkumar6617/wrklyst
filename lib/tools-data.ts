export interface ToolConfig {
  title: string;
  description: string;
  h1: string;
  keywords: string;
  schemaType: string;
  name: string;
  category:string
}

export const TOOLS_CONFIG: Record<string, ToolConfig> = {
  "word-counter": {
    title: "Free Online Word Counter - Count Words & Characters Instantly",
    description: "Analyze your text length, character count, and reading time.",
    h1: "Professional Word Counter",
    keywords: "word count, count characters, writing tool",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Word Counter",
  },

  // Adding a 3rd, 4th, or 100th tool is now just adding one object here
};