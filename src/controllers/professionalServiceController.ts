import { Request, Response } from "express";
import MongoDBService from "../services/MongoDBService";
import { ProfessionalService } from "../types/professionalService";
import { createProfessionalServiceSchema } from "../schemas/professionalServiceSchema";
import { ObjectId } from "mongodb";
import { ZodError } from "zod";
import { getAndDeleteSchema } from "../schemas/uniqueSchema";
import { Professional } from "../types/professional";
import { Service } from "../types/service";

export async function create(req: Request, res: Response) {
    try {
        const { body } = await createProfessionalServiceSchema.parseAsync(req);
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        await MongoDBService.db.collection('professionals')
            .findOne({ _id: new ObjectId(body.professionalId) })
            .then(professional => {
                if (!professional) {
                    return res.status(404).send({ message: "Professional not found" });
                }
            });

        await MongoDBService.db.collection('services')
            .findOne({ _id: new ObjectId(body.serviceId) })
            .then(service => {
                if (!service) {
                    return res.status(404).send({ message: "Service not found" });
                }
            });

        const professionalServicesColl = MongoDBService.db.collection<ProfessionalService>('professionalServices');
        await professionalServicesColl.insertOne({
            professionalId: new ObjectId(body.professionalId),
            serviceId: new ObjectId(body.serviceId),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return res.status(201).send({ message: "Professional Service created" });
    } catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { params } = await getAndDeleteSchema.parseAsync(req);
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const professionalServicesColl = MongoDBService.db.collection<ProfessionalService>('professionalServices');
        const professionalService = await professionalServicesColl.findOneAndDelete({ _id: new ObjectId(params.id) });
        if (!professionalService) {
            return res.status(404).send({ message: "Professional Service not found" });
        }
        return res.status(200).send({ message: "Professional Service removed" });
    } catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function getByService(req: Request, res: Response) {
    try {
        const { params } = await getAndDeleteSchema.parseAsync(req);
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const professionalServicesColl = MongoDBService.db.collection<ProfessionalService>('professionalServices');
        const professionalServices = await professionalServicesColl.find({ serviceId: new ObjectId(params.id) }).toArray();
        const professionalColl = MongoDBService.db.collection<Professional>('professionals');
        const serviceColl = MongoDBService.db.collection<Service>('services');

        for await (const professionalService of professionalServices) {
            const professional = await professionalColl.findOne({ _id: professionalService.professionalId });
            if (!professional) {
                return res.status(404).send({ message: "Professional not found" });
            }
            professionalService.professional = professional;
            const service = await serviceColl.findOne({ _id: professionalService.serviceId });
            if (!service) {
                return res.status(404).send({ message: "Service not found" });
            }
            professionalService.service = service;
        }

        return res.status(200).send(professionalServices);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function getByProfessional(req: Request, res: Response) {
    try {
        const { params } = await getAndDeleteSchema.parseAsync(req);
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const professionalServicesColl = MongoDBService.db.collection<ProfessionalService>('professionalServices');
        const professionalServices = await professionalServicesColl.find({ professionalId: new ObjectId(params.id) }).toArray();
        const professionalColl = MongoDBService.db.collection<Professional>('professionals');
        const serviceColl = MongoDBService.db.collection<Service>('services');

        for await (const professionalService of professionalServices) {
            const professional = await professionalColl.findOne({ _id: professionalService.professionalId });
            if (!professional) {
                return res.status(404).send({ message: "Professional not found" });
            }
            professionalService.professional = professional;
            const service = await serviceColl.findOne({ _id: professionalService.serviceId });
            if (!service) {
                return res.status(404).send({ message: "Service not found" });
            }
            professionalService.service = service;
        }

        return res.status(200).send(professionalServices);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}