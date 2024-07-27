import { Request, Response } from "express";
import MongoDBService from "../services/MongoDBService";

export async function create(req: Request, res: Response){
    try {
        
    } catch (error) {
        
    } finally{
        await MongoDBService.close();
    }
}