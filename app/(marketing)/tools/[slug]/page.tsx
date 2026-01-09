import { notFound } from "next/navigation";
import WordCounter from "@/app/components/Tools/WordCounter/WordCounter";
import { TOOLS_CONFIG } from "@/lib/tools-data";
import TextCompare from "@/app/components/Tools/TextCompare/TextCompare";
import TextFormatter from "@/app/components/Tools/TextFormatter/TextFormatter";
import JsonFormatter from "@/app/components/Tools/JsonFormatter/JsonFormatter";
import CodeBeautifier from "@/app/components/Tools/CodeBeautifier/CodeBeautifier";
import DummyTextGenerator from "@/app/components/Tools/DummyTextGenerator/DummyTextGenerator";
import ConverterTool from "@/app/components/Tools/ConverterTool/ConverterTool";
import GrammarChecker from "@/app/components/Tools/GrammarChecker/GrammarChecker";
import RemoveSpecialChars from "@/app/components/Tools/RemoveSpecialChars/RemoveSpecialChars";
import RemoveEmojis from "@/app/components/Tools/RemoveEmojis/RemoveEmojis";
import JsonToCsv from "@/app/components/Tools/JsonToCsv/JsonToCsv";
import TimestampConverter from "@/app/components/Tools/TimestampConverter/TimestampConverter";
import HashGenerator from "@/app/components/Tools/HashGenerator/HashGenerator";
import HtpasswdGenerator from "@/app/components/Tools/HtpasswdGenerator/HtpasswdGenerator";
import EmojiConverter from "@/app/components/Tools/EmojiConverter/EmojiConverter";

type PageProps = {
  params: Promise<{ slug: string }>;
};
const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  "word-counter": WordCounter,
  "text-compare": TextCompare,
  "text-formatter": TextFormatter,
  "json-formatter": JsonFormatter,
  "code-beautifier": CodeBeautifier,
  "dummy-text-generator": DummyTextGenerator, 
  "base64-encoder-decoder": () => <ConverterTool mode="base64-enc" />,
  "url-encoder-decoder": () => <ConverterTool mode="url-enc" />,
  "text-to-slug": () => <ConverterTool mode="slug" />,
  "grammar-checker": GrammarChecker,
  "remove-special-characters": RemoveSpecialChars,
  "remove-emojis": RemoveEmojis,
  "json-to-csv": JsonToCsv,
  "timestamp-converter": TimestampConverter,
  "hash-generator": HashGenerator,
  "htpasswd-generator": HtpasswdGenerator,
  "emoji-converter": EmojiConverter,
};
// 1. DYNAMIC METADATA (SEO)
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOLS_CONFIG[slug];

  if (!tool) return { title: "Tool Not Found" };

  return {
    // Sync these with your TOOLS_CONFIG keys
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: `https://wrklyst.com/tools/${slug}`,
    },
  };
}

// 2. DYNAMIC PAGE
export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOLS_CONFIG[slug];

  if (!tool) {
    notFound();
  }

  // STRUCTURED DATA (JSON-LD) for Google Stars
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
  const ActiveTool = TOOL_COMPONENTS[slug];

  return (
    <div className="pt-44 pb-20 max-w-7xl mx-auto px-10">
      {/* Injecting Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1E1F4B]">{tool.name}</h1>
        <p className="text-slate-500 mt-2">{tool.description}</p>
      </div>

      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
        {/* 3. Render the tool if it exists, otherwise show 'Coming Soon' */}
        {ActiveTool ? (
          <ActiveTool />
        ) : (
          <div className="text-center py-20 italic text-slate-400">
            Logic for {tool.name} is coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
