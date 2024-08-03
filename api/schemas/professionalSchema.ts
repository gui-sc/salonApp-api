import { z } from "zod";
import { getAndDeleteSchema } from "./uniqueSchema";

export const createProfessionalSchema = z.object({
    body: z.object({
        name: z.string({ message: "Nome é necessário" })
            .min(3, { message: "Nome muito curto" })
            .max(255, { message: "Nome muito longo" }),
        email: z.string({ message: "Email é necessário" })
            .email({ message: "Email inválido" }),
        password: z.string({ message: "A senha é necessária" })
            .min(6, { message: "Senha muito curta" })
            .max(12, { message: "Senha muito longa" }),
        picture: z.string().optional(),
    })
})

export const updateProfessionalSchema = z.intersection(
    getAndDeleteSchema, 
    z.object({
    body: z.object({
        name: z.string()
            .min(3, { message: "Nome muito curto" })
            .max(255, { message: "Nome muito longo" }).optional(),
        password: z.string()
            .min(6, { message: "Senha muito curta" })
            .max(12, { message: "Senha muito longa" }).optional(),
        picture: z.string().optional(),
    })
}))