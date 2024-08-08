import { ObjectId } from "mongodb";

export interface Review {
    _id?: ObjectId;
    userId: ObjectId;
    professionalId: ObjectId;
    scheduleId: ObjectId;
    serviceId: ObjectId;
    rating: number;
    comment?: string;
    createdAt?: Date;
    updatedAt?: Date;
}