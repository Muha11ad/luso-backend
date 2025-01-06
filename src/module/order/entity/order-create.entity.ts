import { OrderStatus, Region, User } from '@prisma/client';
import { OrderCreateDto, OrderDetails as OrderDetailsDto } from '../dto';

export class OrderCreateEntity {
  private user_id: number;
  private region: Region;
  private first_name: string;
  private phone_number: string;
  private status: OrderStatus;
  private delivery_fee: number;
  private orderDetails: OrderDetailsDto[];

  constructor(data: OrderCreateDto, user: User) {
    this.region = data.region;
    this.status = data.status;
    this.user_id = user.telegram_id;
    this.first_name = data.first_name;
    this.phone_number = data.phone_number;
    this.orderDetails = data.orderDetails;
    this.delivery_fee = data.delivery_fee;
  }

  private completeOrderDetails(): {
    product_price: number;
    quantity: number;
    total_price: number;
    product_id: string;
    product_name: string;
  }[] {
    return this.orderDetails.map((detail) => ({
      ...detail,
      total_price: detail.product_price * detail.quantity,
    }));
  }

  private get orderTotalPrice(): number {
    return this.completeOrderDetails().reduce((acc, detail) => acc + detail.total_price, 0);
  }

  toPrisma() {
    return {
      region: this.region,
      status: this.status,
      user_id: this.user_id,
      first_name: this.first_name,
      phone_number: this.phone_number,
      delivery_fee: this.delivery_fee,
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
