
// import { useRef } from "react";
// import { useReactToPrint } from "react-to-print";
// import { useEffect, useState } from "react";
// import html2pdf from "html2pdf.js";
// import {
//   FaDownload,
//   FaPrint,
// } from "react-icons/fa";

// import { useParams } from "react-router-dom";
// import axios from "axios";

// function InvoicePrint() {

//   const img = "/logo.png";

//   const API = import.meta.env.VITE_API_URL;

//   const { id } = useParams();

//   const [invoice, setInvoice] =
//     useState(null);

//   const invoiceRef = useRef();

//   const handlePrint =
//     useReactToPrint({
//       contentRef: invoiceRef,

//       documentTitle: `${invoice?.partyName
//         ?.replace(/[\\/:*?"<>|]/g, "")
//         .replace(/\s+/g, "_")}_${invoice?.invoiceNo}`,



//       pageStyle: `
//   @page {
//     size: A4;
//     margin: 0;
//   }

//   @media print {

//     html,
//     body {
//       width: 210mm;
//       height: 297mm;
//       margin: 0;
//       padding: 0;
//     }

//     body {
//       -webkit-print-color-adjust: exact;
//       print-color-adjust: exact;
//     }

//     #invoice-print {
//       width: 794px !important;
//       min-height: 1123px !important;
//     }

//     #invoice-print table,
// #invoice-print th,
// #invoice-print td {
//   border: 1px solid black !important;
//   border-collapse: collapse !important;
// }

// #invoice-print table {
//   border-collapse: collapse !important;
// }
//   }
// `,
//     });

//   const fetchInvoice =
//     async () => {

//       try {

//         const res =
//           await axios.get(
//             `${API}/invoices/${id}`
//           );

//         setInvoice(res.data);

//       } catch (error) {

//         console.log(error);
//       }
//     };

//   useEffect(() => {



//     const loadProducts = async () => {

//       await fetchInvoice();

//     };



//     loadProducts();



//   }, []);

//   if (!invoice) {

//     return (
//       <h1 className="text-center mt-10 text-3xl">
//         Loading...
//       </h1>
//     );
//   }

//   const getStateCode = (state) => {
//     const stateCodes = {
//       "JAMMU AND KASHMIR": "01",
//       "HIMACHAL PRADESH": "02",
//       "PUNJAB": "03",
//       "CHANDIGARH": "04",
//       "UTTARAKHAND": "05",
//       "HARYANA": "06",
//       "DELHI": "07",
//       "RAJASTHAN": "08",
//       "UTTAR PRADESH": "09",
//       "BIHAR": "10",
//       "SIKKIM": "11",
//       "ARUNACHAL PRADESH": "12",
//       "NAGALAND": "13",
//       "MANIPUR": "14",
//       "MIZORAM": "15",
//       "TRIPURA": "16",
//       "MEGHALAYA": "17",
//       "ASSAM": "18",
//       "WEST BENGAL": "19",
//       "JHARKHAND": "20",
//       "ODISHA": "21",
//       "CHHATTISGARH": "22",
//       "MADHYA PRADESH": "23",
//       "GUJARAT": "24",
//       "DAMAN AND DIU": "25",
//       "DADRA AND NAGAR HAVELI": "26",
//       "MAHARASHTRA": "27",
//       "ANDHRA PRADESH": "28",
//       "KARNATAKA": "29",
//       "GOA": "30",
//       "LAKSHADWEEP": "31",
//       "KERALA": "32",
//       "TAMIL NADU": "33",
//       "PUDUCHERRY": "34",
//       "ANDAMAN AND NICOBAR ISLANDS": "35",
//       "TELANGANA": "36",
//       "ANDHRA PRADESH (NEW)": "37",
//       "LADAKH": "38",
//     };

//     if (!state) return "";

//     return (
//       stateCodes[String(state).trim().toUpperCase()] || ""
//     );
//   };

//   const stateCode =
//     invoice.partyStateCode ||
//     getStateCode(invoice.partyState);

//   const downloadPDF =
//     async () => {

//       try {

//         const element =
//           document.getElementById(
//             "invoice-print"
//           );

//         const opt = {

//           margin: 0,

//           filename: `${invoice.partyName
//             .replace(/[\\/:*?"<>|]/g, "")
//             .replace(/\s+/g, "_")}_${invoice.invoiceNo}.pdf`,

//           image: {
//             type: "jpeg",
//             quality: 1,
//           },

//           html2canvas: {
//             scale: 3,
//             useCORS: true,
//             scrollY: 0,
//           },

//           jsPDF: {
//             unit: "mm",
//             format: "a4",
//             orientation:
//               "portrait",
//           },

//           pagebreak: {
//             mode: [],
//           },
//         };

//         await html2pdf()
//           .set(opt)
//           .from(element)
//           .save();

//       } catch (error) {

//         console.log(error);

//         alert(error.message);
//       }
//     };

//   const totalQty = (invoice.items || []).reduce(
//     (sum, item) => sum + (Number(item.qty) || 0),
//     0
//   );

//   return (

//     <div className="bg-white p-2 md:p-4 max-w-[900px] mx-auto overflow-x-auto">

{/* Buttons */ }
// <div className="flex justify-center md:justify-end gap-2 mb-3">

//   <button
//     onClick={handlePrint}
//     className="bg-[#2F9CAF] text-white w-12 h-12 rounded-xl flex items-center justify-center"
//   >
//     <FaPrint />
//   </button>

//   <button
//     onClick={downloadPDF}
//     className="bg-[#2F9CAF] text-white w-12 h-12 rounded-xl flex items-center justify-center"
//   >
//     <FaDownload />
//   </button>

// </div>

{/* Invoice */ }
// <div
//   ref={invoiceRef}
//   id="invoice-print"
//   className="bg-white p-4"
//   style={{
//     width: "100%",
//     maxWidth: "794px",
//     minHeight: "1123px",
//     margin: "0 auto",
//     background: "#fff",
//   }}
// >

//   <div
//     style={{
//       border:
//         "2px solid black",
//       width: "100%",
//       boxSizing: "border-box",
//     }}
//   >

{/* Header */ }
// <div
//   style={{
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "12px",
//     maxHeight: "130px",
//   }}
// >
{/* Logo */ }
// <img
//   src={img}
//   alt="logo"
//   style={{
//     width: "100%",
//     maxWidth: "250px",
//     objectFit: "contain",
//   }}
// />

{/* Right */ }
//   <div
//     style={{
//       width: "220px",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       paddingTop: "5px",
//     }}
//   >

//     <div
//       style={{

//         fontSize: "12px",
//         padding: "7px 14px",
//         borderRadius: "20px",
//         marginBottom: "8px",
//         textAlign: "center",

//         width: "180px",
//         fontWeight: "800",
//       }}
//     >
//       RETAIL / TAX INVOICE
//     </div>

//     <p
//       style={{
//         fontSize: "12px",
//         margin: "1px 0",
//         textAlign: "center",

//       }}
//     >
//       Cell No: +91 99092 78815
//     </p>

//     <p
//       style={{
//         fontSize: "12px",
//         margin: "1px 0",
//         textAlign: "center",
//       }}
//     >
//       Cell No: +91 97148 44024
//     </p>

//     <p
//       style={{
//         fontSize: "12px",
//         marginTop: "4px",
//         textAlign: "center",
//         fontWeight: "700",
//         lineHeight: "16px",
//       }}
//     >
//       GSTIN : 24AMHPV3134H1Z1
//     </p>

//   </div>

// </div>

{/* Address */ }
// <div
//   className="text-center py-1"
//   style={{
//     backgroundColor:
//       "#1f2937",
//     color: "#ffffff",
//     fontSize: "14px",
//     fontWeight: "600",
//   }}
// >
//   3/4, 2nd Floor,
//   Krishna Business Hub,
//   Near Arjun Park,
//   Punagam Road,
//   Surat-395010
// </div>

{/* Customer */ }
{/* <div
            className="grid grid-cols-2 w-full p-2"
            style={{
              gap: "50px",
              fontSize: "12px",
              fontWeight:
                "600",
            }}
          >/*}

            {/* Left */}
{/* <div className="space-y-1">

              <p>
                <b>Name</b> : {invoice.partyName}
              </p>

              <p>
                <b>P.GSTIN</b> : {invoice.partyGstin}
              </p>

              <p>
                <b>Mobile</b> : {invoice.partyMobile}
              </p>

              <p>
                <b>Address</b> : {invoice.partyAddress}
              </p>

              <p>
                <b>City</b> : {invoice.partyCity}
              </p>

              <p>
                <b>State</b> : {invoice.partyState}
              </p>

            </div> */}

{/* Right */ }
{/* <div
              className="space-y-1"
              style={{
                width: "170px",
                fontSize: "12px",
                lineHeight: "18px",
              }}
            >

              <p>
                <b>Bill No</b> : {invoice.invoiceNo}
              </p>

              <p>
                <b>Date</b> : {
                  invoice.date
                    ? new Date(
                      invoice.date
                    ).toLocaleDateString(
                      "en-GB"
                    )
                    : ""
                }
              </p>

              <p>
                <b>Date of Supply</b> : {
                  invoice.dateOfSupply
                    ? new Date(
                      invoice.dateOfSupply
                    ).toLocaleDateString(
                      "en-GB"
                    )
                    : ""
                }
              </p>

              <p>
                <b>Pincode</b> : {invoice.partyPincode}
              </p>


              <p>
                <b>State Code</b> : {stateCode}
              </p>

            </div>

          </div> */}

{/* ================= INVOICE DETAILS ================= */ }
// <div
//   style={{
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     width: "100%",
//     padding: "7px 10px",
//     borderBottom: "1px solid black",
//     fontSize: "12px",
//     fontWeight: "600",
//   }}
// >

//   <div>
//     <p>
//       <b>Bill No</b> : {invoice.invoiceNo}
//     </p>

//     <p>
//       <b>Date</b> :{" "}
//       {invoice.date
//         ? new Date(invoice.date).toLocaleDateString("en-GB")
//         : "-"}
//     </p>
//   </div>

//   <div>
//     <p>
//       <b>Date of Supply</b> :{" "}
//       {invoice.dateOfSupply
//         ? new Date(invoice.dateOfSupply).toLocaleDateString("en-GB")
//         : "-"}
//     </p>
//   </div>

{/* CUSTOMER + DELIVERY ADDRESS */ }
// <div
//   style={{
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     width: "100%",
//     borderBottom: "1px solid black",
//     fontSize: "12px",
//     fontWeight: "600",
//   }}
// >

{/* ================= BILL TO ================= */ }
// <div
//   style={{
//     padding: "8px 10px",
//     borderRight: "1px solid black",
//     lineHeight: "18px",
//   }}
// >
//   <div
//     style={{
//       fontSize: "13px",
//       fontWeight: "800",
//       marginBottom: "5px",
//       color: "#2F9CAF",
//       textTransform: "uppercase",
//     }}
//   >
//     BILL TO
//   </div>

//   <p>
//     <b>Name</b> : {invoice.partyName || "-"}
//   </p>

//   <p>
//     <b>P.GSTIN</b> : {invoice.partyGstin || "-"}
//   </p>

//   <p>
//     <b>Mobile</b> : {invoice.partyMobile || "-"}
//   </p>

//   <p>
//     <b>Address</b> : {invoice.partyAddress || "-"}
//   </p>

//   <p>
//     <b>City</b> : {invoice.partyCity || "-"}
//   </p>

//   <p>
//     <b>State</b> : {invoice.partyState || "-"}
//   </p>

//   <p>
//     <b>Pincode</b> : {invoice.partyPincode || "-"}
//   </p>

//   <p>
//     <b>State Code</b> : {stateCode || "-"}
//   </p>
// </div>


{/* ================= DELIVERY ADDRESS ================= */ }
//     <div
//       style={{
//         padding: "8px 10px",
//         lineHeight: "18px",
//       }}
//     >
//       <div
//         style={{
//           fontSize: "13px",
//           fontWeight: "800",
//           marginBottom: "5px",
//           color: "#2F9CAF",
//           textTransform: "uppercase",
//         }}
//       >
//         DELIVERY ADDRESS
//       </div>

//       <p>
//         <b>Name</b> :{" "}
//         {invoice.deliveryName ||
//           invoice.partyName ||
//           "-"}
//       </p>

//       <p>
//         <b>GSTIN</b> :{" "}
//         {invoice.deliveryGstin ||
//           invoice.partyGstin ||
//           "-"}
//       </p>

//       <p>
//         <b>Mobile</b> :{" "}
//         {invoice.deliveryMobile ||
//           invoice.partyMobile ||
//           "-"}
//       </p>

//       <p>
//         <b>Address</b> :{" "}
//         {invoice.deliveryAddress ||
//           invoice.partyAddress ||
//           "-"}
//       </p>

//       <p>
//         <b>City</b> :{" "}
//         {invoice.deliveryCity ||
//           invoice.partyCity ||
//           "-"}
//       </p>

//       <p>
//         <b>State</b> :{" "}
//         {invoice.deliveryState ||
//           invoice.partyState ||
//           "-"}
//       </p>

//       <p>
//         <b>Pincode</b> :{" "}
//         {invoice.deliveryPincode ||
//           invoice.partyPincode ||
//           "-"}
//       </p>

//       <p>
//         <b>State Code</b> :{" "}
//         {invoice.deliveryStateCode ||
//           stateCode ||
//           "-"}
//       </p>
//     </div>

//   </div>




// </div>

{/* Table */ }
// <div className="relative">

{/* Watermark */ }
// <img
//   src={img}
//   alt="watermark"
//   className="absolute opacity-15 w-[550px] md:w-[450px] h-[550px] md:h-[450px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
// />
// <div
//   className="w-full"
//   style={{
//     borderTop: "2px solid black",
//     borderBottom: "2px solid black",
//   }}
// >
//   <table
//     className="w-full"
//     style={{
//       tableLayout: "fixed",
//       borderCollapse: "collapse",

//     }}
//   >

//     <thead>

//       <tr
//         style={{
//           backgroundColor:
//             "#2F9CAF",
//           color:
//             "#ffffff",
//         }}
//       >

//         <th
//           style={{
//             borderRight: "1px solid black",
//             padding: "4px",
//             width: "50px",
//           }}
//         >
//           No.
//         </th>

//         <th
//           style={{
//             border: "1px solid black",
//             padding: "4px",
//             width: "300px",
//           }}
//         >
//           Product
//         </th>

//         <th
//           style={{
//             border: "1px solid black",
//             padding: "4px",
//             width: "90px",
//           }}
//         >
//           Qty
//         </th>

//         <th
//           style={{
//             border: "1px solid black",
//             padding: "4px",
//             width: "120px",
//           }}
//         >
//           Rate
//         </th>

//         <th
//           style={{
//             border: "1px solid black",
//             padding: "4px",
//             width: "150px",
//           }}
//         >
//           Amount
//         </th>

//       </tr>

//     </thead>

//     <tbody>

{/* Products */ }
// {invoice.items.map(
//   (
//     item,
//     index
//   ) => (

//     <tr
//       key={index}
//     >

//       <td
//         style={{
//           border:
//             "1px solid black",
//           height:
//             "30px",
//           textAlign:
//             "center",

//         }}
//       >
//         {index + 1}
//       </td>

//       <td
//         style={{
//           border:
//             "1px solid black",
//           padding:
//             "4px",
//         }}
//       >
//         {
//           item.product
//         }
//       </td>

//       <td
//         style={{
//           border:
//             "1px solid black",
//           padding:
//             "4px",
//           textAlign:
//             "center",
//         }}
//       >
//         {item.qty}
//       </td>

//       <td
//         style={{
//           border:
//             "1px solid black",
//           padding:
//             "4px",
//           textAlign:
//             "center",
//         }}
//       >
//         ₹ {item.rate}
//       </td>

//       <td
//         style={{
//           border:
//             "1px solid black",
//           padding:
//             "4px",
//           textAlign:
//             "center",
//         }}
//       >
//         ₹ {
//           (
//             item.total ||
//             0
//           ).toFixed(
//             2
//           )
//         }
//       </td>

//     </tr>
//   )
// )}

{/* Empty Rows */ }
//   {Array.from({
//     length:
//       12 -
//       invoice.items
//         .length,
//   }).map(
//     (
//       _,
//       index
//     ) => (

//       <tr
//         key={`empty-${index}`}
//       >

//         {[1, 2, 3, 4, 5].map(
//           (
//             cell
//           ) => (

//             <td
//               key={
//                 cell
//               }
//               style={{
//                 border:
//                   "1px solid black",
//                 height:
//                   "30px",
//               }}
//             ></td>
//           )
//         )}

//       </tr>
//     )
//   )}

// </tbody>

// <tfoot>
//   <tr>

{/* Total label */ }
// <td
//   colSpan="2"
//   style={{
//     border: "1px solid black",
//     padding: "4px",
//     textAlign: "right",

//   }}
// >
//   TOTAL
// </td>

{/* TOTAL QTY */ }
// <td
//   style={{
//     border: "1px solid black",
//     padding: "4px",
//     textAlign: "center",

//   }}
// >
//   {totalQty}
// </td>

// {/* Rate blank */}
// <td
//   style={{
//     border: "1px solid black",
//     padding: "4px",
//   }}
// />

{/* Amount blank */ }
//           <td
//             style={{
//               border: "1px solid black",
//               padding: "4px",
//             }}
//           />

//         </tr>
//       </tfoot>

//     </table>

//   </div>

// </div>

{/* Bottom */ }
// <div
//   className="grid grid-cols-2"
//   style={{
//     minHeight:
//       "140px",
//   }}
// >

{/* Bank */ }
// <div
//   className="p-3 border-r  min-h-[110px]"
//   style={{
//     borderColor:
//       "black",
//     fontSize:
//       "12px",
//     fontWeight:
//       "600",
//   }}
// >

//   <h3
//     className="font-bold mb-2"
//     style={{
//       color:
//         "#dc2626",
//     }}
//   >
//     BANK DETAILS
//   </h3>

//   <p className="mt-1">
//     <b>Bank Name</b> :
//     IDBI BANK
//   </p>

//   <p className="mt-1">
//     <b>A/c No</b> :
//     0290102000131568
//   </p>

//   <p className="mt-1">
//     <b>IFSC Code</b> :
//     IBKL0000290
//   </p>

//   <p className="mt-1">
//     <b>Branch</b> :
//     Varachha Road
//     Branch,
//     Surat
//   </p>

// </div>

{/* Totals */ }
//   <div
//     style={{
//       fontSize:
//         "12px",
//     }}
//   >

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "4px 6px",
//         alignItems: "center",
//         borderBottom:
//           "1px solid black",
//         fontWeight:
//           "600",
//       }}
//     >
//       <span>
//         Total
//       </span>

//       <span>
//         ₹ {
//           invoice.subtotal.toFixed(
//             2
//           )
//         }
//       </span>
//     </div>

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "4px 6px",
//         alignItems: "center",
//         borderBottom:
//           "1px solid black",
//         fontWeight:
//           "600",
//       }}
//     >

//       <span>
//         Discount (
//         {
//           invoice.discountPercent
//         }
//         %)
//       </span>

//       <span>
//         ₹ {
//           invoice.discountAmount?.toFixed(
//             2
//           )
//         }
//       </span>

//     </div>

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "4px 6px",
//         alignItems: "center",
//         borderBottom: "1px solid black",
//       }}
//     >
//       <span>
//         CGST ({(invoice.gstPercent / 2).toFixed(1)}%)
//       </span>

//       <span>
//         ₹ {(invoice.cgstAmount || 0).toFixed(2)}
//       </span>
//     </div>

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "4px 6px",
//         alignItems: "center",
//         borderBottom: "1px solid black",
//       }}
//     >
//       <span>
//         SGST ({(invoice.gstPercent / 2).toFixed(1)}%)
//       </span>

//       <span>
//         ₹ {(invoice.sgstAmount || 0).toFixed(2)}
//       </span>
//     </div>

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "4px 6px",
//         alignItems: "center",
//         borderBottom: "1px solid black",
//       }}
//     >
//       <span>IGST</span>

//       <span>
//         ₹ {(invoice.igstAmount || 0).toFixed(2)}
//       </span>
//     </div>

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "4px 6px",
//         alignItems: "center",
//         borderBottom: "1px solid black",
//         fontWeight: "700",
//         color: "#15803d",
//       }}
//     >
//       <span>Total GST</span>

//       <span>
//         ₹ {(invoice.gstAmount || 0).toFixed(2)}
//       </span>
//     </div>

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "4px 6px",
//         alignItems: "center",
//         borderBottom:
//           "1px solid black",
//       }}
//     >

//       <span>
//         Round Off
//       </span>

//       <span>
//         ₹ {
//           (
//             Math.ceil(invoice.grandTotal || 0) -
//             (invoice.grandTotal || 0)
//           ).toFixed(2)
//         }
//       </span>

//     </div>

//     <div
//       className="flex justify-between p-1 font-bold"
//       style={{
//         borderBottom:
//           "",
//         fontSize:
//           "15px",
//         textAlign: "center",
//       }}
//     >

//       <span>
//         Net Total
//       </span>

//       <span>
//         ₹ {
//           Math.ceil(
//             invoice.grandTotal || 0
//           ).toFixed(2)
//         }
//       </span>

//     </div>

//   </div>

// </div>

{/* Footer */ }
//           <div
//             className="flex justify-between items-end p-2 min-h-[40px]"
//             style={{
//               borderTop:
//                 "1px solid black",
//             }}
//           >

//             <div>

//               <p className="font-bold">
//                 Thanks...
//               </p>

//               <p
//                 style={{
//                   fontSize:
//                     "12px",
//                   marginTop:
//                     "1px",
//                 }}
//               >
//                 Goods once sold
//                 will not be
//                 taken back. No change material after 7 days.
//               </p>

//               <p
//                 style={{
//                   fontSize:
//                     "12px",
//                   marginTop:
//                     "1px",
//                 }}
//               >
//                 No guarantee in fancy items. Subject to
//                 Surat
//                 jurisdiction.
//               </p>

//               <h3 className="font-bold mt-1">
//                 Receiver Sign
//                 ................
//               </h3>

//             </div>

//             <div
//               style={{
//                 textAlign: "center",
//                 width: "180px",
//               }}
//             >

//               <h2
//                 style={{
//                   color:
//                     "#2F9CAF",
//                   fontSize:
//                     "15px",
//                   fontWeight:
//                     "700",
//                   whiteSpace:
//                     "nowrap",
//                 }}
//               >
//                 For, Dravu
//                 Fashion Hub
//               </h2>

//               <p className="mt-1">
//                 Authorised
//                 Signatory
//               </p>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div >
//   );
// }

// export default InvoicePrint;










import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./InvoicePrint.css";

const COMPANY = {
  name: "Dravu Fashion Hub",
  address:
    "3/4, 2nd Floor, Krishna Business Hub, Near Arjun Park, Punagam Road, Surat - 395010",
  gstin: "24AMHPV3134H1Z1",
  contact1: "+91 99092 78815",
  contact2: "+91 97148 44024",
  logo: "/logo.png",

  bankName: "IDBI BANK",
  accountNo: "0290102000131568",
  ifsc: "IBKL0000290",
  branch: "Varachha Road Branch, Surat",
};

const money = (value) => {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB");
};

// const numberToWords = (num) => {
//   num = Math.floor(Number(num || 0));

//   if (num === 0) return "Zero Rupees Only";

//   const ones = [
//     "",
//     "One",
//     "Two",
//     "Three",
//     "Four",
//     "Five",
//     "Six",
//     "Seven",
//     "Eight",
//     "Nine",
//     "Ten",
//     "Eleven",
//     "Twelve",
//     "Thirteen",
//     "Fourteen",
//     "Fifteen",
//     "Sixteen",
//     "Seventeen",
//     "Eighteen",
//     "Nineteen",
//   ];

//   const tens = [
//     "",
//     "",
//     "Twenty",
//     "Thirty",
//     "Forty",
//     "Fifty",
//     "Sixty",
//     "Seventy",
//     "Eighty",
//     "Ninety",
//   ];

//   const twoDigits = (n) => {
//     if (n < 20) return ones[n];

//     return (
//       tens[Math.floor(n / 10)] +
//       (n % 10 ? " " + ones[n % 10] : "")
//     );
//   };

//   const convert = (n) => {
//     if (n < 100) {
//       return twoDigits(n);
//     }

//     if (n < 1000) {
//       return (
//         ones[Math.floor(n / 100)] +
//         " Hundred" +
//         (n % 100 ? " " + convert(n % 100) : "")
//       );
//     }

//     if (n < 100000) {
//       return (
//         convert(Math.floor(n / 1000)) +
//         " Thousand" +
//         (n % 1000 ? " " + convert(n % 1000) : "")
//       );
//     }

//     if (n < 10000000) {
//       return (
//         convert(Math.floor(n / 100000)) +
//         " Lakh" +
//         (n % 100000 ? " " + convert(n % 100000) : "")
//       );
//     }

//     return (
//       convert(Math.floor(n / 10000000)) +
//       " Crore" +
//       (n % 10000000 ? " " + convert(n % 10000000) : "")
//     );
//   };

//   return `${convert(num)} Rupees Only`;
// };

function InvoicePrint() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `${API}/invoices/${id}`
        );

        setInvoice(response.data);

        console.log("========= PRINT INVOICE DATA =========");
        console.log(response.data);
        console.log("DELIVERY:", {
          deliveryName: response.data.deliveryName,
          deliveryGstin: response.data.deliveryGstin,
          deliveryMobile: response.data.deliveryMobile,
          deliveryAddress: response.data.deliveryAddress,
          deliveryCity: response.data.deliveryCity,
          deliveryState: response.data.deliveryState,
        });

      } catch (error) {
        console.error("FETCH INVOICE ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [API, id]);

  // const getStateCode = () => {
  //   if (invoice?.partyStateCode) {
  //     return invoice.partyStateCode;
  //   }

  //   if (invoice?.stateCode) {
  //     return invoice.stateCode;
  //   }

  //   const gstin =
  //     invoice?.partyGstin ||
  //     invoice?.gstin ||
  //     "";

  //   const match = String(gstin).match(/^\d{2}/);

  //   return match ? match[0] : "-";
  // };


  const handlePrint = () => {
    const oldTitle = document.title;

    const partyName =
      invoice?.partyName || "Party";

    const invoiceNumber =
      invoice?.invoiceNo || "Invoice";

    const safePartyName = String(partyName)
      .trim()
      .replace(/[<>:"/\\|?*]+/g, "-")
      .replace(/\s+/g, "-");

    const safeInvoiceNumber = String(invoiceNumber)
      .trim()
      .replace(/[<>:"/\\|?*]+/g, "-")
      .replace(/\s+/g, "-");

    // PDF filename
    document.title =
      `${safePartyName}-${safeInvoiceNumber}`;

    window.print();

    setTimeout(() => {
      document.title = oldTitle;
    }, 1000);
  };

  if (loading) {
    return (
      <div className="invoice-loading">
        Loading Invoice...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="invoice-loading">
        Invoice not found
      </div>
    );
  }

  const items = invoice.items || [];

  const subtotal = Number(invoice.subtotal || 0);

  const discountAmount = Number(
    invoice.discountAmount || 0
  );

  const gstAmount = Number(
    invoice.gstAmount || 0
  );

  const cgstAmount =
    invoice.taxType === "CGST_SGST"
      ? gstAmount / 2
      : Number(invoice.cgstAmount || 0);

  const sgstAmount =
    invoice.taxType === "CGST_SGST"
      ? gstAmount / 2
      : Number(invoice.sgstAmount || 0);

  const igstAmount =
    invoice.taxType === "IGST"
      ? gstAmount
      : Number(invoice.igstAmount || 0);

  const totalGst =
    cgstAmount +
    sgstAmount +
    igstAmount;

  const rawTotal =
    subtotal -
    discountAmount +
    totalGst;

  const grandTotal = Number(
    invoice.roundedTotal ??
    invoice.grandTotal ??
    rawTotal
  );

  const roundOff =
    invoice.roundOff !== undefined &&
      invoice.roundOff !== null
      ? Number(invoice.roundOff)
      : Number(
        (grandTotal - rawTotal).toFixed(2)
      );

  // const stateCode = getStateCode();

  const totalQty = items.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  const emptyRows = Math.max(0, 9 - items.length);

  return (
    <>
      {/* PRINT BUTTON */}
      <div className="invoice-print-toolbar no-print">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="invoice-back-button"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="invoice-print-button"
        >
          Print
        </button>
      </div>

      {/* A4 BILL */}
      <main className="invoice-a4">

        {/* ================= HEADER ================= */}
        <section className="invoice-header">

          <div className="invoice-logo-area">
            <img
              src={COMPANY.logo}
              alt="Dravu Fashion Hub"
            />
          </div>

          <div className="invoice-company">
            <h1 style={{
              color: " #2F9CAF",
            }}>{COMPANY.name}</h1>

            <h2 style={{ fontWeight: 600 }}>TAX INVOICE</h2>

            <p style={{ fontWeight: 500 }}>
              {COMPANY.address}
            </p>

            <p>
              <strong>
                GSTIN : {COMPANY.gstin}
              </strong>
            </p>
          </div>

          <div className="invoice-contact" style={{}}>
            <p>
              Cell No: {COMPANY.contact1}
            </p>

            <p>
              Cell No: {COMPANY.contact2}
            </p>
          </div>

        </section>


        {/* ================= INVOICE DETAILS ================= */}
        <section className="invoice-details">

          <div className="section-title">
            INVOICE DETAILS
          </div>

          <div className="invoice-details-grid">

            <div className="detail-column">

              <div className="detail-row">
                <strong>Invoice No</strong>
                <span>:</span>
                <strong>
                  {invoice.invoiceNo || "-"}
                </strong>
              </div>

              <div className="detail-row">
                <strong>Invoice Date</strong>
                <span>:</span>
                <strong>
                  {formatDate(invoice.date)}
                </strong>
              </div>

              {/* <div className="detail-row">
                <strong>Date of Supply</strong>
                <span>:</span>
                <span>
                  {formatDate(
                    invoice.dateOfSupply ||
                    invoice.date
                  )}
                </span>
              </div> */}

            </div>

            <div className="detail-column">

              <div className="detail-row">
                <strong>eWayBill No</strong>
                <span>:</span>
                <strong>
                  {invoice.eWayBillNo || "-"}
                </strong>
              </div>

              {/* <div className="detail-row">
                <strong>State Code</strong>
                <span>:</span>
                <span>
                  {stateCode}
                </span>
              </div> */}

              <div className="detail-row">
                <strong>Date of Supply</strong>
                <span>:</span>
                <strong>
                  {formatDate(
                    invoice.dateOfSupply ||
                    invoice.date
                  )}
                </strong>
              </div>

              {/* <div className="detail-row">
                <strong>Due Date</strong>
                <span>:</span>
                <span>
                  {formatDate(
                    invoice.dueDate ||
                    invoice.date
                  )}
                </span>
              </div> */}

            </div>

          </div>
        </section>


        {/* ================= ADDRESS SECTION ================= */}
        <section className="address-grid">

          {/* BILL TO */}
          <div className="address-box">

            <div className="address-title">
              BILL TO
            </div>

            <div className="address-content">

              <p>
                <strong>Name</strong>
                <span>:</span>
                <span>
                  {invoice.partyName || "-"}
                </span>
              </p>

              <p>
                <strong>Address</strong>
                <span>:</span>
                <span>
                  {invoice.partyAddress || "-"}
                </span>
              </p>

              <p>
                <strong>City</strong>
                <span>:</span>
                <span>
                  {invoice.partyCity || "-"}
                </span>
              </p>

              <p>
                <strong>State</strong>
                <span>:</span>
                <span>
                  {invoice.partyState || "-"}
                </span>
              </p>

              <p>
                <strong>Mobile</strong>
                <span>:</span>
                <span>
                  {invoice.partyMobile || "-"}
                </span>
              </p>

              <p>
                <strong>P.GSTIN</strong>
                <span>:</span>
                <span>
                  {invoice.partyGstin || "-"}
                </span>
              </p>

              {/* <p>
                <strong>Pincode</strong>
                <span>:</span>
                <span>
                  {invoice.partyPincode || "-"}
                </span>
              </p> */}

              {/* <p>
                <strong>State Code</strong>
                <span>:</span>
                <span>
                  {stateCode}
                </span>
              </p> */}

            </div>
          </div>


          {/* DELIVERY ADDRESS */}
          <div className="address-box">

            <div className="address-title">
              DELIVERY ADDRESS
            </div>

            <div className="address-content">

              <p>
                <strong>Name</strong>
                <span>:</span>
                <span>
                  {invoice.deliveryName || "-"}
                </span>
              </p>

              <p>
                <strong>Address</strong>
                <span>:</span>
                <span>
                  {invoice.deliveryAddress || "-"}
                </span>
              </p>

              <p>
                <strong>City</strong>
                <span>:</span>
                <span>
                  {invoice.deliveryCity || "-"}
                </span>
              </p>

              <p>
                <strong>State</strong>
                <span>:</span>
                <span>
                  {invoice.deliveryState || "-"}
                </span>
              </p>

              <p>
                <strong>Mobile</strong>
                <span>:</span>
                <span>
                  {invoice.deliveryMobile || "-"}
                </span>
              </p>


              <p>
                <strong>P.GSTIN</strong>
                <span>:</span>
                <span>
                  {invoice.deliveryGstin || "-"}
                </span>
              </p>




              {/* <p>
                <strong>Pincode</strong>
                <span>:</span>
                <span>
                  {getDelivery(
                    "Pincode",
                    invoice.partyPincode
                  )}
                </span>
              </p> */}

              {/* <p>
                <strong>State Code</strong>
                <span>:</span>
                <span>
                  {getDelivery(
                    "StateCode",
                    stateCode
                  )}
                </span>
              </p> */}

            </div>
          </div>

        </section>


        {/* ================= PRODUCT TABLE ================= */}
        <section className="product-section">

          <table className="product-table">

            <thead>
              <tr>
                <th className="sr">No.</th>
                <th className="description">
                  Product Description
                </th>
                <th className="qty">
                  Qty
                </th>
                <th className="rate">
                  Rate
                </th>
                <th className="amount">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>

              {items.map((item, index) => {

                const qty =
                  Number(item.qty || 0);

                const rate =
                  Number(item.rate || 0);

                const total =
                  Number(
                    item.total ??
                    qty * rate
                  );

                return (
                  <tr key={index}>

                    <td style={{
                      textAlign:
                        "center"
                    }}>
                      {index + 1}
                    </td>

                    <td className="product-name">
                      {item.product ||
                        item.productName ||
                        "-"}
                    </td>

                    <td style={{
                      textAlign:
                        "center"
                    }}>
                      {qty}
                    </td>

                    <td style={{
                      textAlign:
                        "center"
                    }}>
                      {money(rate)}
                    </td>

                    <td style={{
                      textAlign:
                        "center"
                    }}>
                      {money(total)}
                    </td>

                  </tr>
                );
              })}

              {/* EMPTY ROWS */}
              {/* {Array.from({
                length: Math.max(
                  0,
                  9 - items.length
                ),
              }).map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  className="empty-product-row"
                >
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))} */}

              {Array.from({ length: emptyRows }).map((_, index) => (
                <tr key={`empty-${index}`} className="empty-product-row">
                  <td className="sr">
                    {items.length + index + 1}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}

            </tbody>

            <tfoot >
              <tr className="total-qty-row" >
                <td colSpan="2" className="total-qty-label" style={{
                  textAlign:
                    "right"
                }}>
                  TOTAL
                </td>

                <td className="total-qty-value" style={{
                  textAlign:
                    "center"
                }}>
                  {totalQty}
                </td>

                <td></td>
                <td></td>
              </tr>
            </tfoot>

          </table>

        </section>


        {/* ================= BANK + TOTAL ================= */}
        <section className="bottom-grid">

          {/* BANK */}
          <div className="bank-box">

            <div className="bottom-title">
              BANK DETAILS
            </div>

            <div className="bank-content">

              <p>
                <strong>Bank Name</strong>
                <span>:</span>
                <span>
                  {COMPANY.bankName}
                </span>
              </p>

              <p>
                <strong>A/c No</strong>
                <span>:</span>
                <span>
                  {COMPANY.accountNo}
                </span>
              </p>

              <p>
                <strong>IFSC Code</strong>
                <span>:</span>
                <span>
                  {COMPANY.ifsc}
                </span>
              </p>

              <p>
                <strong>Branch</strong>
                <span>:</span>
                <span>
                  {COMPANY.branch}
                </span>
              </p>

            </div>

          </div>


          {/* TOTALS */}
          <div className="totals-box">

            <div className="total-row">
              <strong>Total (₹)</strong>
              <span style={{
                fontWeight: "600",

              }} >
                {money(subtotal)}
              </span>
            </div>

            <div className="total-row">
              <span>
                Discount (
                {Number(
                  invoice.discountPercent || 0
                )}
                %)
              </span>
              <span>
                {money(discountAmount)}
              </span>
            </div>

            <div className="total-row">
              <span>
                CGST (
                {invoice.taxType ===
                  "CGST_SGST"
                  ? Number(
                    invoice.gstPercent ||
                    0
                  ) / 2
                  : 0}
                %)
              </span>
              <span>
                {money(cgstAmount)}
              </span>
            </div>

            <div className="total-row">
              <span>
                SGST (
                {invoice.taxType ===
                  "CGST_SGST"
                  ? Number(
                    invoice.gstPercent ||
                    0
                  ) / 2
                  : 0}
                %)
              </span>
              <span>
                {money(sgstAmount)}
              </span>
            </div>

            <div className="total-row">
              <span>IGST</span>
              <span>
                {money(igstAmount)}
              </span>
            </div>

            <div className="total-row" style={{
              color: "#15803d",
              fontWeight: "600",
            }}>
              <span>Total GST</span>
              <span>
                {money(totalGst)}
              </span>
            </div>

            <div className="total-row">
              <span>Round Off</span>
              <span>
                {money(roundOff)}
              </span>
            </div>

            <div className="total-row net-total">
              <strong>Net Total (₹)</strong>
              <strong>
                {money(grandTotal)}
              </strong>
            </div>

          </div>

        </section>


        {/* ================= AMOUNT WORDS ================= */}
        {/* <section className="amount-words">

          <strong>
            Amount in Words :
          </strong>{" "}

          {numberToWords(grandTotal)}

        </section> */}


        {/* ================= FOOTER ================= */}
        {/* <section className="invoice-footer">

          <div className="terms">

            <h3>
              Terms & Conditions :
            </h3>

            <ol>
              <li>
                Goods once sold will not be
                taken back. No change
                material after 7 days.
              </li>

              <li>
                No guarantee in fancy items.
                Subject to Surat jurisdiction.
              </li>

              <li>
                Payment to be made by Cash /
                Cheque / NEFT / RTGS.
              </li>

              <li>
                Any dispute subject to Surat
                jurisdiction only.
              </li>

              <li>
                Thank you for your business.
              </li>
            </ol>

          </div>


          <div className="signature">

            <h3>
              For, {COMPANY.name}
            </h3>

            <div className="signature-space"></div>

            <strong>
              Authorised Signatory
            </strong>

          </div>

        </section> */}



        <div
          className="flex justify-between items-end p-2 min-h-[40px] invoice-thanks-divider"
          style={{
            borderTop:
              "1px solid black",
          }}
        >

          <div >

            <p className="font-bold" style={{ fontSize: "11px" }}>
              Thanks...
            </p>

            <p
              style={{
                fontSize:
                  "12px",
                marginTop:
                  "1px",
              }}
            >
              Goods once sold
              will not be
              taken back. No change material after 7 days.
            </p>

            <p
              style={{
                fontSize:
                  "12px",
                marginTop:
                  "1px",
              }}
            >
              No guarantee in fancy items. Subject to
              Surat
              jurisdiction.
            </p>

            <h3 className="font-bold mt-1" style={{ fontSize: "12px", paddingTop: "5px" }}>
              Receiver Sign
              .......................
            </h3>

          </div>

          <div
            style={{
              paddingTop: "2px",
              textAlign: "center",
              width: "180px",
            }}
          >

            <h2
              style={{
                color:
                  "#2F9CAF",
                fontSize:
                  "17px",
                fontWeight:
                  "700",
                whiteSpace:
                  "nowrap",
              }}
            >
              For, Dravu
              Fashion Hub
            </h2>

            <p className="mt-1" style={{ fontSize: "12px" }}>
              Authorised
              Signatory
            </p>

          </div>

        </div>


        {/* ================= RECEIVER ================= */}
        {/* <div className="receiver-row">

          <div>
            <strong>
              Receiver Sign :
            </strong>

            <span className="receiver-line"></span>
          </div>

          <strong>
            Thanks...
          </strong>

        </div> */}

      </main >
    </>
  );
}

export default InvoicePrint;