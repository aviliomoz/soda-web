import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export const PrivateRoutesLayout = () => {

    const { user, checking } = useAuth()

    if (!user && !checking) return <Navigate to={"/login"} />

    return <Outlet />
}