export type {
  User,
  UserRole,
  Product,
  Tool,
  Order,
  OrderItem,
  Subscription,
  SubscriptionPlan,
  UserToolAccess,
  ToolAccessSource,
} from "@prisma/client";

export type CartItem =
  | {
      type: "product";
      productId: string;
      name: string;
      price: number;
      quantity: number;
      size?: string;
      color?: string;
      image?: string;
    }
  | {
      type: "tool";
      toolId: string;
      name: string;
      price: number;
      image?: string;
    };

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}
