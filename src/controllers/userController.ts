import { Request, Response } from "express";
import MongoDBService from "../services/MongoDBService";
import { User } from "../types/user";
import bcrypt from 'bcrypt';

export async function create(req: Request, res: Response) {
    try {
        const { body } = req;
        if (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const usersColl = MongoDBService.db.collection<User>('users');
        const password = await bcrypt.hash(body.password, 10);
        await usersColl.insertOne({
            email: body.email,
            name: body.name,
            password,
            createdAt: new Date(),
            updatedAt: new Date()
        }).finally(async () => {
            await MongoDBService.close();
            res.status(201).send({ message: "User created" });
        });
    } catch (err) {
        console.log(err);
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
        const usersColl = MongoDBService.db.collection<User>('users');
        const users = await usersColl.find().toArray();
        return res.status(200).send({users});
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { body } = req;
        if(!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const usersColl = MongoDBService.db.collection<User>('users');
        const user = await usersColl.findOne({ email : body.email });
        if(!user) {
            return res.status(404).send({ message: "Invalid credentials" });
        }
        const match = await bcrypt.compare(body.password, user.password);
        if(!match) {
            return res.status(401).send({ message: "Invalid credentials" });
        }
        return res.status(200).send({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }finally{
        await MongoDBService.close();
    }
}