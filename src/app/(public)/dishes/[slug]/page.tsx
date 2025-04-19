import dishApiRequest from "@/apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import DishDetail from "./dish-detail";
import { Metadata } from "next";
import { cache } from "react";

export const metadata: Metadata = {
  title: "Dish details · GoodFill",
  description: "GoodFill is where you can fill your stomach with love",
};

const getDetail = cache((id: number) =>
  wrapServerApi(() => dishApiRequest.getDish(id))
);

export default async function DishPage(props: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const params = await props.params;

  const { slug } = params;

  const id = getIdFromSlugUrl(slug);

  const data = await getDetail(id);

  // console.log(data);
  const dish = data?.payload.data;

  return <DishDetail dish={dish} />;
}
