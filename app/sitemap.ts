import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { LEGAL_UPDATED } from "@/config/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const legalDate = new Date(LEGAL_UPDATED);
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1, lastModified: new Date() },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3, lastModified: legalDate },
    { url: `${SITE_URL}/terms-of-service`, changeFrequency: "yearly", priority: 0.3, lastModified: legalDate },
  ];
}
