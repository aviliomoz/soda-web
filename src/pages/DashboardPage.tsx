import { RangeDatePicker } from "../components/RangeDatePicker"
import { PurchasesByCategoryWidget } from "../components/widgets/PurchasesByCategoryWidget"
import { PurchasesBySupplyWidget } from "../components/widgets/PurchasesBySupplyWidget"
import { PurchasesBySupplierWidget } from "../components/widgets/PurchasesBySupplierWidget"
import { PurchasesByWeekWidget } from "../components/widgets/PurchasesByWeekWidget"
import { TotalPurchasesWidget } from "../components/widgets/TotalPurchasesWidget"

export const DashboardPage = () => {
    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Dashboard</h3>
            <div className="flex items-center gap-6">
                <RangeDatePicker />
            </div>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <TotalPurchasesWidget />
            </div>
            <PurchasesByWeekWidget />
            <div className="grid grid-cols-2 gap-4 w-full">
                <PurchasesBySupplierWidget />
                <PurchasesByCategoryWidget />
            </div>
            <PurchasesBySupplyWidget />
        </div>
    </section>
}