export class OrderDetailsUpdateEntity {
  private quantity: number;
  private product_price: number;
  private total_price: number;

  constructor(quantity: number, product_price: number) {
    this.quantity = quantity;
    this.product_price = product_price;
    this.total_price = this.calculateTotalPrice();
  }

  private calculateTotalPrice(): number {
    return this.quantity * this.product_price;
  }

  public updateQuantity(newQuantity: number): void {
    this.quantity = newQuantity;
    this.total_price = this.calculateTotalPrice();
  }

  public updateProductPrice(newProductPrice: number): void {
    this.product_price = newProductPrice;
    this.total_price = this.calculateTotalPrice();
  }

  public getTotalPrice(): number {
    return this.total_price;
  }
}
