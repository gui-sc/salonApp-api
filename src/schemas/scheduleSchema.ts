import dayjs from "dayjs";
import { z } from "zod";

export const getSchedulesByProfessionalSchema = z.object({
    params: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => dayjs(value)),
        professionalId: z.string({
            required_error: "ID do profissional é obrigatório"
        }).min(1, { message: "ID do profissional é obrigatório" })
    })
})

export const getSchedulesByUserSchema = z.object({
    params: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => dayjs(value)),
        userId: z.string({
            required_error: "ID do profissional é obrigatório"
        }).min(1, { message: "ID do profissional é obrigatório" })
    })
})

export const createScheduleSchema = z.object({
    body: z.object({
        userId: z.string().min(1, { message: "ID do usuário é obrigatório" }),
        professionalId: z.string().min(1, { message: "ID do profissional é obrigatório" }),
        serviceId: z.string().min(1, { message: "ID do serviço é obrigatório" }),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => dayjs(value)),
        hour: z.string().regex(/^\d{2}:\d{2}$/),
        time: z.number().min(1, { message: "Tempo de serviço deve ser maior que 0" }),
        price: z.number().min(0.01, { message: "Preço deve ser maior que 0" })
    })
})