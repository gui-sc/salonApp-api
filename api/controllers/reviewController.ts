import { Request, Response } from "express";
import MongoDBService from "../services/MongoDBService";
import { ZodError } from "zod";
import { reviewSchema } from "../schemas/reviewSchema";
import { Review } from "../types/review";
import { ObjectId } from "mongodb";

export async function create(req: Request, res: Response) {
    try {
        while (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const { body } = await reviewSchema.parseAsync(req.body);
        const reviewColl = MongoDBService.db.collection<Review>("reviews");
        await reviewColl.insertOne({
            comment: body.comment,
            professionalId: new ObjectId(body.professionalId),
            rating: body.rating,
            scheduleId: new ObjectId(body.scheduleId),
            userId: new ObjectId(body.userId),
            createdAt: new Date(),
            updatedAt: new Date()
        })
        return res.status(201).send({ message: "Avaliação cadastrada com sucesso" });
    } catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            return res.status(400).send({ errors: error.errors.map(err => err.message) });
        }
        return res.status(500).send({ message: "Internal server error" });
    } finally {
        await MongoDBService.close();
    }
}
