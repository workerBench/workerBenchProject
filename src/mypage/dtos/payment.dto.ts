import { IsNotEmpty } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  workshop_id: number;

  @IsNotEmpty()
  imp_uid: string;

  @IsNotEmpty()
  merchant_uid: string;
}
