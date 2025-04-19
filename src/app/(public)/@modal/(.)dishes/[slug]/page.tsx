import dishApiRequest from "@/apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import Modal from "./modal";
import DishDetail from "@/app/(public)/dishes/[slug]/dish-detail";

export default async function DishPage(props: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const id = getIdFromSlugUrl(slug);
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;

  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
}
