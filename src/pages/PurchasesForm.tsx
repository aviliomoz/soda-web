import toast from "react-hot-toast"
import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { add, format, getMonth, getYear, lastDayOfMonth, parseISO } from 'date-fns'
import { ApiResponse } from "../utils/types"
import { CheckCircle, LoaderCircle } from "lucide-react"
import { Purchase } from "../schemas/purchase.schema"
import { useFilters } from "../contexts/FiltersContext"
import { api } from "../lib/axios"
import { es } from 'date-fns/locale/es'

type Accion = {
    description: string,
    done: boolean,
    updating: boolean
}

export const PurchasesForm = () => {

    const navigate = useNavigate()

    const { domain, initialDate, setInitialDate, finalDate, setFinalDate } = useFilters()

    const [actions, setActions] = useState<Accion[]>([])
    const [updating, setUpdating] = useState<boolean>(false)

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault()

        setActions([])
        setUpdating(true)

        try {

            let initialDownloadDate = initialDate;

            let actions: Accion[] = []

            while (initialDownloadDate < finalDate) {

                const finalDownloadDate = `${getMonth(initialDownloadDate)}-${getYear(initialDownloadDate)}` === `${getMonth(finalDate)}-${getYear(finalDate)}` ? finalDate : lastDayOfMonth(initialDownloadDate)

                const accion = { description: `Actualizando compras de ${format(initialDownloadDate, "MMMM", { locale: es })} ${getYear(initialDownloadDate)}`, updating: true, done: false }
                actions.push(accion)
                setActions(actions)

                const { data } = await api.put<ApiResponse<Purchase[]>>(`/purchases?domain=${domain}&initialDate=${format(initialDownloadDate, "yyyy-MM-dd")}&finalDate=${format(finalDownloadDate, "yyyy-MM-dd")}`)

                if (data.ok) {
                    toast.success(data.message)
                } else if (data.error) {
                    setActions([])
                    throw new Error(data.error);
                }

                actions = actions.map(acc => acc.description === accion.description ? { ...accion, updating: false, done: true } : acc)
                setActions(actions)

                initialDownloadDate = add(lastDayOfMonth(initialDownloadDate), { days: 1 })
            }

            const accion = { description: `Listo`, updating: false, done: true }
            actions.push(accion)
            setActions(actions)

            toast.success("Actualización completa")

        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setUpdating(false)
        }
    }

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Actualizar compras</h3>
            <button onClick={() => navigate(-1)}>Cancelar</button>
        </div>
        <div className="flex gap-4 w-full">
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 border rounded-md p-8 shadow-md bg-gray-100 w-fit h-fit">
                <label className="flex flex-col gap-2">
                    <p className="font-medium text-sm">Fecha inicial:</p>
                    <input className={"border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none"} max={format(finalDate, "yyyy-MM-dd")} onKeyDown={(e) => e.preventDefault()} type="date" value={format(initialDate, "yyyy-MM-dd")} onChange={(e) => setInitialDate(parseISO(e.target.value))} />
                </label>
                <label className="flex flex-col gap-2">
                    <p className="font-medium text-sm">Fecha final:</p>
                    <input className={"border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none"} min={format(initialDate, "yyyy-MM-dd")} onKeyDown={(e) => e.preventDefault()} type="date" value={format(finalDate, "yyyy-MM-dd")} onChange={(e) => setFinalDate(parseISO(e.target.value))} />
                </label>
                <button className="bg-gray-900 text-white text-sm px-10 py-2 rounded-md w-fit mt-6" type="submit">{updating ? <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin stroke-white" />Actualizando</p> : "Actualizar"}</button>
            </form>
            {actions.length > 0 && <div className="flex flex-col gap-4 border rounded-md p-8 shadow-md bg-gray-100 w-fit min-w-96 h-fit">
                <h5 className="font-medium">Actualizando compras</h5>
                <ul className="flex flex-col gap-3">
                    {actions.map(accion => <li className="flex items-center gap-3 text-sm" key={accion.description}>
                        {accion.updating && <LoaderCircle className="size-4 animate-spin" />}
                        {accion.done && <CheckCircle className="size-4 stroke-green-600" />}
                        {accion.description}
                    </li>)}
                </ul>
            </div>}
        </div>
    </section>
}
