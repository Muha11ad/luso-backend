import { Prisma } from "@prisma/client";
import { createTranslation } from "@/shared/utils/helpers";
import { CharacteristicCreateReq } from "../characteristic.interface";

export class CharacteristicCreateEntity {

    constructor(private readonly data: CharacteristicCreateReq) { }

    toPrisma(): Prisma.CharacteristicCreateInput {

        return {
            age: this.data.age,
            brand: this.data.brand,
            volume: this.data.volume,
            gender: createTranslation(this.data.gender),
            made_in: createTranslation(this.data.madeIn),
            caution: createTranslation(this.data.caution),
            purpose: createTranslation(this.data.purpose),
            skin_type: createTranslation(this.data.skinType),
            expiration_date: new Date(this.data.expirationDate),
            ingredients: createTranslation(this.data.ingredients),
            application_time: createTranslation(this.data.applicationTime),
            product: {
                connect: {
                    id: this.data.productId
                }
            }
        };

    }

}
