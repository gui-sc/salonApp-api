import { z } from "zod";

export const createServiceSchema = z.object({
    body: z.object({
        name: z.string({ message: "Nome é obrigatório" })
            .min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
            .max(255, { message: "Nome deve ter no máximo 255 caracteres" }),
        description: z.string({ message: "Descrição é obrigatória" })
            .min(3, { message: "Descrição deve ter no mínimo 3 caracteres" })
            .max(255, { message: "Descrição deve ter no máximo 255 caracteres" }),
        time: z.number({ message: "Tempo é obrigatório" }).int({ message: "Tempo deve ser um número inteiro" })
            .min(1, { message: "Tempo deve ser no mínimo 1" }),
        price: z.number({ message: "Preço é obrigatório" })
            .min(1, { message: "Preço deve ser no mínimo 1" }),
    })
})

export const updateServiceSchema = z.intersection(createServiceSchema, z.object({
    params: z.object({
        id: z.string({ message: "ID é obrigatório" })
    })
}))