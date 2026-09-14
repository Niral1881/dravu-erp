
import { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory() {
  const API = import.meta.env.VITE_API_URL;

  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API}/payments`);
      setPayments(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load payments");
    }
  };

  useEffect(() => {

    const loadProducts = async () => {
      await fetchPayments();
    };

    loadProducts();

  }, []);

  // DELETE PAYMENT
  const handleDelete = async (id) => {
    if (!id) {
      alert("Payment ID is missing");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this payment?")) {
      return;
    }

    try {
      await axios.delete(`${API}/payments/${id}`);

      setPayments((previousPayments) =>
        previousPayments.filter((payment) => payment._id !== id)
      );

      alert("Payment deleted successfully");
    } catch (error) {
      console.error("DELETE PAYMENT ERROR:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete payment"
      );
    }
  };

  // OPEN EDIT FORM
  const handleEdit = (payment) => {
    setEditingPayment({
      ...payment,
      paymentDate: payment.paymentDate
        ? new Date(payment.paymentDate).toISOString().split("T")[0]
        : "",
      amount: payment.amount || "",
      paymentMode: payment.paymentMode || "",
      note: payment.note || "",
    });
  };

  // UPDATE PAYMENT
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingPayment) return;

    setLoading(true);

    try {
      const id = editingPayment._id;

      const updatedData = {
        paymentDate: editingPayment.paymentDate,
        amount: Number(editingPayment.amount),
        paymentMode: editingPayment.paymentMode,
        note: editingPayment.note,
      };

      const res = await axios.put(
        `${API}/payments/${id}`,
        updatedData
      );

      setPayments((prev) =>
        prev.map((payment) =>
          payment._id === id ? res.data : payment
        )
      );

      setEditingPayment(null);

      alert("Payment updated successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to update payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
          Payment History
        </h1>

        <p className="text-gray-500">
          View all payment records
        </p>
      </div>

      {/* EDIT PAYMENT FORM */}
      {editingPayment && (
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">

          <h2 className="text-xl font-bold text-[#2E3A3F] mb-4">
            Edit Payment
          </h2>

          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            {/* PARTY NAME - READ ONLY */}
            <div>
              <label className="block mb-1 font-medium">
                Party Name
              </label>

              <input
                type="text"
                value={editingPayment.partyName || ""}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            {/* INVOICE NO - READ ONLY */}
            <div>
              <label className="block mb-1 font-medium">
                Invoice No
              </label>

              <input
                type="text"
                value={editingPayment.invoiceNo || ""}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="block mb-1 font-medium">
                Payment Date
              </label>

              <input
                type="date"
                value={editingPayment.paymentDate}
                onChange={(e) =>
                  setEditingPayment({
                    ...editingPayment,
                    paymentDate: e.target.value,
                  })
                }
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* AMOUNT */}
            <div>
              <label className="block mb-1 font-medium">
                Amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={editingPayment.amount}
                onChange={(e) =>
                  setEditingPayment({
                    ...editingPayment,
                    amount: e.target.value,
                  })
                }
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* PAYMENT MODE */}
            <div>
              <label className="block mb-1 font-medium">
                Payment Mode
              </label>

              <select
                value={editingPayment.paymentMode}
                onChange={(e) =>
                  setEditingPayment({
                    ...editingPayment,
                    paymentMode: e.target.value,
                  })
                }
                required
                className="w-full border rounded-lg p-3"
              >
                <option value="">Select Mode</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="BANK TRANSFER">
                  Bank Transfer
                </option>
                <option value="CHEQUE">Cheque</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* NOTE */}
            <div>
              <label className="block mb-1 font-medium">
                Note
              </label>

              <input
                type="text"
                value={editingPayment.note}
                onChange={(e) =>
                  setEditingPayment({
                    ...editingPayment,
                    note: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* BUTTONS */}
            <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">

              <button
                type="submit"
                disabled={loading}
                className="bg-[#2F9CAF] text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Payment"}
              </button>

              <button
                type="button"
                onClick={() => setEditingPayment(null)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">

        <table className="min-w-[1100px] w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Party</th>
              <th className="text-left p-4">Invoice No</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Mode</th>
              <th className="text-left p-4">Note</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">
                  {new Date(
                    payment.paymentDate
                  ).toLocaleDateString("en-GB")}
                </td>

                <td className="p-4 font-medium">
                  {payment.partyName}
                </td>

                <td className="p-4">
                  {payment.invoiceNo}
                </td>

                <td className="p-4 text-green-600 font-bold">
                  ₹ {Number(payment.amount || 0).toFixed(2)}
                </td>

                <td className="p-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {payment.paymentMode}
                  </span>
                </td>

                <td className="p-4">
                  {payment.note || "-"}
                </td>

                {/* ACTION BUTTONS */}
                <td className="p-4">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => handleEdit(payment)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(payment._id)}
                      className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default PaymentHistory;