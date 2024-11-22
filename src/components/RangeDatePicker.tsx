import { format, parseISO } from "date-fns"
import { useFilters } from "../contexts/FiltersContext"

export const RangeDatePicker = () => {

    const { initialDate, setInitialDate, finalDate, setFinalDate } = useFilters()

    return <div className="flex items-center gap-3 text-sm">
        <p className="font-medium">Fechas: </p>
        <input type="date" className="border rounded-md shadow-sm px-3 py-1.5" onKeyDown={(e) => e.preventDefault()} value={format(initialDate, "yyyy-MM-dd")} max={format(finalDate, "yyyy-MM-dd")} onChange={(e) => setInitialDate(parseISO(e.target.value))} />
        <p>-</p>
        <input type="date" className="border rounded-md shadow-sm px-3 py-1.5" onKeyDown={(e) => e.preventDefault()} value={format(finalDate, "yyyy-MM-dd")} min={format(initialDate, "yyyy-MM-dd")} onChange={(e) => setFinalDate(parseISO(e.target.value))} />
    </div>
}