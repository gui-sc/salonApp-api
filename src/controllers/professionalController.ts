import { Request, Response } from "express";
import MongoDBService from "../services/MongoDBService";
import { createProfessionalSchema, updateProfessionalSchema } from "../schemas/professionalSchema";
import { Professional } from "../types/professional";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import { ZodError } from "zod";
import { loginSchema, getAndDeleteSchema } from "../schemas/uniqueSchema";

export async function login(req: Request, res: Response) {
    try {
        const { body } = await loginSchema.parseAsync(req);
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const professionalsColl = MongoDBService.db.collection<Professional>('professionals');
        const professional = await professionalsColl.findOne({ email: body.email });
        if (!professional) {
            return res.status(401).send({ message: "Invalid Credentials" });
        }

        const passwordMatch = await bcrypt.compare(body.password, professional.password);
        if (!passwordMatch) {
            return res.status(401).send({ message: "Invalid Credentials" });
        }

        const { password, ...rest } = professional;

        return res.status(200).send({ professional: rest });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function create(req: Request, res: Response) {
    try {
        const { body } = await createProfessionalSchema.parseAsync(req);

        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const professionalsColl = MongoDBService.db.collection<Professional>('professionals');
        const password = await bcrypt.hash(body.password, 10);

        await professionalsColl.insertOne({
            email: body.email,
            name: body.name,
            password: password,
            picture: body.picture,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).finally(async () => {
            await MongoDBService.close();
            res.status(201).send({ message: "Professional created" });
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function getAll(req: Request, res: Response) {
    try {
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const professionalsColl = MongoDBService.db.collection<Professional>('professionals');
        const professionals = await professionalsColl.find().toArray();

        const professionalsWithoutPassword = professionals.map(professional => {
            const { password, ...rest } = professional;
            return rest;
        });

        return res.status(200).send({ professionals: professionalsWithoutPassword });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function getOne(req: Request, res: Response) {
    try {
        const { params } = await getAndDeleteSchema.parseAsync(req);

        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const professionalsColl = MongoDBService.db.collection<Professional>('professionals');
        const professional = await professionalsColl.findOne({ _id: new ObjectId(params.id) });

        if (!professional) {
            return res.status(404).send({ message: "Professional not found" });
        }

        const { password, ...rest } = professional;
        return res.status(200).send({ professional: rest });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function update(req: Request, res: Response) {
    try {
        const { body, params } = await updateProfessionalSchema.parseAsync(req);

        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const professionalsColl = MongoDBService.db.collection<Professional>('professionals');
        const professional = await professionalsColl.findOne({ _id: new ObjectId(params.id) });
        if (!professional) {
            return res.status(404).send({ message: "Professional not found" });
        }

        const set: Record<string, any> = { updatedAt: new Date() };

        if (body.name) set.name = body.name;
        if (body.picture) set.picture = body.picture;
        if (body.password) set.password = await bcrypt.hash(body.password, 10);

        await professionalsColl.updateOne({ _id: new ObjectId(params.id) }, {
            $set: set
        });

        return res.status(200).send({ message: "Professional updated" });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function deleteProfessional(req: Request, res: Response) {
    try {
        const { params } = await getAndDeleteSchema.parseAsync(req);

        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const professionalsColl = MongoDBService.db.collection<Professional>('professionals');
        const professional = await professionalsColl.deleteOne({ _id: new ObjectId(params.id) });

        if (!professional.deletedCount) {
            return res.status(404).send({ message: "Professional not found" });
        }

        return res.status(200).send({ message: "Professional deleted" });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}