import { Cart } from "./cart.model";
import { Direction } from "./direction.model";

export class User {
    id!: number;
    name!: string;
    lastname!: string;
    email!: string;
    username!: string;
    password!: string;
    directionList!: Direction[];
    cartList!: Cart[];
}