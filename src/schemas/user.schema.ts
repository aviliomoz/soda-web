import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().uuid().optional(),
    email: z.string().email(),
    name: z.string(),
    lastname: z.string(),
    status: z.enum(["active", "inactive"]).default("active").optional(),
});

export type User = z.infer<typeof UserSchema>;