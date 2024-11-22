import toast from "react-hot-toast"
import { Widget } from "../ui/Widget"
import { useEffect, useState } from "react"
import { PurchaseBySupply } from "../../schemas/purchase.schema"
import { useFilters } from "../../contexts/FiltersContext"
import { format } from "date-fns"
import { ApiResponse } from "../../utils/types"
import { Table } from "../ui/Table"
import { TableRow } from "../ui/TableRow"
import { TableData } from "../ui/TableData"
import { api } from "../../lib/axios"
import { formatNumber } from "../../utils/formats"

export const PurchasesBySupplyWidget = () => {

    const { domain, initialDate, finalDate } = useFilters()
    const [purchases, setPurchases] = useState<PurchaseBySupply[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getPurchases = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<PurchaseBySupply[]>>(`/purchases/by-supply?domain=${domain}&initialDate=${format(initialDate, "yyyy-MM-dd")}&finalDate=${format(finalDate, "yyyy-MM-dd")}`)
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

    return <Widget title="Compras por insumo" y_scroll loading={loading}>
        <Table titles={["Insumo", "Cantidad", "Precio más alto", "Facturado"]}>
            {purchases.map(purchase => <TableRow key={purchase.supply}>
                <TableData space width="lg">{purchase.supply}</TableData>
                <TableData >{formatNumber(purchase.amount)}</TableData>
                <TableData >{`S/ ${formatNumber(purchase.price)}`}</TableData>
                <TableData >{`S/ ${formatNumber(purchase.total)}`}</TableData>
            </TableRow>)}
        </Table>
    </Widget>
}