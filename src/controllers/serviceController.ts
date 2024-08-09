import { Request, Response } from "express";
import MongoDBService from "../services/MongoDBService";
import { createServiceSchema, updateServiceSchema } from "../schemas/serviceSchema";
import { Service } from "../types/service";
import { ZodError } from "zod";
import { getAndDeleteSchema } from "../schemas/uniqueSchema";
import { ObjectId } from "mongodb";

export async function create(req: Request, res: Response) {
    try {
        const { body } = await createServiceSchema.parseAsync(req);

        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const servicesColl = MongoDBService.db.collection<Service>('services');
        await servicesColl.insertOne({
            name: body.name,
            description: body.description,
            time: body.time,
            price: body.price,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return res.status(201).send({ message: "Service created" });
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

export async function list(req: Request, res: Response) {
    try {
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const servicesColl = MongoDBService.db.collection<Service>('services');
        const services = await servicesColl.find().toArray();

        return res.status(200).send(services);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function get(req: Request, res: Response) {
    try {
        const { params } = await getAndDeleteSchema.parseAsync(req);

        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const servicesColl = MongoDBService.db.collection<Service>('services');
        const service = await servicesColl.findOne({ _id: new ObjectId(params.id) });

        if (!service) {
            return res.status(404).send({ message: "Service not found" });
        }

        return res.status(200).send(service);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function update(req: Request, res: Response) {
    try {
        const { params, body } = await updateServiceSchema.parseAsync(req);

        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const servicesColl = MongoDBService.db.collection<Service>('services');
        const service = await servicesColl.findOne({ _id: new ObjectId(params.id) });

        if (!service) {
            return res.status(404).send({ message: "Service not found" });
        }

        await servicesColl.updateOne({ _id: new ObjectId(params.id) }, {
            $set: {
                name: body.name,
                description: body.description,
                time: body.time,
                price: body.price,
                updatedAt: new Date(),
            }
        });

        return res.status(200).send({ message: "Service updated" });
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

        const servicesColl = MongoDBService.db.collection<Service>('services');
        const service = await servicesColl.findOne({ _id: new ObjectId(params.id) });

        if (!service) {
            return res.status(404).send({ message: "Service not found" });
        }

        await servicesColl.deleteOne({ _id: new ObjectId(params.id) });

        return res.status(200).send({ message: "Service removed" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}