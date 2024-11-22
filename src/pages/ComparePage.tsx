import toast from "react-hot-toast"
import { useState } from "react"
import { SupplierSearch } from "../components/SupplierSearch"
import { PriceBySupplier, Supplier, SupplierWithPurchases } from "../schemas/supplier.schema"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { ApiResponse } from "../utils/types"
import { useFilters } from "../contexts/FiltersContext"
import { LoaderCircle } from "lucide-react"
import { format } from "date-fns"
import { api } from "../lib/axios"

export const ComparePage = () => {

    const { domain } = useFilters()
    const [suppliers, setSuppliers] = useState<[SupplierWithPurchases | undefined, SupplierWithPurchases | undefined]>([undefined, undefined])
    const [comparative, setComparative] = useState<string[][]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const setProveedor = (letter: "A" | "B", supplier: Supplier) => {
        if (letter === "A") {
            setSuppliers([{ ...supplier, purchases: [] }, suppliers[1]])
        } else {
            setSuppliers([suppliers[0], { ...supplier, purchases: [] }])
        }
    }

    const generateComparative = async () => {

        setLoading(true)

        try {

            if (!suppliers[0] || !suppliers[1]) throw new Error("Debes seleccionar ambos suppliers");

            const { data: purchasesAS } = await api.get<ApiResponse<PriceBySupplier[]>>(`/suppliers/prices?domain=${domain}&ruc=${suppliers[0].ruc}`)

            if (purchasesAS.error && !purchasesAS.data) {
                return toast.error(purchasesAS.error)
            }

            const { data: purchasesBS } = await api.get<ApiResponse<PriceBySupplier[]>>(`/suppliers/prices?domain=${domain}&ruc=${suppliers[1].ruc}`)

            if (purchasesBS.error && !purchasesBS.data) {
                return toast.error(purchasesBS.error)
            }

            const suppliesListAS: string[] = purchasesAS.data?.map(purchase => purchase.supply)!
            const suppliesListBS: string[] = purchasesBS.data?.map(purchase => purchase.supply)!

            let suppliesList: string[] = []

            suppliesListAS.forEach(supply => {
                if (!suppliesList.includes(supply)) {
                    suppliesList.push(supply)
                }
            });

            suppliesListBS.forEach(supply => {
                if (!suppliesList.includes(supply)) {
                    suppliesList.push(supply)
                }
            });

            suppliesList = suppliesList.sort((a, b) => a.localeCompare(b))

            setComparative(suppliesList.map(supply => {

                const supplyAS = purchasesAS.data?.find(purchase => purchase.supply === supply)
                const supplyBS = purchasesBS.data?.find(purchase => purchase.supply === supply)

                return [
                    supply,
                    supplyAS?.um!,
                    supplyAS?.date && format(new Date(supplyAS?.date.toString().slice(0, 10)), "dd/MM/yyyy") || "-",
                    supplyAS?.price && `S/ ${supplyAS?.price.toFixed(2)}` || "-",
                    supplyBS?.date && format(new Date(supplyBS?.date.toString().slice(0, 10)), "dd/MM/yyyy") || "-",
                    supplyBS && `S/ ${supplyBS?.price.toFixed(2)}` || "-"]
            }))


        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Comparador de proveedores</h3>
        </div>
        <div className="border rounded-md shadow-md p-4 text-sm flex flex-col gap-4">
            <p className="font-semibold mb-2">Selección de proveedores:</p>
            <SupplierSearch title="Proveedor A" onSelect={(supplier) => setProveedor("A", supplier)} />
            <SupplierSearch title="Proveedor B" onSelect={(supplier) => setProveedor("B", supplier)} />
            <button onClick={generateComparative} disabled={!suppliers[0] || !suppliers[1]} className="bg-gray-900 text-white px-5 py-2 rounded-md hover:bg-gray-800 flex w-fit mt-4 disabled:cursor-not-allowed">{loading ? <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin stroke-white" />Generando</p> : "Generar comparativo"}</button>
        </div>
        {comparative.length > 0 && <div className="mt-6">
            <h5 className="font-semibold mb-4">Comparativo:</h5>
            <div className="border rounded-md p-4">
                <table className="text-sm w-full">
                    <thead>
                        <tr className="h-10">
                            <th rowSpan={2} className="text-start pl-4" >Insumos</th>
                            <th rowSpan={2} className="text-start" >U.M.</th>
                            <th className="text-start truncate max-w-80 pr-10" colSpan={2} >{suppliers[0]?.supplier}</th>
                            <th className="text-start truncate max-w-80 pr-10" colSpan={2} >{suppliers[1]?.supplier}</th>
                        </tr>
                        <tr className="h-10">
                            <th className="text-start">Última compra</th>
                            <th className="text-start">Precio</th>
                            <th className="text-start">Última compra</th>
                            <th className="text-start">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparative.map(supply => <TableRow>
                            <TableData space width="lg">{supply[0].split(" - ")[0]}</TableData>
                            <TableData>{supply[1]}</TableData>
                            <TableData>{supply[2]}</TableData>
                            <TableData>{supply[3]}</TableData>
                            <TableData>{supply[4]}</TableData>
                            <TableData>{supply[5]}</TableData>
                        </TableRow>)}
                    </tbody>
                </table>
            </div>
        </div>}
    </section>
}