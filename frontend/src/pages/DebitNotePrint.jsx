

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  FaPrint,
  FaDownload,
} from "react-icons/fa";

import {
  useReactToPrint,
} from "react-to-print";

import html2pdf from "html2pdf.js";


function DebitNotePrint() {

  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const API =
    import.meta.env.VITE_API_URL;


  const [debitNote, setDebitNote] =
    useState(null);


  const printRef =
    useRef();


  // ======================================
  // FETCH
  // ======================================

  useEffect(() => {

    const fetchDebitNote =
      async () => {

        try {

          const res =
            await axios.get(
              `${API}/debit-notes/${id}`
            );

          setDebitNote(
            res.data
          );

        } catch (error) {

          console.error(
            "Debit note fetch error:",
            error
          );

        }

      };


    fetchDebitNote();

  }, [API, id]);


  // ======================================
  // PRINT
  // ======================================

  const handlePrint =
    useReactToPrint({

      contentRef:
        printRef,

      documentTitle:
        debitNote?.debitNoteNo ||
        "Debit Note",

      pageStyle: `

        @page {
          size: A4;
          margin: 0;
        }

        @media print {

          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          html,
          body {
            width: 210mm;
            min-height: 297mm;
          }

          .no-print {
            display: none !important;
          }

        }

      `,
    });


  // ======================================
  // PDF
  // ======================================

  const downloadPDF =
    async () => {

      try {

        const element =
          printRef.current;


        const options = {

          margin: 0,

          filename:
            `${debitNote.debitNoteNo}.pdf`,

          image: {
            type: "jpeg",
            quality: 1,
          },

          html2canvas: {
            scale: 2,
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
          .set(options)
          .from(element)
          .save();

      } catch (error) {

        console.error(error);

        alert(
          error.message
        );
      }
    };


  if (!debitNote) {

    return (

      <div className="text-center mt-10">

        Loading Debit Note...

      </div>

    );
  }


  const formatDate =
    (value) => {

      if (!value) return "";

      return new Date(
        value
      ).toLocaleDateString(
        "en-GB"
      );
    };

  const subtotalValue = Number(
    debitNote.subtotal || 0
  );

  const gstValue = Number(
    debitNote.gstAmount || 0
  );

  const totalBeforeRound =
    subtotalValue + gstValue;

  const finalDebitTotal =
    debitNote.roundedTotal != null
      ? Number(debitNote.roundedTotal)
      : Math.ceil(totalBeforeRound);

  const finalRoundOff =
    Number(
      (finalDebitTotal - totalBeforeRound).toFixed(2)
    );

  return (

    <div className="bg-gray-100 min-h-screen p-4">


      {/* BUTTONS */}

      <div className="no-print flex justify-end gap-3 max-w-[800px] mx-auto mb-4">

        <button
          onClick={() =>
            navigate(-1)
          }
          className="px-4 py-3 bg-gray-600 text-white rounded-lg"
        >

          Back

        </button>


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


      {/* PRINT PAGE */}

      <div
        ref={printRef}
        id="debit-note-print"
        style={{

          width: "760px",

          minHeight:
            "1080px",

          margin:
            "0 auto",

          background:
            "#ffffff",

          padding:
            "12px",

          boxSizing:
            "border-box",

        }}
      >


        {/* OUTER BORDER */}

        <div
          style={{

            border:
              "2px solid #9ca3af",

            width:
              "100%",

            boxSizing:
              "border-box",

          }}
        >


          {/* HEADER */}

          <div
            style={{

              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              padding:
                "12px",

              maxHeight:
                "130px",

            }}
          >


            <img
              src="/logo.png"

              alt="Dravu Fashion Hub"
              style={{
                width: "100%",
                maxWidth: "250px",
                objectFit: "contain",
              }}
            />



            <div
              style={{

                width:
                  "240px",

                textAlign:
                  "center",

                fontSize:
                  "12px",

              }}
            >

              <div
                style={{

                  fontSize:
                    "15px",

                  fontWeight:
                    "800",

                  marginBottom:
                    "10px",

                }}
              >

                DEBIT NOTE

              </div>


              <p
                style={{
                  margin:
                    "2px 0",
                }}
              >

                Cell No:
                +91 99092 78815

              </p>


              <p
                style={{
                  margin:
                    "2px 0",
                }}
              >

                Cell No:
                +91 97148 44024

              </p>


              <p
                style={{

                  marginTop:
                    "5px",

                  fontWeight:
                    "700",

                }}
              >

                GSTIN :
                24AMHPV3134H1Z1

              </p>

            </div>

          </div>


          {/* ADDRESS */}

          <div
            style={{

              background:
                "#1f2937",

              color:
                "#ffffff",

              textAlign:
                "center",

              padding:
                "5px",

              fontSize:
                "13px",

              fontWeight:
                "600",

            }}
          >

            3/4, 2nd Floor,
            Krishna Business Hub,
            Near Arjun Park,
            Punagam Road,
            Surat-395010

          </div>


          {/* SUPPLIER + NOTE DETAILS */}

          <div
            style={{

              display:
                "grid",

              gridTemplateColumns:
                "1fr 1fr",

              gap:
                "20px",

              padding:
                "12px",

              fontSize:
                "12px",

              minHeight:
                "130px",

            }}
          >


            {/* SUPPLIER */}

            <div>

              <p>
                <b>Party Name :</b>{" "}
                {debitNote.supplierName}
              </p>

              <p>
                <b>P.GSTIN :</b>{" "}
                {debitNote.supplierGstin}
              </p>


              <p>
                <b>Mobile :</b>{" "}
                {debitNote.supplierMobile}
              </p>


              <p>
                <b>Address :</b>{" "}
                {debitNote.supplierAddress}
              </p>


              <p>
                <b>City :</b>{" "}
                {debitNote.supplierCity}
              </p>



            </div>


            {/* NOTE */}

            <div
              style={{
                paddingLeft:
                  "30px",
              }}
            >

              <p>

                <b>Debit Note No :</b>{" "}
                {debitNote.debitNoteNo}

              </p>


              <p>

                <b>Date :</b>{" "}
                {formatDate(
                  debitNote.date
                )}

              </p>

              <p>
                <b>State :</b>{" "}
                {debitNote.supplierState}
              </p>


              <p>
                <b>Pincode :</b>{" "}
                {debitNote.supplierPincode}
              </p>


            </div>

          </div>


          {/* ITEMS */}

          <table
            style={{

              width:
                "100%",

              borderCollapse:
                "collapse",

              fontSize:
                "12px",

            }}
          >

            <thead>

              <tr
                style={{

                  background:
                    "#5E7E95",

                  color:
                    "#ffffff",

                }}
              >

                <th
                  style={{
                    border:
                      "1px solid #9ca3af",

                    padding:
                      "7px",

                    width:
                      "50px",
                  }}
                >
                  No.
                </th>


                <th
                  style={{
                    border:
                      "1px solid #9ca3af",

                    padding:
                      "7px",

                    textAlign:
                      "left",
                  }}
                >
                  Material
                </th>


                <th
                  style={{
                    border:
                      "1px solid #9ca3af",

                    padding:
                      "7px",

                    width:
                      "80px",
                  }}
                >
                  Qty
                </th>


                <th
                  style={{
                    border:
                      "1px solid #9ca3af",

                    padding:
                      "7px",

                    width:
                      "110px",
                  }}
                >
                  Rate
                </th>


                <th
                  style={{
                    border:
                      "1px solid #9ca3af",

                    padding:
                      "7px",

                    width:
                      "130px",
                  }}
                >
                  Amount
                </th>

              </tr>

            </thead>


            <tbody>

              {debitNote.items.map(
                (item, index) => (

                  <tr
                    key={item._id || index}
                  >

                    <td
                      style={{
                        border:
                          "1px solid #d1d5db",

                        padding:
                          "7px",

                        textAlign:
                          "center",

                        height:
                          "28px",
                        fontWeight:
                          "600",
                      }}
                    >
                      {index + 1}
                    </td>


                    <td
                      style={{
                        border:
                          "1px solid #d1d5db",

                        padding:
                          "7px",
                        fontWeight:
                          "600",
                      }}
                    >
                      {item.product}
                    </td>


                    <td
                      style={{
                        border:
                          "1px solid #d1d5db",

                        padding:
                          "7px",

                        textAlign:
                          "center",
                        fontWeight:
                          "600",
                      }}
                    >
                      {item.qty}
                    </td>


                    <td
                      style={{
                        border:
                          "1px solid #d1d5db",

                        padding:
                          "7px",

                        textAlign:
                          "center",
                        fontWeight:
                          "600",
                      }}
                    >
                      ₹{" "}
                      {Number(
                        item.rate
                      ).toFixed(2)}
                    </td>


                    <td
                      style={{
                        border:
                          "1px solid #d1d5db",

                        padding:
                          "7px",

                        textAlign:
                          "center",
                        fontWeight:
                          "600",
                      }}
                    >
                      ₹{" "}
                      {Number(
                        item.total
                      ).toFixed(2)}
                    </td>

                  </tr>

                )
              )}


              {/* EMPTY ROWS */}

              {Array.from({

                length:
                  Math.max(
                    0,
                    10 -
                    debitNote.items
                      .length
                  ),

              }).map(
                (_, index) => (

                  <tr
                    key={
                      `empty-${index}`
                    }
                  >

                    {[1, 2, 3, 4, 5].map(
                      (cell) => (

                        <td
                          key={cell}
                          style={{
                            border:
                              "1px solid #d1d5db",

                            height:
                              "28px",
                          }}
                        />

                      )
                    )}

                  </tr>

                )
              )}

            </tbody>

          </table>


          {/* BOTTOM */}

          <div
            style={{

              display:
                "grid",

              gridTemplateColumns:
                "1fr 1fr",

              minHeight:
                "180px",

            }}
          >


            {/* LEFT */}

            <div
              style={{

                padding:
                  "12px",

                borderRight:
                  "1px solid #9ca3af",

                fontSize:
                  "12px",

              }}
            >

              <h3
                style={{
                  color:
                    "#dc2626",

                  fontWeight:
                    "700",

                }}
              >

                PURCHASE DEBIT NOTE

              </h3>


              <p
                style={{
                  marginTop:
                    "10px",
                }}
              >

                <b>Reason:</b>{" "}
                {debitNote.reason}

              </p>


              {debitNote.note && (

                <p
                  style={{
                    marginTop:
                      "10px",
                  }}
                >

                  <b>Note:</b>{" "}
                  {debitNote.note}

                </p>

              )}

            </div>


            {/* TOTALS */}

            <div
              style={{
                fontSize:
                  "12px",
              }}
            >

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  padding:
                    "7px",

                  borderBottom:
                    "1px solid #d1d5db",
                  fontWeight:
                    "600",
                }}
              >

                <span>
                  Subtotal
                </span>

                <span>
                  ₹{" "}
                  {Number(
                    debitNote.subtotal ||
                    0
                  ).toFixed(2)}
                </span>

              </div>


              {debitNote.taxType ===
                "CGST_SGST" && (

                  <>

                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        padding:
                          "7px",

                        borderBottom:
                          "1px solid #d1d5db",
                      }}
                    >

                      <span>
                        CGST (
                        {(
                          Number(
                            debitNote.gstPercent ||
                            0
                          ) / 2
                        ).toFixed(2)}
                        %)
                      </span>

                      <span>
                        ₹{" "}
                        {Number(
                          debitNote.cgstAmount ||
                          0
                        ).toFixed(2)}
                      </span>

                    </div>


                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        padding:
                          "7px",

                        borderBottom:
                          "1px solid #d1d5db",
                      }}
                    >

                      <span>
                        SGST (
                        {(
                          Number(
                            debitNote.gstPercent ||
                            0
                          ) / 2
                        ).toFixed(2)}
                        %)
                      </span>

                      <span>
                        ₹{" "}
                        {Number(
                          debitNote.sgstAmount ||
                          0
                        ).toFixed(2)}
                      </span>

                    </div>

                  </>

                )}


              {debitNote.taxType ===
                "IGST" && (

                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      padding:
                        "7px",

                      borderBottom:
                        "1px solid #d1d5db",
                    }}
                  >

                    <span>
                      IGST (
                      {Number(
                        debitNote.gstPercent ||
                        0
                      ).toFixed(2)}
                      %)
                    </span>

                    <span>
                      ₹{" "}
                      {Number(
                        debitNote.igstAmount ||
                        0
                      ).toFixed(2)}
                    </span>

                  </div>

                )}


              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  padding:
                    "7px",

                  borderBottom:
                    "1px solid #d1d5db",

                  fontWeight:
                    "600",
                }}
              >

                <span>
                  Total GST
                </span>

                <span>
                  ₹{" "}
                  {Number(
                    debitNote.gstAmount ||
                    0
                  ).toFixed(2)}
                </span>

              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px",
                  borderBottom: "1px solid #d1d5db",
                }}
              >
                <span>
                  Round Off
                </span>

                <span>
                  ₹ {finalRoundOff.toFixed(2)}
                </span>
              </div>



              {/* <div className="summary-row">
                <span>Round Off</span>

                <span>
                  ₹ {Number(debitNote.roundOff || 0).toFixed(2)}
                </span>
              </div>

              <div className="summary-row total">
                <span>Debit Total</span>

                <span>
                  ₹{" "}
                  {Number(
                    debitNote.roundedTotal ??
                    debitNote.grandTotal ??
                    0
                  ).toFixed(2)}
                </span>
              </div> */}


              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  padding:
                    "9px",

                  fontSize:
                    "15px",

                  fontWeight:
                    "700",
                }}
              >

                <span>
                  Debit Total
                </span>

                <span>
                  ₹ {finalDebitTotal.toFixed(2)}
                </span>

              </div>

            </div>

          </div>


          {/* FOOTER */}

          <div
            style={{

              borderTop:
                "1px solid #9ca3af",

              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "flex-end",

              padding:
                "12px",

              minHeight:
                "65px",

              fontSize:
                "12px",

            }}
          >

            <div>

              <b>
                Receiver Sign
              </b>

              <br />

              ........................

            </div>


            <div
              style={{
                textAlign:
                  "center",
              }}
            >

              <div
                style={{

                  color:
                    "#2F9CAF",

                  fontSize:
                    "15px",

                  fontWeight:
                    "700",

                }}
              >

                For, Dravu Fashion Hub

              </div>


              <div>

                Authorised Signatory

              </div>

            </div>

          </div>


        </div>

      </div>

    </div>
  );
}


export default DebitNotePrint;