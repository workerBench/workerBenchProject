import { PickType } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { WorkShop } from "src/entities/workshop";

export class editWorkshopDto extends PickType (WorkShop, [
    "title",
    "category",
    "desc",
    "thumb",
    "min_member",
    "max_member",
    "total_time",
    "price",
    "location",
] as const) {}