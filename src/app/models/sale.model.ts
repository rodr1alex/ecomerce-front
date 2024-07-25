import { Direction } from "./direction.model";

export class Sale{
    sale_id!: number;
    date!: any;
    direction!: Direction;
    user_id!: number;
    cart_id!: number;
    status!: string;
    username!: string;
}