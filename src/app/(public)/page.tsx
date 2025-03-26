import Image from "next/image";
import bannerImg from "@/assets/images/banner.png";
import dishApiRequest from "@/apiRequests/dish";
import { DishListResType } from "@/schemaValidations/dish.schema";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("HomePage");

  let dishList: DishListResType["data"] = [];
  // this is home page, so fetch dish as a server component
  try {
    const result = await dishApiRequest.list();
    const {
      payload: { data },
    } = result;
    dishList = data;
  } catch (error) {
    return <div>Something went wrong</div>;
  }

  // console.log(dishList); // log in terminal as this is a server component

  return (
    <div className="w-full space-y-4">
      <section className="relative z-10">
        <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
        <Image
          src={bannerImg}
          width={400}
          height={200}
          quality={100}
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="text-white z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
            {t("title")}
          </h1>
          <p className="text-center text-sm sm:text-base mt-4">
            Fill your stomach with love
          </p>
        </div>
      </section>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">Dish diversification</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {dishList.map((dish) => (
            <Link
              href={`/dishes/${dish.id}`}
              className="flex gap-4 w"
              key={dish.id}
            >
              <div className="flex-shrink-0">
                <Image
                  alt={dish.name}
                  src={dish.image}
                  className="object-cover w-[150px] h-[150px] rounded-md"
                  width={150}
                  height={150}
                  quality={100}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">
                  {dish?.name ? dish.name : "There is no name"}
                </h3>
                <p className="">
                  {dish.description
                    ? dish.description
                    : "There is no description"}
                </p>
                <p className="font-semibold">{dish.price ? dish.price : 0}đ</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
