import { useEffect, useState } from "react";
import axios from "axios";

function Payments() {

  const [parties, setParties] =
    useState([]);

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



  const fetchData =
    async () => {

      try {

        const partyRes =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/parties`
          );

        const invoiceRes =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/invoices`
          );

        setParties(
          partyRes.data
        );

        setInvoices(
          invoiceRes.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchData();
    };

    loadProducts();

  }, []);

  const selectedInvoices =
    invoices.filter(
      (inv) =>
        inv.partyName ===
        partyName
    );

  const selectedInvoice =
    invoices.find(
      (inv) =>
        inv.invoiceNo ===
        invoiceNo
    );

  const handleSavePayment =
    async () => {

      try {

        const paymentData = {

          partyName,

          invoiceNo,

          invoiceId:
            selectedInvoice?._id,

          amount:
            Number(amount),

          paymentMode,

          paymentDate,

          note,
        };

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/payments`,
          paymentData
        );

        alert(
          "Payment Added Successfully"
        );

        setPartyName("");

        setInvoiceNo("");

        setAmount("");

        setPaymentMode(
          "Cash"
        );

        setNote("");



      } catch (error) {

        console.log(error);

        alert(
          "Payment Save Failed"
        );
      }
    };

  return (

    <div className="p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold text-[#2E3A3F]">
          Add Payment
        </h1>

        <p className="text-gray-500">
          Record party payments
        </p>

      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-2 gap-5">

        {/* Party */}
        <div>

          <label className="block mb-2 font-medium">
            Party Name
          </label>

          <select
            value={partyName}
            onChange={(e) => {

              setPartyName(
                e.target.value
              );

              setInvoiceNo("");
            }}
            className="w-full border border-gray-200 rounded-xl p-3"
          >

            <option value="">
              Select Party
            </option>

            {parties.map((party) => (

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

            ₹ {
              (
                selectedInvoice?.paidAmount || 0
              ).toFixed(2)
            }
          </p>

          <p>
            <span className="font-semibold">
              Pending Amount :
            </span>

            ₹ {
              (
                selectedInvoice?.pendingAmount ||
                0
              ).toFixed(2)
            }
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