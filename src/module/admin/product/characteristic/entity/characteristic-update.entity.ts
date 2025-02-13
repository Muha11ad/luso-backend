import { Characteristic, Prisma } from "@prisma/client";
import { updateTranslation } from "@/shared/utils/helpers";
import { CharacteristicUpdateReq } from "../characteristic.interface";

export class CharacteristicUpdateEntity {
    private updatingData: CharacteristicUpdateReq;

    constructor(oldData: Characteristic, newData: CharacteristicUpdateReq) {
        this.updatingData = { ...newData };
        this.updateTranslationFields(oldData, newData);
        this.updateExpirationDate(newData);
    }

    private updateTranslationFields(oldData: Characteristic, newData: CharacteristicUpdateReq): void {
        const translationFields: (keyof CharacteristicUpdateReq)[] = [
            "caution",
            "madeIn",
            "purpose",
            "gender",
            "skinType",
            "ingredients",
            "applicationTime"
        ];

        translationFields.forEach((field: string) => {
            if (newData[field]) {
                this.updatingData[field] = updateTranslation(oldData[field], newData[field]);
            }
        });
    }

    private updateExpirationDate(newData: CharacteristicUpdateReq): void {
        if (newData?.expirationDate) {
            const date = new Date(newData.expirationDate);
            if (!isNaN(date.getTime())) {
                this.updatingData.expirationDate = date.toISOString();
            }
        }
    }

    toPrisma(): Prisma.CharacteristicUpdateInput {
        return {
            ...this.updatingData
        };
    }
}
