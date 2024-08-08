import { z } from "zod";

export const reviewSchema = z.object({
    body: z.object({
        userId: z.string({ message: "ID do Cliente é obrigatório" })
            .min(1, { message: "ID do Cliente é obrigatório" }),
        professionalId: z.string({ message: "ID do Profissional é obrigatório" })
            .min(1, { message: "ID do Profissional é obrigatório" }),
        serviceId: z.string({ message: "ID do Serviço é obrigatório" })
            .min(1, { message: "ID do Serviço é obrigatório" }),
        scheduleId: z.string({ message: "ID do Agendamento é obrigatório" })
            .min(1, { message: "ID do Agendamento é obrigatório" }),
        rating: z.number({ message: "Avaliação é obrigatória" })
            .min(1, { message: "Avaliação deve ser de 1 a 5" })
            .max(5, { message: "Avaliação deve ser de 1 a 5" }),
        comment: z.string().max(100, { message: "A observação deve ter até 100 caracteres" }).optional(),
    }),
});