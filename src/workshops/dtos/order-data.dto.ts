// 테스트용 dto
export class OrderDto {
  company: string;
  name: string;
  email: string;
  phone_number: string;
  wish_date: string;
  purpose: string;
  wish_location: string;
  member_cnt: number;
  etc: string;
  category: 'online' | 'offline';
}
