import { z } from "zod";

export const createProfessionalServiceSchema = z.object({
    body: z.object({
        professionalId: z.string({ message: "ID do Profissional é obrigatório" }),
        serviceId: z.string({ message: "ID do Serviço é obrigatório" })
    })
})