// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // function InvoiceHistory() {

// //   const API = import.meta.env.VITE_API_URL;
// //   const [invoices, setInvoices] =
// //     useState([]);


// //   const [parties, setParties] =
// //     useState([]);

// //   const [selectedParty, setSelectedParty] =
// //     useState("");

// //   const navigate = useNavigate();

// //   const fetchInvoices = async () => {
// //     try {

// //       const res = await axios.get(
// //         `${API}/invoices`
// //       );

// //       setInvoices(res.data);

// //     } catch (error) {

// //       console.log(error);
// //     }
// //   };

// //   const fetchParties =
// //     async () => {

// //       try {

// //         const res =
// //           await axios.get(
// //             `${API}/parties`
// //           );

// //         setParties(
// //           res.data
// //         );

// //       } catch (error) {

// //         console.log(error);
// //       }
// //     };

// //   useEffect(() => {

// //     const loadProducts = async () => {
// //       await fetchInvoices();
// //       await fetchParties();
// //     };

// //     loadProducts();

// //   }, []);

// //   const filteredInvoices =
// //     invoices
// //       .filter((invoice) => {

// //         if (!selectedParty)
// //           return true;

// //         return (
// //           invoice.partyName ===
// //           selectedParty
// //         );
// //       })
// //   const totalSales =
// //     filteredInvoices.reduce(
// //       (acc, item) =>
// //         acc + item.grandTotal,
// //       0
// //     );

// //   return (

// //     <div>

// //       {/* Header */}
// //       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

// //         <div>

// //           <h1 className="text-2xl md:text-4xl font-bold">
// //             Invoice History
// //           </h1>

// //           <p className="text-gray-500 mt-2">
// //             View all generated invoices
// //           </p>

// //         </div>

// //       </div>


// //       <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm mb-5">

// //         <h2 className="text-xl md:text-2xl font-bold text-[#2F9CAF] break-words">

// //           Total Sales :
// //           ₹ {totalSales.toFixed(2)}

// //         </h2>

// //       </div>

// //       <div className="bg-white p-5 rounded-2xl shadow-sm mb-6">

// //         <label className="block mb-2 font-medium">
// //           Search Party
// //         </label>

// //         <select
// //           value={selectedParty}
// //           onChange={(e) =>
// //             setSelectedParty(
// //               e.target.value
// //             )
// //           }
// //           className="w-full border border-gray-200 rounded-xl p-3"
// //         >

// //           <option value="">
// //             All Parties
// //           </option>

// //           {parties
// //             .sort((a, b) =>
// //               a.name.localeCompare(b.name)
// //             )
// //             .map((party) => (

// //               <option
// //                 key={party._id}
// //                 value={party.name}
// //               >
// //                 {party.name}
// //               </option>

// //             ))}

// //         </select>

// //       </div>

// //       {/* Table */}
// //       <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

// //         <table className="min-w-[900px] w-full">

// //           <thead className="bg-[#F5F7FA]">

// //             <tr className="bg-black text-white">

// //               <th className="text-left p-4">
// //                 Invoice No
// //               </th>

// //               <th className="text-left p-4">
// //                 Party Name
// //               </th>

// //               <th className="text-left p-4">
// //                 Date
// //               </th>

// //               <th className="text-left p-4">
// //                 Amount
// //               </th>

// //               <th className="text-left p-4">
// //                 Status
// //               </th>

// //               <th className="text-left p-4">
// //                 Action
// //               </th>

// //             </tr>

// //           </thead>

// //           <tbody>

// //             {filteredInvoices.map((invoice) => (

// //               <tr
// //                 key={invoice._id}
// //                 className="border-t"
// //               >

// //                 <td className="p-4 font-bold">
// //                   {invoice.invoiceNo}
// //                 </td>

// //                 <td className="p-4">
// //                   {invoice.partyName}
// //                 </td>

// //                 <td className="p-4">

// //                   {
// //                     new Date(
// //                       invoice.createdAt
// //                     ).toLocaleDateString()
// //                   }

// //                 </td>

// //                 <td className="p-4 font-bold">
// //                   ₹ {invoice.grandTotal}
// //                 </td>

// //                 <td className="p-4">

// //                   <span
// //                     className={`px-3 py-1 rounded-full text-white text-xs md:text-sm font-bold ${invoice.paymentStatus === "PAID"
// //                       ? "bg-green-500"
// //                       : invoice.paymentStatus === "PARTIAL"
// //                         ? "bg-yellow-500"
// //                         : "bg-red-500"
// //                       }`}
// //                   >

// //                     {invoice.paymentStatus}

// //                   </span>

// //                 </td>

// //                 <td className="p-4">

// //                   <button
// //                     onClick={() =>
// //                       navigate(
// //                         `/invoice-print/${invoice._id}`
// //                       )
// //                     }
// //                     className="bg-[#2F9CAF] cursor-pointer text-white px-3 md:px-4 py-2 rounded-lg text-sm"
// //                   >
// //                     View
// //                   </button>

// //                   <button
// //                     onClick={() =>
// //                       navigate(`/edit-invoice/${invoice._id}`)
// //                     }
// //                     className="bg-yellow-500 cursor-pointer text-white px-4 py-2 rounded-lg ml-2"
// //                   >
// //                     Edit
// //                   </button>

// //                 </td>

// //               </tr>
// //             ))}

// //             {filteredInvoices.length === 0 && (
// //               <tr>
// //                 <td
// //                   colSpan="6"
// //                   className="text-center p-6 text-gray-500"
// //                 >
// //                   No invoices found
// //                 </td>
// //               </tr>
// //             )}

// //           </tbody>

// //         </table>

// //       </div>

// //     </div>
// //   );
// // }

// // export default InvoiceHistory;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
// } from "react-icons/fa";

// function InvoiceHistory() {
//   const API = import.meta.env.VITE_API_URL;

//   const [invoices, setInvoices] = useState([]);
//   const [parties, setParties] = useState([]);
//   const [selectedParty, setSelectedParty] = useState("");

//   const navigate = useNavigate();

//   // ======================================
//   // FETCH INVOICES
//   // ======================================

//   const fetchInvoices = async () => {
//     try {
//       const res = await axios.get(
//         `${API}/invoices`
//       );

//       setInvoices(res.data || []);
//     } catch (error) {
//       console.error(
//         "Fetch invoices error:",
//         error
//       );
//     }
//   };

//   // ======================================
//   // FETCH PARTIES
//   // ======================================

//   const fetchParties = async () => {
//     try {
//       const res = await axios.get(
//         `${API}/parties`
//       );

//       setParties(res.data || []);
//     } catch (error) {
//       console.error(
//         "Fetch parties error:",
//         error
//       );
//     }
//   };

//   // ======================================
//   // INITIAL LOAD
//   // ======================================

//   useEffect(() => {
//     const loadData = async () => {
//       await fetchInvoices();
//       await fetchParties();
//     };

//     loadData();
//   }, []);

//   // ======================================
//   // DELETE INVOICE
//   // ======================================

//   const handleDelete = async (id) => {
//     const invoice = invoices.find(
//       (item) => item._id === id
//     );

//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete invoice ${invoice?.invoiceNo || ""
//       }?`
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       await axios.delete(
//         `${API}/invoices/${id}`
//       );

//       // Remove immediately from table
//       setInvoices((prev) =>
//         prev.filter(
//           (item) => item._id !== id
//         )
//       );

//       alert("Invoice deleted successfully");
//     } catch (error) {
//       console.error(
//         "Delete invoice error:",
//         error
//       );

//       alert(
//         error.response?.data?.message ||
//         "Failed to delete invoice"
//       );
//     }
//   };

//   // ======================================
//   // FILTER
//   // ======================================

//   const filteredInvoices = invoices
//     .filter((invoice) => {

//       if (!selectedParty) {
//         return true;
//       }

//       return invoice.partyName === selectedParty;

//     })
//     .sort((a, b) => {
//       return (
//         new Date(b.createdAt) -
//         new Date(a.createdAt)
//       );
//     });

//   // ======================================
//   // TOTAL SALES
//   // ======================================

//   const totalSales =
//     filteredInvoices.reduce(
//       (acc, item) =>
//         acc +
//         Number(item.grandTotal || 0),
//       0
//     );

//   // ======================================
//   // RETURN
//   // ======================================

//   return (
//     <div>

//       {/* HEADER */}

//       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

//         <div>

//           <h1 className="text-2xl md:text-4xl font-bold">
//             Invoice History
//           </h1>

//           <p className="text-gray-500 mt-2">
//             View all generated invoices
//           </p>

//         </div>

//       </div>

//       {/* TOTAL SALES */}

//       <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm mb-5">

//         <h2 className="text-xl md:text-2xl font-bold text-[#2F9CAF] break-words">

//           Total Sales :
//           ₹ {totalSales.toFixed(2)}

//         </h2>

//       </div>

//       {/* PARTY FILTER */}

//       <div className="bg-white p-5 rounded-2xl shadow-sm mb-6">

//         <label className="block mb-2 font-medium">
//           Search Party
//         </label>

//         <select
//           value={selectedParty}
//           onChange={(e) =>
//             setSelectedParty(
//               e.target.value
//             )
//           }
//           className="w-full border border-gray-200 rounded-xl p-3"
//         >

//           <option value="">
//             All Parties
//           </option>

//           {[...parties]
//             .sort((a, b) =>
//               (a.name || "").localeCompare(
//                 b.name || ""
//               )
//             )
//             .map((party) => (

//               <option
//                 key={party._id}
//                 value={party.name}
//               >
//                 {party.name}
//               </option>

//             ))}

//         </select>

//       </div>

//       {/* TABLE */}

//       <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

//         <table className="min-w-[900px] w-full">

//           <thead className="bg-[#F5F7FA]">

//             <tr className="bg-black text-white">

//               <th className="text-left p-4">
//                 Invoice No
//               </th>

//               <th className="text-left p-4">
//                 Party Name
//               </th>

//               <th className="text-left p-4">
//                 Date
//               </th>

//               <th className="text-left p-4">
//                 Amount
//               </th>

//               <th className="text-left p-4">
//                 Status
//               </th>

//               <th className="text-center p-4">
//                 Action
//               </th>

//             </tr>

//           </thead>

//           <tbody>

//             {filteredInvoices.map(
//               (invoice) => (

//                 <tr
//                   key={invoice._id}
//                   className="border-t"
//                 >

//                   <td className="p-4 font-bold">
//                     {invoice.invoiceNo}
//                   </td>

//                   <td className="p-4">
//                     {invoice.partyName}
//                   </td>

//                   <td className="p-4">

//                     {new Date(
//                       invoice.createdAt
//                     ).toLocaleDateString()}

//                   </td>

//                   <td className="p-4 font-bold">

//                     ₹{" "}
//                     {Number(
//                       invoice.grandTotal || 0
//                     ).toFixed(2)}

//                   </td>

//                   <td className="p-4">

//                     <span
//                       className={`px-3 py-1 rounded-full text-white text-xs md:text-sm font-bold ${invoice.paymentStatus ===
//                         "PAID"
//                         ? "bg-green-500"
//                         : invoice.paymentStatus ===
//                           "PARTIAL"
//                           ? "bg-yellow-500"
//                           : "bg-red-500"
//                         }`}
//                     >

//                       {invoice.paymentStatus}

//                     </span>

//                   </td>

//                   {/* ACTION */}

//                   <td className="p-4">

//                     <div className="flex items-center justify-center gap-2">

//                       {/* VIEW */}

//                       <button
//                         type="button"
//                         title="View Invoice"
//                         aria-label="View Invoice"
//                         onClick={() =>
//                           navigate(
//                             `/invoice-print/${invoice._id}`
//                           )
//                         }
//                         className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#2F9CAF] text-white hover:bg-[#25899b] transition"
//                       >
//                         <FaEye />
//                       </button>

//                       {/* EDIT */}

//                       <button
//                         type="button"
//                         title="Edit Invoice"
//                         aria-label="Edit Invoice"
//                         onClick={() =>
//                           navigate(
//                             `/edit-invoice/${invoice._id}`
//                           )
//                         }
//                         className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
//                       >
//                         <FaEdit />
//                       </button>

//                       {/* DELETE */}

//                       <button
//                         type="button"
//                         title="Delete Invoice"
//                         aria-label="Delete Invoice"
//                         onClick={() =>
//                           handleDelete(
//                             invoice._id
//                           )
//                         }
//                         className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
//                       >
//                         <FaTrash />
//                       </button>

//                     </div>

//                   </td>

//                 </tr>

//               )
//             )}

//             {filteredInvoices.length ===
//               0 && (

//                 <tr>

//                   <td
//                     colSpan="6"
//                     className="text-center p-6 text-gray-500"
//                   >
//                     No invoices found
//                   </td>

//                 </tr>

//               )}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }

// export default InvoiceHistory;





import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSyncAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";

function InvoiceHistory() {
  const API = import.meta.env.VITE_API_URL;

  const [invoices, setInvoices] = useState([]);
  const [parties, setParties] = useState([]);
  const [payments, setPayments] = useState([]);

  const [selectedParty, setSelectedParty] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ======================================================
  // FETCH INVOICES
  // ======================================================

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API}/invoices`);
      setInvoices(res.data || []);
    } catch (error) {
      console.error("Fetch invoices error:", error);
    }
  };

  // ======================================================
  // FETCH PARTIES
  // ======================================================

  const fetchParties = async () => {
    try {
      const res = await axios.get(`${API}/parties`);
      setParties(res.data || []);
    } catch (error) {
      console.error("Fetch parties error:", error);
    }
  };

  // ======================================================
  // FETCH PAYMENTS
  // ======================================================

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API}/payments`);
      setPayments(res.data || []);
    } catch (error) {
      console.error("Fetch payments error:", error);
    }
  };

  // ======================================================
  // FETCH ALL DATA
  // ======================================================

  const fetchAllData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchInvoices(),
        fetchParties(),
        fetchPayments(),
      ]);
    } catch (error) {
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchAllData();
  }, []);

  // ======================================================
  // DELETE INVOICE
  // ======================================================

  const handleDelete = async (id) => {
    const invoice = invoices.find(
      (item) => item._id === id
    );

    const confirmDelete = window.confirm(
      `Are you sure you want to delete invoice ${invoice?.invoiceNo || ""
      }?`
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axios.delete(`${API}/invoices/${id}`);

      setInvoices((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert("Invoice deleted successfully");
    } catch (error) {
      console.error("Delete invoice error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FILTER INVOICES
  // ======================================================

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((invoice) => {
        // Party filter
        if (
          selectedParty &&
          invoice.partyName !== selectedParty
        ) {
          return false;
        }

        // Status filter
        if (
          statusFilter &&
          invoice.paymentStatus !== statusFilter
        ) {
          return false;
        }

        // Search
        if (search.trim()) {
          const searchText = search
            .toLowerCase()
            .trim();

          const invoiceNo = String(
            invoice.invoiceNo || ""
          ).toLowerCase();

          const partyName = String(
            invoice.partyName || ""
          ).toLowerCase();

          if (
            !invoiceNo.includes(searchText) &&
            !partyName.includes(searchText)
          ) {
            return false;
          }
        }

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0) -
          new Date(a.createdAt || a.date || 0)
      );
  }, [
    invoices,
    selectedParty,
    statusFilter,
    search,
  ]);

  // ======================================================
  // TOTALS
  // ======================================================

  // const totalSales = useMemo(() => {
  //   return filteredInvoices.reduce(
  //     (sum, invoice) =>
  //       sum +
  //       Number(
  //         invoice.roundedTotal ??
  //         invoice.grandTotal ??
  //         0
  //       ),
  //     0
  //   );
  // }, [filteredInvoices]);

  // const totalReceived = useMemo(() => {
  //   return filteredInvoices.reduce(
  //     (sum, invoice) =>
  //       sum + Number(invoice.paidAmount || 0),
  //     0
  //   );
  // }, [filteredInvoices]);

  // const totalOutstanding = useMemo(() => {
  //   return filteredInvoices.reduce(
  //     (sum, invoice) =>
  //       sum + Number(invoice.pendingAmount || 0),
  //     0
  //   );
  // }, [filteredInvoices]);

  // const totalInvoices = filteredInvoices.length;

  // const paidInvoices = filteredInvoices.filter(
  //   (invoice) =>
  //     invoice.paymentStatus === "PAID"
  // ).length;

  // const partialInvoices = filteredInvoices.filter(
  //   (invoice) =>
  //     invoice.paymentStatus === "PARTIAL"
  // ).length;

  // const unpaidInvoices = filteredInvoices.filter(
  //   (invoice) =>
  //     invoice.paymentStatus === "UNPAID"
  // ).length;

  // ======================================================
  // TOTALS
  // ======================================================

  // ALL NORMAL INVOICES
  const normalInvoices = useMemo(() => {
    return invoices.filter(
      (invoice) =>
        invoice.invoiceType === "NORMAL" ||
        !invoice.invoiceType
    );
  }, [invoices]);

  // ALL GST INVOICES
  const gstInvoices = useMemo(() => {
    return invoices.filter(
      (invoice) =>
        invoice.invoiceType === "GST"
    );
  }, [invoices]);

  // NORMAL INVOICE TOTAL
  const normalInvoiceTotal = useMemo(() => {
    return normalInvoices.reduce(
      (sum, invoice) =>
        sum +
        Number(
          invoice.roundedTotal ??
          invoice.grandTotal ??
          0
        ),
      0
    );
  }, [normalInvoices]);

  // GST INVOICE TOTAL
  const gstInvoiceTotal = useMemo(() => {
    return gstInvoices.reduce(
      (sum, invoice) =>
        sum +
        Number(
          invoice.roundedTotal ??
          invoice.grandTotal ??
          0
        ),
      0
    );
  }, [gstInvoices]);

  // COUNTS
  const normalInvoiceCount =
    normalInvoices.length;

  const gstInvoiceCount =
    gstInvoices.length;


  // CURRENT FILTERED TOTALS
  const totalSales = useMemo(() => {
    return filteredInvoices.reduce(
      (sum, invoice) =>
        sum +
        Number(
          invoice.roundedTotal ??
          invoice.grandTotal ??
          0
        ),
      0
    );
  }, [filteredInvoices]);

  const totalReceived = useMemo(() => {
    return filteredInvoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.paidAmount || 0),
      0
    );
  }, [filteredInvoices]);

  const totalOutstanding = useMemo(() => {
    return filteredInvoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.pendingAmount || 0),
      0
    );
  }, [filteredInvoices]);

  const totalInvoices =
    filteredInvoices.length;

  const paidInvoices =
    filteredInvoices.filter(
      (invoice) =>
        invoice.paymentStatus === "PAID"
    ).length;

  const partialInvoices =
    filteredInvoices.filter(
      (invoice) =>
        invoice.paymentStatus === "PARTIAL"
    ).length;

  const unpaidInvoices =
    filteredInvoices.filter(
      (invoice) =>
        invoice.paymentStatus === "UNPAID"
    ).length;

  // ======================================================
  // HELPERS
  // ======================================================

  const formatCurrency = (amount) => {
    return `₹ ${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700 border border-green-200";

      case "PARTIAL":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";

      case "UNPAID":
      default:
        return "bg-red-100 text-red-700 border border-red-200";
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-3 md:p-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-[#2F9CAF] text-white flex items-center justify-center shadow-sm">
              <FaFileInvoiceDollar size={22} />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Invoice History
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Manage invoices, payments and outstanding amounts
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          onClick={fetchAllData}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
          <FaSyncAlt
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>


      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"> */}

      {/* TOTAL SALES */}

      {/* <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Total Invoice Amount
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {formatCurrency(totalSales)}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            {totalInvoices} invoice
            {totalInvoices !== 1 ? "s" : ""}
          </p>
        </div> */}


      {/* RECEIVED */}

      {/* <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Total Received
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {formatCurrency(totalReceived)}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Payments received
          </p>
        </div> */}


      {/* OUTSTANDING */}

      {/* <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Total Outstanding
          </p>

          <h2 className="text-2xl font-bold text-red-600 mt-2">
            {formatCurrency(totalOutstanding)}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Pending customer amount
          </p>
        </div> */}


      {/* INVOICE COUNT */}

      {/* <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Invoice Status
          </p>

          <div className="flex flex-wrap gap-2 mt-3">

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              Paid {paidInvoices}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
              Partial {partialInvoices}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              Unpaid {unpaidInvoices}
            </span>

          </div>
        </div>

      </div> */}

      {/* ==================================================
    SUMMARY CARDS
================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        {/* NORMAL INVOICES */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                NORMAL Invoice Total
              </p>

              <h2 className="text-2xl font-bold text-blue-700 mt-2">
                {formatCurrency(normalInvoiceTotal)}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                {normalInvoiceCount} invoice
                {normalInvoiceCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              N
            </div>
          </div>

          <div className="mt-4 text-xs font-semibold text-blue-600">
            INV-217, INV-218, INV-248, INV-249...
          </div>
        </div>


        {/* GST INVOICES */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                GST Invoice Total
              </p>

              <h2 className="text-2xl font-bold text-purple-700 mt-2">
                {formatCurrency(gstInvoiceTotal)}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                {gstInvoiceCount} invoice
                {gstInvoiceCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              G
            </div>
          </div>

          <div className="mt-4 text-xs font-semibold text-purple-600">
            INV-28, INV-29...
          </div>
        </div>


        {/* RECEIVED */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">

          <p className="text-sm text-gray-500">
            Total Received
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {formatCurrency(totalReceived)}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Payments received
          </p>

        </div>


        {/* OUTSTANDING */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">

          <p className="text-sm text-gray-500">
            Total Outstanding
          </p>

          <h2 className="text-2xl font-bold text-red-600 mt-2">
            {formatCurrency(totalOutstanding)}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Pending customer amount
          </p>

        </div>

      </div>


      {/* PAYMENT STATUS */}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div>
            <p className="text-sm text-gray-500">
              Invoice Status
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Based on current filters
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <span className="px-4 py-2 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              Paid {paidInvoices}
            </span>

            <span className="px-4 py-2 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
              Partial {partialInvoices}
            </span>

            <span className="px-4 py-2 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              Unpaid {unpaidInvoices}
            </span>

            <span className="px-4 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              Total {totalInvoices}
            </span>

          </div>

        </div>

      </div>


      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* SEARCH */}

          <div className="xl:col-span-2">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Invoice / Party
            </label>

            <div className="relative">

              <FaSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search invoice number or party..."
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#2F9CAF]/30 focus:border-[#2F9CAF]"
              />

            </div>

          </div>


          {/* PARTY */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Party
            </label>

            <select
              value={selectedParty}
              onChange={(e) =>
                setSelectedParty(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2F9CAF]/30 focus:border-[#2F9CAF]"
            >

              <option value="">
                All Parties
              </option>

              {[...parties]
                .sort((a, b) =>
                  (a.name || "").localeCompare(
                    b.name || ""
                  )
                )
                .map((party) => (
                  <option
                    key={party._id}
                    value={party.name}
                  >
                    {party.name}
                  </option>
                ))}

            </select>

          </div>


          {/* STATUS */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2F9CAF]/30 focus:border-[#2F9CAF]"
            >

              <option value="">
                All Status
              </option>

              <option value="PAID">
                Paid
              </option>

              <option value="PARTIAL">
                Partial
              </option>

              <option value="UNPAID">
                Unpaid
              </option>

            </select>

          </div>

        </div>

      </div>


      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              All Invoices
            </h2>

            <p className="text-sm text-gray-500">
              Showing {filteredInvoices.length} invoice
              {filteredInvoices.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="min-w-[1250px] w-full">

            <thead>

              <tr className="bg-black text-white">

                <th className="text-center p-4">
                  No.
                </th>

                <th className="text-left p-4">
                  Invoice No
                </th>

                <th className="text-left p-4">
                  Party Name
                </th>

                <th className="text-left p-4">
                  Date
                </th>

                <th className="text-right p-4">
                  Invoice Amount
                </th>

                <th className="text-right p-4">
                  Paid
                </th>

                <th className="text-right p-4">
                  Outstanding
                </th>

                <th className="text-center p-4">
                  Status
                </th>

                <th className="text-center p-4">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredInvoices.map(
                (invoice, index) => {

                  const invoiceAmount = Number(
                    invoice.roundedTotal ??
                    invoice.grandTotal ??
                    0
                  );

                  const paidAmount = Number(
                    invoice.paidAmount || 0
                  );

                  const pendingAmount = Number(
                    invoice.pendingAmount ??
                    Math.max(
                      invoiceAmount -
                      paidAmount,
                      0
                    )
                  );

                  return (
                    <tr
                      key={invoice._id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >

                      {/* NO */}

                      <td className="p-4 text-center font-semibold text-gray-500">
                        {index + 1}
                      </td>


                      {/* INVOICE */}

                      <td className="p-4 font-bold text-gray-900">
                        {invoice.invoiceNo || "-"}
                      </td>


                      {/* PARTY */}

                      <td className="p-4">

                        <div className="font-semibold text-gray-900">
                          {invoice.partyName || "-"}
                        </div>

                      </td>


                      {/* DATE */}

                      <td className="p-4 text-gray-600">
                        {formatDate(
                          invoice.date ||
                          invoice.createdAt
                        )}
                      </td>


                      {/* INVOICE AMOUNT */}

                      <td className="p-4 text-right font-bold text-gray-900">
                        {formatCurrency(
                          invoiceAmount
                        )}
                      </td>


                      {/* PAID */}

                      <td className="p-4 text-right font-semibold text-green-600">
                        {formatCurrency(
                          paidAmount
                        )}
                      </td>


                      {/* OUTSTANDING */}

                      <td className="p-4 text-right font-bold text-red-600">
                        {formatCurrency(
                          pendingAmount
                        )}
                      </td>


                      {/* STATUS */}

                      <td className="p-4 text-center">

                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${getStatusClass(
                            invoice.paymentStatus
                          )}`}
                        >
                          {invoice.paymentStatus ||
                            "UNPAID"}
                        </span>

                      </td>


                      {/* ACTION */}

                      <td className="p-4">

                        <div className="flex items-center justify-center gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            title="View Invoice"
                            aria-label="View Invoice"
                            onClick={() =>
                              navigate(
                                `/invoice-print/${invoice._id}`
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#2F9CAF] text-white hover:bg-[#25899b] transition"
                          >
                            <FaEye />
                          </button>


                          {/* EDIT */}

                          <button
                            type="button"
                            title="Edit Invoice"
                            aria-label="Edit Invoice"
                            onClick={() =>
                              navigate(
                                `/edit-invoice/${invoice._id}`
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
                          >
                            <FaEdit />
                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            title="Delete Invoice"
                            aria-label="Delete Invoice"
                            onClick={() =>
                              handleDelete(
                                invoice._id
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}


              {/* EMPTY */}

              {filteredInvoices.length === 0 && (

                <tr>

                  <td
                    colSpan="9"
                    className="text-center p-12 text-gray-500"
                  >

                    <div className="text-4xl mb-3">
                      📄
                    </div>

                    <p className="font-semibold">
                      No invoices found
                    </p>

                    <p className="text-sm mt-1">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==================================================
          FOOTER SUMMARY
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

          <p className="text-sm text-gray-500">
            Invoice Amount
          </p>

          <p className="text-xl font-bold mt-1">
            {formatCurrency(totalSales)}
          </p>

        </div>


        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

          <p className="text-sm text-gray-500">
            Amount Received
          </p>

          <p className="text-xl font-bold text-green-600 mt-1">
            {formatCurrency(totalReceived)}
          </p>

        </div>


        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

          <p className="text-sm text-gray-500">
            Amount Outstanding
          </p>

          <p className="text-xl font-bold text-red-600 mt-1">
            {formatCurrency(totalOutstanding)}
          </p>

        </div>

      </div>

    </div>
  );
}

export default InvoiceHistory;