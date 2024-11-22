import { LucideIcon } from "lucide-react"
import { DOMAINS } from "./constants"
import { User } from "../schemas/user.schema"

export type Status = "activo" | "inactivo"

export type ApiResponse<T> = {
    ok: boolean,
    message: string,
    error?: string
    data?: T
}

export type AuthResponse = {
    user: User,
    accessToken: string
}

export type Path = {
    name: string,
    url: string,
    icon: LucideIcon,
    modules?: Module[]
}

export type PathGroup = {
    name: string,
    paths: Path[]
}

export type Module = {
    name: string,
    url: string
}

export type Domain = typeof DOMAINS[number]

export type Restaurant = {
    name: string,
    domain: Domain
}