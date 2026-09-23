// import { useEffect, useState } from "react";
// import axios from "axios";

// function Returns() {

//   const API = import.meta.env.VITE_API_URL;

//   const [invoices, setInvoices] =
//     useState([]);

//   const [products, setProducts] =
//     useState([]);

//   const [invoiceNo, setInvoiceNo] =
//     useState("");

//   const [partyName, setPartyName] =
//     useState("");

//   const [productId, setProductId] =
//     useState("");

//   const [qty, setQty] =
//     useState("");

//   const [reason, setReason] =
//     useState("");

//   const [returnDate, setReturnDate] =
//     useState(
//       new Date()
//         .toISOString()
//         .split("T")[0]
//     );
//   const [returns, setReturns] =
//     useState([]);

//   const fetchData =
//     async () => {

//       try {

//         const invoiceRes =
//           await axios.get(
//             `${API}/invoices`
//           );

//         const productRes =
//           await axios.get(
//             `${API}/products`
//           );

//         const returnRes =
//           await axios.get(
//             `${API}/returns`
//           );

//         setReturns(
//           returnRes.data
//         );

//         setInvoices(
//           invoiceRes.data
//         );

//         setProducts(
//           productRes.data
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

//   const selectedInvoice =
//     invoices.find(
//       (inv) =>
//         inv.invoiceNo ===
//         invoiceNo
//     );

//   const handleInvoiceChange =
//     (value) => {

//       setInvoiceNo(value);

//       const invoice =
//         invoices.find(
//           (inv) =>
//             inv.invoiceNo === value
//         );

//       if (invoice) {

//         setPartyName(
//           invoice.partyName
//         );
//       }
//     };

//   const handleSaveReturn =
//     async () => {

//       try {

//         const selectedProduct =
//           products.find(
//             (p) =>
//               p._id === productId
//           );

//         const returnData = {

//           invoiceNo,

//           partyName,

//           productId,

//           productName:
//             selectedProduct?.name,

//           qty:
//             Number(qty),

//           reason,

//           returnDate,
//         };

//         await axios.post(
//           `${API}/returns`,
//           returnData
//         );

//         alert(
//           "Return Saved Successfully"
//         );

//         setInvoiceNo("");

//         setPartyName("");

//         setProductId("");

//         setQty("");

//         setReason("");

//       } catch (error) {

//         console.log(error);

//         alert(
//           "Return Save Failed"
//         );
//       }
//     };



//   return (

//     <div className="p-6">

//       {/* Header */}
//       <div className="mb-6">

//         <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
//           Product Return
//         </h1>

//         <p className="text-gray-500">
//           Manage returned products
//         </p>

//       </div>

//       {/* Form */}
//       <div className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">

//         {/* Invoice */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Invoice No
//           </label>

//           <select
//             value={invoiceNo}
//             onChange={(e) =>
//               handleInvoiceChange(
//                 e.target.value
//               )
//             }
//             className="w-full border border-gray-200 rounded-xl p-3"
//           >

//             <option value="">
//               Select Invoice
//             </option>

//             {invoices.map(
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

//         </div>

//         {/* Party */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Party Name
//           </label>

//           <input
//             type="text"
//             value={partyName}
//             readOnly
//             className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100"
//           />

//         </div>

//         {/* Product */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Product
//           </label>

//           <select
//             value={productId}
//             onChange={(e) =>
//               setProductId(
//                 e.target.value
//               )
//             }
//             className="w-full border border-gray-200 rounded-xl p-3"
//           >

//             <option value="">
//               Select Product
//             </option>

//             {products.map(
//               (product) => (

//                 <option
//                   key={product._id}
//                   value={
//                     product._id
//                   }
//                 >
//                   {product.name}
//                 </option>
//               )
//             )}

//           </select>

//         </div>

//         {/* Qty */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Return Qty
//           </label>

//           <input
//             type="number"
//             value={qty}
//             onChange={(e) =>
//               setQty(
//                 e.target.value
//               )
//             }
//             className="w-full border border-gray-200 rounded-xl p-3"
//           />

//         </div>

//         {/* Date */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Return Date
//           </label>

//           <input
//             type="date"
//             value={returnDate}
//             onChange={(e) =>
//               setReturnDate(
//                 e.target.value
//               )
//             }
//             className="w-full border border-gray-200 rounded-xl p-3"
//           />

//         </div>

//         {/* Reason */}
//         <div>

//           <label className="block mb-2 font-medium">
//             Reason
//           </label>

//           <input
//             type="text"
//             value={reason}
//             onChange={(e) =>
//               setReason(
//                 e.target.value
//               )
//             }
//             placeholder="Reason"
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

//           <p>
//             <span className="font-semibold">
//               Party :
//             </span>

//             {" "}
//             {
//               selectedInvoice.partyName
//             }
//           </p>

//           <p>
//             <span className="font-semibold">
//               Invoice :
//             </span>

//             {" "}
//             {
//               selectedInvoice.invoiceNo
//             }
//           </p>

//         </div>

//       )}

//       {/* Save */}
//       <div className="mt-6">

//         <button
//           onClick={
//             handleSaveReturn
//           }
//           className="bg-[#2F9CAF] text-white px-6 py-3 rounded-xl hover:bg-[#238293]"
//         >
//           Save Return
//         </button>

//         <div className="bg-white mt-8 rounded-2xl shadow-sm overflow-x-auto">

//           <div className="p-5 border-b">

//             <h2 className="text-2xl font-bold text-[#2E3A3F]">
//               Return History
//             </h2>

//           </div>

//           <table className="min-w-[900px] w-full">

//             <thead className="bg-gray-100">

//               <tr>

//                 <th className="p-4 text-left">
//                   Date
//                 </th>

//                 <th className="p-4 text-left">
//                   Party
//                 </th>

//                 <th className="p-4 text-left">
//                   Invoice
//                 </th>

//                 <th className="p-4 text-left">
//                   Product
//                 </th>

//                 <th className="p-4 text-left">
//                   Qty
//                 </th>

//                 <th className="p-4 text-left">
//                   Reason
//                 </th>

//               </tr>

//             </thead>

//             <tbody>

//               {returns.map(
//                 (item) => (

//                   <tr
//                     key={item._id}
//                     className="border-b hover:bg-gray-50"
//                   >

//                     <td className="p-4">

//                       {
//                         new Date(
//                           item.returnDate
//                         ).toLocaleDateString(
//                           "en-GB"
//                         )
//                       }

//                     </td>

//                     <td className="p-4 font-medium">

//                       {item.partyName}

//                     </td>

//                     <td className="p-4">

//                       {item.invoiceNo}

//                     </td>

//                     <td className="p-4">

//                       {item.productName}

//                     </td>

//                     <td className="p-4 text-green-600 font-bold">

//                       {item.qty}

//                     </td>

//                     <td className="p-4">

//                       {item.reason || "-"}

//                     </td>

//                   </tr>
//                 )
//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>



//     </div>
//   );
// }

// export default Returns;



import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  FaUndo,
  FaSearch,
  FaPlus,
  FaSyncAlt,
  FaTrash,
  FaTimes,
  FaBoxes,
} from "react-icons/fa";


function Returns() {

  const API = import.meta.env.VITE_API_URL;


  // =====================================================
  // DATA
  // =====================================================

  const [invoices, setInvoices] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [returns, setReturns] =
    useState([]);


  // =====================================================
  // FORM
  // =====================================================

  const [invoiceNo, setInvoiceNo] =
    useState("");

  const [partyName, setPartyName] =
    useState("");

  const [productId, setProductId] =
    useState("");

  const [qty, setQty] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [returnDate, setReturnDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );


  // =====================================================
  // UI
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(true);

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // FETCH DATA
  // =====================================================

  const fetchData = async () => {

    try {

      setLoading(true);

      const [
        invoiceRes,
        productRes,
        returnRes,
      ] = await Promise.all([

        axios.get(
          `${API}/invoices`
        ),

        axios.get(
          `${API}/products`
        ),

        axios.get(
          `${API}/returns`
        ),

      ]);

      setInvoices(
        invoiceRes.data || []
      );

      setProducts(
        productRes.data || []
      );

      setReturns(
        returnRes.data || []
      );

    } catch (error) {

      console.error(
        "Fetch returns data error:",
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

    fetchData();

  }, []);


  // =====================================================
  // SELECTED INVOICE
  // =====================================================

  const selectedInvoice =
    invoices.find(
      (invoice) =>
        invoice.invoiceNo ===
        invoiceNo
    );


  // =====================================================
  // INVOICE CHANGE
  // =====================================================

  const handleInvoiceChange = (
    value
  ) => {

    setInvoiceNo(value);

    const invoice =
      invoices.find(
        (item) =>
          item.invoiceNo === value
      );

    if (invoice) {

      setPartyName(
        invoice.partyName || ""
      );

    } else {

      setPartyName("");

    }

  };


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setInvoiceNo("");
    setPartyName("");
    setProductId("");
    setQty("");
    setReason("");

    setReturnDate(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  };


  // =====================================================
  // SAVE RETURN
  // =====================================================

  const handleSaveReturn =
    async () => {

      if (!invoiceNo) {

        alert(
          "Please select an invoice."
        );

        return;

      }

      if (!productId) {

        alert(
          "Please select a product."
        );

        return;

      }

      if (
        !qty ||
        Number(qty) <= 0
      ) {

        alert(
          "Please enter a valid return quantity."
        );

        return;

      }

      const selectedProduct =
        products.find(
          (product) =>
            product._id === productId
        );

      if (!selectedProduct) {

        alert(
          "Product not found."
        );

        return;

      }


      const returnData = {

        invoiceNo,

        partyName,

        productId,

        productName:
          selectedProduct.name,

        qty: Number(qty),

        reason,

        returnDate,

      };


      try {

        setLoading(true);

        await axios.post(
          `${API}/returns`,
          returnData
        );


        alert(
          "Return saved successfully."
        );


        resetForm();

        await fetchData();

      } catch (error) {

        console.error(
          "Save return error:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Return save failed."
        );

      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // DELETE RETURN
  // =====================================================

  const handleDeleteReturn =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this return?"
        );

      if (!confirmDelete) {
        return;
      }


      try {

        setLoading(true);

        await axios.delete(
          `${API}/returns/${id}`
        );

        setReturns((previous) =>
          previous.filter(
            (item) =>
              item._id !== id
          )
        );

      } catch (error) {

        console.error(
          "Delete return error:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to delete return."
        );

      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // FILTER RETURNS
  // =====================================================

  const filteredReturns =
    useMemo(() => {

      const text =
        search
          .trim()
          .toLowerCase();

      if (!text) {
        return [...returns].sort(
          (a, b) =>
            new Date(
              b.returnDate ||
              b.createdAt ||
              0
            ) -
            new Date(
              a.returnDate ||
              a.createdAt ||
              0
            )
        );
      }

      return returns
        .filter((item) => {

          const party =
            String(
              item.partyName || ""
            ).toLowerCase();

          const invoice =
            String(
              item.invoiceNo || ""
            ).toLowerCase();

          const product =
            String(
              item.productName || ""
            ).toLowerCase();

          const reasonText =
            String(
              item.reason || ""
            ).toLowerCase();

          return (
            party.includes(text) ||
            invoice.includes(text) ||
            product.includes(text) ||
            reasonText.includes(text)
          );

        })
        .sort(
          (a, b) =>
            new Date(
              b.returnDate ||
              b.createdAt ||
              0
            ) -
            new Date(
              a.returnDate ||
              a.createdAt ||
              0
            )
        );

    }, [
      returns,
      search,
    ]);


  // =====================================================
  // SUMMARY
  // =====================================================

  const totalReturns =
    returns.length;

  const totalReturnQty =
    returns.reduce(
      (sum, item) =>
        sum +
        Number(item.qty || 0),
      0
    );

  const todayReturns =
    returns.filter((item) => {

      const date = new Date(
        item.returnDate ||
        item.createdAt
      );

      const today =
        new Date();

      return (
        date.toDateString() ===
        today.toDateString()
      );

    }).length;


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const value =
      new Date(date);

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "-";
    }

    return value.toLocaleDateString(
      "en-IN"
    );

  };


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="min-h-screen bg-[#F5F7FA]">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-2xl bg-[#2F9CAF] text-white flex items-center justify-center">

            <FaUndo />

          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Product Returns
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage customer product returns
            </p>

          </div>

        </div>


        <div className="flex gap-2">

          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
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


          <button
            type="button"
            onClick={() =>
              setShowForm(true)
            }
            className="flex items-center gap-2 bg-[#2F9CAF] text-white px-5 py-3 rounded-xl hover:bg-[#238293]"
          >

            <FaPlus />

            New Return

          </button>

        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Total Returns
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {totalReturns}
          </h2>

        </div>


        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Returned Quantity
          </p>

          <h2 className="text-3xl font-bold text-[#2F9CAF] mt-2">
            {totalReturnQty}
          </h2>

        </div>


        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Today's Returns
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {todayReturns}
          </h2>

        </div>

      </div>


      {/* =================================================
          RETURN FORM
      ================================================= */}

      {showForm && (

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">

          {/* FORM HEADER */}

          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Create Product Return
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Select invoice and product details
              </p>

            </div>


            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
            >
              <FaTimes />
            </button>

          </div>


          <div className="p-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


              {/* INVOICE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Invoice No
                </label>

                <select
                  value={invoiceNo}
                  onChange={(e) =>
                    handleInvoiceChange(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/20"
                >

                  <option value="">
                    Select Invoice
                  </option>

                  {invoices.map(
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


              {/* PARTY */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Party Name
                </label>

                <input
                  type="text"
                  value={partyName}
                  readOnly
                  placeholder="Party Name"
                  className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100 text-gray-600"
                />

              </div>


              {/* PRODUCT */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product
                </label>

                <select
                  value={productId}
                  onChange={(e) =>
                    setProductId(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
                >

                  <option value="">
                    Select Product
                  </option>

                  {products.map(
                    (product) => (

                      <option
                        key={product._id}
                        value={
                          product._id
                        }
                      >
                        {product.name}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* QTY */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Return Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) =>
                    setQty(
                      e.target.value
                    )
                  }
                  placeholder="Enter quantity"
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
                />

              </div>


              {/* DATE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Return Date
                </label>

                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) =>
                    setReturnDate(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
                />

              </div>


              {/* REASON */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason
                </label>

                <input
                  type="text"
                  value={reason}
                  onChange={(e) =>
                    setReason(
                      e.target.value
                    )
                  }
                  placeholder="Return reason"
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
                />

              </div>

            </div>


            {/* INVOICE DETAILS */}

            {selectedInvoice && (

              <div className="mt-5 p-4 rounded-xl bg-cyan-50 border border-cyan-100">

                <h3 className="font-bold text-[#2F9CAF] mb-3">
                  Invoice Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">

                  <div>

                    <span className="text-gray-500">
                      Invoice
                    </span>

                    <p className="font-bold">
                      {selectedInvoice.invoiceNo}
                    </p>

                  </div>


                  <div>

                    <span className="text-gray-500">
                      Party
                    </span>

                    <p className="font-bold">
                      {selectedInvoice.partyName}
                    </p>

                  </div>


                  <div>

                    <span className="text-gray-500">
                      Invoice Amount
                    </span>

                    <p className="font-bold">
                      ₹{" "}
                      {Number(
                        selectedInvoice.roundedTotal ??
                        selectedInvoice.grandTotal ??
                        0
                      ).toFixed(2)}
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* SAVE */}

            <div className="flex justify-end mt-5">

              <button
                type="button"
                onClick={handleSaveReturn}
                disabled={loading}
                className="flex items-center gap-2 bg-[#2F9CAF] text-white px-6 py-3 rounded-xl hover:bg-[#238293] disabled:opacity-50"
              >

                <FaUndo />

                {loading
                  ? "Saving..."
                  : "Save Return"}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          RETURN HISTORY
      ================================================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-5 border-b border-gray-100">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Return History
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                All recorded product returns
              </p>

            </div>


            <div className="relative w-full md:w-80">

              <FaSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search return..."
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#2F9CAF]"
              />

            </div>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="min-w-[1050px] w-full">

            <thead>

              <tr className="bg-black text-white">

                <th className="p-4 text-center">
                  No.
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Party
                </th>

                <th className="p-4 text-left">
                  Invoice
                </th>

                <th className="p-4 text-left">
                  Product
                </th>

                <th className="p-4 text-center">
                  Qty
                </th>

                <th className="p-4 text-left">
                  Reason
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredReturns.map(
                (item, index) => (

                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >

                    <td className="p-4 text-center font-semibold text-gray-500">
                      {index + 1}
                    </td>


                    <td className="p-4">
                      {formatDate(
                        item.returnDate ||
                        item.createdAt
                      )}
                    </td>


                    <td className="p-4 font-semibold">
                      {item.partyName || "-"}
                    </td>


                    <td className="p-4 font-bold">
                      {item.invoiceNo || "-"}
                    </td>


                    <td className="p-4">
                      {item.productName || "-"}
                    </td>


                    <td className="p-4 text-center">

                      <span className="inline-flex items-center justify-center min-w-9 px-2 py-1 rounded-lg bg-red-50 text-red-600 font-bold">
                        {item.qty}
                      </span>

                    </td>


                    <td className="p-4 text-gray-600">
                      {item.reason || "-"}
                    </td>


                    <td className="p-4">

                      <div className="flex justify-center">

                        <button
                          type="button"
                          title="Delete Return"
                          onClick={() =>
                            handleDeleteReturn(
                              item._id
                            )
                          }
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >

                          <FaTrash />

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}


              {filteredReturns.length === 0 && (

                <tr>

                  <td
                    colSpan="8"
                    className="p-12 text-center"
                  >

                    <div className="text-5xl text-gray-300 mb-3">
                      <FaBoxes className="mx-auto" />
                    </div>

                    <p className="font-semibold text-gray-700">
                      No returns found
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      No product return records match your search.
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

export default Returns;