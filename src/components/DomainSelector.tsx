import { useAuth } from "../contexts/AuthContext"
import { useFilters } from "../contexts/FiltersContext"
import { getDomainsByUser, RESTAURANTS } from "../utils/restaurants"
import { Domain } from "../utils/types"

export const DomainSelector = () => {
    const { user } = useAuth()
    const { domain, setDomain } = useFilters()

    return <label className="flex items-center gap-3">
        <p className="text-sm font-medium">Local: </p>
        <select className="outline-none border rounded-md px-3 py-2 text-sm cursor-pointer" value={domain} onChange={(e) => setDomain(e.target.value as Domain)}>
            {getDomainsByUser(user?.email!).map(domain => <option key={domain} value={domain}>{RESTAURANTS[domain].name}</option>)}
        </select>
    </label>
}