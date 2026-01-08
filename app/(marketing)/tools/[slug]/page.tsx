import { notFound } from "next/navigation";
import WordCounter from "@/app/components/Tools/WordCounter/WordCounter";
import { TOOLS_CONFIG } from "@/lib/tools-data";

type PageProps = {
  params: Promise<{ slug: string }>;
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
    }
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
    "name": tool.name,
    "description": tool.description,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

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
        {slug === "word-counter" && <WordCounter />}
        
        {/* Placeholder for future tools */}
        {slug !== "word-counter" && (
          <div className="text-center py-20 italic text-slate-400">
            Logic for {tool.name} is coming soon...
          </div>
        )}
      </div>
    </div>
  );
}