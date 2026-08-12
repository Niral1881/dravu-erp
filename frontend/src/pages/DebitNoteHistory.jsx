import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DebitNoteHistory() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [debitNotes, setDebitNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchDebitNotes = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API}/debit-notes`
        );

        if (!cancelled) {
          setDebitNotes(res.data || []);
        }

      } catch (error) {
        console.error(
          "Debit Note History Error:",
          error
        );

        if (!cancelled) {
          alert(
            error.response?.data?.message ||
            "Failed to load Debit Note History"
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDebitNotes();

    return () => {
      cancelled = true;
    };
  }, [API]);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Debit Note?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API}/debit-notes/${id}`
      );

      setDebitNotes((prev) =>
        prev.filter(
          (note) => note._id !== id
        )
      );

      alert("Debit Note deleted successfully");
    } catch (error) {
      console.error(
        "Delete debit note error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete Debit Note"
      );
    }
  };

  const filteredNotes = debitNotes.filter(
    (note) => {
      const value =
        search.toLowerCase();

      return (
        note.debitNoteNo
          ?.toLowerCase()
          .includes(value) ||
        note.supplierName
          ?.toLowerCase()
          .includes(value)
      );
    }
  );

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-GB"
    );
  };

  const getRoundOff = (note) => {
    const total = Number(
      note.subtotal || 0
    ) + Number(
      note.gstAmount || 0
    );

    const rounded =
      note.roundedTotal != null
        ? Number(note.roundedTotal)
        : Math.ceil(total);

    return Number(
      (rounded - total).toFixed(2)
    );
  };

  const getFinalTotal = (note) => {
    if (note.roundedTotal != null) {
      return Number(note.roundedTotal);
    }

    return Math.ceil(
      Number(note.subtotal || 0) +
      Number(note.gstAmount || 0)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Purchase Debit Note History
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all purchase party debit notes
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/debit-note")
            }
            className="px-5 py-3 bg-[#2F9CAF] text-white rounded-lg hover:bg-[#25899b]"
          >
            + New Debit Note
          </button>

        </div>

        {/* SEARCH */}

        <div className="bg-white rounded-xl shadow-sm p-5 mb-5">

          <input
            type="text"
            placeholder="SEARCH DEBIT NOTE OR PURCHASE PARTY..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

        </div>

        {/* TABLE */}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Loading Debit Note History...
            </div>

          ) : filteredNotes.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No Debit Notes Found
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-800 text-white">

                  <tr>

                    <th className="px-4 py-3 text-left">
                      No.
                    </th>

                    <th className="px-4 py-3 text-left">
                      Debit Note
                    </th>

                    <th className="px-4 py-3 text-left">
                      Date
                    </th>

                    <th className="px-4 py-3 text-left">
                      Purchase Party
                    </th>

                    <th className="px-4 py-3 text-right">
                      Subtotal
                    </th>

                    <th className="px-4 py-3 text-right">
                      GST
                    </th>

                    <th className="px-4 py-3 text-right">
                      Round Off
                    </th>

                    <th className="px-4 py-3 text-right">
                      Debit Total
                    </th>

                    <th className="px-4 py-3 text-center">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredNotes.map(
                    (note, index) => (

                      <tr
                        key={note._id}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="px-4 py-3">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          {note.debitNoteNo}
                        </td>

                        <td className="px-4 py-3">
                          {formatDate(note.date)}
                        </td>

                        <td className="px-4 py-3 font-medium">
                          {note.supplierName}
                        </td>

                        <td className="px-4 py-3 text-right">
                          ₹{" "}
                          {Number(
                            note.subtotal || 0
                          ).toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-right">
                          ₹{" "}
                          {Number(
                            note.gstAmount || 0
                          ).toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-right">
                          ₹{" "}
                          {getRoundOff(
                            note
                          ).toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-right font-bold">
                          ₹{" "}
                          {getFinalTotal(
                            note
                          ).toFixed(2)}
                        </td>

                        <td className="px-4 py-3">

                          <div className="flex justify-center gap-2">

                            {/* VIEW / PRINT */}

                            <button
                              onClick={() =>
                                navigate(
                                  `/debit-note-print/${note._id}`
                                )
                              }
                              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              View
                            </button>

                            {/* EDIT */}

                            <button
                              onClick={() =>
                                navigate(
                                  `/debit-note/edit/${note._id}`
                                )
                              }
                              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                              Edit
                            </button>

                            {/* DELETE */}

                            <button
                              onClick={() =>
                                handleDelete(
                                  note._id
                                )
                              }
                              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default DebitNoteHistory;