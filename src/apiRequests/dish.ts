import http from "@/lib/http";

import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const prefix = "/dishes";

const dishApiRequest = {
  // Note: In Nestjs 15 will be fetch dynamic rendering by default {cache: "no-store"}
  list: () =>
    http.get<DishListResType>(prefix, {
      next: { tags: ["dishes"] },
    }), // get dish list
  addDish: (body: CreateDishBodyType) => http.post<DishResType>(prefix, body),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`${prefix}/${id}`, body),
  getDish: (id: number) => http.get<DishResType>(`${prefix}/${id}`),
  deleteDish: (id: number) => http.delete<DishResType>(`${prefix}/${id}`),
};

export default dishApiRequest;
