"use client";

import Image from "next/image";
import { useGuestGetOrderListQuery } from "@/queries/useGuest";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo } from "react";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import { toast } from "@/hooks/use-toast";
import { OrderStatus } from "@/constants/type";
import Quantity from "../menu/quantity";
import { useAppContext } from "@/components/app-provider";

export default function OrdersCart() {
  const { socket } = useAppContext();
  const { data, refetch } = useGuestGetOrderListQuery();
  // console.log(data);
  const orders = useMemo(() => data?.payload.data || [], [data]);

  const { orderNotPaid, orderPaid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Pending ||
          order.status === OrderStatus.Processing
        ) {
          return {
            ...result,
            orderNotPaid: {
              price:
                result.orderNotPaid.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.orderNotPaid.quantity + order.quantity,
            },
          };
        }

        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            orderPaid: {
              price:
                result.orderPaid.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.orderPaid.quantity + order.quantity,
            },
          };
        }

        return result;
      },
      {
        orderNotPaid: {
          price: 0,
          quantity: 0,
        },
        orderPaid: {
          price: 0,
          quantity: 0,
        },
      }
    );
  }, [orders]);

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      console.log(data);
      const {
        dishSnapshot: { name },
        quantity,
      } = data;
      toast({
        description: `Đơn hàng ${name} (SL: ${quantity}) của bạn đã được cập nhật sang trang thai ${getVietnameseOrderStatus(
          data.status
        )}`,
      });
      refetch(); // refetch api to update order state when server sends event
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast({
        description: `Guest ${guest?.name} at ${guest?.tableNumber} table has just paid successfully ${data.length} orders`,
      });
      refetch();
    }

    // receive event from server
    socket?.on("update-order", onUpdateOrder);
    socket?.on("payment", onPayment);

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);

    return () => {
      socket?.off("update-order", onUpdateOrder);
      socket?.off("payment", onPayment);

      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
    };
  }, [refetch]);

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-sm font-semibold">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} đ *{" "}
              <Badge className="px-1">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge className="px-1" variant={"outline"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0 ">
        <div className="w-full space-x-4 justify-between text-xl font-semibold">
          <span>Order not paid - {orderNotPaid.quantity} mon:</span>
          <span>{formatCurrency(orderNotPaid.price)} đ</span>
        </div>
      </div>
      {orderPaid.quantity !== 0 && (
        <div className="sticky bottom-0 ">
          <div className="w-full space-x-4 justify-between text-xl font-semibold">
            <span>Order paid - {orderPaid.quantity} mon:</span>
            <span>{formatCurrency(orderPaid.price)} đ</span>
          </div>
        </div>
      )}
    </>
  );
}
