export const formatNumber = (num: number) => {
    return num.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}