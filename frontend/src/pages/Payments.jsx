// import { useEffect, useState } from "react";
// import axios from "axios";

// function Payments() {

//   const API = import.meta.env.VITE_API_URL;

//   const [parties, setParties] =
//     useState([]);

//   const [payments, setPayments] = useState([]);

//   const [invoices, setInvoices] =
//     useState([]);

//   const [partyName, setPartyName] =
//     useState("");

//   const [invoiceNo, setInvoiceNo] =
//     useState("");

//   const [amount, setAmount] =
//     useState("");

//   const [paymentMode, setPaymentMode] =
//     useState("Cash");

//   const [paymentDate, setPaymentDate] =
//     useState(
//       new Date()
//         .toISOString()
//         .split("T")[0]
//     );

//   const [note, setNote] =
//     useState("");



//   const fetchData = async () => {
//     try {
//       const [partyRes, invoiceRes, paymentRes] = await Promise.all([
//         axios.get(`${API}/parties`),
//         axios.get(`${API}/invoices`),
//         axios.get(`${API}/payments`),
//       ]);

//       setParties(partyRes.data || []);
//       setInvoices(invoiceRes.data || []);
//       setPayments(paymentRes.data || []);
//     } catch (error) {
//       console.error("FETCH PAYMENT DATA ERROR:", error);
//     }
//   };

//   useEffect(() => {

//     const loadProducts = async () => {
//       await fetchData();
//     };

//     loadProducts();

//   }, []);

//   const selectedInvoices = invoices.filter(
//     (invoice) => invoice.partyName === partyName
//   );

//   const selectedInvoice = invoices.find(
//     (invoice) =>
//       invoice.invoiceNo === invoiceNo &&
//       invoice.partyName === partyName
//   );

//   const invoiceTotal = Number(
//     selectedInvoice?.roundedTotal ??
//     selectedInvoice?.grandTotal ??
//     0
//   );

//   const paidAmount = payments
//     .filter((payment) => {
//       const sameInvoice =
//         payment.invoiceId &&
//         selectedInvoice?._id &&
//         String(payment.invoiceId) === String(selectedInvoice._id);

//       const sameInvoiceNumber =
//         payment.invoiceNo === selectedInvoice?.invoiceNo &&
//         payment.partyName === selectedInvoice?.partyName;

//       return sameInvoice || sameInvoiceNumber;
//     })
//     .reduce(
//       (total, payment) => total + Number(payment.amount || 0),
//       0
//     );

//   const pendingAmount = Math.max(invoiceTotal - paidAmount, 0);

//   const handleSavePayment = async () => {
//     if (!partyName || !invoiceNo || !amount || Number(amount) <= 0) {
//       alert("Please select party, invoice and enter valid amount");
//       return;
//     }

//     try {
//       const paymentData = {
//         partyName,
//         invoiceNo,
//         invoiceId: selectedInvoice?._id,
//         amount: Number(amount),
//         paymentMode,
//         paymentDate,
//         note,
//       };

//       await axios.post(`${API}/payments`, paymentData);

//       // Refresh invoices after payment save
//       await fetchData();

//       alert("Payment Added Successfully");

//       setAmount("");
//       setNote("");
//       setInvoiceNo("");
//       setPaymentMode("Cash");
//     } catch (error) {
//       console.error("PAYMENT SAVE ERROR:", error);
//       alert(
//         error.response?.data?.message || "Payment Save Failed"
//       );
//     }
//   };

//   return (

//     <div className="p-3 md:p-6">

//       {/* Header */}
//       <div className="mb-6">

//         <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
//           Add Payment
//         </h1>

//         <p className="text-gray-500">
//           Record party payments
//         </p>

//       </div>

//       {/* Form */}
//       <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">

//         {/* Party */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Party Name
//           </label>

//           <select

//             className="w-full border border-gray-200 rounded-xl p-3 bg-white"
//             value={partyName}
//             onChange={(e) => {

//               setPartyName(
//                 e.target.value
//               );

//               setInvoiceNo("");
//             }}
//           >

//             <option value="">
//               Select Party
//             </option>

//             {parties
//               .sort((a, b) =>
//                 a.name.localeCompare(b.name)
//               )
//               .map((party) => (
//                 <option
//                   key={party._id}
//                   value={party.name}
//                 >
//                   {party.name}
//                 </option>

//               ))}

//           </select>

//         </div>

//         {/* Invoice */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Invoice No
//           </label>

//           <select
//             value={invoiceNo}
//             onChange={(e) =>
//               setInvoiceNo(
//                 e.target.value
//               )
//             }
//             className="w-full border border-gray-200 rounded-xl p-3"
//           >

//             <option value="">
//               Select Invoice
//             </option>

//             {selectedInvoices.map(
//               (invoice) => (

//                 <option
//                   key={invoice._id}
//                   value={
//                     invoice.invoiceNo
//                   }
//                 >
//                   {
//                     invoice.invoiceNo
//                   }
//                 </option>
//               )
//             )}

//           </select>

//           <p>
//             <span className="font-semibold">
//               Paid Amount :
//             </span>

//             ₹ {paidAmount.toFixed(2)}
//           </p>

//           <p>
//             <span className="font-semibold">
//               Pending Amount :
//             </span>

//             ₹ {pendingAmount.toFixed(2)}
//           </p>

//         </div>

//         {/* Amount */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Amount
//           </label>

//           <input
//             type="number"
//             value={amount}
//             onChange={(e) =>
//               setAmount(
//                 e.target.value
//               )
//             }
//             className="w-full border border-gray-200 rounded-xl p-3"
//           />

//         </div>

//         {/* Payment Mode */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Payment Mode
//           </label>

//           <select
//             value={paymentMode}
//             onChange={(e) =>
//               setPaymentMode(
//                 e.target.value
//               )
//             }
//             className="w-full border border-gray-200 rounded-xl p-3"
//           >

//             <option>
//               Cash
//             </option>

//             <option>
//               UPI
//             </option>

//             <option>
//               Bank Transfer
//             </option>

//             <option>
//               Cheque
//             </option>

//           </select>

//         </div>

//         {/* Date */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Payment Date
//           </label>

//           <input
//             type="date"
//             value={paymentDate}
//             onChange={(e) =>
//               setPaymentDate(
//                 e.target.value
//               )
//             }
//             className="w-full border border-gray-200 rounded-xl p-3"
//           />

//         </div>

//         {/* Note */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Note
//           </label>

//           <input
//             type="text"
//             value={note}
//             onChange={(e) =>
//               setNote(
//                 e.target.value
//               )
//             }
//             className="w-full border border-gray-200 rounded-xl p-3"
//           />

//         </div>

//       </div>

//       {/* Invoice Details */}
//       {selectedInvoice && (

//         <div className="bg-white mt-6 p-5 rounded-2xl shadow-sm">

//           <h2 className="text-xl font-bold mb-4">
//             Invoice Details
//           </h2>

//           <div className="space-y-2">

//             <p>
//               <span className="font-semibold">
//                 Invoice No :
//               </span>

//               {" "}
//               {
//                 selectedInvoice.invoiceNo
//               }
//             </p>

//             <p>
//               <span className="font-semibold">
//                 Grand Total :
//               </span>

//               {" "}
//               ₹ {
//                 (
//                   selectedInvoice.roundedTotal ||
//                   selectedInvoice.grandTotal
//                 ).toFixed(2)
//               }
//             </p>

//           </div>

//         </div>

//       )}

//       {/* Save Button */}
//       <div className="mt-6">

//         <button
//           onClick={
//             handleSavePayment
//           }
//           className="bg-[#2F9CAF] text-white px-6 py-3 rounded-xl hover:bg-[#238293]"
//         >
//           Save Payment
//         </button>

//       </div>

//     </div>
//   );
// }

// export default Payments;


import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Payments() {
  const API = import.meta.env.VITE_API_URL;

  const [parties, setParties] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [partyName, setPartyName] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");

  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================================================
     FETCH DATA
  ========================================================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const [partyRes, invoiceRes, paymentRes] =
        await Promise.all([
          axios.get(`${API}/parties`),
          axios.get(`${API}/invoices`),
          axios.get(`${API}/payments`),
        ]);

      setParties(
        Array.isArray(partyRes.data)
          ? partyRes.data
          : []
      );

      setInvoices(
        Array.isArray(invoiceRes.data)
          ? invoiceRes.data
          : []
      );

      setPayments(
        Array.isArray(paymentRes.data)
          ? paymentRes.data
          : []
      );
    } catch (error) {
      console.error(
        "FETCH PAYMENT DATA ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchData();
    };

    loadProducts();

  }, []);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const money = (value) =>
    `₹ ${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     SELECTED INVOICE
  ========================================================= */

  const selectedInvoices = useMemo(() => {
    return invoices.filter(
      (invoice) =>
        invoice.partyName === partyName
    );
  }, [invoices, partyName]);

  const selectedInvoice = useMemo(() => {
    return invoices.find(
      (invoice) =>
        invoice.invoiceNo === invoiceNo &&
        invoice.partyName === partyName
    );
  }, [
    invoices,
    invoiceNo,
    partyName,
  ]);

  const invoiceTotal = Number(
    selectedInvoice?.roundedTotal ??
    selectedInvoice?.grandTotal ??
    0
  );

  /* =========================================================
     PAID AMOUNT
  ========================================================= */

  const paidAmount = useMemo(() => {
    if (!selectedInvoice) return 0;

    return payments
      .filter((payment) => {
        const sameInvoice =
          payment.invoiceId &&
          selectedInvoice._id &&
          String(payment.invoiceId) ===
          String(selectedInvoice._id);

        const sameInvoiceNumber =
          payment.invoiceNo ===
          selectedInvoice.invoiceNo &&
          payment.partyName ===
          selectedInvoice.partyName;

        return (
          sameInvoice ||
          sameInvoiceNumber
        );
      })
      .reduce(
        (total, payment) =>
          total +
          Number(payment.amount || 0),
        0
      );
  }, [
    payments,
    selectedInvoice,
  ]);

  const pendingAmount = Math.max(
    invoiceTotal - paidAmount,
    0
  );

  /* =========================================================
     TOTAL PAYMENT
  ========================================================= */

  const totalPayments = payments.reduce(
    (total, payment) =>
      total +
      Number(payment.amount || 0),
    0
  );

  const todayPayments = payments
    .filter((payment) => {
      const paymentDateValue =
        payment.paymentDate ||
        payment.date ||
        payment.createdAt;

      if (!paymentDateValue) return false;

      const paymentDateObj =
        new Date(paymentDateValue);

      const today = new Date();

      return (
        paymentDateObj.toDateString() ===
        today.toDateString()
      );
    })
    .reduce(
      (total, payment) =>
        total +
        Number(payment.amount || 0),
      0
    );

  /* =========================================================
     SAVE PAYMENT
  ========================================================= */

  const handleSavePayment = async () => {
    if (
      !partyName ||
      !invoiceNo ||
      !amount ||
      Number(amount) <= 0
    ) {
      alert(
        "Please select party, invoice and enter valid amount"
      );
      return;
    }

    if (!selectedInvoice) {
      alert("Please select a valid invoice");
      return;
    }

    if (Number(amount) > pendingAmount) {
      alert(
        `Payment cannot be greater than pending amount ${money(
          pendingAmount
        )}`
      );
      return;
    }

    try {
      const paymentData = {
        partyName,
        invoiceNo,
        invoiceId: selectedInvoice?._id,
        amount: Number(amount),
        paymentMode,
        paymentDate,
        note,
      };

      await axios.post(
        `${API}/payments`,
        paymentData
      );

      await fetchData();

      alert("Payment Added Successfully");

      setAmount("");
      setNote("");
      setInvoiceNo("");
      setPaymentMode("Cash");
    } catch (error) {
      console.error(
        "PAYMENT SAVE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Payment Save Failed"
      );
    }
  };

  /* =========================================================
     PARTY CHANGE
  ========================================================= */

  const handlePartyChange = (value) => {
    setPartyName(value);
    setInvoiceNo("");
    setAmount("");
  };

  /* =========================================================
     INVOICE CHANGE
  ========================================================= */

  const handleInvoiceChange = (value) => {
    setInvoiceNo(value);
    setAmount("");
  };

  /* =========================================================
     PAYMENT MODE
  ========================================================= */

  const paymentModes = [
    {
      name: "Cash",
      icon: "💵",
    },
    {
      name: "UPI",
      icon: "📱",
    },
    {
      name: "Bank Transfer",
      icon: "🏦",
    },
    {
      name: "Cheque",
      icon: "🧾",
    },
  ];

  /* =========================================================
     PAYMENT HISTORY
  ========================================================= */

  const recentPayments = [...payments]
    .sort((a, b) => {
      const dateA = new Date(
        a.paymentDate ||
        a.date ||
        a.createdAt ||
        0
      ).getTime();

      const dateB = new Date(
        b.paymentDate ||
        b.date ||
        b.createdAt ||
        0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 8);

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

          <div className="w-12 h-12 rounded-xl bg-[#2F9CAF] flex items-center justify-center text-white text-xl shadow-sm">
            ₹
          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#263238]">
              Payments
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Record and manage party payments
            </p>

          </div>

        </div>

        <button
          onClick={fetchData}
          className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          ↻ Refresh
        </button>

      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Received
              </p>

              <h2 className="text-2xl font-bold text-[#263238] mt-2">
                {money(totalPayments)}
              </h2>

            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
              ✓
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Today's Collection
              </p>

              <h2 className="text-2xl font-bold text-[#263238] mt-2">
                {money(todayPayments)}
              </h2>

            </div>

            <div className="w-11 h-11 rounded-xl bg-[#2F9CAF]/10 text-[#2F9CAF] flex items-center justify-center text-xl">
              ₹
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Payment Entries
              </p>

              <h2 className="text-2xl font-bold text-[#263238] mt-2">
                {payments.length}
              </h2>

            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
              #
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          PAYMENT FORM + INVOICE SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* PAYMENT FORM */}

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">

          <div className="p-5 border-b border-gray-100">

            <h2 className="text-lg font-bold text-[#263238]">
              Add Payment
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Record a payment against an invoice
            </p>

          </div>

          <div className="p-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* PARTY */}

              <div>

                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Party Name
                </label>

                <select
                  value={partyName}
                  onChange={(e) =>
                    handlePartyChange(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 bg-white outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                >

                  <option value="">
                    Select Party
                  </option>

                  {[...parties]
                    .sort((a, b) =>
                      a.name.localeCompare(
                        b.name
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

              {/* INVOICE */}

              <div>

                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Invoice No
                </label>

                <select
                  value={invoiceNo}
                  onChange={(e) =>
                    handleInvoiceChange(
                      e.target.value
                    )
                  }
                  disabled={!partyName}
                  className="w-full border border-gray-200 rounded-xl p-3 bg-white outline-none focus:border-[#2F9CAF] disabled:bg-gray-50 disabled:text-gray-400"
                >

                  <option value="">
                    Select Invoice
                  </option>

                  {selectedInvoices.map(
                    (invoice) => (
                      <option
                        key={invoice._id}
                        value={
                          invoice.invoiceNo
                        }
                      >
                        {invoice.invoiceNo}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* AMOUNT */}

              <div>

                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Payment Amount
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    max={
                      pendingAmount > 0
                        ? pendingAmount
                        : undefined
                    }
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                    placeholder="Enter amount"
                    className="w-full border border-gray-200 rounded-xl p-3 pl-9 outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                  />

                </div>

                {selectedInvoice && (
                  <p className="text-xs text-gray-400 mt-2">
                    Maximum payment:{" "}
                    <span className="font-semibold text-gray-600">
                      {money(pendingAmount)}
                    </span>
                  </p>
                )}

              </div>

              {/* DATE */}

              <div>

                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Payment Date
                </label>

                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) =>
                    setPaymentDate(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                />

              </div>

              {/* PAYMENT MODE */}

              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-gray-600 mb-3">
                  Payment Mode
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  {paymentModes.map(
                    (mode) => (

                      <button
                        type="button"
                        key={mode.name}
                        onClick={() =>
                          setPaymentMode(
                            mode.name
                          )
                        }
                        className={`p-3 rounded-xl border text-left transition ${paymentMode ===
                          mode.name
                          ? "border-[#2F9CAF] bg-[#2F9CAF]/5 text-[#2F9CAF]"
                          : "border-gray-200 hover:bg-gray-50 text-gray-600"
                          }`}
                      >

                        <div className="text-lg mb-1">
                          {mode.icon}
                        </div>

                        <div className="text-sm font-semibold">
                          {mode.name}
                        </div>

                      </button>

                    )
                  )}

                </div>

              </div>

              {/* NOTE */}

              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Note
                </label>

                <input
                  type="text"
                  value={note}
                  onChange={(e) =>
                    setNote(e.target.value)
                  }
                  placeholder="Optional payment note"
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                />

              </div>

            </div>

            {/* SAVE */}

            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">

              <button
                onClick={handleSavePayment}
                disabled={loading}
                className="px-7 py-3 bg-[#2F9CAF] text-white rounded-xl font-semibold hover:bg-[#238293] disabled:opacity-50 shadow-sm"
              >
                {loading
                  ? "Saving..."
                  : "Save Payment"}
              </button>

            </div>

          </div>

        </div>

        {/* ===================================================
            INVOICE SUMMARY
        =================================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">

          <div className="p-5 border-b border-gray-100">

            <h2 className="text-lg font-bold text-[#263238]">
              Invoice Summary
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Payment status
            </p>

          </div>

          <div className="p-5">

            {!selectedInvoice ? (

              <div className="h-64 flex flex-col items-center justify-center text-center">

                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl mb-4">
                  ₹
                </div>

                <p className="font-semibold text-gray-600">
                  Select an invoice
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Invoice payment details will appear here
                </p>

              </div>

            ) : (

              <div>

                <div className="bg-[#f5f7f9] rounded-xl p-4 mb-5">

                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Invoice
                  </p>

                  <p className="text-xl font-bold text-[#2F9CAF] mt-1">
                    {selectedInvoice.invoiceNo}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {selectedInvoice.partyName}
                  </p>

                </div>

                <div className="space-y-4">

                  <div className="flex justify-between">

                    <span className="text-sm text-gray-500">
                      Invoice Total
                    </span>

                    <span className="font-bold text-gray-800">
                      {money(invoiceTotal)}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-sm text-gray-500">
                      Paid Amount
                    </span>

                    <span className="font-bold text-green-600">
                      {money(paidAmount)}
                    </span>

                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between">

                    <span className="text-sm font-semibold text-gray-600">
                      Pending Amount
                    </span>

                    <span className="text-xl font-bold text-red-500">
                      {money(pendingAmount)}
                    </span>

                  </div>

                </div>

                <div className="mt-6">

                  <div className="flex justify-between text-xs mb-2">

                    <span className="text-gray-400">
                      Payment Progress
                    </span>

                    <span className="font-bold text-gray-600">
                      {invoiceTotal > 0
                        ? Math.min(
                          100,
                          (paidAmount /
                            invoiceTotal) *
                          100
                        ).toFixed(0)
                        : 0}
                      %
                    </span>

                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${invoiceTotal > 0
                          ? Math.min(
                            100,
                            (paidAmount /
                              invoiceTotal) *
                            100
                          )
                          : 0
                          }%`,
                      }}
                    ></div>

                  </div>

                </div>

                <div className="mt-6">

                  {pendingAmount <= 0 ? (

                    <div className="bg-green-50 text-green-600 rounded-xl p-3 text-center text-sm font-bold">
                      ✓ Invoice Fully Paid
                    </div>

                  ) : (

                    <div className="bg-orange-50 text-orange-600 rounded-xl p-3 text-center text-sm font-semibold">
                      Payment Pending
                    </div>

                  )}

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          PAYMENT HISTORY
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-5 border-b border-gray-100 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-[#263238]">
              Recent Payments
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Latest payment transactions
            </p>

          </div>

          <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
            {recentPayments.length} Records
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-gray-50">

              <tr>

                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Date
                </th>

                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Party
                </th>

                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Invoice
                </th>

                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Mode
                </th>

                <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase">
                  Amount
                </th>

                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Note
                </th>

              </tr>

            </thead>

            <tbody>

              {recentPayments.map(
                (payment, index) => (

                  <tr
                    key={
                      payment._id ||
                      index
                    }
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >

                    <td className="p-4 text-sm text-gray-600">
                      {formatDate(
                        payment.paymentDate ||
                        payment.date ||
                        payment.createdAt
                      )}
                    </td>

                    <td className="p-4 font-semibold text-gray-700">
                      {payment.partyName ||
                        "-"}
                    </td>

                    <td className="p-4 font-semibold text-[#2F9CAF]">
                      {payment.invoiceNo ||
                        "-"}
                    </td>

                    <td className="p-4">

                      <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                        {payment.paymentMode ||
                          payment.mode ||
                          "-"}
                      </span>

                    </td>

                    <td className="p-4 text-right font-bold text-green-600">
                      {money(
                        payment.amount
                      )}
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {payment.note ||
                        "-"}
                    </td>

                  </tr>

                )
              )}

              {recentPayments.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="p-10 text-center text-gray-400"
                  >
                    No payment records found
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

export default Payments;