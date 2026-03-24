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
