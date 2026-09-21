
// import { useEffect, useState } from "react";
// import axios from "axios";

// function Reports() {

//   const API = import.meta.env.VITE_API_URL;

//   const [invoices, setInvoices] =
//     useState([]);

//   const [payments, setPayments] =
//     useState([]);

//   const [products, setProducts] =
//     useState([]);

//   const [returns, setReturns] =
//     useState([]);

//   const [parties, setParties] =
//     useState([]);



//   const fetchData =
//     async () => {

//       try {

//         const invoiceRes =
//           await axios.get(
//             `${API}/invoices`
//           );

//         const paymentRes =
//           await axios.get(
//             `${API}/payments`
//           );

//         const productRes =
//           await axios.get(
//             `${API}/products`
//           );

//         const returnRes =
//           await axios.get(
//             `${API}/returns`
//           );

//         const partyRes =
//           await axios.get(
//             `${API}/parties`
//           );

//         setInvoices(
//           invoiceRes.data
//         );

//         setPayments(
//           paymentRes.data
//         );

//         setProducts(
//           productRes.data
//         );

//         setReturns(
//           returnRes.data
//         );

//         setParties(
//           partyRes.data
//         );

//       } catch (error) {

//         console.log(error);
//       }
//     };

//   useEffect(() => {

//     const loadProducts = async () => {
//       await fetchData();
//     };

//     loadProducts();

//   }, []);

//   // CALCULATIONS

//   const totalSales =
//     invoices.reduce(
//       (acc, item) =>
//         acc +
//         (item.roundedTotal || 0),
//       0
//     );

//   const totalPayments =
//     payments.reduce(
//       (acc, item) =>
//         acc +
//         (item.amount || 0),
//       0
//     );

//   const totalPending =
//     invoices.reduce(
//       (acc, item) =>
//         acc +
//         (item.pendingAmount || 0),
//       0
//     );

//   const totalReturns =
//     returns.reduce(
//       (acc, item) =>
//         acc +
//         (item.qty || 0),
//       0
//     );

//   const lowStockProducts =
//     products.filter(
//       (item) =>
//         item.stock < 10
//     );



//   return (

//     <div className="p-6">

//       {/* Header */}
//       <div className="mb-6">

//         <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
//           Reports Dashboard
//         </h1>

//         <p className="text-gray-500">
//           Business analytics & reports
//         </p>

//       </div>

//       {/* TOP CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

//         {/* Total Sales */}
//         <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg transition">

//           <p className="text-gray-500 mb-2">
//             Total Sales
//           </p>

//           <h2 className="text-3xl font-bold text-[#2F9CAF]">

//             ₹ {
//               totalSales.toFixed(2)
//             }

//           </h2>

//         </div>

//         {/* Total Payments */}
//         <div className="bg-white p-5 rounded-2xl shadow-sm">

//           <p className="text-gray-500 mb-2">
//             Total Payments
//           </p>

//           <h2 className="text-3xl font-bold text-green-600">

//             ₹ {
//               totalPayments.toFixed(2)
//             }

//           </h2>

//         </div>

//         {/* Pending Amount */}
//         <div className="bg-white p-5 rounded-2xl shadow-sm">

//           <p className="text-gray-500 mb-2">
//             Pending Amount
//           </p>

//           <h2 className="text-3xl font-bold text-red-500">

//             ₹ {
//               totalPending.toFixed(2)
//             }

//           </h2>

//         </div>

//         {/* Total Returns */}
//         <div className="bg-white p-5 rounded-2xl shadow-sm">

//           <p className="text-gray-500 mb-2">
//             Total Returns
//           </p>

//           <h2 className="text-3xl font-bold text-yellow-500">

//             {totalReturns}

//           </h2>

//         </div>

//       </div>

//       {/* SECOND ROW */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

//         {/* Products */}
//         <div className="bg-white p-5 rounded-2xl shadow-sm">

//           <p className="text-gray-500 mb-2">
//             Products
//           </p>

//           <h2 className="text-3xl font-bold">

//             {products.length}

//           </h2>

//         </div>

//         {/* Low Stock */}
//         <div className="bg-white p-5 rounded-2xl shadow-sm">

//           <p className="text-gray-500 mb-2">
//             Low Stock
//           </p>

//           <h2 className="text-3xl font-bold text-red-500">

//             {
//               lowStockProducts.length
//             }

//           </h2>

//         </div>

//         {/* Parties */}
//         <div className="bg-white p-5 rounded-2xl shadow-sm">

//           <p className="text-gray-500 mb-2">
//             Parties
//           </p>

//           <h2 className="text-3xl font-bold">

//             {parties.length}

//           </h2>

//         </div>

//         {/* Invoices */}
//         <div className="bg-white p-5 rounded-2xl shadow-sm">

//           <p className="text-gray-500 mb-2">
//             Invoices
//           </p>

//           <h2 className="text-3xl font-bold">

//             {invoices.length}

//           </h2>

//         </div>

//       </div>

//       {/* LOW STOCK TABLE */}
//       <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

//         <div className="p-5 border-b">

//           <h2 className="text-2xl font-bold text-[#2E3A3F]">

//             Low Stock Products

//           </h2>

//         </div>

//         <table className="min-w-[900px] w-full">

//           <thead className="bg-gray-100">

//             <tr>

//               <th className="p-4 text-left">
//                 Product
//               </th>

//               <th className="p-4 text-left">
//                 Rate
//               </th>

//               <th className="p-4 text-left">
//                 Stock
//               </th>

//             </tr>

//           </thead>

//           <tbody>

//             {lowStockProducts.map(
//               (product) => (

//                 <tr
//                   key={product._id}
//                   className="border-b hover:bg-gray-50"
//                 >

//                   <td className="p-4 font-medium">

//                     {product.name}

//                   </td>

//                   <td className="p-4">

//                     ₹ {
//                       product.rate
//                     }

//                   </td>

//                   <td className="p-4 text-red-500 font-bold">

//                     {product.stock}

//                   </td>

//                 </tr>
//               )
//             )}

//             {lowStockProducts.length === 0 && (

//               <tr>

//                 <td
//                   colSpan="3"
//                   className="text-center p-5 text-gray-500"
//                 >

//                   No low stock products

//                 </td>

//               </tr>

//             )}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }

// export default Reports;




import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Reports() {
  const API = import.meta.env.VITE_API_URL;

  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState([]);
  const [returns, setReturns] = useState([]);
  const [parties, setParties] = useState([]);

  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        invoiceRes,
        paymentRes,
        productRes,
        returnRes,
        partyRes,
      ] = await Promise.all([
        axios.get(`${API}/invoices`),
        axios.get(`${API}/payments`),
        axios.get(`${API}/products`),
        axios.get(`${API}/returns`),
        axios.get(`${API}/parties`),
      ]);

      setInvoices(Array.isArray(invoiceRes.data) ? invoiceRes.data : []);
      setPayments(Array.isArray(paymentRes.data) ? paymentRes.data : []);
      setProducts(Array.isArray(productRes.data) ? productRes.data : []);
      setReturns(Array.isArray(returnRes.data) ? returnRes.data : []);
      setParties(Array.isArray(partyRes.data) ? partyRes.data : []);
    } catch (error) {
      console.error("Reports fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const money = (value) =>
    `₹ ${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getInvoiceDate = (invoice) => {
    return (
      invoice?.date ||
      invoice?.dateOfSupply ||
      invoice?.createdAt ||
      ""
    );
  };

  const getInvoiceAmount = (invoice) => {
    return Number(
      invoice?.roundedTotal ??
      invoice?.grandTotal ??
      invoice?.total ??
      0
    );
  };

  const getPaymentAmount = (payment) => {
    return Number(payment?.amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /* =========================================================
     DATE FILTER
  ========================================================= */

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      if (!fromDate && !toDate) return true;

      const rawDate = getInvoiceDate(invoice);

      if (!rawDate) return false;

      const invoiceDate = new Date(rawDate);

      if (Number.isNaN(invoiceDate.getTime())) {
        return true;
      }

      invoiceDate.setHours(0, 0, 0, 0);

      if (fromDate) {
        const from = new Date(`${fromDate}T00:00:00`);

        if (invoiceDate < from) {
          return false;
        }
      }

      if (toDate) {
        const to = new Date(`${toDate}T23:59:59`);

        if (invoiceDate > to) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, fromDate, toDate]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      if (!fromDate && !toDate) return true;

      const rawDate =
        payment?.date ||
        payment?.paymentDate ||
        payment?.createdAt ||
        "";

      if (!rawDate) return true;

      const paymentDate = new Date(rawDate);

      if (Number.isNaN(paymentDate.getTime())) {
        return true;
      }

      paymentDate.setHours(0, 0, 0, 0);

      if (fromDate) {
        const from = new Date(`${fromDate}T00:00:00`);

        if (paymentDate < from) {
          return false;
        }
      }

      if (toDate) {
        const to = new Date(`${toDate}T23:59:59`);

        if (paymentDate > to) {
          return false;
        }
      }

      return true;
    });
  }, [payments, fromDate, toDate]);

  /* =========================================================
     MAIN CALCULATIONS
  ========================================================= */

  const totalSales = filteredInvoices.reduce(
    (sum, invoice) => sum + getInvoiceAmount(invoice),
    0
  );

  const totalPayments = filteredPayments.reduce(
    (sum, payment) => sum + getPaymentAmount(payment),
    0
  );

  const totalPending = filteredInvoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.pendingAmount || 0),
    0
  );

  const totalReturns = returns.reduce(
    (sum, item) => sum + Number(item?.qty || 0),
    0
  );

  const totalQtySold = filteredInvoices.reduce(
    (sum, invoice) => {
      const items = Array.isArray(invoice?.items)
        ? invoice.items
        : [];

      return (
        sum +
        items.reduce(
          (itemSum, item) =>
            itemSum + Number(item?.qty || 0),
          0
        )
      );
    },
    0
  );

  const lowStockProducts = products.filter(
    (product) => Number(product?.stock || 0) < 10
  );

  /* =========================================================
     TOP PRODUCTS
  ========================================================= */

  const topProducts = useMemo(() => {
    const productMap = {};

    filteredInvoices.forEach((invoice) => {
      const items = Array.isArray(invoice?.items)
        ? invoice.items
        : [];

      items.forEach((item) => {
        const name = item?.product || "Unknown Product";
        const qty = Number(item?.qty || 0);
        const amount = Number(item?.total || 0);

        if (!productMap[name]) {
          productMap[name] = {
            name,
            qty: 0,
            amount: 0,
          };
        }

        productMap[name].qty += qty;
        productMap[name].amount += amount;
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredInvoices]);

  /* =========================================================
     PARTY OUTSTANDING
  ========================================================= */

  const outstandingParties = useMemo(() => {
    const partyMap = {};

    filteredInvoices.forEach((invoice) => {
      const name =
        invoice?.partyName ||
        "Unknown Party";

      const sales = getInvoiceAmount(invoice);
      const pending = Number(
        invoice?.pendingAmount || 0
      );

      if (!partyMap[name]) {
        partyMap[name] = {
          name,
          sales: 0,
          pending: 0,
          received: 0,
        };
      }

      partyMap[name].sales += sales;
      partyMap[name].pending += pending;
      partyMap[name].received +=
        sales - pending;
    });

    return Object.values(partyMap)
      .filter((party) => party.pending > 0)
      .sort((a, b) => b.pending - a.pending)
      .slice(0, 6);
  }, [filteredInvoices]);

  /* =========================================================
     PAYMENT SUMMARY
  ========================================================= */

  const paymentSummary = useMemo(() => {
    const result = {};

    filteredPayments.forEach((payment) => {
      const mode =
        payment?.paymentMode ||
        payment?.mode ||
        payment?.method ||
        "Other";

      if (!result[mode]) {
        result[mode] = 0;
      }

      result[mode] += getPaymentAmount(payment);
    });

    return Object.entries(result)
      .map(([mode, amount]) => ({
        mode,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredPayments]);

  /* =========================================================
     RECENT INVOICES
  ========================================================= */

  const recentInvoices = useMemo(() => {
    return [...filteredInvoices]
      .sort((a, b) => {
        const dateA = new Date(getInvoiceDate(a)).getTime() || 0;
        const dateB = new Date(getInvoiceDate(b)).getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 7);
  }, [filteredInvoices]);

  /* =========================================================
     SALES BY DATE
  ========================================================= */

  const salesByDate = useMemo(() => {
    const map = {};

    filteredInvoices.forEach((invoice) => {
      const date = getInvoiceDate(invoice);

      if (!date) return;

      const d = new Date(date);

      if (Number.isNaN(d.getTime())) return;

      const key = d.toISOString().split("T")[0];

      if (!map[key]) {
        map[key] = 0;
      }

      map[key] += getInvoiceAmount(invoice);
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7);
  }, [filteredInvoices]);

  const maxSales =
    Math.max(
      ...salesByDate.map(([, amount]) => amount),
      1
    );

  /* =========================================================
     FILTER BUTTONS
  ========================================================= */

  const setToday = () => {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    setFromDate(today);
    setToDate(today);
  };

  const setThisMonth = () => {
    const now = new Date();

    const firstDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );

    setFromDate(
      firstDay.toISOString().split("T")[0]
    );

    setToDate(
      lastDay.toISOString().split("T")[0]
    );
  };

  const clearFilter = () => {
    setFromDate("");
    setToDate("");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2F9CAF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-500 font-medium">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#f5f7f9] p-4 md:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-[#2F9CAF] flex items-center justify-center text-white shadow-sm">
              <span className="text-xl font-bold">
                ₹
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#263238]">
                Reports
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Business performance and financial overview
              </p>
            </div>

          </div>
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            🖨 Print
          </button>

          <button
            onClick={fetchData}
            className="px-4 py-2.5 bg-[#2F9CAF] text-white rounded-xl text-sm font-semibold hover:bg-[#278a9a] shadow-sm"
          >
            ↻ Refresh
          </button>

        </div>

      </div>

      {/* =====================================================
          DATE FILTER
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-6">

        <div className="flex flex-col xl:flex-row xl:items-end gap-4">

          <div className="flex-1">

            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
            />

          </div>

          <div className="flex-1">

            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={setToday}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50"
            >
              Today
            </button>

            <button
              onClick={setThisMonth}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50"
            >
              This Month
            </button>

            <button
              onClick={clearFilter}
              className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200"
            >
              Reset
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

        {/* SALES */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">

          <div className="absolute right-0 top-0 w-24 h-24 bg-[#2F9CAF]/5 rounded-bl-full"></div>

          <div className="flex items-center justify-between mb-4">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Sales
              </p>

              <h2 className="text-2xl font-bold text-[#263238] mt-2">
                {money(totalSales)}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-[#2F9CAF]/10 flex items-center justify-center text-[#2F9CAF] text-xl">
              ₹
            </div>

          </div>

          <p className="text-xs text-gray-400">
            {filteredInvoices.length} invoices
          </p>

        </div>

        {/* RECEIVED */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">

          <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/5 rounded-bl-full"></div>

          <div className="flex items-center justify-between mb-4">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Received
              </p>

              <h2 className="text-2xl font-bold text-[#263238] mt-2">
                {money(totalPayments)}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-green-600 text-xl">
              ✓
            </div>

          </div>

          <p className="text-xs text-green-600 font-medium">
            Payments received
          </p>

        </div>

        {/* OUTSTANDING */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">

          <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/5 rounded-bl-full"></div>

          <div className="flex items-center justify-between mb-4">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Outstanding
              </p>

              <h2 className="text-2xl font-bold text-[#263238] mt-2">
                {money(totalPending)}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500 text-xl">
              !
            </div>

          </div>

          <p className="text-xs text-red-500 font-medium">
            Pending amount
          </p>

        </div>

        {/* INVOICES */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">

          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-bl-full"></div>

          <div className="flex items-center justify-between mb-4">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Invoices
              </p>

              <h2 className="text-2xl font-bold text-[#263238] mt-2">
                {filteredInvoices.length}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
              #
            </div>

          </div>

          <p className="text-xs text-gray-400">
            {totalQtySold} items sold
          </p>

        </div>

      </div>

      {/* =====================================================
          SECONDARY STATS
      ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-xl border border-gray-100 p-4">

          <p className="text-xs uppercase tracking-wide font-bold text-gray-400">
            Products
          </p>

          <p className="text-2xl font-bold text-gray-800 mt-2">
            {products.length}
          </p>

        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">

          <p className="text-xs uppercase tracking-wide font-bold text-gray-400">
            Parties
          </p>

          <p className="text-2xl font-bold text-gray-800 mt-2">
            {parties.length}
          </p>

        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">

          <p className="text-xs uppercase tracking-wide font-bold text-gray-400">
            Low Stock
          </p>

          <p className="text-2xl font-bold text-red-500 mt-2">
            {lowStockProducts.length}
          </p>

        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">

          <p className="text-xs uppercase tracking-wide font-bold text-gray-400">
            Returned Qty
          </p>

          <p className="text-2xl font-bold text-orange-500 mt-2">
            {totalReturns}
          </p>

        </div>

      </div>

      {/* =====================================================
          SALES + PAYMENT
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* SALES CHART */}

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-lg font-bold text-[#263238]">
                Sales Overview
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Recent sales performance
              </p>
            </div>

            <span className="text-sm font-bold text-[#2F9CAF]">
              {money(totalSales)}
            </span>

          </div>

          {salesByDate.length > 0 ? (

            <div className="h-64 flex items-end gap-3 md:gap-5 border-b border-gray-100">

              {salesByDate.map(
                ([date, amount]) => {

                  const height =
                    Math.max(
                      8,
                      (amount / maxSales) * 190
                    );

                  return (
                    <div
                      key={date}
                      className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                    >

                      <span className="text-[10px] font-semibold text-gray-500">
                        {money(amount)}
                      </span>

                      <div
                        className="w-full max-w-[55px] bg-[#2F9CAF] rounded-t-lg hover:bg-[#278a9a] transition"
                        style={{
                          height: `${height}px`,
                        }}
                        title={`${formatDate(date)} - ${money(amount)}`}
                      ></div>

                      <span className="text-[10px] text-gray-400">
                        {new Date(date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                          }
                        )}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <div className="h-64 flex items-center justify-center text-gray-400">
              No sales data available
            </div>

          )}

        </div>

        {/* PAYMENT SUMMARY */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-[#263238]">
              Payment Summary
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Payments by method
            </p>

          </div>

          <div className="space-y-4">

            {paymentSummary.length > 0 ? (

              paymentSummary.map(
                (payment, index) => {

                  const percentage =
                    totalPayments > 0
                      ? (payment.amount /
                        totalPayments) *
                      100
                      : 0;

                  return (
                    <div key={payment.mode}>

                      <div className="flex justify-between mb-2">

                        <span className="text-sm font-medium text-gray-600">
                          {payment.mode}
                        </span>

                        <span className="text-sm font-bold text-gray-800">
                          {money(payment.amount)}
                        </span>

                      </div>

                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                        <div
                          className={`h-full rounded-full ${index === 0
                            ? "bg-[#2F9CAF]"
                            : index === 1
                              ? "bg-green-500"
                              : index === 2
                                ? "bg-purple-500"
                                : "bg-orange-400"
                            }`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        ></div>

                      </div>

                    </div>
                  );
                }
              )

            ) : (

              <div className="text-center py-12 text-gray-400 text-sm">
                No payment data
              </div>

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          TOP PRODUCTS + OUTSTANDING
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        {/* TOP PRODUCTS */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="p-5 border-b border-gray-100">

            <h2 className="text-lg font-bold text-[#263238]">
              Top Selling Products
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Highest sales value
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">
                    Product
                  </th>

                  <th className="text-center p-4 text-xs font-bold text-gray-500 uppercase">
                    Qty
                  </th>

                  <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase">
                    Sales
                  </th>

                </tr>

              </thead>

              <tbody>

                {topProducts.map(
                  (product, index) => (

                    <tr
                      key={product.name}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <span className="w-7 h-7 rounded-lg bg-[#2F9CAF]/10 text-[#2F9CAF] flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>

                          <span className="font-semibold text-gray-700">
                            {product.name}
                          </span>

                        </div>

                      </td>

                      <td className="p-4 text-center font-semibold text-gray-700">
                        {product.qty}
                      </td>

                      <td className="p-4 text-right font-bold text-gray-800">
                        {money(product.amount)}
                      </td>

                    </tr>

                  )
                )}

                {topProducts.length === 0 && (

                  <tr>
                    <td
                      colSpan="3"
                      className="p-8 text-center text-gray-400"
                    >
                      No product sales available
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* OUTSTANDING */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="p-5 border-b border-gray-100">

            <h2 className="text-lg font-bold text-[#263238]">
              Party Outstanding
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Highest pending balances
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">
                    Party
                  </th>

                  <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase">
                    Sales
                  </th>

                  <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase">
                    Pending
                  </th>

                </tr>

              </thead>

              <tbody>

                {outstandingParties.map(
                  (party) => (

                    <tr
                      key={party.name}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >

                      <td className="p-4">

                        <div className="font-semibold text-gray-700">
                          {party.name}
                        </div>

                        <div className="text-xs text-gray-400 mt-1">
                          Received {money(party.received)}
                        </div>

                      </td>

                      <td className="p-4 text-right font-semibold text-gray-700">
                        {money(party.sales)}
                      </td>

                      <td className="p-4 text-right">

                        <span className="font-bold text-red-500">
                          {money(party.pending)}
                        </span>

                      </td>

                    </tr>

                  )
                )}

                {outstandingParties.length === 0 && (

                  <tr>

                    <td
                      colSpan="3"
                      className="p-8 text-center text-gray-400"
                    >
                      No outstanding balances
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* =====================================================
          RECENT INVOICES
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">

        <div className="p-5 border-b border-gray-100 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-[#263238]">
              Recent Invoices
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Latest invoice activity
            </p>

          </div>

          <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-full text-gray-500 font-semibold">
            {recentInvoices.length} Records
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead className="bg-gray-50">

              <tr>

                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Invoice
                </th>

                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Date
                </th>

                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Party
                </th>

                <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase">
                  Amount
                </th>

                <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase">
                  Pending
                </th>

                <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {recentInvoices.map(
                (invoice) => {

                  const amount =
                    getInvoiceAmount(invoice);

                  const pending =
                    Number(
                      invoice?.pendingAmount || 0
                    );

                  let status =
                    invoice?.paymentStatus;

                  if (!status) {
                    status =
                      pending <= 0
                        ? "PAID"
                        : pending < amount
                          ? "PARTIAL"
                          : "UNPAID";
                  }

                  return (
                    <tr
                      key={invoice._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >

                      <td className="p-4 font-bold text-[#2F9CAF]">
                        {invoice?.invoiceNo || "-"}
                      </td>

                      <td className="p-4 text-sm text-gray-600">
                        {formatDate(
                          getInvoiceDate(invoice)
                        )}
                      </td>

                      <td className="p-4">

                        <span className="font-semibold text-gray-700">
                          {invoice?.partyName || "-"}
                        </span>

                      </td>

                      <td className="p-4 text-right font-bold text-gray-800">
                        {money(amount)}
                      </td>

                      <td className="p-4 text-right font-semibold text-red-500">
                        {money(pending)}
                      </td>

                      <td className="p-4 text-center">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${status === "PAID"
                            ? "bg-green-50 text-green-600"
                            : status === "PARTIAL"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-red-50 text-red-600"
                            }`}
                        >
                          {status}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

              {recentInvoices.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="p-10 text-center text-gray-400"
                  >
                    No invoices found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          LOW STOCK
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-5 border-b border-gray-100 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-[#263238]">
              Low Stock Products
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Products with stock below 10
            </p>

          </div>

          <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-500 text-xs font-bold">
            {lowStockProducts.length} Products
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            <thead className="bg-gray-50">

              <tr>

                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Product
                </th>

                <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase">
                  Rate
                </th>

                <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase">
                  Stock
                </th>

                <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {lowStockProducts.map(
                (product) => {

                  const stock =
                    Number(product?.stock || 0);

                  return (
                    <tr
                      key={product._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >

                      <td className="p-4">

                        <span className="font-semibold text-gray-700">
                          {product?.name || "-"}
                        </span>

                      </td>

                      <td className="p-4 text-right font-semibold">
                        {money(product?.rate)}
                      </td>

                      <td className="p-4 text-center">

                        <span className="font-bold text-red-500">
                          {stock}
                        </span>

                      </td>

                      <td className="p-4 text-center">

                        <span className="px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs font-bold">
                          LOW STOCK
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

              {lowStockProducts.length === 0 && (

                <tr>

                  <td
                    colSpan="4"
                    className="p-10 text-center text-green-600 font-medium"
                  >
                    ✓ All products have sufficient stock
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

export default Reports;