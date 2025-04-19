import dishApiRequest from "@/apiRequests/dish";
import envConfig from "@/config";
import { generateSlugUrl } from "@/lib/utils";
import type { MetadataRoute } from "next";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: "",
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: "/login",
    changeFrequency: "yearly",
    priority: 0.5,
  },
];

type ChangeFrequency =
  | "daily"
  | "always"
  | "hourly"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await dishApiRequest.list();

  const dishList = result.payload.data;

  const staticSitemap = staticRoutes.map((route) => {
    return {
      ...route,
      url: `${envConfig.NEXT_PUBLIC_URL}${route.url}`,
      lastModified: new Date(),
    };
  });

  const dishSiteMap = dishList.map((dish) => {
    return {
      url: `${envConfig.NEXT_PUBLIC_URL}/dishes/${generateSlugUrl({
        name: dish.name,
        id: dish.id,
      })}`,
      lastModified: dish.updatedAt,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.9,
    };
  });

  return [...staticSitemap, ...dishSiteMap];
}
