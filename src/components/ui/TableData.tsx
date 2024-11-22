type Props = {
    children: React.ReactNode,
    space?: boolean,
    width?: "sm" | "md" | "lg" | "xl"
}

export const TableData = ({ children, space = false, width = "sm" }: Props) => {
    return <td className={`pr-6 truncate text-xs ${space && "pl-4"} 
                            ${width === "sm" && "max-w-24"}
                            ${width === "md" && "max-w-36"}
                            ${width === "lg" && "max-w-80"}
                            ${width === "xl" && "max-w-96"}
                          `}>
        {children}
    </td>
}