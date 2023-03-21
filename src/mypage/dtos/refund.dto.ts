import { IsNotEmpty } from 'class-validator';

export class RefundDto {
  @IsNotEmpty()
  workshopInstance_id: string;

  @IsNotEmpty()
  merchant_uid: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  reason: string;
}
