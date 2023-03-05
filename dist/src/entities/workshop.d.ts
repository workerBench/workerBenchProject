export declare class WorkShop {
    id: number;
    title: string;
    category: 'online' | 'offline';
    desc: string;
    thumb: string;
    min_member: number;
    max_member: number;
    total_time: number;
    price: number;
    status: 'request' | 'approval' | 'rejected' | 'finished';
    location: string | null;
    user_id: number | null;
    genre_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
