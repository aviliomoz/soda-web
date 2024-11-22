import { LoaderCircle } from "lucide-react"

type Props = {
    children: React.ReactNode
    title: string
    loading?: boolean
    x_scroll?: boolean
    y_scroll?: boolean
    center?: boolean
}

export const Widget = ({ children, title, loading = false, x_scroll = false, y_scroll = false, center = false }: Props) => {
    return <article className="border rounded-md p-4 shadow-md text-sm min-w-52 max-w-full">
        <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold">{title}</h5>
            {loading && <LoaderCircle className="size-4 animate-spin stroke-gray-400" />}
        </div>
        <div className={`${x_scroll && "overflow-x-scroll"} max-h-96 ${y_scroll && "overflow-y-scroll pr-4"} ${center && "flex justify-center items-center"}`}>
            {children}
        </div>
    </article>
}