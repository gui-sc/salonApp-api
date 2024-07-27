import { ObjectId } from "mongodb";

export interface Schedule {
    _id?: ObjectId;
    userId: ObjectId;
    professionalId: ObjectId;
    serviceId: ObjectId;
    date: Date;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}