import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const signupSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    lastname: z.string(),
    password: z.string(),
});

export type LoginType = z.infer<typeof loginSchema>;
export type SignupType = z.infer<typeof signupSchema>;