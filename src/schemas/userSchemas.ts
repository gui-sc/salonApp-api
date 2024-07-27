import { z } from 'zod'
import { getAndDeleteSchema } from './uniqueSchema'

export const createUserSchema = z.object({
    body: z.object({
        name: z.string({ message: "Nome é necessário" })
            .min(3, { message: "Nome muito curto" })
            .max(255, { message: "Nome muito longo" }),
        email: z.string({ message: "Email é necessário" })
            .email({ message: "Email inválido" }),
        password: z.string({ message: "A senha é necessária" })
            .min(6, { message: "Senha muito curta" })
            .max(12, { message: "Senha muito longa" }),
        birth: z.string({ message: "Data de nascimento é necessária" })
            .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data de nascimento inválida" })
            .transform(value => new Date(value)),
    }),
})

export const updateUserSchema = z.intersection(
    getAndDeleteSchema,    
    z.object({
        body: z.object({
            name: z.string()
                .min(3, { message: "Nome muito curto" })
                .max(255, { message: "Nome muito longo" }).optional(),
            password: z.string()
                .min(6, { message: "Senha muito curta" })
                .max(12, { message: "Senha muito longa" }).optional(),
        })
    })
)