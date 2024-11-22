import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, LoaderCircle, X } from "lucide-react"
import { ApiResponse } from "../utils/types"
import { useFilters } from "../contexts/FiltersContext"
import { Table } from "../components/ui/Table"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { format } from "date-fns"
import { api } from "../lib/axios"
import { PurchaseHistoryBySupply } from "../schemas/purchase.schema"
import { Supply } from "../schemas/supply.schema"
import { formatNumber } from "../utils/formats"

export const HistoryPage = () => {

    const { domain } = useFilters()
    const [search, setSearch] = useState<string>("")
    const [supply, setSupply] = useState<Supply>()
    const [result, setResult] = useState<Supply[]>([])
    const [history, setHistory] = useState<PurchaseHistoryBySupply[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const calcVariation = (prevPrice: number, nextPrice: number) => {

        const formatedPrevPrice = Number(prevPrice)
        const formatedNextPrice = Number(nextPrice)

        if (formatedNextPrice === formatedPrevPrice) {
            return <p>-</p>
        } else if (formatedNextPrice > formatedPrevPrice) {
            return <p className="text-red-600 flex items-center gap-2"><ChevronUp className="size-4 stroke-red-600" />{`S/ ${(formatedNextPrice - formatedPrevPrice).toFixed(2)}`}</p>
        } else {
            return <p className="text-green-600 flex items-center gap-2"><ChevronDown className="size-4 stroke-green-600" />{`S/ ${(formatedPrevPrice - formatedNextPrice).toFixed(2)}`}</p>
        }

    }

    const generateHistory = async () => {
        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<PurchaseHistoryBySupply[]>>(`/purchases/history-by-supply?supply=${supply?.supply}&domain=${domain}`)

            if (data.ok && data.data) {
                setHistory(data.data)
            } else if (data.error) {
                toast.error(data.error)
            }

        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const handleSelect = (supply: Supply) => {
        setSupply(supply)
        setResult([])
        setSearch("")
    }

    useEffect(() => {

        if (search === "") {
            setResult([])
            return
        }

        const searchSupply = setTimeout(async () => {
            const { data } = await api.get<ApiResponse<Supply[]>>(`/supplies?search=${search}&domain=${domain}`)

            if (data.ok && data.data) {
                setResult(data.data)
            }

        }, 300)

        return () => {
            clearTimeout(searchSupply)
        }
    }, [search])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Histórico de purchases por insumo</h3>
        </div>
        <div className="border rounded-md shadow-md p-4 text-sm flex flex-col gap-4">
            <p className="font-semibold mb-2">Seleccina un insumo:</p>
            <label className="flex items-center gap-3 relative">
                <p className="font-medium min-w-fit">Insumo:</p>

                {supply
                    ? <div className="flex items-center gap-4 text-sm"><p>{supply.supply}</p><X className="size-5 cursor-pointer bg-gray-300 stroke-[3] stroke-gray-700 rounded-full p-1" onClick={(() => setSupply(undefined))} /></div>
                    : <input className="outline-none border border-gray-300 rounded-md px-4 py-2 shadow-sm w-full" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                }

                {result.length > 0 && <ul className="absolute top-full mt-2 left-24 z-20 bg-white border rounded-md p-2 flex flex-col gap-1">
                    {result.map(supply => <li onClick={() => handleSelect(supply)} className="hover:bg-gray-200 px-2 py-1 rounded-md cursor-pointer hover:font-medium" key={supply.supply}>
                        {supply.supply}
                    </li>)}
                </ul>}
            </label>
            <button onClick={generateHistory} disabled={!supply} className="bg-gray-900 text-white px-5 py-2 rounded-md hover:bg-gray-800 flex w-fit mt-4 disabled:cursor-not-allowed">{loading ? <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin stroke-white" />Generando</p> : "Generar histórico"}</button>
        </div>
        {history.length > 0 && <div className="mt-6">
            <h5 className="font-semibold mb-4">Histórico:</h5>
            <Table titles={["Fecha", "Proveedor", "Cantidad", "Precio", "Total", "Variación"]}>
                {history.map((purchase, index) => <TableRow>
                    <TableData space>{format(purchase.date, "dd/MM/yyyy")}</TableData>
                    <TableData width="lg">{purchase.supplier}</TableData>
                    <TableData>{purchase.amount}</TableData>
                    <TableData>{`S/ ${formatNumber(purchase.price)}`}</TableData>
                    <TableData>{`S/ ${formatNumber(purchase.total)}`}</TableData>
                    <TableData>{index === history.length - 1 ? "-" : calcVariation(history[index + 1].price, purchase.price)}</TableData>
                </TableRow>)}
            </Table>
        </div>}
    </section>
}