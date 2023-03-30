import { IsNotEmpty } from 'class-validator';

export class RefundDto {
  @IsNotEmpty()
  workshopInstance_id: number;

  @IsNotEmpty()
  workshop_id: number;

  @IsNotEmpty()
  merchant_uid: string;

  @IsNotEmpty()
  cancel_request_amount: number;

  @IsNotEmpty()
  reason: string;
}
