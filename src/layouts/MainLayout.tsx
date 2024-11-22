import { Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Logo } from "../components/ui/Logo"
import { Menu } from "../components/ui/Menu";
import { AuthButton } from "../components/AuthButton";
import { UserWidget } from "../components/widgets/UserWidget";
import { Loading } from '../components/ui/Loading';
import { DomainSelector } from "../components/DomainSelector";

export const MainLayout = () => {

    const { user, checking } = useAuth()

    if (checking) return <Loading />

    return <>
        <header className={`flex items-center justify-between h-20 ${user && "border-b"}`}>
            <div className="flex items-center gap-8">
                <Logo />
                {user && <DomainSelector />}
            </div>
            <div className="flex items-center gap-8">
                {user && <UserWidget user={user} />}
                <AuthButton />
            </div>
        </header>

        <main className="flex justify-between">
            {user && <aside className="w-56 bg-white border-r px-4 py-6 h-screen max-h-[calc(100vh-80px)] overflow-y-scroll">
                <Menu />
            </aside>}
            <div className={`w-full h-screen max-h-[calc(100vh-80px)] overflow-y-scroll p-6`}>
                <Outlet />
            </div>
        </main>
    </>
}