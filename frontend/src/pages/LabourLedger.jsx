import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

function LabourLedger() {
  const API =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const [labours, setLabours] =
    useState([]);

  const [selectedLabour, setSelectedLabour] =
    useState("");

  const [ledger, setLedger] =
    useState([]);

  const [labourInfo, setLabourInfo] =
    useState(null);

  const [summary, setSummary] =
    useState({
      totalWork: 0,
      totalPaid: 0,
      pending: 0,
    });

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  // =====================================
  // FORMAT MONEY
  // =====================================
  const money = (value) =>
    Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  // =====================================
  // FETCH LABOURS
  // =====================================
  const fetchLabours = async () => {
    try {
      const res = await axios.get(
        `${API}/labour`
      );

      const data =
        Array.isArray(res.data)
          ? res.data
          : res.data?.labours ||
          res.data?.data ||
          [];

      setLabours(data);
    } catch (error) {
      console.error(
        "GET LABOURS ERROR:",
        error
      );

      alert(
        "Unable to load labour list."
      );
    }
  };

  // =====================================
  // FETCH LEDGER
  // =====================================
  const fetchLedger = async (
    labourId
  ) => {
    if (!labourId) {
      setLedger([]);
      setLabourInfo(null);

      setSummary({
        totalWork: 0,
        totalPaid: 0,
        pending: 0,
      });

      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/labour-ledger/${labourId}`
      );

      setLabourInfo(
        res.data?.labour || null
      );

      setSummary(
        res.data?.summary || {
          totalWork: 0,
          totalPaid: 0,
          pending: 0,
        }
      );

      setLedger(
        res.data?.ledger || []
      );
    } catch (error) {
      console.error(
        "GET LABOUR LEDGER ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Unable to load labour ledger."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabours();
  }, []);

  useEffect(() => {
    fetchLedger(selectedLabour);
  }, [selectedLabour]);

  // =====================================
  // FILTER LEDGER
  // =====================================
  const filteredLedger = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return ledger;
    }

    return ledger.filter((entry) =>
      [
        entry.description,
        entry.productName,
        entry.type,
        entry.paymentMode,
        entry.note,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [ledger, search]);

  // =====================================
  // PRINT LEDGER
  // =====================================
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">

      {/* =================================
          HEADER
      ================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#2E3A3F]">
            Labour Ledger
          </h1>

          <p className="text-gray-500 mt-1">
            Complete labour work and payment history.
          </p>

        </div>

        <button
          onClick={handlePrint}
          disabled={!selectedLabour}
          className="px-5 py-3 rounded-xl bg-[#2F9CAF] hover:bg-[#238293] text-white font-semibold disabled:opacity-50 cursor-pointer"
        >
          🖨 Print Ledger
        </button>

      </div>

      {/* =================================
          SELECT LABOUR
      ================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Labour
        </label>

        <select
          value={selectedLabour}
          onChange={(e) =>
            setSelectedLabour(
              e.target.value
            )
          }
          className="w-full md:max-w-xl border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2F9CAF] bg-white"
        >

          <option value="">
            SELECT LABOUR
          </option>

          {labours.map((labour) => (
            <option
              key={labour._id}
              value={labour._id}
            >
              {labour.name}
              {labour.workType
                ? ` - ${labour.workType}`
                : ""}
            </option>
          ))}

        </select>

      </div>

      {/* =================================
          EMPTY STATE
      ================================= */}
      {!selectedLabour && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">

          <div className="text-5xl mb-4">
            📒
          </div>

          <h2 className="text-xl font-bold text-gray-700">
            Select a Labour
          </h2>

          <p className="text-gray-400 mt-2">
            Select a labour to view the complete ledger.
          </p>

        </div>
      )}

      {/* =================================
          LEDGER
      ================================= */}
      {selectedLabour && (
        <>
          {/* LABOUR HEADER */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold text-[#2E3A3F]">
                  {labourInfo?.name ||
                    "Labour"}
                </h2>

                <p className="text-gray-500 mt-1">
                  {labourInfo?.workType ||
                    "Labour"}
                  {labourInfo?.mobile
                    ? ` • ${labourInfo.mobile}`
                    : ""}
                </p>

              </div>

              <div
                className={`px-4 py-2 rounded-xl text-sm font-bold ${summary.pending <= 0 &&
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
              </div>

            </div>

          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* WORK */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

              <p className="text-sm text-gray-500">
                Total Work
              </p>

              <h2 className="text-2xl font-bold text-[#2E3A3F] mt-1">
                ₹ {money(summary.totalWork)}
              </h2>

            </div>

            {/* PAID */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

              <p className="text-sm text-gray-500">
                Total Paid
              </p>

              <h2 className="text-2xl font-bold text-green-600 mt-1">
                ₹ {money(summary.totalPaid)}
              </h2>

            </div>

            {/* PENDING */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

              <p className="text-sm text-gray-500">
                Pending Amount
              </p>

              <h2 className="text-2xl font-bold text-orange-600 mt-1">
                ₹ {money(summary.pending)}
              </h2>

            </div>

          </div>

          {/* SEARCH */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

            <input
              type="text"
              placeholder="Search design, work, payment, note..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#2F9CAF]"
            />

          </div>

          {/* LEDGER TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100">

              <h2 className="text-lg font-bold text-[#2E3A3F]">
                Account Ledger
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="min-w-[1050px] w-full">

                <thead className="bg-[#F7F9FA] border-b border-gray-200">

                  <tr>

                    <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Date
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Description
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Type
                    </th>

                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Debit
                    </th>

                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Credit
                    </th>

                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase">
                      Balance
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="text-center py-16 text-gray-400"
                      >
                        Loading ledger...
                      </td>

                    </tr>

                  ) : filteredLedger.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="text-center py-16"
                      >

                        <div className="text-4xl mb-3">
                          📭
                        </div>

                        <p className="font-semibold text-gray-600">
                          No ledger entries found
                        </p>

                      </td>

                    </tr>

                  ) : (

                    filteredLedger.map(
                      (entry) => (
                        <tr
                          key={`${entry.type}-${entry._id}`}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >

                          <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                            {entry.date
                              ? new Date(
                                entry.date
                              ).toLocaleDateString(
                                "en-IN"
                              )
                              : "-"}
                          </td>

                          <td className="px-5 py-4">

                            <div className="font-semibold text-gray-800">
                              {entry.description}
                            </div>

                            {entry.productName && (
                              <div className="text-xs text-gray-400 mt-1">
                                {entry.productName}
                              </div>
                            )}

                            {entry.quantity > 0 && (
                              <div className="text-xs text-gray-400 mt-1">
                                {entry.quantity} pcs × ₹
                                {money(
                                  entry.rate
                                )}
                              </div>
                            )}

                            {entry.note && (
                              <div className="text-xs text-gray-400 mt-1">
                                {entry.note}
                              </div>
                            )}

                          </td>

                          <td className="px-5 py-4">

                            {entry.type ===
                              "WORK" ? (
                              <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold">
                                WORK
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold">
                                PAYMENT
                              </span>
                            )}

                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-orange-600">
                            {entry.debit > 0
                              ? `₹ ${money(
                                entry.debit
                              )}`
                              : "-"}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-green-600">
                            {entry.credit > 0
                              ? `₹ ${money(
                                entry.credit
                              )}`
                              : "-"}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-gray-800">
                            ₹{" "}
                            {money(
                              entry.balance
                            )}
                          </td>

                        </tr>
                      )
                    )

                  )}

                </tbody>

                {/* TOTAL */}
                {filteredLedger.length > 0 && (
                  <tfoot>

                    <tr className="bg-gray-50 border-t-2 border-gray-200">

                      <td
                        colSpan="3"
                        className="px-5 py-5 font-bold text-gray-800"
                      >
                        TOTAL
                      </td>

                      <td className="px-5 py-5 text-right font-bold text-orange-600">
                        ₹{" "}
                        {money(
                          summary.totalWork
                        )}
                      </td>

                      <td className="px-5 py-5 text-right font-bold text-green-600">
                        ₹{" "}
                        {money(
                          summary.totalPaid
                        )}
                      </td>

                      <td className="px-5 py-5 text-right font-bold text-[#2E3A3F]">
                        ₹{" "}
                        {money(
                          summary.pending
                        )}
                      </td>

                    </tr>

                  </tfoot>
                )}

              </table>

            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default LabourLedger;