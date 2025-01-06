import { OrderCreateDto } from '../dto';

export class OrderCreateEntity {
  constructor(private readonly data: OrderCreateDto) {}

  private completeOrderDetails(): {
    product_price: number;
    quantity: number;
    total_price: number;
    product_id: string;
    product_name: string;
  }[] {
    return this.data.orderDetails.map((detail) => ({
      ...detail,
      total_price: detail.product_price * detail.quantity,
    }));
  }

  private get orderTotalPrice(): number {
    return this.completeOrderDetails().reduce((acc, detail) => acc + detail.total_price, 0);
  }

  toPrisma() {
    return {
      region: this.data.region,
      status: this.data.status,
      user_id: this.data.user_id,
      first_name: this.data.first_name,
      phone_number: this.data.phone_number,
      delivery_fee: this.data.delivery_fee,
      total_price: this.orderTotalPrice,
      OrderDetails: {
        create: this.completeOrderDetails(),
      },
    };
  }

  toOrderDetails() {
    return this.completeOrderDetails();
  }
}
