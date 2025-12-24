import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    "pdf/merge",
    "pdf/compress",
    "image/resize",
  ];

  const toolUrls = tools.map((tool) => ({
    url: `https://yourdomain.com/tools/${tool}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: "https://yourdomain.com",
      lastModified: new Date(),
    },
    {
      url: "https://yourdomain.com/tools",
      lastModified: new Date(),
    },
    ...toolUrls,
  ];
}
