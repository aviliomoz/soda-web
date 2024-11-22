import toast from "react-hot-toast"
import ExcelJS from 'exceljs'
import { useEffect, useState } from "react"
import { Supply } from "../schemas/supply.schema"
import { useFilters } from "../contexts/FiltersContext"
import { Table } from "../components/ui/Table"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { Download, Trash, X } from "lucide-react"
import { ApiResponse } from "../utils/types"
import { api } from "../lib/axios"
import { formatNumber } from "../utils/formats"

type PriceList = {
    supply: Supply,
    amount: number,
    price: number,
}[]

export const PriceListPage = () => {
    const { domain } = useFilters()
    const [priceList, setPriceList] = useState<PriceList>([])

    const [search, setSearch] = useState<string>("")

    const [supply, setSupply] = useState<Supply>()
    const [result, setResult] = useState<Supply[]>([])

    const handleSelect = async (supply: Supply) => {

        if (priceList.some(line => line.supply.supply === supply.supply)) {
            return toast.error("El supply ya se encuentra en la lista")
        }

        setSearch("")
        setSupply(undefined)
        setResult([])

        const { data } = await api.get<ApiResponse<number>>(`/supplies/last-price?supply=${supply.supply}&domain=${domain}`)

        if (data.ok && data.data) {
            setPriceList([...priceList, { supply, amount: 1, price: Number(data.data) }])
        } else if (data.error) {
            toast.error(data.error)
        }

    }

    const deleteFromPriceList = (supply: Supply) => {
        setPriceList(priceList.filter(line => line.supply.supply !== supply.supply))
    }

    const updateAmount = (supply: Supply, amount: number) => {
        setPriceList(priceList.map(line => line.supply.supply === supply.supply ? { ...line, amount } : line))
    }

    const updatePrice = (supply: Supply, price: number) => {
        setPriceList(priceList.map(line => line.supply.supply === supply.supply ? { ...line, price } : line))
    }

    const downloadExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cotización');

        // Establecemos las columnas del Excel
        worksheet.columns = [
            { header: 'Insumo', key: 'supply', width: 70 },
            { header: 'Cantidad', key: 'amount', width: 15 },
            { header: 'Último Precio', key: 'price', width: 15 },
            { header: 'Total', key: 'total', width: 15 },
        ];

        // Agregamos las filas a la hoja de cálculo
        priceList.forEach(line => {
            worksheet.addRow({
                supply: line.supply.supply,
                amount: line.amount,
                price: line.price,
                total: (line.amount * line.price),
            });
        });

        // Añadir un total general al final
        worksheet.addRow({
            supply: "Total",
            total: priceList.reduce((acc, curr) => acc + (curr.amount * curr.price), 0)
        });

        // Estilos opcionales

        const titlesRow = worksheet.getRow(1)
        titlesRow.font = { bold: true }

        const totalRow = worksheet.lastRow;
        totalRow!.font = { bold: true };

        // Generamos el archivo Excel y descargamos
        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Crear un enlace y hacer que el navegador descargue el archivo
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Cotizacion_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {

        if (search === "") {
            setResult([])
            return
        }

        const buscarInsumo = setTimeout(async () => {
            const { data } = await api.get<ApiResponse<Supply[]>>(`/supplies?search=${search}&domain=${domain}`)

            if (data.ok && data.data) {
                setResult(data.data)
            }

        }, 300)

        return () => {
            clearTimeout(buscarInsumo)
        }
    }, [search])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Generador de cotización</h3>
        </div>

        <div className="border rounded-md shadow-md p-4 text-sm flex flex-col gap-4 mb-4">
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
        </div>

        <Table titles={["Insumo", "Cantidad", "Último precio", "Total", "Opciones"]}>
            {priceList.map(line => <TableRow key={line.supply.supply}>
                <TableData space width="lg">{line.supply.supply}</TableData>
                <TableData><input className="outline-none w-16 bg-transparent" type="number" min={0} value={line.amount} onChange={(e) => updateAmount(line.supply, Number(e.target.value))} /></TableData>
                <TableData>S/ <input className="outline-none w-16 bg-transparent" type="number" min={0} value={line.price} onChange={(e) => updatePrice(line.supply, Number(e.target.value))} /></TableData>
                <TableData>{`S/ ${formatNumber(line.amount * line.price)}`}</TableData>
                <TableData><Trash onClick={() => deleteFromPriceList(line.supply)} className="size-4 cursor-pointer" /></TableData>
            </TableRow>)}
        </Table>

        {priceList.length > 0 && <div className="border rounded-md shadow-md mt-4 ml-auto flex items-center gap-8 px-4 py-2.5 text-sm w-fit">
            <p><span className="font-semibold mr-2">Total:</span>S/ {formatNumber(priceList.reduce((acc, curr) => acc + (curr.amount * curr.price), 0))}</p>
            <button onClick={downloadExcel} className="flex items-center gap-2 bg-emerald-900 text-white px-3 py-1.5 shadow-md rounded-md hover:bg-emerald-800"><Download className="size-4" />Descargar en excel</button>
        </div>}
    </section>
}