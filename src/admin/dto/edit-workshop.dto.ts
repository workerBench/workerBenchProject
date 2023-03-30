import { PickType } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";
import { WorkShop } from "src/entities/workshop";

export class editWorkshopDto extends PickType (WorkShop, [
    "title",
    "category",
    "desc",
    "min_member",
    "max_member",
    "total_time",
    "price",
] as const) {
    @IsNumber()
    readonly genre_id: number;

    @IsArray()
    readonly purpose_tag_id: number[];
}