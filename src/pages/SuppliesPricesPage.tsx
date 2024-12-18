import { useEffect, useState } from "react"
import { SearchBar } from "../components/SearchBar"
import { LastPriceSupply } from "../schemas/supply.schema"
import { Table } from "../components/ui/Table"
import { TableData } from "../components/ui/TableData"
import { TableRow } from "../components/ui/TableRow"
import { format } from "date-fns"
import { formatNumber } from "../utils/formats"
import { useSearch } from "../hooks/useSearch"
import { api } from "../lib/axios"
import { useFilters } from "../contexts/FiltersContext"
import { ApiResponse } from "../utils/types"
import toast from "react-hot-toast"
import { LoaderCircle } from "lucide-react"

export const SupplyPricesPage = () => {

    const { search } = useSearch()
    const { domain } = useFilters()
    const [supplies, setSupplies] = useState<LastPriceSupply[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getSupplies = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<LastPriceSupply[]>>(`/supplies/last-prices?domain=${domain}&search=${search}`)

            if (data.ok && data.data) {
                setSupplies(data.data)
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al obtener los insumos")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSupplies()
    }, [search, domain])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Listado de insumos</h3>
            <SearchBar />
        </div>

        {loading ? <p className="text-gray-500 text-sm flex items-center gap-2"> <LoaderCircle className="size-4 animate-spin" />Cargando insumos</p> : <div className="mt-6">
            <Table titles={["Insumo", "U.M.", "Categoria", "Última compra", "Precio"]}>
                {supplies.map((supply) => <TableRow>
                    <TableData space width="lg">{supply.supply.split(" - ")[0]}</TableData>
                    <TableData >{supply.um}</TableData>
                    <TableData >{supply.category}</TableData>
                    <TableData >{format(supply.date, "dd/MM/yyyy")}</TableData>
                    <TableData>{`S/ ${formatNumber(supply.price)}`}</TableData>
                </TableRow>)}
            </Table>
        </div>}
    </section>
}