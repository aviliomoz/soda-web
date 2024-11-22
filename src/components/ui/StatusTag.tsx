import { Status } from "../../utils/types"

type Props = {
    status: Status,
    finalLetter?: "a" | "o",
}

export const StatusTag = ({ status, finalLetter = "o" }: Props) => {
    return <span className={`text-sm flex items-center gap-2 ${status === "activo" ? "text-green-700" : "text-red-700"}`}>
        <div className={`size-1.5 rounded-full ${status === "activo" ? "bg-green-700" : "bg-red-700"}`}></div>
        {status === "activo" ? `Activ${finalLetter}` : `Inactiv${finalLetter}`}
    </span>
}