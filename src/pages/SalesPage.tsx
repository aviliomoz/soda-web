import toast from "react-hot-toast"
import { DatabaseBackup, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ApiResponse } from "../utils/types"
import { Table } from "../components/ui/Table"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { format } from 'date-fns'
import { useFilters } from "../contexts/FiltersContext"
import { RangeDatePicker } from "../components/RangeDatePicker"
import { api } from "../lib/axios"
import { RESTAURANTS } from "../utils/restaurants"
import { SaleByDocument } from "../schemas/sale.schema"

export const SalesPage = () => {

    const { domain, initialDate, finalDate } = useFilters()
    const [sales, setSales] = useState<SaleByDocument[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getSales = async () => {
        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<SaleByDocument[]>>(`/sales?domain=${domain}&initialDate=${format(initialDate, "yyyy-MM-dd")}&finalDate=${format(finalDate, "yyyy-MM-dd")}`)

            if (data.ok && data.data) {
                setSales(data.data)
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
        getSales()
    }, [domain, initialDate, finalDate])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Ventas</h3>
            <div className="flex items-center gap-6">
                <RangeDatePicker />
                <Link to="/ventas/actualizar" className="bg-gray-900 px-3 py-1.5 rounded-md text-sm text-white hover:bg-gray-800 flex items-center gap-2"><DatabaseBackup className="size-4 stroke-white" />Actualizar ventas</Link>
            </div>
        </div>
        {loading ? <p className="text-gray-500 text-sm flex items-center gap-2"> <LoaderCircle className="size-4 animate-spin" />Cargando ventas</p> :
            <Table titles={["Fecha", "Local", "Tipo documento", "N° documento", "Cliente", "Venta bruta", "Impuestos", "Venta neta"]}>
                {sales.map(sale => <TableRow key={sale.document_number}>
                    <TableData space>{format(sale.date, "dd/MM/yyyy")}</TableData>
                    <TableData>{RESTAURANTS[sale.domain].name}</TableData>
                    <TableData width="md">{sale.document_type}</TableData>
                    <TableData width="md">{sale.document_number}</TableData>
                    <TableData width="xl">{sale.customer}</TableData>
                    <TableData>{`S/ ${sale.gross_sale.toFixed(2)}`}</TableData>
                    <TableData>{`S/ ${sale.taxes.toFixed(2)}`}</TableData>
                    <TableData>{`S/ ${sale.net_sale.toFixed(2)}`}</TableData>
                </TableRow>)}
            </Table>
        }
    </section>
}