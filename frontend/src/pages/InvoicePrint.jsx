
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import {
  FaDownload,
  FaPrint,
} from "react-icons/fa";

import { useParams } from "react-router-dom";
import axios from "axios";

function InvoicePrint() {

  const img = "/logo.png";

  const API = import.meta.env.VITE_API_URL;

  const { id } = useParams();

  const [invoice, setInvoice] =
    useState(null);

  const invoiceRef = useRef();

  const handlePrint =
    useReactToPrint({
      contentRef: invoiceRef,

      documentTitle: `${invoice?.partyName
        ?.replace(/[\\/:*?"<>|]/g, "")
        .replace(/\s+/g, "_")}_${invoice?.invoiceNo}`,



      pageStyle: `
  @page {
    size: A4;
    margin: 0;
  }

  @media print {

    html,
    body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
    }

    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    #invoice-print {
      width: 794px !important;
      min-height: 1123px !important;
    }

    #invoice-print table,
#invoice-print th,
#invoice-print td {
  border: 1px solid black !important;
  border-collapse: collapse !important;
}

#invoice-print table {
  border-collapse: collapse !important;
}
  }
`,
    });

  const fetchInvoice =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/invoices/${id}`
          );

        setInvoice(res.data);

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {



    const loadProducts = async () => {

      await fetchInvoice();

    };



    loadProducts();



  }, []);

  if (!invoice) {

    return (
      <h1 className="text-center mt-10 text-3xl">
        Loading...
      </h1>
    );
  }

  const downloadPDF =
    async () => {

      try {

        const element =
          document.getElementById(
            "invoice-print"
          );

        const opt = {

          margin: 0,

          filename: `${invoice.partyName
            .replace(/[\\/:*?"<>|]/g, "")
            .replace(/\s+/g, "_")}_${invoice.invoiceNo}.pdf`,

          image: {
            type: "jpeg",
            quality: 1,
          },

          html2canvas: {
            scale: 3,
            useCORS: true,
            scrollY: 0,
          },

          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation:
              "portrait",
          },

          pagebreak: {
            mode: [],
          },
        };

        await html2pdf()
          .set(opt)
          .from(element)
          .save();

      } catch (error) {

        console.log(error);

        alert(error.message);
      }
    };

  return (

    <div className="bg-white p-2 md:p-4 max-w-[900px] mx-auto overflow-x-auto">

      {/* Buttons */}
      <div className="flex justify-center md:justify-end gap-2 mb-3">

        <button
          onClick={handlePrint}
          className="bg-[#2F9CAF] text-white w-12 h-12 rounded-xl flex items-center justify-center"
        >
          <FaPrint />
        </button>

        <button
          onClick={downloadPDF}
          className="bg-[#2F9CAF] text-white w-12 h-12 rounded-xl flex items-center justify-center"
        >
          <FaDownload />
        </button>

      </div>

      {/* Invoice */}
      <div
        ref={invoiceRef}
        id="invoice-print"
        className="bg-white p-4"
        style={{
          width: "100%",
          maxWidth: "794px",
          minHeight: "1123px",
          margin: "0 auto",
          background: "#fff",
        }}
      >

        <div
          style={{
            border:
              "2px solid black",
            width: "100%",
            boxSizing: "border-box",
          }}
        >

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              maxHeight: "130px",
            }}
          >
            {/* Logo */}
            <img
              src={img}
              alt="logo"
              style={{
                width: "100%",
                maxWidth: "250px",
                objectFit: "contain",
              }}
            />

            {/* Right */}
            <div
              style={{
                width: "220px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "5px",
              }}
            >

              <div
                style={{

                  fontSize: "12px",
                  padding: "7px 14px",
                  borderRadius: "20px",
                  marginBottom: "8px",
                  textAlign: "center",

                  width: "180px",
                  fontWeight: "800",
                }}
              >
                RETAIL / TAX INVOICE
              </div>

              <p
                style={{
                  fontSize: "12px",
                  margin: "1px 0",
                  textAlign: "center",

                }}
              >
                Cell No: +91 99092 78815
              </p>

              <p
                style={{
                  fontSize: "12px",
                  margin: "1px 0",
                  textAlign: "center",
                }}
              >
                Cell No: +91 97148 44024
              </p>

              <p
                style={{
                  fontSize: "12px",
                  marginTop: "4px",
                  textAlign: "center",
                  fontWeight: "700",
                  lineHeight: "16px",
                }}
              >
                GSTIN : 24AMHPV3134H1Z1
              </p>

            </div>

          </div>

          {/* Address */}
          <div
            className="text-center py-1"
            style={{
              backgroundColor:
                "#1f2937",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            3/4, 2nd Floor,
            Krishna Business Hub,
            Near Arjun Park,
            Punagam Road,
            Surat-395010
          </div>

          {/* Customer */}
          <div
            className="grid grid-cols-2 w-full p-2"
            style={{
              gap: "50px",
              fontSize: "12px",
              fontWeight:
                "600",
            }}
          >

            {/* Left */}
            <div className="space-y-1">

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



            </div>

            {/* Right */}
            <div
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
                <b>State Code</b> : 24
              </p>

            </div>

          </div>

          {/* Table */}
          <div className="relative">

            {/* Watermark */}
            <img
              src={img}
              alt="watermark"
              className="absolute opacity-15 w-[550px] md:w-[450px] h-[550px] md:h-[450px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />
            <div
              className="w-full"
              style={{
                borderTop: "2px solid black",
                borderBottom: "2px solid black",
              }}
            >
              <table
                className="w-full"
                style={{
                  tableLayout: "fixed",
                  borderCollapse: "collapse",

                }}
              >

                <thead>

                  <tr
                    style={{
                      backgroundColor:
                        "#2F9CAF",
                      color:
                        "#ffffff",
                    }}
                  >

                    <th
                      style={{
                        border: "1px solid black",
                        padding: "4px",
                        width: "50px",
                      }}
                    >
                      No.
                    </th>

                    <th
                      style={{
                        border: "1px solid black",
                        padding: "4px",
                        width: "300px",
                      }}
                    >
                      Product
                    </th>

                    <th
                      style={{
                        border: "1px solid black",
                        padding: "4px",
                        width: "90px",
                      }}
                    >
                      Qty
                    </th>

                    <th
                      style={{
                        border: "1px solid black",
                        padding: "4px",
                        width: "120px",
                      }}
                    >
                      Rate
                    </th>

                    <th
                      style={{
                        border: "1px solid black",
                        padding: "4px",
                        width: "150px",
                      }}
                    >
                      Amount
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {/* Products */}
                  {invoice.items.map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={index}
                      >

                        <td
                          style={{
                            border:
                              "1px solid black",
                            height:
                              "30px",
                            textAlign:
                              "center",

                          }}
                        >
                          {index + 1}
                        </td>

                        <td
                          style={{
                            border:
                              "1px solid black",
                            padding:
                              "4px",
                          }}
                        >
                          {
                            item.product
                          }
                        </td>

                        <td
                          style={{
                            border:
                              "1px solid black",
                            padding:
                              "4px",
                            textAlign:
                              "center",
                          }}
                        >
                          {item.qty}
                        </td>

                        <td
                          style={{
                            border:
                              "1px solid black",
                            padding:
                              "4px",
                            textAlign:
                              "center",
                          }}
                        >
                          ₹ {item.rate}
                        </td>

                        <td
                          style={{
                            border:
                              "1px solid black",
                            padding:
                              "4px",
                            textAlign:
                              "center",
                          }}
                        >
                          ₹ {
                            (
                              item.total ||
                              0
                            ).toFixed(
                              2
                            )
                          }
                        </td>

                      </tr>
                    )
                  )}

                  {/* Empty Rows */}
                  {Array.from({
                    length:
                      12 -
                      invoice.items
                        .length,
                  }).map(
                    (
                      _,
                      index
                    ) => (

                      <tr
                        key={`empty-${index}`}
                      >

                        {[1, 2, 3, 4, 5].map(
                          (
                            cell
                          ) => (

                            <td
                              key={
                                cell
                              }
                              style={{
                                border:
                                  "1px solid black",
                                height:
                                  "30px",
                              }}
                            ></td>
                          )
                        )}

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* Bottom */}
          <div
            className="grid grid-cols-2"
            style={{
              minHeight:
                "140px",
            }}
          >

            {/* Bank */}
            <div
              className="p-3 border-r  min-h-[110px]"
              style={{
                borderColor:
                  "black",
                fontSize:
                  "12px",
                fontWeight:
                  "600",
              }}
            >

              <h3
                className="font-bold mb-2"
                style={{
                  color:
                    "#dc2626",
                }}
              >
                BANK DETAILS
              </h3>

              <p className="mt-1">
                <b>Bank Name</b> :
                IDBI BANK
              </p>

              <p className="mt-1">
                <b>A/c No</b> :
                0290102000131568
              </p>

              <p className="mt-1">
                <b>IFSC Code</b> :
                IBKL0000290
              </p>

              <p className="mt-1">
                <b>Branch</b> :
                Varachha Road
                Branch,
                Surat
              </p>

            </div>

            {/* Totals */}
            <div
              style={{
                fontSize:
                  "12px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 6px",
                  alignItems: "center",
                  borderBottom:
                    "1px solid black",
                  fontWeight:
                    "600",
                }}
              >
                <span>
                  Total
                </span>

                <span>
                  ₹ {
                    invoice.subtotal.toFixed(
                      2
                    )
                  }
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 6px",
                  alignItems: "center",
                  borderBottom:
                    "1px solid black",
                  fontWeight:
                    "600",
                }}
              >

                <span>
                  Discount (
                  {
                    invoice.discountPercent
                  }
                  %)
                </span>

                <span>
                  ₹ {
                    invoice.discountAmount?.toFixed(
                      2
                    )
                  }
                </span>

              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 6px",
                  alignItems: "center",
                  borderBottom: "1px solid black",
                }}
              >
                <span>
                  CGST ({(invoice.gstPercent / 2).toFixed(1)}%)
                </span>

                <span>
                  ₹ {(invoice.cgstAmount || 0).toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 6px",
                  alignItems: "center",
                  borderBottom: "1px solid black",
                }}
              >
                <span>
                  SGST ({(invoice.gstPercent / 2).toFixed(1)}%)
                </span>

                <span>
                  ₹ {(invoice.sgstAmount || 0).toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 6px",
                  alignItems: "center",
                  borderBottom: "1px solid black",
                }}
              >
                <span>IGST</span>

                <span>
                  ₹ {(invoice.igstAmount || 0).toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 6px",
                  alignItems: "center",
                  borderBottom: "1px solid black",
                  fontWeight: "700",
                  color: "#15803d",
                }}
              >
                <span>Total GST</span>

                <span>
                  ₹ {(invoice.gstAmount || 0).toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 6px",
                  alignItems: "center",
                  borderBottom:
                    "1px solid black",
                }}
              >

                <span>
                  Round Off
                </span>

                <span>
                  ₹ {
                    (
                      Math.ceil(invoice.grandTotal || 0) -
                      (invoice.grandTotal || 0)
                    ).toFixed(2)
                  }
                </span>

              </div>

              <div
                className="flex justify-between p-1 font-bold"
                style={{
                  borderBottom:
                    "",
                  fontSize:
                    "15px",
                  textAlign: "center",
                }}
              >

                <span>
                  Net Total
                </span>

                <span>
                  ₹ {
                    Math.ceil(
                      invoice.grandTotal || 0
                    ).toFixed(2)
                  }
                </span>

              </div>

            </div>

          </div>

          {/* Footer */}
          <div
            className="flex justify-between items-end p-2 min-h-[40px]"
            style={{
              borderTop:
                "1px solid black",
            }}
          >

            <div>

              <p className="font-bold">
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

              <h3 className="font-bold mt-1">
                Receiver Sign
                ................
              </h3>

            </div>

            <div
              style={{
                textAlign: "center",
                width: "180px",
              }}
            >

              <h2
                style={{
                  color:
                    "#2F9CAF",
                  fontSize:
                    "15px",
                  fontWeight:
                    "700",
                  whiteSpace:
                    "nowrap",
                }}
              >
                For, Dravu
                Fashion Hub
              </h2>

              <p className="mt-1">
                Authorised
                Signatory
              </p>

            </div>

          </div>

        </div>

      </div>

    </div >
  );
}

export default InvoicePrint;