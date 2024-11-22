import { z } from "zod"
import { DOMAINS } from "../utils/constants"
import { Domain } from "../utils/types"

export const SaleSchema = z.object({
    date: z.date(),
    date_by_shift: z.date(),
    order_date: z.date(),
    table_name: z.string(),
    waiter: z.string(),
    register: z.string(),
    shift: z.string(),
    customer: z.string(),
    customer_document: z.string(),
    document_type: z.string(),
    document_number: z.string(),
    discount: z.number(),
    product: z.string(),
    product_id: z.number(),
    production_area: z.string(),
    category: z.string(),
    amount: z.number(),
    price: z.number(),
    taxes: z.number(),
    gross_sale: z.number(),
    net_sale: z.number(),
    product_type: z.string(),
    service_area: z.string(),
    year: z.number(),
    month: z.string(),
    day: z.string(),
    week: z.string(),
    domain: z.enum(DOMAINS)
})

export type Sale = z.infer<typeof SaleSchema>

export type SaleByDocument = {
    date: Date
    document_type: string,
    document_number: string,
    domain: Domain,
    customer: string,
    gross_sale: number,
    taxes: number,
    net_sale: number,
}