import toast from "react-hot-toast"
import { Widget } from "../ui/Widget"
import { useEffect, useState } from "react"
import { PurchaseByCategory } from "../../schemas/purchase.schema"
import { useFilters } from "../../contexts/FiltersContext"
import { format } from "date-fns"
import { ApiResponse } from "../../utils/types"
import { api } from "../../lib/axios"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from "recharts"

export const PurchasesByCategoryWidget = () => {

    const { domain, initialDate, finalDate } = useFilters()
    const [purchases, setPurchases] = useState<PurchaseByCategory[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getPurchases = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<PurchaseByCategory[]>>(`/purchases/by-category?domain=${domain}&initialDate=${format(initialDate, "yyyy-MM-dd")}&finalDate=${format(finalDate, "yyyy-MM-dd")}`)
            if (data.ok && data.data) {

                setPurchases(data.data.map(purchase => ({ ...purchase, total: Number(purchase.total) })))
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

    return <Widget title="Compras por categoria" center loading={loading}>
        {purchases.length > 0 && <RadarChart
            width={500} height={500}
            outerRadius="60%" data={purchases}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" fontSize={10} fontWeight={600} width={100} />
            <PolarRadiusAxis />
            <Tooltip />
            <Radar name="Compras" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>}
    </Widget>
}