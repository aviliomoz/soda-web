import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { Widget } from "../ui/Widget"
import { useFilters } from "../../contexts/FiltersContext"
import { ApiResponse } from "../../utils/types"
import { format } from "date-fns"
import { PurchaseByWeek } from "../../schemas/purchase.schema"
import { api } from "../../lib/axios"
import { formatNumber } from "../../utils/formats"

export const TotalPurchasesWidget = () => {

    const { domain, initialDate, finalDate } = useFilters()
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)

    const getTotal = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<PurchaseByWeek[]>>(`/purchases/by-week?domain=${domain}&initialDate=${format(initialDate, "yyyy-MM-dd")}&finalDate=${format(finalDate, "yyyy-MM-dd")}`)

            if (data.ok) {
                if (data.data) {
                    const total = data.data.reduce((acc, current) => acc + Number(current.total), 0)
                    setTotal(total)
                }
            }
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        getTotal()
    }, [domain, initialDate, finalDate])

    return <Widget title="Total de compras" loading={loading}>
        <p className="text-xl font-bold">{`S/ ${formatNumber(total)}`}</p>
    </Widget>
}