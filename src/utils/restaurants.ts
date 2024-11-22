import { Domain, Restaurant } from "./types";

export const RESTAURANTS: Record<Domain, Restaurant> = {
    wayki: {
        name: "Wayki",
        domain: "wayki"
    },
    qarbon: {
        name: "Qarbon",
        domain: "qarbon"
    },
    mezqal: {
        name: "Mezqal",
        domain: "mezqal"
    }
}

export const ACCESS: [string, Domain[]][] = [
    ["aviliomuoz@gmail.com", ["qarbon", "mezqal", "wayki"]],
    ["asistentelogisticomezqal@grupomq.pe", ["mezqal"]],
]

export const getDomainsByUser = (email: string) => {
    const userAccess = ACCESS.find(access => access[0] === email)

    if (!userAccess) return []

    return userAccess[1]
}