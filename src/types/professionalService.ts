import { ObjectId } from "mongodb";

export interface ProfessionalService {
    _id?: ObjectId;
    professionalId: ObjectId;
    serviceId: ObjectId;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}