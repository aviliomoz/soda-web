import toast from "react-hot-toast"
import { DatabaseBackup, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ApiResponse } from "../utils/types"
import { PurchaseByDocument } from "../schemas/purchase.schema"
import { Table } from "../components/ui/Table"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { format } from 'date-fns'
import { useFilters } from "../contexts/FiltersContext"
import { RangeDatePicker } from "../components/RangeDatePicker"
import { api } from "../lib/axios"
import { RESTAURANTS } from "../utils/restaurants"

export const PurchasesPage = () => {

    const { domain, initialDate, finalDate } = useFilters()
    const [purchases, setPurchases] = useState<PurchaseByDocument[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getPurchases = async () => {
        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<PurchaseByDocument[]>>(`/purchases?domain=${domain}&initialDate=${format(initialDate, "yyyy-MM-dd")}&finalDate=${format(finalDate, "yyyy-MM-dd")}`)

            if (data.ok && data.data) {
                setPurchases(data.data)
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al obtener los empleados")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getPurchases()
    }, [domain, initialDate, finalDate])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Compras</h3>
            <div className="flex items-center gap-6">
                <RangeDatePicker />
                <Link to="/compras/actualizar" className="bg-gray-900 px-3 py-1.5 rounded-md text-sm text-white hover:bg-gray-800 flex items-center gap-2"><DatabaseBackup className="size-4 stroke-white" />Actualizar compras</Link>
            </div>
        </div>
        {loading ? <p className="text-gray-500 text-sm flex items-center gap-2"> <LoaderCircle className="size-4 animate-spin" />Cargando compras</p> :
            <Table titles={["Fecha", "Local", "Documento", "RUC", "Razón social", "Total"]}>
                {purchases.sort((a, b) => {
                    // Primero, ordenamos por fecha
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    if (dateA < dateB) return -1;
                    if (dateA > dateB) return 1;

                    // Si las fechas son iguales, ordenamos por documento
                    return a.document.localeCompare(b.document);
                }).map(purchase => <TableRow key={purchase.document}>
                    <TableData space>{format(purchase.date, "dd/MM/yyyy")}</TableData>
                    <TableData>{RESTAURANTS[purchase.domain].name}</TableData>
                    <TableData width="md">{purchase.document}</TableData>
                    <TableData>{purchase.ruc}</TableData>
                    <TableData width="lg">{purchase.supplier}</TableData>
                    <TableData>{`S/ ${purchase.total.toFixed(2)}`}</TableData>
                </TableRow>)}
            </Table>
        }
    </section>
}