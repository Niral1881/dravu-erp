import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Parties from "./pages/Parties";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import InvoicePrint from "./pages/InvoicePrint";
import InvoiceHistory from "./pages/InvoiceHistory";
import EditInvoice from "./pages/EditInvoice";
import Ledger from "./pages/Ledger";
import PaymentHistory from "./pages/PaymentHistory";
import StockHistory
  from "./pages/StockHistory";
import Returns from "./pages/Returns";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<MainLayout />}>

          <Route index element={<Dashboard />} />
          <Route path="parties" element={<Parties />} />
          <Route path="products" element={<Products />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route
            path="returns"
            element={<Returns />}
          />
          <Route
            path="ledger"
            element={<Ledger />}
          />
          <Route
            path="payment-history"
            element={<PaymentHistory />}
          />

          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="invoice-print/:id" element={<InvoicePrint />} />
          <Route
            path="invoices"
            element={<Invoices />}
          />
          <Route
            path="invoices-history"
            element={<InvoiceHistory />}
          />

          <Route
            path="edit-invoice/:id"
            element={<EditInvoice />}
          />
          <Route
            path="stock-history"
            element={<StockHistory />}
          />




        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;