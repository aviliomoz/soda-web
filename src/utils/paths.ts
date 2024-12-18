import { HandPlatter, LayoutDashboard, ShoppingBag } from "lucide-react";
import { PathGroup } from "./types";

export const PATHS: PathGroup[] = [
    {
        name: "MENU",
        paths: [
            { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
            {
                name: "Ventas", url: "/ventas", icon: HandPlatter
            },
            {
                name: "Compras", url: "/compras", icon: ShoppingBag, modules: [
                    {
                        name: "Insumos",
                        url: "/compras/insumos"
                    },
                    {
                        name: "Comparador",
                        url: "/compras/comparador"
                    },
                    {
                        name: "Histórico",
                        url: "/compras/historico"
                    },
                    {
                        name: "Cotización",
                        url: "/compras/cotizacion"
                    },
                ]
            },
        ]
    },
]