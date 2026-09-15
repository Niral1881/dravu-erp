import { forwardRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Ledger.css";

const COMPANY = {
  name: "Dravu Fashion Hub",
  address:
    "3/4, 2nd Floor, Krishna Business Hub, Near Arjun Park, Punagam Road, Surat - 395010",
  gstin: "24AMHPV3134H1Z1",
  contact: "+91 99092 78815 / +91 97148 44024",
  logo: "/logo.png",
};

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB");
};

const LedgerPrint = forwardRef((props, ref) => {
  const location = useLocation();
  const navigate = useNavigate();

  /*
    Expected data from Ledger page:

    location.state = {
      party: {
        name: "",
        address: "",
        mobile: "",
        gstin: ""
      },
      transactions: [
        {
          date: "",
          type: "Invoice" / "Payment",
          invoiceNo: "",
          debit: 0,
          credit: 0,
          balance: 0
        }
      ],
      openingBalance: 0,
      totalDebit: 0,
      totalCredit: 0,
      closingBalance: 0,
      reportPeriod: "All Transactions"
    }
  */

  const report = location.state || {};

  const party = report.party || {};
  const transactions = report.transactions || [];

  const openingBalance = Number(report.openingBalance || 0);
  const totalDebit = Number(
    report.totalDebit ??
    transactions.reduce(
      (sum, transaction) => sum + Number(transaction.debit || 0),
      0
    )
  );

  const totalCredit = Number(
    report.totalCredit ??
    transactions.reduce(
      (sum, transaction) => sum + Number(transaction.credit || 0),
      0
    )
  );

  const closingBalance = Number(
    report.closingBalance ??
    openingBalance + totalDebit - totalCredit
  );

  const reportPeriod = report.reportPeriod || "All Transactions";

  const rows = useMemo(() => {
    let runningBalance = openingBalance;

    const openingRow = {
      date: "-",
      type: "Opening",
      invoiceNo: "Balance B/F",
      debit: 0,
      credit: 0,
      balance: openingBalance,
    };

    const transactionRows = transactions.map((transaction) => {
      const debit = Number(transaction.debit || 0);
      const credit = Number(transaction.credit || 0);

      runningBalance += debit - credit;

      return {
        ...transaction,
        debit,
        credit,
        balance: runningBalance,
      };
    });

    return [openingRow, ...transactionRows];
  }, [transactions, openingBalance]);

  const handlePrint = () => {
    const partyName = party.name || "All-Parties";

    const safePartyName = partyName
      .trim()
      .replace(/[<>:"/\\|?*]+/g, "-")
      .replace(/\s+/g, "-");

    const oldTitle = document.title;

    document.title = `Ledger-${safePartyName}`;

    window.print();

    setTimeout(() => {
      document.title = oldTitle;
    }, 1000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="ledger-print-screen">
      <div className="print-toolbar no-print">
        <button className="toolbar-btn secondary" onClick={handleBack}>
          Back
        </button>

        <button className="toolbar-btn primary" onClick={handlePrint}>
          Print / Save PDF
        </button>
      </div>

      <main ref={ref} className="ledger-page">
        {/* COMPANY HEADER */}
        <section className="company-header">
          <div className="company-left">
            <div className="company-logo-box">
              <img
                src={COMPANY.logo}
                alt="Company Logo"
                className="company-logo"
              />
            </div>

            <div className="company-details">
              <h1>{COMPANY.name}</h1>

              <p>{COMPANY.address}</p>

              <p>
                <strong>GSTIN:</strong> {COMPANY.gstin}
              </p>

              <p>
                <strong>Contact:</strong> {COMPANY.contact}
              </p>
            </div>
          </div>

          <div className="report-heading">
            <h2>PARTY LEDGER</h2>
            <p>Account Statement</p>
            <p>
              Generated:{" "}
              {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>
        </section>

        {/* PARTY INFORMATION */}
        <section className="party-section">
          <div className="party-info">
            <span className="section-label">PARTY</span>

            <h2>{party.name || "All Parties"}</h2>

            {party.address && <p>{party.address}</p>}

            {party.mobile && (
              <p>
                <strong>Mobile:</strong> {party.mobile}
              </p>
            )}

            {party.gstin && (
              <p>
                <strong>GSTIN:</strong> {party.gstin}
              </p>
            )}
          </div>

          <div className="period-info">
            <span className="section-label">REPORT PERIOD</span>
            <strong>{reportPeriod}</strong>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="summary-grid">
          <div className="summary-card">
            <span>Opening Balance</span>
            <strong className="black-value">
              {money(openingBalance)}
            </strong>
          </div>

          <div className="summary-card">
            <span>Total Debit</span>
            <strong className="debit-value">
              {money(totalDebit)}
            </strong>
          </div>

          <div className="summary-card">
            <span>Total Credit</span>
            <strong className="credit-value">
              {money(totalCredit)}
            </strong>
          </div>

          <div className="summary-card">
            <span>Closing Balance</span>
            <strong className="balance-value">
              {money(closingBalance)}
            </strong>
          </div>
        </section>

        {/* LEDGER TABLE */}
        <section className="table-wrapper">
          <table className="ledger-table">
            <thead>
              <tr>
                <th className="date-column">Date</th>
                <th className="type-column">Type</th>
                <th className="invoice-column">Invoice No.</th>
                <th className="amount-column">Debit</th>
                <th className="amount-column">Credit</th>
                <th className="amount-column">Running Balance</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    No transactions found
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={`${row.invoiceNo || "row"}-${index}`}
                    className={
                      row.type === "Opening"
                        ? "opening-row"
                        : ""
                    }
                  >
                    <td>{formatDate(row.date)}</td>

                    <td
                      className={
                        row.type === "Payment"
                          ? "payment-type"
                          : row.type === "Invoice"
                            ? "invoice-type"
                            : ""
                      }
                    >
                      {row.type || "-"}
                    </td>

                    <td>{row.invoiceNo || "-"}</td>

                    <td className="debit-cell">
                      {row.debit > 0 ? money(row.debit) : "-"}
                    </td>

                    <td className="credit-cell">
                      {row.credit > 0 ? money(row.credit) : "-"}
                    </td>

                    <td className="balance-cell">
                      {money(row.balance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan="3" className="total-label">
                  Total
                </td>

                <td className="debit-cell total-cell">
                  {money(totalDebit)}
                </td>

                <td className="credit-cell total-cell">
                  {money(totalCredit)}
                </td>

                <td className="balance-cell total-cell">
                  {money(closingBalance)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* FOOTER */}
        <section className="report-footer">
          <div className="footer-note">
            <h3>Notes</h3>
            <p>
              This ledger report is automatically generated from
              the invoice and payment records available in the ERP
              system.
            </p>
          </div>

          <div className="signature-box">
            <h3>For, {COMPANY.name}</h3>

            <div className="signature-line"></div>

            <p>Authorised Signatory</p>
          </div>
        </section>

        <div className="page-footer">
          <span>Computer-generated ledger report</span>
          <span className="page-number">
            Page <span className="page-counter"></span>
          </span>
        </div>
      </main>
    </div>
  );
});

LedgerPrint.displayName = "LedgerPrint";

export default LedgerPrint;