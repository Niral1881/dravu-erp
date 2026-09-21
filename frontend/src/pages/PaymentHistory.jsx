// import { useCallback, useEffect, useState } from "react";
// import axios from "axios";

// function PaymentHistory() {
//   const API = import.meta.env.VITE_API_URL;

//   const [payments, setPayments] = useState([]);
//   const [editingPayment, setEditingPayment] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchPayments = useCallback(async () => {
//     try {
//       const res = await axios.get(`${API}/payments`);
//       setPayments(res.data);
//     } catch (error) {
//       console.error("FETCH PAYMENTS ERROR:", error);
//       alert("Failed to load payments");
//     }
//   }, [API]);

//   useEffect(() => {

//     const loadProducts = async () => {
//       await fetchPayments();
//     };

//     loadProducts();

//   }, []);

//   // DELETE PAYMENT
//   const handleDelete = async (id) => {
//     if (!id) {
//       alert("Payment ID is missing");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete this payment?")) {
//       return;
//     }

//     try {
//       await axios.delete(`${API}/payments/${id}`);

//       setPayments((previousPayments) =>
//         previousPayments.filter((payment) => payment._id !== id)
//       );

//       alert("Payment deleted successfully");
//     } catch (error) {
//       console.error("DELETE PAYMENT ERROR:", error);

//       alert(
//         `Delete failed\nStatus: ${error.response?.status || "No response"
//         }\nURL: ${error.config?.url || "Unknown URL"
//         }\nMessage: ${error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message
//         }`
//       );
//     }
//   }; // IMPORTANT: THIS WAS MISSING

//   // OPEN EDIT FORM
//   const handleEdit = (payment) => {
//     setEditingPayment({
//       ...payment,
//       paymentDate: payment.paymentDate
//         ? new Date(payment.paymentDate).toISOString().split("T")[0]
//         : "",
//       amount: payment.amount || "",
//       paymentMode: payment.paymentMode || "",
//       note: payment.note || "",
//     });
//   };

//   // UPDATE PAYMENT
//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     if (!editingPayment?._id) {
//       alert("Payment ID is missing");
//       return;
//     }

//     setLoading(true);

//     try {
//       const id = editingPayment._id;

//       const updatedData = {
//         paymentDate: editingPayment.paymentDate,
//         amount: Number(editingPayment.amount),
//         paymentMode: editingPayment.paymentMode,
//         note: editingPayment.note,
//       };

//       const res = await axios.put(`${API}/payments/${id}`, updatedData);

//       setPayments((previousPayments) =>
//         previousPayments.map((payment) =>
//           payment._id === id ? res.data : payment
//         )
//       );

//       setEditingPayment(null);
//       alert("Payment updated successfully");
//     } catch (error) {
//       console.error("UPDATE PAYMENT ERROR:", error);

//       alert(
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         "Failed to update payment"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-3 md:p-6">

//       {/* HEADER */}
//       <div className="mb-6">
//         <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
//           Payment History
//         </h1>

//         <p className="text-gray-500">
//           View all payment records
//         </p>
//       </div>

//       {/* EDIT PAYMENT FORM */}
//       {editingPayment && (
//         <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">

//           <h2 className="text-xl font-bold text-[#2E3A3F] mb-4">
//             Edit Payment
//           </h2>

//           <form
//             onSubmit={handleUpdate}
//             className="grid grid-cols-1 md:grid-cols-2 gap-4"
//           >

//             {/* PARTY NAME - READ ONLY */}
//             <div>
//               <label className="block mb-1 font-medium">
//                 Party Name
//               </label>

//               <input
//                 type="text"
//                 value={editingPayment.partyName || ""}
//                 disabled
//                 className="w-full border rounded-lg p-3 bg-gray-100"
//               />
//             </div>

//             {/* INVOICE NO - READ ONLY */}
//             <div>
//               <label className="block mb-1 font-medium">
//                 Invoice No
//               </label>

//               <input
//                 type="text"
//                 value={editingPayment.invoiceNo || ""}
//                 disabled
//                 className="w-full border rounded-lg p-3 bg-gray-100"
//               />
//             </div>

//             {/* DATE */}
//             <div>
//               <label className="block mb-1 font-medium">
//                 Payment Date
//               </label>

//               <input
//                 type="date"
//                 value={editingPayment.paymentDate}
//                 onChange={(e) =>
//                   setEditingPayment({
//                     ...editingPayment,
//                     paymentDate: e.target.value,
//                   })
//                 }
//                 required
//                 className="w-full border rounded-lg p-3"
//               />
//             </div>

//             {/* AMOUNT */}
//             <div>
//               <label className="block mb-1 font-medium">
//                 Amount
//               </label>

//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={editingPayment.amount}
//                 onChange={(e) =>
//                   setEditingPayment({
//                     ...editingPayment,
//                     amount: e.target.value,
//                   })
//                 }
//                 required
//                 className="w-full border rounded-lg p-3"
//               />
//             </div>

//             {/* PAYMENT MODE */}
//             <div>
//               <label className="block mb-1 font-medium">
//                 Payment Mode
//               </label>

//               <select
//                 value={editingPayment.paymentMode}
//                 onChange={(e) =>
//                   setEditingPayment({
//                     ...editingPayment,
//                     paymentMode: e.target.value,
//                   })
//                 }
//                 required
//                 className="w-full border rounded-lg p-3"
//               >
//                 <option value="">Select Mode</option>
//                 <option value="CASH">Cash</option>
//                 <option value="UPI">UPI</option>
//                 <option value="BANK TRANSFER">
//                   Bank Transfer
//                 </option>
//                 <option value="CHEQUE">Cheque</option>
//                 <option value="OTHER">Other</option>
//               </select>
//             </div>

//             {/* NOTE */}
//             <div>
//               <label className="block mb-1 font-medium">
//                 Note
//               </label>

//               <input
//                 type="text"
//                 value={editingPayment.note}
//                 onChange={(e) =>
//                   setEditingPayment({
//                     ...editingPayment,
//                     note: e.target.value,
//                   })
//                 }
//                 className="w-full border rounded-lg p-3"
//               />
//             </div>

//             {/* BUTTONS */}
//             <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-[#2F9CAF] text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
//               >
//                 {loading ? "Updating..." : "Update Payment"}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setEditingPayment(null)}
//                 className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold"
//               >
//                 Cancel
//               </button>

//             </div>

//           </form>
//         </div>
//       )}

//       {/* TABLE */}
//       <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

//         <table className="min-w-[1100px] w-full">

//           <thead className="bg-gray-100">
//             <tr>
//               <th className="text-left p-4">Date</th>
//               <th className="text-left p-4">Party</th>
//               <th className="text-left p-4">Invoice No</th>
//               <th className="text-left p-4">Amount</th>
//               <th className="text-left p-4">Mode</th>
//               <th className="text-left p-4">Note</th>
//               <th className="text-center p-4">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {payments.map((payment) => (
//               <tr
//                 key={payment._id}
//                 className="border-b hover:bg-gray-50"
//               >

//                 <td className="p-4">
//                   {new Date(
//                     payment.paymentDate
//                   ).toLocaleDateString("en-GB")}
//                 </td>

//                 <td className="p-4 font-medium">
//                   {payment.partyName}
//                 </td>

//                 <td className="p-4">
//                   {payment.invoiceNo}
//                 </td>

//                 <td className="p-4 text-green-600 font-bold">
//                   ₹ {Number(payment.amount || 0).toFixed(2)}
//                 </td>

//                 <td className="p-4">
//                   <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
//                     {payment.paymentMode}
//                   </span>
//                 </td>

//                 <td className="p-4">
//                   {payment.note || "-"}
//                 </td>

//                 {/* ACTION BUTTONS */}
//                 <td className="p-4">
//                   <div className="flex justify-center gap-2">

//                     <button
//                       onClick={() => handleEdit(payment)}
//                       className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleDelete(payment._id)}
//                       className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
//                     >
//                       Delete
//                     </button>

//                   </div>
//                 </td>

//               </tr>
//             ))}
//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }


// export default PaymentHistory;



import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

function PaymentHistory() {
  const API = import.meta.env.VITE_API_URL;

  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("ALL");

  /* =========================================================
     FETCH PAYMENTS
  ========================================================= */

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/payments`);

      setPayments(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "FETCH PAYMENTS ERROR:",
        error
      );

      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [API]);

  // useEffect(() => {

  //   const loadProducts = async () => {
  //     await fetchPayments();
  //   };

  //   loadProducts();

  // }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const money = (value) =>
    `₹ ${Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "-";
    }

    return d.toLocaleDateString("en-GB");
  };

  /* =========================================================
     DELETE PAYMENT
  ========================================================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) {
      return;
    }

    try {
      setLoading(true);

      await axios.delete(`${API}/payments/${id}`);

      // Reload payments from database
      await fetchPayments();

      alert("Payment deleted successfully");

    } catch (error) {
      console.error("Delete payment error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete payment"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const handleEdit = (payment) => {
    setEditingPayment({
      ...payment,

      paymentDate: payment.paymentDate
        ? new Date(payment.paymentDate)
          .toISOString()
          .split("T")[0]
        : "",

      amount: payment.amount || "",

      paymentMode:
        payment.paymentMode || "",

      note: payment.note || "",
    });
  };

  /* =========================================================
     UPDATE PAYMENT
  ========================================================= */

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingPayment?._id) {
      alert("Payment ID is missing");
      return;
    }

    if (
      !editingPayment.amount ||
      Number(editingPayment.amount) <= 0
    ) {
      alert("Enter a valid payment amount");
      return;
    }

    if (!editingPayment.paymentMode) {
      alert("Please select payment mode");
      return;
    }

    setLoading(true);

    try {
      const id = editingPayment._id;

      const updatedData = {
        paymentDate:
          editingPayment.paymentDate,

        amount: Number(
          editingPayment.amount
        ),

        paymentMode:
          editingPayment.paymentMode,

        note: editingPayment.note,
      };

      const res = await axios.put(
        `${API}/payments/${id}`,
        updatedData
      );

      setPayments((previousPayments) =>
        previousPayments.map(
          (payment) =>
            payment._id === id
              ? res.data
              : payment
        )
      );

      setEditingPayment(null);

      alert("Payment updated successfully");
    } catch (error) {
      console.error(
        "UPDATE PAYMENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update payment"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     TODAY TOTAL
  ========================================================= */

  const todayTotal = payments
    .filter((payment) => {
      if (!payment.paymentDate) {
        return false;
      }

      const paymentDate =
        new Date(
          payment.paymentDate
        );

      const today = new Date();

      return (
        paymentDate.toDateString() ===
        today.toDateString()
      );
    })
    .reduce(
      (sum, payment) =>
        sum +
        Number(payment.amount || 0),
      0
    );

  /* =========================================================
     TOTAL RECEIVED
  ========================================================= */

  const totalReceived = payments.reduce(
    (sum, payment) =>
      sum +
      Number(payment.amount || 0),
    0
  );

  /* =========================================================
     PAYMENT MODES
  ========================================================= */

  const paymentModes = [
    ...new Set(
      payments
        .map(
          (payment) =>
            payment.paymentMode
        )
        .filter(Boolean)
    ),
  ];

  /* =========================================================
     FILTER PAYMENTS
  ========================================================= */

  const filteredPayments = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return payments.filter(
      (payment) => {
        const party =
          payment.partyName
            ?.toLowerCase() || "";

        const invoice =
          payment.invoiceNo
            ?.toLowerCase() || "";

        const note =
          payment.note
            ?.toLowerCase() || "";

        const mode =
          payment.paymentMode
            ?.toLowerCase() || "";

        const matchesSearch =
          !searchText ||
          party.includes(searchText) ||
          invoice.includes(searchText) ||
          note.includes(searchText) ||
          mode.includes(searchText);

        const matchesMode =
          modeFilter === "ALL" ||
          payment.paymentMode ===
          modeFilter;

        return (
          matchesSearch &&
          matchesMode
        );
      }
    );
  }, [
    payments,
    search,
    modeFilter,
  ]);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#f5f7f9] p-4 md:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-[#2F9CAF] flex items-center justify-center text-white text-xl font-bold shadow-sm">
            ₹
          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#263238]">
              Payment History
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View, edit and manage all payment transactions
            </p>

          </div>

        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm disabled:opacity-50"
        >
          ↻ Refresh
        </button>

      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        {/* TOTAL */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Received
              </p>

              <h2 className="text-2xl font-bold text-[#263238] mt-2">
                {money(totalReceived)}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                All payment transactions
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
              ✓
            </div>

          </div>

        </div>

        {/* TODAY */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Today's Collection
              </p>

              <h2 className="text-2xl font-bold text-[#263238] mt-2">
                {money(todayTotal)}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Payments received today
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-[#2F9CAF]/10 text-[#2F9CAF] flex items-center justify-center text-xl">
              ₹
            </div>

          </div>

        </div>

        {/* ENTRIES */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Payment Entries
              </p>

              <h2 className="text-2xl font-bold text-[#263238] mt-2">
                {payments.length}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                {filteredPayments.length} currently displayed
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
              #
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH */}

          <div className="md:col-span-2">

            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Search Payment
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search party, invoice, mode or note..."
                className="w-full border border-gray-200 rounded-xl p-3 pl-11 outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
              />

            </div>

          </div>

          {/* MODE */}

          <div>

            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Payment Mode
            </label>

            <select
              value={modeFilter}
              onChange={(e) =>
                setModeFilter(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl p-3 bg-white outline-none focus:border-[#2F9CAF]"
            >

              <option value="ALL">
                All Payment Modes
              </option>

              {paymentModes.map(
                (mode) => (
                  <option
                    key={mode}
                    value={mode}
                  >
                    {mode}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

      </div>

      {/* =====================================================
          EDIT PAYMENT
      ===================================================== */}

      {editingPayment && (

        <div className="bg-white rounded-2xl border border-[#2F9CAF]/20 shadow-sm mb-6 overflow-hidden">

          <div className="p-5 border-b border-gray-100 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-[#263238]">
                Edit Payment
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Update payment transaction details
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setEditingPayment(null)
              }
              className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500"
            >
              ✕
            </button>

          </div>

          <form
            onSubmit={handleUpdate}
            className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* PARTY */}

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Party Name
              </label>

              <input
                type="text"
                value={
                  editingPayment.partyName ||
                  ""
                }
                disabled
                className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100 text-gray-500"
              />

            </div>

            {/* INVOICE */}

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Invoice No
              </label>

              <input
                type="text"
                value={
                  editingPayment.invoiceNo ||
                  ""
                }
                disabled
                className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100 text-gray-500"
              />

            </div>

            {/* DATE */}

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Payment Date
              </label>

              <input
                type="date"
                value={
                  editingPayment.paymentDate ||
                  ""
                }
                onChange={(e) =>
                  setEditingPayment({
                    ...editingPayment,
                    paymentDate:
                      e.target.value,
                  })
                }
                required
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
              />

            </div>

            {/* AMOUNT */}

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Amount
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    editingPayment.amount
                  }
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      amount:
                        e.target.value,
                    })
                  }
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 pl-9 outline-none focus:border-[#2F9CAF]"
                />

              </div>

            </div>

            {/* MODE */}

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Payment Mode
              </label>

              <select
                value={
                  editingPayment.paymentMode
                }
                onChange={(e) =>
                  setEditingPayment({
                    ...editingPayment,
                    paymentMode:
                      e.target.value,
                  })
                }
                required
                className="w-full border border-gray-200 rounded-xl p-3 bg-white outline-none focus:border-[#2F9CAF]"
              >

                <option value="">
                  Select Mode
                </option>

                <option value="CASH">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="BANK TRANSFER">
                  Bank Transfer
                </option>

                <option value="CHEQUE">
                  Cheque
                </option>

                <option value="OTHER">
                  Other
                </option>

              </select>

            </div>

            {/* NOTE */}

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Note
              </label>

              <input
                type="text"
                value={
                  editingPayment.note || ""
                }
                onChange={(e) =>
                  setEditingPayment({
                    ...editingPayment,
                    note: e.target.value,
                  })
                }
                placeholder="Optional note"
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
              />

            </div>

            {/* BUTTONS */}

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={() =>
                  setEditingPayment(null)
                }
                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 rounded-xl bg-[#2F9CAF] text-white font-semibold hover:bg-[#238293] disabled:opacity-50"
              >
                {loading
                  ? "Updating..."
                  : "Update Payment"}
              </button>

            </div>

          </form>

        </div>

      )}

      {/* =====================================================
          PAYMENT TABLE
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div>

            <h2 className="text-lg font-bold text-[#263238]">
              Payment Transactions
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Complete payment transaction history
            </p>

          </div>

          <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
            {filteredPayments.length} Records
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-[1050px] w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-center p-4 text-xs font-bold text-gray-500 uppercase">
                  No.
                </th>

                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">
                  Date
                </th>

                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">
                  Party
                </th>

                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">
                  Invoice
                </th>

                <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase">
                  Amount
                </th>

                <th className="text-center p-4 text-xs font-bold text-gray-500 uppercase">
                  Mode
                </th>

                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">
                  Note
                </th>

                <th className="text-center p-4 text-xs font-bold text-gray-500 uppercase">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPayments.map(
                (payment, index) => (

                  <tr
                    key={
                      payment._id ||
                      index
                    }
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >

                    {/* NO */}

                    <td className="p-4 text-center">

                      <span className="inline-flex w-7 h-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                        {index + 1}
                      </span>

                    </td>

                    {/* DATE */}

                    <td className="p-4 text-sm text-gray-600">
                      {formatDate(
                        payment.paymentDate
                      )}
                    </td>

                    {/* PARTY */}

                    <td className="p-4">

                      <div className="font-semibold text-gray-700">
                        {payment.partyName ||
                          "-"}
                      </div>

                    </td>

                    {/* INVOICE */}

                    <td className="p-4">

                      <span className="font-bold text-[#2F9CAF]">
                        {payment.invoiceNo ||
                          "-"}
                      </span>

                    </td>

                    {/* AMOUNT */}

                    <td className="p-4 text-right">

                      <span className="font-bold text-green-600">
                        {money(
                          payment.amount
                        )}
                      </span>

                    </td>

                    {/* MODE */}

                    <td className="p-4 text-center">

                      <span className="inline-flex px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                        {payment.paymentMode ||
                          "-"}
                      </span>

                    </td>

                    {/* NOTE */}

                    <td className="p-4 text-sm text-gray-500 max-w-[220px] truncate">
                      {payment.note ||
                        "-"}
                    </td>

                    {/* ACTION */}

                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            handleEdit(
                              payment
                            )
                          }
                          className="px-3 py-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 font-semibold text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              payment._id
                            )
                          }
                          className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

              {filteredPayments.length ===
                0 && (

                  <tr>

                    <td
                      colSpan="8"
                      className="p-14 text-center"
                    >

                      <div className="text-4xl mb-3">
                        💳
                      </div>

                      <p className="font-semibold text-gray-600">
                        No payments found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try changing your search or payment mode filter.
                      </p>

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

export default PaymentHistory;