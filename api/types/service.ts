import { ObjectId } from "mongodb";

export interface Service {
    _id?: ObjectId;
    name: string;
    description: string;
    time: number;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}