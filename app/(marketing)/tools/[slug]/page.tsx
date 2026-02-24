import { notFound } from "next/navigation";
import { TOOLS_CONFIG } from "@/lib/tools-data";
import ToolRenderer from "./ToolRenderer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// 1. DYNAMIC METADATA (SEO) - STAYS HERE
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOLS_CONFIG[slug];

  if (!tool) return { title: "Tool Not Found" };

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: `https://wrklyst.com/tools/${slug}`,
    },
  };
}

// 2. DYNAMIC PAGE (Server Component)
export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOLS_CONFIG[slug];

  if (!tool) {
    notFound();
  }

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

  return (
    <div className="pt-44 pb-20 max-w-7xl mx-auto px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1E1F4B]">{tool.name}</h1>
        <p className="text-slate-500 mt-2">{tool.description}</p>
      </div>

      <div className="bg-white rounded-[40px] p-0 border border-slate-100 shadow-sm">
        {/* 3. Render the Client Switcher here */}
        <ToolRenderer slug={slug} toolName={tool.name} />
      </div>
    </div>
  );
}
