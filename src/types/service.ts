import { ObjectId } from "mongodb";

export interface Service {
    _id?: ObjectId;
    name: string;
    description: string;
    time: number;
    createdAt?: Date;
    updatedAt?: Date;
}