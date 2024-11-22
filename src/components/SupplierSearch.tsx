import { useEffect, useState } from "react"
import { Supplier } from "../schemas/supplier.schema"
import { ApiResponse } from "../utils/types"
import { useFilters } from "../contexts/FiltersContext"
import { X } from "lucide-react"
import { api } from "../lib/axios"

type Props = {
    title: string,
    onSelect: (supplier: Supplier) => void
}

export const SupplierSearch = ({ title, onSelect }: Props) => {

    const { domain } = useFilters()
    const [name, setnName] = useState<string>("")
    const [supplier, setSupplier] = useState<Supplier>()
    const [result, setResult] = useState<Supplier[]>([])

    useEffect(() => {

        if (name === "") {
            setResult([])
            return
        }

        const buscarProveedor = setTimeout(async () => {
            const { data } = await api.get<ApiResponse<Supplier[]>>(`/suppliers?search=${name}&domain=${domain}`)

            if (data.ok && data.data) {
                setResult(data.data)
            }

        }, 300)

        return () => {
            clearTimeout(buscarProveedor)
        }
    }, [name])


    const handleSelect = (supplier: Supplier) => {
        setSupplier(supplier)
        setnName("")
        setResult([])
        onSelect(supplier)
    }

    return <label className="flex items-center gap-3 relative">
        <p className="font-medium min-w-fit">{title}:</p>

        {supplier
            ? <div className="flex items-center gap-4 text-sm"><p>{supplier.supplier}</p><X className="size-5 cursor-pointer bg-gray-300 stroke-[3] stroke-gray-700 rounded-full p-1" onClick={(() => setSupplier(undefined))} /></div>
            : <input className="outline-none border border-gray-300 rounded-md px-4 py-2 shadow-sm w-full" type="text" value={name} onChange={(e) => setnName(e.target.value)} />
        }

        {result.length > 0 && <ul className="absolute top-full mt-2 left-24 z-20 bg-white border rounded-md p-2 flex flex-col gap-1">
            {result.map(supplier => <li onClick={() => handleSelect(supplier)} className="hover:bg-gray-200 px-2 py-1 rounded-md cursor-pointer hover:font-medium" key={supplier.ruc}>
                {`${supplier.ruc} - ${supplier.supplier}`}
            </li>)}
        </ul>}
    </label>
}