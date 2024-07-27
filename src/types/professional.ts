import { ObjectId } from "mongodb";

export interface Professional {
    _id?: ObjectId;
    name: string;
    picture?: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}