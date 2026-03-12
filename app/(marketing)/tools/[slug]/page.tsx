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
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: tool.h1,
      description: tool.description,
      url: `https://wrklyst.com/tools/${slug}`,
      type: "website",
      images: [
        {
          url: `https://wrklyst.com/og-tool-${slug}.png`,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.h1,
      description: tool.description,
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
    "@type": tool.schemaType,
    name: tool.name,
    description: tool.description,
    url: `https://wrklyst.com/tools/${slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    image: `https://wrklyst.com/og-tool-${slug}.png`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2500+",
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
