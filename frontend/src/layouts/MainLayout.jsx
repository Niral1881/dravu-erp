import { Link, Outlet, useLocation } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaBox,
  FaFileInvoice,
  FaMoneyBill,
  FaChartBar,
  FaBook,
  FaCog,
  FaUndo,
  FaHistory,
} from "react-icons/fa";

function MainLayout() {

  const logo = "/logo.jpeg";

  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gradient-to-b from-[#2E3A3F] to-[#1F272B] text-white p-5">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">

          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 rounded-full object-cover bg-white p-1"
          />

          <div>
            <h1 className="text-xl font-bold text-[#2F9CAF]">
              Dravu Fashion Hub
            </h1>

          </div>

        </div>

        {/* Menu */}
        <ul className="space-y-2">

          <li>
            <Link
              to="/"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >
              <FaHome />
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/parties"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/parties"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >
              <FaUsers />
              Parties
            </Link>
          </li>

          <li>
            <Link
              to="/products"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/products"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >
              <FaBox />
              Products
            </Link>
          </li>

          <li>
            <Link
              to="/invoices"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/invoices"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >
              <FaFileInvoice />
              Invoices
            </Link>
          </li>

          <li>
            <Link
              to="/invoices-history"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#2F9CAF] transition"
            >
              <FaFileInvoice />
              Invoice History
            </Link>
          </li>

          <li>
            <Link
              to="/payments"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/payments"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >
              <FaMoneyBill />
              Payments
            </Link>
          </li>

          <li>

            <Link
              to="/returns"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/returns"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >

              <FaUndo />

              Returns

            </Link>

          </li>

          <li>
            <Link to="/ledger"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/ledger"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >
              <FaBook />
              Ledger
            </Link>
          </li>

          <li>

            <Link
              to="/payment-history"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/payment-history"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >

              <FaMoneyBill />

              Payment History

            </Link>

          </li>

          <li>

            <Link
              to="/stock-history"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/stock-history"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >
              <FaHistory />
              Stock History

            </Link>

          </li>

          <li>
            <Link
              to="/reports"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/reports"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >
              <FaChartBar />
              Reports
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === "/settings"
                ? "bg-[#2F9CAF]"
                : "hover:bg-[#2F9CAF]"
                }`}
            >
              <FaCog />
              Settings
            </Link>
          </li>

        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
}

export default MainLayout;