-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Accepted', 'Payed', 'Delivered', 'Canceled');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('Andijon', 'Buxoro', 'Fargona', 'Jizzax', 'Navoiy', 'Xorazm', 'Namangan', 'Sirdaryo', 'Toshkent', 'Samarqand', 'Qashqadaryo', 'Surxondaryo', 'Qoraqalpoghiston', 'Toshkent_viloyati');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "imageUrl" TEXT,
    "description" JSONB NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instruction" JSONB NOT NULL,
    "category_id" TEXT NOT NULL,
    "characteristic_id" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImages" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "ProductImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Characteristic" (
    "id" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "caution" JSONB,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "volume" JSONB NOT NULL,
    "made_in" JSONB NOT NULL,
    "purpose" JSONB NOT NULL,
    "gender" JSONB NOT NULL,
    "skin_type" JSONB NOT NULL,
    "ingredients" JSONB NOT NULL,
    "application_time" JSONB NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Characteristic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "telegram_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("telegram_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone_number" TEXT NOT NULL,
    "total_price" INTEGER NOT NULL,
    "delivery_fee" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "status" "OrderStatus" NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetails" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,

    CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_imageUrl_key" ON "Category"("imageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Characteristic_product_id_key" ON "Characteristic"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_telegram_id_key" ON "User"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImages" ADD CONSTRAINT "ProductImages_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Characteristic" ADD CONSTRAINT "Characteristic_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("telegram_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
