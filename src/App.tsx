import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { RedirectPage } from "./pages/RedirectPage";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./layouts/MainLayout";
import { PrivateRoutesLayout } from "./layouts/PrivateRoutesLayout";
import { PurchasesPage } from "./pages/PurchasesPage";
import { PurchasesForm } from "./pages/PurchasesForm";
import { DashboardPage } from "./pages/DashboardPage";
import { ComparePage } from "./pages/ComparePage";
import { HistoryPage } from "./pages/HistoryPage";
import { PriceListPage } from "./pages/PriceListPage";
import { SalesPage } from "./pages/SalesPage";
import { SalesForm } from "./pages/SalesForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectPage />} />
        <Route element={<MainLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoutesLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ventas" element={<SalesPage />} />
            <Route path="/ventas/actualizar" element={<SalesForm />} />
            <Route path="/compras" element={<PurchasesPage />} />
            <Route path="/compras/actualizar" element={<PurchasesForm />} />
            <Route path="/compras/comparador" element={<ComparePage />} />
            <Route path="/compras/historico" element={<HistoryPage />} />
            <Route path="/compras/cotizacion" element={<PriceListPage />} />
          </Route>
        </Route>
        <Route path="*" element={<RedirectPage />} />
      </Routes>
      <Toaster position="bottom-right" toastOptions={{duration: 5000}}/>
    </Router>
  );
}

export default App;
