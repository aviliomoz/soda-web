import { z } from "zod";

export const SupplySchema = z.object({
    supply: z.string()
})

export type Supply = z.infer<typeof SupplySchema>

export type LastPriceSupply = {
    supply: string,
    um: string,
    category: string,
    date: Date,
    price: number
}