export interface ToolConfig {
  title: string;
  description: string;
  h1: string;
  keywords: string;
  schemaType: string;
  name: string;
  category: string;
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
  "text-compare": {
    title: "Text Compare Tool - Find Differences Side-by-Side",
    description: "Compare two pieces of text and find differences instantly.",
    h1: "Online Text Comparison",
    keywords: "text compare, diff checker, find differences",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Text Compare",
  },
  "text-formatter": {
    title: "Online Text Formatter - Clean & Transform Your Text",
    description:
      "Easily convert case, remove extra spaces, fix line breaks, and slugify your text for free.",
    h1: "Advanced Text Formatter",
    keywords:
      "text formatter, convert case, remove spaces, slug generator, clean text",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Text Formatter",
  },
  "json-formatter": {
    title: "JSON Formatter & Validator - Clean and Fix JSON Online",
    description:
      "Free online tool to format, beautify, minify, and validate JSON data. Find syntax errors and make your JSON readable instantly.",
    h1: "Professional JSON Formatter",
    keywords:
      "json formatter, json validator, json beautifier, minify json, json syntax checker",
    schemaType: "SoftwareApplication",
    category: "Developer",
    name: "JSON Formatter",
  },
  "code-beautifier": {
    title: "Online Code Beautifier - Format HTML, CSS, and JS",
    description:
      "Clean, format, and beautify your code instantly. Supports HTML, CSS, JavaScript, and TypeScript.",
    h1: "Professional Code Beautifier",
    keywords:
      "code formatter, html beautifier, css formatter, js beautifier, clean code online",
    schemaType: "SoftwareApplication",
    category: "Developer",
    name: "Code Beautifier",
  },
  "dummy-text-generator": {
    title: "Professional Dummy Text Generator - Lorem Ipsum & More",
    description:
      "Generate custom placeholder text for your websites, apps, and designs. Support for Lorem Ipsum, sentences, and paragraphs with optional HTML tags.",
    h1: "Professional Placeholder Text Generator",
    keywords:
      "dummy text generator, lorem ipsum generator, placeholder text, filler text for website, dummy content, text for mockups",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Dummy Text Generator",
  },

  // Adding a 3rd, 4th, or 100th tool is now just adding one object here
};
