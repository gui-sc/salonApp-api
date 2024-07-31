import { ObjectId } from "mongodb";
import { Professional } from "./professional";
import { Service } from "./service";

export interface ProfessionalService {
    _id?: ObjectId;
    professionalId: ObjectId;
    serviceId: ObjectId;
    professional?: Professional;
    service?: Service;
    createdAt?: Date;
    updatedAt?: Date;
}