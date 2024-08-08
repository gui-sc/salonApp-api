import { ObjectId } from "mongodb";

export interface Schedule {
    _id?: ObjectId;
    userId: ObjectId;
    professionalId: ObjectId;
    serviceId: ObjectId;
    dateTime: Date;
    time: number;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}