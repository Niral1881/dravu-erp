import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Ledger() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [ledger, setLedger] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    openingBalance: 0,
    totalDebit: 0,
    totalCredit: 0,
    closingBalance: 0,
  });

  // =========================================================
  // COMPANY DETAILS
  // =========================================================
  const company = {
    name: "Dravu Fashion Hub",
    address:
      "3/4, 2nd Floor, Krishna Business Hub, Near Arjun Park, Punagam Road, Surat - 395010",
    mobile: "+91 99092 78815 / +91 97148 44024",
    gstin: "24AMHPV3134H1Z1",

    // Put your actual logo here:
    // public/logo.png
    logo: "/logo.png",
  };

  // =========================================================
  // LOAD PARTIES
  // =========================================================
  const fetchParties = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/parties`);
      setParties(response.data || []);
    } catch (error) {
      console.error("FAILED TO LOAD PARTIES:", error);
    }
  }, [API]);

  useEffect(() => {
    fetchParties();
  }, [fetchParties]);

  // =========================================================
  // FETCH LEDGER
  // =========================================================
  const fetchLedger = useCallback(
    async (partyName) => {
      if (!partyName) {
        setLedger([]);

        setSummary({
          openingBalance: 0,
          totalDebit: 0,
          totalCredit: 0,
          closingBalance: 0,
        });

        return;
      }

      setLoading(true);

      try {
        const [invoiceResponse, paymentResponse] = await Promise.all([
          axios.get(`${API}/invoices`),
          axios.get(`${API}/payments`),
        ]);

        // -----------------------------------------------------
        // INVOICES
        // -----------------------------------------------------
        const invoices = (invoiceResponse.data || [])
          .filter((invoice) => invoice.partyName === partyName)
          .map((invoice) => ({
            id: invoice._id,
            date: invoice.date,
            type: "Invoice",
            invoiceNo: invoice.invoiceNo || "-",
            debit: Number(
              invoice.roundedTotal ??
              invoice.grandTotal ??
              invoice.netTotal ??
              0
            ),
            credit: 0,
          }));

        // -----------------------------------------------------
        // PAYMENTS
        // -----------------------------------------------------
        const payments = (paymentResponse.data || [])
          .filter((payment) => payment.partyName === partyName)
          .map((payment) => ({
            id: payment._id,
            date: payment.paymentDate,
            type: "Payment",
            invoiceNo: payment.invoiceNo || "-",
            debit: 0,
            credit: Number(payment.amount || 0),
          }));

        // -----------------------------------------------------
        // ALL TRANSACTIONS
        // -----------------------------------------------------
        const allTransactions = [...invoices, ...payments].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        // -----------------------------------------------------
        // OPENING BALANCE
        // Transactions before From Date
        // -----------------------------------------------------
        let openingBalance = 0;

        if (fromDate) {
          const startDate = new Date(`${fromDate}T00:00:00`);

          allTransactions.forEach((item) => {
            const itemDate = new Date(item.date);

            if (itemDate < startDate) {
              openingBalance += item.debit - item.credit;
            }
          });
        }

        // -----------------------------------------------------
        // PERIOD FILTER
        // -----------------------------------------------------
        const filteredTransactions = allTransactions.filter((item) => {
          const itemDate = new Date(item.date);

          if (fromDate) {
            const startDate = new Date(`${fromDate}T00:00:00`);

            if (itemDate < startDate) {
              return false;
            }
          }

          if (toDate) {
            const endDate = new Date(`${toDate}T23:59:59`);

            if (itemDate > endDate) {
              return false;
            }
          }

          return true;
        });

        // -----------------------------------------------------
        // RUNNING BALANCE
        // -----------------------------------------------------
        let runningBalance = openingBalance;

        const updatedLedger = filteredTransactions.map((item) => {
          runningBalance += item.debit - item.credit;

          return {
            ...item,
            balance: runningBalance,
          };
        });

        // -----------------------------------------------------
        // PERIOD TOTALS
        // -----------------------------------------------------
        const totalDebit = filteredTransactions.reduce(
          (total, item) => total + Number(item.debit || 0),
          0
        );

        const totalCredit = filteredTransactions.reduce(
          (total, item) => total + Number(item.credit || 0),
          0
        );

        const closingBalance =
          openingBalance + totalDebit - totalCredit;

        setSummary({
          openingBalance,
          totalDebit,
          totalCredit,
          closingBalance,
        });

        setLedger(updatedLedger);
      } catch (error) {
        console.error("FAILED TO LOAD LEDGER:", error);

        alert(
          error.response?.data?.message ||
          "Unable to load ledger report."
        );
      } finally {
        setLoading(false);
      }
    },
    [API, fromDate, toDate]
  );

  // Reload when filters change
  useEffect(() => {
    if (selectedParty) {
      fetchLedger(selectedParty);
    }
  }, [selectedParty, fromDate, toDate, fetchLedger]);

  // =========================================================
  // FORMAT MONEY
  // =========================================================
  const money = (value) => {
    return `₹ ${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================
  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-GB");
  };

  // =========================================================
  // PERIOD TEXT
  // =========================================================
  const periodText = () => {
    if (fromDate && toDate) {
      return `${formatDate(fromDate)} to ${formatDate(toDate)}`;
    }

    if (fromDate) {
      return `${formatDate(fromDate)} onwards`;
    }

    if (toDate) {
      return `Up to ${formatDate(toDate)}`;
    }

    return "All Transactions";
  };

  // =========================================================
  // PRINT
  // =========================================================
  const handlePrint = () => {
    if (!selectedParty) {
      alert("Please select a party first.");
      return;
    }

    if (ledger.length === 0) {
      alert("No transactions available to print.");
      return;
    }

    window.print();
  };

  // =========================================================
  // LOAD LOGO FOR PDF
  // =========================================================
  const getLogoData = () => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");

          canvas.width = img.naturalWidth || 300;
          canvas.height = img.naturalHeight || 300;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
          );

          resolve(canvas.toDataURL("image/png"));
        } catch (error) {
          console.error("LOGO CONVERSION ERROR:", error);
          resolve(null);
        }
      };

      img.onerror = () => {
        resolve(null);
      };

      img.src = `${company.logo}?t=${Date.now()}`;
    });
  };

  // =========================================================
  // DOWNLOAD PROFESSIONAL PDF
  // =========================================================
  const generateLedgerPDF = async () => {
    if (!selectedParty) {
      alert("Please select a party first.");
      return;
    }

    if (ledger.length === 0) {
      alert("No transactions available for PDF.");
      return;
    }

    try {
      const doc = new jsPDF("1", "mm", "a4");

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const logoData = await getLogoData();

      // =====================================================
      // HEADER
      // =====================================================

      doc.setFillColor(47, 156, 175);
      doc.rect(0, 0, pageWidth, 5, "F");

      if (logoData) {
        try {
          doc.addImage(
            logoData,
            "PNG",
            14,
            11,
            24,
            24
          );
        } catch (error) {
          console.log("PDF LOGO ERROR:", error);
        }
      }

      const companyX = logoData ? 43 : 14;

      doc.setTextColor(31, 41, 55);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);

      doc.text(
        company.name.toUpperCase(),
        companyX,
        17
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);

      doc.text(
        company.address,
        companyX,
        23
      );

      doc.text(
        `GSTIN: ${company.gstin}`,
        companyX,
        28
      );

      doc.text(
        `Mobile: ${company.mobile}`,
        companyX,
        33
      );

      // Right side title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);

      doc.text(
        "PARTY LEDGER",
        pageWidth - 14,
        17,
        { align: "right" }
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);

      doc.text(
        "Account Statement",
        pageWidth - 14,
        23,
        { align: "right" }
      );

      doc.text(
        `Generated: ${formatDate(new Date())}`,
        pageWidth - 14,
        29,
        { align: "right" }
      );

      // Header separator
      doc.setDrawColor(210, 214, 220);
      doc.line(
        12,
        39,
        pageWidth - 12,
        39
      );

      // =====================================================
      // PARTY INFORMATION
      // =====================================================

      doc.setFillColor(248, 250, 252);

      doc.roundedRect(
        12,
        44,
        pageWidth - 24,
        27,
        2,
        2,
        "F"
      );

      doc.setTextColor(31, 41, 55);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);

      doc.text(
        "PARTY",
        19,
        51
      );

      doc.setFontSize(12);

      doc.text(
        selectedParty,
        19,
        58
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      doc.text(
        "REPORT PERIOD",
        115,
        51
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);

      doc.text(
        periodText(),
        115,
        58
      );

      // =====================================================
      // SUMMARY BOXES
      // =====================================================

      const summaryY = 76;
      const gap = 4;
      const boxWidth =
        (pageWidth - 24 - gap * 3) / 4;
      const boxHeight = 24;

      const boxes = [
        {
          title: "OPENING BALANCE",
          value: summary.openingBalance,
        },
        {
          title: "TOTAL DEBIT",
          value: summary.totalDebit,
        },
        {
          title: "TOTAL CREDIT",
          value: summary.totalCredit,
        },
        {
          title: "CLOSING BALANCE",
          value: summary.closingBalance,
        },
      ];

      boxes.forEach((box, index) => {
        const x =
          12 + index * (boxWidth + gap);

        doc.setDrawColor(220, 225, 230);
        doc.setFillColor(255, 255, 255);

        doc.roundedRect(
          x,
          summaryY,
          boxWidth,
          boxHeight,
          2,
          2,
          "FD"
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(100, 110, 120);

        doc.text(
          box.title,
          x + 4,
          summaryY + 7
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(31, 41, 55);

        doc.text(
          money(box.value),
          x + 4,
          summaryY + 17
        );
      });

      // =====================================================
      // TABLE
      // =====================================================

      const tableRows = ledger.map((item) => [
        formatDate(item.date),
        item.type,
        item.invoiceNo || "-",
        item.debit > 0
          ? money(item.debit)
          : "-",
        item.credit > 0
          ? money(item.credit)
          : "-",
        money(item.balance),
      ]);

      autoTable(doc, {
        startY: 108,

        head: [
          [
            "Date",
            "Type",
            "Invoice No.",
            "Debit",
            "Credit",
            "Running Balance",
          ],
        ],

        body: tableRows,

        theme: "grid",

        tableWidth: "auto",

        margin: {
          left: 12,
          right: 12,
          top: 108,
          bottom: 22,
        },

        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 2.5,
          overflow: "linebreak",
          valign: "middle",
          lineColor: [210, 214, 220],
          lineWidth: 0.2,
          textColor: [40, 45, 50],
        },

        headStyles: {
          fillColor: [31, 41, 55],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
          halign: "center",
          valign: "middle",
        },

        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },

        columnStyles: {
          0: {
            cellWidth: 28,
            halign: "center",
          },

          1: {
            cellWidth: 30,
            halign: "center",
          },

          2: {
            cellWidth: 55,
            halign: "left",
          },

          3: {
            cellWidth: 45,
            halign: "right",
          },

          4: {
            cellWidth: 45,
            halign: "right",
          },

          5: {
            cellWidth: 55,
            halign: "right",
            fontStyle: "bold",
          },
        },

        showHead: "everyPage",

        pageBreak: "auto",

        rowPageBreak: "avoid",

        didParseCell: (data) => {
          if (
            data.section === "body" &&
            data.column.index === 1
          ) {
            if (data.cell.raw === "Invoice") {
              data.cell.styles.textColor = [
                220,
                38,
                38,
              ];

              data.cell.styles.fontStyle = "bold";
            }

            if (data.cell.raw === "Payment") {
              data.cell.styles.textColor = [
                22,
                163,
                74,
              ];

              data.cell.styles.fontStyle = "bold";
            }
          }
        },

        didDrawPage: () => {
          const currentPage =
            doc.internal.getNumberOfPages();

          doc.setDrawColor(210, 214, 220);

          doc.line(
            12,
            pageHeight - 16,
            pageWidth - 12,
            pageHeight - 16
          );

          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(110, 115, 120);

          doc.text(
            `${company.name} | Party Ledger`,
            12,
            pageHeight - 10
          );

          doc.text(
            "Computer-generated report",
            pageWidth / 2,
            pageHeight - 10,
            {
              align: "center",
            }
          );

          doc.text(
            `Page ${currentPage}`,
            pageWidth - 12,
            pageHeight - 10,
            {
              align: "right",
            }
          );
        },
      });

      // =====================================================
      // FINAL SUMMARY
      // =====================================================

      let finalY =
        doc.lastAutoTable?.finalY || 120;

      if (finalY > pageHeight - 65) {
        doc.addPage();
        finalY = 25;
      }

      finalY += 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(31, 41, 55);

      doc.text(
        "ACCOUNT SUMMARY",
        14,
        finalY
      );

      finalY += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);

      doc.text(
        `Opening Balance: ${money(
          summary.openingBalance
        )}`,
        14,
        finalY
      );

      doc.text(
        `Total Debit: ${money(
          summary.totalDebit
        )}`,
        75,
        finalY
      );

      doc.text(
        `Total Credit: ${money(
          summary.totalCredit
        )}`,
        130,
        finalY
      );

      doc.setFont("helvetica", "bold");

      doc.text(
        `Closing Balance: ${money(
          summary.closingBalance
        )}`,
        pageWidth - 14,
        finalY,
        { align: "right" }
      );

      // =====================================================
      // SAVE
      // =====================================================

      const safePartyName = selectedParty
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/_+/g, "_");

      const fileName =
        `${safePartyName}_Ledger_Report.pdf`;

      doc.save(fileName);
    } catch (error) {
      console.error(
        "LEDGER PDF ERROR:",
        error
      );

      alert(
        "Unable to generate PDF. Please check the browser console."
      );
    }
  };



  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <style>{`
  @media print {
    @page {
      size: A4 landscape;
      margin: 6mm;
    }

    html,
    body {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      background: white !important;
    }

    body * {
      visibility: hidden;
    }

    .ledger-print-area,
    .ledger-print-area * {
      visibility: visible;
    }

    .ledger-print-area {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      overflow: visible !important;
    }

    .ledger-print-area > div {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }

    .no-print {
      display: none !important;
    }

    .ledger-table-wrapper {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      overflow: visible !important;
    }

    .print-table {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      table-layout: fixed !important;
      border-collapse: collapse !important;
      font-size: 8px !important;
    }

    .print-table th,
    .print-table td {
      min-width: 0 !important;
      padding: 3px 4px !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
      border: 1px solid #cbd5e1 !important;
    }

    .print-table th:nth-child(1),
    .print-table td:nth-child(1) {
      width: 13% !important;
      text-align: left !important;
    }

    .print-table th:nth-child(2),
    .print-table td:nth-child(2) {
      width: 14% !important;
      text-align: left !important;
    }

    .print-table th:nth-child(3),
    .print-table td:nth-child(3) {
      width: 25% !important;
      text-align: left !important;
    }

    .print-table th:nth-child(4),
    .print-table td:nth-child(4),
    .print-table th:nth-child(5),
    .print-table td:nth-child(5) {
      width: 14% !important;
      text-align: right !important;
    }

    .print-table th:nth-child(6),
    .print-table td:nth-child(6) {
      width: 20% !important;
      text-align: right !important;
    }

    .print-summary-card {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      padding: 8px !important;
    }

    .ledger-print-area h2 {
      font-size: 18px !important;
    }

    .ledger-print-area h3 {
      font-size: 13px !important;
    }

    .ledger-print-area p {
      font-size: 9px !important;
    }

    .ledger-print-area .grid {
      gap: 8px !important;
    }

    .ledger-print-area table thead {
      display: table-header-group !important;
    }

    .ledger-print-area tr {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .ledger-print-area footer {
      display: block !important;
    }
  }
`}</style>

      <div className="ledger-print-area w-full max-w-full bg-[#f4f7fa] p-3 md:p-6">

        {/* =====================================================
            ACTION HEADER
        ====================================================== */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
              Party Ledger
            </h1>

            <p className="text-gray-500">
              Professional party ledger report
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() => {
                if (!selectedParty) {
                  alert("Please select a party first.");
                  return;
                }

                navigate("/ledger-print", {
                  state: {
                    party: {
                      name: selectedParty,
                    },

                    transactions: ledger || [],

                    openingBalance: Number(
                      summary.openingBalance || 0
                    ),

                    totalDebit: Number(
                      summary.totalDebit || 0
                    ),

                    totalCredit: Number(
                      summary.totalCredit || 0
                    ),

                    closingBalance: Number(
                      summary.closingBalance || 0
                    ),

                    reportPeriod:
                      fromDate || toDate
                        ? `${fromDate || "Beginning"} to ${toDate || "Today"
                        }`
                        : "All Transactions",
                  },
                });
              }}
              className="rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white"
            >
              Print Ledger
            </button>

            <button
              type="button"
              onClick={generateLedgerPDF}
              disabled={
                !selectedParty ||
                ledger.length === 0 ||
                loading
              }
              className="px-5 py-3 rounded-xl bg-[#2F9CAF] text-white font-semibold shadow-sm hover:bg-[#25879A] disabled:opacity-50"
            >
              📄 Download PDF
            </button>

          </div>
        </div>

        {/* =====================================================
            COMPANY HEADER
        ====================================================== */}
        <div className="print-header bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-5">

          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            <div className="flex items-center gap-4">

              <img
                src={company.logo}
                alt="Company Logo"
                className="w-20 h-20 object-contain rounded-xl border border-gray-100"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />

              <div>
                <h2 className="text-2xl font-bold text-[#2E3A3F]">
                  {company.name}
                </h2>

                <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                  {company.address}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  <b>GSTIN:</b> {company.gstin}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  <b>Contact:</b> {company.mobile}
                </p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold text-[#2F9CAF]">
                PARTY LEDGER
              </h3>

              <p className="text-sm text-gray-500">
                Account Statement
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Generated: {formatDate(new Date())}
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            FILTERS
        ====================================================== */}
        <div className="no-print bg-white rounded-2xl shadow-sm p-5 mb-5">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Party
              </label>

              <select
                value={selectedParty}
                onChange={(event) => {
                  setSelectedParty(
                    event.target.value
                  );
                }}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#2F9CAF]"
              >
                <option value="">
                  Select Party
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

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(event) =>
                  setFromDate(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#2F9CAF]"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(event) =>
                  setToDate(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#2F9CAF]"
              />
            </div>

          </div>

          {loading && (
            <p className="text-center mt-4 text-[#2F9CAF] font-semibold">
              Loading ledger...
            </p>
          )}

        </div>

        {/* =====================================================
            PARTY + PERIOD
        ====================================================== */}
        {selectedParty && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-5">

            <div className="flex flex-col md:flex-row justify-between gap-4">

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Party
                </p>

                <h2 className="text-2xl font-bold text-[#2F9CAF]">
                  {selectedParty}
                </h2>
              </div>

              <div className="md:text-right">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Report Period
                </p>

                <p className="font-semibold text-gray-800">
                  {periodText()}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            SUMMARY
        ====================================================== */}
        <div className="print-summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Opening Balance
            </p>

            <p className="text-2xl font-bold text-gray-800 mt-2">
              {money(summary.openingBalance)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Total Debit
            </p>

            <p className="text-2xl font-bold text-red-600 mt-2">
              {money(summary.totalDebit)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Total Credit
            </p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              {money(summary.totalCredit)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Closing Balance
            </p>

            <p className="text-2xl font-bold text-[#2F9CAF] mt-2">
              {money(summary.closingBalance)}
            </p>
          </div>

        </div>

        {/* =====================================================
            LEDGER TABLE
        ====================================================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="mt-6 ledger-table-wrapper">

            <table className="print-table w-full text-sm border-collapse">

              <thead className="bg-gray-100">
                <tr>

                  <th className="text-left p-4">
                    Date
                  </th>

                  <th className="text-left p-4">
                    Type
                  </th>

                  <th className="text-left p-4">
                    Invoice No.
                  </th>

                  <th className="text-right p-4">
                    Debit
                  </th>

                  <th className="text-right p-4">
                    Credit
                  </th>

                  <th className="text-right p-4">
                    Running Balance
                  </th>

                </tr>
              </thead>

              <tbody>

                {selectedParty &&
                  ledger.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-gray-500"
                    >
                      No transactions found for this period.
                    </td>
                  </tr>
                ) : !selectedParty ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-gray-500"
                    >
                      Select a party to view the ledger.
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* OPENING BALANCE ROW */}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="p-4">
                        {fromDate
                          ? formatDate(fromDate)
                          : "-"}
                      </td>

                      <td className="p-4">
                        Opening
                      </td>

                      <td className="p-4">
                        Balance B/F
                      </td>

                      <td className="p-4 text-right">
                        -
                      </td>

                      <td className="p-4 text-right">
                        -
                      </td>

                      <td className="p-4 text-right font-bold">
                        {money(
                          summary.openingBalance
                        )}
                      </td>
                    </tr>

                    {ledger.map(
                      (item, index) => (
                        <tr
                          key={
                            item.id ||
                            `${item.invoiceNo}-${index}`
                          }
                          className="border-b hover:bg-gray-50"
                        >

                          <td className="p-4">
                            {formatDate(
                              item.date
                            )}
                          </td>

                          <td className="p-4">

                            <span
                              className={
                                item.type ===
                                  "Invoice"
                                  ? "font-bold text-red-600"
                                  : "font-bold text-green-600"
                              }
                            >
                              {item.type}
                            </span>

                          </td>

                          <td className="p-4">
                            {item.invoiceNo}
                          </td>

                          <td className="p-4 text-right font-semibold text-red-600">
                            {item.debit > 0
                              ? money(item.debit)
                              : "-"}
                          </td>

                          <td className="p-4 text-right font-semibold text-green-600">
                            {item.credit > 0
                              ? money(item.credit)
                              : "-"}
                          </td>

                          <td className="p-4 text-right font-bold">
                            <span
                              className={
                                item.balance > 0
                                  ? "text-red-600"
                                  : item.balance < 0
                                    ? "text-green-600"
                                    : "text-gray-700"
                              }
                            >
                              {money(
                                item.balance
                              )}
                            </span>
                          </td>

                        </tr>
                      )
                    )}
                  </>
                )}

              </tbody>

              {selectedParty &&
                ledger.length > 0 && (
                  <tfoot>

                    <tr className="bg-gray-100 font-bold">

                      <td
                        colSpan="3"
                        className="p-4 text-right"
                      >
                        Total
                      </td>

                      <td className="p-4 text-left text-red-600">
                        {money(
                          summary.totalDebit
                        )}
                      </td>

                      <td className="p-4 text-left text-green-600">
                        {money(
                          summary.totalCredit
                        )}
                      </td>

                      <td className="p-4 text-right text-[#2F9CAF]">
                        {money(
                          summary.closingBalance
                        )}
                      </td>

                    </tr>

                  </tfoot>
                )}

            </table>

          </div>
        </div>

        {/* =====================================================
            REPORT FOOTER
        ====================================================== */}
        {selectedParty && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div>
                <p className="font-semibold text-gray-800">
                  Notes
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  This ledger report is automatically
                  generated from the invoice and payment
                  records available in the ERP system.
                </p>
              </div>

              <div className="text-left md:text-right">

                <p className="font-semibold text-gray-800">
                  For, {company.name}
                </p>

                <div className="h-10" />

                <p className="border-t border-gray-400 pt-2 inline-block min-w-[190px]">
                  Authorised Signatory
                </p>

              </div>

            </div>

            <div className="mt-5 pt-3 border-t text-center text-xs text-gray-400">
              Computer-generated ledger report
            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Ledger;