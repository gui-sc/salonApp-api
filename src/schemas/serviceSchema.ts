import { z } from "zod";

export const createServiceSchema = z.object({
    body: z.object({
        name: z.string({ message: "Nome é obrigatório" })
            .min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
            .max(255, { message: "Nome deve ter no máximo 255 caracteres" }),
        description: z.string({ message: "Descrição é obrigatória" })
            .min(3, { message: "Descrição deve ter no mínimo 3 caracteres" })
            .max(255, { message: "Descrição deve ter no máximo 255 caracteres" }),
        
    })
})