import { z } from "zod"

export const loginSchema = z.object({
    body: z.object({
        email: z.string({ message: "Email é necessário" }),
        password: z.string({ message: "A senha é necessária" })
    }),
})

export const getAndDeleteSchema = z.object({
    params: z.object({
        id: z.string({ message: "Id é necessário" })
    })
})