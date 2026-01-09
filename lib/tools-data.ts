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
  "base64-encoder-decoder": {
  title: "Base64 Encoder & Decoder - String to Base64 Online",
  description: "Easily encode text to Base64 or decode Base64 back to plain text. Safe, fast, and secure local processing.",
  h1: "Base64 Encoder/Decoder",
  keywords: "base64 encode, base64 decode, string to base64, base64 to text",
  schemaType: "SoftwareApplication", category: "Developer", name: "Base64 Tool"
},
"url-encoder-decoder": {
  title: "URL Encoder & Decoder - Percent Encoding Tool",
  description: "Encode and decode URLs for safe web transmission. Handles special characters and parameters perfectly.",
  h1: "URL Encoder/Decoder",
  keywords: "url encode, url decode, percent encoding, uri encoder",
  schemaType: "SoftwareApplication", category: "Developer", name: "URL Tool"
},
"line-sorter": {
  title: "Line Sorter - Alphabetize & Sort Text Lists",
  description: "Sort lists alphabetically, numerically, or in reverse. Remove duplicates and clean up your data instantly.",
  h1: "Online Line Sorter",
  keywords: "sort lines, alphabetize list, sort text, remove duplicate lines",
  schemaType: "SoftwareApplication", category: "Writing", name: "Line Sorter"
},
"text-to-slug": {
  title: "Text to Slug Generator - Create SEO Friendly URLs",
  description: "Convert any title or string into a clean, SEO-friendly URL slug. Perfect for bloggers and developers.",
  h1: "URL Slug Generator",
  keywords: "text to slug, slugify, url slug generator, seo friendly url",
  schemaType: "SoftwareApplication", category: "Writing", name: "Slug Generator"
},
"grammar-checker": {
  title: "Free Grammar & Spell Checker - Improve Your Writing",
  description: "Check your text for common spelling mistakes, double words, and basic grammar errors instantly.",
  h1: "Online Grammar & Spell Checker",
  keywords: "grammar checker, spell check online, proofreading tool, fix writing errors",
  schemaType: "SoftwareApplication",
  category: "Writing",
  name: "Grammar Checker",
},
"remove-special-characters": {
  title: "Remove Special Characters Online - Clean Text Tool",
  description: "Quickly remove symbols, punctuation, and special characters from your text. Keep only letters, numbers, or both.",
  h1: "Special Character Remover",
  keywords: "remove symbols from text, strip special characters, clean text online, text sanitizer",
  schemaType: "SoftwareApplication",
  category: "Writing",
  name: "Remove Special Characters",
},
"remove-emojis": {
  title: "Remove Emojis from Text - Online Emoji Stripper",
  description: "Instantly strip all emojis and emoticons from your text. Perfect for cleaning social media bios and professional documents.",
  h1: "Online Emoji Remover",
  keywords: "strip emojis, remove emoticons from text, emoji cleaner, clean text for printing",
  schemaType: "SoftwareApplication",
  category: "Writing",
  name: "Emoji Remover",
},
"json-to-csv": {
  title: "JSON to CSV Converter - Convert JSON to Excel Online",
  description: "Easily convert JSON data to CSV format for Excel or Google Sheets. Supports nested objects and automatic header detection.",
  h1: "Professional JSON to CSV Converter",
  keywords: "json to csv, convert json to excel online, json to spreadsheet, data converter, developer tools",
  schemaType: "SoftwareApplication",
  category: "Developer",
  name: "JSON to CSV",
},
"timestamp-converter": {
  title: "Unix Timestamp Converter - Epoch Converter Online",
  description: "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds, milliseconds, and local time zones.",
  h1: "Unix Epoch & Timestamp Converter",
  keywords: "unix timestamp converter, epoch converter, human date to unix, miliseconds to date, developer utilities",
  schemaType: "SoftwareApplication",
  category: "Developer",
  name: "Timestamp Converter",
},
"hash-generator": {
  title: "Online Hash Generator - MD5, SHA-1, SHA-256",
  description: "Securely generate MD5, SHA-1, and SHA-256 hashes from any text. All processing is done locally in your browser for maximum privacy.",
  h1: "MD5 & SHA Hash Generator",
  keywords: "hash generator, md5 generator, sha256 online, sha1 hash, secure hashing tool, checksum generator",
  schemaType: "SoftwareApplication",
  category: "Developer",
  name: "Hash Generator",
},
"htpasswd-generator": {
  title: "Htpasswd Generator - Create .htpasswd Files Online",
  description: "Generate secure password hashes for Apache and Nginx .htpasswd files. Supports MD5 and SHA-1 encryption methods.",
  h1: "Online Htpasswd Generator",
  keywords: "htpasswd generator, apache password hash, nginx password tool, htpasswd online, .htpasswd creator",
  schemaType: "SoftwareApplication",
  category: "Developer",
  name: "Htpasswd Generator",
},
"emoji-converter": {
  title: "Emoji to Text & Shortcode Converter - Online Emoji Tool",
  description: "Convert emojis to their text shortcodes and vice versa. Perfect for Discord, Slack, and GitHub formatting.",
  h1: "Emoji & Shortcode Converter",
  keywords: "emoji to text, emoji shortcodes, discord emoji codes, slack emoji list, convert text to emoji",
  schemaType: "SoftwareApplication",
  category: "Writing",
  name: "Emoji Converter",
},
  // Adding a 3rd, 4th, or 100th tool is now just adding one object here
};
