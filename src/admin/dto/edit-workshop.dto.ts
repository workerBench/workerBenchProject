import { IsNumber, IsString } from "class-validator";

export class editWorkshopDto {
    @IsString()
    readonly title: string;

    @IsString()
    readonly category: "online" | "offline";

    @IsString()
    readonly desc: string;

    @IsString()
    readonly thumb: string;

    @IsNumber()
    readonly min_member: number;

    @IsNumber()
    readonly max_member: number;

    @IsNumber()
    readonly total_time: number;

    @IsNumber()
    readonly price: number;

    @IsString()
    readonly location: string;
}