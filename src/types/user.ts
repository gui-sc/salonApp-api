import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    active: boolean;
    birth: Date;
    createdAt?: Date;
    updatedAt?: Date;
}