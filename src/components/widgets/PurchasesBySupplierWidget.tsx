import toast from "react-hot-toast"
import { Widget } from "../ui/Widget"
import { useEffect, useState } from "react"
import { PruchaseBySupplier } from "../../schemas/purchase.schema"
import { useFilters } from "../../contexts/FiltersContext"
import { format } from "date-fns"
import { ApiResponse } from "../../utils/types"
import { Table } from "../ui/Table"
import { TableRow } from "../ui/TableRow"
import { TableData } from "../ui/TableData"
import { api } from "../../lib/axios"

export const PurchasesBySupplierWidget = () => {

    const { domain, initialDate, finalDate } = useFilters()
    const [purchases, setPurchases] = useState<PruchaseBySupplier[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getPurchases = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<PruchaseBySupplier[]>>(`/purchases/by-supplier?domain=${domain}&initialDate=${format(initialDate, "yyyy-MM-dd")}&finalDate=${format(finalDate, "yyyy-MM-dd")}`)
            if (data.ok && data.data) {
                setPurchases(data.data.sort((a, b) => b.total - a.total))
            }
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getPurchases()
    }, [domain, initialDate, finalDate])

    return <Widget title="Compras por proveedor" y_scroll loading={loading}>
        <Table titles={["Proveedor", "Facturado"]}>
            {purchases.map(purchase => <TableRow key={purchase.supplier}>
                <TableData space width="xl">{purchase.supplier}</TableData>
                <TableData >{`S/ ${Number(purchase.total).toFixed(2)}`}</TableData>
            </TableRow>)}
        </Table>
    </Widget>
}