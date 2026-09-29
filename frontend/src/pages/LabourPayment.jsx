import {
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

function LabourPayment() {
  const API =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const emptyForm = {
    labourId: "",
    amount: "",
    paymentMode: "CASH",
    startDate: today,
    endDate: today,
    paymentDate: today,
    note: "",
  };

  const [labours, setLabours] = useState([]);
  const [payments, setPayments] = useState([]);
  const [works, setWorks] = useState([]);

  const [formData, setFormData] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // FETCH DATA
  // =====================================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        labourRes,
        paymentRes,
        workRes,
      ] = await Promise.all([
        axios.get(`${API}/labour`),
        axios.get(
          `${API}/labour-payments`
        ),
        axios.get(
          `${API}/labour-work`
        ),
      ]);

      const labourData =
        Array.isArray(labourRes.data)
          ? labourRes.data
          : labourRes.data?.labours ||
          labourRes.data?.data ||
          [];

      const paymentData =
        Array.isArray(paymentRes.data)
          ? paymentRes.data
          : paymentRes.data?.payments ||
          paymentRes.data?.data ||
          [];

      const workData =
        Array.isArray(workRes.data)
          ? workRes.data
          : workRes.data?.works ||
          workRes.data?.data ||
          [];

      setLabours(labourData);
      setPayments(paymentData);
      setWorks(workData);
    } catch (error) {
      console.error(
        "FETCH LABOUR PAYMENT DATA ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Unable to load labour payment data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================
  // FORM CHANGE
  // =====================================
  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // SELECT LABOUR
  // =====================================
  const handleLabourChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      labourId: e.target.value,
    }));
  };

  // =====================================
  // LABOUR SUMMARY BY DATE RANGE
  // =====================================
  const getLabourSummary = (
    labourId,
    startDate,
    endDate,
    excludePaymentId = null
  ) => {
    if (!labourId) {
      return {
        totalWork: 0,
        totalPaid: 0,
        pending: 0,
      };
    }

    const start = startDate
      ? new Date(`${startDate}T00:00:00`)
      : null;

    const end = endDate
      ? new Date(`${endDate}T23:59:59`)
      : null;

    // =====================================
    // WORK AMOUNT FOR SELECTED DATE RANGE
    // =====================================
    const totalWork = works
      .filter((work) => {
        if (
          String(work.labourId) !==
          String(labourId)
        ) {
          return false;
        }

        if (!start || !end) {
          return true;
        }

        if (!work.workDate) {
          return false;
        }

        const workDate = new Date(
          `${work.workDate}T00:00:00`
        );

        return (
          workDate >= start &&
          workDate <= end
        );
      })
      .reduce(
        (sum, work) =>
          sum + Number(work.amount || 0),
        0
      );

    // =====================================
    // PAID AMOUNT FOR SELECTED DATE RANGE
    // =====================================
    const totalPaid = payments
      .filter((payment) => {
        if (
          String(payment.labourId) !==
          String(labourId)
        ) {
          return false;
        }

        // Don't count the payment being edited
        if (
          excludePaymentId &&
          String(payment._id) ===
          String(excludePaymentId)
        ) {
          return false;
        }

        const paymentStart =
          payment.startDate ||
          payment.paymentDate;

        const paymentEnd =
          payment.endDate ||
          payment.paymentDate;

        if (!paymentStart || !paymentEnd) {
          return false;
        }

        if (!start || !end) {
          return true;
        }

        const pStart = new Date(
          `${paymentStart}T00:00:00`
        );

        const pEnd = new Date(
          `${paymentEnd}T23:59:59`
        );

        // Payment period overlaps selected period
        return (
          pStart <= end &&
          pEnd >= start
        );
      })
      .reduce(
        (sum, payment) =>
          sum + Number(payment.amount || 0),
        0
      );

    const pending = Math.max(
      totalWork - totalPaid,
      0
    );

    return {
      totalWork,
      totalPaid,
      pending,
    };
  };

  const selectedSummary =
    getLabourSummary(
      formData.labourId,
      formData.startDate,
      formData.endDate,
      editingId
    );

  // =====================================
  // OPEN ADD
  // =====================================
  const openAddModal = () => {
    setEditingId(null);

    const today = new Date()
      .toISOString()
      .split("T")[0];

    setFormData({
      ...emptyForm,
      startDate: today,
      endDate: today,
    });

    setShowModal(true);
  };

  // =====================================
  // EDIT
  // =====================================
  const handleEdit = (payment) => {
    setEditingId(payment._id);

    const defaultDate =
      payment.paymentDate ||
      new Date()
        .toISOString()
        .split("T")[0];

    setFormData({
      labourId: payment.labourId || "",
      amount: payment.amount ?? "",
      paymentMode:
        payment.paymentMode || "CASH",

      startDate:
        payment.startDate ||
        defaultDate,

      endDate:
        payment.endDate ||
        defaultDate,

      paymentDate:
        payment.paymentDate ||
        defaultDate,

      note: payment.note || "",
    });

    setShowModal(true);
  };

  // =====================================
  // CLOSE
  // =====================================
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // =====================================
  // SAVE
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.labourId) {
      alert("Please select labour.");
      return;
    }

    const amount =
      Number(formData.amount) || 0;

    if (amount <= 0) {
      alert(
        "Payment amount must be greater than 0."
      );
      return;
    }

    if (!formData.startDate) {
      alert("Please select Start Date.");
      return;
    }

    if (!formData.endDate) {
      alert("Please select End Date.");
      return;
    }

    if (!formData.paymentDate) {
      alert("Please select Payment Date.");
      return;
    }

    if (
      new Date(formData.startDate) >
      new Date(formData.endDate)
    ) {
      alert(
        "End Date cannot be before Start Date."
      );
      return;
    }

    try {
      setLoading(true);

      const labour = labours.find(
        (item) =>
          item._id === formData.labourId
      );

      const payload = {
        labourId: formData.labourId,

        labourName:
          labour?.name || "",

        amount,

        paymentMode:
          formData.paymentMode,

        startDate:
          formData.startDate,

        endDate:
          formData.endDate,

        // Keep old field for compatibility
        paymentDate: formData.paymentDate,

        note:
          formData.note,
      };

      if (editingId) {
        await axios.put(
          `${API}/labour-payments/${editingId}`,
          payload
        );
      } else {
        await axios.post(
          `${API}/labour-payments`,
          payload
        );
      }

      await fetchData();

      closeModal();
    } catch (error) {
      console.error(
        "SAVE LABOUR PAYMENT ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Unable to save payment."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DELETE
  // =====================================
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this payment?"
      );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axios.delete(
        `${API}/labour-payments/${id}`
      );

      await fetchData();
    } catch (error) {
      console.error(
        "DELETE LABOUR PAYMENT ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Unable to delete payment."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FILTER
  // =====================================
  const filteredPayments = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return [...payments]
      .filter((payment) => {
        if (!keyword) return true;

        return (
          String(
            payment.labourName || ""
          )
            .toLowerCase()
            .includes(keyword) ||
          String(
            payment.paymentMode || ""
          )
            .toLowerCase()
            .includes(keyword) ||
          String(
            payment.note || ""
          )
            .toLowerCase()
            .includes(keyword)
        );
      })
      .sort(
        (a, b) =>
          new Date(
            b.paymentDate || b.endDate
          ) -
          new Date(
            a.paymentDate || a.endDate
          )
      );
  }, [payments, search]);

  // =====================================
  // TOTALS
  // =====================================
  const totalWorkAmount =
    works.reduce(
      (sum, work) =>
        sum +
        Number(work.amount || 0),
      0
    );

  const totalPaidAmount =
    payments.reduce(
      (sum, payment) =>
        sum +
        Number(payment.amount || 0),
      0
    );

  const totalPending =
    Math.max(
      totalWorkAmount -
      totalPaidAmount,
      0
    );

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  return (
    <div className="space-y-6">

      {/* =================================
          HEADER
      ================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
            Labour Payment
          </h1>

          <p className="text-gray-500 mt-1">
            Manage labour payments, advances and pending amounts.
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
          >
            ↻ Refresh
          </button>

          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-xl bg-[#2F9CAF] hover:bg-[#238293] text-white font-semibold cursor-pointer"
          >
            + Add Payment
          </button>

        </div>

      </div>

      {/* =================================
          SUMMARY CARDS
      ================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Total Labour Cost
          </p>

          <h2 className="text-2xl font-bold text-[#2E3A3F] mt-1">
            ₹ {formatMoney(totalWorkAmount)}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Total Paid
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-1">
            ₹ {formatMoney(totalPaidAmount)}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Total Pending
          </p>

          <h2 className="text-2xl font-bold text-orange-600 mt-1">
            ₹ {formatMoney(totalPending)}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500">
            Payment Entries
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mt-1">
            {payments.length}
          </h2>

        </div>

      </div>



      {/* =================================
          SEARCH
      ================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

        <input
          type="text"
          placeholder="Search labour, payment mode or note..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#2F9CAF]"
        />

      </div>

      {/* =================================
          PAYMENT HISTORY
      ================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-100">

          <h2 className="font-bold text-lg text-[#2E3A3F]">
            Payment History
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-[950px] w-full">

            <thead className="bg-[#F7F9FA]">

              <tr>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Payment Date
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Labour
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Payment Mode
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Amount
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Note
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPayments.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-14 text-gray-400"
                  >
                    No payment entries found.
                  </td>

                </tr>

              ) : (

                filteredPayments.map(
                  (payment) => (
                    <tr
                      key={payment._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      {/* <td className="px-5 py-4 text-gray-600">
                        {payment.paymentDate
                          ? new Date(
                            payment.paymentDate
                          ).toLocaleDateString(
                            "en-IN"
                          )
                          : "-"}
                      </td> */}

                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                        <div className="font-semibold">
                          {payment.paymentDate
                            ? new Date(payment.paymentDate).toLocaleDateString("en-IN")
                            : "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-bold text-gray-800">
                        {payment.labourName}
                      </td>

                      <td className="px-5 py-4">

                        <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                          {payment.paymentMode}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-right font-bold text-green-700">
                        ₹ {formatMoney(payment.amount)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {payment.note || "-"}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              handleEdit(
                                payment
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-sm cursor-pointer"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                payment._id
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm cursor-pointer"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================
          LABOUR BALANCE TABLE
      ================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-100">

          <h2 className="font-bold text-lg text-[#2E3A3F]">
            Labour Balance
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Total work, paid amount and pending amount.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-[850px] w-full">

            <thead className="bg-[#F7F9FA]">

              <tr>

                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Labour
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Work Amount
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Paid
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Pending
                </th>

                <th className="text-center px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {labours.map((labour) => {

                const summary =
                  getLabourSummary(
                    labour._id
                  );

                return (
                  <tr
                    key={labour._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >

                    <td className="px-5 py-4">

                      <div className="font-bold text-gray-800">
                        {labour.name}
                      </div>

                      <div className="text-xs text-gray-400 mt-1">
                        {labour.workType}
                      </div>

                    </td>

                    <td className="px-5 py-4 text-right font-semibold">
                      ₹ {formatMoney(summary.totalWork)}
                    </td>

                    <td className="px-5 py-4 text-right font-semibold text-green-600">
                      ₹ {formatMoney(summary.totalPaid)}
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-orange-600">
                      ₹ {formatMoney(summary.pending)}
                    </td>

                    <td className="px-5 py-4 text-center">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${summary.pending <= 0 &&
                          summary.totalWork > 0
                          ? "bg-green-100 text-green-700"
                          : summary.totalPaid > 0
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                          }`}
                      >
                        {summary.pending <= 0 &&
                          summary.totalWork > 0
                          ? "PAID"
                          : summary.totalPaid > 0
                            ? "PARTIAL"
                            : "PENDING"}
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================
          PAYMENT MODAL
      ================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 p-3 sm:p-4">

          <div className="mx-auto flex h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}
            <div className="shrink-0 border-b border-gray-100 px-5 py-4 sm:px-6">

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-10 items-center gap-2 rounded-xl bg-gray-100 px-4 text-gray-700 font-semibold hover:bg-gray-200 cursor-pointer"
                >
                  ← Back
                </button>

                <div className="flex-1">

                  <h2 className="text-lg sm:text-2xl font-bold text-[#2E3A3F]">
                    {editingId
                      ? "Edit Payment"
                      : "Add Labour Payment"}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Record labour payment or advance.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 w-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                  ✕
                </button>

              </div>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >

              <div className="min-h-0 flex-1 overflow-y-auto">

                <div className="p-5 sm:p-6 space-y-5">

                  {/* LABOUR */}
                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Labour *
                    </label>

                    <select
                      value={formData.labourId}
                      onChange={
                        handleLabourChange
                      }
                      disabled={!!editingId}
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF] bg-white disabled:bg-gray-100"
                    >

                      <option value="">
                        SELECT LABOUR
                      </option>

                      {labours.map(
                        (labour) => (
                          <option
                            key={labour._id}
                            value={labour._id}
                          >
                            {labour.name}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* BALANCE */}
                  {formData.labourId && (
                    <div className="grid grid-cols-3 gap-3">

                      <div className="rounded-xl bg-blue-50 p-4">

                        <p className="text-xs text-blue-600 font-semibold">
                          WORK
                        </p>

                        <p className="text-lg font-bold text-blue-800 mt-1">
                          ₹{" "}
                          {formatMoney(
                            selectedSummary.totalWork
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl bg-green-50 p-4">

                        <p className="text-xs text-green-600 font-semibold">
                          PAID
                        </p>

                        <p className="text-lg font-bold text-green-800 mt-1">
                          ₹{" "}
                          {formatMoney(
                            selectedSummary.totalPaid
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl bg-orange-50 p-4">

                        <p className="text-xs text-orange-600 font-semibold">
                          PENDING
                        </p>

                        <p className="text-lg font-bold text-orange-800 mt-1">
                          ₹ {formatMoney(selectedSummary.pending)}
                        </p>

                      </div>

                    </div>
                  )}

                  {/* AMOUNT */}
                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Amount *
                    </label>

                    <div className="relative">

                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        name="amount"
                        placeholder="ENTER PAYMENT AMOUNT"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl p-3 pl-9 outline-none focus:border-[#2F9CAF]"
                      />

                    </div>

                  </div>

                  {/* PAYMENT MODE */}
                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Mode
                    </label>

                    <select
                      name="paymentMode"
                      value={
                        formData.paymentMode
                      }
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF] bg-white"
                    >

                      <option value="CASH">
                        CASH
                      </option>

                      <option value="UPI">
                        UPI
                      </option>

                      <option value="BANK">
                        BANK TRANSFER
                      </option>

                      <option value="CHEQUE">
                        CHEQUE
                      </option>

                      <option value="OTHER">
                        OTHER
                      </option>

                    </select>

                  </div>

                  {/* DATE RANGE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* START DATE */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date *
                      </label>

                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        max={formData.endDate || undefined}
                        required
                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
                      />
                    </div>

                    {/* END DATE */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date *
                      </label>

                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate || undefined}
                        required
                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
                      />
                    </div>

                    {/* PAYMENT DATE */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Payment Date *
                      </label>

                      <input
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF]"
                      />
                    </div>

                  </div>

                  {/* NOTE */}
                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Note
                    </label>

                    <textarea
                      name="note"
                      rows="3"
                      placeholder="ENTER PAYMENT NOTE..."
                      value={formData.note}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF] resize-none"
                    />

                  </div>

                </div>

              </div>

              {/* FOOTER */}
              <div className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 sm:px-6">

                <div className="flex items-center justify-between gap-3">

                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                  >
                    ← Back
                  </button>

                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-[#2F9CAF] hover:bg-[#238293] text-white font-semibold cursor-pointer disabled:opacity-60"
                    >
                      {loading
                        ? "Saving..."
                        : editingId
                          ? "Update Payment"
                          : "Save Payment"}
                    </button>

                  </div>

                </div>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default LabourPayment;