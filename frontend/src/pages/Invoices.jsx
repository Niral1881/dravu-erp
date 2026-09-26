// import { useState } from "react";
// import { useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";

// function Invoices({ isEdit }) {

//   const API = import.meta.env.VITE_API_URL;

//   const [invoiceNo, setInvoiceNo] =
//     useState("");

//   const [invoiceDate, setInvoiceDate] =
//     useState(
//       new Date().toISOString().split("T")[0]
//     );

//   const [dateOfSupply, setDateOfSupply] =
//     useState(
//       new Date().toISOString().split("T")[0]
//     );

//   const [items, setItems] = useState([
//     {
//       productId: "null",
//       product: "",
//       qty: "",
//       rate: "",
//       total: 0,
//     },
//   ]);

//   const [partyId, setPartyId] =
//     useState("");

//   const [products, setProducts] = useState([]);

//   const [partyName, setPartyName] =
//     useState("");

//   const [parties, setParties] =
//     useState([]);

//   const [selectedParty, setSelectedParty] =
//     useState(null);

//   // DELIVERY ADDRESS
//   const [deliveryName, setDeliveryName] = useState("");
//   const [deliveryGstin, setDeliveryGstin] = useState("");
//   const [deliveryMobile, setDeliveryMobile] = useState("");
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [deliveryCity, setDeliveryCity] = useState("");
//   const [deliveryState, setDeliveryState] = useState("");


//   const [discountPercent, setDiscountPercent] =
//     useState(0);

//   const [gstPercent, setGstPercent] =
//     useState(0);

//   const { id } = useParams();


//   const navigate = useNavigate();

//   const fetchProducts = async () => {
//     try {

//       const res = await axios.get(
//         `${API}/products`
//       );

//       const partyRes = await axios.get(
//         `${API}/parties`
//       );

//       const invoiceRes = await axios.get(
//         `${API}/invoices`
//       );

//       const invoices = invoiceRes.data
//         .filter(
//           (inv) =>
//             inv.invoiceType === "NORMAL" ||
//             !inv.invoiceType
//         )
//         .sort((a, b) => {
//           const aNo = Number(
//             a.invoiceNo.split("-")[1]
//           );

//           const bNo = Number(
//             b.invoiceNo.split("-")[1]
//           );

//           return aNo - bNo;
//         });

//       if (invoices.length > 0) {

//         const lastInvoice =
//           invoices[invoices.length - 1];

//         const lastNumber =
//           Number(
//             lastInvoice.invoiceNo.split("-")[1]
//           );

//         const nextNumber =
//           lastNumber + 1;

//         setInvoiceNo(`INV-${nextNumber}`);

//       } else {

//         setInvoiceNo("INV-217");
//       }
//       setParties(partyRes.data);

//       setProducts(res.data);

//     } catch (error) {

//       console.log(error);
//     }
//   };

//   const fetchInvoice = async () => {

//     try {

//       const res = await axios.get(
//         `${API}/invoices/${id}`
//       );

//       const data = res.data;

//       const matchedParty = parties.find(
//         (p) => p.name === data.partyName
//       );

//       if (matchedParty) {

//         setSelectedParty(matchedParty);

//         setPartyId(matchedParty._id);
//       }

//       setPartyName(data.partyName);

//       // LOAD SAVED DELIVERY ADDRESS
//       setDeliveryName(data.deliveryName || "");
//       setDeliveryGstin(data.deliveryGstin || "");
//       setDeliveryMobile(data.deliveryMobile || "");
//       setDeliveryAddress(data.deliveryAddress || "");
//       setDeliveryCity(data.deliveryCity || "");
//       setDeliveryState(data.deliveryState || "");

//       setInvoiceDate(data.date);

//       setItems(data.items);

//       setDiscountPercent(
//         data.discountPercent
//       );

//       setGstPercent(
//         data.gstPercent
//       );

//       setDateOfSupply(
//         data.dateOfSupply
//       );

//       setInvoiceNo(
//         data.invoiceNo
//       );

//     } catch (error) {

//       console.log(error);
//     }
//   };

//   useEffect(() => {

//     const loadProducts = async () => {
//       await fetchProducts();
//       if (isEdit && id) {
//         await fetchInvoice();
//       }
//     };
//     loadProducts();

//   }, []);

//   // ======================================
//   // AUTO CALCULATE QTY
//   // Example:
//   // D NO : 281 (15 + 15 + 15) = 45
//   // D NO : 272 (15 + 15) = 30
//   // D NO : 279 (20 + 8 + 10) = 38
//   // ======================================

//   const getQtyFromProductName = (productName) => {
//     if (!productName) return 0;

//     const text = String(productName);

//     // Take everything after the first "("
//     const bracketIndex = text.indexOf("(");

//     if (bracketIndex === -1) {
//       return 0;
//     }

//     const qtyPart = text.substring(bracketIndex + 1);

//     // Get all numbers after "("
//     const numbers = qtyPart.match(/\d+(?:\.\d+)?/g);

//     if (!numbers) {
//       return 0;
//     }

//     return numbers.reduce(
//       (sum, num) => sum + Number(num),
//       0
//     );
//   };

//   const handleChange = (index, field, value) => {

//     const updatedItems = [...items];

//     updatedItems[index][field] = value;

//     const qty =
//       Number(updatedItems[index].qty) || 0;

//     const rate =
//       Number(updatedItems[index].rate) || 0;

//     updatedItems[index].total =
//       qty * rate;

//     setItems(updatedItems);
//   };

//   const addRow = () => {

//     setItems([
//       ...items,

//       {
//         productId: null,
//         product: "",
//         qty: "",
//         rate: "",
//         total: 0,
//       },
//     ]);
//   };

//   const removeRow = (index) => {
//     // Keep at least one item row
//     if (items.length === 1) {
//       setItems([
//         {
//           productId: null,
//           product: "",
//           qty: "",
//           rate: "",
//           total: 0,
//         },
//       ]);
//       return;
//     }

//     const updatedItems = items.filter((_, i) => i !== index);
//     setItems(updatedItems);
//   };

//   const subtotal = items.reduce(
//     (acc, item) => acc + item.total,
//     0
//   );

//   const discountAmount =
//     (subtotal * discountPercent) / 100;

//   const afterDiscount =
//     subtotal - discountAmount;

//   const gstAmount =
//     (afterDiscount * gstPercent) / 100;

//   const cgstAmount =
//     gstPercent > 0 ? gstAmount / 2 : 0;

//   const sgstAmount =
//     gstPercent > 0 ? gstAmount / 2 : 0;

//   const igstAmount = 0;

//   // If you later support interstate invoices,
//   // use:
//   // const igstAmount = gstAmount;
//   // const cgstAmount = 0;
//   // const sgstAmount = 0;

//   const grandTotal =
//     afterDiscount + gstAmount;

//   const roundedTotal =
//     Math.ceil(grandTotal || 0);

//   const roundOff =
//     roundedTotal -
//     (grandTotal || 0);




//   const handleSaveInvoice = async () => {

//     try {

//       const cleanedItems = items.map((item) => ({
//         productId: item.productId || null,
//         product: String(item.product || "").trim(),
//         qty: Number(item.qty) || 0,
//         rate: Number(item.rate) || 0,
//         total: Number(item.total) || 0,
//       }));

//       const invoiceData = {

//         invoiceNo,

//         invoiceType: "NORMAL",

//         partyName,

//         partyAddress:
//           selectedParty?.address || "",

//         partyCity:
//           selectedParty?.city || "",

//         partyState:
//           selectedParty?.state || "",

//         partyMobile:
//           selectedParty?.mobile || "",

//         partyGstin:
//           selectedParty?.gstin || "",

//         // DELIVERY ADDRESS
//         deliveryName,
//         deliveryGstin,
//         deliveryMobile,
//         deliveryAddress,
//         deliveryCity,
//         deliveryState,

//         date: invoiceDate,

//         dateOfSupply,

//         items: cleanedItems,

//         subtotal,

//         discountPercent,

//         gstPercent,

//         discountAmount,

//         cgstAmount,

//         sgstAmount,

//         igstAmount,

//         gstAmount,

//         roundOff,

//         roundedTotal,

//         grandTotal:
//           afterDiscount + gstAmount,

//         paidAmount: 0,

//         pendingAmount:
//           roundedTotal,

//         paymentStatus:
//           "UNPAID",
//       };

//       console.log("========== DELIVERY CHECK ==========");
//       console.log("Name:", deliveryName);
//       console.log("GSTIN:", deliveryGstin);
//       console.log("Mobile:", deliveryMobile);
//       console.log("Address:", deliveryAddress);
//       console.log("City:", deliveryCity);
//       console.log("State:", deliveryState);
//       console.log("====================================");

//       let res;

//       if (isEdit && id) {

//         res = await axios.put(
//           `${API}/invoices/${id}`,
//           invoiceData
//         );

//       } else {

//         for (const item of items) {

//           const product = products.find(
//             (p) => p._id === item.productId
//           );

//           if (!product) continue;

//           if (Number(item.qty) > Number(product.stock)) {

//             alert(
//               `${product.name} only ${product.stock} pcs available`
//             );

//             return;
//           }
//         }

//         res = await axios.post(
//           `${API}/invoices`,
//           invoiceData
//         );
//       }

//       navigate(
//         `/invoice-print/${res.data._id}`
//       );


//     } catch (error) {
//       console.error("========== INVOICE SAVE ERROR ==========");
//       console.error("STATUS:", error.response?.status);
//       console.error("DATA:", error.response?.data);
//       console.error("MESSAGE:", error.message);
//       console.error("FULL ERROR:", error);
//       console.error("========================================");

//       alert(
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Invoice save failed"
//       );
//     }
//   };



//   return (
//     <div>

//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
//             Create Invoice
//           </h1>

//           <p className="text-gray-500">
//             Generate new sales invoice
//           </p>
//         </div>

//         <button
//           onClick={handleSaveInvoice}
//           className="bg-[#2F9CAF] cursor-pointer text-white px-5 py-3 rounded-xl hover:bg-[#238293] w-full md:w-auto"
//         >
//           Save Invoice
//         </button>

//       </div>

//       {/* Invoice Form */}
//       <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">

//         {/* Top Form */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">

//           <div>
//             <label className="block mb-2 font-bold">
//               Invoice No
//             </label>

//             <input
//               type="text"
//               value={invoiceNo}
//               readOnly
//               className="w-full border bg-[#2F9CAF] text-white border-gray-200 rounded-xl p-3 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block mb-2 font-bold">
//               Party Name
//             </label>

//             <select
//               value={partyId}
//               onChange={(e) => {

//                 const party = parties.find(
//                   (p) => p._id === e.target.value
//                 );

//                 if (!party) return;

//                 setPartyId(party._id);

//                 setPartyName(party.name);

//                 setSelectedParty(party);

//                 // AUTO LOAD DELIVERY ADDRESS FROM PARTY
//                 setDeliveryName(party.deliveryName || "");
//                 setDeliveryGstin(party.deliveryGstin || "");
//                 setDeliveryMobile(party.deliveryMobile || "");
//                 setDeliveryAddress(party.deliveryAddress || "");
//                 setDeliveryCity(party.deliveryCity || "");
//                 setDeliveryState(party.deliveryState || "");


//               }}
//               className="w-full border bg-[#2F9CAF] text-white  border-gray-200 rounded-xl p-3 outline-none autoFocus focus:border-[#2F9CAF]"
//             >

//               <option value="">
//                 Select Party
//               </option>

//               {parties
//                 .sort((a, b) =>
//                   a.name.localeCompare(b.name)
//                 )
//                 .map((party) => (

//                   <option
//                     key={party._id}
//                     value={party._id}
//                   >
//                     {party.name}
//                   </option>
//                 ))}

//             </select>

//             {
//               selectedParty && (

//                 <div className="bg-[#2F9CAF] text-white p-4 rounded-xl border mt-4 space-y-2">

//                   <p>
//                     <span className="font-bold">
//                       Address :
//                     </span>

//                     {" "}
//                     {selectedParty.address}
//                   </p>

//                   <p>
//                     <span className="font-bold">
//                       City :
//                     </span>

//                     {" "}
//                     {selectedParty.city}
//                   </p>

//                   <p>
//                     <span className="font-bold">
//                       State :
//                     </span>

//                     {" "}
//                     {selectedParty.state}
//                   </p>


//                   <p>
//                     <span className="font-bold">
//                       Mobile :
//                     </span>

//                     {" "}
//                     {selectedParty.mobile}
//                   </p>

//                   <p>
//                     <span className="font-bold">
//                       GSTIN :
//                     </span>

//                     {" "}
//                     {selectedParty.gstin}
//                   </p>


//                 </div>
//               )
//             }

//           </div>

//           {/* DELIVERY ADDRESS */}
//           <div className="md:col-span-2 lg:col-span-3">

//             <div className="bg-[#2F9CAF] text-white p-4 rounded-xl">

//               <h2 className="font-bold text-lg mb-4">
//                 Delivery Address
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 {/* Delivery Name */}
//                 <div>
//                   <label className="block mb-2 font-bold">
//                     Name
//                   </label>

//                   <input
//                     type="text"
//                     value={deliveryName}
//                     onChange={(e) =>
//                       setDeliveryName(e.target.value)
//                     }
//                     className="w-full bg-white text-black border border-gray-200 rounded-lg p-3"
//                     placeholder="Delivery Name"
//                   />
//                 </div>

//                 {/* Delivery GSTIN */}
//                 <div>
//                   <label className="block mb-2 font-bold">
//                     GSTIN
//                   </label>

//                   <input
//                     type="text"
//                     value={deliveryGstin}
//                     onChange={(e) =>
//                       setDeliveryGstin(e.target.value)
//                     }
//                     className="w-full bg-white text-black border border-gray-200 rounded-lg p-3"
//                     placeholder="Delivery GSTIN"
//                   />
//                 </div>

//                 {/* Delivery Mobile */}
//                 <div>
//                   <label className="block mb-2 font-bold">
//                     Mobile
//                   </label>

//                   <input
//                     type="text"
//                     value={deliveryMobile}
//                     onChange={(e) =>
//                       setDeliveryMobile(e.target.value)
//                     }
//                     className="w-full bg-white text-black border border-gray-200 rounded-lg p-3"
//                     placeholder="Delivery Mobile"
//                   />
//                 </div>

//                 {/* Delivery City */}
//                 <div>
//                   <label className="block mb-2 font-bold">
//                     City
//                   </label>

//                   <input
//                     type="text"
//                     value={deliveryCity}
//                     onChange={(e) =>
//                       setDeliveryCity(e.target.value)
//                     }
//                     className="w-full bg-white text-black border border-gray-200 rounded-lg p-3"
//                     placeholder="Delivery City"
//                   />
//                 </div>

//                 {/* Delivery State */}
//                 <div>
//                   <label className="block mb-2 font-bold">
//                     State
//                   </label>

//                   <input
//                     type="text"
//                     value={deliveryState}
//                     onChange={(e) =>
//                       setDeliveryState(e.target.value)
//                     }
//                     className="w-full bg-white text-black border border-gray-200 rounded-lg p-3"
//                     placeholder="Delivery State"
//                   />
//                 </div>

//                 {/* Delivery Address */}
//                 <div className="md:col-span-2">
//                   <label className="block mb-2 font-bold">
//                     Address
//                   </label>

//                   <textarea
//                     value={deliveryAddress}
//                     onChange={(e) =>
//                       setDeliveryAddress(e.target.value)
//                     }
//                     rows="3"
//                     className="w-full bg-white text-black border border-gray-200 rounded-lg p-3"
//                     placeholder="Delivery Address"
//                   />
//                 </div>

//               </div>

//             </div>

//           </div>

//           <div>
//             <label className="block mb-2 font-bold">
//               Date
//             </label>

//             <input
//               type="date"
//               value={invoiceDate}
//               onChange={(e) =>
//                 setInvoiceDate(e.target.value)
//               }
//               className="w-full border bg-[#2F9CAF] text-white border-gray-200 rounded-xl p-3 outline-none"
//             />

//           </div>

//           <div className="mt-4">

//             <label className="block mb-2 font-bold">
//               Date Of Supply
//             </label>

//             <input
//               type="date"
//               value={dateOfSupply}
//               onChange={(e) =>
//                 setDateOfSupply(e.target.value)
//               }
//               className="w-full border bg-[#2F9CAF] text-white border-gray-200 rounded-xl p-3 outline-none"
//             />

//           </div>

//         </div>

//         {/* Items Table */}
//         <div className="overflow-auto">

//           <table className="min-w-[900px] w-full mb-5">

//             <thead className="bg-white">

//               <tr>
//                 <th className="text-left p-4">Product</th>
//                 <th className="text-left p-4">Qty</th>
//                 <th className="text-left p-4">Rate</th>
//                 <th className="text-left p-4">Total</th>
//                 <th className="text-center p-4">Action</th>
//               </tr>

//             </thead>

//             <tbody>

//               {items.map((item, index) => (
//                 <tr key={index} className="border-b">

//                   <td className="p-4">

//                     <input
//                       list={`products-${index}`}
//                       value={item.product || ""}

//                       onChange={(e) => {
//                         const value = e.target.value;

//                         const selectedProduct = products.find(
//                           (p) =>
//                             String(p.name).trim().toLowerCase() ===
//                             String(value).trim().toLowerCase()
//                         );

//                         setItems((prevItems) => {
//                           const updatedItems = [...prevItems];

//                           const productName = selectedProduct
//                             ? selectedProduct.name
//                             : value;

//                           const qty = getQtyFromProductName(productName);

//                           const rate = selectedProduct
//                             ? Number(selectedProduct.rate) || 0
//                             : Number(updatedItems[index].rate) || 0;

//                           updatedItems[index] = {
//                             ...updatedItems[index],

//                             product: productName,

//                             productId:
//                               selectedProduct?._id ||
//                               null,

//                             qty: qty,

//                             rate: rate,

//                             total: qty * rate,
//                           };

//                           console.log("PRODUCT:", productName);
//                           console.log("QTY:", qty);
//                           console.log("RATE:", rate);
//                           console.log("TOTAL:", qty * rate);

//                           return updatedItems;
//                         });
//                       }}

//                       placeholder="Select / Type Product"

//                       className="w-full border bg-[#2F9CAF] text-white border-gray-200 rounded-lg p-2 md:p-3"
//                     />

//                     <datalist id={`products-${index}`}>

//                       {products.map((product) => (

//                         <option
//                           key={product._id}
//                           value={product.name}
//                         />

//                       ))}

//                     </datalist>

//                   </td>

//                   <td className="p-4">
//                     <input
//                       type="number"
//                       value={item.qty}
//                       readOnly
//                       className="w-full border bg-[#2F9CAF] text-white border-gray-200 rounded-lg p-2 md:p-3 editable-qty"
//                     />
//                   </td>

//                   <td className="p-4">
//                     <input
//                       type="number"
//                       value={item.rate}
//                       onChange={(e) =>
//                         handleChange(
//                           index,
//                           "rate",
//                           (e.target.value)
//                         )
//                       }
//                       className="w-full border bg-[#2F9CAF] text-white border-gray-200 rounded-lg p-2 md:p-3"
//                     />
//                   </td>

//                   <td className="p-4 font-semibold">

//                     <div className="text-sm text-gray-500">
//                       {item.product}
//                     </div>

//                     ₹ {Number(item.total || 0).toFixed(2)}

//                   </td>

//                   <td className="p-4 text-center">
//                     <button
//                       type="button"
//                       onClick={() => removeRow(index)}
//                       className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
//                     >
//                       Remove
//                     </button>
//                   </td>

//                 </tr>
//               ))}

//             </tbody>

//           </table>

//         </div>

//         {/* Add Row */}
//         <button
//           onClick={addRow}
//           className="bg-[#2F9CAF] cursor-pointer text-white px-4 py-2 rounded-lg mb-6"
//         >
//           + Add Item
//         </button>


//         {/* Summary */}
//         <div className="flex justify-end">

//           <div className="w-full md:w-96 bg-[#8de8f8] rounded-2xl p-5">

//             {/* Discount */}
//             <div className="mb-4">

//               <label className="block mb-2 font-medium">
//                 Overall Discount %
//               </label>

//               <input
//                 type="number"
//                 value={discountPercent}
//                 onChange={(e) =>
//                   setDiscountPercent(
//                     (e.target.value)
//                   )
//                 }
//                 className="w-full border border-gray-200 rounded-lg p-2 md:p-3"
//               />

//             </div>

//             {/* GST */}
//             <div className="mb-4">

//               <label className="block mb-2 font-medium">
//                 Overall GST %
//               </label>

//               <input
//                 type="number"
//                 value={gstPercent}
//                 onChange={(e) =>
//                   setGstPercent(
//                     (e.target.value)
//                   )
//                 }
//                 className="w-full border border-gray-200 rounded-lg p-2 md:p-3"
//               />

//             </div>

//             {/* Totals */}
//             <div className="flex justify-between mb-3">
//               <span>Subtotal</span>
//               <span>
//                 ₹ {subtotal.toFixed(2)}
//               </span>
//             </div>

//             <div className="flex justify-between mb-3 text-red-500">

//               <span>Discount</span>

//               <span>
//                 ₹ {discountAmount.toFixed(2)}
//               </span>

//             </div>

//             <div className="flex justify-between mb-2">
//               <span>CGST ({gstPercent / 2}%)</span>
//               <span>₹ {cgstAmount.toFixed(2)}</span>
//             </div>

//             <div className="flex justify-between mb-2">
//               <span>SGST ({gstPercent / 2}%)</span>
//               <span>₹ {sgstAmount.toFixed(2)}</span>
//             </div>

//             <div className="flex justify-between mb-2">
//               <span>IGST</span>
//               <span>₹ {igstAmount.toFixed(2)}</span>
//             </div>

//             <div className="flex justify-between mb-3 text-green-600 font-semibold border-t pt-2">
//               <span>Total GST</span>
//               <span>₹ {gstAmount.toFixed(2)}</span>
//             </div>

//             <div className="flex justify-between mb-3 text-gray-500">

//               <span>
//                 Round Off
//               </span>

//               <span>
//                 ₹ {roundOff.toFixed(2)}
//               </span>

//             </div>

//             <div className="border-t pt-3 flex justify-between text-2xl font-bold">

//               <span>Grand Total</span>

//               <span className="text-[#2F9CAF]">

//                 ₹ {roundedTotal.toFixed(2)}

//               </span>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Invoices;


import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Invoices({ isEdit }) {
  const API = import.meta.env.VITE_API_URL;

  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateOfSupply, setDateOfSupply] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [items, setItems] = useState([
    {
      productId: null,
      product: "",
      qty: "",
      rate: "",
      total: 0,
    },
  ]);

  const [partyId, setPartyId] = useState("");
  const [products, setProducts] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);

  // DELIVERY
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryGstin, setDeliveryGstin] = useState("");
  const [deliveryMobile, setDeliveryMobile] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryState, setDeliveryState] = useState("");

  const [discountPercent, setDiscountPercent] = useState(0);
  const [gstPercent, setGstPercent] = useState(0);
  const [saving, setSaving] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // FETCH PRODUCTS / PARTIES / INVOICES
  // =========================================================
  const fetchProducts = async () => {
    try {
      const [productRes, partyRes, invoiceRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/parties`),
        axios.get(`${API}/invoices`),
      ]);

      const normalInvoices = (invoiceRes.data || [])
        .filter(
          (inv) => inv.invoiceType === "NORMAL" || !inv.invoiceType
        )
        .sort((a, b) => {
          const aNo = Number(String(a.invoiceNo || "").split("-")[1]) || 0;
          const bNo = Number(String(b.invoiceNo || "").split("-")[1]) || 0;
          return aNo - bNo;
        });

      if (normalInvoices.length > 0) {
        const lastInvoice = normalInvoices[normalInvoices.length - 1];

        const lastNumber =
          Number(String(lastInvoice.invoiceNo || "").split("-")[1]) || 216;

        setInvoiceNo(`INV-${lastNumber + 1}`);
      } else {
        setInvoiceNo("INV-217");
      }

      setParties(partyRes.data || []);
      setProducts(productRes.data || []);
    } catch (error) {
      console.error("FETCH INVOICE DATA ERROR:", error);
    }
  };

  // =========================================================
  // FETCH EDIT INVOICE
  // =========================================================
  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`${API}/invoices/${id}`);
      const data = res.data;

      const matchedParty = parties.find(
        (party) => party.name === data.partyName
      );

      if (matchedParty) {
        setSelectedParty(matchedParty);
        setPartyId(matchedParty._id);
      }

      setPartyName(data.partyName || "");

      setDeliveryName(data.deliveryName || "");
      setDeliveryGstin(data.deliveryGstin || "");
      setDeliveryMobile(data.deliveryMobile || "");
      setDeliveryAddress(data.deliveryAddress || "");
      setDeliveryCity(data.deliveryCity || "");
      setDeliveryState(data.deliveryState || "");

      setInvoiceDate(data.date || "");
      setDateOfSupply(data.dateOfSupply || "");
      setInvoiceNo(data.invoiceNo || "");

      setItems(
        Array.isArray(data.items) && data.items.length > 0
          ? data.items
          : [
            {
              productId: null,
              product: "",
              qty: "",
              rate: "",
              total: 0,
            },
          ]
      );

      setDiscountPercent(Number(data.discountPercent || 0));
      setGstPercent(Number(data.gstPercent || 0));
    } catch (error) {
      console.error("FETCH INVOICE ERROR:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();

      if (isEdit && id) {
        await fetchInvoice();
      }
    };

    loadData();
  }, [isEdit, id]);

  // =========================================================
  // AUTO QTY FROM PRODUCT NAME
  // Example:
  // D NO : 281 (15+15+15) = 45
  // =========================================================
  const getQtyFromProductName = (productName) => {
    if (!productName) return 0;

    const text = String(productName);
    const bracketIndex = text.indexOf("(");

    if (bracketIndex === -1) return 0;

    const qtyPart = text.substring(bracketIndex + 1);

    const numbers = qtyPart.match(/\d+(?:\.\d+)?/g);

    if (!numbers) return 0;

    return numbers.reduce(
      (sum, number) => sum + Number(number),
      0
    );
  };

  // =========================================================
  // ITEM CHANGE
  // =========================================================
  const handleChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index][field] = value;

    const qty = Number(updatedItems[index].qty) || 0;
    const rate = Number(updatedItems[index].rate) || 0;

    updatedItems[index].total = qty * rate;

    setItems(updatedItems);
  };

  // =========================================================
  // ADD ITEM
  // =========================================================
  const addRow = () => {
    setItems([
      ...items,
      {
        productId: null,
        product: "",
        qty: "",
        rate: "",
        total: 0,
      },
    ]);
  };

  // =========================================================
  // REMOVE ITEM
  // =========================================================
  const removeRow = (index) => {
    if (items.length === 1) {
      setItems([
        {
          productId: null,
          product: "",
          qty: "",
          rate: "",
          total: 0,
        },
      ]);
      return;
    }

    setItems(items.filter((_, i) => i !== index));
  };

  // =========================================================
  // CALCULATIONS
  // =========================================================
  const subtotal = items.reduce(
    (acc, item) => acc + (Number(item.total) || 0),
    0
  );

  const discountAmount =
    (subtotal * Number(discountPercent || 0)) / 100;

  const afterDiscount = subtotal - discountAmount;

  const gstAmount =
    (afterDiscount * Number(gstPercent || 0)) / 100;

  const cgstAmount =
    Number(gstPercent || 0) > 0 ? gstAmount / 2 : 0;

  const sgstAmount =
    Number(gstPercent || 0) > 0 ? gstAmount / 2 : 0;

  const igstAmount = 0;

  const grandTotal = afterDiscount + gstAmount;

  const roundedTotal = Math.ceil(grandTotal || 0);

  const roundOff = roundedTotal - (grandTotal || 0);

  // =========================================================
  // SELECT PARTY
  // =========================================================
  const handlePartyChange = (e) => {
    const party = parties.find(
      (p) => p._id === e.target.value
    );

    if (!party) {
      setPartyId("");
      setPartyName("");
      setSelectedParty(null);
      return;
    }

    setPartyId(party._id);
    setPartyName(party.name);
    setSelectedParty(party);

    // AUTO LOAD DELIVERY DETAILS
    setDeliveryName(party.deliveryName || "");
    setDeliveryGstin(party.deliveryGstin || "");
    setDeliveryMobile(party.deliveryMobile || "");
    setDeliveryAddress(party.deliveryAddress || "");
    setDeliveryCity(party.deliveryCity || "");
    setDeliveryState(party.deliveryState || "");
  };

  // =========================================================
  // SAVE INVOICE
  // =========================================================
  const handleSaveInvoice = async () => {
    try {
      if (!partyName) {
        alert("Please select Party.");
        return;
      }

      const validItems = items.filter(
        (item) =>
          item.product &&
          Number(item.qty) > 0 &&
          Number(item.rate) >= 0
      );

      if (validItems.length === 0) {
        alert("Please add at least one product.");
        return;
      }

      setSaving(true);

      const cleanedItems = items.map((item) => ({
        productId: item.productId || null,
        product: String(item.product || "").trim(),
        qty: Number(item.qty) || 0,
        rate: Number(item.rate) || 0,
        total: Number(item.total) || 0,
      }));

      // STOCK VALIDATION FOR NEW INVOICE
      if (!isEdit) {
        for (const item of items) {
          const product = products.find(
            (p) => p._id === item.productId
          );

          if (!product) continue;

          if (Number(item.qty) > Number(product.stock)) {
            alert(
              `${product.name} only ${product.stock} pcs available`
            );

            setSaving(false);
            return;
          }
        }
      }

      const invoiceData = {
        invoiceNo,
        invoiceType: "NORMAL",

        partyName,
        partyAddress: selectedParty?.address || "",
        partyCity: selectedParty?.city || "",
        partyState: selectedParty?.state || "",
        partyMobile: selectedParty?.mobile || "",
        partyGstin: selectedParty?.gstin || "",

        deliveryName,
        deliveryGstin,
        deliveryMobile,
        deliveryAddress,
        deliveryCity,
        deliveryState,

        date: invoiceDate,
        dateOfSupply,

        items: cleanedItems,

        subtotal,

        discountPercent: Number(discountPercent || 0),
        gstPercent: Number(gstPercent || 0),

        discountAmount,

        cgstAmount,
        sgstAmount,
        igstAmount,

        gstAmount,

        roundOff,
        roundedTotal,

        grandTotal,

        paidAmount: 0,
        pendingAmount: roundedTotal,
        paymentStatus: "UNPAID",
      };

      console.log("INVOICE DATA:", invoiceData);

      let res;

      if (isEdit && id) {
        res = await axios.put(
          `${API}/invoices/${id}`,
          invoiceData
        );
      } else {
        res = await axios.post(
          `${API}/invoices`,
          invoiceData
        );
      }

      navigate(`/invoice-print/${res.data._id}`);
    } catch (error) {
      console.error("INVOICE SAVE ERROR:", error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Invoice save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================
  const money = (value) =>
    `₹ ${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-7">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F9CAF] text-xl font-bold text-white shadow-sm">
              ₹
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                {isEdit ? "Edit Invoice" : "Create Invoice"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {isEdit
                  ? "Update your sales invoice"
                  : "Create a new sales invoice"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm sm:block">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Invoice No
            </p>

            <p className="font-bold text-[#2F9CAF]">
              {invoiceNo || "INV-217"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveInvoice}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F9CAF] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#238293] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? "Saving..." : isEdit ? "Update Invoice" : "Save Invoice"}
          </button>

        </div>
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <div className="space-y-5">

        {/* ===================================================
            INVOICE DETAILS
        ==================================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-1 rounded-full bg-[#2F9CAF]" />

              <div>
                <h2 className="font-bold text-slate-800">
                  Invoice Details
                </h2>

                <p className="text-xs text-slate-400">
                  Basic invoice information
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">

            {/* Invoice No */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Invoice Number
              </label>

              <div className="flex h-11 items-center rounded-xl border border-[#2F9CAF]/20 bg-[#2F9CAF]/10 px-4 font-bold text-[#238293]">
                {invoiceNo}
              </div>
            </div>

            {/* Invoice Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Invoice Date
              </label>

              <input
                type="date"
                value={invoiceDate}
                onChange={(e) =>
                  setInvoiceDate(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
              />
            </div>

            {/* Date of Supply */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Date of Supply
              </label>

              <input
                type="date"
                value={dateOfSupply}
                onChange={(e) =>
                  setDateOfSupply(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
              />
            </div>

          </div>
        </section>

        {/* ===================================================
            CUSTOMER
        ==================================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-1 rounded-full bg-[#2F9CAF]" />

              <div>
                <h2 className="font-bold text-slate-800">
                  Customer
                </h2>

                <p className="text-xs text-slate-400">
                  Select customer for this invoice
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">

            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Select Party
            </label>

            <select
              value={partyId}
              onChange={handlePartyChange}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
            >
              <option value="">
                Select Party
              </option>

              {[...parties]
                .sort((a, b) =>
                  String(a.name || "").localeCompare(
                    String(b.name || "")
                  )
                )
                .map((party) => (
                  <option
                    key={party._id}
                    value={party._id}
                  >
                    {party.name}
                  </option>
                ))}
            </select>

            {/* CUSTOMER INFORMATION */}
            {selectedParty && (
              <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Customer
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedParty.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Mobile
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedParty.mobile || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    GSTIN
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedParty.gstin || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    City / State
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {[selectedParty.city, selectedParty.state]
                      .filter(Boolean)
                      .join(" / ") || "-"}
                  </p>
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <p className="text-xs font-medium text-slate-400">
                    Address
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedParty.address || "-"}
                  </p>
                </div>

              </div>
            )}

          </div>
        </section>

        {/* ===================================================
            DELIVERY ADDRESS
        ==================================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-1 rounded-full bg-[#2F9CAF]" />

              <div>
                <h2 className="font-bold text-slate-800">
                  Delivery Address
                </h2>

                <p className="text-xs text-slate-400">
                  Enter or update delivery details
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Delivery Name
              </label>

              <input
                type="text"
                value={deliveryName}
                onChange={(e) =>
                  setDeliveryName(e.target.value)
                }
                placeholder="Delivery Name"
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
              />
            </div>

            {/* GSTIN */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Delivery GSTIN
              </label>

              <input
                type="text"
                value={deliveryGstin}
                onChange={(e) =>
                  setDeliveryGstin(e.target.value)
                }
                placeholder="GSTIN"
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm uppercase outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Mobile
              </label>

              <input
                type="text"
                value={deliveryMobile}
                onChange={(e) =>
                  setDeliveryMobile(e.target.value)
                }
                placeholder="Mobile Number"
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
              />
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                City
              </label>

              <input
                type="text"
                value={deliveryCity}
                onChange={(e) =>
                  setDeliveryCity(e.target.value)
                }
                placeholder="City"
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
              />
            </div>

            {/* State */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                State
              </label>

              <input
                type="text"
                value={deliveryState}
                onChange={(e) =>
                  setDeliveryState(e.target.value)
                }
                placeholder="State"
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Address
              </label>

              <textarea
                value={deliveryAddress}
                onChange={(e) =>
                  setDeliveryAddress(e.target.value)
                }
                rows={3}
                placeholder="Complete delivery address"
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
              />
            </div>

          </div>
        </section>

        {/* ===================================================
            PRODUCTS
        ==================================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div className="flex items-center gap-3">
              <div className="h-9 w-1 rounded-full bg-[#2F9CAF]" />

              <div>
                <h2 className="font-bold text-slate-800">
                  Products
                </h2>

                <p className="text-xs text-slate-400">
                  Add products to your invoice
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addRow}
              className="rounded-xl bg-[#2F9CAF]/10 px-4 py-2.5 text-sm font-semibold text-[#238293] transition hover:bg-[#2F9CAF]/20"
            >
              + Add Item
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

                  <th className="px-5 py-4 font-semibold">
                    Product
                  </th>

                  <th className="w-28 px-3 py-4 font-semibold">
                    Qty
                  </th>

                  <th className="w-36 px-3 py-4 font-semibold">
                    Rate
                  </th>

                  <th className="w-40 px-3 py-4 text-right font-semibold">
                    Amount
                  </th>

                  <th className="w-28 px-5 py-4 text-center font-semibold">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-slate-100"
                  >

                    {/* PRODUCT */}
                    <td className="px-5 py-4">

                      <input
                        list={`products-${index}`}
                        value={item.product || ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          const selectedProduct =
                            products.find(
                              (product) =>
                                String(product.name)
                                  .trim()
                                  .toLowerCase() ===
                                String(value)
                                  .trim()
                                  .toLowerCase()
                            );

                          setItems((prevItems) => {
                            const updatedItems = [
                              ...prevItems,
                            ];

                            const productName =
                              selectedProduct
                                ? selectedProduct.name
                                : value;

                            const qty =
                              getQtyFromProductName(
                                productName
                              );

                            const rate =
                              selectedProduct
                                ? Number(
                                  selectedProduct.rate
                                ) || 0
                                : Number(
                                  updatedItems[index]
                                    .rate
                                ) || 0;

                            updatedItems[index] = {
                              ...updatedItems[index],
                              product: productName,
                              productId:
                                selectedProduct?._id ||
                                null,
                              qty,
                              rate,
                              total: qty * rate,
                            };

                            return updatedItems;
                          });
                        }}
                        placeholder="Select / type product"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                      />

                      <datalist id={`products-${index}`}>
                        {products.map((product) => (
                          <option
                            key={product._id}
                            value={product.name}
                          />
                        ))}
                      </datalist>

                    </td>

                    {/* QTY */}
                    <td className="px-3 py-4">

                      <input
                        type="number"
                        value={item.qty}
                        readOnly
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700"
                      />

                    </td>

                    {/* RATE */}
                    <td className="px-3 py-4">

                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "rate",
                            e.target.value
                          )
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                      />

                    </td>

                    {/* AMOUNT */}
                    <td className="px-3 py-4 text-right">

                      <div className="font-bold text-slate-800">
                        {money(item.total)}
                      </div>

                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4 text-center">

                      <button
                        type="button"
                        onClick={() =>
                          removeRow(index)
                        }
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        Remove
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

              {/* TOTAL QTY */}
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50">

                  <td
                    colSpan={1}
                    className="px-5 py-4 text-right text-sm font-bold text-slate-600"
                  >
                    TOTAL
                  </td>

                  <td className="px-3 py-4 font-bold text-slate-800">
                    {items.reduce(
                      (sum, item) =>
                        sum + (Number(item.qty) || 0),
                      0
                    )}
                  </td>

                  <td></td>

                  <td className="px-3 py-4 text-right font-bold text-slate-800">
                    {money(subtotal)}
                  </td>

                  <td></td>

                </tr>
              </tfoot>

            </table>

          </div>

          {/* ADD ITEM BOTTOM */}
          <div className="border-t border-slate-100 px-5 py-4 sm:px-6">

            <button
              type="button"
              onClick={addRow}
              className="rounded-xl border border-dashed border-[#2F9CAF] px-4 py-2.5 text-sm font-semibold text-[#238293] transition hover:bg-[#2F9CAF]/5"
            >
              + Add Another Product
            </button>

          </div>

        </section>

        {/* ===================================================
            BOTTOM SUMMARY
        ==================================================== */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* TAX / DISCOUNT SETTINGS */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-1">

            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-slate-800">
                Adjustments
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Discount and GST
              </p>
            </div>

            <div className="space-y-5 p-5">

              {/* DISCOUNT */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Overall Discount %
                </label>

                <div className="relative">

                  <input
                    type="number"
                    min="0"
                    value={discountPercent}
                    onChange={(e) =>
                      setDiscountPercent(
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-12 text-sm font-semibold outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    %
                  </span>

                </div>
              </div>

              {/* GST */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Overall GST %
                </label>

                <div className="relative">

                  <input
                    type="number"
                    min="0"
                    value={gstPercent}
                    onChange={(e) =>
                      setGstPercent(
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-12 text-sm font-semibold outline-none transition focus:border-[#2F9CAF] focus:ring-2 focus:ring-[#2F9CAF]/10"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    %
                  </span>

                </div>
              </div>

              {/* GST SPLIT */}
              <div className="rounded-xl bg-slate-50 p-4">

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    CGST
                  </span>

                  <span className="font-semibold text-slate-700">
                    {(
                      Number(gstPercent || 0) / 2
                    ).toFixed(2)}
                    %
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-500">
                    SGST
                  </span>

                  <span className="font-semibold text-slate-700">
                    {(
                      Number(gstPercent || 0) / 2
                    ).toFixed(2)}
                    %
                  </span>
                </div>

              </div>

            </div>
          </section>

          {/* =================================================
              INVOICE SUMMARY
          ================================================== */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">

            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="font-bold text-slate-800">
                Invoice Summary
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Final amount calculation
              </p>
            </div>

            <div className="p-5 sm:p-6">

              <div className="space-y-4">

                {/* SUBTOTAL */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-slate-800">
                    {money(subtotal)}
                  </span>
                </div>

                {/* DISCOUNT */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Discount
                    {Number(discountPercent) > 0 && (
                      <span className="ml-1 text-xs text-red-400">
                        ({discountPercent}%)
                      </span>
                    )}
                  </span>

                  <span className="font-semibold text-red-500">
                    - {money(discountAmount)}
                  </span>
                </div>

                {/* CGST */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    CGST (
                    {(
                      Number(gstPercent || 0) / 2
                    ).toFixed(2)}
                    %)
                  </span>

                  <span className="font-semibold text-slate-800">
                    {money(cgstAmount)}
                  </span>
                </div>

                {/* SGST */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    SGST (
                    {(
                      Number(gstPercent || 0) / 2
                    ).toFixed(2)}
                    %)
                  </span>

                  <span className="font-semibold text-slate-800">
                    {money(sgstAmount)}
                  </span>
                </div>

                {/* IGST */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    IGST
                  </span>

                  <span className="font-semibold text-slate-800">
                    {money(igstAmount)}
                  </span>
                </div>

                {/* TOTAL GST */}
                <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                  <span className="text-sm font-semibold text-green-700">
                    Total GST
                  </span>

                  <span className="font-bold text-green-700">
                    {money(gstAmount)}
                  </span>
                </div>

                {/* ROUND OFF */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Round Off
                  </span>

                  <span className="font-semibold text-slate-600">
                    {money(roundOff)}
                  </span>
                </div>

              </div>

              {/* GRAND TOTAL */}
              <div className="mt-5 border-t border-slate-200 pt-5">

                <div className="flex flex-col gap-3 rounded-2xl bg-[#2F9CAF]/10 p-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#238293]">
                      Net Payable
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Final rounded invoice amount
                    </p>
                  </div>

                  <div className="text-3xl font-bold text-[#238293]">
                    {money(roundedTotal)}
                  </div>

                </div>

              </div>

            </div>
          </section>

        </div>

        {/* ===================================================
            SAVE BAR
        ==================================================== */}
        <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Invoice Total
            </p>

            <p className="text-xl font-bold text-slate-800">
              {money(roundedTotal)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveInvoice}
            disabled={saving}
            className="w-full rounded-xl bg-[#2F9CAF] px-8 py-3 font-bold text-white shadow-sm transition hover:bg-[#238293] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving
              ? "Saving Invoice..."
              : isEdit
                ? "Update & Print Invoice"
                : "Save & Print Invoice"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Invoices;