import { Request, Response } from "express";
import MongoDBService from "../services/MongoDBService";
import { User } from "../types/user";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas";
import { ZodError } from "zod";
import { getAndDeleteSchema, loginSchema } from "../schemas/uniqueSchema";

export async function create(req: Request, res: Response) {
    try {
        const { body } = await createUserSchema.parseAsync(req);
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const usersColl = MongoDBService.db.collection<User>('users');
        const user = await usersColl.findOne({ email: body.email });
        if (user) {
            return res.status(409).send({ message: "Usuário já existe" });
        }
        const password = await bcrypt.hash(body.password, 10);
        await usersColl.insertOne({
            email: body.email,
            name: body.name,
            password,
            active: true,
            birth: body.birth,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).finally(async () => {
            await MongoDBService.close();
            res.status(201).send({ message: "User created" });
        });
    } catch (err) {
        console.log(err);
        if (err instanceof ZodError) {
            return res.status(400).send({ message: err.errors });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
    return;
}

export async function getAll(req: Request, res: Response) {
    try {
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const usersColl = MongoDBService.db.collection<User>('users');
        const users = await usersColl.find().toArray();
        const usersWithoutPassword = users.map(user => {
            const { password, ...rest } = user;
            return rest;
        });
        return res.status(200).send({ users: usersWithoutPassword });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const { params } = await getAndDeleteSchema.parseAsync(req);
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const usersColl = MongoDBService.db.collection<User>('users');
        const user = await usersColl.findOne({ _id: new ObjectId(params.id) });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const { password, ...rest } = user;
        return res.status(200).send({ user: rest });
    } catch (err) {
        console.log(err);
        if (err instanceof ZodError) {
            return res.status(400).send({ message: err.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }

}

export async function login(req: Request, res: Response) {
    try {
        const { body } = await loginSchema.parseAsync(req);
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const usersColl = MongoDBService.db.collection<User>('users');
        const user = await usersColl.findOne({ email: body.email });
        if (!user) {
            return res.status(401).send({ message: "Invalid credentials" });
        }
        const match = await bcrypt.compare(body.password, user.password);
        if (!match) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        return res.status(200).send({ message: "Login successful" });
    } catch (error) {
        console.log(error);
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
        const { body, params } = await updateUserSchema.parseAsync(req);

        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const usersColl = MongoDBService.db.collection<User>('users');
        const set: Record<string, Record<string, string | Date>> = {
            $set: {
                updatedAt: new Date()
            }
        }

        if (body.name) {
            set.$set.name = body.name;
        }

        if (body.password) {
            set.$set.password = await bcrypt.hash(body.password, 10);
        }

        const result = await usersColl.updateOne({ _id: new ObjectId(params.id) }, {
            $set: set.$set
        })

        if (!result.matchedCount) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send({ message: "User updated" });
    } catch (error) {
        console.log(error);
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function inactivate(req: Request, res: Response) {
    try {
        const { params } = await getAndDeleteSchema.parseAsync(req);
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const usersColl = MongoDBService.db.collection<User>('users');
        await usersColl.updateOne({ _id: new ObjectId(params.id) }, {
            $set: {
                active: false,
                updatedAt: new Date()
            }
        })
        return res.status(200).send({ message: "User inactivated" });
    } catch (error) {
        console.log(error);
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
        while (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const { params } = await getAndDeleteSchema.parseAsync(req);
        const usersColl = MongoDBService.db.collection<User>('users');
        const result = await usersColl.deleteOne({ _id: new ObjectId(params.id) });
        if (!result.deletedCount) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send({ message: "User removed" });
    } catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal server error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function activate(req: Request, res: Response) {
    try {
        const { params } = getAndDeleteSchema.parse(req);
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const usersColl = MongoDBService.db.collection<User>('users');
        await usersColl.updateOne({ _id: new ObjectId(params.id) }, {
            $set: {
                active: true,
                updatedAt: new Date()
            }
        })
        return res.status(200).send({ message: "User activated" });
    } catch (error) {
        console.log(error);
        if (error instanceof ZodError) {
            return res.status(400).send({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}