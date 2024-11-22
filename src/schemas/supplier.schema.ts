import { z } from "zod";

export const SupplierSchema = z.object({
    ruc: z.string(),
    supplier: z.string(),
})

export type Supplier = z.infer<typeof SupplierSchema>

export type SupplierWithPurchases = Supplier & {
    purchases?: SupplierPurchase[]
}

export type PriceBySupplier = {
    supply: string,
    date: Date,
    price: number,
    amount: number,
    um: string
}

export type SupplierPurchase = {
    date: Date,
    total: number,
    amount: number,
    price: number,
    um: string
}