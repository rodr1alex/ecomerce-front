import { Direction } from "./direction.model";

export class Sale{
    sale_id!: number;
    date!: any;
    direction!: Direction;
    username!: string;
    user_id!: number;
    total!: number;
    items!: number;
    cart_id!: number;
}