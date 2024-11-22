import toast from "react-hot-toast"
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { Widget } from "../ui/Widget"
import { useEffect, useState } from "react"
import { PurchaseByWeek } from "../../schemas/purchase.schema"
import { useFilters } from "../../contexts/FiltersContext"
import { format } from "date-fns"
import { ApiResponse } from "../../utils/types"
import { api } from "../../lib/axios"

export const PurchasesByWeekWidget = () => {

    const { domain, initialDate, finalDate } = useFilters()
    const [purchases, setPurchases] = useState<PurchaseByWeek[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getPurchases = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<PurchaseByWeek[]>>(`/purchases/by-week?domain=${domain}&initialDate=${format(initialDate, "yyyy-MM-dd")}&finalDate=${format(finalDate, "yyyy-MM-dd")}`)

            if (data.ok && data.data) {
                setPurchases(data.data.sort((a, b) => Number(a.week.split("-")[0].slice(1)) - Number(b.week.split("-")[0].slice(1))))
            }
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const obtenerLimite = () => {

        if (purchases.length < 1) return 0

        const limite = [...purchases].sort((a, b) => b.total - a.total)[0].total;
        return Math.ceil(limite / 1000) * 1000;
    };

    useEffect(() => {
        getPurchases()
    }, [domain, initialDate, finalDate])

    return <Widget title="Compras por semana" loading={loading} x_scroll>
        <LineChart
            width={500 + (purchases.length * 70)}
            height={200}
            data={purchases}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis fontSize={11} fontWeight={"bold"} dataKey="week" />
            <YAxis domain={[0, obtenerLimite()]} />
            <Tooltip labelFormatter={(label) => `Semana ${label}`} />
            {/* <Legend /> */}
            <Line type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
        </LineChart>
    </Widget>
}