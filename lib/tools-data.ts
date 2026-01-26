export type ToolCategory =
  | "Writing"
  | "Developer"
  | "Security"
  | "Image"
  | "PDF"
  | "Converter"
  | "Utilities";

export interface ToolConfig {
  title: string; // For the <title> tag
  description: string; // For meta description
  h1: string; // Main page heading
  keywords: string; // Meta keywords
  schemaType: "SoftwareApplication" | "WebApplication";
  name: string; // Simple name for UI components
  category: ToolCategory;
  apiEndpoint?: string; // e.g., "/api/v1/pdf/merge"
  apiStatus?: "stable" | "beta" | "deprecated";
  isPremium?: boolean; // To show "Pro" badge in the API docs
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
    description:
      "Easily encode text to Base64 or decode Base64 back to plain text. Safe, fast, and secure local processing.",
    h1: "Base64 Encoder/Decoder",
    keywords: "base64 encode, base64 decode, string to base64, base64 to text",
    schemaType: "SoftwareApplication",
    category: "Developer",
    name: "Base64 Tool",
  },
  "url-encoder-decoder": {
    title: "URL Encoder & Decoder - Percent Encoding Tool",
    description:
      "Encode and decode URLs for safe web transmission. Handles special characters and parameters perfectly.",
    h1: "URL Encoder/Decoder",
    keywords: "url encode, url decode, percent encoding, uri encoder",
    schemaType: "SoftwareApplication",
    category: "Developer",
    name: "URL Tool",
  },
  "line-sorter": {
    title: "Line Sorter - Alphabetize & Sort Text Lists",
    description:
      "Sort lists alphabetically, numerically, or in reverse. Remove duplicates and clean up your data instantly.",
    h1: "Online Line Sorter",
    keywords: "sort lines, alphabetize list, sort text, remove duplicate lines",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Line Sorter",
  },
  "text-to-slug": {
    title: "Text to Slug Generator - Create SEO Friendly URLs",
    description:
      "Convert any title or string into a clean, SEO-friendly URL slug. Perfect for bloggers and developers.",
    h1: "URL Slug Generator",
    keywords: "text to slug, slugify, url slug generator, seo friendly url",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Slug Generator",
  },
  "grammar-checker": {
    title: "Free Grammar & Spell Checker - Improve Your Writing",
    description:
      "Check your text for common spelling mistakes, double words, and basic grammar errors instantly.",
    h1: "Online Grammar & Spell Checker",
    keywords:
      "grammar checker, spell check online, proofreading tool, fix writing errors",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Grammar Checker",
  },
  "remove-special-characters": {
    title: "Remove Special Characters Online - Clean Text Tool",
    description:
      "Quickly remove symbols, punctuation, and special characters from your text. Keep only letters, numbers, or both.",
    h1: "Special Character Remover",
    keywords:
      "remove symbols from text, strip special characters, clean text online, text sanitizer",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Remove Special Characters",
  },
  "remove-emojis": {
    title: "Remove Emojis from Text - Online Emoji Stripper",
    description:
      "Instantly strip all emojis and emoticons from your text. Perfect for cleaning social media bios and professional documents.",
    h1: "Online Emoji Remover",
    keywords:
      "strip emojis, remove emoticons from text, emoji cleaner, clean text for printing",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Emoji Remover",
  },
  "json-to-csv": {
    title: "JSON to CSV Converter - Convert JSON to Excel Online",
    description:
      "Easily convert JSON data to CSV format for Excel or Google Sheets. Supports nested objects and automatic header detection.",
    h1: "Professional JSON to CSV Converter",
    keywords:
      "json to csv, convert json to excel online, json to spreadsheet, data converter, developer tools",
    schemaType: "SoftwareApplication",
    category: "Developer",
    name: "JSON to CSV",
  },
  "timestamp-converter": {
    title: "Unix Timestamp Converter - Epoch Converter Online",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds, milliseconds, and local time zones.",
    h1: "Unix Epoch & Timestamp Converter",
    keywords:
      "unix timestamp converter, epoch converter, human date to unix, miliseconds to date, developer utilities",
    schemaType: "SoftwareApplication",
    category: "Developer",
    name: "Timestamp Converter",
  },
  "hash-generator": {
    title: "Online Hash Generator - MD5, SHA-1, SHA-256",
    description:
      "Securely generate MD5, SHA-1, and SHA-256 hashes from any text. All processing is done locally in your browser for maximum privacy.",
    h1: "MD5 & SHA Hash Generator",
    keywords:
      "hash generator, md5 generator, sha256 online, sha1 hash, secure hashing tool, checksum generator",
    schemaType: "SoftwareApplication",
    category: "Developer",
    name: "Hash Generator",
  },
  "htpasswd-generator": {
    title: "Htpasswd Generator - Create .htpasswd Files Online",
    description:
      "Generate secure password hashes for Apache and Nginx .htpasswd files. Supports MD5 and SHA-1 encryption methods.",
    h1: "Online Htpasswd Generator",
    keywords:
      "htpasswd generator, apache password hash, nginx password tool, htpasswd online, .htpasswd creator",
    schemaType: "SoftwareApplication",
    category: "Developer",
    name: "Htpasswd Generator",
  },
  "emoji-converter": {
    title: "Emoji to Text & Shortcode Converter - Online Emoji Tool",
    description:
      "Convert emojis to their text shortcodes and vice versa. Perfect for Discord, Slack, and GitHub formatting.",
    h1: "Emoji & Shortcode Converter",
    keywords:
      "emoji to text, emoji shortcodes, discord emoji codes, slack emoji list, convert text to emoji",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Emoji Converter",
  },
  "text-summarizer": {
    title: "Online Text Summarizer - Free Summary Generator",
    description:
      "Quickly summarize long articles and text into short, medium, or bulleted summaries using sentence extraction.",
    h1: "Fast Text Summarizer",
    keywords:
      "text summarizer, article summarizer, summarize text free, bullet point generator",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Text Summarizer",
  },
  "readability-checker": {
    title: "Readability Checker - Flesch-Kincaid Grade Level Tool",
    description:
      "Calculate the Flesch Reading Ease score and grade level of your text to ensure it is easy for your audience to read.",
    h1: "Reading Ease & Grade Level Checker",
    keywords:
      "readability checker, flesch reading ease, reading grade level, writing difficulty",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Readability Checker",
  },
  "keyword-density-checker": {
    title: "Keyword Density Checker - SEO Content Analysis Tool",
    description:
      "Analyze your content's keyword frequency and density. Filter out stop-words to see your most important topics.",
    h1: "SEO Keyword Density Analyzer",
    keywords:
      "keyword density, keyword frequency, seo content analyzer, word frequency checker",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Keyword Density Checker",
  },
  "paragraph-counter": {
    title: "Paragraph & Sentence Counter - Advanced Text Stats",
    description:
      "Count paragraphs, sentences, and average sentence length. Deep analysis of your writing structure.",
    h1: "Paragraph & Sentence Structure Counter",
    keywords:
      "paragraph counter, sentence counter, average sentence length, text structure analyzer",
    schemaType: "SoftwareApplication",
    category: "Writing",
    name: "Paragraph Counter",
  },
  "regex-tester": {
    title: "Online Regex Tester - Real-Time Regular Expression Debugger",
    description:
      "Test and debug your Regular Expressions in real-time. Includes match highlighting and support for global and case-insensitive flags.",
    h1: "Professional Regex Tester & Debugger",
    keywords:
      "regex tester, online regex, regular expression debugger, regex highlighter, javascript regex test",
    schemaType: "SoftwareApplication",
    category: "Developer",
    name: "Regex Tester",
  },
  "password-strength-checker": {
    title: "Password Strength Checker - Test Password Security Online",
    description:
      "Check how secure your password is. Calculate entropy, estimate crack time, and get real-time security feedback.",
    h1: "Secure Password Strength Analyzer",
    keywords:
      "password strength checker, test password security, password entropy calculator, how secure is my password",
    schemaType: "SoftwareApplication",
    category: "Security",
    name: "Password Checker",
  },
  "password-generator": {
    title: "Random Password Generator - Create Secure Passwords Online",
    description:
      "Generate strong, random passwords with custom lengths and character types. Secure, local, and free password creator.",
    h1: "Secure Random Password Generator",
    keywords:
      "password generator, secure password creator, random string generator, strong password tool",
    schemaType: "SoftwareApplication",
    category: "Security",
    name: "Password Generator",
  },
  "comment-remover": {
    title: "Online Comment Remover - Clean Source Code Instantly",
    description:
      "Remove comments from JavaScript, Python, CSS, HTML, and more. Clean up your code for production and reduce file size.",
    h1: "Professional Source Code Comment Remover",
    keywords:
      "remove comments from code, code cleaner, javascript comment remover, python comment stripper, minify code online",
    schemaType: "SoftwareApplication",
    category: "Developer",
    name: "Comment Remover",
  },

  "jpg-to-webp": {
    title: "Convert JPG to WebP Online - Next-Gen Optimization",
    description:
      "Convert JPEG photos to WebP to reduce file size by up to 30% without losing quality. Better for SEO and site speed.",
    h1: "JPG to WebP Converter",
    keywords: "jpg to webp, convert jpeg to webp, optimized image converter",
    schemaType: "SoftwareApplication", // Added this
    category: "Image",
    name: "JPG to WebP",
  },
  "webp-to-jpg": {
    title: "Convert WebP to JPG Online - High Compatibility",
    description:
      "Convert modern WebP images to standard JPG format for maximum compatibility with all devices and software.",
    h1: "WebP to JPG Converter",
    keywords: "webp to jpg, convert webp to jpeg online, image format changer",
    schemaType: "SoftwareApplication", // Added this
    category: "Image",
    name: "WebP to JPG",
  },
  "png-to-bmp": {
    title: "Convert PNG to BMP - Lossless Bitmap Images",
    description:
      "Convert your PNG files to BMP (Bitmap) format. Fast, high-quality, and runs entirely in your browser.",
    h1: "PNG to BMP Converter",
    keywords: "png to bmp, convert png to bitmap online",
    schemaType: "SoftwareApplication", // Added this
    category: "Image",
    name: "PNG to BMP",
  },
  "bmp-to-png": {
    title: "Convert BMP to PNG - Modern Web Ready",
    description:
      "Convert old-school Bitmap (BMP) files to modern PNG format with transparency support.",
    h1: "BMP to PNG Converter",
    keywords: "bmp to png, convert bitmap to png online",
    schemaType: "SoftwareApplication", // Added this
    category: "Image",
    name: "BMP to PNG",
  },
  "gif-to-png": {
    title: "Convert GIF to PNG - Extract First Frame",
    description:
      "Easily extract the first frame of an animated GIF and save it as a high-quality PNG image.",
    h1: "GIF to PNG Converter",
    keywords: "gif to png, extract frame from gif, animated gif to static",
    schemaType: "SoftwareApplication", // Added this
    category: "Image",
    name: "GIF to PNG",
  },
  "jpg-to-jpg": {
    title: "JPG Compressor - Reduce JPG File Size Online",
    description:
      "Re-compress your JPG images to reduce file size without a noticeable loss in quality. Perfect for site optimization.",
    h1: "JPG Size Optimizer",
    keywords: "compress jpg, reduce jpg size, optimize jpeg online",
    schemaType: "SoftwareApplication", // Added this
    category: "Image",
    name: "JPG Optimizer",
  },
  "png-to-png": {
    title: "PNG Optimizer - Reduce PNG Size Online",
    description:
      "Optimize your PNG files by stripping metadata and re-compressing for smaller footprints and faster web loads.",
    h1: "PNG Size Optimizer",
    keywords: "optimize png, compress png online, reduce png file size",
    schemaType: "SoftwareApplication", // Added this
    category: "Image",
    name: "PNG Optimizer",
  },
  "pdf-to-jpg": {
    name: "PDF to JPG",
    h1: "Convert PDF Pages to JPG Images",
    title: "PDF to JPG Converter - High Quality & 100% Private",
    description:
      "Convert every page of your PDF into high-quality JPG images instantly in your browser. No file uploads, 100% secure and private.",
    keywords:
      "pdf to jpg, convert pdf to image, pdf extractor, high quality jpg from pdf",
    schemaType: "WebApplication",
    category: "PDF",
  },
  "pdf-to-png": {
    name: "PDF to PNG",
    h1: "Convert PDF Pages to PNG Images",
    title: "PDF to PNG Converter - Lossless Quality Online",
    description:
      "Turn your PDF document into crisp, lossless PNG images. Processes entirely in your browser to keep your data safe.",
    keywords:
      "pdf to png, pdf to lossless image, convert pdf pages, browser-based pdf converter",
    schemaType: "WebApplication",
    category: "PDF",
  },
  "jpg-to-pdf": {
    name: "JPG to PDF",
    h1: "Convert JPG Images to PDF",
    title: "JPG to PDF Converter - Merge JPGs into a PDF Online",
    description:
      "Convert your JPG images into a professional PDF document. Fast, private, and works entirely in your browser.",
    keywords: "jpg to pdf, convert jpg to pdf, merge images to pdf",
    schemaType: "WebApplication",
    category: "Image",
  },
  "png-to-pdf": {
    name: "PNG to PDF",
    h1: "Convert PNG Images to PDF",
    title: "PNG to PDF Converter - High Quality PNG to PDF",
    description:
      "Easily turn your PNG files into a single PDF document without losing quality. 100% secure and private.",
    keywords: "png to pdf, convert png to pdf, png merge pdf",
    schemaType: "WebApplication",
    category: "Image",
  },
  "protect-pdf": {
    name: "Protect PDF",
    h1: "Encrypt PDF with Password",
    title: "Protect PDF - Add Password & Permissions Online",
    description:
      "Secure your PDF documents with strong encryption. Set passwords to restrict opening, printing, and copying.",
    keywords: "protect pdf, encrypt pdf, password protect pdf",
    schemaType: "WebApplication",
    category: "Security",
  },

  "pdf-to-word": {
    name: "PDF to Word",
    h1: "Convert PDF to Word Online",
    title: "PDF to Word Converter - 100% Free - Wrklyst",
    description:
      "Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.",
    keywords:
      "pdf to word, convert pdf to docx, pdf to doc, online pdf converter",
    category: "PDF",
    schemaType: "WebApplication",
  },
  "pdf-to-powerpoint": {
    name: "PDF to PowerPoint",
    h1: "Convert PDF to PowerPoint Online",
    title: "PDF to PPTX Converter - Wrklyst",
    description:
      "Turn your PDF files into easy to edit PPT and PPTX slideshows. High-quality conversion that preserves your layout.",
    keywords:
      "pdf to powerpoint, convert pdf to pptx, pdf to ppt, online pdf converter, pdf to slides, free pdf to powerpoint, convert pdf to presentation",
    category: "PDF",
    schemaType: "WebApplication",
  },
  "pdf-to-excel": {
    name: "PDF to Excel",
    title: "Convert PDF to Excel Online - Free Data Extraction | Wrklyst",
    description:
      "Extract tables and data from PDF to Excel (XLSX) spreadsheets accurately without registration.",
    h1: "PDF to Excel Converter",
    keywords: "pdf to excel, pdf to xlsx, extract pdf tables, data conversion",
    schemaType: "WebApplication",

    category: "PDF",
  },
  "pdf-to-html": {
    title: "Convert PDF to HTML Online - Web Ready Code | Wrklyst",
    description:
      "Transform your PDF documents into clean, responsive HTML code. Perfect for web developers and digital archiving.",
    h1: "PDF to HTML Converter",
    keywords:
      "pdf to html, convert pdf to web page, pdf to code, responsive html",
    schemaType: "SoftwareApplication",
    name: "PDF to HTML",
    category: "PDF",
  },
  "merge-pdf": {
    title: "Merge PDF Online - Combine PDF Files for Free | Wrklyst",
    description:
      "Combine multiple PDF files into one document in seconds. Safe, secure, and preserves formatting. Available via web and Developer API.",
    h1: "Merge PDF Documents",
    keywords:
      "merge pdf, combine pdf, join pdf files, pdf merger api, developer pdf api",
    schemaType: "SoftwareApplication",
    name: "PDF Merger",
    category: "PDF",
    apiEndpoint: "/api/v1/pdf/merge",
    apiStatus: "stable",
    isPremium: true,
  },
  "split-pdf": {
    title: "Split PDF Online - Extract Pages via API | Wrklyst",
    description:
      "Split PDF files into individual pages or extract specific ranges instantly. High-performance REST API for developers and businesses.",
    h1: "Split PDF Files",
    keywords:
      "split pdf, extract pages from pdf, pdf splitter api, automate pdf splitting, pdf page extractor",
    schemaType: "SoftwareApplication",
    name: "Split PDF",
    category: "PDF",
    apiEndpoint: "/api/v1/pdf/split",
    apiStatus: "stable",
    isPremium: true,
  },
  "compress-pdf": {
    title: "Compress PDF API - High Fidelity Optimization | Wrklyst",
    h1: "PDF Compression Service",
    description:
      "Enterprise-grade PDF compression API. Reduce file sizes by up to 90% without losing text or image quality.",
    keywords:
      "compress pdf api, pdf optimizer api, reduce pdf size developer, rest api pdf compression",
    schemaType: "SoftwareApplication",
    name: "Compress PDF",
    category: "PDF",
    apiEndpoint: "/api/v1/pdf/compress",
    apiStatus: "stable",
    isPremium: true,
  },
  "unlock-pdf": {
    title: "Unlock PDF - Remove Password & Restrictions | Wrklyst",
    description:
      "Instantly remove passwords, printing, and editing restrictions from PDF files. Our API-driven tool uses 256-bit AES decryption for secure, lossless unlocking.",
    h1: "Unlock Protected PDF Documents",
    keywords:
      "unlock pdf, remove pdf password, pdf decrypter api, bypass pdf security, remove pdf restrictions, qpdf online",
    schemaType: "WebApplication",
    name: "Unlock PDF",
    category: "Security", // Assuming "Security" or "PDF" is in your ToolCategory type
    apiEndpoint: "/api/v1/pdf/unlock",
    apiStatus: "stable",
    isPremium: false,
  },
  "pdf-to-pdfa": {
    title: "PDF to PDF/A Converter - Long-Term Archival | Wrklyst",
    description:
      "Convert your PDF documents to ISO-standard PDF/A for long-term storage and legal compliance. Ensure your files remain readable for decades.",
    h1: "Convert PDF to Archive Format (PDF/A)",
    keywords:
      "pdf to pdf/a, convert pdf/a online, archive pdf api, legal document storage, pdf/a-2b conversion",
    schemaType: "WebApplication",
    name: "PDF to PDF/A",
    category: "PDF",
    apiEndpoint: "/api/v1/pdf/convert-archive",
    apiStatus: "stable",
    isPremium: true, // This is often a premium feature in SaaS
  },
  "age-calculator": {
    title: "Age Calculator - Exact Age in Years, Months, Days | Wrklyst",
    description:
      "Calculate your exact age in years, months, days, hours, and minutes. Find out your upcoming birthday and zodiac sign instantly.",
    h1: "Calculate Your Exact Age",
    keywords:
      "age calculator, chronological age, how old am i, birthday calculator, age api",
    schemaType: "WebApplication",
    name: "Age Calculator",
    category: "Utilities",
    apiEndpoint: "/api/v1/utilities/age-calculator",
    apiStatus: "stable",
    isPremium: false,
  },
  "date-difference": {
    title: "Date Difference Calculator - Days Between Two Dates | Wrklyst",
    description:
      "Calculate the exact number of days, weeks, months, and years between two dates. Includes options for business days and leap year counting.",
    h1: "Date Difference & Duration Calculator",
    keywords:
      "date difference, days between dates, duration calculator, day counter, date gap api, working days calculator",
    schemaType: "WebApplication",
    name: "Date Difference",
    category: "Utilities",
    apiEndpoint: "/api/v1/utilities/date-difference",
    apiStatus: "stable",
    isPremium: false,
  },
  "ip-checker": {
    title: "IP Address Checker - What is my IP Address? | Wrklyst",
    description:
      "Find your public IP address (IPv4/IPv6), location, ISP, and network details instantly. Secure and fast IP lookup tool.",
    h1: "My IP Address Details",
    keywords:
      "what is my ip, ip address checker, ip lookup, track ip location, isp checker, public ip api",
    schemaType: "WebApplication",
    name: "IP Checker",
    category: "Utilities",
    apiEndpoint: "/api/v1/utilities/ip-checker",
    apiStatus: "stable",
    isPremium: false,
  },
  "speed-test": {
    title: "Internet Speed Test - Check Your Download & Upload Mbps | Wrklyst",
    description:
      "Test your internet connection speed instantly. Measure your download speed, upload speed, and ping latency to our secure servers. Free, fast, and no ads.",
    h1: "Internet Speed Test",
    keywords:
      "speed test, internet speed, wifi speed test, broadband speed, bandwidth test api, check my mbps, ping test, network latency",
    schemaType: "WebApplication",
    name: "Speed Test",
    category: "Utilities",
    apiEndpoint: "/api/v1/utilities/speed-test/download",
    apiStatus: "stable",
    isPremium: false,
  },
  "qr-generator": {
    title: "Advanced QR Code Generator - Custom WiFi, URL & V-Cards | Wrklyst",
    description:
      "Create high-resolution custom QR codes for free. Supports WiFi auto-connect, URL redirection, and V-Card contacts. Customize colors and download in print-ready PNG format.",
    h1: "Professional QR Code Studio",
    keywords:
      "qr code generator, wifi qr code, custom qr code with color, high res qr code, qr code for business cards, scan to connect wifi, free qr generator",
    schemaType: "WebApplication",
    name: "QR Code Studio",
    category: "Utilities",
    apiEndpoint: "/api/v1/utilities/qr-generator",
    apiStatus: "stable",
    isPremium: false,
  },
};
