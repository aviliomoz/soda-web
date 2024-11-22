import { createContext, useContext, useEffect, useState } from "react"
import { Domain } from "../utils/types"
import { startOfMonth, sub } from 'date-fns'
import { getDomainsByUser } from "../utils/restaurants"
import { useAuth } from "./AuthContext"

type FiltersContextType = {
    domain: Domain | undefined,
    setDomain: (domain: Domain) => void

    initialDate: Date,
    setInitialDate: (date: Date) => void,
    finalDate: Date,
    setFinalDate: (date: Date) => void,
}

export const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

export const FiltersContextProvider = ({ children }: { children: React.ReactNode }) => {

    const { user } = useAuth()

    const [domain, setDomain] = useState<Domain | undefined>(undefined)
    const [finalDate, setFinalDate] = useState<Date>(new Date())
    const [initialDate, setInitialDate] = useState<Date>(sub(startOfMonth(finalDate), { months: 1 }))

    useEffect(() => {
        setDomain(getDomainsByUser(user?.email!)[0])
    }, [user])

    return <FiltersContext.Provider value={{ domain, setDomain, initialDate, setInitialDate, finalDate, setFinalDate }}>
        {children}
    </FiltersContext.Provider>
}

export const useFilters = () => {
    const context = useContext(FiltersContext)
    if (!context) throw new Error("El useFilter debe estar dentro de FiltersContextProvider");
    return context
}