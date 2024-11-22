import { z } from "zod";
import { Domain } from "../utils/types";
import { DOMAINS } from "../utils/constants";

export const PurchaseSchema = z.object({
    date: z.date(),
    week: z.string(),
    document: z.string(),
    ruc: z.string(),
    supplier: z.string(),
    supply: z.string(),
    category: z.string(),
    um: z.string(),
    amount: z.number(),
    price: z.number(),
    total: z.number(),
    domain: z.enum(DOMAINS)
})

export type Purchase = z.infer<typeof PurchaseSchema>
export const PurchaseListSchema = z.array(PurchaseSchema);

export type PurchaseByDocument = {
    date: Date;
    week: string;
    document: string;
    ruc: string;
    supplier: string;
    total: number;
    domain: Domain;
}

export type PurchaseByWeek = {
    week: string,
    total: number,
}

export type PurchaseBySupply = {
    supply: string,
    amount: number,
    price: number,
    total: number
}

export type PurchaseHistoryBySupply = {
    date: Date,
    supplier: string,
    amount: number,
    price: number,
    total: number
}

export type PruchaseBySupplier = {
    supplier: string,
    total: number
}

export type PurchaseByCategory = {
    category: string,
    total: number
}