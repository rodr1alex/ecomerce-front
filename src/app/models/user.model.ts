import { Cart } from "./cart.model";
import { Direction } from "./direction.model";
import { Role } from "./role.model";

export class User {
    id: number = 0;
    name!: string;
    lastname!: string;
    email!: string;
    username!: string;
    password!: string;
    directionList!: Direction[];
    cartList!: Cart[];
    roles!: Role[];
}