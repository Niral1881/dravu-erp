// import {
//   useEffect,
//   useState,
// } from "react";

// import axios from "axios";


// function Dashboard() {

//   const API = import.meta.env.VITE_API_URL;
//   const [parties, setParties] =
//     useState([]);

//   const [products, setProducts] =
//     useState([]);

//   const [invoices, setInvoices] =
//     useState([]);

//   const fetchDashboardData = async () => {
//     try {

//       const partyRes = await axios.get(
//         `${API}/parties`
//       );

//       const productRes = await axios.get(
//         `${API}/products`
//       );

//       const invoiceRes = await axios.get(
//         `${API}/invoices`
//       );

//       setParties(partyRes.data);

//       setProducts(productRes.data);

//       setInvoices(invoiceRes.data);



//     } catch (error) {

//       console.log(error);
//     }
//   };

//   useEffect(() => {

//     const loadProducts = async () => {
//       await fetchDashboardData();
//     };

//     loadProducts();

//     const interval = setInterval(() => {
//       fetchDashboardData();
//     }, 5000);

//     return () => clearInterval(interval);

//   }, []);

//   // Total Sales
//   const totalSales = invoices.reduce(
//     (acc, item) =>
//       acc + item.grandTotal,
//     0
//   );

//   const totalParties =
//     parties.length;

//   // Total Invoices
//   const totalInvoices =
//     invoices.length;

//   // Total Products
//   const totalProducts =
//     products.length;



//   return (

//     <div>

//       {/* Header */}
//       <div className="mb-8">

//         <h1 className="text-2xl md:text-4xl font-bold">
//           Dashboard
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Welcome to Dravu Fashion Hub ERP
//         </p>

//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">



//         {/* Sales */}
//         <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">

//           <p className="text-gray-500">
//             Total Sales
//           </p>

//           <h2 className="text-2xl md:text-4xl font-bold mt-3 text-[#2F9CAF]">
//             ₹ {totalSales.toFixed(2)}
//           </h2>

//         </div>

//         {/* Parties */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm">

//           <p className="text-gray-500">
//             Total Parties
//           </p>

//           <h2 className="text-4xl font-bold mt-3 text-[#2F9CAF]">
//             {totalParties}
//           </h2>

//         </div>

//         {/* Invoices */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm">

//           <p className="text-gray-500">
//             Total Invoices
//           </p>

//           <h2 className="text-4xl font-bold mt-3 text-[#2F9CAF]">
//             {totalInvoices}
//           </h2>

//         </div>

//         {/* Products */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm">

//           <p className="text-gray-500">
//             Total Products
//           </p>

//           <h2 className="text-4xl font-bold mt-3 text-[#2F9CAF]">
//             {totalProducts}
//           </h2>

//         </div>

//       </div>


//     </div>
//   );
// }

// export default Dashboard;


import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaBoxOpen,
  FaFileInvoice,
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaSyncAlt,
  FaPlus,
  FaArrowRight,
  FaCreditCard,
  FaChartLine,
} from "react-icons/fa";


function Dashboard() {
  const API = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const [parties, setParties] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(false);


  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        partyRes,
        productRes,
        invoiceRes,
        paymentRes,
      ] = await Promise.all([
        axios.get(`${API}/parties`),
        axios.get(`${API}/products`),
        axios.get(`${API}/invoices`),
        axios.get(`${API}/payments`),
      ]);

      setParties(partyRes.data || []);
      setProducts(productRes.data || []);
      setInvoices(invoiceRes.data || []);
      setPayments(paymentRes.data || []);

    } catch (error) {
      console.error(
        "Dashboard fetch error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {
    return `₹ ${Number(
      amount || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "-";
    }

    return value.toLocaleDateString("en-IN");
  };


  // =====================================================
  // TOTAL SALES
  // =====================================================

  const totalSales = useMemo(() => {
    return invoices.reduce(
      (sum, invoice) =>
        sum +
        Number(
          invoice.roundedTotal ??
          invoice.grandTotal ??
          0
        ),
      0
    );
  }, [invoices]);


  // =====================================================
  // TOTAL RECEIVED
  // =====================================================

  const totalReceived = useMemo(() => {
    return invoices.reduce(
      (sum, invoice) =>
        sum +
        Number(invoice.paidAmount || 0),
      0
    );
  }, [invoices]);


  // =====================================================
  // TOTAL OUTSTANDING
  // =====================================================

  const totalOutstanding = useMemo(() => {
    return invoices.reduce(
      (sum, invoice) =>
        sum +
        Number(invoice.pendingAmount || 0),
      0
    );
  }, [invoices]);


  // =====================================================
  // COUNTS
  // =====================================================

  const totalParties = parties.length;
  const totalProducts = products.length;
  const totalInvoices = invoices.length;
  const totalPayments = payments.length;


  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const paidInvoices = invoices.filter(
    (invoice) =>
      invoice.paymentStatus === "PAID"
  ).length;

  const partialInvoices = invoices.filter(
    (invoice) =>
      invoice.paymentStatus === "PARTIAL"
  ).length;

  const unpaidInvoices = invoices.filter(
    (invoice) =>
      invoice.paymentStatus !== "PAID" &&
      invoice.paymentStatus !== "PARTIAL"
  ).length;


  // =====================================================
  // RECENT INVOICES
  // =====================================================

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt || b.date || 0
          ) -
          new Date(
            a.createdAt || a.date || 0
          )
      )
      .slice(0, 5);
  }, [invoices]);


  // =====================================================
  // RECENT PAYMENTS
  // =====================================================

  const recentPayments = useMemo(() => {
    return [...payments]
      .sort(
        (a, b) =>
          new Date(
            b.paymentDate ||
            b.createdAt ||
            0
          ) -
          new Date(
            a.paymentDate ||
            a.createdAt ||
            0
          )
      )
      .slice(0, 5);
  }, [payments]);


  // =====================================================
  // SIX MONTH SALES
  // =====================================================

  const monthlySales = useMemo(() => {
    const months = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString(
          "en-IN",
          {
            month: "short",
          }
        ),
        sales: 0,
      });
    }

    invoices.forEach((invoice) => {
      const invoiceDate = new Date(
        invoice.date ||
        invoice.createdAt
      );

      if (
        Number.isNaN(
          invoiceDate.getTime()
        )
      ) {
        return;
      }

      const month = months.find(
        (item) =>
          item.year ===
          invoiceDate.getFullYear() &&
          item.month ===
          invoiceDate.getMonth()
      );

      if (month) {
        month.sales += Number(
          invoice.roundedTotal ??
          invoice.grandTotal ??
          0
        );
      }
    });

    return months;
  }, [invoices]);


  const maxMonthlySales = Math.max(
    ...monthlySales.map(
      (item) => item.sales
    ),
    1
  );


  // =====================================================
  // QUICK ACTION
  // =====================================================

  const quickAction = (
    title,
    subtitle,
    icon,
    action,
    className
  ) => {
    return (
      <button
        type="button"
        onClick={action}
        className={`text-left p-5 rounded-2xl border transition hover:-translate-y-0.5 hover:shadow-md ${className}`}
      >
        <div className="flex items-center justify-between">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
          >
            {icon}
          </div>

          <FaArrowRight className="text-gray-400" />
        </div>

        <h3 className="font-bold text-gray-900 mt-4">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {subtitle}
        </p>
      </button>
    );
  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const statusClass = (status) => {
    if (status === "PAID") {
      return "bg-green-100 text-green-700";
    }

    if (status === "PARTIAL") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };


  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">

        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome to Dravu Fashion Hub ERP
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
          <FaSyncAlt
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* =================================================
          MAIN FINANCIAL CARDS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">

        {/* SALES */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Sales
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-[#2F9CAF] mt-2">
                {formatCurrency(
                  totalSales
                )}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                From all invoices
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-[#2F9CAF] flex items-center justify-center">
              <FaMoneyBillWave />
            </div>

          </div>

        </div>


        {/* RECEIVED */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Received
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                {formatCurrency(
                  totalReceived
                )}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                Customer payments
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <FaCheckCircle />
            </div>

          </div>

        </div>


        {/* OUTSTANDING */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Outstanding
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-red-600 mt-2">
                {formatCurrency(
                  totalOutstanding
                )}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                Amount pending
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <FaHandHoldingUsd />
            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          MASTER DATA
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">

        {/* PARTIES */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaUsers />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Parties
              </p>

              <h2 className="text-2xl font-bold">
                {totalParties}
              </h2>
            </div>

          </div>

        </div>


        {/* INVOICES */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FaFileInvoice />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Invoices
              </p>

              <h2 className="text-2xl font-bold">
                {totalInvoices}
              </h2>
            </div>

          </div>

        </div>


        {/* PRODUCTS */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <FaBoxOpen />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <h2 className="text-2xl font-bold">
                {totalProducts}
              </h2>
            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <div className="mb-6">

        <div className="mb-4">

          <h2 className="text-xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Quickly access common ERP operations
          </p>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {quickAction(
            "New Invoice",
            "Create a new sales invoice",
            <FaPlus className="text-blue-600" />,
            () =>
              navigate("/invoices"),
            "bg-blue-50 border-blue-100"
          )}

          {quickAction(
            "Add Payment",
            "Record customer payment",
            <FaCreditCard className="text-green-600" />,
            () =>
              navigate("/payments"),
            "bg-green-50 border-green-100"
          )}

          {quickAction(
            "Add Party",
            "Create a new customer",
            <FaUsers className="text-purple-600" />,
            () =>
              navigate("/parties"),
            "bg-purple-50 border-purple-100"
          )}

          {quickAction(
            "Reports",
            "View business reports",
            <FaChartLine className="text-orange-600" />,
            () =>
              navigate("/reports"),
            "bg-orange-50 border-orange-100"
          )}

        </div>

      </div>


      {/* =================================================
          SALES OVERVIEW + PAYMENT STATUS
      ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">


        {/* SALES CHART */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Sales Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Invoice sales for the last 6 months
              </p>

            </div>

            <FaChartLine className="text-[#2F9CAF]" />

          </div>


          <div className="h-64 flex items-end gap-3 md:gap-5 border-b border-gray-100 pb-1">

            {monthlySales.map(
              (item) => {

                const height =
                  item.sales === 0
                    ? 4
                    : Math.max(
                      8,
                      (item.sales /
                        maxMonthlySales) *
                      100
                    );

                return (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="flex-1 h-full flex flex-col justify-end items-center"
                  >

                    <div className="w-full flex justify-center group relative">

                      <div
                        className="w-8 md:w-12 bg-[#2F9CAF] rounded-t-lg hover:opacity-80 transition"
                        style={{
                          height: `${height}%`,
                        }}
                        title={formatCurrency(
                          item.sales
                        )}
                      />

                    </div>

                    <span className="text-xs text-gray-500 mt-2">
                      {item.label}
                    </span>

                  </div>
                );

              }
            )}

          </div>

        </div>


        {/* PAYMENT STATUS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <h2 className="text-xl font-bold text-gray-900">
            Payment Status
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Invoice payment summary
          </p>


          {/* PAID */}

          <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 mb-3">

            <div className="flex items-center gap-3">

              <FaCheckCircle className="text-green-600" />

              <span className="font-semibold text-green-700">
                Paid
              </span>

            </div>

            <span className="font-bold text-green-700">
              {paidInvoices}
            </span>

          </div>


          {/* PARTIAL */}

          <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 mb-3">

            <div className="flex items-center gap-3">

              <FaClock className="text-yellow-600" />

              <span className="font-semibold text-yellow-700">
                Partial
              </span>

            </div>

            <span className="font-bold text-yellow-700">
              {partialInvoices}
            </span>

          </div>


          {/* UNPAID */}

          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50">

            <div className="flex items-center gap-3">

              <FaExclamationCircle className="text-red-600" />

              <span className="font-semibold text-red-700">
                Unpaid
              </span>

            </div>

            <span className="font-bold text-red-700">
              {unpaidInvoices}
            </span>

          </div>


          {/* TOTAL */}

          <div className="border-t mt-5 pt-5 flex justify-between">

            <span className="text-gray-500">
              Payment Entries
            </span>

            <span className="font-bold">
              {totalPayments}
            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          RECENT INVOICES
      ================================================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">

        <div className="p-5 border-b border-gray-100 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold">
              Recent Invoices
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest generated invoices
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/invoice-history")
            }
            className="text-sm font-semibold text-[#2F9CAF] flex items-center gap-2"
          >
            View All
            <FaArrowRight />
          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead>

              <tr className="bg-gray-50">

                <th className="text-left p-4 text-sm text-gray-500">
                  Invoice
                </th>

                <th className="text-left p-4 text-sm text-gray-500">
                  Party
                </th>

                <th className="text-left p-4 text-sm text-gray-500">
                  Date
                </th>

                <th className="text-right p-4 text-sm text-gray-500">
                  Amount
                </th>

                <th className="text-right p-4 text-sm text-gray-500">
                  Outstanding
                </th>

                <th className="text-center p-4 text-sm text-gray-500">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {recentInvoices.map(
                (invoice) => (

                  <tr
                    key={invoice._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >

                    <td className="p-4 font-bold">
                      {invoice.invoiceNo || "-"}
                    </td>

                    <td className="p-4">
                      {invoice.partyName || "-"}
                    </td>

                    <td className="p-4 text-gray-500">
                      {formatDate(
                        invoice.date ||
                        invoice.createdAt
                      )}
                    </td>

                    <td className="p-4 text-right font-semibold">
                      {formatCurrency(
                        invoice.roundedTotal ??
                        invoice.grandTotal ??
                        0
                      )}
                    </td>

                    <td className="p-4 text-right font-semibold text-red-600">
                      {formatCurrency(
                        invoice.pendingAmount
                      )}
                    </td>

                    <td className="p-4 text-center">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${statusClass(
                          invoice.paymentStatus
                        )}`}
                      >
                        {invoice.paymentStatus ||
                          "UNPAID"}
                      </span>

                    </td>

                  </tr>

                )
              )}


              {recentInvoices.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-500"
                  >
                    No invoices found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          RECENT PAYMENTS
      ================================================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-5 border-b border-gray-100 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold">
              Recent Payments
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest customer payments
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/payment-history")
            }
            className="text-sm font-semibold text-[#2F9CAF] flex items-center gap-2"
          >
            View All
            <FaArrowRight />
          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead>

              <tr className="bg-gray-50">

                <th className="text-left p-4 text-sm text-gray-500">
                  Date
                </th>

                <th className="text-left p-4 text-sm text-gray-500">
                  Party
                </th>

                <th className="text-left p-4 text-sm text-gray-500">
                  Invoice
                </th>

                <th className="text-left p-4 text-sm text-gray-500">
                  Mode
                </th>

                <th className="text-right p-4 text-sm text-gray-500">
                  Amount
                </th>

              </tr>

            </thead>


            <tbody>

              {recentPayments.map(
                (payment) => (

                  <tr
                    key={payment._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >

                    <td className="p-4 text-gray-500">
                      {formatDate(
                        payment.paymentDate ||
                        payment.createdAt
                      )}
                    </td>

                    <td className="p-4 font-semibold">
                      {payment.partyName || "-"}
                    </td>

                    <td className="p-4">
                      {payment.invoiceNo || "-"}
                    </td>

                    <td className="p-4">

                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                        {payment.paymentMode ||
                          "-"}
                      </span>

                    </td>

                    <td className="p-4 text-right font-bold text-green-600">
                      {formatCurrency(
                        payment.amount
                      )}
                    </td>

                  </tr>

                )
              )}


              {recentPayments.length === 0 && (

                <tr>

                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-500"
                  >
                    No payments found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;