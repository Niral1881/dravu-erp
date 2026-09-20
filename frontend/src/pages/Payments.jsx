import { useEffect, useState } from "react";
import axios from "axios";

function Payments() {

  const API = import.meta.env.VITE_API_URL;

  const [parties, setParties] =
    useState([]);

  const [payments, setPayments] = useState([]);

  const [invoices, setInvoices] =
    useState([]);

  const [partyName, setPartyName] =
    useState("");

  const [invoiceNo, setInvoiceNo] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [paymentMode, setPaymentMode] =
    useState("Cash");

  const [paymentDate, setPaymentDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [note, setNote] =
    useState("");



  const fetchData = async () => {
    try {
      const [partyRes, invoiceRes, paymentRes] = await Promise.all([
        axios.get(`${API}/parties`),
        axios.get(`${API}/invoices`),
        axios.get(`${API}/payments`),
      ]);

      setParties(partyRes.data || []);
      setInvoices(invoiceRes.data || []);
      setPayments(paymentRes.data || []);
    } catch (error) {
      console.error("FETCH PAYMENT DATA ERROR:", error);
    }
  };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchData();
    };

    loadProducts();

  }, []);

  const selectedInvoices = invoices.filter(
    (invoice) => invoice.partyName === partyName
  );

  const selectedInvoice = invoices.find(
    (invoice) =>
      invoice.invoiceNo === invoiceNo &&
      invoice.partyName === partyName
  );

  const invoiceTotal = Number(
    selectedInvoice?.roundedTotal ??
    selectedInvoice?.grandTotal ??
    0
  );

  const paidAmount = payments
    .filter((payment) => {
      const sameInvoice =
        payment.invoiceId &&
        selectedInvoice?._id &&
        String(payment.invoiceId) === String(selectedInvoice._id);

      const sameInvoiceNumber =
        payment.invoiceNo === selectedInvoice?.invoiceNo &&
        payment.partyName === selectedInvoice?.partyName;

      return sameInvoice || sameInvoiceNumber;
    })
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

  const pendingAmount = Math.max(invoiceTotal - paidAmount, 0);

  const handleSavePayment = async () => {
    if (!partyName || !invoiceNo || !amount || Number(amount) <= 0) {
      alert("Please select party, invoice and enter valid amount");
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

      await axios.post(`${API}/payments`, paymentData);

      // Refresh invoices after payment save
      await fetchData();

      alert("Payment Added Successfully");

      setAmount("");
      setNote("");
      setInvoiceNo("");
      setPaymentMode("Cash");
    } catch (error) {
      console.error("PAYMENT SAVE ERROR:", error);
      alert(
        error.response?.data?.message || "Payment Save Failed"
      );
    }
  };

  return (

    <div className="p-3 md:p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
          Add Payment
        </h1>

        <p className="text-gray-500">
          Record party payments
        </p>

      </div>

      {/* Form */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Party */}
        <div>

          <label className="block mb-2 font-medium">
            Party Name
          </label>

          <select

            className="w-full border border-gray-200 rounded-xl p-3 bg-white"
            value={partyName}
            onChange={(e) => {

              setPartyName(
                e.target.value
              );

              setInvoiceNo("");
            }}
          >

            <option value="">
              Select Party
            </option>

            {parties
              .sort((a, b) =>
                a.name.localeCompare(b.name)
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

        {/* Invoice */}
        <div>

          <label className="block mb-2 font-medium">
            Invoice No
          </label>

          <select
            value={invoiceNo}
            onChange={(e) =>
              setInvoiceNo(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-xl p-3"
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
                  {
                    invoice.invoiceNo
                  }
                </option>
              )
            )}

          </select>

          <p>
            <span className="font-semibold">
              Paid Amount :
            </span>

            ₹ {paidAmount.toFixed(2)}
          </p>

          <p>
            <span className="font-semibold">
              Pending Amount :
            </span>

            ₹ {pendingAmount.toFixed(2)}
          </p>

        </div>

        {/* Amount */}
        <div>

          <label className="block mb-2 font-medium">
            Amount
          </label>

          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-xl p-3"
          />

        </div>

        {/* Payment Mode */}
        <div>

          <label className="block mb-2 font-medium">
            Payment Mode
          </label>

          <select
            value={paymentMode}
            onChange={(e) =>
              setPaymentMode(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-xl p-3"
          >

            <option>
              Cash
            </option>

            <option>
              UPI
            </option>

            <option>
              Bank Transfer
            </option>

            <option>
              Cheque
            </option>

          </select>

        </div>

        {/* Date */}
        <div>

          <label className="block mb-2 font-medium">
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
            className="w-full border border-gray-200 rounded-xl p-3"
          />

        </div>

        {/* Note */}
        <div>

          <label className="block mb-2 font-medium">
            Note
          </label>

          <input
            type="text"
            value={note}
            onChange={(e) =>
              setNote(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-xl p-3"
          />

        </div>

      </div>

      {/* Invoice Details */}
      {selectedInvoice && (

        <div className="bg-white mt-6 p-5 rounded-2xl shadow-sm">

          <h2 className="text-xl font-bold mb-4">
            Invoice Details
          </h2>

          <div className="space-y-2">

            <p>
              <span className="font-semibold">
                Invoice No :
              </span>

              {" "}
              {
                selectedInvoice.invoiceNo
              }
            </p>

            <p>
              <span className="font-semibold">
                Grand Total :
              </span>

              {" "}
              ₹ {
                (
                  selectedInvoice.roundedTotal ||
                  selectedInvoice.grandTotal
                ).toFixed(2)
              }
            </p>

          </div>

        </div>

      )}

      {/* Save Button */}
      <div className="mt-6">

        <button
          onClick={
            handleSavePayment
          }
          className="bg-[#2F9CAF] text-white px-6 py-3 rounded-xl hover:bg-[#238293]"
        >
          Save Payment
        </button>

      </div>

    </div>
  );
}

export default Payments;